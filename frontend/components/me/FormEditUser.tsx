import { View, Text, TextInput, Switch, TouchableOpacity } from "react-native";
import { ExclamationCircleIcon } from "react-native-heroicons/solid";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import {Picker} from "@react-native-picker/picker";

const FormEditUser = ({ infoEditUser, handleChange, handleFileChange, setModalVisible, submit }) => {
    const { i18n } = useLanguage();

    return (
        <View className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl flex flex-col items-center text-center">
            <TouchableOpacity onPress={handleFileChange} className="flex justify-center items-center mt-4">
                <View style={{ width: 100, height: 100, backgroundColor: '#E5E7EB', borderRadius: 50, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
                    {infoEditUser.img ? (
                        <img src={infoEditUser.img} alt="user" className="w-24 h-24 rounded-full border-2 border-gray-300" />
                    ) : (
                        <Text className="text-gray-500">{i18n.t("Upload Image")}</Text>
                    )}
                </View>
            </TouchableOpacity>

            <View className="grid grid-cols-2 sm:grid-cols-1 gap-6 w-full mt-6">
                <Text className="mb-1 font-semibold flex flex-row items-center">
                    {i18n.t("Email")}
                    {!infoEditUser.checkMail && <ExclamationCircleIcon className="w-5 h-5 text-red-500 ml-2" />}
                </Text>
                <TextInput
                    className="bg-gray-100 border border-gray-300 p-3 rounded-lg w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                    value={infoEditUser.email}
                    onChangeText={(text) => handleChange("email", text)}
                    placeholder="Email"
                    keyboardType="email-address"
                />
            </View>

            <View className="grid grid-cols-2 sm:grid-cols-1 gap-6 w-full mt-6">
                <View>
                    <Text className="mb-1 font-semibold">{i18n.t("Name")}</Text>
                    <TextInput
                        className="bg-gray-100 border border-gray-300 p-3 rounded-lg w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                        value={infoEditUser.name}
                        onChangeText={(text) => handleChange("name", text)}
                        placeholder="Name"
                    />
                </View>

                <View>
                    <Text className="mb-1 font-semibold">{i18n.t("Surname")}</Text>
                    <TextInput
                        className="bg-gray-100 border border-gray-300 p-3 rounded-lg w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                        value={infoEditUser.surname}
                        onChangeText={(text) => handleChange("surname", text)}
                        placeholder="Surname"
                    />
                </View>

                <View>
                    <Text className="mb-1 font-semibold">{i18n.t("Nickname")}</Text>
                    <TextInput
                        className="bg-gray-100 border border-gray-300 p-3 rounded-lg w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                        value={infoEditUser.nickname}
                        onChangeText={(text) => handleChange("nickname", text)}
                        placeholder="Nickname"
                    />
                </View>

                <View>
                    <Text className="mb-1 font-semibold">{i18n.t("Phone")}</Text>
                    <TextInput
                        className="bg-gray-100 border border-gray-300 p-3 rounded-lg w-full focus:border-blue-500 focus:ring-2 focus:ring-blue-300"
                        value={String(infoEditUser.phone)}
                        onChangeText={(text) => handleChange("phone", text)}
                        placeholder="Phone"
                        keyboardType="numeric"
                    />
                </View>
            </View>

            <View className="w-full mt-6">
                <Text className="font-semibold mb-2">{i18n.t("Language")}</Text>
                <View className="border border-gray-300 rounded-lg bg-gray-100">
                    <Picker
                        selectedValue={infoEditUser.lang}
                        onValueChange={(value) => handleChange("lang", value)}
                        style={{ height: 50 }}
                    >
                        <Picker.Item label={i18n.t('English')} value="en" />
                        <Picker.Item label={i18n.t('French')}value="fr" />
                    </Picker>
                </View>
            </View>

            <TouchableOpacity className="mt-6" onPress={() => setModalVisible(true)}>
                <Text className="text-blue-500 underline text-center">{i18n.t("Change Password")}</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-blue-500 p-4 rounded-lg mt-6 w-full" onPress={() => submit()}>
                <Text className="text-white text-center">{i18n.t("Save Changes")}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default FormEditUser;
