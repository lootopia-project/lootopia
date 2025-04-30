import React, { useState, useEffect, useMemo } from 'react'
import {
  View,
  Text,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { getPublicHuntings } from '@/services/HuntingService'
import { Hunting } from '@/type/feature/hunting/Hunting'
import { useLanguage } from '@/hooks/providers/LanguageProvider'
import HuntingDetails from './huntingDetails'

export default function PublicHuntings() {
  const [publicHuntings, setPublicHuntings] = useState<Hunting[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const itemsPerPage = 6
  const { i18n } = useLanguage()
  const [sortOption, setSortOption] = useState<string>('')
  const [selectedHunt, setSelectedHunt] = useState<Hunting | null>(null)

  useEffect(() => {
    const fetchPublicHuntings = async () => {
      setLoading(true)
      try {
        const hunts = await getPublicHuntings()
        setPublicHuntings(hunts)
      } catch (err) {
        console.warn('Erreur récupération chasses publiques :', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPublicHuntings()
  }, [])

  const filtered = useMemo(
    () => publicHuntings.filter(h =>
      h.title.toLowerCase().includes(search.toLowerCase())
    ),
    [publicHuntings, search]
  )

  const sorted = useMemo(() => {
    const arr = [...filtered]
    if (sortOption === 'price_asc') arr.sort((a, b) => +a.price - +b.price)
    if (sortOption === 'price_desc') arr.sort((a, b) => +b.price - +a.price)
    if (sortOption === 'players_asc') arr.sort((a, b) => a.maxUser - b.maxUser)
    if (sortOption === 'players_desc') arr.sort((a, b) => b.maxUser - a.maxUser)
    return arr
  }, [filtered, sortOption])

  const totalPages = useMemo(() => Math.ceil(sorted.length / itemsPerPage), [sorted])
  const pageHuntings = useMemo(
    () => sorted.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [sorted, page]
  )

  if (selectedHunt) {
    return (
      <HuntingDetails
        hunt={selectedHunt}
        onClose={() => setSelectedHunt(null)}
      />
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{ uri: 'https://lootopia.blob.core.windows.net/lootopia-photos/FFJFCIJECEAEGCE.jpeg' }}
        style={{ flex: 1, justifyContent: 'center' }}
        resizeMode="cover"
      >
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)' }} />
        <View style={{ flex: 1, paddingTop: 20, paddingHorizontal: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', alignSelf: 'center', marginBottom: 16, fontFamily: 'BerkshireSwash-Regular' }}>
            {i18n.t('Join public hunt')}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <TextInput
              style={{ flex: 1, backgroundColor: '#fff', borderRadius: 8, marginRight: 8, paddingHorizontal: 10, paddingVertical: 8, fontFamily: 'BerkshireSwash-Regular' }}
              placeholder="Rechercher ..."
              placeholderTextColor="#555"
              value={search}
              onChangeText={setSearch}
            />
            <Picker
              selectedValue={sortOption}
              onValueChange={val => { setSortOption(val); setPage(1) }}
              style={{ width: 150, backgroundColor: '#fff', borderRadius: 8, fontFamily: 'BerkshireSwash-Regular' }}
            >
              <Picker.Item label="Filtrer" value="" />
              <Picker.Item label={`${i18n.t('Price')} ↑`} value="price_asc" />
              <Picker.Item label={`${i18n.t('Price')} ↓`} value="price_desc" />
              <Picker.Item label={`${i18n.t('Players')} ↑`} value="players_asc" />
              <Picker.Item label={`${i18n.t('Players')} ↓`} value="players_desc" />
            </Picker>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
          ) : (
            <>
              <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                  {pageHuntings.map(hunt => (
                    <View key={hunt.id} style={{ width: '32%', backgroundColor: '#fff', borderRadius: 8, marginBottom: 16, padding: 10, minHeight: 220 }}>
                      <Image source={{ uri: hunt.headerImg }} style={{ width: '100%', height: 150, borderRadius: 6, marginBottom: 8 }} />
                      <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 4, fontFamily: 'BerkshireSwash-Regular' }}>{hunt.title}</Text>
                      <Text style={{ fontSize: 12, color: '#333', marginBottom: 4, fontFamily: 'BerkshireSwash-Regular' }}>{hunt.description}</Text>
                      <Text style={{ fontSize: 12, color: '#333', marginBottom: 4, fontFamily: 'BerkshireSwash-Regular' }}>{i18n.t('Price')}: {hunt.price}</Text>
                      <Text style={{ fontSize: 12, color: '#333', marginBottom: 4, fontFamily: 'BerkshireSwash-Regular' }}>Max: {hunt.maxUser}</Text>
                      <Text style={{ fontSize: 12, color: '#333', marginBottom: 8, fontFamily: 'BerkshireSwash-Regular' }}>{i18n.t('End')}: {new Date(hunt.endDate).toLocaleDateString()}</Text>
                      <Text style={{ fontSize: 12, color: '#333', marginBottom: 8, fontFamily: 'BerkshireSwash-Regular' }}>{i18n.t('Status')}: {hunt.status ? 'Active' : 'Inactive'}</Text>
                      <TouchableOpacity
                        onPress={() => setSelectedHunt(hunt)}
                        style={{ backgroundColor: '#90EE90', paddingVertical: 6, borderRadius: 6, alignItems: 'center', marginBottom: 2 }}
                      >
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12, fontFamily: 'BerkshireSwash-Regular' }}>{i18n.t('View Details')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => console.log('Rejoindre chasse ID:', hunt.id)}
                        style={{ backgroundColor: '#000', paddingVertical: 6, borderRadius: 6, alignItems: 'center' }}
                      >
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12, fontFamily: 'BerkshireSwash-Regular' }}>{i18n.t('Join')}</Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>

              {totalPages > 1 && (
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                  <TouchableOpacity onPress={() => setPage(p => p - 1)} disabled={page === 1} style={{ padding: 10, marginHorizontal: 5 }}>
                    <Text style={{ color: page === 1 ? '#999' : '#fff', fontFamily: 'BerkshireSwash-Regular' }}>{i18n.t('Previous')}</Text>
                  </TouchableOpacity>
                  <Text style={{ color: '#fff', marginHorizontal: 8, fontFamily: 'BerkshireSwash-Regular' }}>{page} / {totalPages}</Text>
                  <TouchableOpacity onPress={() => setPage(p => p + 1)} disabled={page === totalPages} style={{ padding: 10, marginHorizontal: 5 }}>
                    <Text style={{ color: page === totalPages ? '#999' : '#fff', fontFamily: 'BerkshireSwash-Regular' }}>{i18n.t('Next')}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>
      </ImageBackground>
    </View>
  )
}
