import { useEffect, useState} from "react";
import { Text, ScrollView } from "react-native";
import InfoEditUser from "@/type/feature/user/InfoEditUser";
import {getInfoUser, updateInfoUser, updatePassword} from "@/services/UsersService";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import * as ImagePicker from "expo-image-picker";
import Return from "@/type/request/return";
import validatePassword from "@/constants/validatePassword";
import Errors from "@/components/Errors";
import Success from "@/components/Success";
import ModalChangePassword from "@/components/me/ModalChangePassword";
import FormEditUser from "@/components/me/FormEditUser";

const EditUser = () => {
    const { i18n } = useLanguage();
    const [isModalVisible, setModalVisible] = useState(false);
    const [isSuccessVisible, setSuccessVisible] = useState(false);
    const [isErrorVisible, setErrorVisible] = useState(false);
    const [message, setMessage] = useState("");
    const [infoEditUser, setInfoEditUser] = useState<InfoEditUser>({
        id: 0,
        email: "",
        name: "",
        surname: "",
        isPartner: false,
        img: "",
        nickname: "",
        isTwoFactorEnabled: false,
        phone: 0,
        lang: "en",
        checkMail: false
    });
    const [changePassword, setChangePassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });



    useEffect(() => {
        const fetchData = async () => {
            try {
                const infoUser: InfoEditUser = await getInfoUser();
                setInfoEditUser(infoUser);
            } catch (error) {
                console.error("Erreur lors de la récupération des données :", error);
            }
        };

        fetchData().catch((error) => console.error("Erreur lors de l'exécution de fetchData :", error));
    }, []);

    const handleChange = (name: keyof InfoEditUser, value: string | boolean) => {
        setInfoEditUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setInfoEditUser(prevState => ({ ...prevState, img: result.assets[0].uri }));
        }
    };

    const submit = async () => {
        const response:Return=await updateInfoUser(infoEditUser);
        console.log(response);
        handleResponse(response);
    }

    const changePasswordSubmit = async () => {
        console.log(changePassword);

        const response:Return=await updatePassword(changePassword.currentPassword, changePassword.newPassword);
        console.log(response);
        handleResponse(response);
    }

    const handleResponse = (response: Return) => {
        setMessage(response.message);
        if (response.success) {
            setSuccessVisible(true);
            setTimeout(() => setSuccessVisible(false), 2000);
        } else {
            setErrorVisible(true);
            setTimeout(() => setErrorVisible(false), 2000);
        }
    };

        return (
        <ScrollView className="p-6 bg-gray-100 min-h-screen" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 50 }}>
            <Text className="text-2xl font-bold mb-4">{i18n.t("Edit User")}</Text>
            <FormEditUser
                infoEditUser={infoEditUser}
                handleChange={handleChange}
                handleFileChange={handleFileChange}
                setModalVisible={setModalVisible}
                submit={submit}
            />

            <ModalChangePassword
                isVisible={isModalVisible}
                onClose={() => setModalVisible(false)}
                onChange={(name: string, value: string) =>
                setChangePassword(prevState => ({ ...prevState, [name]: value }))}
                onSubmit={changePasswordSubmit}
                changePassword={changePassword}
            />
            <Success visible={isSuccessVisible} onClose={() => setSuccessVisible(false)} successMessage={message} />
            <Errors visible={isErrorVisible} onClose={() => setErrorVisible(false)} errorMessage={message} />
        </ScrollView>
    );
};

export default EditUser;
