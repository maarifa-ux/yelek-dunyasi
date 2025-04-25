import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { Calendar, DateData } from 'react-native-calendars';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

type ViewMode = 'list' | 'calendar';
type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: number;
  isParticipating?: boolean;
};

// Örnek veri - API'den gelecek
const sampleEvents: Event[] = [
  {
    id: '1',
    title: 'Yazılım Atölyesi',
    description: 'React Native ile mobil uygulama geliştirme',
    date: '2024-03-15',
    location: 'A Blok - Lab 3',
    participants: 25,
    isParticipating: true,
  },
  // Diğer etkinlikler buraya eklenecek
];

interface MarkedDate {
  marked: boolean;
  dotColor: string;
  selected?: boolean;
  selectedColor?: string;
}

export const MyEventsScreen = () => {
  const { colors } = useTheme();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '75%'], []);

  // Takvimde işaretlenecek günleri hazırla
  const markedDates = useMemo(() => {
    const dates: Record<string, MarkedDate> = {};
    sampleEvents.forEach((event) => {
      dates[event.date] = {
        marked: true,
        dotColor: colors.primary,
      };
      if (event.date === selectedDate) {
        dates[event.date].selected = true;
        dates[event.date].selectedColor = colors.primary;
      }
    });
    return dates;
  }, [selectedDate, colors.primary]);

  const handleDayPress = useCallback((day: DateData) => {
    setSelectedDate(day.dateString);
    const events = sampleEvents.filter(
      (event) => event.date === day.dateString,
    );
    setSelectedEvents(events);
    if (events.length > 0) {
      bottomSheetModalRef.current?.present();
    }
  }, []);

  const renderEventItem = ({ item }: { item: Event }) => (
    <TouchableOpacity
      style={[styles.eventCard, { backgroundColor: colors.card }]}
      onPress={() => {
        // Etkinlik detayına git
      }}
    >
      <View style={styles.eventHeader}>
        <Text style={[styles.eventTitle, { color: colors.text }]}>
          {item.title}
        </Text>
        {item.isParticipating && (
          <MaterialCommunityIcons
            name="check-circle"
            size={20}
            color={colors.primary}
          />
        )}
      </View>
      <Text style={[styles.eventDate, { color: colors.text }]}>
        {format(new Date(item.date), 'd MMMM yyyy', { locale: tr })}
      </Text>
      <Text style={[styles.eventLocation, { color: colors.text }]}>
        {item.location}
      </Text>
      <View style={styles.eventFooter}>
        <MaterialCommunityIcons
          name="account-group"
          size={20}
          color={colors.text}
        />
        <Text style={[styles.participantCount, { color: colors.text }]}>
          {item.participants} Katılımcı
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        {/* Tab Butonları */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              viewMode === 'list' && {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => setViewMode('list')}
          >
            <Text
              style={[
                styles.tabText,
                { color: viewMode === 'list' ? 'white' : colors.text },
              ]}
            >
              Liste Görünümü
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              viewMode === 'calendar' && {
                backgroundColor: colors.primary,
              },
            ]}
            onPress={() => setViewMode('calendar')}
          >
            <Text
              style={[
                styles.tabText,
                { color: viewMode === 'calendar' ? 'white' : colors.text },
              ]}
            >
              Takvim Görünümü
            </Text>
          </TouchableOpacity>
        </View>

        {/* Liste Görünümü */}
        {viewMode === 'list' && (
          <FlatList
            data={sampleEvents}
            renderItem={renderEventItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
          />
        )}

        {/* Takvim Görünümü */}
        {viewMode === 'calendar' && (
          <Calendar
            onDayPress={handleDayPress}
            markedDates={markedDates}
            theme={{
              todayTextColor: colors.primary,
              selectedDayBackgroundColor: colors.primary,
              arrowColor: colors.primary,
            }}
          />
        )}

        {/* Etkinlik Detay Modal */}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}
          backgroundStyle={{ backgroundColor: colors.card }}
        >
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {format(new Date(selectedDate), 'd MMMM yyyy', { locale: tr })}
            </Text>
            <FlatList
              data={selectedEvents}
              renderItem={renderEventItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.modalList}
            />
          </View>
        </BottomSheetModal>
      </View>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  eventCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    marginBottom: 8,
  },
  eventFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  participantCount: {
    fontSize: 14,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalList: {
    paddingHorizontal: 16,
  },
});
