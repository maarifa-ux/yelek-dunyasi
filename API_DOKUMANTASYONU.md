# Yelekli Dünyası API Dokümantasyonu v1.0

Bu dokümantasyon, Yelekli Dünyası uygulamasının tüm API endpointlerini, istek/yanıt formatlarını ve örnek kullanım senaryolarını detaylı olarak açıklamaktadır. Frontend geliştiricileri ve sistem entegratörleri için hazırlanmıştır.

## İçindekiler

- [İçindekiler](#i̇çindekiler)
- [Giriş](#giriş)
  - [API Temel URL](#api-temel-url)
  - [Sürüm Kontrolü](#sürüm-kontrolü)
  - [İstek Formatı](#i̇stek-formatı)
  - [Yanıt Formatı](#yanıt-formatı)
  - [Hata Kodları](#hata-kodları)
  - [Sayfalama](#sayfalama)
  - [Sıralama](#sıralama)
  - [Filtreleme](#filtreleme)
- [Kimlik Doğrulama](#kimlik-doğrulama)
  - [1. Google ile Giriş/Kayıt](#1-google-ile-girişkayıt)
  - [2. Yetkilendirme](#2-yetkilendirme)
  - [3. Token Yenileme](#3-token-yenileme)
  - [4. Çıkış Yapma](#4-çıkış-yapma)
- [Kullanıcı İşlemleri](#kullanıcı-i̇şlemleri)
  - [1. Kullanıcı Profili Görüntüleme](#1-kullanıcı-profili-görüntüleme)
  - [2. Kullanıcı Profilini Güncelleme](#2-kullanıcı-profilini-güncelleme)
  - [3. Şifre Değiştirme](#3-şifre-değiştirme)
  - [4. Profil Fotoğrafı Güncelleme](#4-profil-fotoğrafı-güncelleme)
  - [5. Kullanıcı Bildirim Ayarlarını Güncelleme](#5-kullanıcı-bildirim-ayarlarını-güncelleme)
  - [6. OneSignal Player ID Güncelleme](#6-onesignal-player-id-güncelleme)
  - [7. Kullanıcı Arama](#7-kullanıcı-arama)
- [Profil Tamamlama](#profil-tamamlama)
  - [1. Profil Tamamlama Durumu Kontrol Etme](#1-profil-tamamlama-durumu-kontrol-etme)
  - [2. Profil Tamamlama](#2-profil-tamamlama)
  - [3. Profil Tamamlama Alanlarını Kontrol Etme](#3-profil-tamamlama-alanlarını-kontrol-etme)
- [Kulüp İşlemleri](#kulüp-i̇şlemleri)
  - [1. Kulüp Oluşturma](#1-kulüp-oluşturma)
  - [2. Kulüp Listesini Görüntüleme](#2-kulüp-listesini-görüntüleme)
  - [3. Kulüp Detayı Görüntüleme](#3-kulüp-detayı-görüntüleme)
  - [4. Kulübe Üye Ekleme](#4-kulübe-üye-ekleme)
  - [5. Kulüp Şehri Ekleme](#5-kulüp-şehri-ekleme)
- [Etkinlik İşlemleri](#etkinlik-i̇şlemleri)
  - [1. Etkinlik Oluşturma](#1-etkinlik-oluşturma)
  - [2. Etkinlik Listesini Görüntüleme](#2-etkinlik-listesini-görüntüleme)
  - [3. Etkinlik Detayı Görüntüleme](#3-etkinlik-detayı-görüntüleme)
  - [4. Etkinliğe Katılma](#4-etkinliğe-katılma)
- [Bildirim İşlemleri](#bildirim-i̇şlemleri)
  - [1. Bildirim Gönderme](#1-bildirim-gönderme)
  - [2. Bildirimleri Görüntüleme](#2-bildirimleri-görüntüleme)
- [Pazaryeri İşlemleri](#pazaryeri-i̇şlemleri)
  - [1. Ürün Ekleme](#1-ürün-ekleme)
  - [2. Ürünleri Görüntüleme](#2-ürünleri-görüntüleme)
  - [3. Ürün Detayı Görüntüleme](#3-ürün-detayı-görüntüleme)
  - [4. Sipariş Oluşturma](#4-sipariş-oluşturma)
  - [5. Siparişleri Görüntüleme](#5-siparişleri-görüntüleme)
  - [6. Sipariş Detayı Görüntüleme](#6-sipariş-detayı-görüntüleme)
- [Kullanıcı Rolleri ve İzinleri](#kullanıcı-rolleri-ve-i̇zinleri)
  - [Sistem Rolleri](#sistem-rolleri)
  - [Kulüp Rolleri](#kulüp-rolleri)

## Giriş

### API Temel URL

API'nin temel URL'i:
- Canlı ortam: `https://api.yeleklidunyasi.com`
- Test ortamı: `https://test-api.yeleklidunyasi.com`
- Geliştirme ortamı: `http://localhost:3000`

### Sürüm Kontrolü

API sürüm kontrolü URL yoluyla yapılmaktadır. Örneğin:
- `/v1/auth/me` - API versiyon 1
- `/v2/auth/me` - API versiyon 2 (gelecekte)

### İstek Formatı

Tüm API isteklerinde aşağıdaki header'lar kullanılmalıdır:
- `Content-Type: application/json`
- `Accept: application/json`
- Yetkilendirme gerektiren isteklerde: `Authorization: Bearer {TOKEN}`

### Yanıt Formatı

Tüm API yanıtları JSON formatında olup, genel yapısı aşağıdaki gibidir:

Başarılı yanıt örneği:
```json
{
  "data": { ... },
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 100,
      "totalPages": 10
    }
  }
}
```

Hata yanıtı örneği:
```json
{
  "status": 400,
  "errors": {
    "field": "errorCode",
    "message": "Hata açıklaması"
  }
}
```

### Hata Kodları

API'nin döndürebileceği genel hata kodları:

| HTTP Kodu | Açıklama |
|-----------|----------|
| 400 | Geçersiz istek parametreleri |
| 401 | Yetkilendirme hatası |
| 403 | Yetkisiz erişim |
| 404 | Kaynak bulunamadı |
| 422 | Doğrulama hatası |
| 429 | Çok fazla istek |
| 500 | Sunucu hatası |

Özel hata kodları her endpointin açıklamasında belirtilmiştir.

### Sayfalama

Çoklu kayıt döndüren API'lerde sayfalama parametreleri:
- `page`: Sayfa numarası (1'den başlar)
- `limit`: Sayfa başına kayıt sayısı (varsayılan: 10, maksimum: 100)

Örnek:
```
GET /api/clubs?page=2&limit=20
```

### Sıralama

Çoklu kayıt döndüren API'lerde sıralama parametreleri:
- `orderBy`: Sıralanacak alan adı
- `order`: Sıralama yönü (`ASC` veya `DESC`)

Örnek:
```
GET /api/clubs?orderBy=name&order=ASC
```

### Filtreleme

Çoklu kayıt döndüren API'lerde filtreleme için istek gövdesinde `filter` objesi kullanılabilir:

Örnek:
```
GET /api/clubs?filter[name]=motor&filter[city]=istanbul
```

## Kimlik Doğrulama

### 1. Google ile Giriş/Kayıt

**Endpoint:** `POST /auth/google/login`

**Açıklama:** Bu endpoint, Google Authentication API'si ile alınan idToken'ı kullanarak kullanıcı girişi veya kaydı yapar. Eğer kullanıcı sistemde yoksa otomatik olarak kayıt edilir, varsa giriş işlemi gerçekleştirilir.

**İstek:**

```json
{
  "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFiYjk2MDVjMzZlOThlM..."
}
```

**Curl Örneği:**

```bash
curl -X POST https://api.yeleklidunyasi.com/auth/google/login \
  -H "Content-Type: application/json" \
  -d '{
    "idToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjFiYjk2MDVjMzZlOThlM..."
  }'
```

**Başarılı Yanıt (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenExpires": 1617567890000,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "kullanici@gmail.com",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "nickname": "rider42",
    "phoneNumber": "+905551234567",
    "city": "İstanbul",
    "district": "Kadıköy",
    "motorcycleBrand": "Honda",
    "motorcycleModel": "CBR 250R",
    "motorcycleCc": 250,
    "profilePicture": "http://ornek.com/resim.jpg",
    "bloodType": "A_POSITIVE",
    "clothingSize": "XL",
    "driverLicenseType": "A2",
    "emergencyContactName": "Mehmet Yılmaz",
    "emergencyContactRelation": "Kardeş",
    "emergencyContactPhone": "+905551234568",
    "role": { "id": 2, "name": "user" },
    "status": { "id": 1, "name": "active" }
  },
  "isProfileCompleted": true,
  "clubMemberships": [
    {
      "clubId": "550e8400-e29b-41d4-a716-446655440001",
      "clubName": "Yelekli Motosiklet Kulübü",
      "clubLogo": "http://ornek.com/logo.jpg",
      "clubCity": "İstanbul",
      "rank": "member",
      "rankDescription": "member",
      "permissions": {
        "canCreateEvent": false,
        "canManageMembers": false,
        "canManageCity": false,
        "canSendAnnouncement": false,
        "canAddProduct": false,
        "canManageClub": false,
        "canRemoveMember": false,
        "canManageEvents": false
      },
      "status": "active",
      "events": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440004",
          "title": "Hafta Sonu Turu",
          "startDate": "2023-08-15T09:00:00.000Z",
          "endDate": "2023-08-15T18:00:00.000Z"
        }
      ]
    }
  ]
}
```

**Hata Yanıtları:**

| HTTP Kodu | Hata Kodu | Açıklama |
|-----------|-----------|----------|
| 422 | wrongToken | Geçersiz veya süresi dolmuş Google token |
| 422 | userNotFound | Kullanıcı bulunamadı |

**İstemci Uygulama Adımları:**

1. İstemci uygulamanızda Google Sign-In entegrasyonunu yapın
2. Kullanıcı Google ile giriş yaptığında Google'dan bir idToken alın
3. Bu idToken'ı `/auth/google/login` endpointine gönderin
4. Dönen token'ı saklayın ve sonraki isteklerde `Authorization` header'ında kullanın

**İlgili Linkler:**
- [Google Sign-In for Web](https://developers.google.com/identity/sign-in/web/sign-in)
- [Google Sign-In for Android](https://developers.google.com/identity/sign-in/android/start-integrating)
- [Google Sign-In for iOS](https://developers.google.com/identity/sign-in/ios/start-integrating)

**Önemli Notlar:**
- Bu endpoint, herhangi bir yetkilendirme gerektirmez
- Kullanıcı ilk kez Google ile kayıt olduğunda, `isProfileCompleted: false` dönecektir
- İlk kayıt sonrası kullanıcının profil bilgilerini tamamlaması gerekir

### 2. Yetkilendirme

Yetkili API istekleri için, her istekte `Authorization` header'ında JWT token gönderilmelidir:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Token Yenileme

**Endpoint:** `POST /auth/refresh-token`

**Açıklama:** Bu endpoint, mevcut refresh token ile yeni bir access token ve refresh token alır.

**İstek:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Curl Örneği:**

```bash
curl -X POST https://api.yeleklidunyasi.com/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Başarılı Yanıt (200 OK):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenExpires": 1617567890000,
  "isProfileCompleted": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "kullanici@gmail.com",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "role": { "id": 2, "name": "user" },
    "status": { "id": 1, "name": "active" }
  },
  "clubMemberships": [
    {
      "clubId": "550e8400-e29b-41d4-a716-446655440001",
      "clubName": "Yelekli Motosiklet Kulübü",
      "clubLogo": "http://ornek.com/logo.jpg",
      "clubCity": "İstanbul",
      "rank": "member",
      "rankDescription": "member",
      "permissions": {
        "canCreateEvent": false,
        "canManageMembers": false,
        "canManageCity": false,
        "canSendAnnouncement": false,
        "canAddProduct": false,
        "canManageClub": false,
        "canRemoveMember": false,
        "canManageEvents": false
      },
      "status": "active",
      "events": []
    }
  ]
}
```

**Hata Yanıtları:**

| HTTP Kodu | Hata Kodu | Açıklama |
|-----------|-----------|----------|
| 401 | refreshTokenInvalid | Geçersiz veya süresi dolmuş refresh token |
| 401 | userNotFound | Kullanıcı bulunamadı |

**İstemci Uygulama Adımları:**

1. Access token süresi dolduğunda, refresh token ile yeni token isteği yapın
2. Yanıtta gelen yeni token ve refresh token'ı saklayın
3. İsteklere yeni token ile devam edin

**Önemli Notlar:**
- Refresh token süresi dolduğunda kullanıcı yeniden giriş yapmalıdır
- Güvenlik nedeniyle, refresh token her kullanıldığında yenilenir
- Bu endpoint, herhangi bir yetkilendirme gerektirmez

### 4. Çıkış Yapma

**Endpoint:** `POST /auth/logout`

**Açıklama:** Bu endpoint, kullanıcının oturumunu sonlandırır ve mevcut token'ı geçersiz kılar.

**Yetkilendirme:** Evet, JWT Token gereklidir.

**Curl Örneği:**

```bash
curl -X POST https://api.yeleklidunyasi.com/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Başarılı Yanıt (200 OK):**

```json
{
  "success": true,
  "message": "Başarıyla çıkış yapıldı"
}
```

**Hata Yanıtları:**

| HTTP Kodu | Hata Kodu | Açıklama |
|-----------|-----------|----------|
| 401 | Unauthorized | Yetkilendirme hatası |

**İstemci Uygulama Adımları:**

1. Kullanıcı çıkış yapmak istediğinde bu endpointi çağırın
2. Başarılı yanıt geldiğinde, istemcideki token ve refresh token'ı silin
3. Kullanıcıyı giriş sayfasına yönlendirin

**Önemli Notlar:**
- Bu işlem, sunucu tarafında ilgili oturum ve tokenleri geçersiz kılar
- Güvenlik önlemi olarak, çıkış yapıldıktan sonra aynı token kullanılaraz

## Kullanıcı İşlemleri

### 1. Kullanıcı Profili Görüntüleme

**Endpoint:** `GET /auth/me`

**Açıklama:** Bu endpoint, giriş yapmış kullanıcının profil bilgilerini getirir. Kullanıcının tüm kişisel bilgileri ve kulüp üyelikleri dahil edilir.

**Yetkilendirme:** Evet, JWT Token gereklidir.

**Curl Örneği:**

```bash
curl -X GET https://api.yeleklidunyasi.com/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Başarılı Yanıt (200 OK):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "kullanici@gmail.com",
  "firstName": "Ahmet",
  "lastName": "Yılmaz",
  "nickname": "rider42",
  "phoneNumber": "+905551234567",
  "city": "İstanbul",
  "district": "Kadıköy",
  "motorcycleBrand": "Honda",
  "motorcycleModel": "CBR 250R",
  "motorcycleCc": 250,
  "profilePicture": "http://ornek.com/resim.jpg",
  "bloodType": "A_POSITIVE",
  "clothingSize": "XL",
  "driverLicenseType": "A2",
  "emergencyContactName": "Mehmet Yılmaz",
  "emergencyContactRelation": "Kardeş",
  "emergencyContactPhone": "+905551234568",
  "oneSignalPlayerId": "550e8400-e29b-41d4-a716-446655440010",
  "role": { "id": 2, "name": "user" },
  "status": { "id": 1, "name": "active" },
  "isProfileCompleted": true,
  "clubMemberships": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "clubId": "550e8400-e29b-41d4-a716-446655440002",
      "clubName": "Yelekli Motosiklet Kulübü",
      "clubLogo": "http://ornek.com/logo.jpg",
      "clubCity": "İstanbul",
      "rank": "member",
      "rankDescription": "member",
      "status": "active",
      "joinedAt": "2023-01-15T12:00:00.000Z"
    }
  ],
  "createdAt": "2023-01-01T10:00:00.000Z",
  "updatedAt": "2023-02-01T15:30:00.000Z"
}
```

**Hata Yanıtları:**

| HTTP Kodu | Hata Kodu | Açıklama |
|-----------|-----------|----------|
| 401 | Unauthorized | Yetkilendirme hatası |

**İstemci Kullanım Senaryosu:**
- Uygulama ilk açıldığında kullanıcı bilgilerini yüklemek için kullanılır
- Profil sayfasında güncel kullanıcı bilgilerini göstermek için kullanılır
- Kullanıcı profil bilgilerini güncelledikten sonra güncel bilgileri almak için kullanılır

**Önemli Notlar:**
- Döndürülen `clubMemberships` nesnesi, kullanıcının üye olduğu kulüplerin temel bilgilerini içerir
- Kulüp üyeliğinin detaylı bilgileri ve izinleri için `/auth/google/login` veya `/auth/refresh-token` endpointlerinin yanıtlarını kullanın

### 2. Kullanıcı Profilini Güncelleme

**Endpoint:** `PATCH /auth/me`

**Açıklama:** Bu endpoint, giriş yapmış kullanıcının profil bilgilerini günceller. Sadece değiştirilmek istenen alanlar gönderilmelidir.

**Yetkilendirme:** Evet, JWT Token gereklidir.

**İstek:**

```json
{
  "firstName": "Mehmet",
  "lastName": "Yılmaz",
  "nickname": "rider42",
  "phoneNumber": "+905551234567",
  "city": "İstanbul",
  "district": "Kadıköy",
  "motorcycleBrand": "Honda",
  "motorcycleModel": "CBR 250R",
  "motorcycleCc": 250,
  "bloodType": "A_POSITIVE",
  "clothingSize": "XL",
  "driverLicenseType": "A2",
  "emergencyContactName": "Ahmet Yılmaz",
  "emergencyContactRelation": "Kardeş",
  "emergencyContactPhone": "+905551234568"
}
```

**Curl Örneği:**

```bash
curl -X PATCH https://api.yeleklidunyasi.com/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Mehmet",
    "lastName": "Yılmaz",
    "nickname": "rider42",
    "phoneNumber": "+905551234567",
    "city": "İstanbul",
    "district": "Kadıköy"
  }'
```

**Başarılı Yanıt (200 OK):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "kullanici@gmail.com",
  "firstName": "Mehmet",
  "lastName": "Yılmaz",
  "nickname": "rider42",
  "phoneNumber": "+905551234567",
  "city": "İstanbul",
  "district": "Kadıköy",
  "motorcycleBrand": "Honda",
  "motorcycleModel": "CBR 250R",
  "motorcycleCc": 250,
  "profilePicture": "http://ornek.com/resim.jpg",
  "bloodType": "A_POSITIVE",
  "clothingSize": "XL",
  "driverLicenseType": "A2",
  "emergencyContactName": "Ahmet Yılmaz",
  "emergencyContactRelation": "Kardeş",
  "emergencyContactPhone": "+905551234568",
  "role": { "id": 2, "name": "user" },
  "status": { "id": 1, "name": "active" },
  "isProfileCompleted": true,
  "updatedAt": "2023-02-15T15:30:00.000Z"
}
```

**Hata Yanıtları:**

| HTTP Kodu | Hata Kodu | Açıklama |
|-----------|-----------|----------|
| 401 | Unauthorized | Yetkilendirme hatası |
| 422 | validationError | Doğrulama hatası, bir veya daha fazla alan geçersiz |

**Doğrulama Kuralları:**

| Alan | Kural |
|------|-------|
| firstName | String, 2-50 karakter |
| lastName | String, 2-50 karakter |
| nickname | String, 3-20 karakter, unique |
| phoneNumber | Geçerli telefon numarası formatı (+90XXXXXXXXXX) |
| city | String, 2-50 karakter |
| district | String, 2-50 karakter |
| motorcycleBrand | String, 2-50 karakter |
| motorcycleModel | String, 2-50 karakter |
| motorcycleCc | Number, 0-3000 |
| bloodType | Enum: A_POSITIVE, A_NEGATIVE, B_POSITIVE, B_NEGATIVE, AB_POSITIVE, AB_NEGATIVE, O_POSITIVE, O_NEGATIVE |
| clothingSize | Enum: XS, S, M, L, XL, XXL, XXXL |
| driverLicenseType | Enum: A, A1, A2, B, B1, C, D, E, F, G, M |

**İstemci Kullanım Senaryosu:**
- Kullanıcı profil bilgilerini güncellerken kullanılır
- Profil tamamlama işleminde eksik alanları doldurmak için kullanılır

**Önemli Notlar:**
- Tüm alanları birden güncellemek zorunlu değildir, sadece değiştirilmek istenen alanlar gönderilebilir
- Email değişikliği bu endpoint ile yapılamaz, email değişikliği özel bir süreç gerektirir

### 3. Şifre Değiştirme

**Endpoint:** `PATCH /auth/password`

**Açıklama:** Bu endpoint, kullanıcının mevcut şifresini değiştirmesini sağlar. Kullanıcının önce mevcut şifresini doğrulaması gerekir.

**Yetkilendirme:** Evet, JWT Token gereklidir.

**İstek:**

```json
{
  "oldPassword": "guvenli_sifre123",
  "newPassword": "yeni_guvenli_sifre456"
}
```

**Curl Örneği:**

```bash
curl -X PATCH https://api.yeleklidunyasi.com/auth/password \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "guvenli_sifre123",
    "newPassword": "yeni_guvenli_sifre456"
  }'
```

**Başarılı Yanıt (200 OK):**

```json
{
  "success": true,
  "message": "Şifre başarıyla güncellendi"
}
```

**Hata Yanıtları:**

| HTTP Kodu | Hata Kodu | Açıklama |
|-----------|-----------|----------|
| 401 | Unauthorized | Yetkilendirme hatası |
| 400 | wrongPassword | Mevcut şifre hatalı |
| 422 | validationError | Yeni şifre geçerli değil (örn. çok kısa) |

**Doğrulama Kuralları:**

| Alan | Kural |
|------|-------|
| oldPassword | Kullanıcının mevcut şifresi |
| newPassword | En az 8 karakter, en az bir büyük harf, bir küçük harf ve bir rakam içermeli |

**İstemci Kullanım Senaryosu:**
- Kullanıcı profil ayarlarından şifresini değiştirmek istediğinde kullanılır
- Güvenlik nedeniyle şifre güncellenmesi gerektiğinde kullanılır

**Önemli Notlar:**
- Uygulamada Google ile giriş kullanıldığı için bu endpoint, sadece email/şifre ile kayıt olan kullanıcılar için geçerlidir
- Şifre değişikliğinden sonra kullanıcının mevcut oturumu geçerli kalmaya devam eder
- Şifre başarıyla değiştirildikten sonra, kullanıcının diğer cihazlardaki oturumları sonlandırılmaz

### 4. Profil Fotoğrafı Güncelleme

**Endpoint:** `POST /auth/me/profile-picture`

**Açıklama:** Bu endpoint, kullanıcının profil fotoğrafını günceller. Multipart/form-data formatında dosya gönderilmelidir.

**Yetkilendirme:** Evet, JWT Token gereklidir.

**İstek:**
- Content-Type: multipart/form-data
- Form veri alanı: profilePicture (dosya)

**Curl Örneği:**

```bash
curl -X POST https://api.yeleklidunyasi.com/auth/me/profile-picture \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -F "profilePicture=@/path/to/image.jpg"
```

**Başarılı Yanıt (200 OK):**

```json
{
  "profilePicture": "https://storage.yeleklidunyasi.com/profiles/550e8400-e29b-41d4-a716-446655440000.jpg",
  "message": "Profil fotoğrafı başarıyla güncellendi"
}
```

**Hata Yanıtları:**

| HTTP Kodu | Hata Kodu | Açıklama |
|-----------|-----------|----------|
| 401 | Unauthorized | Yetkilendirme hatası |
| 400 | invalidFileType | Geçersiz dosya tipi |
| 400 | fileTooLarge | Dosya boyutu çok büyük |

**Dosya Kısıtlamaları:**
- İzin verilen dosya tipleri: jpeg, jpg, png
- Maksimum dosya boyutu: 5MB
- Minimum boyut: 200x200 piksel
- Maksimum boyut: 2000x2000 piksel

**İstemci Kullanım Senaryosu:**
- Kullanıcı profil sayfasında fotoğraf güncellerken kullanılır
- Profil tamamlama aşamasında fotoğraf yüklerken kullanılır

**Önemli Notlar:**
- Yüklenen fotoğraf otomatik olarak optimize edilir ve yeniden boyutlandırılır
- Eski profil fotoğrafı sistemden silinir
- Yanıtta dönen URL, profil fotoğrafının tam URL'idir ve doğrudan kullanılabilir

### 5. Kullanıcı Bildirim Ayarlarını Güncelleme

**Endpoint:** `PATCH /auth/me/notification-settings`

**Açıklama:** Bu endpoint, kullanıcının bildirim tercihlerini günceller. Hangi tür bildirimleri almak istediğini belirtebilir.

**Yetkilendirme:** Evet, JWT Token gereklidir.

**İstek:**

```json
{
  "pushNotifications": true,
  "emailNotifications": false,
  "smsNotifications": false,
  "notifyForNewEvents": true,
  "notifyForEventUpdates": true,
  "notifyForNewMessages": true,
  "notifyForClubInvitations": true,
  "notifyForNewProducts": false,
  "notifyForOrderUpdates": true
}
```

**Curl Örneği:**

```bash
curl -X PATCH https://api.yeleklidunyasi.com/auth/me/notification-settings \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "pushNotifications": true,
    "emailNotifications": false,
    "smsNotifications": false,
    "notifyForNewEvents": true,
    "notifyForEventUpdates": true,
    "notifyForNewMessages": true,
    "notifyForClubInvitations": true,
    "notifyForNewProducts": false,
    "notifyForOrderUpdates": true
  }'
```

**Başarılı Yanıt (200 OK):**

```json
{
  "pushNotifications": true,
  "emailNotifications": false,
  "smsNotifications": false,
  "notifyForNewEvents": true,
  "notifyForEventUpdates": true,
  "notifyForNewMessages": true,
  "notifyForClubInvitations": true,
  "notifyForNewProducts": false,
  "notifyForOrderUpdates": true,
  "updatedAt": "2023-02-15T15:30:00.000Z"
}
```

**Hata Yanıtları:**

| HTTP Kodu | Hata Kodu | Açıklama |
|-----------|-----------|----------|
| 401 | Unauthorized | Yetkilendirme hatası |
| 422 | validationError | Doğrulama hatası, bir veya daha fazla alan geçersiz |

**İstemci Kullanım Senaryosu:**
- Kullanıcı ayarlar sayfasında bildirim tercihlerini değiştirirken kullanılır
- Uygulama ilk kurulumunda varsayılan bildirim tercihlerini ayarlamak için kullanılır

**Önemli Notlar:**
- Tüm alanları birden güncellemek zorunlu değildir, sadece değiştirilmek istenen alanlar gönderilebilir
- `pushNotifications` değeri `false` olduğunda, diğer tüm bildirim türleri de devre dışı bırakılacaktır

### 6. OneSignal Player ID Güncelleme

**Endpoint:** `PUT /auth/me/onesignal-id`

**Açıklama:** Bu endpoint, kullanıcının push bildirimleri için OneSignal Player ID'sini günceller. Bu ID, mobil cihazlara bildirim göndermek için kullanılır.

**Yetkilendirme:** Evet, JWT Token gereklidir.

**İstek:**

```json
{
  "oneSignalPlayerId": "550e8400-e29b-41d4-a716-446655440010"
}
```

**Curl Örneği:**

```bash
curl -X PUT https://api.yeleklidunyasi.com/auth/me/onesignal-id \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "oneSignalPlayerId": "550e8400-e29b-41d4-a716-446655440010"
  }'
```

**Başarılı Yanıt (200 OK):**

```json
{
  "success": true,
  "message": "OneSignal Player ID başarıyla güncellendi"
}
```

**Hata Yanıtları:**

| HTTP Kodu | Hata Kodu | Açıklama |
|-----------|-----------|----------|
| 401 | Unauthorized | Yetkilendirme hatası |
| 422 | invalidPlayerId | Geçersiz OneSignal Player ID formatı |

**İstemci Kullanım Senaryosu:**
- Uygulama ilk açıldığında OneSignal'dan alınan Player ID'yi kaydetmek için kullanılır
- Kullanıcı cihaz değiştirdiğinde yeni Player ID'yi güncellemek için kullanılır

**Önemli Notlar:**
- OneSignal Player ID, her cihaz için benzersizdir ve push bildirimleri için gereklidir
- Kullanıcının birden fazla cihazı olabilir, sistem her kullanıcı için birden fazla Player ID destekler

### 7. Kullanıcı Arama

**Endpoint:** `GET /users/search`

**Açıklama:** Bu endpoint, sistemdeki kullanıcıları aramak için kullanılır. İsim, soyisim veya kullanıcı adına göre arama yapılabilir.

**Yetkilendirme:** Evet, JWT Token gereklidir.

**Sorgu Parametreleri:**
- `query`: Arama sorgusu (isim, soyisim veya nickname)
- `page`: Sayfa numarası (varsayılan: 1)
- `limit`: Sayfa başına sonuç sayısı (varsayılan: 10, maksimum: 50)

**Curl Örneği:**

```bash
curl -X GET "https://api.yeleklidunyasi.com/users/search?query=ahmet&page=1&limit=10" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Başarılı Yanıt (200 OK):**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "firstName": "Ahmet",
      "lastName": "Yılmaz",
      "nickname": "rider42",
      "profilePicture": "http://ornek.com/resim.jpg",
      "city": "İstanbul",
      "district": "Kadıköy",
      "motorcycleBrand": "Honda",
      "motorcycleModel": "CBR 250R"
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "firstName": "Mehmet",
      "lastName": "Ahmet",
      "nickname": "speedrider",
      "profilePicture": "http://ornek.com/resim2.jpg",
      "city": "Ankara",
      "district": "Çankaya",
      "motorcycleBrand": "Yamaha",
      "motorcycleModel": "MT-07"
    }
  ],
  "meta": {
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 10,
      "totalPages": 3
    }
  }
}
```

**Hata Yanıtları:**

| HTTP Kodu | Hata Kodu | Açıklama |
|-----------|-----------|----------|
| 401 | Unauthorized | Yetkilendirme hatası |
| 400 | invalidQuery | Arama sorgusu çok kısa (minimum 2 karakter) |

**İstemci Kullanım Senaryosu:**
- Kulübe üye eklemek için kullanıcı ararken kullanılır
- Arkadaş listesine eklemek için kullanıcı ararken kullanılır
- Sohbet başlatmak için kullanıcı ararken kullanılır

**Önemli Notlar:**
- Arama sorgusu minimum 2 karakter olmalıdır
- Sonuçlar, isim ve soyisim eşleşmelerine göre sıralanır
- Kullanıcıların gizlilik ayarlarına göre bazı kullanıcılar arama sonuçlarında görünmeyebilir

## Profil Tamamlama

### 1. Profil Tamamlama Durumu Kontrol Etme

**Endpoint:** `GET /profile-completion/status`

**Açıklama:** Bu endpoint, kullanıcının profil tamamlama durumunu kontrol eder ve eksik alanları listeler.

**Yetkilendirme:** Evet, JWT Token gereklidir.

**Curl Örneği:**

```bash
curl -X GET https://api.yeleklidunyasi.com/profile-completion/status \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Başarılı Yanıt (200 OK):**

```json
{
  "isProfileCompleted": false,
  "userId": "550e8400-e29b-41d4-a716-446655440000",
  "missingFields": [
    "nickname",
    "phoneNumber",
    "city",
    "district",
    "motorcycleBrand",
    "motorcycleModel"
  ],
  "progress": 40
}
```

**Hata Yanıtları:**

| HTTP Kodu | Hata Kodu | Açıklama |
|-----------|-----------|----------|
| 401 | Unauthorized | Yetkilendirme hatası |

**İstemci Kullanım Senaryosu:**
- Uygulama ilk açıldığında kullanıcının profil tamamlama durumunu kontrol etmek için kullanılır
- Tamamlanmayan profil için kullanıcıya hatırlatma yapmak için kullanılır
- Profil tamamlama ekranında ilerleme durumunu göstermek için kullanılır

**Önemli Notlar:**
- `progress` alanı, profil tamamlama yüzdesini belirtir (0-100 arası)
- `missingFields` alanı, tamamlanması gereken zorunlu alanları listeler

### 2. Profil Tamamlama

**Endpoint:** `PATCH /profile-completion/complete`

**Açıklama:** Bu endpoint, kullanıcının ilk kayıt sonrası profil bilgilerini tamamlamasını sağlar. Bu işlem, uygulamayı kullanabilmek için gereklidir.

**Yetkilendirme:** Evet, JWT Token gereklidir.

**İstek:**

```json
{
  "nickname": "motosikletci",
  "phoneNumber": "+905551234567",
  "city": "İstanbul",
  "district": "Kadıköy",
  "motorcycleBrand": "Honda",
  "motorcycleModel": "CBR 250R",
  "motorcycleCc": 250,
  "bloodType": "A_POSITIVE",
  "clothingSize": "XL",
  "driverLicenseType": "A2",
  "emergencyContactName": "Mehmet Yılmaz",
  "emergencyContactRelation": "Kardeş",
  "emergencyContactPhone": "+905551234568"
}
```

**Curl Örneği:**

```bash
curl -X PATCH https://api.yeleklidunyasi.com/profile-completion/complete \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "nickname": "motosikletci",
    "phoneNumber": "+905551234567",
    "city": "İstanbul",
    "district": "Kadıköy",
    "motorcycleBrand": "Honda",
    "motorcycleModel": "CBR 250R",
    "motorcycleCc": 250,
    "bloodType": "A_POSITIVE",
    "clothingSize": "XL",
    "driverLicenseType": "A2",
    "emergencyContactName": "Mehmet Yılmaz",
    "emergencyContactRelation": "Kardeş",
    "emergencyContactPhone": "+905551234568"
  }'
```

**Başarılı Yanıt (200 OK):**

```json
{
  "success": true,
  "message": "Profil başarıyla tamamlandı",
  "isProfileCompleted": true,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "kullanici@gmail.com",
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "nickname": "motosikletci",
    "phoneNumber": "+905551234567",
    "city": "İstanbul",
    "district": "Kadıköy",
    "motorcycleBrand": "Honda",
    "motorcycleModel": "CBR 250R",
    "motorcycleCc": 250,
    "bloodType": "A_POSITIVE",
    "clothingSize": "XL",
    "driverLicenseType": "A2",
    "emergencyContactName": "Mehmet Yılmaz",
    "emergencyContactRelation": "Kardeş",
    "emergencyContactPhone": "+905551234568",
    "role": { "id": 2, "name": "user" },
    "status": { "id": 1, "name": "active" }
  }
}
```

**Hata Yanıtları:**

| HTTP Kodu | Hata Kodu | Açıklama |
|-----------|-----------|----------|
| 401 | Unauthorized | Yetkilendirme hatası |
| 422 | validationError | Doğrulama hatası, bir veya daha fazla alan geçersiz |

**İstemci Kullanım Senaryosu:**
- Kullanıcı ilk kayıt sonrası zorunlu profil bilgilerini tamamlarken kullanılır
- Profil tamamlama ekranında tek seferde tüm bilgileri göndermek için kullanılır

**Önemli Notlar:**
- Bu endpoint, `/auth/me` endpointinden farklıdır ve sadece profil tamamlama işlemi için kullanılır
- Tüm zorunlu alanların doldurulması gereklidir, aksi halde doğrulama hatası alınır
- Profil tamamlandıktan sonra, kullanıcı uygulamanın tüm özelliklerine erişebilir

### 3. Profil Tamamlama Alanlarını Kontrol Etme

**Endpoint:** `GET /profile-completion/fields`

**Açıklama:** Bu endpoint, profil tamamlama için gerekli alanları ve bunların özelliklerini döndürür.

**Yetkilendirme:** Evet, JWT Token gereklidir.

**Curl Örneği:**

```bash
curl -X GET https://api.yeleklidunyasi.com/profile-completion/fields \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Başarılı Yanıt (200 OK):**

```json
{
  "requiredFields": [
    {
      "name": "nickname",
      "type": "string",
      "minLength": 3,
      "maxLength": 20,
      "required": true,
      "description": "Kullanıcı adı veya takma ad"
    },
    {
      "name": "phoneNumber",
      "type": "string",
      "pattern": "^\\+90[0-9]{10}$",
      "required": true,
      "description": "Telefon numarası (başında +90 ile)"
    },
    {
      "name": "city",
      "type": "string",
      "required": true,
      "description": "Şehir"
    },
    {
      "name": "district",
      "type": "string",
      "required": true,
      "description": "İlçe"
    },
    {
      "name": "motorcycleBrand",
      "type": "string",
      "required": true,
      "description": "Motosiklet markası"
    },
    {
      "name": "motorcycleModel",
      "type": "string",
      "required": true,
      "description": "Motosiklet modeli"
    }
  ],
  "optionalFields": [
    {
      "name": "motorcycleCc",
      "type": "number",
      "min": 0,
      "max": 3000,
      "required": false,
      "description": "Motosiklet motor hacmi (cc)"
    },
    {
      "name": "bloodType",
      "type": "enum",
      "enum": ["A_POSITIVE", "A_NEGATIVE", "B_POSITIVE", "B_NEGATIVE", "AB_POSITIVE", "AB_NEGATIVE", "O_POSITIVE", "O_NEGATIVE"],
      "required": false,
      "description": "Kan grubu"
    },
    {
      "name": "clothingSize",
      "type": "enum",
      "enum": ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
      "required": false,
      "description": "Kıyafet bedeni"
    },
    {
      "name": "driverLicenseType",
      "type": "enum",
      "enum": ["A", "A1", "A2", "B", "B1", "C", "D", "E", "F", "G", "M"],
      "required": false,
      "description": "Sürücü belgesi tipi"
    },
    {
      "name": "emergencyContactName",
      "type": "string",
      "required": false,
      "description": "Acil durum kişi adı"
    },
    {
      "name": "emergencyContactRelation",
      "type": "string",
      "required": false,
      "description": "Acil durum kişi yakınlık derecesi"
    },
    {
      "name": "emergencyContactPhone",
      "type": "string",
      "pattern": "^\\+90[0-9]{10}$",
      "required": false,
      "description": "Acil durum kişi telefon numarası"
    }
  ]
}
```

**Hata Yanıtları:**

| HTTP Kodu | Hata Kodu | Açıklama |
|-----------|-----------|----------|
| 401 | Unauthorized | Yetkilendirme hatası |

**İstemci Kullanım Senaryosu:**
- Profil tamamlama ekranını dinamik olarak oluşturmak için kullanılır
- Her alanın doğrulama kurallarını istemci tarafında uygulamak için kullanılır

**Önemli Notlar:**
- `requiredFields` alanı, profil tamamlamak için zorunlu olan alanları içerir
- `optionalFields` alanı, isteğe bağlı olarak doldurulabilecek alanları içerir
- Her alan için tip bilgisi, doğrulama kuralları ve açıklama bilgisi sağlanır

## Kulüp İşlemleri

### 1. Kulüp Oluşturma

**Endpoint:** `POST /clubs`

**İstek:**

```json
{
  "name": "Yelekli Motosiklet Kulübü",
  "description": "Motosiklet tutkunlarının buluşma noktası",
  "type": "public",
  "logo": "http://ornek.com/logo.jpg"
}
```

**Curl Örneği:**

```bash
curl -X POST https://api.yeleklidunyasi.com/clubs \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Yelekli Motosiklet Kulübü",
    "description": "Motosiklet tutkunlarının buluşma noktası",
    "type": "public",
    "logo": "http://ornek.com/logo.jpg"
  }'
```

### 2. Kulüp Listesini Görüntüleme

**Endpoint:** `GET /clubs`

**Curl Örneği:**

```bash
curl -X GET https://api.yeleklidunyasi.com/clubs \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Kulüp Detayı Görüntüleme

**Endpoint:** `GET /clubs/{clubId}`

**Curl Örneği:**

```bash
curl -X GET https://api.yeleklidunyasi.com/clubs/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Kulübe Üye Ekleme

**Endpoint:** `POST /clubs/{clubId}/members`

**İstek:**

```json
{
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "rank": "hangaround"
}
```

**Curl Örneği:**

```bash
curl -X POST https://api.yeleklidunyasi.com/clubs/550e8400-e29b-41d4-a716-446655440000/members \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "550e8400-e29b-41d4-a716-446655440001",
    "rank": "hangaround"
  }'
```

### 5. Kulüp Şehri Ekleme

**Endpoint:** `POST /clubs/{clubId}/cities`

**İstek:**

```json
{
  "cityId": "550e8400-e29b-41d4-a716-446655440002"
}
```

**Curl Örneği:**

```bash
curl -X POST https://api.yeleklidunyasi.com/clubs/550e8400-e29b-41d4-a716-446655440000/cities \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "cityId": "550e8400-e29b-41d4-a716-446655440002"
  }'
```

## Etkinlik İşlemleri

### 1. Etkinlik Oluşturma

**Endpoint:** `POST /events`

**İstek:**

```json
{
  "title": "Hafta Sonu Turu",
  "description": "İstanbul'dan Şile'ye gidiş-dönüş motosiklet turu",
  "startDate": "2023-08-15T09:00:00.000Z",
  "endDate": "2023-08-15T18:00:00.000Z",
  "meetingPoint": "Kadıköy Sahil",
  "route": "Kadıköy - Üsküdar - Beykoz - Şile",
  "clubId": "550e8400-e29b-41d4-a716-446655440000",
  "clubCityId": "550e8400-e29b-41d4-a716-446655440003",
  "isPrivate": false,
  "maxParticipants": 30,
  "status": "active"
}
```

**Curl Örneği:**

```bash
curl -X POST https://api.yeleklidunyasi.com/events \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Hafta Sonu Turu",
    "description": "İstanbul'\''dan Şile'\''ye gidiş-dönüş motosiklet turu",
    "startDate": "2023-08-15T09:00:00.000Z",
    "endDate": "2023-08-15T18:00:00.000Z",
    "meetingPoint": "Kadıköy Sahil",
    "route": "Kadıköy - Üsküdar - Beykoz - Şile",
    "clubId": "550e8400-e29b-41d4-a716-446655440000",
    "clubCityId": "550e8400-e29b-41d4-a716-446655440003",
    "isPrivate": false,
    "maxParticipants": 30,
    "status": "active"
  }'
```

### 2. Etkinlik Listesini Görüntüleme

**Endpoint:** `GET /events`

**Curl Örneği:**

```bash
curl -X GET https://api.yeleklidunyasi.com/events \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Etkinlik Detayı Görüntüleme

**Endpoint:** `GET /events/{eventId}`

**Curl Örneği:**

```bash
curl -X GET https://api.yeleklidunyasi.com/events/550e8400-e29b-41d4-a716-446655440004 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Etkinliğe Katılma

**Endpoint:** `POST /events/{eventId}/participants`

**Curl Örneği:**

```bash
curl -X POST https://api.yeleklidunyasi.com/events/550e8400-e29b-41d4-a716-446655440004/participants \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Bildirim İşlemleri

### 1. Bildirim Gönderme

**Endpoint:** `POST /notifications/send`

**İstek:**

```json
{
  "title": "Yeni Etkinlik",
  "body": "Hafta sonu turuna davetlisiniz",
  "type": "PUSH",
  "recipients": [
    {
      "userId": "550e8400-e29b-41d4-a716-446655440001"
    }
  ],
  "data": {
    "eventId": "550e8400-e29b-41d4-a716-446655440004"
  }
}
```

**Curl Örneği:**

```bash
curl -X POST https://api.yeleklidunyasi.com/notifications/send \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Yeni Etkinlik",
    "body": "Hafta sonu turuna davetlisiniz",
    "type": "PUSH",
    "recipients": [
      {
        "userId": "550e8400-e29b-41d4-a716-446655440001"
      }
    ],
    "data": {
      "eventId": "550e8400-e29b-41d4-a716-446655440004"
    }
  }'
```

### 2. Bildirimleri Görüntüleme

**Endpoint:** `GET /notifications`

**Curl Örneği:**

```bash
curl -X GET https://api.yeleklidunyasi.com/notifications \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Pazaryeri İşlemleri

### 1. Ürün Ekleme

**Endpoint:** `POST /marketplace/products`

**İstek:**

```json
{
  "name": "Motosiklet Yeleği",
  "description": "Kaliteli malzemeden üretilmiş kulüp yeleği",
  "price": 350.0,
  "stock": 10,
  "categoryId": "550e8400-e29b-41d4-a716-446655440005",
  "clubId": "550e8400-e29b-41d4-a716-446655440000",
  "images": [
    "http://ornek.com/yelek1.jpg",
    "http://ornek.com/yelek2.jpg"
  ],
  "status": "active",
  "isActive": true
}
```

**Curl Örneği:**

```bash
curl -X POST https://api.yeleklidunyasi.com/marketplace/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Motosiklet Yeleği",
    "description": "Kaliteli malzemeden üretilmiş kulüp yeleği",
    "price": 350.0,
    "stock": 10,
    "categoryId": "550e8400-e29b-41d4-a716-446655440005",
    "clubId": "550e8400-e29b-41d4-a716-446655440000",
    "images": [
      "http://ornek.com/yelek1.jpg",
      "http://ornek.com/yelek2.jpg"
    ],
    "status": "active",
    "isActive": true
  }'
```

### 2. Ürünleri Görüntüleme

**Endpoint:** `GET /marketplace/products`

**Curl Örneği:**

```bash
curl -X GET https://api.yeleklidunyasi.com/marketplace/products \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Ürün Detayı Görüntüleme

**Endpoint:** `GET /marketplace/products/{productId}`

**Curl Örneği:**

```bash
curl -X GET https://api.yeleklidunyasi.com/marketplace/products/550e8400-e29b-41d4-a716-446655440006 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Sipariş Oluşturma

**Endpoint:** `POST /marketplace/orders`

**İstek:**

```json
{
  "items": [
    {
      "productId": "550e8400-e29b-41d4-a716-446655440006",
      "quantity": 1,
      "price": 350.0
    }
  ],
  "shippingAddress": {
    "address": "Örnek Mahallesi, Örnek Sokak No:1",
    "city": "İstanbul",
    "district": "Kadıköy",
    "postalCode": "34000",
    "phone": "+905551234567"
  },
  "paymentMethod": "credit_card",
  "paymentDetails": {
    "cardNumber": "4111111111111111",
    "expiryMonth": "12",
    "expiryYear": "2025",
    "cvv": "123"
  }
}
```

**Curl Örneği:**

```bash
curl -X POST https://api.yeleklidunyasi.com/marketplace/orders \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "productId": "550e8400-e29b-41d4-a716-446655440006",
        "quantity": 1,
        "price": 350.0
      }
    ],
    "shippingAddress": {
      "address": "Örnek Mahallesi, Örnek Sokak No:1",
      "city": "İstanbul",
      "district": "Kadıköy",
      "postalCode": "34000",
      "phone": "+905551234567"
    },
    "paymentMethod": "credit_card",
    "paymentDetails": {
      "cardNumber": "4111111111111111",
      "expiryMonth": "12",
      "expiryYear": "2025",
      "cvv": "123"
    }
  }'
```

### 5. Siparişleri Görüntüleme

**Endpoint:** `GET /marketplace/orders`

**Curl Örneği:**

```bash
curl -X GET https://api.yeleklidunyasi.com/marketplace/orders \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 6. Sipariş Detayı Görüntüleme

**Endpoint:** `GET /marketplace/orders/{orderId}`

**Curl Örneği:**

```bash
curl -X GET https://api.yeleklidunyasi.com/marketplace/orders/550e8400-e29b-41d4-a716-446655440007 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Kullanıcı Rolleri ve İzinleri

Yelekli Dünyası API'sinde farklı rol ve yetkilere sahip kullanıcılar vardır:

### Sistem Rolleri
- **Admin (1)**: Tüm sisteme erişim yetkisi
- **User (2)**: Standart kullanıcı erişimi
- **Guest (3)**: Kısıtlı erişim

### Kulüp Rolleri

1. **Genel Başkan (general_president)**
   - Tüm kulüp yönetimi yetkilerine sahiptir
   - Etkinlik oluşturabilir, üye yönetimi yapabilir, şehir yönetimi yapabilir, duyuru gönderebilir, ürün ekleyebilir

2. **Genel Koç (general_coach)**
   - Etkinlik oluşturabilir, üye yönetimi yapabilir, duyuru gönderebilir, ürün ekleyebilir

3. **Genel Yol Kaptanı (general_road_captain)**
   - Etkinlik oluşturabilir, duyuru gönderebilir, etkinlik yönetebilir

4. **Şehir Başkanı (city_president)**
   - Kendi şehriyle ilgili etkinlik oluşturabilir, üye yönetimi yapabilir, şehir yönetimi yapabilir, duyuru gönderebilir

5. **Üye (member)**
   - Kulüp etkinliklerine katılabilir

Kullanıcı rollerinin izinleri hakkında daha detaylı bilgi için `ClubRoleSetting` veritabanı tablosunda tanımlanan hakları görebilirsiniz.

---

Bu dokümantasyon, Yelekli Dünyası API'sinin temel kullanımını anlatmaktadır. Daha detaylı bilgi veya yardım için teknik ekibimizle iletişime geçebilirsiniz. 