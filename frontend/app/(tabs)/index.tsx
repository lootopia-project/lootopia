import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useLanguage } from '@/hooks/providers/LanguageProvider';
import { Link } from 'expo-router';
export default function HomeScreen() {
  const { i18n } = useLanguage();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenue sur Lootopia</Text>
      <Text style={styles.subtitle}>Votre plateforme de chasses au trésor immersive</Text>

      <Image
        source={require('@/assets/images/index-map.png')}
        style={styles.heroImage}
        resizeMode="contain"
      />

      <Text style={styles.sectionTitle}>Découvrez le jeu</Text>
      <Text style={styles.paragraph}>
        Participez à des chasses au trésor virtuelles ou semi-virtuelles, collectez des récompenses, et explorez
        des énigmes palpitantes en Réalité Augmentée.
      </Text>

      <Text style={styles.sectionTitle}>Pour les joueurs</Text>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Explorer</Text>
          <Text style={styles.cardText}>Parcourez les chasses disponibles et rejoignez celles qui vous inspirent.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Jouer</Text>
          <Text style={styles.cardText}>Résolvez des énigmes, creusez virtuellement et découvrez des trésors secrets.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gagner</Text>
          <Text style={styles.cardText}>Collectez des Couronnes, artefacts et gagnez votre place au classement.</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Pour les organisateurs</Text>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Créer</Text>
          <Text style={styles.cardText}>Concevez des chasses personnalisées avec étapes, indices et récompenses.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gérer</Text>
          <Text style={styles.cardText}>Suivez les inscriptions, modérez les participants et gérez vos événements.</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Analyser</Text>
          <Text style={styles.cardText}>Accédez à des statistiques détaillées pour optimiser vos campagnes.</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
      >
        <Link
          href="/register"
          className="text-center text-base underline"
        >
          {i18n.t("Don't have an account? Sign up")}
        </Link>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, styles.secondaryButton]}
      >
        <Link href={"/login"}>{i18n.t("login")}</Link>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F5FFF0',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#2E7D32',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  heroImage: {
    width: '100%',
    height: 400,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginVertical: 10,
    color: '#2E7D32',
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'justify',
    color: '#333',
    marginBottom: 20,
  },
  cardContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    width: '30%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2E7D32',
  },
  cardText: {
    fontSize: 14,
    color: '#555',
  },
  button: {
    backgroundColor: '#2E7D32',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#2E7D32',
  },
  secondaryButtonText: {
    color: '#2E7D32',
  },
});