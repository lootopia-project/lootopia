import React, { useState } from "react";
import { Link } from "expo-router";
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Keyboard, useColorScheme
} from 'react-native';
import { registerUser } from "@/services/AuthService";
import { validatePassword } from "@/constants/validatePassword";
import AXIOS_ERROR from "@/type/request/axios_error";
import AboutPassword from "@/components/AboutPassword";
import { Colors } from "@/constants/Colors";
import {useErrors} from "@/hooks/providers/ErrorProvider";
import { useLanguage } from "@/hooks/providers/LanguageProvider";


export default function RegisterPage() {
  const [success, setSuccess] = useState("");
  const colorScheme = useColorScheme();
  const themeColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const {setErrorVisible, setErrorMessage} = useErrors();
  const { i18n } = useLanguage();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    R_PASSWORD: ""
  });

  const [checkPassword, setCheckPassword] = useState({
    length: false,
    maj: false,
    min: false,
    special: false,
    same: false
  });

  const handleChange = (key: keyof typeof formData, value: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [key]: value
    }));

    const newFormData = {
      ...formData,
      [key]: value
    };

    const passwordErrors = {
      length: newFormData.password.length >= 10 || newFormData.R_PASSWORD.length >= 10,
      maj: /[A-Z]/u.test(newFormData.password) || /[A-Z]/u.test(newFormData.R_PASSWORD),
      min: /[a-z]/u.test(newFormData.password) || /[a-z]/u.test(newFormData.R_PASSWORD),
      special: /[!@#$%^&*(),.?":{}|<>]/u.test(newFormData.password) || /[!@#$%^&*(),.?":{}|<>]/u.test(newFormData.R_PASSWORD),
      same: newFormData.password === newFormData.R_PASSWORD
    };

    setCheckPassword(passwordErrors);
  };

  const handleLogin = async () => {
    const passwordErrors = validatePassword(formData);
    setCheckPassword(passwordErrors);

    if (passwordErrors.length && passwordErrors.maj && passwordErrors.min && passwordErrors.special && passwordErrors.same) {
      try {
        const response = await registerUser({ email: formData.username, password: formData.password });
        setSuccess("");
        setErrorMessage(response.message);


        if (response.message === true) {
          setSuccess(i18n.t("Registration successful!"));
          setErrorMessage("");
        }
        else{
          setErrorVisible(true);
        }
      } catch (error) {
        handleSavePasswordError(error);
      }
    } else {      
      setErrorMessage(i18n.t("Password does not meet the requirements"));
      setErrorVisible(true);
    }
  };

  const handleSavePasswordError = (err: unknown) => {
    if ((err as AXIOS_ERROR).message) {
      setErrorMessage((err as AXIOS_ERROR).message || "Error connecting");
    } else {
      setErrorMessage(i18n.t("Error connecting"));
    }
    setErrorVisible(true);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>


      <View style={styles.formContainer}>
        <Text style={styles.title}>{(i18n.t("Register"))}</Text>

        {success ? <Text style={styles.successText}>{success}</Text> : null}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{i18n.t("Username")}</Text>
          <TextInput
            style={styles.input}
            placeholder={i18n.t("Username")}
            placeholderTextColor={themeColors.icon}
            value={formData.username || ""}
            onChangeText={(text) => handleChange("username", text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{i18n.t("password")}</Text>
          <TextInput
            style={styles.input}
            placeholder={i18n.t("password")}
            placeholderTextColor={themeColors.icon}
            secureTextEntry
            value={formData.password || ""}
            onChangeText={(text) => handleChange("password", text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{i18n.t("Repeat Password")}</Text>
          <TextInput
            style={styles.input}
            placeholder={i18n.t("Repeat Password")}
            placeholderTextColor={themeColors.icon}
            secureTextEntry
            value={formData.R_PASSWORD || ""}
            onChangeText={(text) => handleChange("R_PASSWORD", text)}
          />
        </View>

        <TouchableOpacity style={styles.button} onPress={() => {
          Keyboard.dismiss();
          handleLogin();
        }}>
          <Text style={styles.buttonText}>{i18n.t("Sign up")}</Text>
        </TouchableOpacity>

        <View style={styles.passwordValidation}>
          {AboutPassword(checkPassword)}
        </View>

        <Link href={"/login"} style={styles.link}>{i18n.t("Already have an account? Sign in")}</Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '90%',
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: Colors.light.text,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: Colors.light.text,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.icon,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#fff',
    color: Colors.light.text,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  passwordValidation: {
    marginTop: 20,
  },
  validText: {
    color: Colors.light.success,
    fontSize: 14,
  },
  errorText: {
    color: Colors.light.error,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  successText: {
    color: Colors.light.success,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  link: {
    marginTop: 20,
    color: Colors.light.tint,
    textAlign: "center",
    fontSize: 16,
    textDecorationLine: 'underline',
  },
};
