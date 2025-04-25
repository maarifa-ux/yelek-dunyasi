import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EventCard from '../components/EventCard';
import AnnouncementCard from '../components/AnnouncementCard';
import EmptyFeed from '../components/EmptyFeed';
import eventService from '../services/eventService';
import clubService from '../services/clubService';

interface FeedItem {
  id: string;
  type: 'EVENT' | 'ANNOUNCEMENT';
  data: any;
  timestamp: string;
}

const HomeScreen = () => {
  const { colors } = useTheme();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchFeed = async (pageNum = 1, shouldRefresh = false) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      }

      // Kullanıcının üye olduğu kulüplerin etkinliklerini al
      const eventsResponse = await eventService.getUserFeed(pageNum);

      // Kullanıcının üye olduğu kulüplerin duyurularını al
      const clubsResponse = await clubService.getUserClubs();
      let announcements: any[] = [];

      for (const club of clubsResponse.clubs) {
        const clubAnnouncements = await clubService.getClubAnnouncements(
          club.id,
        );
        announcements = [
          ...announcements,
          ...clubAnnouncements.announcements.map((announcement) => ({
            ...announcement,
            club: {
              id: club.id,
              name: club.name,
              logoUrl: club.logoUrl,
            },
          })),
        ];
      }

      // Etkinlik ve duyuruları birleştir ve tarihe göre sırala
      const combinedItems: FeedItem[] = [
        ...eventsResponse.events.map((event) => ({
          id: `event-${event.id}`,
          type: 'EVENT' as const,
          data: event,
          timestamp: event.startDate,
        })),
        ...announcements.map((announcement) => ({
          id: `announcement-${announcement.id}`,
          type: 'ANNOUNCEMENT' as const,
          data: announcement,
          timestamp: announcement.createdAt,
        })),
      ].sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      );

      if (shouldRefresh) {
        setFeedItems(combinedItems);
      } else {
        setFeedItems((prev) => [...prev, ...combinedItems]);
      }

      setHasMore(combinedItems.length > 0);
      setPage(pageNum);
    } catch (error) {
      console.error('Feed yüklenirken hata oluştu:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchFeed(1, true);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchFeed(page + 1);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  if (loading && page === 1) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const renderItem = ({ item }: { item: FeedItem }) => {
    if (item.type === 'EVENT') {
      return <EventCard event={item.data} />;
    }
    return <AnnouncementCard announcement={item.data} />;
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <FlatList
        data={feedItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={<EmptyFeed />}
        ListFooterComponent={
          loading && page > 1 ? (
            <ActivityIndicator
              style={styles.loadingMore}
              color={colors.primary}
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingMore: {
    paddingVertical: 20,
  },
});

export default HomeScreen;
