# 📱 Mobile Application: Flutter (Offline-First + SQLite Sync)

## 📌 Kya Banaya Gaya Hai (Overview)
North Eastern Region ke remote pahadi ilaqon mein internet connection aksar baarish ya disaster ke dauran cut ho jata hai. Isliye yeh mobile app **Offline-First** design pattern par banayi gayi hai:
1. **Local SQLite Cache (`sqflite`)**: Saare downloaded hazard zones, evacuation safe-points, aur emergency contacts phone ke local SQLite database mein store hote hain.
2. **Background Sync Engine**: Jaise hi phone ko cellular ya Wi-Fi network milta hai, app automatically naye alerts download karti hai aur citizen crowdsourced incident reports upload karti hai.
3. **Offline Hazard Map View (`flutter_map`)**: Pre-cached raster/vector tiles ke sath bina internet ke bhi map aur evacuation directions dikhata hai.
4. **Emergency SOS & SMS Fallback**: Agar internet band ho, toh app direct SMS siren trigger karti hai local disaster cell aur emergency services ko.

---

## 🚀 Kaise Chalayein (Local Flutter Run)

### Prerequisites
- Flutter SDK (v3.16+)
- Android Studio / Xcode ya Android Emulator / Real Device

### Run Steps
```bash
cd mobile

# Dependencies download karein
flutter pub get

# Connected devices check karein
flutter devices

# App run karein (Emulator ya phone par)
flutter run
```

---

## 📂 Key Architecture Modules
- `lib/core/database/local_db.dart` - Local SQLite database schema & sync helper.
- `lib/features/alerts/screens/alert_list_screen.dart` - Offline-cached alert list with severity colors.
- `lib/features/map/screens/offline_map_screen.dart` - Interactive offline map showing safe shelters & high-risk zones.

---

## 🛰️ Real Data Source Integration Plan (Baad Mein Connect Karne Ke Liye)

| Feature | Real Source | Integration Route |
| :--- | :--- | :--- |
| **Real-time Push Alerts** | Firebase Cloud Messaging (FCM) | Register device token with `/api/v1/alerts/register-token`. |
| **Crowdsourced Landslide Photo Reports** | Citizen Camera & GPS | Multipart POST to Backend with EXIF timestamp & coordinate tags. |
| **Offline Basemap MBTiles** | OpenStreetMap / Bhuvan MBTiles package | Download 50MB regional bundle during first onboarding setup. |
| **Emergency Fallback SMS** | Android Telephony / CDAC Cell Broadcast | Auto-dispatch encrypted SMS strings when GSM cell is active but IP data is down. |
