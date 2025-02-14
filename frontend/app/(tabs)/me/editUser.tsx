import {ChangeEvent, useEffect, useState} from "react";
import { View, Text, TextInput, Switch, TouchableOpacity, Modal, ScrollView } from "react-native";
import { ExclamationCircleIcon } from "react-native-heroicons/solid";
import InfoEditUser from "@/type/feature/user/InfoEditUser";
import {getInfoUser, updateInfoUser, updatePassword} from "@/services/UsersService";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import * as ImagePicker from "expo-image-picker";
import Return from "@/type/request/return";
import validatePassword from "@/constants/validatePassword";

const EditUser = () => {
    const { i18n } = useLanguage();
    const [response, setResponse] = useState<Return>();
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
    const [isModalVisible, setModalVisible] = useState(false);
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
        setResponse(response);
    }

    const changePasswordSubmit = async () => {
        console.log(changePassword);

        const response:Return=await updatePassword(changePassword.currentPassword, changePassword.newPassword);
        console.log(response);
    }

    const validation = validatePassword({ password:changePassword.newPassword, R_PASSWORD:changePassword.confirmPassword });


        return (
        <ScrollView className="p-6 bg-gray-100 min-h-screen" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 50 }}>
            <Text className="text-2xl font-bold mb-4">{i18n.t("Edit User")}</Text>
            <View className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <TouchableOpacity onPress={handleFileChange} className="flex justify-center items-center mt-4">
                    <View style={{ width: 80, height: 80, backgroundColor: '#E5E7EB', borderRadius: 40, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
                        {infoEditUser.img ? (
                            <img src={infoEditUser.img} alt="user" className="w-80 h-80 rounded-full" />
                            ) : (
                            <Text>{i18n.t("Upload Image")}</Text>
                            )}
                    </View>
                </TouchableOpacity>

                <View className="flex flex-row items-center mb-4">
                    <Text className="mb-1 font-semibold mr-2">{i18n.t("Email")}</Text>
                    {!infoEditUser.checkMail && <ExclamationCircleIcon className="w-5 h-5 text-red-500" />}
                </View>
                <TextInput className="bg-white p-3 rounded-lg mb-4" value={infoEditUser.email} onChangeText={(text) => handleChange("email", text)} placeholder="Email" keyboardType="email-address" />


                <Text className="mb-1 font-semibold">{i18n.t("Name")}</Text>
                <TextInput className="bg-white p-3 rounded-lg mb-4" value={infoEditUser.name} onChangeText={(text) => handleChange("name", text)} placeholder="Name" />

                <Text className="mb-1 font-semibold">{i18n.t("Surname")}</Text>
                <TextInput className="bg-white p-3 rounded-lg mb-4" value={infoEditUser.surname} onChangeText={(text) => handleChange("surname", text)} placeholder="Surname" />

                <Text className="mb-1 font-semibold">{i18n.t("Nickname")}</Text>
                <TextInput className="bg-white p-3 rounded-lg mb-4" value={infoEditUser.nickname} onChangeText={(text) => handleChange("nickname", text)} placeholder="Nickname" />

                <Text className="mb-1 font-semibold">{i18n.t("Phone")}</Text>
                <TextInput className="bg-white p-3 rounded-lg mb-4" value={String(infoEditUser.phone)} onChangeText={(text) => handleChange("phone", text)} placeholder="Phone" keyboardType="numeric" />

                <Text className="mb-1 font-semibold">
                    {i18n.t("Language")}: {infoEditUser.lang === "fr" ? "Français" : "English"}
                </Text>
                <Switch
                    value={infoEditUser.lang === "fr"}
                    onValueChange={(value) => handleChange("lang", value ? "fr" : "en")}
                />
                <Text className="mb-1 font-semibold ml-2">
                    {infoEditUser.lang === "fr" ? "→ English" : "→ Français"}
                </Text>

                <TouchableOpacity className="mb-4" onPress={() => setModalVisible(true)}>
                    <Text className="text-blue-500 underline text-center">{i18n.t("Change Password")}</Text>
                </TouchableOpacity>

                <TouchableOpacity className="bg-blue-500 p-4 rounded-lg mt-4" onPress={() => submit()}>
                    <Text className="text-white text-center">{i18n.t("Save Changes")}</Text>
                </TouchableOpacity>
            </View>

            <Modal visible={isModalVisible} transparent={true} animationType="slide">
                <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                    <View className="bg-white p-6 rounded-lg w-80">
                        <Text className="text-lg font-semibold mb-4">{i18n.t("Change Password")}</Text>
                        <TextInput className="bg-gray-100 p-3 rounded-lg mb-4" placeholder={i18n.t("Current Password")} secureTextEntry={true} value={changePassword.currentPassword} onChangeText={(text) => setChangePassword({ ...changePassword, currentPassword: text })} />
                        <TextInput className="bg-gray-100 p-3 rounded-lg mb-4" placeholder={i18n.t("New Password")} secureTextEntry={true} value={changePassword.newPassword} onChangeText={(text) => setChangePassword({ ...changePassword, newPassword: text })} />
                        <TextInput className="bg-gray-100 p-3 rounded-lg mb-4" placeholder={i18n.t("Confirm Password")} secureTextEntry={true} value={changePassword.confirmPassword} onChangeText={(text) => setChangePassword({ ...changePassword, confirmPassword: text })} />

                        <View className="bg-white p-4 rounded-lg shadow-md mb-4">
                            <Text className={validation.length ? "text-green-500" : "text-red-500"}>✅ {i18n.t("At least 10 characters")}</Text>
                            <Text className={validation.maj ? "text-green-500" : "text-red-500"}>✅ {i18n.t("At least one uppercase letter")}</Text>
                            <Text className={validation.min ? "text-green-500" : "text-red-500"}>✅ {i18n.t("At least one lowercase letter")}</Text>
                            <Text className={validation.special ? "text-green-500" : "text-red-500"}>✅ {i18n.t("At least one special character")}</Text>
                            <Text className={validation.same ? "text-green-500" : "text-red-500"}>✅ {i18n.t("Passwords match")}</Text>
                        </View>

                        <TouchableOpacity className="bg-blue-500 p-3 rounded-lg mb-2" onPress={() => changePasswordSubmit()}>
                            <Text className="text-white text-center">{i18n.t("Confirm")}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className="p-3 rounded-lg" onPress={() => setModalVisible(false)}>
                            <Text className="text-red-500 text-center">{i18n.t("Cancel")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default EditUser;
