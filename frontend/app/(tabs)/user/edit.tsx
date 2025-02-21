import { useEffect, useState} from "react";
import {Text, ScrollView, View} from "react-native";
import InfoEditUser from "@/type/feature/user/InfoEditUser";
import {getInfoUser, updateInfoUser, updatePassword} from "@/services/UsersService";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import * as ImagePicker from "expo-image-picker";
import Return from "@/type/request/return";
import Success from "@/components/Success";
import ModalChangePassword from "@/components/user/ModalChangePassword";
import FormEditUser from "@/components/user/FormEditUser";
import { useErrors } from "@/hooks/providers/ErrorProvider";
const EditUser = () => {
    const { i18n,changeLanguage } = useLanguage();
    const [isModalVisible, setModalVisible] = useState(false);
    const [isSuccessVisible, setSuccessVisible] = useState(false);
    const { setErrorVisible, setErrorMessage } = useErrors();
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
                setErrorMessage(i18n.t("An error occurred while fetching data"));
                setErrorVisible(true);
            }
        };

        fetchData()
    }, [i18n, setErrorMessage, setErrorVisible]);

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
        handleResponse(response);
    }

    const changePasswordSubmit = async () => {

        const response:Return=await updatePassword(changePassword.currentPassword, changePassword.newPassword);
        handleResponse(response);
    }

    const handleResponse = (response: Return) => {       
        if (response.success) {
            changeLanguage(infoEditUser.lang);
        }
        setMessage(response.message);
        setErrorMessage(response.message);
        setErrorVisible(!response.success);
    };

        return (
            <>
            <ScrollView
                className="p-6 bg-gray-100"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <Text className="text-2xl font-bold mb-4 text-center">{i18n.t("Edit User")}</Text>

                <View className="w-full flex justify-center items-center">
                    <FormEditUser
                        infoEditUser={infoEditUser}
                        handleChange={handleChange}
                        handleFileChange={handleFileChange}
                        setModalVisible={setModalVisible}
                        submit={submit}
                    />
                </View>

                <ModalChangePassword
                    isVisible={isModalVisible}
                    onClose={() => setModalVisible(false)}
                    onChange={(name: string, value: string) =>
                        setChangePassword(prevState => ({ ...prevState, [name]: value }))
                    }
                    onSubmit={changePasswordSubmit}
                    changePassword={changePassword}
                />

                <Success visible={isSuccessVisible} onClose={() => setSuccessVisible(false)} successMessage={message} />
            </ScrollView>

            </>
        );
};

export default EditUser;
