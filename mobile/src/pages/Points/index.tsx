import React, { useState, useEffect } from 'react';
import Constants from 'expo-constants';
import { Feather as Icon } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';

import server from '../../services/server';
import styles from './styles';

interface Category {
  id: number;
  name: string;
  image_url: string;
}

interface Point {
  id: number;
  summary: string;
  image: string;
  image_url: string;
  latitude: number;
  longitude: number;
}

interface LocaleData {
  state: string;
  city: string;
}

export default function Points() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  
  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as LocaleData;

  useEffect(() => {
    server.get('categories').then(response => {
      setCategories(response.data);
    });
  });

  useEffect(() => {
    server.get('points', {
      params: {
        city: routeParams.city,
        state: routeParams.state,
        categories: selectedCategories,
      }
    }).then(response => {
      setPoints(response.data);
    });
  }, [selectedCategories]);

  useEffect(() => {
    async function loadPosition() {
      const { status } = await Location.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Precisamos da sua permissão para obter sua localização.');
        return;
      }

      const location = await Location.getCurrentPositionAsync();

      const { latitude, longitude } = location.coords;

      setInitialPosition([
        latitude,
        longitude,
      ]);
    };

    loadPosition();
  }, []);

  function handleNavigateBack() {
    navigation.goBack();
  }

  function handleNavigateToDetails(id: number) {
    navigation.navigate('Details', { pointId: id });
  }

  function handleCategoryCheck(id: number) {
    const alreadySelected = selectedCategories.findIndex(category => category === id);

    let categories = [];

    if (alreadySelected >= 0) {
      categories = selectedCategories.filter(category => category !== id);
    } else {
      categories = [
        ...selectedCategories, id,
      ];
    }

    setSelectedCategories(categories);
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Text style={styles.title}>
          Bem-vindo(a)
        </Text>
        <Text style={styles.description}>
          Encontre no mapa um ponto de coleta.
        </Text>

        <View style={styles.mapContainer}>
          { initialPosition[0] !== 0 && (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: initialPosition[0],
                longitude: initialPosition[1],
                latitudeDelta: 0.014,
                longitudeDelta: 0.014,
              }}
            >
              {points.map(point => (
                <Marker
                  style={styles.mapMarker}
                  coordinate={{
                    latitude: point.latitude,
                    longitude: point.longitude,
                  }}
                  onPress={() => handleNavigateToDetails(point.id)}
                  key={String(point.id)}
                >
                  <View style={styles.mapMarkerContainer}>
                    <Image
                      style={styles.mapMarkerImage}
                      source={{
                        uri: point.image_url,
                      }}
                    />
                    <Text style={styles.mapMarkerTitle}>point.name</Text>
                  </View>
                </Marker>
              ))}
            </MapView>
          ) }
        </View>
      </View>

      <View style={styles.itemsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
        >
          {categories.map(category => (
            <TouchableOpacity
              style={[
                styles.item,
                selectedCategories.includes(category.id) ? styles.selectedItem : {},
              ]}
              onPress={() => handleCategoryCheck(category.id)}
              key={String(category.id)}
              activeOpacity={0.6}
            >
              <SvgUri uri={category.image_url} width={42} height={42} />
              <Text style={styles.itemTitle}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </>
  );
}
