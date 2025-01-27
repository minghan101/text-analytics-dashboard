import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading'; // For handling the font loading screen
import WelcomeScreen from './src/screens/WelcomeScreen';
import UploadScreen from './src/screens/UploadScreen';

const Stack = createStackNavigator();

// Font loading function
const getFonts = () => Font.loadAsync({
  'Bold': require('./assets/fonts/VeraMono-Bold.ttf'),
  'Regular': require('./assets/fonts/VeraMono.ttf'),
});

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  if (!fontsLoaded) {
    return (
      <AppLoading
        startAsync={getFonts} // Start loading fonts
        onFinish={() => setFontsLoaded(true)} // Mark fonts as loaded
        onError={console.warn} // Handle errors
      />
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Upload">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Upload" component={UploadScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
