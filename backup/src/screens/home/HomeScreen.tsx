import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TextStyle,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONTS, SIZES, ROUTES } from '../../constants';
import { useAuthStore } from '../../store';
import { eventService } from '../../services';
import { Event } from '../../services/eventService';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const eventsResponse = await eventService.getEvents(1, 5, {
        startDate: new Date().toISOString(),
      });
      setUpcomingEvents(eventsResponse.events);
    } catch (error) {
      console.error('Ana sayfa verileri alınırken hata:', error);
    } finally {
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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.headerContainer}>
          <Text style={styles.welcomeText as TextStyle}>
            Merhaba, {user?.firstName || 'Sürücü'}!
          </Text>
          <Text style={styles.subtitle as TextStyle}>
            Bugün nereye sürmek istersin?
          </Text>
        </View>

        {/* Yaklaşan Etkinlikler Bölümü */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle as TextStyle}>
              Yaklaşan Etkinlikler
            </Text>
            <Text
              style={styles.sectionLink as TextStyle}
              onPress={() => navigation.navigate(ROUTES.MAIN.EVENTS as never)}
            >
              Tümünü Gör
            </Text>
          </View>

          {/* Etkinlik kartları buraya gelecek */}
          <View style={styles.eventListContainer}>
            {isLoading ? (
              <Text style={styles.emptyText as TextStyle}>
                Etkinlikler yükleniyor...
              </Text>
            ) : upcomingEvents.length === 0 ? (
              <Text style={styles.emptyText as TextStyle}>
                Yaklaşan etkinlik bulunamadı.
              </Text>
            ) : (
              <Text style={styles.emptyText as TextStyle}>
                Etkinlik kartları buraya gelecek
              </Text>
            )}
          </View>
        </View>

        {/* Popüler Rotalar Bölümü */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle as TextStyle}>
              Popüler Rotalar
            </Text>
            <Text style={styles.sectionLink as TextStyle}>Tümünü Gör</Text>
          </View>

          {/* Rota kartları buraya gelecek */}
          <View style={styles.routeListContainer}>
            <Text style={styles.emptyText as TextStyle}>
              Rota kartları buraya gelecek
            </Text>
          </View>
        </View>

        {/* Aktif Kulüpler Bölümü */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle as TextStyle}>Aktif Kulüpler</Text>
            <Text style={styles.sectionLink as TextStyle}>Tümünü Gör</Text>
          </View>

          {/* Kulüp kartları buraya gelecek */}
          <View style={styles.clubListContainer}>
            <Text style={styles.emptyText as TextStyle}>
              Kulüp kartları buraya gelecek
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
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
    color: COLORS.text,
    marginBottom: SIZES.spacing.xs,
  } as TextStyle,
  subtitle: {
    ...FONTS.body1,
    color: COLORS.textSecondary,
  } as TextStyle,
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
    color: COLORS.text,
  } as TextStyle,
  sectionLink: {
    ...FONTS.body2,
    color: COLORS.primary,
  } as TextStyle,
  eventListContainer: {
    marginBottom: SIZES.spacing.lg,
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  routeListContainer: {
    marginBottom: SIZES.spacing.lg,
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clubListContainer: {
    marginBottom: SIZES.spacing.lg,
    minHeight: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
    textAlign: 'center',
  } as TextStyle,
});

export default HomeScreen;
