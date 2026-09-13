const fs = require('fs');

let data = fs.readFileSync('src/utils/i18n.ts', 'utf8');

const additionalCats = {
  en: `
    cat_Deep_Cleaning_name: 'Deep Cleaning',
    cat_Deep_Cleaning_subtitle: 'Full home, bathroom, sofa, carpet',
    cat_Appliance_Repair_name: 'Appliance Repair',
    cat_Appliance_Repair_subtitle: 'Washing machine, fridge, microwave',
    cat_Pest_Control_name: 'Pest Control',
    cat_Pest_Control_subtitle: 'Termite, cockroach, mosquito control',
    cat_R_O__Repair_name: 'R.O. Repair',
    cat_R_O__Repair_subtitle: 'Water purifier service, filter change',
    cat_Flooring_name: 'Flooring',
    cat_Flooring_subtitle: 'Tile laying, marble polishing',
    cat_Waterproofing_name: 'Waterproofing',
    cat_Waterproofing_subtitle: 'Roof, bathroom, terrace leaks',
    cat_Solar_Install_name: 'Solar Install',
    cat_Solar_Install_subtitle: 'Panel setup, inverter maintenance'
  },`,
  hi: `
    cat_Deep_Cleaning_name: 'डीप क्लीनिंग / गहरी सफाई',
    cat_Deep_Cleaning_subtitle: 'पूरा घर, बाथरूम, सोफा, कालीन',
    cat_Appliance_Repair_name: 'उपकरण मरम्मत',
    cat_Appliance_Repair_subtitle: 'वाशिंग मशीन, फ्रिज, माइक्रोवेव',
    cat_Pest_Control_name: 'कीट नियंत्रण',
    cat_Pest_Control_subtitle: 'दीमक, कॉकरोच, मच्छर नियंत्रण',
    cat_R_O__Repair_name: 'आर.ओ. मरम्मत',
    cat_R_O__Repair_subtitle: 'वाटर प्यूरीफायर सर्विस, फिल्टर बदलाव',
    cat_Flooring_name: 'फ़्लोरिंग / फर्श कार्य',
    cat_Flooring_subtitle: 'टाइल बिछाना, संगमरमर पॉलिशिंग',
    cat_Waterproofing_name: 'वाटरप्रूफिंग',
    cat_Waterproofing_subtitle: 'छत, बाथरूम, छत के रिसाव',
    cat_Solar_Install_name: 'सोलर इंस्टालेशन',
    cat_Solar_Install_subtitle: 'पैनल सेटअप, इन्वर्टर रखरखाव'
  },`,
  mr: `
    cat_Deep_Cleaning_name: 'डीप क्लिनिंग',
    cat_Deep_Cleaning_subtitle: 'संपूर्ण घर, बाथरूम, सोफा, कार्पेट',
    cat_Appliance_Repair_name: 'उपकरण दुरुस्ती',
    cat_Appliance_Repair_subtitle: 'वॉशिंग मशीन, फ्रिज, मायक्रोवेव्ह',
    cat_Pest_Control_name: 'कीटक नियंत्रण',
    cat_Pest_Control_subtitle: 'वाळवी, झुरळ, डास नियंत्रण',
    cat_R_O__Repair_name: 'आर.ओ. दुरुस्ती',
    cat_R_O__Repair_subtitle: 'वॉटर प्युरिफायर सेवा, फिल्टर बदलणे',
    cat_Flooring_name: 'फ्लोरिंग',
    cat_Flooring_subtitle: 'टाईल बसवणे, मार्बल पॉलिशिंग',
    cat_Waterproofing_name: 'वॉटरप्रूफिंग',
    cat_Waterproofing_subtitle: 'छत, बाथरूम, गळती दुरुस्ती',
    cat_Solar_Install_name: 'सोलर इंस्टॉलेशन',
    cat_Solar_Install_subtitle: 'पॅनेल सेटअप, इन्व्हर्टर देखभाल'
  },`,
  bn: `
    cat_Deep_Cleaning_name: 'ডিপ ক্লিনিং',
    cat_Deep_Cleaning_subtitle: 'সম্পূর্ণ বাড়ি, বাথরুম, সোফা, কার্পেট',
    cat_Appliance_Repair_name: 'যন্ত্রপাতি মেরামত',
    cat_Appliance_Repair_subtitle: 'ওয়াশিং মেশিন, ফ্রিজ, মাইক্রোওয়েভ',
    cat_Pest_Control_name: 'পোকামাকড় নিয়ন্ত্রণ',
    cat_Pest_Control_subtitle: 'উইপোকা, তেলাপোকা, মশা নিয়ন্ত্রণ',
    cat_R_O__Repair_name: 'আর.ও. মেরামত',
    cat_R_O__Repair_subtitle: 'ওয়াটার পিউরিফায়ার পরিষেবা, ফিল্টার পরিবর্তন',
    cat_Flooring_name: 'ফ্লোরিং',
    cat_Flooring_subtitle: 'টাইল বসানো, মার্বেল পলিশিং',
    cat_Waterproofing_name: 'ওয়াটারপ্রুফিং',
    cat_Waterproofing_subtitle: 'ছাদ, বাথরুম, ফুটো মেরামত',
    cat_Solar_Install_name: 'সোলার ইন্সটলেশন',
    cat_Solar_Install_subtitle: 'প্যানেল সেটআপ, ইনভার্টার রক্ষণাবেক্ষণ'
  },`,
  te: `
    cat_Deep_Cleaning_name: 'డీప్ క్లీనింగ్',
    cat_Deep_Cleaning_subtitle: 'పూర్తి ఇల్లు, బాత్రూమ్, సోఫా, కార్పెట్',
    cat_Appliance_Repair_name: 'ఉపకరణాల మరమ్మత్తు',
    cat_Appliance_Repair_subtitle: 'వాషింగ్ మెషీన్, ఫ్రిజ్, మైక్రోవేవ్',
    cat_Pest_Control_name: 'పెస్ట్ కంట్రోల్',
    cat_Pest_Control_subtitle: 'చెదపురుగులు, బొద్దింక, దోమల నియంత్రణ',
    cat_R_O__Repair_name: 'ఆర్.ఓ. మరమ్మత్తు',
    cat_R_O__Repair_subtitle: 'వాటర్ ప్యూరిఫైయర్ సేవ, ఫిల్టర్ మార్చడం',
    cat_Flooring_name: 'ఫ్లోరింగ్',
    cat_Flooring_subtitle: 'టైల్స్ వేయడం, మార్బుల్ పాలిషింగ్',
    cat_Waterproofing_name: 'వాటర్‌ప్రూఫింగ్',
    cat_Waterproofing_subtitle: 'పైకప్పు, బాత్రూమ్, లీక్ మరమ్మత్తు',
    cat_Solar_Install_name: 'సోలార్ ఇన్‌స్టాలేషన్',
    cat_Solar_Install_subtitle: 'ప్యానెల్ సెటప్, ఇన్వర్టర్ నిర్వహణ'
  },`,
  ta: `
    cat_Deep_Cleaning_name: 'ஆழ்ந்த சுத்தம்',
    cat_Deep_Cleaning_subtitle: 'முழு வீடு, குளியலறை, சோபா, தரைவிரிப்பு',
    cat_Appliance_Repair_name: 'உபகரண பழுது',
    cat_Appliance_Repair_subtitle: 'சலவை இயந்திரம், குளிர்சாதன பெட்டி',
    cat_Pest_Control_name: 'பூச்சி கட்டுப்பாடு',
    cat_Pest_Control_subtitle: 'கறையான், கரப்பான் பூச்சி, கொசு கட்டுப்பாடு',
    cat_R_O__Repair_name: 'ஆர்.ஓ. பழுது',
    cat_R_O__Repair_subtitle: 'நீர் சுத்திகரிப்பு சேவை, வடிகட்டி மாற்றம்',
    cat_Flooring_name: 'தரை அமைத்தல்',
    cat_Flooring_subtitle: 'ஓடுகள் பதித்தல், மார்பிள் பாலிஷிங்',
    cat_Waterproofing_name: 'நீர்க்கசிவு தடுப்பு',
    cat_Waterproofing_subtitle: 'கூரைகள், குளியலறை, கசிவுகள்',
    cat_Solar_Install_name: 'சூரிய சக்தி நிறுவல்',
    cat_Solar_Install_subtitle: 'பேனல் அமைப்பு, இன்வெர்ட்டர் பராமரிப்பு'
  },`
};

