import React, { useState } from "react";
import { Link } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  useColorScheme,
} from "react-native";
import { registerUser } from "@/services/AuthService";
import { validatePassword } from "@/constants/validatePassword";
import { Colors } from "@/constants/Colors";
import { useErrors } from "@/hooks/providers/ErrorProvider";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import AboutPassword from "@/components/aboutPassword";

export default function RegisterPage() {
  const [success, setSuccess] = useState("");
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { setErrorVisible, setErrorMessage } = useErrors();
  const { i18n } = useLanguage();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    R_PASSWORD: "",
  });

  const [checkPassword, setCheckPassword] = useState({
    length: false,
    maj: false,
    min: false,
    special: false,
    same: false,
  });

  const handleChange = (key, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [key]: value,
    }));

    const newFormData = {
      ...formData,
      [key]: value,
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

  const handleLogin = async () => {
    const passwordErrors = validatePassword(formData);
    setCheckPassword(passwordErrors);

    if (
        passwordErrors.length &&
        passwordErrors.maj &&
        passwordErrors.min &&
        passwordErrors.special &&
        passwordErrors.same
    ) {
      try {
        const response = await registerUser({
          email: formData.username,
          password: formData.password,
        });
        setSuccess("");
        setErrorMessage(response.message);

        if (response.message === true) {
          setSuccess(i18n.t("Registration successful!"));
          setErrorMessage("");
        } else {
          setErrorVisible(true);
        }
      } catch (error) {
        setErrorMessage(i18n.t("Error connecting"));
        setErrorVisible(true);
      }
    } else {
      setErrorMessage(i18n.t("Password does not meet the requirements"));
      setErrorVisible(true);
    }
  };

  return (
      <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1 justify-center items-center bg-[#fdf5e6] p-5"
          style={{ backgroundColor: themeColors.background }}
      >
        <View className="w-11/12 bg-white p-6 rounded-lg shadow-md">
          {/* Titre */}
          <Text className="text-2xl font-bold text-center mb-5 text-brown-800">
            {i18n.t("Register")}
          </Text>

          {success ? (
              <Text className="text-sm text-green-600 text-center mb-5">{success}</Text>
          ) : null}

          {/* Champ Nom d'utilisateur */}
          <View className="mb-4">
            <Text className="text-lg text-brown-800 mb-2">{i18n.t("Username")}</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base bg-[#fdf5e6]"
                placeholder={i18n.t("Username")}
                placeholderTextColor="#d2b48c"
                value={formData.username}
                onChangeText={(text) => handleChange("username", text)}
            />
          </View>

          {/* Champ Mot de passe */}
          <View className="mb-4">
            <Text className="text-lg text-brown-800 mb-2">{i18n.t("Password")}</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base bg-[#fdf5e6]"
                placeholder={i18n.t("Password")}
                placeholderTextColor="#d2b48c"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
            />
          </View>

          {/* Champ Répéter Mot de passe */}
          <View className="mb-4">
            <Text className="text-lg text-brown-800 mb-2">{i18n.t("Repeat Password")}</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base bg-[#fdf5e6]"
                placeholder={i18n.t("Repeat Password")}
                placeholderTextColor="#d2b48c"
                secureTextEntry
                value={formData.R_PASSWORD}
                onChangeText={(text) => handleChange("R_PASSWORD", text)}
            />
          </View>

          {/* Bouton d'inscription */}
          <TouchableOpacity
              className="bg-yellow-500 py-3 rounded-lg"
              onPress={() => {
                Keyboard.dismiss();
                handleLogin();
              }}
          >
            <Text className="text-center text-white text-lg font-bold">
              {i18n.t("Sign up")}
            </Text>
          </TouchableOpacity>

          {/* Validation du mot de passe */}
          <View className="mt-4">{AboutPassword(checkPassword)}</View>

          {/* Lien de connexion */}
          <Link
              href={"/login"}
              className="mt-5 text-center text-yellow-600 underline text-base"
          >
            {i18n.t("Already have an account? Sign in")}
          </Link>
        </View>
      </KeyboardAvoidingView>
  );
}
