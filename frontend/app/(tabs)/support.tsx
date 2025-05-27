// app/support.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";

export default function Support() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = () => {
    if (!subject || !message) {
      // Afficher une erreur ici si besoin
      return;
    }
    setSent(true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Support & Aide</Text>

      {!sent ? (
        <>
          <Text style={styles.label}>Sujet</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
            placeholder="Entrez le sujet"
            placeholderTextColor="#888"
          />

          <Text style={styles.label}>Message</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            value={message}
            onChangeText={setMessage}
            placeholder="Décrivez votre problème"
            placeholderTextColor="#888"
            multiline
            numberOfLines={6}
          />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Envoyer</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.thanksContainer}>
          <Text style={styles.thanksText}>Merci ! Votre demande a été envoyée.</Text>
        </View>
      )}

      <View style={styles.faqSection}>
        <Text style={styles.sectionTitle}>FAQ</Text>
        <View style={styles.faqItem}>
          <Text style={styles.faqQ}>Q: Comment rejoindre une chasse au trésor ?</Text>
          <Text style={styles.faqA}>Allez dans la section Chasses, choisissez une aventure, puis cliquez sur Rejoindre.</Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={styles.faqQ}>Q: Comment suivre mes commandes ?</Text>
          <Text style={styles.faqA}>Rendez-vous dans Purchase History pour voir le détail de vos achats.</Text>
        </View>
        <View style={styles.faqItem}>
          <Text style={styles.faqQ}>Q: Comment contacter un organisateur ?</Text>
          <Text style={styles.faqA}>Utilisez le chat depuis la page d’événement ou envoyez-nous un message ici.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F5FFF0",
    padding: 20,
    marginBottom: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2E7D32",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    color: "#333",
  },
  textarea: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  thanksContainer: {
    alignItems: "center",
    marginVertical: 40,
  },
  thanksText: {
    fontSize: 18,
    color: "#2E7D32",
    fontWeight: "600",
  },
  faqSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 12,
  },
  faqItem: {
    marginBottom: 12,
  },
  faqQ: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  faqA: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
