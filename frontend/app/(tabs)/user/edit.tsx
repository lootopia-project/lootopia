import React, { useEffect, useState } from "react";
import { Text, ScrollView, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import InfoEditUser from "@/type/feature/user/InfoEditUser";
import { getInfoUser, updateInfoUser, updatePassword } from "@/services/UsersService";
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import * as ImagePicker from "expo-image-picker";
import Return from "@/type/request/return";
import Success from "@/components/Success";
import ModalChangePassword from "@/components/user/ModalChangePassword";
import FormEditUser from "@/components/user/FormEditUser";
import { useErrors } from "@/hooks/providers/ErrorProvider";

const EditUser = () => {
  const { i18n, changeLanguage } = useLanguage();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isSuccessVisible, setSuccessVisible] = useState(false);
  const { setErrorVisible, setErrorMessage } = useErrors();
  const [message, setMessage] = useState("");
  const [infoEditUser, setInfoEditUser] = useState<InfoEditUser>({
    id: 0, email: "", name: "", surname: "",
    isPartner: false, img: "",
    nickname: "", isTwoFactorEnabled: false,
    phone: 0, lang: "en", checkMail: false,
    ranking: 0, crowns: 0
  });
  const [changePassword, setChangePassword] = useState({
    currentPassword: "", newPassword: "", confirmPassword: ""
  });

  useEffect(() => {
    (async () => {
      try {
        const infoUser = await getInfoUser();
        setInfoEditUser(infoUser);
      } catch {
        setErrorMessage(i18n.t("An error occurred while fetching data"));
        setErrorVisible(true);
      }
    })();
  }, [i18n, setErrorMessage, setErrorVisible]);

  const handleChange = (name: keyof InfoEditUser, value: string | boolean) =>
    setInfoEditUser(prev => ({ ...prev, [name]: value }));

  const handleFileChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, aspect: [1, 1], quality: 1,
    });
    if (!result.canceled) {
      setInfoEditUser(prev => ({ ...prev, img: result.assets[0].uri }));
    }
  };

  const submit = async () => {
    const response = await updateInfoUser(infoEditUser);
    handleResponse(response);
  };

  const changePasswordSubmit = async () => {
    const response = await updatePassword(
      changePassword.currentPassword,
      changePassword.newPassword
    );
    handleResponse(response);
  };

  const handleResponse = (response: Return) => {
    if (response.success) {
      changeLanguage(infoEditUser.lang);
      setSuccessVisible(true);
    } else {
      setErrorVisible(true);
    }
    setMessage(response.message);
    setErrorMessage(response.message);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>{i18n.t("Edit User")}</Text>
        <TouchableOpacity onPress={handleFileChange} style={styles.avatarContainer}>
          {infoEditUser.img ? (
            <Image source={{ uri: infoEditUser.img }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {infoEditUser.name?.[0]?.toUpperCase() || "U"}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Formulaire */}
      <FormEditUser
        infoEditUser={infoEditUser}
        handleChange={handleChange}
        handleFileChange={handleFileChange}
        setModalVisible={setModalVisible}
        submit={submit}
      />

      {/* Modal et Succès */}
      <ModalChangePassword
        isVisible={isModalVisible}
        onClose={() => setModalVisible(false)}
        onChange={(n, v) => setChangePassword(prev => ({ ...prev, [n]: v }))}
        onSubmit={changePasswordSubmit}
        changePassword={changePassword}
      />
      <Success
        visible={isSuccessVisible}
        onClose={() => setSuccessVisible(false)}
        successMessage={message}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F5FFF0",
    alignItems: "stretch",
    marginBottom: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 12,
  },
  avatarContainer: {
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#2E7D32",
  },
  avatar: {
    width: 120,
    height: 120,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: {
    fontSize: 48,
    color: "#757575",
  },
});

export default EditUser;
