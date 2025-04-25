import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import {
  RouteProp,
  useRoute,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import {RootStackParamList} from '../../types/navigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, SIZES} from '../../constants';
import {Club} from '../../services/clubService';
import {mockClubs} from '../../data/mockClubs';
import {mockAnnouncements} from '../../data/mockAnnouncements';
import {upcomingEvents} from '../../data/mockEvents';
import {format} from 'date-fns';
import {tr} from 'date-fns/locale';

type ClubDetailRouteProp = RouteProp<RootStackParamList, 'ClubDetail'>;

export const ClubDetailScreen = () => {
  const {colors} = useTheme();
  const route = useRoute<ClubDetailRouteProp>();
  const navigation = useNavigation();
  const {id} = route.params;

  const [loading, setLoading] = useState(true);
  const [club, setClub] = useState<Club | null>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'announcements'>(
    'events',
  );
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    // Mock verilerden kulüp bilgisini al
    setLoading(true);
    setTimeout(() => {
      const clubData = mockClubs.find(c => c.id === id);
      if (clubData) {
        setClub(clubData);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleJoinClub = () => {
    if (!club) return;

    setJoining(true);
    setTimeout(() => {
      // Mock veride değişiklik
      setClub({
        ...club,
        isJoined: !club.isJoined,
        memberCount: club.isJoined
          ? club.memberCount - 1
          : club.memberCount + 1,
      });
      setJoining(false);
    }, 500);
  };

  const openSocialMedia = (url: string) => {
    Linking.openURL(url).catch(err =>
      console.error('Bağlantı açılamadı:', err),
    );
  };

  if (loading) {
    return (
      <View
        style={[styles.loadingContainer, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{color: colors.text, marginTop: 10}}>
          Kulüp bilgileri yükleniyor...
        </Text>
      </View>
    );
  }

  if (!club) {
    return (
      <View
        style={[styles.errorContainer, {backgroundColor: colors.background}]}>
        <MaterialCommunityIcons
          name="alert-circle-outline"
          size={50}
          color={COLORS.error}
        />
        <Text style={{color: colors.text, marginTop: 10}}>
          Kulüp bulunamadı
        </Text>
      </View>
    );
  }

  // Kulübe ait etkinlikleri ve duyuruları filtrele
  const clubEvents = upcomingEvents.slice(0, 3); // Mock olarak ilk 3 etkinliği gösteriyoruz
  const clubAnnouncements = mockAnnouncements
    .filter(a => a.publisherId === club.id || a.publisher.id === club.id)
    .slice(0, 3); // Mock olarak ilgili duyuruları gösteriyoruz

  const renderHeader = () => (
    <View style={styles.header}>
      <Image
        source={{uri: club.coverPhotoUrl}}
        style={styles.coverPhoto}
        resizeMode="cover"
      />
      <View style={styles.logoContainer}>
        <Image source={{uri: club.logoUrl}} style={styles.logo} />
      </View>
      <View style={styles.clubInfo}>
        <Text style={[styles.clubName, {color: colors.text}]}>{club.name}</Text>
        <View style={styles.locationContainer}>
          <MaterialCommunityIcons
            name="map-marker"
            size={16}
            color={COLORS.textSecondary}
          />
          <Text style={[styles.locationText, {color: COLORS.textSecondary}]}>
            {club.city}
            {club.district ? `, ${club.district}` : ''}
          </Text>
        </View>
        <View style={styles.memberCount}>
          <MaterialCommunityIcons
            name="account-group"
            size={16}
            color={COLORS.textSecondary}
          />
          <Text style={[styles.memberCountText, {color: COLORS.textSecondary}]}>
            {club.memberCount} üye
          </Text>
        </View>
      </View>
    </View>
  );

  const renderDescription = () => (
    <View style={[styles.section, {backgroundColor: colors.card}]}>
      <Text style={[styles.sectionTitle, {color: colors.text}]}>Hakkında</Text>
      <Text style={[styles.description, {color: colors.text}]}>
        {club.description}
      </Text>
    </View>
  );

  const renderTags = () => (
    <View style={[styles.section, {backgroundColor: colors.card}]}>
      <Text style={[styles.sectionTitle, {color: colors.text}]}>Etiketler</Text>
      <View style={styles.tagsContainer}>
        {club.tags.map((tag, index) => (
          <View
            key={index}
            style={[styles.tag, {backgroundColor: colors.background}]}>
            <Text style={{color: colors.text}}>{tag}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderSocialMedia = () => (
    <View style={[styles.section, {backgroundColor: colors.card}]}>
      <Text style={[styles.sectionTitle, {color: colors.text}]}>
        Sosyal Medya
      </Text>
      <View style={styles.socialLinks}>
        {club.socialMedia?.instagram && (
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() =>
              openSocialMedia(
                `https://instagram.com/${club.socialMedia?.instagram}`,
              )
            }>
            <MaterialCommunityIcons
              name="instagram"
              size={28}
              color="#E1306C"
            />
          </TouchableOpacity>
        )}
        {club.socialMedia?.facebook && (
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() =>
              openSocialMedia(
                `https://facebook.com/${club.socialMedia?.facebook}`,
              )
            }>
            <MaterialCommunityIcons name="facebook" size={28} color="#1877F2" />
          </TouchableOpacity>
        )}
        {club.socialMedia?.twitter && (
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() =>
              openSocialMedia(
                `https://twitter.com/${club.socialMedia?.twitter}`,
              )
            }>
            <MaterialCommunityIcons name="twitter" size={28} color="#1DA1F2" />
          </TouchableOpacity>
        )}
        {club.socialMedia?.website && (
          <TouchableOpacity
            style={styles.socialButton}
            onPress={() => openSocialMedia(club.socialMedia?.website || '')}>
            <MaterialCommunityIcons name="web" size={28} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderAdmins = () => (
    <View style={[styles.section, {backgroundColor: colors.card}]}>
      <Text style={[styles.sectionTitle, {color: colors.text}]}>
        Yöneticiler
      </Text>
      <View style={styles.adminsContainer}>
        {club.admins.map(admin => (
          <View key={admin.id} style={styles.adminItem}>
            <Image
              source={{uri: admin.profilePicture}}
              style={styles.adminPhoto}
            />
            <Text style={[styles.adminName, {color: colors.text}]}>
              {admin.firstName} {admin.lastName}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderJoinButton = () => (
    <TouchableOpacity
      style={[
        styles.joinButton,
        {backgroundColor: club.isJoined ? COLORS.error : colors.primary},
      ]}
      onPress={handleJoinClub}
      disabled={joining}>
      {joining ? (
        <ActivityIndicator color="white" size="small" />
      ) : (
        <>
          <MaterialCommunityIcons
            name={club.isJoined ? 'account-remove' : 'account-plus'}
            size={20}
            color="white"
          />
          <Text style={styles.joinButtonText}>
            {club.isJoined ? 'Ayrıl' : 'Katıl'}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'events'
            ? {borderBottomColor: colors.primary, borderBottomWidth: 2}
            : null,
        ]}
        onPress={() => setActiveTab('events')}>
        <Text
          style={[
            styles.tabText,
            {
              color:
                activeTab === 'events' ? colors.primary : COLORS.textSecondary,
            },
          ]}>
          Etkinlikler
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'announcements'
            ? {borderBottomColor: colors.primary, borderBottomWidth: 2}
            : null,
        ]}
        onPress={() => setActiveTab('announcements')}>
        <Text
          style={[
            styles.tabText,
            {
              color:
                activeTab === 'announcements'
                  ? colors.primary
                  : COLORS.textSecondary,
            },
          ]}>
          Duyurular
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (activeTab === 'events') {
      return (
        <View style={styles.contentContainer}>
          {clubEvents.length > 0 ? (
            clubEvents.map(event => (
              <TouchableOpacity
                key={event.id}
                style={[styles.eventCard, {backgroundColor: colors.card}]}
                onPress={() =>
                  navigation.navigate('EventDetail', {eventId: event.id})
                }>
                <View style={styles.eventHeader}>
                  <Text style={[styles.eventTitle, {color: colors.text}]}>
                    {event.title}
                  </Text>
                </View>
                <Text style={[styles.eventDate, {color: COLORS.textSecondary}]}>
                  {format(new Date(event.startDate), 'd MMMM yyyy', {
                    locale: tr,
                  })}
                </Text>
                <View style={styles.eventLocation}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={16}
                    color={COLORS.textSecondary}
                  />
                  <Text
                    style={[styles.eventLocationText, {color: colors.text}]}>
                    {event.location.city}, {event.location.district}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[styles.emptyText, {color: COLORS.textSecondary}]}>
              Yaklaşan etkinlik bulunmuyor
            </Text>
          )}
          {clubEvents.length > 0 && (
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() =>
                navigation.navigate('EventsScreen', {clubId: club.id})
              }>
              <Text style={[styles.seeAllText, {color: colors.primary}]}>
                Tüm Etkinlikleri Gör
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      );
    } else {
      return (
        <View style={styles.contentContainer}>
          {clubAnnouncements.length > 0 ? (
            clubAnnouncements.map(announcement => (
              <TouchableOpacity
                key={announcement.id}
                style={[
                  styles.announcementCard,
                  {backgroundColor: colors.card},
                ]}
                onPress={() =>
                  navigation.navigate('AnnouncementDetail', {
                    id: announcement.id,
                  })
                }>
                <Text style={[styles.announcementTitle, {color: colors.text}]}>
                  {announcement.title}
                </Text>
                <Text
                  style={[
                    styles.announcementContent,
                    {color: COLORS.textSecondary},
                  ]}
                  numberOfLines={2}>
                  {announcement.content}
                </Text>
                <Text
                  style={[
                    styles.announcementDate,
                    {color: COLORS.textSecondary},
                  ]}>
                  {format(new Date(announcement.createdAt), 'd MMMM yyyy', {
                    locale: tr,
                  })}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={[styles.emptyText, {color: COLORS.textSecondary}]}>
              Duyuru bulunmuyor
            </Text>
          )}
          {clubAnnouncements.length > 0 && (
            <TouchableOpacity
              style={styles.seeAllButton}
              onPress={() =>
                navigation.navigate('AnnouncementDetail', {
                  publisherId: club.id,
                })
              }>
              <Text style={[styles.seeAllText, {color: colors.primary}]}>
                Tüm Duyuruları Gör
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      );
    }
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}>
      {renderHeader()}
      {renderJoinButton()}
      {renderDescription()}
      {renderTags()}
      {club.socialMedia &&
        Object.keys(club.socialMedia).length > 0 &&
        renderSocialMedia()}
      {renderAdmins()}

      <View style={[styles.contentSection, {backgroundColor: colors.card}]}>
        {renderTabs()}
        {renderContent()}
      </View>
    </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'relative',
    marginBottom: 60,
  },
  coverPhoto: {
    width: '100%',
    height: 180,
  },
  logoContainer: {
    position: 'absolute',
    left: SIZES.spacing.lg,
    bottom: -50,
    borderRadius: 50,
    backgroundColor: 'white',
    padding: 3,
    elevation: 4,
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  clubInfo: {
    marginLeft: SIZES.spacing.lg + 110,
    marginRight: SIZES.spacing.lg,
    marginTop: 10,
  },
  clubName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    marginLeft: 4,
    fontSize: 14,
  },
  memberCount: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  memberCountText: {
    marginLeft: 4,
    fontSize: 14,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SIZES.spacing.lg,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: SIZES.spacing.lg,
    gap: 8,
  },
  joinButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  section: {
    padding: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
    marginHorizontal: SIZES.spacing.md,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  socialLinks: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    padding: 8,
  },
  adminsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  adminItem: {
    alignItems: 'center',
  },
  adminPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
  },
  adminName: {
    fontSize: 14,
    textAlign: 'center',
  },
  contentSection: {
    marginHorizontal: SIZES.spacing.md,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: SIZES.spacing.xl,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
  },
  contentContainer: {
    padding: SIZES.spacing.lg,
  },
  eventCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  eventHeader: {
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 8,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocationText: {
    marginLeft: 4,
    fontSize: 14,
  },
  announcementCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  announcementContent: {
    fontSize: 14,
    marginBottom: 8,
  },
  announcementDate: {
    fontSize: 12,
    alignSelf: 'flex-end',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 20,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 8,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    marginRight: 4,
  },
});
