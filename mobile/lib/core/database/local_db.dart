import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';

class LocalDatabaseService {
  static final LocalDatabaseService instance = LocalDatabaseService._init();
  static Database? _database;

  LocalDatabaseService._init();

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDB('ner_landslide_cache_v2.db');
    return _database!;
  }

  Future<Database> _initDB(String filePath) async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, filePath);

    return await openDatabase(
      path,
      version: 2,
      onCreate: _createDB,
      onUpgrade: _onUpgrade,
    );
  }

  Future _createDB(Database db, int version) async {
    // 1. Cached Emergency Alerts
    await db.execute('''
      CREATE TABLE cached_alerts (
        id INTEGER PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        risk_level TEXT NOT NULL,
        district TEXT NOT NULL,
        evacuation_route TEXT,
        created_at TEXT NOT NULL
      )
    ''');

    // 2. Offline Safe Shelters & Evacuation Centers
    await db.execute('''
      CREATE TABLE safe_shelters (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        district TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        capacity INTEGER,
        contact_number TEXT
      )
    ''');

    // 3. Offline Citizen Incident Report Queue
    await db.execute('''
      CREATE TABLE offline_report_queue (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        hazard_type TEXT NOT NULL,
        severity TEXT NOT NULL,
        description TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        photo_path TEXT,
        is_synced INTEGER DEFAULT 0,
        created_at TEXT NOT NULL
      )
    ''');

    // Seed offline emergency safe-zones across NER
    await db.insert('safe_shelters', {
      'name': 'Shillong Polo Ground Relief Camp',
      'district': 'East Khasi Hills',
      'latitude': 25.586,
      'longitude': 91.890,
      'capacity': 1200,
      'contact_number': '+91-364-2222111'
    });

    await db.insert('safe_shelters', {
      'name': 'Gangtok Paljor Stadium Safe Center',
      'district': 'East Sikkim',
      'latitude': 27.332,
      'longitude': 88.614,
      'capacity': 800,
      'contact_number': '+91-3592-202222'
    });
  }

  Future _onUpgrade(Database db, int oldVersion, int newVersion) async {
    if (oldVersion < 2) {
      await db.execute('''
        CREATE TABLE IF NOT EXISTS offline_report_queue (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          hazard_type TEXT NOT NULL,
          severity TEXT NOT NULL,
          description TEXT NOT NULL,
          latitude REAL NOT NULL,
          longitude REAL NOT NULL,
          photo_path TEXT,
          is_synced INTEGER DEFAULT 0,
          created_at TEXT NOT NULL
        )
      ''');
    }
  }

  // Queue an offline citizen report
  Future<int> queueOfflineReport(Map<String, dynamic> report) async {
    final db = await instance.database;
    return await db.insert('offline_report_queue', report);
  }

  // Get all unsynced reports
  Future<List<Map<String, dynamic>>> getUnsyncedReports() async {
    final db = await instance.database;
    return await db.query('offline_report_queue', where: 'is_synced = ?', whereArgs: [0]);
  }

  // Mark report as synced with cloud backend
  Future<int> markReportSynced(int id) async {
    final db = await instance.database;
    return await db.update(
      'offline_report_queue',
      {'is_synced': 1},
      where: 'id = ?',
      whereArgs: [id],
    );
  }

  Future<List<Map<String, dynamic>>> getCachedAlerts() async {
    final db = await instance.database;
    return await db.query('cached_alerts', orderBy: 'id DESC');
  }

  Future<List<Map<String, dynamic>>> getSafeShelters() async {
    final db = await instance.database;
    return await db.query('safe_shelters');
  }
}
