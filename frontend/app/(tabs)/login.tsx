import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ScrollView,
  ImageBackground,
  Image,
} from "react-native";
import { useAuth } from "@/hooks/providers/AuthProvider";
import { useErrors } from "@/hooks/providers/ErrorProvider";
import { useRouter, Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { useSSO, useUser,useAuth as useClerkAuth  } from "@clerk/clerk-expo";
import UsersGoogle from "@/type/feature/auth/user_google";
import * as AuthSession from 'expo-auth-session';

export default function LoginPage() {
  const { login,loginOrRegisterGoogle } = useAuth();
  const [success, setSuccess] = useState("");
  const { setErrorVisible, setErrorMessage } = useErrors();
  const colorScheme = useColorScheme();
  
  const themeColors = colorScheme === "dark" ? Colors.dark : Colors.light;
  const { i18n } = useLanguage();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { startSSOFlow } = useSSO()
  const {user}=useUser()
  const {signOut}=useClerkAuth()
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
          mode: "login",
        };
    
        const result = await loginOrRegisterGoogle(users);

        if (result.message.headers) {
          setSuccess(i18n.t("Connexion success"));
          setErrorMessage("");
          setTimeout(() => {
            router.push("/");
          }, 1000);
        }else{
          setErrorMessage(i18n.t(result.message));
          setErrorVisible(true);
        }
        setSendData(false);
      }

    };

    register();
  }, [user, sendData]); 

  const handleLogin = async () => {
    try {
      const check = await login({ email, password });
      if (check.message === "2FA") {
        router.push("/2fa");
      }
      else if (check.headers) {
        setErrorMessage("");
        router.push("/");
      }
    } catch (err) {
      setErrorMessage(i18n.t("Invalid email or password"));
      setErrorVisible(true);
    }
  };

  const handleGoogleLogin = async () => {
     setSendData(true)
        try {
          const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
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
      style={{ flex: 1, backgroundColor: themeColors.background }}
      source={{ uri: "https://lootopia.blob.core.windows.net/lootopia-photos/map_background.png" }}
      resizeMode="cover"
    >
      <ScrollView
        style={{ flex: 1, minHeight: '100%' }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center items-center p-5">
          <View className="bg-white/20 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <Text
              className="text-2xl font-bold text-center mb-5"
              style={{ color: "white" }}
            >
              {i18n.t("Sign in")}
            </Text>

            {/* Champ Email */}
            <View className="mb-4">
              <Text className="text-lg mb-2" style={{ color: "white" }}>
                {i18n.t("email")}
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

            {/* Champ Mot de passe */}
            <View className="mb-4">
              <Text className="text-lg mb-2" style={{ color: "white" }}>
                {i18n.t("password")}
              </Text>
              <TextInput
                className="border rounded-lg p-3 text-base"
                style={{
                  borderColor: themeColors.icon,
                  color: "white",
                  backgroundColor: themeColors.background,
                }}
                placeholder={i18n.t("password")}
                placeholderTextColor={themeColors.icon}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            {/* Bouton de connexion */}
            <TouchableOpacity
              className="py-4 rounded-lg"
              style={{ backgroundColor: "#C59B5F" }}
              onPress={handleLogin}
            >
              <Text
                className="text-center text-white text-lg font-bold"
                style={{ color: themeColors.background }}
              >
                {i18n.t("login")}
              </Text>
            </TouchableOpacity>

            {success ? (
                          <Text className="text-sm text-green-600 text-center mb-5">{success}</Text>
              ) : null}

            {/* Connexion avec Google */}
            <View className="mt-6 flex items-center">
              <Text className="text-white mb-2">{i18n.t("Or sign in with")}</Text>
              <TouchableOpacity onPress={handleGoogleLogin} className="p-2 rounded-full">
                <Image
                  source={{ uri: "https://lootopia.blob.core.windows.net/lootopia-photos/google_logo.png" }}
                  style={{ width: 50, height: 50 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>

            {/* Lien d'inscription */}
            <Link
              href="/register"
              className="mt-5 text-center text-base underline"
              style={{ color: themeColors.tint }}
            >
              {i18n.t("Don't have an account? Sign up")}
            </Link>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

