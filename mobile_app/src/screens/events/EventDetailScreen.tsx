import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {format} from 'date-fns';
import {tr} from 'date-fns/locale';
import {Event} from '../../services/eventService';
import {allEvents} from '../../data/mockEvents';

type EventDetailRouteProp = RouteProp<{params: {eventId: string}}, 'params'>;

export const EventDetailScreen = () => {
  const {colors} = useTheme();
  const route = useRoute<EventDetailRouteProp>();
  const navigation = useNavigation();
  const {eventId} = route.params || {};
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock veri deposundan etkinliği bul
    const fetchEvent = () => {
      setLoading(true);
      try {
        // Timeout, gerçek bir API çağrısını simüle etmek için
        setTimeout(() => {
          const foundEvent = allEvents.find(e => e.id === eventId);
          if (foundEvent) {
            setEvent(foundEvent);
          } else {
            Alert.alert('Hata', 'Etkinlik bulunamadı');
            navigation.goBack();
          }
          setLoading(false);
        }, 300);
      } catch (error) {
        console.error('Etkinlik getirilirken hata:', error);
        setLoading(false);
        Alert.alert('Hata', 'Etkinlik yüklenirken bir sorun oluştu');
      }
    };

    fetchEvent();
  }, [eventId, navigation]);

  const handleParticipate = () => {
    if (!event) return;

    try {
      // Mock katılım işlemi
      const updatedEvent = {...event};

      if (updatedEvent.participationStatus !== 'JOINED') {
        updatedEvent.participationStatus = 'JOINED';
        updatedEvent.currentParticipants += 1;

        // Global mock veriyi güncelle
        const globalEvent = allEvents.find(e => e.id === eventId);
        if (globalEvent) {
          globalEvent.participationStatus = 'JOINED';
          globalEvent.currentParticipants += 1;
        }

        setEvent(updatedEvent);
        Alert.alert('Başarılı', 'Etkinliğe katılım talebiniz alındı.');
      } else {
        Alert.alert('Bilgi', 'Bu etkinliğe zaten katılıyorsunuz.');
      }
    } catch (error) {
      console.error('Etkinliğe katılırken hata:', error);
      Alert.alert('Hata', 'İşlem sırasında bir sorun oluştu');
    }
  };

  const handleDecline = () => {
    if (!event) return;

    try {
      // Mock katılmama işlemi
      const updatedEvent = {...event};

      if (updatedEvent.participationStatus === 'JOINED') {
        updatedEvent.participationStatus = 'NONE';
        updatedEvent.currentParticipants = Math.max(
          0,
          updatedEvent.currentParticipants - 1,
        );

        // Global mock veriyi güncelle
        const globalEvent = allEvents.find(e => e.id === eventId);
        if (globalEvent) {
          globalEvent.participationStatus = 'NONE';
          globalEvent.currentParticipants = Math.max(
            0,
            globalEvent.currentParticipants - 1,
          );
        }

        setEvent(updatedEvent);
        Alert.alert('Bilgi', 'Etkinliğe katılmama talebiniz alındı.');
      } else {
        Alert.alert('Bilgi', 'Bu etkinliğe zaten katılmıyorsunuz.');
      }
    } catch (error) {
      console.error('Etkinliğe katılmama işlemi sırasında hata:', error);
      Alert.alert('Hata', 'İşlem sırasında bir sorun oluştu');
    }
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {alignItems: 'center', justifyContent: 'center'},
        ]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{color: colors.text, marginTop: 10}}>
          Etkinlik yükleniyor...
        </Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View
        style={[
          styles.container,
          {alignItems: 'center', justifyContent: 'center'},
        ]}>
        <Text style={{color: colors.text}}>Etkinlik bulunamadı</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Başlık ve Organizatör Bilgisi */}
      <View style={[styles.header, {backgroundColor: colors.card}]}>
        <View style={styles.organizerInfo}>
          <Image
            source={{uri: event.organizer.profilePicture}}
            style={styles.organizerAvatar}
          />
          <Text style={[styles.organizerName, {color: colors.text}]}>
            {event.organizer.firstName} {event.organizer.lastName}
          </Text>
        </View>
        <Text style={[styles.title, {color: colors.text}]}>{event.title}</Text>
      </View>

      {/* Etkinlik Detayları */}
      <View style={[styles.section, {backgroundColor: colors.card}]}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons
            name="calendar"
            size={24}
            color={colors.primary}
          />
          <Text style={[styles.detailText, {color: colors.text}]}>
            {format(new Date(event.startDate), 'd MMMM yyyy, HH:mm', {
              locale: tr,
            })}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons
            name="map-marker"
            size={24}
            color={colors.primary}
          />
          <Text style={[styles.detailText, {color: colors.text}]}>
            {event.location.city}, {event.location.district},{' '}
            {event.location.address}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons
            name="account-group"
            size={24}
            color={colors.primary}
          />
          <Text style={[styles.detailText, {color: colors.text}]}>
            {event.currentParticipants} / {event.maxParticipants} Katılımcı
          </Text>
        </View>
        {event.tags && event.tags.length > 0 && (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name="tag-multiple"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.detailText, {color: colors.text}]}>
              {event.tags.join(', ')}
            </Text>
          </View>
        )}
      </View>

      {/* Açıklama */}
      <View style={[styles.section, {backgroundColor: colors.card}]}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>
          Etkinlik Açıklaması
        </Text>
        <Text style={[styles.description, {color: colors.text}]}>
          {event.description}
        </Text>
      </View>

      {/* Katılımcılar */}
      {event.participants && event.participants.length > 0 && (
        <View style={[styles.section, {backgroundColor: colors.card}]}>
          <Text style={[styles.sectionTitle, {color: colors.text}]}>
            Katılımcılar
          </Text>
          <View style={styles.participantsList}>
            {event.participants.slice(0, 10).map(participant => (
              <View key={participant.id} style={styles.participantItem}>
                <Image
                  source={{uri: participant.profilePicture}}
                  style={styles.participantAvatar}
                />
                <Text style={[styles.participantName, {color: colors.text}]}>
                  {participant.firstName}
                </Text>
              </View>
            ))}
            {event.participants.length > 10 && (
              <View style={styles.moreParticipants}>
                <Text style={{color: colors.text}}>
                  +{event.participants.length - 10} daha
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      {/* Katılım Butonları */}
      <View style={styles.actionButtonsContainer}>
        {event.participationStatus !== 'JOINED' ? (
          <TouchableOpacity
            style={[
              styles.participateButton,
              {backgroundColor: colors.primary},
            ]}
            onPress={handleParticipate}>
            <MaterialCommunityIcons
              name="calendar-check"
              size={24}
              color="white"
            />
            <Text style={styles.participateButtonText}>Katılıyorum</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[
              styles.participateButton,
              {backgroundColor: colors.notification},
            ]}
            onPress={handleDecline}>
            <MaterialCommunityIcons
              name="calendar-remove"
              size={24}
              color="white"
            />
            <Text style={styles.participateButtonText}>Katılmıyorum</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    marginBottom: 8,
  },
  organizerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  organizerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  organizerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    padding: 16,
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  detailText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  participantsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  participantItem: {
    alignItems: 'center',
    width: 60,
  },
  participantAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 4,
  },
  participantName: {
    fontSize: 12,
    textAlign: 'center',
  },
  moreParticipants: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
  },
  actionButtonsContainer: {
    marginVertical: 16,
    paddingHorizontal: 16,
  },
  participateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  participateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
