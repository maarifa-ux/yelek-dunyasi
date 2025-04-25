import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LoginScreen } from '../components';
import { ROUTES } from '../constants';
import { useAuthStore } from '../store';

// Geçici ekranlar (daha sonra gerçek ekranlarla değiştirilecek)
const TempScreen = () => {
  return <LoginScreen />;
};

// Navigator tipleri
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Ana tab navigasyon
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen
        name={ROUTES.TABS.HOME_TAB}
        component={TempScreen}
        options={{
          tabBarLabel: 'Ana Sayfa',
        }}
      />
      <Tab.Screen
        name={ROUTES.TABS.DISCOVERY_TAB}
        component={TempScreen}
        options={{
          tabBarLabel: 'Keşfet',
        }}
      />
      <Tab.Screen
        name={ROUTES.TABS.EVENTS_TAB}
        component={TempScreen}
        options={{
          tabBarLabel: 'Etkinlikler',
        }}
      />
      <Tab.Screen
        name={ROUTES.TABS.NOTIFICATIONS_TAB}
        component={TempScreen}
        options={{
          tabBarLabel: 'Bildirimler',
        }}
      />
      <Tab.Screen
        name={ROUTES.TABS.PROFILE_TAB}
        component={TempScreen}
        options={{
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
};

// Ana navigasyon
const AppNavigator = () => {
  const { isAuthenticated, user } = useAuthStore();
  const isProfileCompleted = user?.isProfileCompleted || false;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAuthenticated ? (
        isProfileCompleted ? (
          // Ana ekranlar
          <>
            <Stack.Screen name={ROUTES.MAIN.HOME} component={TabNavigator} />
            <Stack.Screen name={ROUTES.MAIN.PROFILE} component={TempScreen} />
            {/* Diğer ana ekranlar burada eklenecek */}
          </>
        ) : (
          // Profil tamamlama ekranı
          <Stack.Screen
            name={ROUTES.AUTH.PROFILE_COMPLETION}
            component={TempScreen}
          />
        )
      ) : (
        // Kimlik doğrulama ekranları
        <>
          <Stack.Screen name={ROUTES.AUTH.LOGIN} component={LoginScreen} />
          <Stack.Screen name={ROUTES.AUTH.REGISTER} component={TempScreen} />
          <Stack.Screen
            name={ROUTES.AUTH.FORGOT_PASSWORD}
            component={TempScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
