import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FileUpload from '../components/FileUpload';

const UploadScreen = () => {
  return (
    <View style={styles.container}>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default UploadScreen;
