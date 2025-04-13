import React from 'react'
import { useLocalSearchParams } from 'expo-router'
import { ScrollView, View, Text, Image, FlatList } from 'react-native'
import MapScreen from '@/components/map/index/map.web'
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
  huntingId: number
  cacheId: number | null
  cache: any
  spotMap: Array<{
    id: number
    spotId: number
    mapId: number
    spot: {
      id: number
      lat: string
      long: string
      description: string
      typeId: number
    }
  }>
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

  // Pour simplifier, on considère ici que l'utilisateur est organisateur
  const isOrganizer = true

  // Si la chasse contient au moins une map, on extrait les données de la première map
  const renderMap = () => {
    const mapData = parsedHunt.map![0]
    // Extraction des marqueurs : on sélectionne ceux avec typeId === 1
    const markers = mapData.spotMap
      .filter((sm) => Number(sm.spot.typeId) === 1)
      .map((sm) => ({
        position: [Number(sm.spot.lat), Number(sm.spot.long)],
        label: sm.spot.description,
      }))

    // Extraction du carré : on recherche chacun des coins par typeId
    const square = {
      topLeft:
        mapData.spotMap.find((sm) => Number(sm.spot.typeId) === 2)?.spot
          ? [
              Number(
                mapData.spotMap.find((sm) => Number(sm.spot.typeId) === 2)!.spot.lat
              ),
              Number(
                mapData.spotMap.find((sm) => Number(sm.spot.typeId) === 2)!.spot.long
              ),
            ]
          : [],
      topRight:
        mapData.spotMap.find((sm) => Number(sm.spot.typeId) === 3)?.spot
          ? [
              Number(
                mapData.spotMap.find((sm) => Number(sm.spot.typeId) === 3)!.spot.lat
              ),
              Number(
                mapData.spotMap.find((sm) => Number(sm.spot.typeId) === 3)!.spot.long
              ),
            ]
          : [],
      bottomLeft:
        mapData.spotMap.find((sm) => Number(sm.spot.typeId) === 4)?.spot
          ? [
              Number(
                mapData.spotMap.find((sm) => Number(sm.spot.typeId) === 4)!.spot.lat
              ),
              Number(
                mapData.spotMap.find((sm) => Number(sm.spot.typeId) === 4)!.spot.long
              ),
            ]
          : [],
      bottomRight:
        mapData.spotMap.find((sm) => Number(sm.spot.typeId) === 5)?.spot
          ? [
              Number(
                mapData.spotMap.find((sm) => Number(sm.spot.typeId) === 5)!.spot.lat
              ),
              Number(
                mapData.spotMap.find((sm) => Number(sm.spot.typeId) === 5)!.spot.long
              ),
            ]
          : [],
    }

    // Le centre de la carte provient du spot de typeId 6 (s'il existe)
    const centerSpot = mapData.spotMap.find((sm) => Number(sm.spot.typeId) === 6)?.spot
    const center = centerSpot
      ? [Number(centerSpot.lat), Number(centerSpot.long)]
      : markers.length > 0
      ? markers[0].position
      : [0, 0]

    return (
      <View style={{ marginTop: 20, height: 400 }}>
        <Text
          style={{
            fontSize: 18,
            marginBottom: 10,
            fontWeight: '700',
            fontFamily: 'BerkshireSwash-Regular',
            textAlign: 'center',
          }}
        >
          {i18n.t('Maps')}:
        </Text>
        <MapScreen
          center={center}
          markers={markers}
          square={square}
          zoom={Number(mapData.scaleMax)}
          status={true}
        />
      </View>
    )
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
      <Image
        source={{ uri: parsedHunt.headerImg }}
        style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 16 }}
        resizeMode="cover"
      />

      <Text
        style={{
          fontSize: 24,
          fontWeight: '700',
          marginBottom: 8,
          fontFamily: 'BerkshireSwash-Regular',
          textAlign: 'center',
        }}
      >
        {parsedHunt.title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          marginBottom: 12,
          color: '#333',
          fontFamily: 'BerkshireSwash-Regular',
          textAlign: 'center',
        }}
      >
        {parsedHunt.description}
      </Text>

      <Text
        style={{
          fontSize: 14,
          marginBottom: 6,
          color: '#555',
          fontFamily: 'BerkshireSwash-Regular',
          textAlign: 'center',
        }}
      >
        {i18n.t('Price')}: {parsedHunt.price} 💰
      </Text>
      <Text
        style={{
          fontSize: 14,
          marginBottom: 6,
          color: '#555',
          fontFamily: 'BerkshireSwash-Regular',
          textAlign: 'center',
        }}
      >
        Min: {parsedHunt.minUser} | Max: {parsedHunt.maxUser}
      </Text>
      <Text
        style={{
          fontSize: 14,
          marginBottom: 6,
          color: '#555',
          fontFamily: 'BerkshireSwash-Regular',
          textAlign: 'center',
        }}
      >
        {i18n.t('Participants')}: {parsedHunt.participantCount ?? 0} / {parsedHunt.maxUser}
      </Text>
      <Text
        style={{
          fontSize: 14,
          marginBottom: 6,
          color: '#555',
          fontFamily: 'BerkshireSwash-Regular',
          textAlign: 'center',
        }}
      >
        {i18n.t('End')}: {new Date(parsedHunt.endDate).toLocaleDateString()}
      </Text>
      <Text
        style={{
          fontSize: 14,
          marginBottom: 12,
          color: '#555',
          fontFamily: 'BerkshireSwash-Regular',
          textAlign: 'center',
        }}
      >
        {i18n.t('Status')}: {parsedHunt.status ? i18n.t('Active') : i18n.t('Inactive')}
      </Text>

      {/* Items */}
      {parsedHunt.items?.length ? (
        <View style={{ marginTop: 20, width: '100%', alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 18,
              marginBottom: 10,
              fontWeight: '700',
              fontFamily: 'BerkshireSwash-Regular',
              textAlign: 'center',
            }}
          >
            {i18n.t('Items')}:
          </Text>
          <FlatList
            horizontal
            data={parsedHunt.items}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingVertical: 10, alignItems: 'center' }}
            renderItem={({ item }) => (
              <View
                style={{
                  width: 140,
                  backgroundColor: '#f5f5f5',
                  borderRadius: 8,
                  padding: 10,
                  alignItems: 'center',
                  marginRight: 12,
                }}
              >
                <Image source={{ uri: item.img }} style={{ width: 80, height: 80, borderRadius: 6, marginBottom: 6 }} />
                <Text style={{ fontSize: 14, fontWeight: '600', fontFamily: 'BerkshireSwash-Regular', textAlign: 'center' }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 12, fontFamily: 'BerkshireSwash-Regular', color: '#666' }}>💰 {item.price}</Text>
                <Text style={{ fontSize: 12, fontFamily: 'BerkshireSwash-Regular', color: '#666' }}>⭐ {item.rarity.name}</Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ) : null}

      {/* Map */}
      {parsedHunt.map?.length ? renderMap() : null}

      {/* Participants */}
      {isOrganizer && parsedHunt.participants?.length > 0 && (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text
            style={{
              fontSize: 18,
              marginBottom: 10,
              fontWeight: '700',
              fontFamily: 'BerkshireSwash-Regular',
              textAlign: 'center',
            }}
          >
            {i18n.t('Participants')}:
          </Text>
          {parsedHunt.participants.map((user) => (
            <Text
              key={user.id}
              style={{
                fontSize: 14,
                marginBottom: 4,
                color: '#333',
                fontFamily: 'BerkshireSwash-Regular',
                textAlign: 'center',
              }}
            >
              🧍 {user.nickname}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  )
}
