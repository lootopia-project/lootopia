// app/(tabs)/hunting/huntingDetails.tsx
import React from 'react'
import {
  ScrollView,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import MapRead from '@/components/map/read/read'
import { useLanguage } from '@/hooks/providers/LanguageProvider'
import { HuntingDetailsProps } from '@/type/feature/hunting/HuntingDetailsProps'

export default function HuntingDetails({ hunt, onClose }: HuntingDetailsProps) {
  const { i18n } = useLanguage()
  const isOrganizer = hunt.isOrganizer

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

      <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 8, textAlign: 'center' }}>
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

      {/* Items */}
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
                <Image
                  source={{ uri: item.img }}
                  style={{ width: 80, height: 80, borderRadius: 6, marginBottom: 6 }}
                  resizeMode="contain"
                />
                <Text style={{ fontSize: 14, fontWeight: '600', textAlign: 'center' }}>
                  {item.name}
                </Text>
                <Text style={{ fontSize: 12, color: '#666' }}>💰 {item.price}</Text>
                <Text style={{ fontSize: 12, color: '#666' }}>⭐ {item.rarity.name}</Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ) : null}

      {/* MapRead */}
      {hunt.map?.length ? (
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
          <MapRead mapId={hunt.map[0].id} />
        </View>
      ) : null}

      {/* Participants */}
      {isOrganizer && hunt.participants?.length ? (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 18, marginBottom: 10, fontWeight: '700', textAlign: 'center' }}>
            {i18n.t('Participants')}:
          </Text>
          {hunt.participants.map((user) => (
            <Text
              key={user.id}
              style={{ fontSize: 14, marginBottom: 4, textAlign: 'center' }}
            >
              🧍 {user.nickname}
            </Text>
          ))}
        </View>
      ) : null}
    </ScrollView>
  )
}
