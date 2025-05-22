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
    <ScrollView className="flex-1 bg-white p-4">
      <TouchableOpacity onPress={onClose} className="mb-2.5">
        <Text>← {i18n.t('Back')}</Text>
      </TouchableOpacity>

      <Image
        source={{ uri: hunt.headerImg }}
        className="w-full h-[200px] rounded-lg mb-4"
        resizeMode="contain"
      />

      <Text className="text-2xl font-bold mb-2 text-center">
        {hunt.title}
      </Text>
      <Text className="text-sm mb-3 text-gray-800 text-center">
        {hunt.description}
      </Text>

      <Text className="text-sm mb-1.5 text-center">
        {i18n.t('Price')}: {hunt.price} 💰
      </Text>
      <Text className="text-sm mb-1.5 text-center">
        Min: {hunt.minUser} | Max: {hunt.maxUser}
      </Text>
      <Text className="text-sm mb-1.5 text-center">
        {i18n.t('Participants')}: {hunt.participantCount ?? 0} / {hunt.maxUser}
      </Text>
      <Text className="text-sm mb-1.5 text-center">
        {i18n.t('End')}: {new Date(hunt.endDate).toLocaleDateString()}
      </Text>
      <Text className="text-sm mb-3 text-center">
        {i18n.t('Status')}: {hunt.status ? i18n.t('Active') : i18n.t('Inactive')}
      </Text>

      {hunt.items?.length ? (
        <View className="mt-5 items-center">
          <Text className="text-lg mb-2.5 font-bold text-center">
            {i18n.t('Items')}:
          </Text>
          <FlatList
            horizontal
            data={hunt.items}
            keyExtractor={(item) => item.id.toString()}
            contentContainerClassName="py-2.5 items-center"
            renderItem={({ item }) => (
              <View className="w-[140px] bg-gray-200 rounded-lg p-2.5 items-center mr-3">
                <Image
                  source={{ uri: item.img }}
                  className="w-[80px] h-[80px] rounded-md mb-1.5"
                  resizeMode="contain"
                />
                <Text className="text-sm font-semibold text-center">
                  {item.name}
                </Text>
                <Text className="text-xs text-gray-600">
                  💰 {item.price}
                </Text>
                <Text className="text-xs text-gray-600">
                  ⭐ {item.rarity.name}
                </Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      ) : null}

      {hunt.map?.length ? (
        <View className="mt-5 h-[400px]">
          <Text className="text-lg mb-2.5 font-bold text-center">
            {i18n.t('Maps')}:
          </Text>
          <MapRead mapId={hunt.map[0].id} />
        </View>
      ) : null}

      {isOrganizer && hunt.participants?.length ? (
        <View className="mt-5 items-center">
          <Text className="text-lg mb-2.5 font-bold text-center">
            {i18n.t('Participants')}:
          </Text>
          {hunt.participants.map((user) => (
            <Text key={user.id} className="text-sm mb-1 text-center">
              🧍 {user.nickname}
            </Text>
          ))}
        </View>
      ) : null}
    </ScrollView>
  )
}
