// src/screens/CreateHunting.tsx
import React, { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ImageBackground,
  Platform,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { createHunting } from '@/services/HuntingService'
import { useRouter } from 'expo-router'
import { useLanguage } from '@/hooks/providers/LanguageProvider'
import DrawingMap from '@/components/map/create/create.web'

export default function CreateHunting() {
  const { i18n } = useLanguage()
  const router = useRouter()

  const [title, setTitle]             = useState('')
  const [description, setDescription] = useState('')
  const [world, setWorld]             = useState<'real'|'map'>('real')
  const [unlimited, setUnlimited]     = useState(true)
  const [endDate, setEndDate]         = useState(new Date())
  const [mode, setMode]               = useState<'public'|'private'>('public')
  const [maxUsers, setMaxUsers]       = useState<string>('')
  const [loading, setLoading]         = useState(false)

  const onSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      return Alert.alert(i18n.t('Validation'), i18n.t('Title and description required'))
    }
    setLoading(true)
    try {
      await createHunting({
        title: title.trim(),
        description: description.trim(),
        price: 0,
        minUser: 1,
        maxUser: maxUsers ? parseInt(maxUsers, 10) : 0,
        private: mode === 'private',
        endDate: unlimited ? undefined : endDate.toISOString(),
        searchDelay: "02:00:00",
        status: true,
        background: '',
        textColor: '',
        headerImg: '',
        userId: 0, // remplacer par userId réel
        worldId: world === 'real' ? 1 : 2,
      })
      Alert.alert(i18n.t('Success'), i18n.t('Hunt created'))
      router.back()
    } catch {
      Alert.alert(i18n.t('Error'), i18n.t('Could not create hunt'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <ImageBackground
      source={{ uri: 'https://lootopia.blob.core.windows.net/lootopia-photos/FFJFCIJECEAEGCE.jpeg' }}
      className="flex-1"
      resizeMode="cover"
    >
      <View className="absolute inset-0 bg-black/30" />

      <View
        className={`
          flex-1
          ${world === 'map'
            ? 'flex-row'
            : 'items-center justify-center'}
        `}
      >
        {/* Colonne formulaire */}
        <ScrollView
          className={`
            ${world === 'map' ? 'flex-1 p-4' : 'w-3/4 p-4'}
          `}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <Text className="text-2xl font-bold text-white text-center mb-6">
            {i18n.t('Create a Hunt')}
          </Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder={i18n.t('Title')}
            placeholderTextColor="#aaa"
            className="bg-white rounded-lg p-3 mb-4"
          />

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={i18n.t('Description')}
            placeholderTextColor="#aaa"
            multiline
            className="bg-white rounded-lg p-3 h-32 mb-4"
          />

          <View className="flex-row justify-between mb-4">
            <TouchableOpacity
              onPress={() => setWorld('real')}
              className={`flex-1 p-3 rounded-lg mr-2 ${world === 'real' ? 'bg-blue-600' : 'bg-white'}`}
            >
              <Text className={`${world === 'real' ? 'text-white' : 'text-gray-700'} text-center`}>
                {i18n.t('Real World')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setWorld('map')}
              className={`flex-1 p-3 rounded-lg ${world === 'map' ? 'bg-blue-600' : 'bg-white'}`}
            >
              <Text className={`${world === 'map' ? 'text-white' : 'text-gray-700'} text-center`}>
                {i18n.t('Map World')}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white">{i18n.t('Unlimited Duration')}</Text>
            <Switch
              value={unlimited}
              onValueChange={setUnlimited}
              className="transform scale-125"
            />
          </View>
          {!unlimited && (
            <View className="mb-4">
              <DateTimePicker
                value={endDate}
                mode="datetime"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, d) => d && setEndDate(d)}
              />
            </View>
          )}

          <View className="flex-row justify-between mb-4">
            <TouchableOpacity
              onPress={() => setMode('public')}
              className={`flex-1 p-3 rounded-lg mr-2 ${mode === 'public' ? 'bg-green-600' : 'bg-white'}`}
            >
              <Text className={`${mode === 'public' ? 'text-white' : 'text-gray-700'} text-center`}>
                {i18n.t('Public')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMode('private')}
              className={`flex-1 p-3 rounded-lg ${mode === 'private' ? 'bg-green-600' : 'bg-white'}`}
            >
              <Text className={`${mode === 'private' ? 'text-white' : 'text-gray-700'} text-center`}>
                {i18n.t('Private')}
              </Text>
            </TouchableOpacity>
          </View>

          <TextInput
            value={maxUsers}
            onChangeText={setMaxUsers}
            placeholder={i18n.t('Max Participants (leave empty)')}
            placeholderTextColor="#aaa"
            keyboardType="number-pad"
            className="bg-white rounded-lg p-3 mb-6"
          />

          <TouchableOpacity
            onPress={onSubmit}
            disabled={loading}
            className="bg-purple-600 py-3 rounded-lg items-center mb-8 disabled:opacity-50"
          >
            <Text className="text-white font-bold">
              {loading ? i18n.t('Creating…') : i18n.t('Create a Hunt')}
            </Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Colonne map */}
        {world === 'map' && (
          <View className="flex-1 border-l border-white/20">
            <DrawingMap />
          </View>
        )}
      </View>
    </ImageBackground>
  )
}
