import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FileUpload from '../components/FileUpload';
import { colors } from '../../assets/colors.js'; 
import { fonts } from '../../assets/fonts.js'; 

const UploadScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Welcome")}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      { /* Upload Area */}
      <Text style={styles.title}>Upload Your Dataset</Text>
      <FileUpload />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  backButton: {
    position: 'absolute',
    top: 40, // Adjust for your design
    left: 20, // Adjust for your design
    backgroundColor: colors.neonpink,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.Bold,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.Bold, 
    color: colors.neonblue,
    marginBottom: 20,
  },
});

export default UploadScreen;
