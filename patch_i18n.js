const fs = require('fs');

const data = fs.readFileSync('src/utils/i18n.ts', 'utf8');

const newEn = `
    explanation: 'Explanation',
    coopPlatformNote: '100% Cooperative-Owned Platform • 94.5% Earnings Go To Labour',
    heroDescription: "Benchmarked against Indore's authentic local trade prices. Every worker is verified by registered labour societies with explainable trust scores and OTP arrival protection.",
    liveWorkerMap: 'Live Worker Map',
    benchmarkBtn: 'Benchmark (140)',
    citizenLogin: 'Citizen OTP Login',
    switchCitizen: 'Switch Citizen / Re-verify',
    exploreFixedPrices: 'Want to explore fixed prices or book a standard trade?',
    switchToCatalog: 'Switch to our 140+ benchmarked service catalog.',
    allServiceCategories: 'All Service Categories',
    twelveCategories: '12 Trade Categories',
    searchResultsFor: 'Search Results for',
    backToCategories: 'Back to Categories',
    servicesFound: 'Services Found',
    popular: 'Popular',
    urgent: 'Urgent',
    cat_Plumbing_name: 'Plumbing',
    cat_Plumbing_subtitle: 'Pipe repairs, leaks, installations',
    cat_Electrical_name: 'Electrical',
    cat_Electrical_subtitle: 'Wiring, switches, fan installation',
    cat_Carpentry_name: 'Carpentry',
    cat_Carpentry_subtitle: 'Furniture repair, doors, windows',
    cat_Painting_name: 'Painting',
    cat_Painting_subtitle: 'Interior, exterior, waterproofing',
    cat_Masonry_name: 'Masonry',
    cat_Masonry_subtitle: 'Tile fixing, plastering, repair'
  },`;

const newHi = `
    explanation: 'विवरण',
    coopPlatformNote: '100% सहकारी स्वामित्व • 94.5% कमाई सीधे कामगार को',
    heroDescription: "इंदौर की प्रामाणिक स्थानीय दरों पर आधारित। प्रत्येक कामगार पंजीकृत सहकारी समितियों द्वारा सत्यापित है।",
    liveWorkerMap: 'लाइव वर्कर मैप',
    benchmarkBtn: 'बेंचमार्क (140)',
    citizenLogin: 'नागरिक ओटीपी लॉगिन',
    switchCitizen: 'नागरिक बदलें / पुनः सत्यापित करें',
    exploreFixedPrices: 'क्या आप निश्चित मूल्य देखना चाहते हैं?',
    switchToCatalog: 'हमारे 140+ प्रमाणित सेवा कैटलॉग पर स्विच करें।',
    allServiceCategories: 'सभी सेवा श्रेणियां',
    twelveCategories: '12 ट्रेड श्रेणियां',
    searchResultsFor: 'खोज परिणाम:',
    backToCategories: 'श्रेणियों पर वापस जाएं',
    servicesFound: 'सेवाएं मिलीं',
    popular: 'लोकप्रिय',
    urgent: 'तत्काल',
    cat_Plumbing_name: 'प्लंबिंग / नलसाजी',
    cat_Plumbing_subtitle: 'पाइप मरम्मत, लीक, इंस्टालेशन',
    cat_Electrical_name: 'इलेक्ट्रिकल / बिजली कार्य',
    cat_Electrical_subtitle: 'वायरिंग, स्विच, पंखा इंस्टालेशन',
    cat_Carpentry_name: 'बढ़ईगीरी / लकड़ी कार्य',
    cat_Carpentry_subtitle: 'फर्नीचर मरम्मत, दरवाजे, खिड़कियां',
    cat_Painting_name: 'पेंटिंग / रंगाई-पुताई',
    cat_Painting_subtitle: 'इंटीरियर, एक्सटीरियर, वाटरप्रूफिंग',
    cat_Masonry_name: 'राजमिस्त्री / निर्माण कार्य',
    cat_Masonry_subtitle: 'टाइल लगाना, पलस्तर, मरम्मत'
  },`;

