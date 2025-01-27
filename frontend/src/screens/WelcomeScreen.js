import React from 'react';
import { View, Text, StyleSheet, Image, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../assets/colors.js'
import { fonts } from '../../assets/fonts.js'

const WelcomeScreen = ({ navigation }) => {
  return (
    <ImageBackground
      source={require('../../assets/background.png')} // Replace with your background image path
      style={styles.background}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer} // Ensures scrolling behavior
        showsVerticalScrollIndicator={true} // Enables scroll indicator
      >
        <View style={styles.innerContainer}>
          <Image
            source={require('../../assets/botsquad.jpg')} // Your existing image
            style={styles.image}
          />
          <Text style={styles.title}>Welcome to Bot Squad's submission!</Text>
          <TouchableOpacity
            style={styles.customButton} // Style for the custom button
            onPress={() => navigation.navigate('Upload')} // Navigate to the Upload screen
          >
            <Text style={styles.buttonText}>Start uploading your dataset!</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1, // Ensures background spans entire screen
    resizeMode: 'cover',
  },
  scrollContainer: {
    flexGrow: 1, // Allows ScrollView to grow beyond its size
    justifyContent: 'center', // Centers content when not scrolling
    paddingVertical: 20, // Adds space at the top and bottom
  },
  innerContainer: {
    alignItems: 'center', // Centers content horizontally
  },
  title: {
    fontSize: 24,
    fontFamily: 'Bold', // Custom font for title
    color: '#fff', // Adjust for better visibility
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    height: 450, // Large image height
    width: 450, // Full width
    marginBottom: 20, // Add space below the image
  },
  customButton: {
    backgroundColor: colors.neonpink, // Button background color
    paddingVertical: 12, // Vertical padding
    paddingHorizontal: 20, // Horizontal padding
    borderRadius: 8, // Rounded corners
  },
  buttonText: {
    fontSize: 15, // Font size for the button text
    fontFamily: fonts.Bold, // Use your custom Bold font here
    color: 'white', // Text color
    textAlign: 'center',
  },
});

export default WelcomeScreen;
