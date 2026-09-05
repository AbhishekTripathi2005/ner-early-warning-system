import 'package:flutter/material.dart';
import '../../../core/database/local_db.dart';
import '../../../core/cv/crack_detector.dart';

class CitizenReportScreen extends StatefulWidget {
  const CitizenReportScreen({Key? key}) : super(key: key);

  @override
  State<CitizenReportScreen> createState() => _CitizenReportScreenState();
}

class _CitizenReportScreenState extends State<CitizenReportScreen> {
  final _descController = TextEditingController();
  String _selectedHazard = 'Slope Creep / Tension Crack';
  String _severity = 'HIGH';
  bool _isAnalyzingCV = false;
  Map<String, dynamic>? _cvResult;
  bool _isSubmitting = false;

  final List<String> _hazardOptions = [
    'Slope Creep / Tension Crack',
    'Retaining Wall Bulging',
    'Mudflow / Debris Washout',
    'Rockfall / Boulder Roll',
    'Water Seepage from Road Cut'
  ];

  Future<void> _runAICrackScan() async {
    setState(() {
      _isAnalyzingCV = true;
    });

    final result = await OnDeviceSlopeCrackDetector.instance.analyzeSlopeImage('mock_photo.jpg');

    setState(() {
      _isAnalyzingCV = false;
      _cvResult = result;
      if (result['hazard_detected'] == true) {
        _severity = 'SEVERE';
      }
    });
  }

  Future<void> _submitReport() async {
    if (_descController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a brief description of the hazard.')),
      );
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    // 1. Always queue into Local SQLite database for offline-first guarantee
    final reportData = {
      'hazard_type': _selectedHazard,
      'severity': _severity,
      'description': _descController.text.trim(),
      'latitude': 25.27, // Simulated GPS coordinate (e.g. Cherrapunji)
      'longitude': 91.73,
      'photo_path': 'local_storage/photo_001.jpg',
      'is_synced': 0,
      'created_at': DateTime.now().toIso8601String(),
    };

    await LocalDatabaseService.instance.queueOfflineReport(reportData);

    setState(() {
      _isSubmitting = false;
      _descController.clear();
      _cvResult = null;
    });

    if (!mounted) return;

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF161F30),
        title: const Text('REPORT QUEUED OFFLINE', style: TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold)),
        content: const Text(
          'Your incident report has been securely saved to local device SQLite storage. It will automatically upload to the Disaster Control Room as soon as mobile network connectivity is detected.',
          style: TextStyle(color: Colors.white70),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('OK', style: TextStyle(color: Colors.lightBlueAccent)),
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Report Landslide / Crack'),
        backgroundColor: const Color(0xFF111827),
      ),
      body: Container(
        color: const Color(0xFF0B0F19),
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Photo attachment box with AI CV button
              Container(
                height: 180,
                width: double.infinity,
                decoration: BoxDecoration(
                  color: const Color(0xFF161F30),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: Colors.white24, style: BorderStyle.solid),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.camera_alt_outlined, size: 42, color: Colors.lightBlueAccent),
                    const SizedBox(height: 8),
                    const Text('Capture or Select Slope Photo', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF0284C7)),
                      onPressed: _isAnalyzingCV ? null : _runAICrackScan,
                      icon: _isAnalyzingCV
                          ? const SizedBox(width: 14, height: 14, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                          : const Icon(Icons.auto_awesome, size: 16),
                      label: Text(_isAnalyzingCV ? 'Running Neural Scan...' : 'On-Device AI Crack Scan'),
                    )
                  ],
                ),
              ),

              // CV Scan Result Badge
              if (_cvResult != null) ...[
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: _cvResult!['hazard_detected'] ? Colors.red.withOpacity(0.2) : Colors.green.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(
                      color: _cvResult!['hazard_detected'] ? Colors.redAccent : Colors.greenAccent,
                    ),
                  ),
                  child: Row(
                    children: [
                      Icon(
                        _cvResult!['hazard_detected'] ? Icons.warning_amber : Icons.check_circle_outline,
                        color: _cvResult!['hazard_detected'] ? Colors.redAccent : Colors.greenAccent,
                      ),
                      const SizedBox(width: 10),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'AI Diagnostic: ${_cvResult!['classification']} (${(_cvResult!['confidence'] * 100).toStringAsFixed(0)}% conf)',
                              style: TextStyle(
                                color: _cvResult!['hazard_detected'] ? Colors.redAccent : Colors.greenAccent,
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                            Text(
                              _cvResult!['advisory'],
                              style: const TextStyle(color: Colors.white70, fontSize: 11),
                            ),
                          ],
                        ),
                      )
                    ],
                  ),
                )
              ],

              const SizedBox(height: 20),
              const Text('Hazard Type', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                decoration: BoxDecoration(
                  color: const Color(0xFF161F30),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: Colors.white24),
                ),
                child: DropdownButton<String>(
                  value: _selectedHazard,
                  isExpanded: true,
                  dropdownColor: const Color(0xFF161F30),
                  underline: const SizedBox(),
                  style: const TextStyle(color: Colors.white, fontSize: 13),
                  items: _hazardOptions.map((h) => DropdownMenuItem(value: h, child: Text(h))).toList(),
                  onChanged: (val) {
                    if (val != null) setState(() => _selectedHazard = val);
                  },
                ),
              ),

              const SizedBox(height: 16),
              const Text('Observed Severity', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              Row(
                children: ['LOW', 'MODERATE', 'HIGH', 'SEVERE'].map((s) {
                  final isSelected = _severity == s;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _severity = s),
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 3),
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFF0284C7) : const Color(0xFF161F30),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: isSelected ? Colors.lightBlueAccent : Colors.white24),
                        ),
                        child: Center(
                          child: Text(
                            s,
                            style: TextStyle(
                              color: isSelected ? Colors.white : Colors.white60,
                              fontWeight: FontWeight.bold,
                              fontSize: 10,
                            ),
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),

              const SizedBox(height: 16),
              const Text('Description / Landmark', style: TextStyle(color: Colors.white70, fontSize: 12, fontWeight: FontWeight.bold)),
              const SizedBox(height: 6),
              TextField(
                controller: _descController,
                maxLines: 3,
                style: const TextStyle(color: Colors.white, fontSize: 13),
                decoration: InputDecoration(
                  hintText: 'Describe crack width, water seepage, rockfall near kilometer stone or school...',
                  hintStyle: const TextStyle(color: Colors.white30, fontSize: 12),
                  filled: true,
                  fillColor: const Color(0xFF161F30),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Colors.white24)),
                  enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: const BorderSide(color: Colors.white24)),
                ),
              ),

              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                height: 48,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFF0284C7),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  onPressed: _isSubmitting ? null : _submitReport,
                  icon: const Icon(Icons.cloud_upload_outlined),
                  label: const Text('SAVE & QUEUE REPORT (OFFLINE-READY)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