const newBn = `
    explanation: 'ব্যাখ্যা',
    coopPlatformNote: '১০০% সমবায়-মালিকানাধীন • ৯৪.৫% উপার্জন শ্রমিকের',
    heroDescription: "ইন্দোরের খাঁটি স্থানীয় বাণিজ্য মূল্যের বিরুদ্ধে বেঞ্চমার্ক করা। প্রতিটি কর্মী নিবন্ধিত শ্রম সমাজ দ্বারা যাচাই করা হয়।",
    liveWorkerMap: 'লাইভ ওয়ার্কার ম্যাপ',
    benchmarkBtn: 'বেঞ্চমার্ক (১৪০)',
    citizenLogin: 'নাগরিক ওটিপি লগইন',
    switchCitizen: 'নাগরিক পরিবর্তন করুন',
    exploreFixedPrices: 'আপনি কি নির্দিষ্ট মূল্য দেখতে চান?',
    switchToCatalog: 'আমাদের ১৪০+ যাচাইকৃত পরিষেবা ক্যাটালগে স্যুইচ করুন।',
    allServiceCategories: 'সকল পরিষেবা বিভাগ',
    twelveCategories: '১২ টি ট্রেড বিভাগ',
    searchResultsFor: 'অনুসন্ধানের ফলাফল:',
    backToCategories: 'বিভাগে ফিরে যান',
    servicesFound: 'পরিষেবা পাওয়া গেছে',
    popular: 'জনপ্রিয়',
    urgent: 'জরুরী',
    cat_Plumbing_name: 'প্লাম্বিং',
    cat_Plumbing_subtitle: 'পাইপ মেরামত, লিক, ইনস্টলেশন',
    cat_Electrical_name: 'বৈদ্যুতিক',
    cat_Electrical_subtitle: 'ওয়্যারিং, সুইচ, ফ্যান ইনস্টলেশন',
    cat_Carpentry_name: 'কাঠের কাজ',
    cat_Carpentry_subtitle: 'আসবাবপত্র মেরামত, দরজা, জানালা',
    cat_Painting_name: 'রং করা',
    cat_Painting_subtitle: 'ভিতরে, বাইরে, ওয়াটারপ্রুফিং',
    cat_Masonry_name: 'রাজমিস্ত্রি',
    cat_Masonry_subtitle: 'টাইল ফিক্সিং, প্লাস্টারিং, মেরামত'
  },`;

const newMr = `
    explanation: 'स्पष्टीकरण',
    coopPlatformNote: '१००% सहकारी मालकीचे • ९४.५% कमाई कामगारांना',
    heroDescription: "इंदूरच्या स्थानिक दरांवर आधारित. प्रत्येक कामगार नोंदणीकृत कामगार संस्थांद्वारे सत्यापित आहे.",
    liveWorkerMap: 'लाइव्ह वर्कर मॅप',
    benchmarkBtn: 'बेंचमार्क (140)',
    citizenLogin: 'नागरिक ओटीपी लॉगिन',
    switchCitizen: 'नागरिक बदला / पुन्हा सत्यापित करा',
    exploreFixedPrices: 'तुम्हाला निश्चित दर पहायचे आहेत का?',
    switchToCatalog: 'आमच्या 140+ प्रमाणित सेवा कॅटलॉगवर स्विच करा.',
    allServiceCategories: 'सर्व सेवा श्रेणी',
    twelveCategories: '12 ट्रेड श्रेणी',
    searchResultsFor: 'शोध परिणाम:',
    backToCategories: 'श्रेणींवर परत जा',
    servicesFound: 'सेवा आढळल्या',
    popular: 'लोकप्रिय',
    urgent: 'तातडीचे',
    cat_Plumbing_name: 'प्लंबिंग',
    cat_Plumbing_subtitle: 'पाईप दुरुस्ती, गळती, इन्स्टॉलेशन',
    cat_Electrical_name: 'इलेक्ट्रिकल',
    cat_Electrical_subtitle: 'वायरिंग, स्विच, फॅन इन्स्टॉलेशन',
    cat_Carpentry_name: 'सुतारकाम',
    cat_Carpentry_subtitle: 'फर्निचर दुरुस्ती, दारे, खिडक्या',
    cat_Painting_name: 'पेंटिंग',
    cat_Painting_subtitle: 'आतील, बाहेरील, वॉटरप्रूफिंग',
    cat_Masonry_name: 'गवंडीकाम',
    cat_Masonry_subtitle: 'टाईल बसवणे, प्लास्टरिंग, दुरुस्ती'
  },`;

