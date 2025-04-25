import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useAuth} from '../../context/AuthContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const EditProfileScreen = () => {
  const {colors} = useTheme();
  const {user, updateProfile} = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');

  // Ek kullanıcı bilgileri
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || '');
  const [birthday, setBirthday] = useState(user?.birthday || '');
  const [instagram, setInstagram] = useState(user?.instagram || '');
  const [twitter, setTwitter] = useState(user?.twitter || '');
  const [emergencyContact, setEmergencyContact] = useState(
    user?.emergencyContact || '',
  );
  const [motorcycleBrand, setMotorcycleBrand] = useState(
    user?.motorcycleBrand || '',
  );
  const [motorcycleModel, setMotorcycleModel] = useState(
    user?.motorcycleModel || '',
  );

  const handleSave = async () => {
    try {
      // Telefon numarası kontrolü
      if (phone && !validatePhone(phone)) {
        Alert.alert('Hata', 'Geçerli bir telefon numarası giriniz.');
        return;
      }

      // Email kontrolü
      if (email && !validateEmail(email)) {
        Alert.alert('Hata', 'Geçerli bir e-posta adresi giriniz.');
        return;
      }

      await updateProfile({
        name,
        email,
        phone,
        bio,
        address,
        city,
        birthday,
        instagram,
        twitter,
        emergencyContact,
        motorcycleBrand,
        motorcycleModel,
      });

      Alert.alert('Başarılı', 'Profil bilgileriniz başarıyla güncellendi.');
    } catch (error) {
      console.error('Profil güncellenirken hata:', error);
      Alert.alert('Hata', 'Profil güncellenirken bir hata oluştu.');
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <View style={styles.header}>
        <View style={[styles.avatarContainer, {backgroundColor: colors.card}]}>
          <MaterialCommunityIcons
            name="account"
            size={80}
            color={colors.primary}
          />
          <TouchableOpacity style={styles.changePhotoButton}>
            <MaterialCommunityIcons
              name="camera"
              size={20}
              color={colors.background}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>
          Kişisel Bilgiler
        </Text>

        <Text style={[styles.label, {color: colors.text}]}>Ad Soyad</Text>
        <TextInput
          style={[
            styles.input,
            {backgroundColor: colors.card, color: colors.text},
          ]}
          value={name}
          onChangeText={setName}
          placeholder="Ad Soyad"
          placeholderTextColor={colors.text}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, {color: colors.text}]}>E-posta</Text>
        <TextInput
          style={[
            styles.input,
            {backgroundColor: colors.card, color: colors.text},
          ]}
          value={email}
          onChangeText={setEmail}
          placeholder="E-posta"
          placeholderTextColor={colors.text}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, {color: colors.text}]}>Telefon</Text>
        <TextInput
          style={[
            styles.input,
            {backgroundColor: colors.card, color: colors.text},
          ]}
          value={phone}
          onChangeText={setPhone}
          placeholder="Telefon"
          placeholderTextColor={colors.text}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, {color: colors.text}]}>Doğum Tarihi</Text>
        <TextInput
          style={[
            styles.input,
            {backgroundColor: colors.card, color: colors.text},
          ]}
          value={birthday}
          onChangeText={setBirthday}
          placeholder="GG/AA/YYYY"
          placeholderTextColor={colors.text}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>
          Adres Bilgileri
        </Text>

        <Text style={[styles.label, {color: colors.text}]}>Adres</Text>
        <TextInput
          style={[
            styles.input,
            styles.multilineInput,
            {backgroundColor: colors.card, color: colors.text},
          ]}
          value={address}
          onChangeText={setAddress}
          placeholder="Adres"
          placeholderTextColor={colors.text}
          multiline
          numberOfLines={3}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, {color: colors.text}]}>Şehir</Text>
        <TextInput
          style={[
            styles.input,
            {backgroundColor: colors.card, color: colors.text},
          ]}
          value={city}
          onChangeText={setCity}
          placeholder="Şehir"
          placeholderTextColor={colors.text}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>
          Motosiklet Bilgileri
        </Text>

        <Text style={[styles.label, {color: colors.text}]}>Marka</Text>
        <TextInput
          style={[
            styles.input,
            {backgroundColor: colors.card, color: colors.text},
          ]}
          value={motorcycleBrand}
          onChangeText={setMotorcycleBrand}
          placeholder="Motosiklet Markası"
          placeholderTextColor={colors.text}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, {color: colors.text}]}>Model</Text>
        <TextInput
          style={[
            styles.input,
            {backgroundColor: colors.card, color: colors.text},
          ]}
          value={motorcycleModel}
          onChangeText={setMotorcycleModel}
          placeholder="Motosiklet Modeli"
          placeholderTextColor={colors.text}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>
          Sosyal Medya
        </Text>

        <Text style={[styles.label, {color: colors.text}]}>Instagram</Text>
        <TextInput
          style={[
            styles.input,
            {backgroundColor: colors.card, color: colors.text},
          ]}
          value={instagram}
          onChangeText={setInstagram}
          placeholder="Instagram Kullanıcı Adı"
          placeholderTextColor={colors.text}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.label, {color: colors.text}]}>Twitter</Text>
        <TextInput
          style={[
            styles.input,
            {backgroundColor: colors.card, color: colors.text},
          ]}
          value={twitter}
          onChangeText={setTwitter}
          placeholder="Twitter Kullanıcı Adı"
          placeholderTextColor={colors.text}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>
          Acil Durum
        </Text>

        <Text style={[styles.label, {color: colors.text}]}>
          Acil Durum İrtibat Kişisi
        </Text>
        <TextInput
          style={[
            styles.input,
            {backgroundColor: colors.card, color: colors.text},
          ]}
          value={emergencyContact}
          onChangeText={setEmergencyContact}
          placeholder="Ad Soyad - Telefon"
          placeholderTextColor={colors.text}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, {color: colors.text}]}>
          Biyografi
        </Text>
        <Text style={[styles.label, {color: colors.text}]}>Hakkımda</Text>
        <TextInput
          style={[
            styles.input,
            styles.bioInput,
            {backgroundColor: colors.card, color: colors.text},
          ]}
          value={bio}
          onChangeText={setBio}
          placeholder="Kendinizden bahsedin..."
          placeholderTextColor={colors.text}
          multiline
          numberOfLines={4}
        />
      </View>

      <TouchableOpacity
        style={[styles.saveButton, {backgroundColor: colors.primary}]}
        onPress={handleSave}>
        <Text style={styles.saveButtonText}>Kaydet</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#666',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
    padding: 16,
  },
  saveButton: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;
