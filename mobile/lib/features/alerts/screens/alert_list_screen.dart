import 'package:flutter/material.dart';

class AlertListScreen extends StatelessWidget {
  const AlertListScreen({Key? key}) : super(key: key);

  final List<Map<String, dynamic>> mockAlerts = const [
    {
      "id": 101,
      "title": "RED ALERT: East Khasi Hills Slope Threat",
      "desc": "Rainfall exceeded 260mm/72h. Immediate evacuation recommended.",
      "level": "SEVERE",
      "district": "East Khasi Hills, Meghalaya",
      "route": "Follow NH-106 north to Shillong Polo Stadium",
      "time": "10 mins ago"
    },
    {
      "id": 102,
      "title": "ORANGE ALERT: Active Ground Creep",
      "desc": "Sentinel-1 InSAR shows 14mm/month subsidence along Singtam Corridor.",
      "level": "HIGH",
      "district": "East Sikkim",
      "route": "Avoid Dikchu bypass. Take NH-10 diversion.",
      "time": "45 mins ago"
    }
  ];

  Color _getLevelColor(String level) {
    switch (level) {
      case 'SEVERE':
        return Colors.redAccent;
      case 'HIGH':
        return Colors.orangeAccent;
      case 'MODERATE':
        return Colors.amber;
      default:
        return Colors.green;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Disaster Alerts (NER)'),
        backgroundColor: const Color(0xFF111827),
        actions: [
          IconButton(
            icon: const Icon(Icons.sync),
            tooltip: 'Sync Offline Cache',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Offline Cache synced with cloud database.')),
              );
            },
          )
        ],
      ),
      body: Container(
        color: const Color(0xFF0B0F19),
        child: ListView.builder(
          padding: const EdgeInsets.all(12),
          itemCount: mockAlerts.length,
          itemBuilder: (context, index) {
            final alert = mockAlerts[index];
            final color = _getLevelColor(alert['level'] as String);

            return Card(
              color: const Color(0xFF161F30),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
                side: BorderSide(color: color.withOpacity(0.6), width: 1.2),
              ),
              margin: const EdgeInsets.only(bottom: 12),
              child: Padding(
                padding: const EdgeInsets.all(14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: color.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Text(
                            alert['level'] as String,
                            style: TextStyle(color: color, fontWeight: FontWeight.bold, fontSize: 11),
                          ),
                        ),
                        Text(
                          alert['time'] as String,
                          style: const TextStyle(color: Colors.grey, fontSize: 11),
                        )
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      alert['title'] as String,
                      style: const TextStyle(color: Colors.white, fontSize: 15, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      alert['desc'] as String,
                      style: const TextStyle(color: Colors.white70, fontSize: 13),
                    ),
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: Colors.black38,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.navigation, size: 16, color: Colors.lightBlueAccent),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              'Evac Route: ${alert['route']}',
                              style: const TextStyle(color: Colors.lightBlueAccent, fontSize: 12),
                            ),
                          )
                        ],
                      ),
                    )
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}
