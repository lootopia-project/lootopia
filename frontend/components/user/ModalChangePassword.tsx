import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import validatePassword from "@/constants/validatePassword";

const ModalChangePassword = ({ isVisible, onClose, onChange, onSubmit, changePassword }) => {
    const { i18n } = useLanguage();
    const validation = validatePassword({ password: changePassword.newPassword, R_PASSWORD: changePassword.confirmPassword });
    const isPasswordValid = Object.values(validation).every(Boolean);

    return (
        <Modal visible={isVisible} transparent={true} animationType="slide">
            <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
                <View className="bg-white p-6 rounded-lg w-80">
                    <Text className="text-lg font-semibold mb-4">{i18n.t("Change Password")}</Text>
                    <TextInput className="bg-gray-100 p-3 rounded-lg mb-4" placeholder={i18n.t("Current Password")} secureTextEntry={true} value={changePassword.currentPassword} onChangeText={(text) => onChange("currentPassword", text)} />
                    <TextInput className="bg-gray-100 p-3 rounded-lg mb-4" placeholder={i18n.t("New Password")} secureTextEntry={true} value={changePassword.newPassword} onChangeText={(text) => onChange("newPassword", text)} />
                    <TextInput className="bg-gray-100 p-3 rounded-lg mb-4" placeholder={i18n.t("Confirm Password")} secureTextEntry={true} value={changePassword.confirmPassword} onChangeText={(text) => onChange("confirmPassword", text)} />

                    <View className="bg-white p-4 rounded-lg shadow-md mb-4">
                        <Text className={validation.length ? "text-green-500" : "text-red-500"}>✅ {i18n.t("At least 10 characters")}</Text>
                        <Text className={validation.maj ? "text-green-500" : "text-red-500"}>✅ {i18n.t("At least one uppercase letter")}</Text>
                        <Text className={validation.min ? "text-green-500" : "text-red-500"}>✅ {i18n.t("At least one lowercase letter")}</Text>
                        <Text className={validation.special ? "text-green-500" : "text-red-500"}>✅ {i18n.t("At least one special character")}</Text>
                        <Text className={validation.same ? "text-green-500" : "text-red-500"}>✅ {i18n.t("Passwords match")}</Text>
                    </View>

                    <TouchableOpacity className={`bg-blue-500 p-3 rounded-lg mb-2 ${!isPasswordValid ? 'opacity-50' : ''}`} onPress={onSubmit} disabled={!isPasswordValid}>
                        <Text className="text-white text-center">{i18n.t("Confirm")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="p-3 rounded-lg" onPress={onClose}>
                        <Text className="text-red-500 text-center">{i18n.t("Cancel")}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default ModalChangePassword;
