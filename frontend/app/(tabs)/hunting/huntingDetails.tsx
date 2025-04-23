import React from 'react'
import { ScrollView, View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import MapScreen from '@/components/map/index/map.web'
import { useLanguage } from '@/hooks/providers/LanguageProvider'
import { Item } from '@/type/feature/hunting/Item'
import { MapType } from '@/type/feature/hunting/MapType'
import { Participant } from '@/type/feature/hunting/Participant'

// Type pour les marqueurs de la carte
type Marker = { position: [number, number]; label: string }

type Props = {
  hunt: {
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
  onClose: () => void
}

export default function HuntingDetails({ hunt, onClose }: Props) {
  const { i18n } = useLanguage()
  const isOrganizer = true

  const renderMap = () => {
    if (!hunt.map || hunt.map.length === 0) return null
    const mapData = hunt.map[0]

    const markers: Marker[] = mapData.spotMap
      .filter((sm) => Number(sm.spot.typeId) === 1)
      .map((sm) => {
        const lat = Number(sm.spot.lat)
        const long = Number(sm.spot.long)
        return { position: [lat, long], label: sm.spot.description }
      })

    const getSpotPosition = (typeId: number): [number, number] => {
      const spot = mapData.spotMap.find((sm) => Number(sm.spot.typeId) === typeId)?.spot
      if (spot) {
        return [Number(spot.lat), Number(spot.long)]
      }
      return [0, 0]
    }

    const square = {
      topLeft: getSpotPosition(2),
      topRight: getSpotPosition(3),
      bottomLeft: getSpotPosition(4),
      bottomRight: getSpotPosition(5),
    }

    let center: [number, number]
    const centerSpot = mapData.spotMap.find((sm) => Number(sm.spot.typeId) === 6)?.spot
    if (centerSpot) {
      center = [Number(centerSpot.lat), Number(centerSpot.long)]
    } else if (markers.length > 0) {
      center = markers[0].position
    } else {
      center = [0, 0]
    }

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
      <TouchableOpacity onPress={onClose} style={{ marginBottom: 10 }}>
        <Text>← {i18n.t('Back')}</Text>
      </TouchableOpacity>

      <Image
        source={{ uri: hunt.headerImg }}
        style={{ width: '100%', height: 200, borderRadius: 8, marginBottom: 16 }}
        resizeMode="contain"
      />

      <Text
        style={{ fontSize: 24, fontWeight: '700', marginBottom: 8, textAlign: 'center' }}
      >
        {hunt.title}
      </Text>
      <Text style={{ fontSize: 14, marginBottom: 12, color: '#333', textAlign: 'center' }}>
        {hunt.description}
      </Text>

      <Text style={{ fontSize: 14, marginBottom: 6, textAlign: 'center' }}>
        {i18n.t('Price')}: {hunt.price} 💰
      </Text>
      <Text style={{ fontSize: 14, marginBottom: 6, textAlign: 'center' }}>
        Min: {hunt.minUser} | Max: {hunt.maxUser}
      </Text>
      <Text style={{ fontSize: 14, marginBottom: 6, textAlign: 'center' }}>
        {i18n.t('Participants')}: {hunt.participantCount ?? 0} / {hunt.maxUser}
      </Text>
      <Text style={{ fontSize: 14, marginBottom: 6, textAlign: 'center' }}>
        {i18n.t('End')}: {new Date(hunt.endDate).toLocaleDateString()}
      </Text>
      <Text style={{ fontSize: 14, marginBottom: 12, textAlign: 'center' }}>
        {i18n.t('Status')}: {hunt.status ? i18n.t('Active') : i18n.t('Inactive')}
      </Text>

      {hunt.items?.length ? (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: '700', textAlign: 'center' }}>
            {i18n.t('Items')}:
          </Text>
          <FlatList
            horizontal
            data={hunt.items}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingVertical: 10, alignItems: 'center' }}
            renderItem={({ item }) => (
              <View style={{ width: 140, backgroundColor: '#f5f5f5', borderRadius: 8, padding: 10, alignItems: 'center', marginRight: 12 }}>
                <Image source={{ uri: item.img }} style={{ width: 80, height: 80, borderRadius: 6, marginBottom: 6 }} resizeMode="contain" />
                <Text style={{ fontSize: 14, fontWeight: '600', textAlign: 'center' }}>{item.name}</Text>
                <Text style={{ fontSize: 12, color: '#666' }}>💰 {item.price}</Text>
                <Text style={{ fontSize: 12, color: '#666' }}>⭐ {item.rarity.name}</Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ) : null}

      {/* Map */}
      {hunt.map?.length ? renderMap() : null}

      {/* Participants */}
      {isOrganizer && hunt.participants?.length ? (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: '700', textAlign: 'center' }}>
            {i18n.t('Participants')}:
          </Text>
          {hunt.participants.map((user) => (
            <Text key={user.id} style={{ fontSize: 14, marginBottom: 4, textAlign: 'center' }}>
              🧍 {user.nickname}
            </Text>
          ))}
        </View>
      ) : null}
    </ScrollView>
  )
}
