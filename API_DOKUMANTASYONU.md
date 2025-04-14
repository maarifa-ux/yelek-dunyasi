# Yelekli Dünyası API Dokümantasyonu

Bu dokümantasyon, Yelekli Dünyası uygulamasının API'sini kullanmak isteyen frontend geliştiricileri için hazırlanmıştır. API'nin tüm özellikleri, istekler ve yanıtlar hakkında detaylı bilgiler içermektedir.

## İçindekiler

1. [Giriş](#giriş)
2. [Kimlik Doğrulama](#kimlik-doğrulama)
3. [Kullanıcı İşlemleri](#kullanıcı-işlemleri)
4. [Profil Tamamlama](#profil-tamamlama)
5. [Kulüp İşlemleri](#kulüp-işlemleri)
6. [Etkinlik İşlemleri](#etkinlik-işlemleri)
7. [Bildirim İşlemleri](#bildirim-işlemleri)
8. [Pazaryeri İşlemleri](#pazaryeri-işlemleri)

## Giriş

API'nin temel URL'i: `https://api.yeleklidunyasi.com` veya geliştirme ortamında `http://localhost:3000/api`.

Her istekte `Content-Type: application/json` header'ı kullanılmalıdır.

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

**Yanıt:**

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
    "role": { "id": 2, "name": "user" },
    "status": { "id": 1, "name": "active" }
  },
  "isProfileCompleted": false,
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

> **Not:** Google ile giriş için, öncelikle istemci tarafında Google Authentication API'si kullanılarak bir idToken alınmalıdır. Bu token daha sonra bu endpoint'e gönderilir.

### 2. Yetkilendirme

Yetkili API istekleri için, her istekte `Authorization` header'ında JWT token gönderilmelidir:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Token Yenileme

**Endpoint:** `POST /auth/refresh-token`

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

**Yanıt:**

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

## Kullanıcı İşlemleri

### 1. Kullanıcı Profili Görüntüleme

**Endpoint:** `GET /auth/me`

**Curl Örneği:**

```bash
curl -X GET https://api.yeleklidunyasi.com/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 2. Kullanıcı Profilini Güncelleme

**Endpoint:** `PATCH /auth/me`

**İstek:**

```json
{
  "firstName": "Mehmet",
  "lastName": "Yılmaz",
  "nickname": "rider42",
  "phoneNumber": "+905551234567"
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
    "phoneNumber": "+905551234567"
  }'
```

### 3. Şifre Değiştirme

**Endpoint:** `PATCH /auth/me`

**İstek:**

```json
{
  "oldPassword": "guvenli_sifre123",
  "password": "yeni_guvenli_sifre456"
}
```

**Curl Örneği:**

```bash
curl -X PATCH https://api.yeleklidunyasi.com/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Content-Type: application/json" \
  -d '{
    "oldPassword": "guvenli_sifre123",
    "password": "yeni_guvenli_sifre456"
  }'
```

## Profil Tamamlama

### 1. Profil Tamamlama Durumu Kontrol Etme

**Endpoint:** `GET /profile-completion/status`

**Curl Örneği:**

```bash
curl -X GET https://api.yeleklidunyasi.com/profile-completion/status \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Yanıt:**

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
  ]
}
```

### 2. Profil Tamamlama

**Endpoint:** `PATCH /profile-completion/complete`

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
  "profilePicture": "http://ornek.com/resim.jpg",
  "bloodType": "A_POSITIVE",
  "clothingSize": "XL",
  "driverLicenseType": "A2"
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
    "profilePicture": "http://ornek.com/resim.jpg",
    "bloodType": "A_POSITIVE",
    "clothingSize": "XL",
    "driverLicenseType": "A2"
  }'
```

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