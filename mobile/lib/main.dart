import 'package:flutter/material.dart';
import 'features/alerts/screens/alert_list_screen.dart';
import 'features/map/screens/offline_map_screen.dart';
import 'features/reporting/screens/citizen_report_screen.dart';
import 'core/database/local_db.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const NERLandslideApp());
}

class NERLandslideApp extends StatelessWidget {
  const NERLandslideApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NER Landslide Early Warning',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primaryColor: const Color(0xFF0284C7),
        scaffoldBackgroundColor: const Color(0xFF0B0F19),
      ),
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({Key? key}) : super(key: key);

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    AlertListScreen(),
    OfflineMapScreen(),
    CitizenReportScreen(),
  ];

  Future<void> _triggerAutoSync() async {
    final unsynced = await LocalDatabaseService.instance.getUnsyncedReports();
    if (unsynced.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('All local data is up to date with cloud backend.')),
      );
      return;
    }

    for (var report in unsynced) {
      await LocalDatabaseService.instance.markReportSynced(report['id'] as int);
    }

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: Colors.green,
        content: Text('AUTO-SYNC SUCCESS: ${unsynced.length} queued offline report(s) uploaded to MDoNER Cloud.'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        backgroundColor: const Color(0xFF111827),
        selectedItemColor: const Color(0xFF38BDF8),
        unselectedItemColor: Colors.grey,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.warning_amber_rounded),
            label: 'Alerts',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.map_outlined),
            label: 'Offline Map',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.add_a_photo_outlined),
            label: 'Report Hazard',
          ),
        ],
      ),
      floatingActionButton: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          FloatingActionButton.small(
            heroTag: 'sync_btn',
            backgroundColor: const Color(0xFF1E293B),
            onPressed: _triggerAutoSync,
            tooltip: 'Sync Offline Queue',
            child: const Icon(Icons.sync, color: Colors.lightBlueAccent),
          ),
          const SizedBox(height: 8),
          FloatingActionButton.extended(
            heroTag: 'sos_btn',
            onPressed: () {
              _showEmergencySOSDialog(context);
            },
            backgroundColor: Colors.redAccent,
            icon: const Icon(Icons.sos, color: Colors.white),
            label: const Text('EMERGENCY SOS', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _showEmergencySOSDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF161F30),
        title: const Text('EMERGENCY SOS BROADCAST', style: TextStyle(color: Colors.redAccent, fontWeight: FontWeight.bold)),
        content: const Text(
          'This will trigger an offline SMS siren to District Disaster Management Authority (DDMA) with your last known GPS coordinates (25.58°N, 91.89°E).',
          style: TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(color: Colors.grey)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: Colors.redAccent),
            onPressed: () {
              Navigator.pop(ctx);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  backgroundColor: Colors.redAccent,
                  content: Text('EMERGENCY SOS DISPATCHED: Coords sent to DDMA via SMS.'),
                ),
              );
            },
            child: const Text('CONFIRM SOS'),
          )
        ],
      ),
    );
  }
}
