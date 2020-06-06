import React, { useState } from 'react';
import { View, Image, ImageBackground, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather as Icon } from '@expo/vector-icons';
import { RectButton } from 'react-native-gesture-handler';

import styles from './styles';

function Home() {
  const [state, setState] = useState('');
  const [city, setCity] = useState('');

  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      state,
      city,
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        style={styles.container}
        source={require('../../assets/home-background.png')}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>Seu marketplace de coleta de resíduos.</Text>
            <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <TextInput
            style={styles.input}
            placeholder="Digite seu estado"
            value={state}
            onChangeText={setState}
            maxLength={2}
            autoCapitalize="characters"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Digite sua cidade"
            value={city}
            onChangeText={setCity}
            autoCorrect={false}
          />

          <RectButton style={styles.button} onPress={handleNavigateToPoints}>
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#fff" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
            </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

export default Home;
