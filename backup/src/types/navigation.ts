import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  AnnouncementDetail: { announcementId: string };
  ClubDetail: { clubId: string };
  EventDetail: { eventId: string };
  Profile: undefined;
  Settings: undefined;
  Marketplace: undefined;
  ProductDetail: {
    product: {
      id: string;
      name: string;
      description: string;
      price: number;
      stock: number;
      images: string[];
      clubName: string;
      clubLogo: string;
      specifications?: Record<string, string>;
    };
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
