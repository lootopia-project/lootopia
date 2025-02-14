import { View, Text, TextInput, Switch, TouchableOpacity } from "react-native";
import { ExclamationCircleIcon } from "react-native-heroicons/solid";
import { useLanguage } from "@/hooks/providers/LanguageProvider";

const FormEditUser = ({ infoEditUser, handleChange, handleFileChange, setModalVisible, submit }) => {
    const { i18n } = useLanguage();

    return (
        <View className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            {/* Upload Image */}
            <TouchableOpacity onPress={handleFileChange} className="flex justify-center items-center mt-4">
                <View style={{ width: 80, height: 80, backgroundColor: '#E5E7EB', borderRadius: 40, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
                    {infoEditUser.img ? (
                        <img src={infoEditUser.img} alt="user" className="w-80 h-80 rounded-full" />
                    ) : (
                        <Text>{i18n.t("Upload Image")}</Text>
                    )}
                </View>
            </TouchableOpacity>

            {/* Email */}
            <View className="flex flex-row items-center mb-4">
                <Text className="mb-1 font-semibold mr-2">{i18n.t("Email")}</Text>
                {!infoEditUser.checkMail && <ExclamationCircleIcon className="w-5 h-5 text-red-500" />}
            </View>
            <TextInput className="bg-white p-3 rounded-lg mb-4" value={infoEditUser.email} onChangeText={(text) => handleChange("email", text)} placeholder="Email" keyboardType="email-address" />

            {/* Name */}
            <Text className="mb-1 font-semibold">{i18n.t("Name")}</Text>
            <TextInput className="bg-white p-3 rounded-lg mb-4" value={infoEditUser.name} onChangeText={(text) => handleChange("name", text)} placeholder="Name" />

            {/* Surname */}
            <Text className="mb-1 font-semibold">{i18n.t("Surname")}</Text>
            <TextInput className="bg-white p-3 rounded-lg mb-4" value={infoEditUser.surname} onChangeText={(text) => handleChange("surname", text)} placeholder="Surname" />

            {/* Nickname */}
            <Text className="mb-1 font-semibold">{i18n.t("Nickname")}</Text>
            <TextInput className="bg-white p-3 rounded-lg mb-4" value={infoEditUser.nickname} onChangeText={(text) => handleChange("nickname", text)} placeholder="Nickname" />

            {/* Phone */}
            <Text className="mb-1 font-semibold">{i18n.t("Phone")}</Text>
            <TextInput className="bg-white p-3 rounded-lg mb-4" value={String(infoEditUser.phone)} onChangeText={(text) => handleChange("phone", text)} placeholder="Phone" keyboardType="numeric" />

            {/* Language Switch */}
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

            {/* Change Password */}
            <TouchableOpacity className="mb-4" onPress={() => setModalVisible(true)}>
                <Text className="text-blue-500 underline text-center">{i18n.t("Change Password")}</Text>
            </TouchableOpacity>

            {/* Submit Button */}
            <TouchableOpacity className="bg-blue-500 p-4 rounded-lg mt-4" onPress={() => submit()}>
                <Text className="text-white text-center">{i18n.t("Save Changes")}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default FormEditUser;
