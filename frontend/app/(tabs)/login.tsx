import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, StyleSheet, useColorScheme } from "react-native";
import { useAuth } from "@/hooks/providers/AuthProvider";
import { useErrors } from "@/hooks/providers/ErrorProvider";
import { useRouter, Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/hooks/providers/LanguageProvider";

export default function LoginPage() {
  const { login } = useAuth();
  const { setErrorVisible, setErrorMessage } = useErrors();
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { i18n } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const check = await login({ email, password });
      if (check) {
        setErrorMessage("");
        router.push("/");
      }
    } catch (err) {
      setErrorMessage(i18n.t("Invalid email or password. Please try again."));
      setErrorVisible(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: themeColors.background }]}>
      <View style={styles.formContainer}>
        <Text style={[styles.title, { color: themeColors.text }]}>{i18n.t("Sign in")}</Text>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: themeColors.text }]}>{i18n.t("email")}</Text>
          <TextInput
            style={[styles.input, { borderColor: themeColors.icon, color: themeColors.text }]}
            placeholder={i18n.t("email")}
            placeholderTextColor={themeColors.icon}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: themeColors.text }]}>{i18n.t("password")}</Text>
          <TextInput
            style={[styles.input, { borderColor: themeColors.icon, color: themeColors.text }]}
            placeholder={i18n.t("password")}
            placeholderTextColor={themeColors.icon}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity style={[styles.button, { backgroundColor: themeColors.tint }]} onPress={handleLogin}>
          <Text style={[styles.buttonText, { color: themeColors.background }]}>{i18n.t("login")}</Text>
        </TouchableOpacity>

        <Link href={"/register"} style={[styles.link, { color: themeColors.tint }]}>
          {i18n.t("Don't have an account? Sign up")}
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  formContainer: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  button: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  link: {
    marginTop: 20,
    fontSize: 16,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});
