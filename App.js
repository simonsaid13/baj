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
import AnimatedTabsDetailScreen from './screens/AnimatedTabsDetailScreen';
import InputBarDetailScreen from './screens/InputBarDetailScreen';
import ButtonComponentsDetailScreen from './screens/ButtonComponentsDetailScreen';
import DragComponentDetailScreen from './screens/DragComponentDetailScreen';
import ContextBarDetailScreen from './screens/ContextBarDetailScreen';
import CardDetailScreen from './screens/CardDetailScreen';
import LoanDetailScreen from './screens/LoanDetailScreen';
import ProductDetailScreen from './screens/ProductDetailScreen';
import TransactionDetailScreen from './screens/TransactionDetailScreen';
import ServiceDetailScreen from './screens/ServiceDetailScreen';

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
            <Stack.Screen name="AnimatedTabsDetail" component={AnimatedTabsDetailScreen} />
            <Stack.Screen name="InputBarDetail" component={InputBarDetailScreen} />
            <Stack.Screen name="DragComponentDetail" component={DragComponentDetailScreen} />
            <Stack.Screen name="ContextBarDetail" component={ContextBarDetailScreen} />
            <Stack.Screen name="CardDetail" component={CardDetailScreen} />
            <Stack.Screen name="LoanDetail" component={LoanDetailScreen} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="TransactionDetail" component={TransactionDetailScreen} />
            <Stack.Screen name="ServiceDetail" component={ServiceDetailScreen} />
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
