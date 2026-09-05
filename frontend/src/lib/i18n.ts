export type Language = "en" | "hi" | "as" | "brx" | "kha";

export interface TranslationSchema {
  title: string;
  subtitle: string;
  aiOnline: string;
  refreshTelemetry: string;
  officerLogin: string;
  officerLoggedIn: string;
  activeAlerts: string;
  broadcastLive: string;
  criticalHotspots: string;
  maxRainfall: string;
  activeIoTSensors: string;
  aiEngineLSI: string;
  interactiveMapTitle: string;
  layerSusceptibility: string;
  layerHeatmap: string;
  layerRoadStatus: string;
  layerSensors: string;
  legendRiskScale: string;
  lowRisk: string;
  moderateRisk: string;
  highRisk: string;
  severeRisk: string;
  roadStatusTitle: string;
  weatherForecastTitle: string;
  prioritizationTitle: string;
  historicalTrendsTitle: string;
  citizenReviewTitle: string;
  verifyAction: string;
  dismissAction: string;
  pendingReview: string;
  verifiedAlarm: string;
  sirenButton: string;
  reportHazard: string;
  reportModalTitle: string;
  uploadPhoto: string;
  selectPresetPhoto: string;
  locateOnMap: string;
  aiValidation: string;
  layerCitizenReports: string;
  listenVoiceAlert: string;
  stopVoiceAlert: string;
  offlineBannerText: string;
  villagesIsolated: string;
  populationAffected: string;
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
    title: "NER Landslide Early Warning & Risk Monitoring System",
    subtitle: "Ministry of Development of North Eastern Region (MDoNER) • Disaster Management Cell",
    aiOnline: "AI Predictive Engine: ONLINE",
    refreshTelemetry: "Refresh Telemetry",
    officerLogin: "Officer Login",
    officerLoggedIn: "Officer Session Active",
    activeAlerts: "Active Early Warning Dispatches",
    broadcastLive: "Live Broadcast",
    criticalHotspots: "NER Critical Hotspots",
    maxRainfall: "Max 72h Rainfall",
    activeIoTSensors: "Active IoT Hill Nodes",
    aiEngineLSI: "AI Hybrid Engine",
    interactiveMapTitle: "GIS Hazard Zonation & Multi-Layer Viewer",
    layerSusceptibility: "LSI Hazard",
    layerHeatmap: "Point Heatmap",
    layerRoadStatus: "Road Network",
    layerSensors: "IoT Sensors",
    legendRiskScale: "Risk Scale:",
    lowRisk: "Low (<0.35)",
    moderateRisk: "Moderate",
    highRisk: "High",
    severeRisk: "Severe (>0.75)",
    roadStatusTitle: "Arterial Highway Connectivity & Blockages",
    weatherForecastTitle: "Weather-Linked 24-48h Nowcast & Forecast",
    prioritizationTitle: "Emergency Response Prioritization",
    historicalTrendsTitle: "Decadal Historical Landslide Incidence (2018-2025)",
    citizenReviewTitle: "Crowdsourced Citizen Incident Queue",
    verifyAction: "Verify Alarm",
    dismissAction: "Dismiss",
    pendingReview: "Pending Verification",
    verifiedAlarm: "Verified Incident",
    sirenButton: "Simulate Evacuation Siren Broadcast",
    reportHazard: "Report Hazard (Photo/Video)",
    reportModalTitle: "Crowdsourced Ground Hazard Photo/Video Report",
    uploadPhoto: "Upload Real-Time Photo or Video Clip",
    selectPresetPhoto: "Or Select Emergency Field Sample",
    locateOnMap: "Locate on Map",
    aiValidation: "AI Geo-Correlation Validation",
    layerCitizenReports: "Citizen Reports (Ground Truth)",
    listenVoiceAlert: "Listen Alert",
    stopVoiceAlert: "Stop Audio",
    offlineBannerText: "Operating in Offline Field Mode (Cached GIS Tiles)",
    villagesIsolated: "Villages Cut Off",
    populationAffected: "Population Affected"
  },
  hi: {
    title: "उत्तर-पूर्वी क्षेत्र (NER) भूस्खलन पूर्व चेतावनी प्रणाली",
    subtitle: "उत्तर-पूर्वी क्षेत्र विकास मंत्रालय (MDoNER) • आपदा प्रबंधन प्रकोष्ठ",
    aiOnline: "एआई भविष्यवाणी इंजन: सक्रिय (ONLINE)",
    refreshTelemetry: "डेटा रीफ्रेश करें",
    officerLogin: "अधिकारी लॉगिन",
    officerLoggedIn: "अधिकारी सत्र सक्रिय",
    activeAlerts: "सक्रिय आपातकालीन चेतावनी प्रसारण",
    broadcastLive: "लाइव प्रसारण",
    criticalHotspots: "संवेदनशील क्षेत्र (Hotspots)",
    maxRainfall: "अधिकतम वर्षा (72 घंटे)",
    activeIoTSensors: "सक्रिय IoT पहाड़ी सेंसर",
    aiEngineLSI: "एआई हाइब्रिड मॉडल",
    interactiveMapTitle: "जीआईएस भूस्खलन जोखिम एवं मल्टी-लेयर मैप",
    layerSusceptibility: "LSI खतरा क्षेत्र",
    layerHeatmap: "पॉइंट हीटमैप",
    layerRoadStatus: "सड़क नेटवर्क स्थिति",
    layerSensors: "IoT सेंसर नोड्स",
    legendRiskScale: "जोखिम स्तर:",
    lowRisk: "निम्न (<0.35)",
    moderateRisk: "मध्यम",
    highRisk: "उच्च",
    severeRisk: "गंभीर (>0.75)",
    roadStatusTitle: "प्रमुख राजमार्ग संपर्क एवं अवरोध स्थिति",
    weatherForecastTitle: "मौसम-आधारित 24-48 घंटे का पूर्वानुमान",
    prioritizationTitle: "आपातकालीन राहत प्राथमिकता सूची",
    historicalTrendsTitle: "दशकीय भूस्खलन ऐतिहासिक आंकड़े (2018-2025)",
    citizenReviewTitle: "नागरिक रिपोर्ट समीक्षा एवं सत्यापन कतार",
    verifyAction: "सत्यापित करें",
    dismissAction: "खारिज करें",
    pendingReview: "समीक्षा लंबित",
    verifiedAlarm: "सत्यापित भूस्खलन",
    sirenButton: "आपातकालीन सायरन और एसएमएस भेजें",
    reportHazard: "खतरा रिपोर्ट (फोटो/वीडियो)",
    reportModalTitle: "नागरिक भूस्खलन व दरार फोटो/वीडियो रिपोर्ट",
    uploadPhoto: "घटना स्थल की फोटो या छोटा वीडियो अपलोड करें",
    selectPresetPhoto: "या त्वरित आपातकालीन नमूना चुनें",
    locateOnMap: "मानचित्र पर देखें",
    aiValidation: "एआई उपग्रह एवं भू-भाग सत्यापन",
    layerCitizenReports: "नागरिक रिपोर्ट्स (जमीनी साक्ष्य)",
    listenVoiceAlert: "आवाज़ में सुनें",
    stopVoiceAlert: "आवाज़ रोकें",
    offlineBannerText: "ऑफ़लाइन मोड सक्रिय (लोकल कैश डेटा)",
    villagesIsolated: "संपर्क कटा गांव",
    populationAffected: "प्रभावित आबादी"
  },
  as: {
    title: "উত্তৰ-পূব অঞ্চল (NER) ভূমিস্খলন প্ৰাৰম্ভিক সতৰ্কবাণী ব্যৱস্থা",
    subtitle: "উত্তৰ-পূব অঞ্চল উন্নয়ন মন্ত্ৰালয় (MDoNER) • দুৰ্যোগ ব্যৱস্থাপনা কোষ",
    aiOnline: "এআই ভৱিষ্যদ্বাণী ইঞ্জিন: সক্ৰিয়",
    refreshTelemetry: "তথ্য সতেজ কৰক",
    officerLogin: "বিষয়াসকলৰ প্ৰৱেশ",
    officerLoggedIn: "বিষয়া সক্ৰিয়",
    activeAlerts: "সক্ৰিয় জৰুৰীকালীন সতৰ্কবাণী",
    broadcastLive: "লাইভ সম্প্ৰচাৰ",
    criticalHotspots: "সংবেদনশীল অঞ্চলসমূহ",
    maxRainfall: "সৰ্বোচ্চ বৰষুণ (৭২ ঘণ্টা)",
    activeIoTSensors: "সক্ৰিয় IoT ছেন্সৰ",
    aiEngineLSI: "এআই হাইব্ৰিড ইঞ্জিন",
    interactiveMapTitle: "জিআইএছ ভূমিস্খলন আৰু মাল্টি-লেয়াৰ মানচিত্ৰ",
    layerSusceptibility: "LSI বিপদ অঞ্চল",
    layerHeatmap: "পইণ্ট হিটমেপ",
    layerRoadStatus: "পথ যোগাযোগ অৱস্থা",
    layerSensors: "IoT ছেন্সৰ",
    legendRiskScale: "বিপদৰ মাত্ৰা:",
    lowRisk: "কম (<০.৩৫)",
    moderateRisk: "मध्यम",
    highRisk: "উচ্চ",
    severeRisk: "অতি ভয়াৱহ (>০.৭৫)",
    roadStatusTitle: "ৰাষ্ট্ৰীয় ঘাইপথ সংযোগ আৰু বন্ধৰ অৱস্থা",
    weatherForecastTitle: "বতৰ-ভিত্তিক ২৪-৪৮ ঘণ্টাৰ আগজাননী",
    prioritizationTitle: "জৰুৰীকালীন সাহায্য অগ্ৰাধিকাৰ তালিকা",
    historicalTrendsTitle: "ঐতিহাসিক ভূমিস্খলন পৰিসংখ্যা (২০১৮-২০২৫)",
    citizenReviewTitle: "ৰাইজৰ দুৰ্যোগ প্ৰতিবেদন পৰ্যালোচনা",
    verifyAction: "প্ৰমাণিত কৰক",
    dismissAction: "বাতিল কৰক",
    pendingReview: "পৰীক্ষা বাকী আছে",
    verifiedAlarm: "প্ৰমাণিত ঘটনা",
    sirenButton: "জৰুৰীকালীন চাইৰেন আৰু বাৰ্তা প্ৰেৰণ কৰক",
    reportHazard: "বিপদ ৰিপৰ্ট (ফটো/ভিডিঅ')",
    reportModalTitle: "ৰাইজৰ ফটো/ভিডিঅ' দুৰ্যোগ প্ৰতিবেদন",
    uploadPhoto: "বাস্তৱ ঘটনাৰ ফটো বা ভিডিঅ' আপলোড কৰক",
    selectPresetPhoto: "বা জৰুৰীকালীন নমুনা বাছক",
    locateOnMap: "মানচিত্ৰত চাওক",
    aiValidation: "এআই উপগ্ৰহ আৰু ভূ-তথ্য পৰীক্ষা",
    layerCitizenReports: "ৰাইজৰ প্ৰতিবেদন (প্ৰত্যক্ষ প্ৰমাণ)",
    listenVoiceAlert: "কণ্ঠস্বৰ শুনক",
    stopVoiceAlert: "কণ্ঠ বন্ধ কৰক",
    offlineBannerText: "অফলাইন ম'ড সক্ৰিয় (স্থানীয় মানচিত্ৰ কেচ)",
    villagesIsolated: "বিচ্ছিন্ন গাঁও",
    populationAffected: "প্ৰভাৱিত জনসংখ্যা"
  },
  brx: {
    title: "सान्जा-साहा ओनसोल (NER) हा बाग्लायनाय सिगां सांग्रांथि राहा",
    subtitle: "सान्जा-साहा ओनसोल जौगानाय मन्त्रालय (MDoNER) • खैफोद सामलायनाय बिफान",
    aiOnline: "एआइ आगान मोनथिग्रा: सानदों (ONLINE)",
    refreshTelemetry: "डाटा गोदान खालाम",
    officerLogin: "अधिकारी हाबनाय",
    officerLoggedIn: "अधिकारी हाबबाय",
    activeAlerts: "जागासिनो थानाय खैफोद सांग्रांथि",
    broadcastLive: "लाइभ फोसावनाय",
    criticalHotspots: "गोगोम खैफोद जायगाफोर",
    maxRainfall: "बांसिन अखा (७२ घन्टा)",
    activeIoTSensors: "सक्रिय IoT हाजो सेन्सर",
    aiEngineLSI: "एआइ हाइब्रिड मोडल",
    interactiveMapTitle: "GIS हा बाग्लायनाय खैफोद मानसावगारि",
    layerSusceptibility: "LSI खैफोद जायगा",
    layerHeatmap: "पोइन्ट हिटमेप",
    layerRoadStatus: "लामा दाथाय महर",
    layerSensors: "IoT सेन्सर नोडफोर",
    legendRiskScale: "खैफोद थाखो:",
    lowRisk: "खोमसे (<०.३५)",
    moderateRisk: "गेजेर",
    highRisk: "गोजौ",
    severeRisk: "जोबोर गोख्रों (>०.७५)",
    roadStatusTitle: "गाहाय राजलामा फोनांजाब आरो बन्द महर",
    weatherForecastTitle: "बारहावा-आरजाब २४-४८ घन्टा सिगां खौरां",
    prioritizationTitle: "खैफोद हेफाजाब सिगां थियारि थाखो",
    historicalTrendsTitle: "हा बाग्लायनाय जारिमिनारि अनजिमा (२०१८-२०२५)",
    citizenReviewTitle: "रायजोफोरनि खैफोद रिपोर्ट बिजिरनाय",
    verifyAction: "थार होनना नायबिजिर",
    dismissAction: "नेवसि",
    pendingReview: "नायबिजिरनाय थाबाय",
    verifiedAlarm: "थार खैफोद",
    sirenButton: "खैफोद साइरेन आरो एसएमस हर",
    reportHazard: "खैफोद रिपोर्ट (फटो/भिदिअ')",
    reportModalTitle: "रायजोफोरनि हा बाग्लायनाय फटो/भिदिअ' रिपोर्ट",
    uploadPhoto: "जायगानि फटो एबा गुसुं भिदिअ' अपलड खालाम",
    selectPresetPhoto: "एबा गोख्रों नुमुना सायख'",
    locateOnMap: "मानसावगारियाव नाय",
    aiValidation: "एआइ सिलाइ आरो हा-खौरां नायबिजिर",
    layerCitizenReports: "रायजोफोरनि रिपोर्ट (साखि)",
    listenVoiceAlert: "रावजों खनासं",
    stopVoiceAlert: "राव दोनथ'",
    offlineBannerText: "अफलाइन मड जागासिनो (लोकेल मानसावगारि केच)",
    villagesIsolated: "फोनांजाब गैयै गामिफोर",
    populationAffected: "जायगानि सुबुं अनजिमा"
  },
  kha: {
    title: "Raid Bah NER Ka Jingmaham Bakloi Halor Ka Jingtwad Khyndew",
    subtitle: "Ministry of Development of North Eastern Region (MDoNER) • Disaster Management Cell",
    aiOnline: "AI Predictive Engine: KAM (ONLINE)",
    refreshTelemetry: "Pynbnaiphiang Telemetry",
    officerLogin: "Ka Jingbsut ki Officer",
    officerLoggedIn: "Ka Session Officer Kam",
    activeAlerts: "Ki Jingpynbna Maham Bakloi",
    broadcastLive: "Pynbna Lynter (Live)",
    criticalHotspots: "Ki jaka ba kham ma ha NER",
    maxRainfall: "Jinghap slap ba bun tam (72 kynta)",
    activeIoTSensors: "Ki IoT Sensor ha Lum",
    aiEngineLSI: "AI Hybrid Engine",
    interactiveMapTitle: "GIS Map Jingmaham bad ki Kylleng Layer",
    layerSusceptibility: "Jingma LSI",
    layerHeatmap: "Point Heatmap",
    layerRoadStatus: "Ka Surok Bah",
    layerSensors: "Ki Sensor IoT",
    legendRiskScale: "Kyrdan Jingma:",
    lowRisk: "Poh (<0.35)",
    moderateRisk: "Pdeng",
    highRisk: "Hajrong",
    severeRisk: "Kham Ma Jur (>0.75)",
    roadStatusTitle: "Ka Jinglong ki Surok Bah & Jingkhang Surok",
    weatherForecastTitle: "Jingpynkhreh Suinbneng 24-48 Kynta",
    prioritizationTitle: "Ka Thup Ban Lehklok ha ki Jaka Ba Ma",
    historicalTrendsTitle: "Ki Jingjia Twad Khyndew ha ki Phew Snem (2018-2025)",
    citizenReviewTitle: "Ki Jingujor ki Nongshongshnong",
    verifyAction: "Pynskhem",
    dismissAction: "Kyntait",
    pendingReview: "Dang bishar",
    verifiedAlarm: "La pynskhem ba shisha",
    sirenButton: "Pynriew Siren & Phah SMS Maham",
    reportHazard: "Ujor Jingma (Dur/Video)",
    reportModalTitle: "Ka Jingujor Dur & Video na Madan",
    uploadPhoto: "Upload Dur ne Video lyngkot na jaka jia",
    selectPresetPhoto: "Ne Jied na ki Nuksa",
    locateOnMap: "Wad ha Map",
    aiValidation: "Jingbishar AI Satellite & Khyndew",
    layerCitizenReports: "Jingujor ki Shnong (Sakor Shisha)",
    listenVoiceAlert: "Sngap ka Ktien Maham",
    stopVoiceAlert: "Sangeh ka Ktien",
    offlineBannerText: "Ka Trei Offline (La pynlang ha memory)",
    villagesIsolated: "Ki Shnong ba la sahkut",
    populationAffected: "Ki Nongshongshnong ba shah ktah"
  }
};
