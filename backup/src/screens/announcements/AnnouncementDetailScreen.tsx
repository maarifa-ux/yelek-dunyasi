import React from 'react';
import { View, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';

type AnnouncementDetailRouteProp = RouteProp<
  RootStackParamList,
  'AnnouncementDetail'
>;

export const AnnouncementDetailScreen = () => {
  const route = useRoute<AnnouncementDetailRouteProp>();
  const { announcementId } = route.params;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Duyuru Detay Sayfası: {announcementId}</Text>
    </View>
  );
};
