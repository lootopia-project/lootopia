import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Modal,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "react-native";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { forgotPassword } from "@/services/AuthService";
import { useErrors } from "@/hooks/providers/ErrorProvider";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { i18n,locale } = useLanguage();
  const router = useRouter();
  const { setErrorVisible, setErrorMessage } = useErrors();
  

  const handleForgotPassword = async () => {
    if (!email) {
      return;
    }

    setLoading(true);
    try {
        const result =await forgotPassword(email,locale);

        if (result.success) {
            setModalVisible(true);
        }else{
            setErrorMessage(result.message);
            setErrorVisible(true);
        }
    } catch (error) {
        setErrorMessage("An error occurred while fetching data");
        setErrorVisible(true);
      }
    setLoading(false);
  };

  return (
    <ImageBackground
      style={{ flex: 1, backgroundColor: themeColors.background }}
      source={{ uri: "https://lootopia.blob.core.windows.net/lootopia-photos/map_background.png" }}
      resizeMode="cover"
    >
      <ScrollView
        style={{ flex: 1, minHeight: "100%" }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center items-center p-5">
          <View className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <Text className="text-2xl font-bold text-center mb-5" style={{ color: "white" }}>
              {i18n.t("Forgot Password")}
            </Text>

            <View className="mb-4">
              <Text className="text-lg mb-2" style={{ color: "white" }}>
                {i18n.t("Enter your email")}
              </Text>
              <TextInput
                className="border rounded-lg p-3 text-base"
                style={{
                  borderColor: themeColors.icon,
                  color: "white",
                  backgroundColor: themeColors.background,
                }}
                placeholder={i18n.t("email")}
                placeholderTextColor={themeColors.icon}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              className="py-4 rounded-lg"
              style={{ backgroundColor: "#C59B5F" }}
              onPress={handleForgotPassword}
              disabled={loading}
            >
              <Text
                className="text-center text-white text-lg font-bold"
                style={{ color: themeColors.background }}
              >
                {loading ? i18n.t("Sending") : i18n.t("Send")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push("/login")} className="mt-5">
              <Text className="text-center text-base underline" style={{ color: themeColors.tint }}>
                {i18n.t("Back to login")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg shadow-lg w-4/5">
            <Text className="text-lg font-bold text-center mb-4">
              {i18n.t("Email Sent")}
            </Text>
            <Text className="text-center text-gray-700">
              {i18n.t("A password reset link has been sent to")} {email}.
            </Text>
            <TouchableOpacity
              className="mt-5 py-3 bg-blue-500 rounded-lg"
              onPress={() => {
                setModalVisible(false);
                router.push("/login");
              }}
            >
              <Text className="text-center text-white font-bold">
                {i18n.t("Back to login")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

export default ForgotPassword;
