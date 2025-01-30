import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ImageBackground } from 'react-native';
import FileUpload from '../components/FileUpload';
import { colors } from '../../assets/colors.js';
import { fonts } from '../../assets/fonts.js';
import { RecordsList } from "../components/RecordsList";
import { DiagramsViewer } from '../components/DiagramsViewer';

const UploadScreen = ({ navigation }) => {
    // Handle record selection
    const handleSelectRecord = (recordId) => {
      console.log("Selected Record ID:", recordId);
    };

    return (
        <ImageBackground 
            source={{ uri: "https://i.pinimg.com/originals/cc/e9/28/cce9286056ef159d91a74de07ae24e6a.gif" }} 
            style={styles.background}
        >
            <View style={styles.container}>
                {/* Back Button */}
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Welcome")}>
                    <Text style={styles.backButtonText}>← Back</Text>
                </TouchableOpacity>

                {/* Scrollable content */}
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Upload Area */}
                    <Text style={styles.title}>Upload Your Dataset</Text>
                    <FileUpload />

                    {/* Records List */}
                    <RecordsList onSelectRecord={handleSelectRecord} />  

                    {/* Display the Diagrams */}
                    <DiagramsViewer />  
                </ScrollView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
  background: {
    flex: 1, 
    resizeMode: "cover", // Ensures the GIF covers the screen
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Optional overlay for better text visibility
    /* backgroundColor: '#f0f0f0',*/
  },
  backButton: {
    position: 'absolute',
    top: 40, 
    left: 20, 
    backgroundColor: colors.neonpink,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    zIndex: 1, 
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fonts.Bold,
  },
  title: {
    fontSize: 48,
    fontFamily: fonts.Bold, 
    color: colors.neonblue,
    marginBottom: 20,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 100, 
    paddingBottom: 20,
    alignItems: 'center',
  },
});

export default UploadScreen;
