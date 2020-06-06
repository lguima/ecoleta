import React, { useState, useEffect } from 'react';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { View, Text, Image, TouchableOpacity, SafeAreaView, Linking } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import * as MailComposer from 'expo-mail-composer';

import server from '../../services/server';
import styles from './styles';

interface RouteParams {
  pointId: number;
}

interface PointData {
  point: {
    summary: string;
    image: string;
    image_url: string;
    email: string;
    phone: string;
    state: string;
    city: string;
  };
  categories: {
    title: string;
  }[];
}

function Details() {
  const route = useRoute();
  const routeParams = route.params as RouteParams;

  const navigation = useNavigation();

  const [pointData, setPointData] = useState<PointData>({} as PointData);

  /**
   * Fetch and set point data.
   */
  useEffect(() => {
    server.get(`points/${routeParams.pointId}`).then(response => {
      setPointData(response.data);
    });
  }, []);

  function handleCallOnWhatsApp() {
    Linking.openURL(`whatsapp://send?phone=${pointData.point.phone}&text=Tenho interesse`);
  }

  function handleComposeMail() {
    MailComposer.composeAsync({
      subject: 'Tenho interesse',
      recipients: [
        pointData.point.email,
      ]
    });
  }

  function handleNavigateBack() {
    navigation.goBack();
  }

  if (!pointData.point) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleNavigateBack}>
          <Icon name="arrow-left" size={20} color="#34cb79" />
        </TouchableOpacity>

        <Image
          style={styles.pointImage}
          source={{
            uri: pointData.point.image_url,
          }}
        />

        <Text style={styles.pointName}>{pointData.point.summary}</Text>
        <Text style={styles.pointItems}>
          {pointData.categories.map(category => category.title).join(', ')}
        </Text>

        <View style={styles.address}>
          <Text style={styles.addressTitle}>Endereço</Text>
          <Text style={styles.addressContent}>
            {pointData.point.city}, {pointData.point.state}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleCallOnWhatsApp}>
          <FontAwesome name="whatsapp" size={20} color="#fff" />
          <Text style={styles.buttonText}>WhatsApp</Text>
        </RectButton>

        <RectButton style={styles.button} onPress={handleComposeMail}>
          <Icon name="mail" size={20} color="#fff" />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
}

export default Details;
