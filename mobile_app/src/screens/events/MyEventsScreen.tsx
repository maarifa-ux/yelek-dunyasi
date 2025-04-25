import React, {useState, useCallback, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import {
  useTheme,
  useNavigation,
  useRoute,
  RouteProp,
} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Calendar, DateData} from 'react-native-calendars';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {format} from 'date-fns';
import {tr} from 'date-fns/locale';
import {Event} from '../../services/eventService';
import {allEvents} from '../../data/mockEvents';
import {RootStackParamList} from '../../types/navigation';

type MyEventsScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;
type MyEventsScreenRouteProp = RouteProp<RootStackParamList, 'MyEvents'>;

type ViewMode = 'list' | 'calendar';
type FilterType = 'past' | 'upcoming' | 'all';

interface MarkedDate {
  marked: boolean;
  dotColor: string;
  selected?: boolean;
  selectedColor?: string;
}

export const MyEventsScreen = () => {
  const {colors} = useTheme();
  const navigation = useNavigation<MyEventsScreenNavigationProp>();
  const route = useRoute<MyEventsScreenRouteProp>();

  // Route parametrelerini al
  const routeFilter = route.params?.filter || 'all';

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>(
    routeFilter as FilterType,
  );

  // Kullanıcının katıldığı etkinlikleri filtrele
  const myEvents = useMemo(
    () => allEvents.filter(event => event.participationStatus === 'JOINED'),
    [],
  );

  // Aktif filtreye göre etkinlikleri filtrele
  const filteredEvents = useMemo(() => {
    const now = new Date();

    if (activeFilter === 'past') {
      return myEvents.filter(event => new Date(event.endDate) < now);
    } else if (activeFilter === 'upcoming') {
      return myEvents.filter(event => new Date(event.startDate) > now);
    }

    return myEvents;
  }, [myEvents, activeFilter]);

  // Başlığı güncelle
  useEffect(() => {
    let title = 'Etkinliklerim';

    if (activeFilter === 'past') {
      title = 'Geçmiş Etkinliklerim';
    } else if (activeFilter === 'upcoming') {
      title = 'Yaklaşan Etkinliklerim';
    }

    navigation.setOptions({title});
  }, [activeFilter, navigation]);

  // Takvimde işaretlenecek günleri hazırla
  const markedDates = useMemo(() => {
    const dates: Record<string, MarkedDate> = {};

    filteredEvents.forEach(event => {
      const dateKey = event.startDate.split('T')[0];
      dates[dateKey] = {
        marked: true,
        dotColor: colors.primary,
      };

      if (dateKey === selectedDate) {
        dates[dateKey].selected = true;
        dates[dateKey].selectedColor = colors.primary;
      }
    });

    return dates;
  }, [selectedDate, colors.primary, filteredEvents]);

  const handleDayPress = useCallback(
    (day: DateData) => {
      setSelectedDate(day.dateString);

      // Seçilen günde kullanıcının katıldığı etkinlikleri filtrele
      const dayEvents = filteredEvents.filter(
        event => event.startDate.split('T')[0] === day.dateString,
      );

      setSelectedEvents(dayEvents);
      if (dayEvents.length > 0) {
        setModalVisible(true);
      }
    },
    [filteredEvents],
  );

  const handleEventDetail = (event: Event) => {
    try {
      // @ts-ignore
      navigation.navigate('EventDetail', {
        eventId: event.id,
      });
    } catch (error) {
      console.error('Yönlendirme hatası:', error);
      Alert.alert('Hata', 'Etkinlik detayları şu anda gösterilemiyor.');
    }
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const renderEventItem = ({item}: {item: Event}) => (
    <TouchableOpacity
      style={[styles.eventCard, {backgroundColor: colors.card}]}
      onPress={() => handleEventDetail(item)}>
      <View style={styles.eventHeader}>
        <Text style={[styles.eventTitle, {color: colors.text}]}>
          {item.title}
        </Text>
        {item.participationStatus === 'JOINED' && (
          <MaterialCommunityIcons
            name="check-circle"
            size={20}
            color={colors.primary}
          />
        )}
      </View>
      <Text style={[styles.eventDate, {color: colors.text}]}>
        {format(new Date(item.startDate), 'd MMMM yyyy', {locale: tr})}
      </Text>
      <Text style={[styles.eventLocation, {color: colors.text}]}>
        {item.location.city}, {item.location.district}
      </Text>
      <View style={styles.eventFooter}>
        <MaterialCommunityIcons
          name="account-group"
          size={20}
          color={colors.text}
        />
        <Text style={[styles.participantCount, {color: colors.text}]}>
          {item.currentParticipants}/{item.maxParticipants} Katılımcı
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Filtre butonları */}
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'all' && {
              borderBottomColor: colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => handleFilterChange('all')}>
          <Text
            style={[
              styles.filterText,
              {color: activeFilter === 'all' ? colors.primary : colors.text},
            ]}>
            Tümü
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'upcoming' && {
              borderBottomColor: colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => handleFilterChange('upcoming')}>
          <Text
            style={[
              styles.filterText,
              {
                color:
                  activeFilter === 'upcoming' ? colors.primary : colors.text,
              },
            ]}>
            Yaklaşan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            activeFilter === 'past' && {
              borderBottomColor: colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => handleFilterChange('past')}>
          <Text
            style={[
              styles.filterText,
              {color: activeFilter === 'past' ? colors.primary : colors.text},
            ]}>
            Geçmiş
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Butonları */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            viewMode === 'list' && {
              backgroundColor: colors.primary,
            },
          ]}
          onPress={() => setViewMode('list')}>
          <Text
            style={[
              styles.tabText,
              {color: viewMode === 'list' ? 'white' : colors.text},
            ]}>
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
          onPress={() => setViewMode('calendar')}>
          <Text
            style={[
              styles.tabText,
              {color: viewMode === 'calendar' ? 'white' : colors.text},
            ]}>
            Takvim Görünümü
          </Text>
        </TouchableOpacity>
      </View>

      {/* Liste Görünümü */}
      {viewMode === 'list' && (
        <FlatList
          data={filteredEvents}
          renderItem={renderEventItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, {color: colors.text}]}>
                Etkinlik bulunamadı
              </Text>
            </View>
          }
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

      {/* Etkinlik Detay Modal - BottomSheet yerine standart Modal kullanıyoruz */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View
            style={[styles.modalContent, {backgroundColor: colors.background}]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, {color: colors.text}]}>
                {selectedDate
                  ? format(new Date(selectedDate), 'd MMMM yyyy', {locale: tr})
                  : 'Etkinlikler'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScrollView}>
              {selectedEvents.map(event => renderEventItem({item: event}))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  filterButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  eventCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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
    fontWeight: 'bold',
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
  },
  participantCount: {
    fontSize: 14,
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    height: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalScrollView: {
    flex: 1,
  },
  modalList: {
    paddingVertical: 8,
  },
});
