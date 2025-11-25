import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExploreScreen from './screens/ExploreScreen';
import DesignSystemScreen from './screens/DesignSystemScreen';
import ComponentDetailScreen from './screens/ComponentDetailScreen';
import TabBarDetailScreen from './screens/TabBarDetailScreen';
import InputBarDetailScreen from './screens/InputBarDetailScreen';
import ButtonComponentsDetailScreen from './screens/ButtonComponentsDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.container}>
        <NavigationContainer>
          <StatusBar style="dark" />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="Explore" component={ExploreScreen} />
            <Stack.Screen name="DesignSystem" component={DesignSystemScreen} />
            <Stack.Screen name="ComponentDetail" component={ComponentDetailScreen} />
            <Stack.Screen name="ButtonComponentsDetail" component={ButtonComponentsDetailScreen} />
            <Stack.Screen name="TabBarDetail" component={TabBarDetailScreen} />
            <Stack.Screen name="InputBarDetail" component={InputBarDetailScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
