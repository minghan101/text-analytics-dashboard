import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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

      { /* Upload Area */}
      <Text style={styles.title}>Upload Your Dataset</Text>
      <FileUpload />

      {/* Records List */}
      <RecordsList onSelectRecord={handleSelectRecord} />  {/* Pass the function for selecting a record */}

        {/* Display the Diagrams */}
        <DiagramsViewer />  {/* display the dynamic diagrams */}
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
