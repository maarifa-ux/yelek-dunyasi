export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  AnnouncementDetail: {id?: string; publisherId?: string};
  ClubDetail: {id: string};
  ClubsListScreen: {categoryId?: string; tagId?: string; searchQuery?: string};
  EventDetail: {eventId: string};
  ProductDetail: {id: string; categoryId?: string};
  Settings: undefined;
  EditProfile: undefined;
  MyEvents: {filter?: 'past' | 'upcoming' | 'all'};
  EventsScreen: {clubId?: string; filter?: 'past' | 'upcoming' | 'all' | 'my'};
  Notifications: {isRead?: boolean};
  Privacy: undefined;
  Theme: undefined;
  Language: undefined;
  PopularRoutes: {
    searchQuery?: string;
    cityFilter?: string;
    difficultyFilter?: string;
    typeFilter?: string;
  };
  RouteDetail: {id: string};
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
