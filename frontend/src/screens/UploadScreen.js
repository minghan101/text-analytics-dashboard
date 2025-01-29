import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import FileUpload from '../components/FileUpload';
import { colors } from '../../assets/colors.js';
import { fonts } from '../../assets/fonts.js';
import { RecordsList } from "../components/RecordsList";
import { DiagramsViewer } from '../components/DiagramsViewer';

const UploadScreen = ({ navigation }) => {

    // Handle record selection
    const handleSelectRecord = (recordId) => {
      console.log("Selected Record ID:", recordId);
      // Optionally navigate or perform another action
      // navigation.navigate('RecordText', { recordId });
    };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Welcome")}>
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        { /* Upload Area */}
        <Text style={styles.title}>Upload Your Dataset</Text>
        <FileUpload />

        {/* Records List */}
        <RecordsList onSelectRecord={handleSelectRecord} />  {/* Pass the function for selecting a record */}

        {/* Display the Diagrams */}
        <DiagramsViewer />  {/* display the dynamic diagrams */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    zIndex: 1, // Ensure it's above the scrollable content
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
  scrollContent: {
    flexGrow: 1,  // Ensure scrollable content grows to take available space
    paddingTop: 100, // Adjust for padding so it doesn't overlap with back button
    paddingBottom: 20, // Ensure some space at the bottom
    alignItems: 'center',
  },
});

export default UploadScreen;
