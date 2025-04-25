import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useTheme } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

type Participant = {
  id: string;
  name: string;
  avatar: string;
};

type EventDetailProps = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  participants: Participant[];
  maxParticipants: number;
  isParticipating: boolean;
  organizerName: string;
  organizerAvatar: string;
};

export const EventDetailScreen = () => {
  const { colors } = useTheme();
  const [isParticipating, setIsParticipating] = useState(false);

  // Örnek veri - API'den gelecek
  const eventData: EventDetailProps = {
    id: '1',
    title: 'Yazılım Atölyesi',
    description:
      'React Native ile mobil uygulama geliştirme atölyesi. Temel seviyeden ileri seviyeye kadar React Native konuları işlenecektir.',
    date: '2024-03-15T14:00:00',
    location: 'A Blok - Lab 3',
    participants: [
      {
        id: '1',
        name: 'Ahmet Yılmaz',
        avatar: 'https://example.com/avatar1.jpg',
      },
      // Diğer katılımcılar
    ],
    maxParticipants: 30,
    isParticipating: false,
    organizerName: 'Yazılım Kulübü',
    organizerAvatar: 'https://example.com/club-logo.jpg',
  };

  const handleParticipation = () => {
    // API çağrısı yapılacak
    setIsParticipating(!isParticipating);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Başlık ve Organizatör Bilgisi */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.organizerInfo}>
          <Image
            source={{ uri: eventData.organizerAvatar }}
            style={styles.organizerAvatar}
          />
          <Text style={[styles.organizerName, { color: colors.text }]}>
            {eventData.organizerName}
          </Text>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>
          {eventData.title}
        </Text>
      </View>

      {/* Etkinlik Detayları */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons
            name="calendar"
            size={24}
            color={colors.primary}
          />
          <Text style={[styles.detailText, { color: colors.text }]}>
            {format(new Date(eventData.date), 'd MMMM yyyy, HH:mm', {
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
          <Text style={[styles.detailText, { color: colors.text }]}>
            {eventData.location}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons
            name="account-group"
            size={24}
            color={colors.primary}
          />
          <Text style={[styles.detailText, { color: colors.text }]}>
            {eventData.participants.length} / {eventData.maxParticipants}{' '}
            Katılımcı
          </Text>
        </View>
      </View>

      {/* Açıklama */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Etkinlik Açıklaması
        </Text>
        <Text style={[styles.description, { color: colors.text }]}>
          {eventData.description}
        </Text>
      </View>

      {/* Katılımcılar */}
      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Katılımcılar
        </Text>
        <View style={styles.participantsList}>
          {eventData.participants.map((participant) => (
            <View key={participant.id} style={styles.participantItem}>
              <Image
                source={{ uri: participant.avatar }}
                style={styles.participantAvatar}
              />
              <Text style={[styles.participantName, { color: colors.text }]}>
                {participant.name}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Katılım Butonu */}
      <TouchableOpacity
        style={[
          styles.participateButton,
          {
            backgroundColor: isParticipating
              ? colors.notification
              : colors.primary,
          },
        ]}
        onPress={handleParticipation}
      >
        <MaterialCommunityIcons
          name={isParticipating ? 'calendar-remove' : 'calendar-check'}
          size={24}
          color="white"
        />
        <Text style={styles.participateButtonText}>
          {isParticipating ? 'Katılımı İptal Et' : 'Katıl'}
        </Text>
      </TouchableOpacity>
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
  participateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    gap: 8,
  },
  participateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
