import React from 'react';
import { View, Text } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';

type ClubDetailRouteProp = RouteProp<RootStackParamList, 'ClubDetail'>;

export const ClubDetailScreen = () => {
  const route = useRoute<ClubDetailRouteProp>();
  const { clubId } = route.params;

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Kulüp Detay Sayfası: {clubId}</Text>
    </View>
  );
};
