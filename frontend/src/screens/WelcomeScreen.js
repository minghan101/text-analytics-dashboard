import React from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native'; // Import LottieView
import { colors } from '../../assets/colors.js';
import { fonts } from '../../assets/fonts.js';

const { width } = Dimensions.get('window'); // Get screen dimensions for responsiveness

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: "https://media1.tenor.com/m/QR_vYEv43U0AAAAC/lawn-mowing.gif" }} 
        /*source={require('../../assets/background.png')}*/
        style={styles.background}
        resizeMode="cover"
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={true} // Enable vertical scroll indicator
        >
          <View style={styles.innerContainer}>
            {/* Lottie Animation */}
            <LottieView
              source={require('../../assets/lottie/videogame.json')} // Path to Lottie JSON file
              autoPlay
              loop
              style={styles.lottie}
            />

            {/* Welcome Text */}
            <Text style={styles.title}>Welcome to Bot Squad's submission!</Text>

            {/* Button */}
            <TouchableOpacity
              style={styles.customButton}
              onPress={() => navigation.navigate('Upload')}
            >
              <Text style={styles.buttonText}>Start uploading your dataset!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center', // Center the content
    paddingBottom: 20, // Add padding to ensure scrollability
  },
  innerContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 36, // Keep a large, bold text
    fontFamily: fonts.Bold,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  lottie: {
    width: width * 0.8, // Increased size for the Lottie animation
    height: width * 0.8,
  },
  customButton: {
    backgroundColor: colors.neonpink,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: fonts.Bold,
    color: '#fff',
    textAlign: 'center',
  },
});

export default WelcomeScreen;
