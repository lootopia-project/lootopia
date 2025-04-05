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
import { useLanguage } from "@/hooks/providers/LanguageProvider";
import { Link } from 'expo-router'

export default function PublicHuntings() {
  const [publicHuntings, setPublicHuntings] = useState<Hunting[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const itemsPerPage = 6
  const { i18n } = useLanguage();
  const [sortOption, setSortOption] = useState<string>('')

  useEffect(() => {
    const fetchPublicHuntings = async () => {
      try {
        setLoading(true)
        const hunts = await getPublicHuntings()
        setPublicHuntings(hunts)
      } catch (err) {
        console.warn('Erreur lors de la récupération des chasses publiques :', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPublicHuntings()
  }, [])

  const filteredHuntings = useMemo(() => {
    return publicHuntings.filter(hunt =>
      hunt.title.toLowerCase().includes(search.toLowerCase())
    )
  }, [publicHuntings, search])

  // Tri selon sortOption
  const sortedHuntings = useMemo(() => {
    const huntsCopy = [...filteredHuntings]
    if (sortOption === 'price_asc') {
      huntsCopy.sort((a, b) => parseFloat(a.price.toString()) - parseFloat(b.price.toString()))
    } else if (sortOption === 'price_desc') {
      huntsCopy.sort((a, b) => parseFloat(b.price.toString()) - parseFloat(a.price.toString()))
    } else if (sortOption === 'players_asc') {
      huntsCopy.sort((a, b) => a.maxUser - b.maxUser)
    } else if (sortOption === 'players_desc') {
      huntsCopy.sort((a, b) => b.maxUser - a.maxUser)
    }
    return huntsCopy
  }, [filteredHuntings, sortOption])

  const totalPages = useMemo(() => Math.ceil(sortedHuntings.length / itemsPerPage), [sortedHuntings])
  const pageHuntings = useMemo(() => {
    return sortedHuntings.slice((page - 1) * itemsPerPage, page * itemsPerPage)
  }, [sortedHuntings, page])


  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={{
          uri: 'https://lootopia.blob.core.windows.net/lootopia-photos/FFJFCIJECEAEGCE.jpeg',
        }}
        style={{ flex: 1, justifyContent: 'center' }}
        resizeMode="cover"
      >
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.2)',
          }}
        />

        <View style={{ flex: 1, paddingTop: 20, paddingHorizontal: 16 }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#fff',
              alignSelf: 'center',
              marginBottom: 16,
              fontFamily: 'BerkshireSwash-Regular',
            }}
          >
            {i18n.t("Join public hunt")}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                backgroundColor: '#fff',
                borderRadius: 8,
                marginRight: 8,
                paddingHorizontal: 10,
                paddingVertical: 8,
                fontFamily: 'BerkshireSwash-Regular',
              }}
              placeholder="Rechercher ..."
              placeholderTextColor="#555"
              onChangeText={setSearch}
              value={search}
            />
            <Picker
              selectedValue={sortOption}
              onValueChange={(itemValue) => {
                setSortOption(itemValue)
                setPage(1)
              }}
              style={{
                width: 150,
                backgroundColor: '#fff',
                borderRadius: 8,
                fontFamily: 'BerkshireSwash-Regular',
              }}
            >
              <Picker.Item label="Filtrer" value="" />
              <Picker.Item label={`${i18n.t("Price")} ↑`} value="price_asc" />
              <Picker.Item label={`${i18n.t("Price")} ↓`} value="price_desc" />
              <Picker.Item label={`${i18n.t("Players")} ↑`} value="players_asc" />
              <Picker.Item label={`${i18n.t("Players")} ↓`} value="players_desc" />
            </Picker>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#fff" style={{ marginTop: 20 }} />
          ) : (
            <>
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  {pageHuntings.map((hunt) => (
                    <View
                      key={hunt.id}
                      style={{
                        width: '32%',
                        backgroundColor: '#fff',
                        borderRadius: 8,
                        marginBottom: 16,
                        padding: 10,
                        minHeight: 220,
                      }}
                    >
                      <Image
                        source={{
                          uri: hunt.headerImg || 'https://lootopia.blob.core.windows.net/lootopia-photos/FFJFCIJECEAEGCE.jpeg',
                        }}
                        style={{
                          width: '100%',
                          height: 150,
                          borderRadius: 6,
                          marginBottom: 8,
                        }}
                      />
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          marginBottom: 4,
                          fontFamily: 'BerkshireSwash-Regular',
                        }}
                      >
                        {hunt.title}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          marginBottom: 4,
                          color: '#333',
                          fontFamily: 'BerkshireSwash-Regular',
                        }}
                      >
                        {hunt.description}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          marginBottom: 4,
                          color: '#333',
                          fontFamily: 'BerkshireSwash-Regular',
                        }}
                      >
                        {i18n.t("Price")} : {hunt.price}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          marginBottom: 4,
                          color: '#333',
                          fontFamily: 'BerkshireSwash-Regular',
                        }}
                      >
                        Max: {hunt.maxUser}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          marginBottom: 4,
                          color: '#333',
                          fontFamily: 'BerkshireSwash-Regular',
                        }}
                      >

                        {i18n.t("End")}:{new Date(hunt.endDate).toLocaleDateString()}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          marginBottom: 8,
                          color: '#333',
                          fontFamily: 'BerkshireSwash-Regular',
                        }}
                      >
                        {i18n.t("Status")}: {hunt.status ? 'Active' : 'Inactive'}
                      </Text>
                      <Link
                        href={{
                          pathname: '/hunting/huntingDetails', 
                          params: { hunt: JSON.stringify(hunt) }, 
                        }}
                        asChild
                      >
                        <TouchableOpacity style={{ marginTop: 10 }}>
                          <Text style={{ color: '#007bff' }}>Voir détails</Text>
                        </TouchableOpacity>
                      </Link>
                      <TouchableOpacity
                        style={{
                          backgroundColor: '#000',
                          paddingVertical: 6,
                          borderRadius: 6,
                          alignItems: 'center',
                        }}
                        onPress={() => console.log('Rejoindre la chasse ID:', hunt.id)}
                      >
                        <Text
                          style={{
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: 12,
                            fontFamily: 'BerkshireSwash-Regular',
                          }}
                        >
                          {i18n.t("Join")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>

              {totalPages > 1 && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                >
                  <TouchableOpacity
                    style={{ padding: 10, marginHorizontal: 5 }}
                    onPress={() => setPage((prev) => prev - 1)}
                    disabled={page === 1}
                  >
                    <Text
                      style={{
                        color: page === 1 ? '#999' : '#fff',
                        fontFamily: 'BerkshireSwash-Regular',
                      }}
                    >
                      {i18n.t("Previous")}:
                    </Text>
                  </TouchableOpacity>

                  <Text
                    style={{
                      color: '#fff',
                      marginHorizontal: 8,
                      fontFamily: 'BerkshireSwash-Regular',
                    }}
                  >
                    {page} / {totalPages}
                  </Text>

                  <TouchableOpacity
                    style={{ padding: 10, marginHorizontal: 5 }}
                    onPress={() => setPage((prev) => prev + 1)}
                    disabled={page === totalPages}
                  >
                    <Text
                      style={{
                        color: page === totalPages ? '#999' : '#fff',
                        fontFamily: 'BerkshireSwash-Regular',
                      }}
                    >
                      {i18n.t("Next")}:
                    </Text>
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
