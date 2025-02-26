import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  ImageBackground, Image,
  GestureResponderEvent,
} from "react-native";
import {  registerUser } from "@/services/AuthService";
import { validatePassword } from "@/constants/validatePassword";
import { useErrors } from "@/hooks/providers/ErrorProvider";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import AboutPassword from "@/components/aboutPassword";

import { Platform } from "react-native";
import * as WebBrowser from 'expo-web-browser';
import { useAuth, useSSO, useUser } from '@clerk/clerk-expo'
import * as AuthSession from 'expo-auth-session'
import UsersGoogle from "@/type/feature/auth/user_google";
import {useAuth as Auth} from "@/hooks/providers/AuthProvider";



export default function RegisterPage() {
  const [success, setSuccess] = useState("");
  const { setErrorVisible, setErrorMessage } = useErrors();
  const { i18n } = useLanguage();
  const { startSSOFlow } = useSSO()
  const {loginOrRegisterGoogle } = Auth();
  const {user}=useUser()
  const {signOut}=useAuth()
  const [sendData, setSendData] = useState(false)


  useEffect(() => {
    signOut()
  }, [])

  useEffect(() => {
    const register = async () => {
      if (user && sendData) {
        const users: UsersGoogle = {
          firstName: user?.firstName||"",
          lastName: user?.lastName||"",
          email: user?.primaryEmailAddress?.emailAddress||"",
          img: user?.imageUrl||"",
          provider: "google",
          mode: "register",
        };
    
        const result = await loginOrRegisterGoogle(users);

        if (result.success) {
          setSuccess(i18n.t("Registration successful!"));
          setErrorMessage("");
        }else{
          setErrorMessage(i18n.t(result.message));
          setErrorVisible(true);
        }
        setSendData(false);
      }

    };

    register();
  }, [user, sendData]); 

  



  
  
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
      setErrorMessage(i18n.t("Password does not meet requirements"));
      setErrorVisible(true);
    }
  };

 


   const handleGoogleRegister = async (e: GestureResponderEvent) => {
    e.preventDefault();
    setSendData(true)
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl: AuthSession.makeRedirectUri(),
      })


      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      } else {
        setErrorMessage('Error connecting')
        setErrorVisible(true)
      }
    } catch (err) {

    }
  };
  

  return (
      <ImageBackground
        className="flex-1" 
        source={{ uri : "https://lootopia.blob.core.windows.net/lootopia-photos/word_background.png"}}
        >
        <ScrollView
          className="flex-1 p-5"
          contentContainerStyle={{ alignItems: "center", justifyContent: "center", minHeight: '100%',}}>
        <View className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-md">
          {/* Titre */}
          <Text className="text-2xl font-bold text-center mb-5 text-white">
            {i18n.t("Register")}
          </Text>

          {success ? (
              <Text className="text-sm text-green-600 text-center mb-5">{success}</Text>
          ) : null}

          <View className="mb-4">
            <Text className="text-lg text-white mb-2">{i18n.t("Email")}</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base bg-white"
                placeholder={i18n.t("Username")}
                placeholderTextColor="#d2b48c"
                value={formData.username}
                onChangeText={(text) => handleChange("username", text)}
            />
          </View>

          <View className="mb-4">
            <Text className="text-lg text-white mb-2">{i18n.t("Password")}</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base bg-white"
                placeholder={i18n.t("Password")}
                placeholderTextColor="#d2b48c"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
            />
          </View>

          <View className="mb-4">
            <Text className="text-lg text-white mb-2">{i18n.t("Repeat Password")}</Text>
            <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base bg-white"
                placeholder={i18n.t("Repeat Password")}
                placeholderTextColor="#d2b48c"
                secureTextEntry
                value={formData.R_PASSWORD}
                onChangeText={(text) => handleChange("R_PASSWORD", text)}
            />
          </View>

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

          <View className="mt-4">{AboutPassword(checkPassword)}</View>

          <View className="mt-6 flex items-center">
              <Text className="text-white mb-2">{i18n.t("Or sign in with")}</Text>
              <TouchableOpacity onPress={handleGoogleRegister} className="p-2 rounded-full">
                <Image
                  source={{ uri: "https://lootopia.blob.core.windows.net/lootopia-photos/google_logo.png" }}
                  style={{ width: 50, height: 50 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

          <Link
              href={"/login"}
              className="mt-5 text-center text-white underline text-base"
          >
            {i18n.t("Already have an account? Sign in")}
          </Link>
        </View>
      </ScrollView>
      </ImageBackground>
  );
}
