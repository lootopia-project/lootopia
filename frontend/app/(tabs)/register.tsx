import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useRouter, Link } from "expo-router";
import { registerUser } from "@/services/AuthService";
import lang from "@/translation";

export default function LoginPage() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      
      const check = await registerUser({ email, password });
      if (check.message) {
        router.push("/");
      }
    } catch (error) {
      console.error("Error in handleLogin:", error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{lang.t("register")}</Text>
      <TextInput
        style={styles.input}
        placeholder={lang.t("email")}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder={lang.t("password")}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      <Button title={lang.t("register")} onPress={handleLogin} />
      <Link href={"/login"}>{lang.t("login")}</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
});
