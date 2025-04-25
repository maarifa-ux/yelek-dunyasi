import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import {BottomTabNavigator} from './BottomTabNavigator';
import {useAuth} from '../context/AuthContext';
import {AnnouncementDetailScreen} from '../screens/announcements/AnnouncementDetailScreen';
import {ClubDetailScreen} from '../screens/clubs/ClubDetailScreen';
import {EventDetailScreen} from '../screens/events/EventDetailScreen';
import EventsScreen from '../screens/events/EventsScreen';
import {MyEventsScreen} from '../screens/events/MyEventsScreen';
import {ProductDetailScreen} from '../screens/marketplace/ProductDetailScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import {ClubsListScreen} from '../screens/clubs/ClubsListScreen';
import NotificationsScreen from '../screens/settings/NotificationsScreen';
import PrivacyScreen from '../screens/settings/PrivacyScreen';
import ThemeScreen from '../screens/settings/ThemeScreen';
import LanguageScreen from '../screens/settings/LanguageScreen';
import RoutesScreen from '../screens/routes/RoutesScreen';
import RouteDetailScreen from '../screens/routes/RouteDetailScreen';
import {CreateEventScreen} from '../screens/events/CreateEventScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  const {user} = useAuth();

  if (!user) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{headerShown: true, headerTitle: 'Kayıt Ol'}}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AnnouncementDetail"
        component={AnnouncementDetailScreen}
        options={{headerShown: true, headerTitle: 'Duyuru Detayı'}}
      />
      <Stack.Screen
        name="ClubDetail"
        component={ClubDetailScreen}
        options={{headerShown: true, headerTitle: 'Kulüp Detayı'}}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{headerShown: true, headerTitle: 'Etkinlik Detayı'}}
      />
      <Stack.Screen
        name="EventsScreen"
        component={EventsScreen}
        options={{headerShown: true, headerTitle: 'Etkinlikler'}}
      />
      <Stack.Screen
        name="MyEvents"
        component={MyEventsScreen}
        options={{headerShown: true, headerTitle: 'Etkinliklerim'}}
      />
      <Stack.Screen
        name="CreateEvent"
        component={CreateEventScreen}
        options={{headerShown: true, headerTitle: 'Yeni Etkinlik'}}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
        options={{headerShown: true, headerTitle: 'Ürün Detayı'}}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{headerShown: true, headerTitle: 'Ayarlar'}}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{headerShown: true, headerTitle: 'Profili Düzenle'}}
      />
      <Stack.Screen
        name="ClubsListScreen"
        component={ClubsListScreen}
        options={{headerShown: true, headerTitle: 'Kulüpler'}}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{headerShown: true, headerTitle: 'Bildirimler'}}
      />
      <Stack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{headerShown: true, headerTitle: 'Gizlilik'}}
      />
      <Stack.Screen
        name="Theme"
        component={ThemeScreen}
        options={{headerShown: true, headerTitle: 'Tema'}}
      />
      <Stack.Screen
        name="Language"
        component={LanguageScreen}
        options={{headerShown: true, headerTitle: 'Dil Seçenekleri'}}
      />
      <Stack.Screen
        name="PopularRoutes"
        component={RoutesScreen}
        options={{headerShown: true, headerTitle: 'Popüler Rotalar'}}
      />
      <Stack.Screen
        name="RouteDetail"
        component={RouteDetailScreen}
        options={{headerShown: true, headerTitle: 'Rota Detayı'}}
      />
    </Stack.Navigator>
  );
};
