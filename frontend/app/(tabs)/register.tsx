import React, { useState } from "react";
import { useRouter, Link } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { registerUser } from "@/services/AuthService";
import { validatePassword } from "@/constants/validatePassword";
import AXIOS_ERROR from "@/type/request/axios_error";
import aboutPassword from "@/componants/aboutPassword";

export default function RegisterPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const router = useRouter();

  // const handleLogin = async () => {
  //   try {

  //     const check = await registerUser({ email, password });
  //     if (check.message) {
  //       router.push("/");
  //     }
  //   } catch (error) {
  //     console.error("Error in handleLogin:", error);
  //   }
  // };

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    R_PASSWORD: ""
  })
  const [checkPassword, setCheckPassword] = useState({
    length: false,
    maj: false,
    min: false,
    special: false,
    same: false
  })
  const [fielCheck, setFieldCheck] = useState("")
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

  const handleSavePasswordError = (err: unknown) => {
    if ((err as AXIOS_ERROR).message) {
      setError((err as AXIOS_ERROR).message || "Error connecting")
    } else {
      setError("Error connecting ")
    }
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFieldCheck("")
    const passwordErrors = validatePassword(formData)
    setCheckPassword(passwordErrors)

    if (passwordErrors.length && passwordErrors.maj && passwordErrors.min && passwordErrors.special && passwordErrors.same) {
      // checkUserExist(formData.username).then((response) => {
      //     if (response.message) {
      //         registerUser({ username: formData.username, password: formData.password, token:token || "" }).then(() => {
      //             if (response.message) {
      //                 setSuccess("User registered")
      //             } else {
      //                 setError("Error registering user")
      //             }
      //         }).catch(handleSavePasswordError)
      //     } else {
      //         setError("Username already exist")
      //     }
      // }
      // ).catch(handleSavePasswordError)
    }
  }
  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView>
        <View>
          <Text >Register</Text>

          {/* Username */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={formData.username || ""}
              onChangeText={(text) => handleChange("username", text)}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={formData.password || ""}
              onChangeText={(text) => handleChange("password", text)}
            />
          </View>

          {/* Repeat Password */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Repeat Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Repeat Password"
              secureTextEntry
              value={formData.R_PASSWORD || ""}
              onChangeText={(text) => handleChange("R_PASSWORD", text)}
            />
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity onPress={() => {
            Keyboard.dismiss();

          }}>
            <Text>Sign up</Text>
          </TouchableOpacity>

          {/* Password Strength Validation */}
          <View style={styles.passwordValidation}>
            {aboutPassword(checkPassword)}
            {fielCheck ? <Text style={styles.errorText}>{fielCheck}</Text> : null}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F8F9FA',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  passwordValidation: {
    marginTop: 10,
  },
  validText: {
    color: 'green',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
  },
};