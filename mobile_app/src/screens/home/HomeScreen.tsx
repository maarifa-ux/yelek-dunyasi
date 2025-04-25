import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {COLORS, FONTS, SIZES} from '../../constants';
import {useAuthStore} from '../../store';
import {Event} from '../../services/eventService';
import {upcomingEvents as mockUpcomingEvents} from '../../data/mockEvents';
import {mockPopularRoutes} from '../../data/mockRoutes';
import {mockClubs} from '../../data/mockClubs';
import {mockAnnouncements} from '../../data/mockAnnouncements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {format} from 'date-fns';
import {tr} from 'date-fns/locale';
import {Route} from '../../services/routeService';
import {Club} from '../../services/clubService';
import {Announcement} from '../../services/announcementService';
import {Button, EventCard} from '../../components';

const HomeScreen: React.FC = () => {
  const {colors} = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {user} = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [popularRoutes, setPopularRoutes] = useState<Route[]>([]);
  const [activeClubs, setActiveClubs] = useState<Club[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isRoutesLoading, setIsRoutesLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // Mock verileri kullan
      setTimeout(() => {
        setUpcomingEvents(mockUpcomingEvents.slice(0, 3)); // İlk 3 etkinlik
        setPopularRoutes(mockPopularRoutes.slice(0, 3)); // İlk 3 rota
        setActiveClubs(mockClubs.slice(0, 3)); // İlk 3 kulüp
        setAnnouncements(mockAnnouncements.slice(0, 3)); // İlk 3 duyuru
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Ana sayfa verileri alınırken hata:', error);
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderEventCard = (event: Event) => (
    <TouchableOpacity
      key={event.id}
      style={[styles.eventCard, {backgroundColor: colors.card}]}
      onPress={() => navigation.navigate('EventDetail', {eventId: event.id})}>
      <View style={styles.eventHeader}>
        <Text
          style={{...styles.eventTitle, color: colors.text}}
          numberOfLines={1}>
          {event.title}
        </Text>
        {event.participationStatus === 'JOINED' && (
          <MaterialCommunityIcons
            name="check-circle"
            size={20}
            color={colors.primary}
          />
        )}
      </View>
      <Text style={{...styles.eventDate, color: COLORS.textSecondary}}>
        {format(new Date(event.startDate), 'd MMMM yyyy', {locale: tr})}
      </Text>
      <View style={styles.eventDetails}>
        <View style={styles.eventLocation}>
          <MaterialCommunityIcons
            name="map-marker"
            size={16}
            color={COLORS.textSecondary}
          />
          <Text
            style={{...styles.eventLocationText, color: colors.text}}
            numberOfLines={1}>
            {event.location.city}, {event.location.district}
          </Text>
        </View>
        <View style={styles.eventParticipants}>
          <MaterialCommunityIcons
            name="account-group"
            size={16}
            color={COLORS.textSecondary}
          />
          <Text
            style={{
              ...styles.eventParticipantsText,
              color: COLORS.textSecondary,
            }}>
            {event.currentParticipants}/{event.maxParticipants}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderSmallEventCard = (event: Event) => (
    <TouchableOpacity
      key={event.id}
      style={[styles.smallEventCard, {backgroundColor: colors.card}]}
      onPress={() => navigation.navigate('EventDetail', {eventId: event.id})}>
      <View style={styles.smallEventHeader}>
        <MaterialCommunityIcons
          name={event.eventType === 'RIDE' ? 'bike' : 'account-group'}
          size={18}
          color={colors.primary}
        />
        <Text
          style={{...styles.smallEventTitle, color: colors.text}}
          numberOfLines={1}>
          {event.title}
        </Text>
      </View>
      <Text
        style={{...styles.smallEventDate, color: COLORS.textSecondary}}
        numberOfLines={1}>
        {format(new Date(event.startDate), 'd MMM', {locale: tr})}
        {' • '}
        {event.location.city}
      </Text>
    </TouchableOpacity>
  );

  const renderRouteCard = (route: Route) => (
    <TouchableOpacity
      key={route.id}
      style={[
        styles.routeCard,
        {backgroundColor: colors.card, marginRight: 16},
      ]}
      onPress={() => navigation.navigate('RouteDetail', {id: route.id})}>
      <View style={styles.routeHeader}>
        <Text
          style={{...styles.routeTitle, color: colors.text}}
          numberOfLines={1}>
          {route.name}
        </Text>
      </View>
      <View style={styles.routeDetails}>
        <View style={styles.routeInfo}>
          <MaterialCommunityIcons
            name="map-marker-distance"
            size={16}
            color={COLORS.textSecondary}
          />
          <Text style={{...styles.routeInfoText, color: colors.text}}>
            {route.distance} km
          </Text>
        </View>
        <View style={styles.routeInfo}>
          <MaterialCommunityIcons
            name="trending-up"
            size={16}
            color={COLORS.textSecondary}
          />
          <Text style={{...styles.routeInfoText, color: colors.text}}>
            {route.elevation} m
          </Text>
        </View>
        <View style={styles.routeInfo}>
          <MaterialCommunityIcons
            name="timer-outline"
            size={16}
            color={COLORS.textSecondary}
          />
          <Text style={{...styles.routeInfoText, color: colors.text}}>
            {Math.round(route.estimatedDuration / 60)} saat
          </Text>
        </View>
      </View>
      <View style={styles.routeLocation}>
        <MaterialCommunityIcons
          name="map-marker"
          size={16}
          color={COLORS.textSecondary}
        />
        <Text
          style={{...styles.routeLocationText, color: COLORS.textSecondary}}
          numberOfLines={1}>
          {route.city}, {route.district}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderClubCard = (club: Club) => (
    <TouchableOpacity
      key={club.id}
      style={[styles.clubCard, {backgroundColor: colors.card}]}
      onPress={() => navigation.navigate('ClubDetail', {id: club.id})}>
      <View style={styles.clubHeader}>
        <Image source={{uri: club.logoUrl}} style={styles.clubLogo} />
        <View style={styles.clubInfo}>
          <Text
            style={{...styles.clubName, color: colors.text}}
            numberOfLines={1}>
            {club.name}
          </Text>
          <Text
            style={{...styles.clubLocation, color: COLORS.textSecondary}}
            numberOfLines={1}>
            {club.city}
          </Text>
        </View>
      </View>
      <View style={styles.clubStats}>
        <View style={styles.clubStat}>
          <MaterialCommunityIcons
            name="account-group"
            size={16}
            color={COLORS.textSecondary}
          />
          <Text style={{...styles.clubStatText, color: colors.text}}>
            {club.memberCount} üye
          </Text>
        </View>
        <View style={styles.clubTags}>
          {club.tags.slice(0, 2).map((tag, index) => (
            <View key={index} style={styles.clubTag}>
              <Text
                style={{...styles.clubTagText, color: COLORS.textSecondary}}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderAnnouncementCard = (announcement: Announcement) => (
    <TouchableOpacity
      key={announcement.id}
      style={[styles.announcementCard, {backgroundColor: colors.card}]}
      onPress={() =>
        navigation.navigate('AnnouncementDetail', {id: announcement.id})
      }>
      <View style={styles.announcementHeader}>
        {announcement.publisher?.logoUrl ? (
          <Image
            source={{uri: announcement.publisher.logoUrl}}
            style={styles.publisherLogo}
          />
        ) : (
          <MaterialCommunityIcons
            name="bell-outline"
            size={20}
            color={colors.primary}
          />
        )}
        <View style={styles.announcementInfo}>
          <Text
            style={{...styles.announcementTitle, color: colors.text}}
            numberOfLines={1}>
            {announcement.title}
          </Text>
          <Text
            style={{...styles.publisherName, color: COLORS.textSecondary}}
            numberOfLines={1}>
            {announcement.publisher.name} •{' '}
            {format(new Date(announcement.createdAt), 'd MMM', {locale: tr})}
          </Text>
        </View>
        {announcement.isImportant && (
          <MaterialCommunityIcons
            name="alert-circle"
            size={16}
            color={COLORS.warning}
          />
        )}
      </View>
      <Text
        style={{...styles.announcementContent, color: colors.text}}
        numberOfLines={2}>
        {announcement.content}
      </Text>
    </TouchableOpacity>
  );

  const Section = ({
    title,
    onSeeAll,
    children,
  }: {
    title: string;
    onSeeAll: () => void;
    children?: React.ReactNode;
  }) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={{...styles.sectionTitle, color: colors.text}}>
          {title}
        </Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={{...styles.sectionLink, color: COLORS.primary}}>
            Tümünü Gör
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.sectionContent}>
        {children || (
          <Text style={{color: colors.text}}>İçerik burada olacak</Text>
        )}
      </View>
    </View>
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return COLORS.success;
      case 'MEDIUM':
        return COLORS.warning;
      case 'HARD':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY':
        return 'Kolay';
      case 'MEDIUM':
        return 'Orta';
      case 'HARD':
        return 'Zor';
      default:
        return 'Belirsiz';
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.background}]}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={styles.headerContainer}>
          <Text style={{...styles.welcomeText, color: colors.text}}>
            Merhaba, {user?.firstName || 'Sürücü'}!
          </Text>
          <Text style={{...styles.subtitle, color: COLORS.textSecondary}}>
            Bugün nereye sürmek istersin?
          </Text>
        </View>

        <Section
          title="Kulüpler"
          onSeeAll={() => navigation.navigate('ClubsListScreen', {})}>
          <View style={styles.clubsContainer}>
            {isLoading ? (
              <Text style={{...styles.emptyText, color: COLORS.textSecondary}}>
                Kulüpler yükleniyor...
              </Text>
            ) : activeClubs.length > 0 ? (
              activeClubs.slice(0, 2).map(club => renderClubCard(club))
            ) : (
              <Text style={{...styles.emptyText, color: COLORS.textSecondary}}>
                Kulüp bulunamadı
              </Text>
            )}
          </View>
        </Section>

        <Section
          title="Etkinlikler"
          onSeeAll={() => navigation.navigate('MyEvents')}>
          {isLoading ? (
            <Text style={{...styles.emptyText, color: COLORS.textSecondary}}>
              Yükleniyor...
            </Text>
          ) : upcomingEvents.length > 0 ? (
            <View style={styles.eventCardsContainer}>
              {upcomingEvents.slice(0, 2).map(event => renderEventCard(event))}
            </View>
          ) : (
            <Text style={{...styles.emptyText, color: COLORS.textSecondary}}>
              Katıldığınız etkinlik bulunmamaktadır.
            </Text>
          )}
        </Section>

        <Section
          title="Duyurular"
          onSeeAll={() => navigation.navigate('AnnouncementDetail', {id: '1'})}>
          <View style={styles.announcementsContainer}>
            {isLoading ? (
              <Text style={{...styles.emptyText, color: COLORS.textSecondary}}>
                Duyurular yükleniyor...
              </Text>
            ) : announcements.length > 0 ? (
              announcements
                .slice(0, 2)
                .map(announcement => renderAnnouncementCard(announcement))
            ) : (
              <Text style={{...styles.emptyText, color: COLORS.textSecondary}}>
                Duyuru bulunamadı
              </Text>
            )}
          </View>
        </Section>

        <Section
          title="Yaklaşan Etkinlikler"
          onSeeAll={() => navigation.navigate('EventsScreen')}>
          {isLoading ? (
            <Text style={{...styles.emptyText, color: COLORS.textSecondary}}>
              Yükleniyor...
            </Text>
          ) : upcomingEvents.length === 0 ? (
            <Text style={{...styles.emptyText, color: COLORS.textSecondary}}>
              Yaklaşan etkinlik bulunmamaktadır.
            </Text>
          ) : (
            <View style={styles.gridContainer}>
              {upcomingEvents
                .slice(0, 6)
                .map(event => renderSmallEventCard(event))}
            </View>
          )}
        </Section>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, {color: colors.text}]}>
              Popüler Rotalar
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('PopularRoutes')}
              style={styles.seeAllButton}>
              <Text style={{...styles.seeAllText, color: colors.primary}}>
                Tümünü Gör
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={18}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          {isRoutesLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          ) : popularRoutes.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialCommunityIcons
                name="map-marker-path"
                size={40}
                color={COLORS.textSecondary}
              />
              <Text style={{...styles.emptyText, color: colors.text}}>
                Henüz popüler rota bulunmuyor
              </Text>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.routesContainer}>
              {popularRoutes.map(route => (
                <TouchableOpacity
                  key={route.id}
                  style={[
                    styles.routeCard,
                    {backgroundColor: colors.card, marginRight: 16},
                  ]}
                  onPress={() =>
                    navigation.navigate('RouteDetail', {id: route.id})
                  }>
                  <Image
                    source={{uri: route.imageUrl}}
                    style={styles.routeImage}
                  />
                  <View style={styles.routeContent}>
                    <Text
                      style={{...styles.routeName, color: colors.text}}
                      numberOfLines={1}>
                      {route.name}
                    </Text>
                    <View style={styles.routeStats}>
                      <View style={styles.routeStat}>
                        <MaterialCommunityIcons
                          name="map-marker-distance"
                          size={14}
                          color={COLORS.textSecondary}
                        />
                        <Text
                          style={{...styles.routeStatText, color: colors.text}}>
                          {route.distance} km
                        </Text>
                      </View>
                      <View style={styles.routeStat}>
                        <MaterialCommunityIcons
                          name="bike"
                          size={14}
                          color={COLORS.textSecondary}
                        />
                        <Text
                          style={{...styles.routeStatText, color: colors.text}}>
                          {route.type}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.routeDifficulty}>
                      <Text
                        style={{
                          ...styles.routeDifficultyText,
                          color: getDifficultyColor(route.difficulty),
                        }}>
                        {getDifficultyText(route.difficulty)}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={{...styles.sectionTitle, color: colors.text}}>
              Aktif Kulüpler
            </Text>
            <TouchableOpacity>
              <Text style={{...styles.sectionLink, color: COLORS.primary}}>
                Tümünü Gör
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.clubListContainer}>
            {isLoading ? (
              <Text style={{...styles.emptyText, color: COLORS.textSecondary}}>
                Kulüpler yükleniyor...
              </Text>
            ) : activeClubs.length === 0 ? (
              <Text style={{...styles.emptyText, color: COLORS.textSecondary}}>
                Kulüp bulunamadı
              </Text>
            ) : (
              <View style={styles.clubsGrid}>
                {activeClubs.map(club => renderClubCard(club))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.xl,
  },
  headerContainer: {
    marginBottom: SIZES.spacing.xl,
  },
  welcomeText: {
    ...FONTS.h2,
    marginBottom: SIZES.spacing.xs,
  },
  subtitle: {
    ...FONTS.body1,
  },
  sectionContainer: {
    marginBottom: SIZES.spacing.xl * 1.5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing.md,
  },
  sectionTitle: {
    ...FONTS.h3,
  },
  sectionLink: {
    ...FONTS.body2,
    fontWeight: 'bold',
  },
  eventCardsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  smallEventsGrid: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  eventCard: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  smallEventCard: {
    padding: 8,
    borderRadius: 8,
    flex: 1,
    minWidth: '48%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  smallEventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  eventTitle: {
    ...FONTS.h4,
    flex: 1,
  },
  smallEventTitle: {
    ...FONTS.body2,
    fontWeight: 'bold',
    flex: 1,
  },
  eventDate: {
    ...FONTS.body2,
    marginBottom: 8,
  },
  smallEventDate: {
    ...FONTS.body2,
    fontSize: 12,
  },
  eventDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  eventLocationText: {
    ...FONTS.body2,
    marginLeft: 4,
    flex: 1,
  },
  eventParticipants: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventParticipantsText: {
    ...FONTS.body2,
    marginLeft: 4,
  },
  routeListContainer: {
    marginBottom: SIZES.spacing.lg,
    minHeight: 150,
  },
  clubListContainer: {
    marginBottom: SIZES.spacing.lg,
    minHeight: 150,
  },
  emptyText: {
    ...FONTS.body2,
    textAlign: 'center',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    marginBottom: SIZES.spacing.lg,
  },
  sectionContent: {
    minHeight: 100,
    justifyContent: 'center',
  },
  routesGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  clubsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  routeCard: {
    width: 240,
    borderRadius: 12,
    overflow: 'hidden',
    marginRight: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  routeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  routeInfoText: {
    fontSize: 14,
  },
  routeLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  routeLocationText: {
    fontSize: 14,
  },
  clubCard: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  clubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
  },
  clubLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  clubInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  clubLocation: {
    fontSize: 14,
  },
  clubStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clubStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clubStatText: {
    fontSize: 14,
  },
  clubTags: {
    flexDirection: 'row',
    gap: 6,
  },
  clubTag: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  clubTagText: {
    fontSize: 12,
  },
  clubsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  announcementsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  announcementCard: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  announcementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  publisherLogo: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  announcementInfo: {
    flex: 1,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  publisherName: {
    fontSize: 13,
  },
  announcementContent: {
    fontSize: 14,
    lineHeight: 20,
  },
  loadingContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    ...FONTS.body2,
    fontWeight: 'bold',
  },
  routesContainer: {
    paddingLeft: SIZES.spacing.md,
    paddingBottom: SIZES.spacing.md,
    gap: 5,
  },
  routeImage: {
    width: '100%',
    height: 120,
  },
  routeContent: {
    padding: 12,
    paddingRight: 20,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  routeStats: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  routeStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  routeStatText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  routeDifficulty: {
    marginTop: 4,
  },
  routeDifficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  gridContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});

export default HomeScreen;
