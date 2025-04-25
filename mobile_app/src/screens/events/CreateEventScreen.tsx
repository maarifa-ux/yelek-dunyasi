import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../types/navigation';
import {COLORS, SIZES} from '../../constants';
import DateTimePicker from '@react-native-community/datetimepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {format} from 'date-fns';
import {tr} from 'date-fns/locale';
import {Event} from '../../services/eventService';
import {allEvents} from '../../data/mockEvents';

type CreateEventScreenNavigationProp =
  NativeStackNavigationProp<RootStackParamList>;

interface EventFormData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: {
    city: string;
    district: string;
    address: string;
  };
  maxParticipants: string;
  isPrivate: boolean;
  tags: string[];
}

export const CreateEventScreen: React.FC = () => {
  const {colors} = useTheme();
  const navigation = useNavigation<CreateEventScreenNavigationProp>();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    startDate: new Date(),
    endDate: new Date(new Date().getTime() + 2 * 60 * 60 * 1000), // 2 saat sonra
    location: {
      city: '',
      district: '',
      address: '',
    },
    maxParticipants: '10',
    isPrivate: false,
    tags: [],
  });

  // Date picker state
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [currentTag, setCurrentTag] = useState('');

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
  };

  const handleLocationChange = (
    field: keyof typeof formData.location,
    value: string,
  ) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value,
      },
    }));
  };

  const handleDateChange = (
    field: 'startDate' | 'endDate',
    selectedDate?: Date,
  ) => {
    if (selectedDate) {
      setFormData(prev => ({...prev, [field]: selectedDate}));

      // Başlangıç tarihi güncellendiğinde bitiş tarihini de güncelle
      if (field === 'startDate' && selectedDate > formData.endDate) {
        // Bitiş tarihini başlangıç tarihinden 2 saat sonraya ayarla
        const newEndDate = new Date(
          selectedDate.getTime() + 2 * 60 * 60 * 1000,
        );
        setFormData(prev => ({...prev, endDate: newEndDate}));
      }
    }

    if (field === 'startDate') {
      setShowStartDatePicker(false);
    } else {
      setShowEndDatePicker(false);
    }
  };

  const togglePrivate = () => {
    setFormData(prev => ({...prev, isPrivate: !prev.isPrivate}));
  };

  const addTag = () => {
    if (currentTag && !formData.tags.includes(currentTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag],
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.title) {
      Alert.alert('Hata', 'Lütfen etkinlik başlığı girin.');
      return false;
    }
    if (!formData.description) {
      Alert.alert('Hata', 'Lütfen etkinlik açıklaması girin.');
      return false;
    }
    if (!formData.location.city || !formData.location.district) {
      Alert.alert('Hata', 'Lütfen şehir ve ilçe bilgilerini girin.');
      return false;
    }
    if (
      isNaN(parseInt(formData.maxParticipants)) ||
      parseInt(formData.maxParticipants) <= 0
    ) {
      Alert.alert('Hata', 'Lütfen geçerli bir katılımcı sayısı girin.');
      return false;
    }
    if (formData.endDate <= formData.startDate) {
      Alert.alert(
        'Hata',
        'Bitiş tarihi, başlangıç tarihinden sonra olmalıdır.',
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);

    // Yeni etkinlik eklemeyi simüle et
    setTimeout(() => {
      try {
        // Kullanıcı bilgilerini mock olarak oluştur
        // @ts-ignore - Event tipindeki alan uyumsuzluklarını görmezden geliyoruz
        const newEvent: Event = {
          id: `event_${Date.now()}`,
          title: formData.title,
          description: formData.description,
          coverPhotoUrl:
            'https://via.placeholder.com/300?text=Event+Cover+Photo',
          startDate: formData.startDate.toISOString(),
          endDate: formData.endDate.toISOString(),
          location: {
            city: formData.location.city,
            district: formData.location.district,
            address: formData.location.address || '',
            // @ts-ignore - coordinates özelliği Event tipinde bulunmuyor olabilir
            coordinates: {
              latitude: 41.0082,
              longitude: 28.9784,
            },
          },
          maxParticipants: parseInt(formData.maxParticipants),
          currentParticipants: 1, // Oluşturan kişi
          organizer: {
            id: 'user_1',
            firstName: 'Ali',
            lastName: 'Yılmaz',
            profilePicture: 'https://via.placeholder.com/150?text=User+Avatar',
          },
          club: {
            id: 'club_1',
            name: 'Bisiklet Sevenler Kulübü',
            logoUrl: 'https://via.placeholder.com/150?text=Club+Logo',
          },
          eventType: 'RIDE',
          status: 'UPCOMING',
          isPrivate: formData.isPrivate,
          participationStatus: 'JOINED',
          participants: [
            // @ts-ignore - role özelliği Event participant tipinde bulunmuyor olabilir
            {
              id: 'user_1',
              firstName: 'Ali',
              lastName: 'Yılmaz',
              profilePicture:
                'https://via.placeholder.com/150?text=User+Avatar',
              role: 'ORGANIZER',
            },
          ],
          tags: formData.tags,
          route: undefined,
          clubId: 'club_1',
        };

        // Mock veri deposuna ekle
        allEvents.push(newEvent);

        setLoading(false);
        Alert.alert('Başarılı', 'Etkinlik başarıyla oluşturuldu', [
          {
            text: 'Tamam',
            onPress: () => navigation.goBack(),
          },
        ]);
      } catch (error) {
        setLoading(false);
        Alert.alert('Hata', 'Etkinlik oluşturulurken bir hata oluştu');
        console.error('Etkinlik oluşturma hatası:', error);
      }
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        style={[styles.container, {backgroundColor: colors.background}]}>
        <View style={styles.formContainer}>
          {/* Başlık */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.text}]}>
              Etkinlik Başlığı*
            </Text>
            <TextInput
              style={[
                styles.input,
                {backgroundColor: colors.card, color: colors.text},
              ]}
              placeholder="Etkinlik başlığını giriniz"
              placeholderTextColor={COLORS.textSecondary}
              value={formData.title}
              onChangeText={value => handleInputChange('title', value)}
            />
          </View>

          {/* Açıklama */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.text}]}>Açıklama*</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                {backgroundColor: colors.card, color: colors.text},
              ]}
              placeholder="Etkinlik hakkında detaylı bilgi veriniz"
              placeholderTextColor={COLORS.textSecondary}
              multiline
              textAlignVertical="top"
              numberOfLines={4}
              value={formData.description}
              onChangeText={value => handleInputChange('description', value)}
            />
          </View>

          {/* Başlangıç Tarihi */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.text}]}>
              Başlangıç Tarihi ve Saati*
            </Text>
            <TouchableOpacity
              style={[styles.datePickerButton, {backgroundColor: colors.card}]}
              onPress={() => setShowStartDatePicker(true)}>
              <Text style={{color: colors.text}}>
                {format(formData.startDate, 'dd MMMM yyyy HH:mm', {locale: tr})}
              </Text>
              <MaterialCommunityIcons
                name="calendar"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
            {showStartDatePicker && (
              <DateTimePicker
                value={formData.startDate}
                mode="datetime"
                display="default"
                onChange={(event: any, date?: Date) =>
                  handleDateChange('startDate', date)
                }
              />
            )}
          </View>

          {/* Bitiş Tarihi */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.text}]}>
              Bitiş Tarihi ve Saati*
            </Text>
            <TouchableOpacity
              style={[styles.datePickerButton, {backgroundColor: colors.card}]}
              onPress={() => setShowEndDatePicker(true)}>
              <Text style={{color: colors.text}}>
                {format(formData.endDate, 'dd MMMM yyyy HH:mm', {locale: tr})}
              </Text>
              <MaterialCommunityIcons
                name="calendar"
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
            {showEndDatePicker && (
              <DateTimePicker
                value={formData.endDate}
                mode="datetime"
                display="default"
                onChange={(event: any, date?: Date) =>
                  handleDateChange('endDate', date)
                }
                minimumDate={formData.startDate}
              />
            )}
          </View>

          {/* Konum */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.text}]}>Konum*</Text>

            <View style={styles.locationContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.locationInput,
                  {backgroundColor: colors.card, color: colors.text},
                ]}
                placeholder="Şehir"
                placeholderTextColor={COLORS.textSecondary}
                value={formData.location.city}
                onChangeText={value => handleLocationChange('city', value)}
              />
              <TextInput
                style={[
                  styles.input,
                  styles.locationInput,
                  {backgroundColor: colors.card, color: colors.text},
                ]}
                placeholder="İlçe"
                placeholderTextColor={COLORS.textSecondary}
                value={formData.location.district}
                onChangeText={value => handleLocationChange('district', value)}
              />
            </View>

            <TextInput
              style={[
                styles.input,
                {backgroundColor: colors.card, color: colors.text},
              ]}
              placeholder="Açık Adres"
              placeholderTextColor={COLORS.textSecondary}
              value={formData.location.address}
              onChangeText={value => handleLocationChange('address', value)}
            />
          </View>

          {/* Maksimum Katılımcı */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.text}]}>
              Maksimum Katılımcı Sayısı*
            </Text>
            <TextInput
              style={[
                styles.input,
                {backgroundColor: colors.card, color: colors.text},
              ]}
              placeholder="10"
              placeholderTextColor={COLORS.textSecondary}
              keyboardType="number-pad"
              value={formData.maxParticipants}
              onChangeText={value =>
                handleInputChange('maxParticipants', value)
              }
            />
          </View>

          {/* Etiketler */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.text}]}>Etiketler</Text>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={[
                  styles.input,
                  styles.tagInput,
                  {backgroundColor: colors.card, color: colors.text},
                ]}
                placeholder="Etiket ekle"
                placeholderTextColor={COLORS.textSecondary}
                value={currentTag}
                onChangeText={setCurrentTag}
              />
              <TouchableOpacity
                style={[styles.tagButton, {backgroundColor: colors.primary}]}
                onPress={addTag}>
                <MaterialCommunityIcons name="plus" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <View style={styles.tagsContainer}>
              {formData.tags.map(tag => (
                <View
                  key={tag}
                  style={[styles.tag, {backgroundColor: colors.primary}]}>
                  <Text style={styles.tagText}>{tag}</Text>
                  <TouchableOpacity onPress={() => removeTag(tag)}>
                    <MaterialCommunityIcons
                      name="close"
                      size={18}
                      color="white"
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Gizlilik Ayarı */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, {color: colors.text}]}>Gizlilik</Text>
            <TouchableOpacity
              style={styles.privacyToggle}
              onPress={togglePrivate}>
              <View
                style={[
                  styles.toggleSwitch,
                  formData.isPrivate
                    ? {backgroundColor: colors.primary}
                    : {backgroundColor: COLORS.textSecondary},
                ]}>
                <View
                  style={[
                    styles.toggleKnob,
                    formData.isPrivate ? {right: 2} : {left: 2},
                  ]}
                />
              </View>
              <Text style={{color: colors.text, marginLeft: 10}}>
                {formData.isPrivate
                  ? 'Özel (Sadece davet edilenler)'
                  : 'Herkese Açık'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, {backgroundColor: colors.primary}]}
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.submitButtonText}>Etkinliği Oluştur</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: SIZES.spacing.md,
  },
  inputGroup: {
    marginBottom: SIZES.spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textArea: {
    height: 120,
    padding: 12,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  locationInput: {
    flex: 1,
    marginRight: 10,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagInput: {
    flex: 1,
    marginRight: 10,
  },
  tagButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: 'white',
    marginRight: 4,
  },
  privacyToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleSwitch: {
    width: 50,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
    position: 'absolute',
  },
  submitButton: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SIZES.spacing.lg,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
