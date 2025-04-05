import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { ScrollView, View, Text, Image, FlatList } from 'react-native'
import { useLanguage } from '@/hooks/providers/LanguageProvider'

type Rarity = { id: number; name: string }

type Item = {
  id: number
  name: string
  description: string
  img: string
  price: number
  rarity: Rarity
}

type MapType = {
  id: number
  name: string
  skin: string
  zone: string
  scaleMin: number
  scaleMax: number
}

type Participant = {
  id: number
  nickname: string
}

type HuntingExtended = {
  id: number
  title: string
  description: string
  price: string | number
  minUser: number
  maxUser: number
  private: boolean
  endDate: string
  searchDelay: string
  status: boolean
  background: string
  textColor: string
  headerImg: string
  userId: number
  worldId: number
  items?: Item[]
  map?: MapType[]
  participantCount?: number
  participants?: Participant[]
}

export default function Page() {
  const { hunt } = useLocalSearchParams()
  const { i18n } = useLanguage()

  if (!hunt) return <Text>Chasse introuvable</Text>

  let parsedHunt: HuntingExtended

  try {
    parsedHunt = JSON.parse(hunt as string)
  } catch (error) {
    return <Text>Erreur de parsing des données</Text>
  }

  const isOrganizer = false // ← à remplacer plus tard avec currentUser.id === parsedHunt.userId

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      <Image
        source={{ uri: parsedHunt.headerImg }}
        style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 16 }}
        resizeMode="cover"
      />

      <Text style={styles.title}>{parsedHunt.title}</Text>
      <Text style={styles.description}>{parsedHunt.description}</Text>

      <Text style={styles.info}>{i18n.t('Price')}: {parsedHunt.price} 💰</Text>
      <Text style={styles.info}>Min: {parsedHunt.minUser} | Max: {parsedHunt.maxUser}</Text>
      <Text style={styles.info}>
        {i18n.t('Participants')}: {parsedHunt.participantCount ?? 0} / {parsedHunt.maxUser}
      </Text>
      <Text style={styles.info}>
        {i18n.t('End')}: {new Date(parsedHunt.endDate).toLocaleDateString()}
      </Text>
      <Text style={styles.info}>
        {i18n.t('Status')}: {parsedHunt.status ? i18n.t('Active') : i18n.t('Inactive')}
      </Text>

      {/* 🎁 Items horizontal scroll */}
      {parsedHunt.items?.length ? (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.subTitle}>{i18n.t('Items')}:</Text>
          <FlatList
            horizontal
            data={parsedHunt.items}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ gap: 12, paddingVertical: 10 }}
            renderItem={({ item }) => (
              <View style={styles.itemCard}>
                <Image source={{ uri: item.img }} style={styles.itemImage} />
                <Text style={styles.itemTitle}>{item.name}</Text>
                <Text style={styles.itemDetail}>💰 {item.price}</Text>
                <Text style={styles.itemDetail}>⭐ {item.rarity.name}</Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ) : null}

      {/* 🗺️ Maps */}
      {parsedHunt.map?.length ? (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.subTitle}>Maps:</Text>
          {parsedHunt.map.map((mapItem) => (
            <View key={mapItem.id} style={{ marginBottom: 12 }}>
              <Text style={styles.mapTitle}>{mapItem.name}</Text>
              <Text style={styles.info}>Zone: {mapItem.zone}</Text>
              <Text style={styles.info}>Skin: {mapItem.skin}</Text>
              <Text style={styles.info}>
                Échelle: {mapItem.scaleMin} - {mapItem.scaleMax}
              </Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* 👥 Participants */}
      {isOrganizer && parsedHunt.participants?.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.subTitle}>{i18n.t('Participants')}:</Text>
          {parsedHunt.participants.map((user) => (
            <Text key={user.id} style={styles.participant}>
              🧍 {user.nickname}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  )
}

const styles = {
  title: {
    fontSize: 24,
    fontWeight: '700' as const,
    marginBottom: 8,
    fontFamily: 'BerkshireSwash-Regular',
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    color: '#333',
    fontFamily: 'BerkshireSwash-Regular',
  },
  info: {
    fontSize: 14,
    marginBottom: 6,
    color: '#555',
    fontFamily: 'BerkshireSwash-Regular',
  },
  subTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: '700' as const,
    fontFamily: 'BerkshireSwash-Regular',
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#444',
    fontFamily: 'BerkshireSwash-Regular',
  },
  participant: {
    fontSize: 14,
    marginBottom: 4,
    color: '#333',
    fontFamily: 'BerkshireSwash-Regular',
  },
  itemCard: {
    width: 140,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
    marginBottom: 6,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600' as const,
    fontFamily: 'BerkshireSwash-Regular',
    textAlign: 'center',
  },
  itemDetail: {
    fontSize: 12,
    fontFamily: 'BerkshireSwash-Regular',
    color: '#666',
  },
}
