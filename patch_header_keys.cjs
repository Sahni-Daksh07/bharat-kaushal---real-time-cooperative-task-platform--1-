const fs = require('fs');

let data = fs.readFileSync('src/utils/i18n.ts', 'utf8');

const additionalKeys = {
  en: `
    clickToSignIn: 'Click to Sign In',
    signIn: 'Sign In',
    tapToAuthorize: 'Tap to Authorize',
    pricingDataset: 'Pricing Dataset (140)',
    data: 'Data',
    realtimeStream: 'Real-time Stream',
    noRecentAlerts: 'No recent alerts'
  },`,
  hi: `
    clickToSignIn: 'साइन इन करने के लिए क्लिक करें',
    signIn: 'साइन इन',
    tapToAuthorize: 'अधिकृत करने के लिए टैप करें',
    pricingDataset: 'मूल्य निर्धारण डेटासेट (140)',
    data: 'डेटा',
    realtimeStream: 'रीयल-टाइम स्ट्रीम',
    noRecentAlerts: 'कोई हालिया अलर्ट नहीं'
  },`,
  mr: `
    clickToSignIn: 'साइन इन करण्यासाठी क्लिक करा',
    signIn: 'साइन इन',
    tapToAuthorize: 'अधिकृत करण्यासाठी टॅप करा',
    pricingDataset: 'किंमत डेटासेट (140)',
    data: 'डेटा',
    realtimeStream: 'रिअल-टाइम स्ट्रीम',
    noRecentAlerts: 'कोणतेही नवीन अलर्ट नाहीत'
  },`,
  bn: `
    clickToSignIn: 'সাইন ইন করতে ক্লিক করুন',
    signIn: 'সাইন ইন',
    tapToAuthorize: 'অনুমোদন করতে ট্যাপ করুন',
    pricingDataset: 'মূল্য ডেটাসেট (১৪০)',
    data: 'ডেটা',
    realtimeStream: 'রিয়েল-টাইম স্ট্রিম',
    noRecentAlerts: 'কোনো সাম্প্রতিক সতর্কতা নেই'
  },`,
  te: `
    clickToSignIn: 'సైన్ ఇన్ చేయడానికి క్లిక్ చేయండి',
    signIn: 'సైన్ ఇన్',
    tapToAuthorize: 'అధికారం కోసం నొక్కండి',
    pricingDataset: 'ధరల డేటాసెట్ (140)',
    data: 'డేటా',
    realtimeStream: 'రియల్ టైమ్ స్ట్రీమ్',
    noRecentAlerts: 'ఇటీవలి హెచ్చరికలు లేవు'
  },`,
  ta: `
    clickToSignIn: 'உள்நுழைய கிளிக் செய்யவும்',
    signIn: 'உள்நுழைய',
    tapToAuthorize: 'அங்கீகரிக்க தட்டவும்',
    pricingDataset: 'விலை தரவுத்தொகுப்பு (140)',
    data: 'தரவு',
    realtimeStream: 'நிகழ்நேர ஸ்ட்ரீம்',
    noRecentAlerts: 'சமீபத்திய விழிப்பூட்டல்கள் இல்லை'
  },`
};

data = data.replace(/cat_Solar_Install_subtitle: 'Panel setup, inverter maintenance'\n  },/g, "cat_Solar_Install_subtitle: 'Panel setup, inverter maintenance'," + additionalKeys.en);
data = data.replace(/cat_Solar_Install_subtitle: 'पैनल सेटअप, इन्वर्टर रखरखाव'\n  },/g, "cat_Solar_Install_subtitle: 'पैनल सेटअप, इन्वर्टर रखरखाव'," + additionalKeys.hi);
data = data.replace(/cat_Solar_Install_subtitle: 'প্যানেল সেটআপ, ইনভার্টার রক্ষণাবেক্ষণ'\n  },/g, "cat_Solar_Install_subtitle: 'প্যানেল সেটআপ, ইনভার্টার রক্ষণাবেক্ষণ'," + additionalKeys.bn);
data = data.replace(/cat_Solar_Install_subtitle: 'पॅनेल सेटअप, इन्व्हर्टर देखभाल'\n  },/g, "cat_Solar_Install_subtitle: 'पॅनेल सेटअप, इन्व्हर्टर देखभाल'," + additionalKeys.mr);
data = data.replace(/cat_Solar_Install_subtitle: 'ప్యానెల్ సెటప్, ఇన్వర్టర్ నిర్వహణ'\n  },/g, "cat_Solar_Install_subtitle: 'ప్యానెల్ సెటప్, ఇన్వర్టర్ నిర్వహణ'," + additionalKeys.te);
data = data.replace(/cat_Solar_Install_subtitle: 'பேனல் அமைப்பு, இன்வெர்ட்டர் பராமரிப்பு'\n  },/g, "cat_Solar_Install_subtitle: 'பேனல் அமைப்பு, இன்வெர்ட்டர் பராமரிப்பு'," + additionalKeys.ta);

fs.writeFileSync('src/utils/i18n.ts', data);
console.log('Done additional header keys!');