const newTe = `
    explanation: 'వివరణ',
    coopPlatformNote: '100% సహకార యాజమాన్యం • 94.5% ఆదాయం కార్మికులకే',
    heroDescription: "ఇండోర్ యొక్క స్థానిక ధరల ఆధారంగా. ప్రతి కార్మికుడు నమోదిత కార్మిక సంఘాలచే ధృవీకరించబడ్డాడు.",
    liveWorkerMap: 'లైవ్ వర్కర్ మ్యాప్',
    benchmarkBtn: 'బెంచ్‌మార్క్ (140)',
    citizenLogin: 'సిటిజన్ OTP లాగిన్',
    switchCitizen: 'సిటిజన్ మార్చండి',
    exploreFixedPrices: 'మీరు స్థిర ధరలను చూడాలనుకుంటున్నారా?',
    switchToCatalog: 'మా 140+ సేవల జాబితాకు మారండి.',
    allServiceCategories: 'అన్ని సేవా విభాగాలు',
    twelveCategories: '12 వృత్తి విభాగాలు',
    searchResultsFor: 'శోధన ఫలితాలు:',
    backToCategories: 'విభాగాలకు తిరిగి వెళ్లండి',
    servicesFound: 'సేవలు కనుగొనబడ్డాయి',
    popular: 'జనాదరణ పొందినవి',
    urgent: 'అత్యవసరం',
    cat_Plumbing_name: 'ప్లంబింగ్',
    cat_Plumbing_subtitle: 'పైపుల మరమ్మతులు, లీక్‌లు, ఇన్‌స్టాలేషన్',
    cat_Electrical_name: 'ఎలక్ట్రికల్',
    cat_Electrical_subtitle: 'వైరింగ్, స్విచ్‌లు, ఫ్యాన్ ఇన్‌స్టాలేషన్',
    cat_Carpentry_name: 'కార్పెంటరీ',
    cat_Carpentry_subtitle: 'ఫర్నిచర్ మరమ్మత్తు, తలుపులు, కిటికీలు',
    cat_Painting_name: 'పెయింటింగ్',
    cat_Painting_subtitle: 'లోపల, బయట, వాటర్‌ప్రూఫింగ్',
    cat_Masonry_name: 'మేస్త్రీ పని',
    cat_Masonry_subtitle: 'టైల్స్, ప్లాస్టరింగ్, మరమ్మత్తు'
  },`;

const newTa = `
    explanation: 'விளக்கம்',
    coopPlatformNote: '100% கூட்டுறவு உரிமை • 94.5% வருமானம் தொழிலாளர்களுக்கு',
    heroDescription: "இந்தூரின் உள்ளூர் வர்த்தக விலைகளின் அடிப்படையில். ஒவ்வொரு தொழிலாளியும் பதிவுசெய்யப்பட்ட தொழிலாளர் சங்கங்களால் சரிபார்க்கப்படுகிறார்கள்.",
    liveWorkerMap: 'நேரலை தொழிலாளர் வரைபடம்',
    benchmarkBtn: 'பெஞ்ச்மார்க் (140)',
    citizenLogin: 'குடிமக்கள் OTP உள்நுழைவு',
    switchCitizen: 'குடிமக்களை மாற்றுக',
    exploreFixedPrices: 'நிலையான விலைகளை பார்க்க வேண்டுமா?',
    switchToCatalog: 'எங்கள் 140+ சேவைகளுக்கு மாறவும்.',
    allServiceCategories: 'அனைத்து சேவை பிரிவுகளும்',
    twelveCategories: '12 தொழில் பிரிவுகள்',
    searchResultsFor: 'தேடல் முடிவுகள்:',
    backToCategories: 'பிரிவுகளுக்கு திரும்புக',
    servicesFound: 'சேவைகள் கிடைத்தன',
    popular: 'பிரபலமான',
    urgent: 'அவசரம்',
    cat_Plumbing_name: 'குழாய் வேலை',
    cat_Plumbing_subtitle: 'குழாய் பழுது, கசிவுகள், பொருத்துதல்',
    cat_Electrical_name: 'மின்சாரம்',
    cat_Electrical_subtitle: 'வயரிங், சுவிட்சுகள், விசிறி பொருத்துதல்',
    cat_Carpentry_name: 'தச்சு வேலை',
    cat_Carpentry_subtitle: 'மரச்சாமான்கள் பழுது, கதவுகள்',
    cat_Painting_name: 'வர்ணம் பூசுதல்',
    cat_Painting_subtitle: 'உட்புறம், வெளிப்புறம், நீர்ப்புகா',
    cat_Masonry_name: 'கொத்தனார் வேலை',
    cat_Masonry_subtitle: 'ஓடுகள் பொருத்துதல், பூச்சு, பழுது'
  },`;

let updatedData = data.replace(/    explanation: 'Explanation',\n  },/g, newEn);
updatedData = updatedData.replace(/    explanation: 'विवरण',\n  },/g, newHi);
updatedData = updatedData.replace(/    explanation: 'ব্যাখ্যা',\n  },/g, newBn);
updatedData = updatedData.replace(/    explanation: 'स्पष्टीकरण',\n  },/g, newMr);
updatedData = updatedData.replace(/    explanation: 'వివరణ',\n  },/g, newTe);
updatedData = updatedData.replace(/    explanation: 'விளக்கம்',\n  },/g, newTa);

fs.writeFileSync('src/utils/i18n.ts', updatedData);
console.log('Done!');
