import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextStyle,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { COLORS, FONTS, SIZES, ROUTES } from '../../constants';
import { eventService } from '../../services';
import { Event } from '../../services/eventService';

type EventsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface EventFilter {
  startDate?: string;
  endDate?: string;
}

const EventsScreen: React.FC = () => {
  const navigation = useNavigation<EventsScreenNavigationProp>();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('upcoming');

  const fetchEvents = async (status = 'upcoming') => {
    try {
      setLoading(true);
      const filter: EventFilter = {};

      if (status === 'upcoming') {
        filter.startDate = new Date().toISOString();
      } else if (status === 'past') {
        filter.endDate = new Date().toISOString();
      }

      const response = await eventService.getEvents(1, 20, filter);
      setEvents(response.events);
    } catch (error) {
      console.error('Etkinlikler alınırken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchEvents(activeFilter);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    fetchEvents(filter);
  };

  const handleEventPress = (eventId: string) => {
    navigation.navigate('EventDetail', { eventId });
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => handleEventPress(item.id)}
    >
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle as TextStyle}>{item.title}</Text>
        <Text style={styles.eventDate as TextStyle}>
          {new Date(item.startDate).toLocaleDateString('tr-TR')}
        </Text>
      </View>
      <View style={styles.eventDetails}>
        <Text style={styles.eventLocation as TextStyle}>
          {item.location.city}, {item.location.district}
        </Text>
        <Text style={styles.eventParticipants as TextStyle}>
          {item.currentParticipants}/{item.maxParticipants} Katılımcı
        </Text>
      </View>
      <View style={styles.eventFooter}>
        <Text style={styles.eventType as TextStyle}>
          {item.eventType === 'RIDE'
            ? 'Sürüş'
            : item.eventType === 'MEETING'
            ? 'Toplantı'
            : item.eventType === 'TRAINING'
            ? 'Eğitim'
            : 'Diğer'}
        </Text>
        {item.clubId && (
          <Text style={styles.eventClub as TextStyle}>
            {item.club?.name || 'Kulüp'}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.title as TextStyle}>Etkinlikler</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() =>
            navigation.navigate(ROUTES.EVENT.CREATE_EVENT as never)
          }
        >
          <Text style={styles.createButtonText as TextStyle}>+ Yeni</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filters}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'upcoming' && styles.filterButtonActive,
          ]}
          onPress={() => handleFilterChange('upcoming')}
        >
          <Text
            style={[
              styles.filterText as TextStyle,
              activeFilter === 'upcoming' &&
                (styles.filterTextActive as TextStyle),
            ]}
          >
            Yaklaşan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'past' && styles.filterButtonActive,
          ]}
          onPress={() => handleFilterChange('past')}
        >
          <Text
            style={[
              styles.filterText as TextStyle,
              activeFilter === 'past' && (styles.filterTextActive as TextStyle),
            ]}
          >
            Geçmiş
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'my' && styles.filterButtonActive,
          ]}
          onPress={() => handleFilterChange('my')}
        >
          <Text
            style={[
              styles.filterText as TextStyle,
              activeFilter === 'my' && (styles.filterTextActive as TextStyle),
            ]}
          >
            Katıldıklarım
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.eventsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText as TextStyle}>
              {loading ? 'Etkinlikler yükleniyor...' : 'Etkinlik bulunamadı'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: {
    ...FONTS.h2,
    color: COLORS.text,
  } as TextStyle,
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.xs,
    borderRadius: SIZES.radius.md,
  },
  createButtonText: {
    ...FONTS.button,
    color: COLORS.white,
  } as TextStyle,
  filters: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterButton: {
    marginRight: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xs,
  },
  filterButtonActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  filterText: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  } as TextStyle,
  filterTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  } as TextStyle,
  eventsList: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md,
  },
  eventCard: {
    backgroundColor: COLORS.background,
    borderRadius: SIZES.radius.md,
    padding: SIZES.spacing.md,
    marginBottom: SIZES.spacing.md,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing.sm,
  },
  eventTitle: {
    ...FONTS.h4,
    color: COLORS.text,
    flex: 1,
  } as TextStyle,
  eventDate: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  } as TextStyle,
  eventDetails: {
    marginBottom: SIZES.spacing.sm,
  },
  eventLocation: {
    ...FONTS.body2,
    color: COLORS.text,
    marginBottom: SIZES.spacing.xs,
  } as TextStyle,
  eventParticipants: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  } as TextStyle,
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SIZES.spacing.sm,
  },
  eventType: {
    ...FONTS.caption,
    color: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: SIZES.spacing.xs / 2,
    borderRadius: SIZES.radius.sm,
    overflow: 'hidden',
  } as TextStyle,
  eventClub: {
    ...FONTS.caption,
    color: COLORS.text,
  } as TextStyle,
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.spacing.xl,
  },
  emptyText: {
    ...FONTS.body1,
    color: COLORS.textSecondary,
    textAlign: 'center',
  } as TextStyle,
});

export default EventsScreen;
