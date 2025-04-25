import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextStyle,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button } from '../../components/ui';
import { COLORS, FONTS, SIZES, ROUTES } from '../../constants';
import { useAuthStore } from '../../store';
import { UserProfileResponse } from '../../services/authService';

const ProfileCompletionScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user, updateProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfileResponse>>({
    nickname: user?.nickname || '',
    phoneNumber: user?.phoneNumber || '',
    city: user?.city || '',
    district: user?.district || '',
    motorcycleBrand: user?.motorcycleBrand || '',
    motorcycleModel: user?.motorcycleModel || '',
    motorcycleCc: user?.motorcycleCc || undefined,
    bloodType: user?.bloodType || '',
    clothingSize: user?.clothingSize || '',
    driverLicenseType: user?.driverLicenseType || '',
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
  });

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Zorunlu alanları kontrol et
      const requiredFields = [
        'phoneNumber',
        'city',
        'district',
        'motorcycleBrand',
        'motorcycleModel',
      ];

      const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof typeof formData],
      );

      if (missingFields.length > 0) {
        Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurun.');
        setIsLoading(false);
        return;
      }

      await updateProfile(formData);
      Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi.', [
        {
          text: 'Tamam',
          onPress: () => {
            // Ana sayfaya yönlendir
            navigation.reset({
              index: 0,
              routes: [{ name: ROUTES.MAIN.HOME as never }],
            });
          },
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Hata',
        'Profil bilgileriniz güncellenirken bir hata oluştu.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title as TextStyle}>Profilinizi tamamlayın</Text>
          <Text style={styles.subtitle as TextStyle}>
            Motosiklet tutkunları topluluğuna katılmak için lütfen profil
            bilgilerinizi doldurun.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefon Numarası</Text>
            <TextInput
              style={[styles.input, { color: COLORS.text }]}
              value={formData.phoneNumber}
              onChangeText={(text: string) =>
                setFormData((prev) => ({ ...prev, phoneNumber: text }))
              }
              placeholder="5XX XXX XX XX"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Şehir</Text>
            <TextInput
              style={[styles.input, { color: COLORS.text }]}
              value={formData.city}
              onChangeText={(text: string) =>
                setFormData((prev) => ({ ...prev, city: text }))
              }
              placeholder="İstanbul"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>İlçe</Text>
            <TextInput
              style={[styles.input, { color: COLORS.text }]}
              value={formData.district}
              onChangeText={(text: string) =>
                setFormData((prev) => ({ ...prev, district: text }))
              }
              placeholder="Kadıköy"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Motosiklet Markası</Text>
            <TextInput
              style={[styles.input, { color: COLORS.text }]}
              value={formData.motorcycleBrand}
              onChangeText={(text: string) =>
                setFormData((prev) => ({ ...prev, motorcycleBrand: text }))
              }
              placeholder="Honda"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Motosiklet Modeli</Text>
            <TextInput
              style={[styles.input, { color: COLORS.text }]}
              value={formData.motorcycleModel}
              onChangeText={(text: string) =>
                setFormData((prev) => ({ ...prev, motorcycleModel: text }))
              }
              placeholder="CBR 250R"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Profili Tamamla"
            variant="primary"
            size="large"
            fullWidth
            onPress={handleSubmit}
            isLoading={isLoading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    marginBottom: SIZES.spacing.xl * 2,
  },
  title: {
    ...FONTS.h1,
    color: COLORS.text,
    marginBottom: SIZES.spacing.sm,
  } as TextStyle,
  subtitle: {
    ...FONTS.body2,
    color: COLORS.textSecondary,
  } as TextStyle,
  formContainer: {
    marginBottom: SIZES.spacing.xl * 2,
  },
  buttonContainer: {
    marginTop: SIZES.spacing.lg,
  },
  inputContainer: {
    marginBottom: SIZES.spacing.md,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SIZES.spacing.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radius.sm,
    paddingHorizontal: SIZES.spacing.md,
    fontSize: 16,
  },
});

export default ProfileCompletionScreen;
