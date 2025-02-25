import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Keyboard,
} from "react-native";
import axios from "axios";
import { SearchParams, useRouter } from "expo-router";
import { validatePassword } from "@/constants/validatePassword";
import { useErrors } from "@/hooks/providers/ErrorProvider";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import AboutPassword from "@/components/aboutPassword";

const API_URL = "https://lootopia.com/api";

const ResetPassword = () => {
  const { setErrorVisible, setErrorMessage } = useErrors();
  const { i18n } = useLanguage();
  const router = useRouter();
  const { token } = useSearchParams(); // Récupère le token depuis l'URL

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checkPassword, setCheckPassword] = useState({
    length: false,
    maj: false,
    min: false,
    special: false,
    same: false,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setMessage(i18n.t("Invalid or expired token"));
    }
  }, [token]);

  const handleChange = (key:string, value:string) => {
    if (key === "password") setPassword(value);
    if (key === "confirmPassword") setConfirmPassword(value);

    const newFormData = {
      password: key === "password" ? value : password,
      R_PASSWORD: key === "confirmPassword" ? value : confirmPassword,
    };

    const passwordErrors = {
      length: newFormData.password.length >= 10,
      maj: /[A-Z]/.test(newFormData.password),
      min: /[a-z]/.test(newFormData.password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(newFormData.password),
      same: newFormData.password === newFormData.R_PASSWORD,
    };

    setCheckPassword(passwordErrors);
  };

  const handleResetPassword = async () => {
    const passwordErrors = validatePassword({ password, R_PASSWORD: confirmPassword });
    setCheckPassword(passwordErrors);

    if (passwordErrors.length && passwordErrors.maj && passwordErrors.min && passwordErrors.special && passwordErrors.same) {
      setLoading(true);
      try {
        const response = await axios.post(`${API_URL}/reset-password`, { token, password });

        if (response.data.message === "Password updated successfully") {
          setMessage(i18n.t("Your password has been reset successfully!"));
          setTimeout(() => router.push("/login"), 3000);
        } else {
          setErrorMessage(i18n.t(response.data.message));
          setErrorVisible(true);
        }
      } catch (error) {
        setErrorMessage(i18n.t("Error resetting password"));
        setErrorVisible(true);
      }
      setLoading(false);
    } else {
      setErrorMessage(i18n.t("Password does not meet requirements"));
      setErrorVisible(true);
    }
  };

  return (
    <ImageBackground
      style={{ flex: 1 }}
      source={{ uri: "https://lootopia.blob.core.windows.net/lootopia-photos/word_background.png" }}
    >
      <ScrollView
        style={{ flex: 1, padding: 20 }}
        contentContainerStyle={{ alignItems: "center", justifyContent: "center", minHeight: "100%" }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-md">
          <Text className="text-2xl font-bold text-center mb-5 text-white">
            {i18n.t("Reset Password")}
          </Text>

          {message ? <Text className="text-sm text-green-600 text-center mb-5">{message}</Text> : null}

          {/* Champ Mot de passe */}
          <View className="mb-4">
            <Text className="text-lg text-white mb-2">{i18n.t("New Password")}</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base bg-white"
              placeholder={i18n.t("Enter new password")}
              placeholderTextColor="#d2b48c"
              secureTextEntry
              value={password}
              onChangeText={(text) => handleChange("password", text)}
            />
          </View>

          {/* Champ Confirmation de mot de passe */}
          <View className="mb-4">
            <Text className="text-lg text-white mb-2">{i18n.t("Confirm Password")}</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-base bg-white"
              placeholder={i18n.t("Confirm new password")}
              placeholderTextColor="#d2b48c"
              secureTextEntry
              value={confirmPassword}
              onChangeText={(text) => handleChange("confirmPassword", text)}
            />
          </View>

          {/* Bouton de réinitialisation */}
          <TouchableOpacity
            className="bg-yellow-500 py-3 rounded-lg"
            onPress={() => {
              Keyboard.dismiss();
              handleResetPassword();
            }}
            disabled={loading}
          >
            <Text className="text-center text-white text-lg font-bold">
              {loading ? i18n.t("Resetting...") : i18n.t("Reset Password")}
            </Text>
          </TouchableOpacity>

          {/* Indications sur le mot de passe */}
          <View className="mt-4">{AboutPassword(checkPassword)}</View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default ResetPassword;
