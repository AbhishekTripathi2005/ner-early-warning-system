import 'package:flutter/material.dart';

class OfflineMapScreen extends StatelessWidget {
  const OfflineMapScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Offline Hazard & Safe Shelters'),
        backgroundColor: const Color(0xFF111827),
      ),
      body: Container(
        color: const Color(0xFF0B0F19),
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            Container(
              height: 280,
              width: double.infinity,
              decoration: BoxDecoration(
                color: const Color(0xFF161F30),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: Colors.white24),
              ),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: const [
                    Icon(Icons.map_outlined, size: 56, color: Colors.lightBlueAccent),
                    SizedBox(height: 12),
                    Text(
                      'Offline Map Canvas (Pre-cached Tiles)',
                      style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 4),
                    Text(
                      'Tiles stored locally in SQLite / SD Card cache',
                      style: TextStyle(color: Colors.white54, fontSize: 12),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: const [
                Icon(Icons.shield, color: Colors.greenAccent, size: 20),
                SizedBox(width: 8),
                Text(
                  'Nearby Safe Shelters (Offline Verified)',
                  style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Expanded(
              child: ListView(
                children: const [
                  ListTile(
                    tileColor: Color(0xFF161F30),
                    leading: Icon(Icons.apartment, color: Colors.greenAccent),
                    title: Text('Shillong Polo Ground Relief Camp', style: TextStyle(color: Colors.white)),
                    subtitle: Text('Capacity: 1,200 people | East Khasi Hills', style: TextStyle(color: Colors.white60)),
                    trailing: Text('4.2 km', style: TextStyle(color: Colors.lightBlueAccent, fontWeight: FontWeight.bold)),
                  ),
                  SizedBox(height: 8),
                  ListTile(
                    tileColor: Color(0xFF161F30),
                    leading: Icon(Icons.apartment, color: Colors.greenAccent),
                    title: Text('Gangtok Paljor Stadium Safe Center', style: TextStyle(color: Colors.white)),
                    subtitle: Text('Capacity: 800 people | East Sikkim', style: TextStyle(color: Colors.white60)),
                    trailing: Text('12.5 km', style: TextStyle(color: Colors.lightBlueAccent, fontWeight: FontWeight.bold)),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