data = data.replace(/cat_Masonry_subtitle: 'Tile fixing, plastering, repair'\n  },/g, "cat_Masonry_subtitle: 'Tile fixing, plastering, repair'," + additionalCats.en);
data = data.replace(/cat_Masonry_subtitle: 'टाइल लगाना, पलस्तर, मरम्मत'\n  },/g, "cat_Masonry_subtitle: 'टाइल लगाना, पलस्तर, मरम्मत'," + additionalCats.hi);
data = data.replace(/cat_Masonry_subtitle: 'টাইল ফিক্সিং, প্লাস্টারিং, মেরামত'\n  },/g, "cat_Masonry_subtitle: 'টাইল ফিক্সিং, প্লাস্টারিং, মেরামত'," + additionalCats.bn);
data = data.replace(/cat_Masonry_subtitle: 'टाईल बसवणे, प्लास्टरिंग, दुरुस्ती'\n  },/g, "cat_Masonry_subtitle: 'टाईल बसवणे, प्लास्टरिंग, दुरुस्ती'," + additionalCats.mr);
data = data.replace(/cat_Masonry_subtitle: 'టైల్స్, ప్లాస్టరింగ్, మరమ్మత్తు'\n  },/g, "cat_Masonry_subtitle: 'టైల్స్, ప్లాస్టరింగ్, మరమ్మత్తు'," + additionalCats.te);
data = data.replace(/cat_Masonry_subtitle: 'ஓடுகள் பொருத்துதல், பூச்சு, பழுது'\n  },/g, "cat_Masonry_subtitle: 'ஓடுகள் பொருத்துதல், பூச்சு, பழுது'," + additionalCats.ta);

fs.writeFileSync('src/utils/i18n.ts', data);
console.log('Done additional cats!');
