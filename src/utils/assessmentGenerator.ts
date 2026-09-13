import { AssessmentQuestion, AssessmentCategory, DifficultyLevel, QuestionTranslation } from '../types/assessment';
import { MULTILINGUAL_QUESTION_BANK } from '../data/multilingualQuestionBank';
import { SupportedLanguage } from './i18n';

// Comprehensive question repository generator for all trades
export function generateTop15AssessmentQuestions(field: string): AssessmentQuestion[] {
  const tradeKey = Object.keys(MULTILINGUAL_QUESTION_BANK).find(
    (k) => k.toLowerCase() === field.toLowerCase()
  ) || 'Plumbing';

  const baseBank = MULTILINGUAL_QUESTION_BANK[tradeKey] || MULTILINGUAL_QUESTION_BANK['Plumbing'];

  // Select 8 from bank (or clone with unique ids)
  const bankSubset: AssessmentQuestion[] = baseBank.slice(0, 8).map((q, idx) => ({
    ...q,
    id: `BK-${tradeKey.toUpperCase().slice(0, 3)}-BNK-${idx + 1}`,
    source: 'bank' as const,
  }));

  // Generate 7 specialized AI-simulated questions covering diverse categories to make exactly 15
  const aiGeneratedSubset: AssessmentQuestion[] = generateSupplementaryQuestions(tradeKey, 7);

  // Combine to exactly 15 questions
  const totalQuestions = [...bankSubset, ...aiGeneratedSubset].slice(0, 15);

  // Shuffle order so bank and AI questions are blended naturally
  return shuffleArray(totalQuestions);
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateSupplementaryQuestions(trade: string, count: number): AssessmentQuestion[] {
  const categories: AssessmentCategory[] = [
    'Safety',
    'Troubleshooting',
    'Decision Making',
    'Tools',
    'Quality',
    'Preventive Maintenance',
    'Technical Knowledge',
  ];

  const difficulties: DifficultyLevel[] = ['Easy', 'Medium', 'Hard', 'Medium', 'Easy', 'Hard', 'Medium'];

  const results: AssessmentQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const category = categories[i % categories.length];
    const difficulty = difficulties[i % difficulties.length];
    const qData = getTradeQuestionTemplate(trade, category, difficulty, i + 1);

    results.push({
      id: `BK-${trade.toUpperCase().slice(0, 3)}-AI-${i + 1}`,
      field: trade,
      category,
      skill_area: `${trade} ${category}`,
      difficulty,
      correctIndex: qData.correctIndex,
      source: 'ai', // NEVER exposed in the UI
      translations: qData.translations,
    });
  }

  return results;
}

interface QuestionTemplateResult {
  correctIndex: number;
  translations: Record<SupportedLanguage, QuestionTranslation>;
}

function getTradeQuestionTemplate(
  trade: string,
  category: AssessmentCategory,
  difficulty: DifficultyLevel,
  seq: number
): QuestionTemplateResult {
  if (trade.toLowerCase() === 'electrical') {
    return getElectricalTemplate(category, seq);
  }
  if (trade.toLowerCase() === 'carpentry') {
    return getCarpentryTemplate(category, seq);
  }
  if (trade.toLowerCase() === 'painting') {
    return getPaintingTemplate(category, seq);
  }
  if (trade.toLowerCase() === 'deep cleaning') {
    return getCleaningTemplate(category, seq);
  }
  if (trade.toLowerCase() === 'appliance repair') {
    return getApplianceTemplate(category, seq);
  }
  if (trade.toLowerCase() === 'masonry') {
    return getMasonryTemplate(category, seq);
  }
  if (trade.toLowerCase() === 'welding') {
    return getWeldingTemplate(category, seq);
  }
  return getPlumbingTemplate(category, seq);
}

function getPlumbingTemplate(category: AssessmentCategory, seq: number): QuestionTemplateResult {
  if (category === 'Troubleshooting') {
    return {
      correctIndex: 1,
      translations: {
        en: {
          question: 'A customer notices dampness and water staining on the wall behind their bathroom concealed mixer. What is the systematic step to locate the leak?',
          options: ['Demolish the entire tiled wall immediately', 'Perform a hydrostatic pressure test on hot/cold lines and inspect wall flanges & cartridge seating', 'Apply silicone sealant over external tile joints', 'Increase tank water level to test maximum pressure'],
          explanation: 'Targeted pressure isolation pinpoints cartridge or thread leakages without destructive tile demolition.'
        },
        hi: {
          question: 'बाथरूम कंसील्ड मिक्सर के पीछे दीवार पर सीलन आने पर रिसाव खोजने का सही तरीका क्या है?',
          options: ['पूरी दीवार के टाइल तोड़ दें', 'गर्म/ठंडी लाइन का हाइड्रोस्टेटिक प्रेशर टेस्ट करें और कार्ट्रिज सीटिंग जांचें', 'टाइल्स पर बाहर से सिलिकॉन लगाएं', 'टंकी में पानी भरकर दबाव बढ़ाएं'],
          explanation: 'प्रेशर टेस्ट और कार्ट्रिज जांच से बिना टाइल तोड़े सटीक रिसाव का पता चलता है।'
        },
        bn: {
          question: 'বাথরুমের মিক্সারের পিছনের দেওয়ালে ড্যাম্প হলে লিকেজ চিহ্নিত করার সঠিক উপায় কী?',
          options: ['দেওয়ালের সব টাইলস ভেঙে ফেলা', 'হাইড্রলিক প্রেশার টেস্ট করে কার্তুজ ও জয়েন্ট পরীক্ষা করা', 'বাইরে থেকে সিলিকন লাগানো', 'ট্যাঙ্কে অতিরিক্ত জল ভরা'],
          explanation: 'প্রেশার টেস্টের মাধ্যমে টাইলস না ভেঙে সঠিক স্থান চিহ্নিত করা যায়।'
        },
        mr: {
          question: 'बाथरूम मिक्सरच्या मागे भिंतीवर ओल आल्यास गळती शोधण्याचा योग्य मार्ग कोणता?',
          options: ['सर्व टाईल्स फोडणे', 'हायड्रोस्टॅटिक प्रेशर टेस्ट करून कार्ट्रिज व थ्रेड जॉईंट तपासणे', 'बाहेरून सिलिकॉन लावणे', 'टाकीचा दाब वाढवणे'],
          explanation: 'प्रेशर टेस्टिंगद्वारे टाईल्सचे नुकसान न करता गळती शोधता येते.'
        },
        te: {
          question: 'కన్సీల్డ్ మిక్సర్ వెనుక గోడపై తడి ఏర్పడితే లీకేజీని గుర్తించే సరైన పద్ధతి ఏమిటి?',
          options: ['టైల్స్ మొత్తం పగలగొట్టడం', 'హైడ్రోస్టాటిక్ ప్రెజర్ టెస్ట్ నిర్వహించి కార్ట్రిడ్జ్ పరిశీలించడం', 'పైనుండి సిలికాన్ పూయడం', 'నీటి స్థాయిని పెంచడం'],
          explanation: 'ప్రెజర్ టెస్టింగ్ టైల్స్‌ను పగలగొట్టకుండా లీక్‌ను గుర్తిస్తుంది.'
        },
        ta: {
          question: 'குளியலறை மிக்சர் வால்வுக்குப் பின்னால் ஈரம் கசிந்தால் அதைக் கண்டறியும் சரியான முறை எது?',
          options: ['டைல்ஸை முழுமையாக உடைப்பது', 'ஹைட்ரோஸ்டேடிக் பிரஷர் சோதனை செய்து கார்ட்ரிட்ஜை சரிபார்ப்பது', 'வெளியில் சிலிகான் பூசுவது', 'தொட்டி நீரை அதிகரிப்பது'],
          explanation: 'பிரஷர் சோதனை மூலம் டைல்ஸை சேதப்படுத்தாமல் கசிவை துல்லியமாக கண்டறியலாம்.'
        },
        gu: {
          question: 'બાથરૂમ મિક્સર પાછળ દિવાલ પર ભેજ આવતો હોય તો લીકેજ શોધવાની યોગ્ય રીત કઈ છે?',
          options: ['બધી ટાઇલ્સ તોડી નાખવી', 'પ્રેશર ટેસ્ટ કરીને કાર્ટ્રિજ અને જોઇન્ટ તપાસવા', 'બહારથી સિલિકોન લગાવવું', 'ટાંકીમાં પાણી વધારવું'],
          explanation: 'પ્રેશર ટેસ્ટથી ટાઇલ્સ તોડ્યા વગર સચોટ લીકેજ પકડાય છે.'
        },
        ur: {
          question: 'باتھ روم مکسر کے پیچھے دیوار پر نمی آنے کی صورت میں لیکیج تلاش کرنے کا درست طریقہ کیا ہے؟',
          options: ['پوری دیوار توڑ دیں', 'پریشر ٹیسٹ کریں اور کارٹریج کی سیٹنگ چیک کریں', 'باہر سے سلیکان لگائیں', 'پانی کا پریشر بڑھائیں'],
          explanation: 'پریشر ٹیسٹ کے ذریعے ٹائلز توڑے بغیر درست لیکیج تلاش کی جا سکتی ہے۔'
        },
        kn: {
          question: 'ಬಾತ್‌ರೂಮ್ ಮಿಕ್ಸರ್ ಹಿಂಭಾಗದ ಗೋಡೆಯಲ್ಲಿ ತೇವಾಂಶ ಕಂಡರೆ ಸೋರಿಕೆಯನ್ನು ಪತ್ತೆಹಚ್ಚುವ ಸರಿಯಾದ ವಿಧಾನ ಯಾವುದು?',
          options: ['ಟೈಲ್ಸ್‌ಗಳನ್ನು ಒಡೆಯುವುದು', 'ಪ್ರೆಶರ್ ಟೆಸ್ಟ್ ನಡೆಸಿ ಕಾರ್ಟ್ರಿಡ್ಜ್ ಮತ್ತು ಜಾಯಿಂಟ್ ಪರೀಕ್ಷಿಸುವುದು', 'ಹೊರಗಿನಿಂದ ಸಿಲಿಕಾನ್ ಹಚ್ಚುವುದು', 'ನೀರಿನ ಮಟ್ಟ ಹೆಚ್ಚಿಸುವುದು'],
          explanation: 'ಪ್ರೆಶರ್ ಟೆಸ್ಟಿಂಗ್ ಮೂಲಕ ಟೈಲ್ಸ್ ಹಾನಿಯಾಗದಂತೆ ಸೋರಿಕೆ ಪತ್ತೆಹಚ್ಚಬಹುದು.'
        },
        or: {
          question: 'ବାଥରୁମ୍ ମିକ୍ସର୍ ପଛରେ ଓଦା ଦାଗ ଦେଖାଗଲେ ଲିକ୍ ଖୋଜିବାର ଉପାୟ କ’ଣ?',
          options: ['ଟାଇଲ୍ସ ଭାଙ୍ଗିବା', 'ପ୍ରେସର୍ ଟେଷ୍ଟ୍ କରି କାର୍ଟ୍ରିଜ୍ ଯାଞ୍ଚ କରିବା', 'ବାହାରୁ ସିଲିକନ୍ ଲଗାଇବା', 'ଟାଙ୍କି ପାଣି ବଢ଼ାଇବା'],
          explanation: 'ପ୍ରେସର୍ ଟେଷ୍ଟ୍ ଦ୍ୱାରା ଟାଇଲ୍ସ ନଭାଙ୍ଗି ଲିକ୍ ଚିହ୍ନଟ ହୁଏ।'
        },
        ml: {
          question: 'ബാത്ത്റൂം മിക്സറിന് പിന്നിലെ ഭിത്തിയിൽ ഈർപ്പം കാണുമ്പോൾ ചോർച്ച കണ്ടെത്താനുള്ള ശരിയായ രീതി ഏതാണ്?',
          options: ['ടൈലുകൾ പൂർണ്ണമായി പൊളിക്കുക', 'പ്രഷർ ടെസ്റ്റ് നടത്തി കാർട്രിഡ്ജും ജോയിന്റും പരിശോധിക്കുക', 'പുറത്ത് സിലിക്കൺ പുരട്ടുക', 'ടാങ്കിലെ വെള്ളം കൂട്ടുക'],
          explanation: 'പ്രഷർ ടെസ്റ്റിംഗ് വഴി ടൈലുകൾ പൊളിക്കാതെ കൃത്യമായ ചോർച്ച കണ്ടെത്താം.'
        }
      }
    };
  }

  // General safety / quality fallback for plumbing
  return {
    correctIndex: 2,
    translations: {
      en: {
        question: `When installing an automatic pressure relief valve (PRV) on a storage geyser, where must the discharge pipe be directed?`,
        options: ['Directly into electrical switchboard conduit', 'Sealed tightly with a threaded metal end cap', 'Safely downward toward an open drain or gully trap', 'Looped backward into the cold water inlet'],
        explanation: 'PRV discharge lines must exit freely downwards to an open drain to avoid hot water scald hazards.'
      },
      hi: {
        question: `गीजर पर प्रेशर रिलीफ वाल्व (PRV) लगाते समय डिस्चार्ज पाइप का रुख कहाँ होना चाहिए?`,
        options: ['बिजली के स्विचबोर्ड की तरफ', 'धातु के कैप से कसकर बंद करें', 'सुरक्षित रूप से नीचे खुले नाले या ड्रेन की तरफ', 'वापस ठंडे पानी के इनलेट में'],
        explanation: 'PRV डिस्चार्ज पाइप को खुले ड्रेन की तरफ रखना चाहिए ताकि गर्म भाप या पानी से कोई दुर्घटना न हो।'
      },
      bn: {
        question: `গিজারের প্রেশার রিলিফ ভালভ (PRV) পাইপের মুখ কোন দিকে থাকা উচিত?`,
        options: ['সুইচবোর্ডের দিকে', 'মুখ বন্ধ করে রাখা', 'নিরাপদে নিচের খোলা ড্রেনের দিকে', 'ঠান্ডা জলের পাইপে'],
        explanation: 'গরম জল বা বাষ্পের দুর্ঘটনা রোধে পাইপ খোলা ড্রেনের দিকে রাখা আবশ্যক।'
      },
      mr: {
        question: `गीझरच्या प्रेशर रिलीफ व्हॉल्व्हचा (PRV) डिस्चार्ज पाईप कुठे सोडला पाहिजे?`,
        options: ['इलेक्ट्रिक बोर्डकडे', 'टोपण लावून बंद करणे', 'सुरक्षितपणे खाली उघड्या ड्रेनेजकडे', 'थंड पाण्याच्या इनलेटमध्ये'],
        explanation: 'गरम पाण्याच्या अपघातापासून संरक्षणासाठी डिस्चार्ज पाईप ड्रेनकडे असणे आवश्यक आहे.'
      },
      te: {
        question: `గీజర్ యొక్క ప్రెజర్ రిలీఫ్ వాల్వ్ (PRV) పైప్ ఎటువైపు ఉండాలి?`,
        options: ['స్విచ్ బోర్డు వైపు', 'మూసివేయడం', 'సురక్షితంగా క్రింది డ్రైనేజ్ వైపు', 'చల్లటి నీటి పైపులోకి'],
        explanation: 'వేడి నీటి ప్రమాదాలను నివారించడానికి పైప్ డ్రైన్ వైపు ఉండాలి.'
      },
      ta: {
        question: `கீசரின் பிரஷர் ரிலீஃப் வால்வு (PRV) குழாயின் முனை எங்கு திருப்பப்பட வேண்டும்?`,
        options: ['மின்சார போர்டை நோக்கி', 'மூடி வைப்பது', 'பாதுகாப்பாக கீழ்நோக்கி வடிகால் நோக்கி', 'குளிர்ந்த நீர் குழாயில்'],
        explanation: 'சூடான நீரால் விபத்து ஏற்படாமல் இருக்க குழாய் வடிகால் நோக்கி இருக்க வேண்டும்.'
      },
      gu: {
        question: `ગીઝરના પ્રેશર રિલીફ વાલ્વ (PRV) ની પાઇપ ક્યાં હોવી જોઈએ?`,
        options: ['સ્વીચબોર્ડ તરફ', 'કેપ લગાવી બંધ કરવી', 'સુરક્ષિત રીતે નીચે ખુલ્લી ગટર તરફ', 'ઠંડા પાણીની પાઇપમાં'],
        explanation: 'ગરમ પાણીથી અકસ્માત ન થાય તે માટે પાઇપ ડ્રેઇન તરફ રાખવી જરૂરી છે.'
      },
      ur: {
        question: `گیزر کے پریشر ریلیف والو (PRV) کا پائپ کس طرف ہونا چاہیے؟`,
        options: ['سوئچ بورڈ کی طرف', 'ڈھکن لگا کر بند کرنا', 'محفوظ طریقے سے نیچے کھلے ڈرین کی طرف', 'ٹھنڈے پانی کے پائپ میں'],
        explanation: 'گرم پانی کے حادثات سے بچنے کے لیے ڈرین کی طرف ہونا ضروری ہے۔'
      },
      kn: {
        question: `ಗೀಸರ್‌ನ ಪ್ರೆಶರ್ ರಿಲೀಫ್ ವಾಲ್ವ್ (PRV) ಪೈಪ್ ಯಾವ ದಿಕ್ಕಿನಲ್ಲಿರಬೇಕು?`,
        options: ['ಸ್ವಿಚ್ ಬೋರ್ಡ್ ಕಡೆಗೆ', 'ಮುಚ್ಚಳ ಹಾಕಿ ಮುಚ್ಚುವುದು', 'ಸುರಕ್ಷಿತವಾಗಿ ಕೆಳಗೆ ತೆರೆದ ಡ್ರೈನ್‌ಗೆ', 'ತಣ್ಣೀರು ಪೈಪ್‌ಗೆ'],
        explanation: 'ಬಿಸಿ ನೀರಿನ ಅಪಘಾತ ತಡೆಯಲು ಪೈಪ್ ಡ್ರೈನ್ ಕಡೆಗೆ ಇರಬೇಕು.'
      },
      or: {
        question: `ଗିଜର୍ର ପ୍ରେସର୍ ରିଲିଫ୍ ଭାଲ୍ଭ (PRV) ପାଇପ୍ କେଉଁଠି ରହିବା ଉଚିତ୍?`,
        options: ['ସୁଇଚ୍ ବୋର୍ଡ ଆଡ଼କୁ', 'ବନ୍ଦ ରଖିବା', 'ତଳେ ଖୋଲା ଡ୍ରେନ୍ ଆଡ଼କୁ', 'ଥଣ୍ଡା ପାଣି ପାଇପ୍ରେ'],
        explanation: 'ଦୁର୍ଘଟଣା ରୋକିବା ପାଇଁ ଡ୍ରେନ୍ ଆଡ଼କୁ ରହିବା ଦରକାର।'
      },
      ml: {
        question: `ഗീസറിന്റെ പ്രഷർ റിലീഫ് വാൽവ് (PRV) പൈപ്പ് ഏത് ഭാഗത്തേക്ക് തിരിച്ചു വെക്കണം?`,
        options: ['സ്വിച്ച് ബോർഡിലേക്ക്', 'അടച്ചു വെക്കുക', 'സുരക്ഷിതമായി താഴേക്ക് ഡ്രെയിനിലേക്ക്', 'തണുത്ത വെള്ളത്തിന്റെ പൈപ്പിലേക്ക്'],
        explanation: 'ചൂടുവെള്ള അപകടങ്ങൾ ഒഴിവാക്കാൻ പൈപ്പ് ഡ്രെയിനിലേക്ക് തിരിച്ചു വെക്കണം.'
      }
    }
  };
}

function getElectricalTemplate(category: AssessmentCategory, seq: number): QuestionTemplateResult {
  return {
    correctIndex: 1,
    translations: {
      en: {
        question: 'What is the primary technical function of a 30mA Residual Current Circuit Breaker (RCCB / ELCB) in a residential consumer panel?',
        options: ['To limit peak energy consumption units', 'To trip instantly upon detecting current leakage to ground and protect human life from fatal electrocution', 'To boost solar panel voltage output', 'To convert single-phase into three-phase'],
        explanation: 'A 30mA RCCB detects millampere imbalances between live and neutral to disconnect the supply within 30ms.'
      },
      hi: {
        question: 'घरेलू पैनल में 30mA RCCB / ELCB का मुख्य तकनीकी कार्य क्या है?',
        options: ['बिजली की यूनिट खपत कम करना', 'अर्थ लीकेज करंट पकड़कर तुरंत ट्रिप होना और मानव जीवन को करंट से बचाना', 'सोलर वोल्टेज बढ़ाना', 'सिंगल फेज को थ्री फेज में बदलना'],
        explanation: '30mA RCCB करंट लीकेज होने पर 30 मिलीसेकंड में बिजली काट देती है जिससे जान बचती है।'
      },
      bn: {
        question: 'বাড়ির প্যানেলে 30mA RCCB এর মূল কাজ কী?',
        options: ['বিদ্যুৎ খরচ কমানো', 'কারেন্ট লিকেজ সনাক্ত করে ট্রিপ করা এবং প্রাণঘাতী শক থেকে রক্ষা করা', 'ভোল্টেজ বাড়ানো', 'ফেজ পরিবর্তন করা'],
        explanation: 'RCCB কারেন্ট লিকেজ রোধ করে মানবজীবন রক্ষা করে।'
      },
      mr: {
        question: 'घरातील वायरिंगमध्ये ३०mA RCCB / ELCB चे मुख्य कार्य कोणते?',
        options: ['वीज बिल कमी करणे', 'अर्थ लीकेज होताच वीज खंडित करून मानवी जीविताचे रक्षण करणे', 'व्होल्टेज वाढवणे', 'फेज बदलणे'],
        explanation: 'RCCB करंट लीक होताच वीज बंद करून विजेच्या धक्क्यापासून जीव वाचवते.'
      },
      te: {
        question: 'గృహాలలో 30mA RCCB యొక్క ముఖ్యమైన విధి ఏమిటి?',
        options: ['కరెంట్ బిల్లు తగ్గించడం', 'కరెంట్ లీకేజీని గుర్తించి వెంటనే ట్రిప్ అవ్వడం ద్వారా ప్రాణాలను రక్షించడం', 'వోల్టేజ్ పెంచడం', 'ఫేజ్ మార్చడం'],
        explanation: 'RCCB లీకేజ్ కరెంట్‌ను ఆపి షాక్ నుండి కాపాడుతుంది.'
      },
      ta: {
        question: 'வீட்டு மின் இணைப்பில் 30mA RCCB-ன் முக்கிய பணி என்ன?',
        options: ['மின் நுகர்வைக் குறைப்பது', 'மின்கசிவு ஏற்பட்டால் உடனே இணைப்பைத் துண்டித்து மனித உயிர்களைப் பாதுகாப்பது', 'மின்னழுத்தத்தை அதிகரிப்பது', 'பேஸ் மாற்றுவது'],
        explanation: 'RCCB மின்கசிவு ஆபத்திலிருந்து மக்களைப் பாதுகாக்கிறது.'
      },
      gu: {
        question: 'ઘરના વાયરિંગમાં 30mA RCCB નું મુખ્ય કાર્ય શું છે?',
        options: ['વીજળી બિલ ઘટાડવું', 'કરંટ લીકેજ થતાં જ ટ્રીપ થઈને જીવ બચાવવો', 'વોલ્ટેજ વધારવો', 'ફેઝ બદલવો'],
        explanation: 'RCCB કરંટ લીક થતાં જ પાવર બંધ કરીને શોકથી બચાવે છે.'
      },
      ur: {
        question: 'گھر کے پینل میں 30mA آر سی سی بی (RCCB) کا بنیادی کام کیا ہے؟',
        options: ['بجلی کا بل کم کرنا', 'کرنٹ لیک ہونے پر فوری ٹرپ ہو کر انسانی جان کی حفاظت کرنا', 'وولٹیج بڑھانا', 'فیز تبدیل کرنا'],
        explanation: 'آر سی سی بی کرنٹ لیکج پر فوری بجلی کاٹ کر انسانی جان بچاتا ہے۔'
      },
      kn: {
        question: 'ಮನೆಯ ವೈರಿಂಗ್‌ನಲ್ಲಿ 30mA RCCB ನ ಮುಖ್ಯ ಕಾರ್ಯವೇನು?',
        options: ['ವಿದ್ಯುತ್ ಬಿಲ್ ಕಡಿಮೆ ಮಾಡುವುದು', 'ವಿದ್ಯುತ್ ಸೋರಿಕೆ ಪತ್ತೆಯಾದಾಗ ಟ್ರಿಪ್ ಆಗಿ ಮಾನವ ಜೀವ ರಕ್ಷಿಸುವುದು', 'ವೋಲ್ಟೇಜ್ ಹೆಚ್ಚಿಸುವುದು', 'ಹಂತ ಬದಲಾಯಿಸುವುದು'],
        explanation: 'RCCB ವಿದ್ಯುತ್ ಸೋರಿಕೆಯಿಂದ ಜನರನ್ನು ರಕ್ಷಿಸುತ್ತದೆ.'
      },
      or: {
        question: 'ଘରର ଇଲେକ୍ଟ୍ରିକ୍ ବୋର୍ଡରେ 30mA RCCB ର ମୁଖ୍ୟ କାର୍ଯ୍ୟ କ’ଣ?',
        options: ['ବିଲ୍ କମାଇବା', 'କରେଣ୍ଟ ଲିକ୍ ହେଲେ ତୁରନ୍ତ ଟ୍ରିପ୍ ହୋଇ ଜୀବନ ରକ୍ଷା କରିବା', 'ଭୋଲ୍ଟେଜ୍ ବଢ଼ାଇବା', 'ଫେଜ୍ ବଦଳାଇବା'],
        explanation: 'RCCB କରେଣ୍ଟ ଲିକ୍ ରୋକି ବିଦ୍ୟୁତ୍ ଆଘାତରୁ ରକ୍ଷା କରେ।'
      },
      ml: {
        question: '30mA RCCB യുടെ പ്രധാന പ്രവർത്തനം എന്താണ്?',
        options: ['വൈദ്യുതി ഉപഭോഗം കുറയ്ക്കുക', 'കറന്റ് ചോർച്ചയുണ്ടായാൽ ട്രിപ്പ് ചെയ്ത് ജീവൻ രക്ഷിക്കുക', 'വോൾട്ടേജ് കൂട്ടുക', 'ഫേസ് മാറ്റുക'],
        explanation: 'RCCB കറന്റ് ചോർച്ച കണ്ടെത്തി ഉടൻ പവർ ഓഫ് ചെയ്യുന്നു.'
      }
    }
  };
}

function getCarpentryTemplate(category: AssessmentCategory, seq: number): QuestionTemplateResult {
  return {
    correctIndex: 0,
    translations: {
      en: {
        question: 'Which grade of plywood is mandatory for kitchen under-sink cabinets and bathroom vanities exposed to water splashes?',
        options: ['BWP / BWR Grade (Boiling Water Proof / Resistant IS:710)', 'Commercial MR Grade (Moisture Resistant IS:303)', 'Unsealed Particle Board', 'MDF Interior Grade'],
        explanation: 'BWP marine plywood uses phenol formaldehyde synthetic resin to withstand prolonged boiling water and moisture without delamination.'
      },
      hi: {
        question: 'रसोई के सिंक के नीचे और बाथरूम वैनिटी के लिए कौन सा प्लाईवुड अनिवार्य है?',
        options: ['BWP / BWR ग्रेड (बॉयलिंग वाटर प्रूफ IS:710)', 'साधारण एमआर कमर्शियल ग्रेड', 'अनसील्ड पार्टिकल बोर्ड', 'एमडीएफ इंटीरियर ग्रेड'],
        explanation: 'BWP मरीन प्लाईवुड पानी और नमी में सड़ता नहीं है और लंबे समय तक टिका रहता है।'
      },
      bn: {
        question: 'রান্নাঘরের সিঙ্কের নিচে কোন প্লাইউড ব্যবহার করা বাধ্যতামূলক?',
        options: ['BWP / BWR গ্রেড (Boiling Water Proof)', 'বাণিজ্যিক MR গ্রেড', 'পার্টিকেল বোর্ড', 'এমডিএফ বোর্ড'],
        explanation: 'BWP প্লাইউড জল ও আর্দ্রতা প্রতিরোধী।'
      },
      mr: {
        question: 'स्वयंपाकघरातील सिंकखालील कॅबिनेटसाठी कोणत्या प्रकारची प्लायवूड आवश्यक आहे?',
        options: ['BWP / BWR ग्रेड (वॉटरप्रूफ मरीन प्लाय)', 'साधारण कमर्शियल एमआर प्लाय', 'पार्टिकल बोर्ड', 'एमडीएफ बोर्ड'],
        explanation: 'BWP मरीन प्लायवूड पाण्यामुळे खराब होत नाही व मजबूत राहते.'
      },
      te: {
        question: 'కిచెన్ సింక్ క్రింద క్యాబినెట్లకు ఏ ప్లైవుడ్ గ్రేడ్ తప్పనిసరి?',
        options: ['BWP / BWR గ్రేడ్ (మరైన్ వాటర్‌ప్రూఫ్)', 'కమర్షియల్ MR గ్రేడ్', 'పార్టికల్ బోర్డ్', 'MDF బోర్డ్'],
        explanation: 'BWP ప్లైవుడ్ నీటి తేమను తట్టుకుంటుంది.'
      },
      ta: {
        question: 'சமையலறை சிங்க் கீழ் உள்ள பெட்டிகளுக்கு எந்த பிளைவுட் சிறந்தது?',
        options: ['BWP / BWR கிரேடு (மரைன் வாட்டர்ப்ரூஃப்)', 'MR கிரேடு', 'பார்டிகல் போர்டு', 'MDF போர்டு'],
        explanation: 'BWP பிளைவுட் நீர் மற்றும் ஈரப்பதத்தை தாங்கும்.'
      },
      gu: {
        question: 'રસોડાના સિંક નીચે કયા પ્રકારનું પ્લાયવુડ વાપરવું જોઈએ?',
        options: ['BWP / BWR ગ્રેડ (વોટરપ્રૂફ મરીન પ્લાય)', 'સામાન્ય MR ગ્રેડ', 'પાર્ટિકલ બોર્ડ', 'MDF બોર્ડ'],
        explanation: 'BWP પ્લાયવુડ પાણીથી ફૂલતું નથી અને ટકી રહે છે.'
      },
      ur: {
        question: 'کچن سنک کے نیچے کیبنٹ کے لیے کون سا پلائی ووڈ لازمی ہے؟',
        options: ['BWP / BWR گریڈ (واٹر پروف میرین پلائی)', 'عام کمرشل ایم آر گریڈ', 'پارٹیکل بورڈ', 'ایم ڈی ایف بورڈ'],
        explanation: 'بی ڈبلیو پی پلائی ووڈ پانی اور نمی سے خراب نہیں ہوتا۔'
      },
      kn: {
        question: 'ಕಿಚನ್ ಸಿಂಕ್ ಕೆಳಗಿನ ಕ್ಯಾಬಿನೆಟ್‌ಗೆ ಯಾವ ಪ್ಲೈವುಡ್ ಸೂಕ್ತ?',
        options: ['BWP / BWR ಗ್ರೇಡ್ (ಮರೈನ್ ವಾಟರ್‌ಪ್ರೂಫ್)', 'ಕಮರ್ಷಿಯಲ್ MR ಗ್ರೇಡ್', 'ಪಾರ್ಟಿಕಲ್ ಬೋರ್ಡ್', 'MDF ಬೋರ್ಡ್'],
        explanation: 'BWP ಪ್ಲೈವುಡ್ ನೀರು ಮತ್ತು ತೇವಾಂಶವನ್ನು ತಡೆದುಕೊಳ್ಳುತ್ತದೆ.'
      },
      or: {
        question: 'ରୋଷେଇ ଘର ସିଙ୍କ୍ ତଳେ କେଉଁ ପ୍ଲାଇଉଡ୍ ବ୍ୟବହାର କରିବା ଉଚିତ୍?',
        options: ['BWP / BWR ଗ୍ରେଡ୍ (ୱାଟରପ୍ରୁଫ୍)', 'କମର୍ସିଆଲ୍ MR ଗ୍ରେଡ୍', 'ପାର୍ଟିକଲ୍ ବୋର୍ଡ', 'MDF ବୋର୍ଡ'],
        explanation: 'BWP ପ୍ଲାଇଉଡ୍ ପାଣିରେ ନଷ୍ଟ ହୁଏ ନାହିଁ।'
      },
      ml: {
        question: 'അടുക്കള സിങ്കിന് താഴെയുള്ള കാബിനറ്റുകൾക്ക് ഏത് പ്ലൈവുഡ് ആണ് നിർബന്ധം?',
        options: ['BWP / BWR ഗ്രേഡ് (വാട്ടർപ്രൂഫ്)', 'കൊമേഴ്സ്യൽ MR ഗ്രേഡ്', 'പാർട്ടിക്കിൾ ബോർഡ്', 'MDF ബോർഡ്'],
        explanation: 'BWP പ്ലൈവുഡ് ഈർപ്പത്തെയും വെള്ളത്തെയും പ്രതിരോധിക്കുന്നു.'
      }
    }
  };
}

function getPaintingTemplate(category: AssessmentCategory, seq: number): QuestionTemplateResult {
  return {
    correctIndex: 1,
    translations: {
      en: {
        question: 'Before applying two coats of premium interior acrylic emulsion paint on a freshly plastered wall, what is the mandatory surface preparation sequence?',
        options: ['Direct paint application with roller', 'Sanding -> Acrylic Primer -> 2 coats Wall Putty -> Fine Sanding -> Primer Coat', 'Wash with concentrated sulphuric acid', 'Apply exterior cement paint base'],
        explanation: 'Proper putty leveling and priming guarantees optimal paint adhesion, sheen uniformity, and prevents flaking.'
      },
      hi: {
        question: 'नए प्लास्टर वाली दीवार पर इमल्शन पेंट लगाने से पहले सतह तैयार करने का सही क्रम क्या है?',
        options: ['सीधे रोलर से पेंट लगाना', 'रेगमाल घिसाई -> प्राइमर -> 2 कोट वॉल पुट्टी -> बारीक सैंडिंग -> प्राइमर कोट', 'सल्फ्यूरिक एसिड से धोना', 'सीमेंट पेंट लगाना'],
        explanation: 'पुट्टी और प्राइमर लगाने से दीवार चिकनी होती है और पेंट सालों-साल नहीं छूटता।'
      },
      bn: {
        question: 'নতুন দেওয়ালে পেইন্ট করার সঠিক ক্রম কী?',
        options: ['সরাসরি রং করা', 'স্যান্ডিং -> প্রাইমার -> ২ কোট পুট্টি -> ফাইন স্যান্ডিং -> প্রাইমার', 'অ্যাসিড দিয়ে ধোয়া', 'সিমেন্ট পেইন্ট দেওয়া'],
        explanation: 'পুট্টি ও প্রাইমার রঙের স্থায়িত্ব বাড়ায়।'
      },
      mr: {
        question: 'नवीन प्लास्टर केलेल्या भिंतीवर पेंट लावण्याचा योग्य क्रम कोणता?',
        options: ['थेट पेंट मारणे', 'घासणे -> प्रायमर -> २ हात वॉल पुट्टी -> बारीक सँडिंग -> प्रायमर कोट', 'अॅसिडने धुणे', 'सिमेंट पेंट मारणे'],
        explanation: 'पुट्टी व प्रायमरमुळे पेंटला उत्कृष्ट फिनिशिंग मिळते व तो टिकतो.'
      },
      te: {
        question: 'కొత్త గోడపై పెయింట్ వేయడానికి సరైన క్రమం ఏమిటి?',
        options: ['నేరుగా పెయింట్ వేయడం', 'శాండింగ్ -> ప్రైమర్ -> 2 కోట్లు పుట్టీ -> ఫైన్ శాండింగ్ -> ప్రైమర్ కోట్', 'యాసిడ్‌తో కడగడం', 'సిమెంట్ పెయింట్ వేయడం'],
        explanation: 'పుట్టీ మరియు ప్రైమర్ పెయింట్‌కు దీర్ఘకాల మన్నికను ఇస్తాయి.'
      },
      ta: {
        question: 'புதிய சுவரில் பெயிண்ட் அடிப்பதற்கான சரியான படிநிலை எது?',
        options: ['நேரடியாக பெயிண்ட் அடிப்பது', 'தேய்த்தல் -> பிரைமர் -> 2 கோட் புட்டி -> நுண் தேய்த்தல் -> பிரைமர்', 'அமிலத்தால் கழுவுவது', 'சிமெண்ட் பெயிண்ட் அடிப்பது'],
        explanation: 'புட்டி மற்றும் பிரைமர் பூச்சு பெயிண்டின் ஆயுளை அதிகரிக்கும்.'
      },
      gu: {
        question: 'નવી દિવાલ પર પેઇન્ટ કરવાનો સાચો ક્રમ કયો છે?',
        options: ['સીધો પેઇન્ટ કરવો', 'ઘસવું -> પ્રાઇમર -> 2 કોટ વોલ પુટ્ટી -> બારીક સેન્ડિંગ -> પ્રાઇમર કોટ', 'એસિડથી ધોવું', 'સિમેન્ટ પેઇન્ટ કરવો'],
        explanation: 'પુટ્ટી અને પ્રાઇમરથી પેઇન્ટનું ફિનિશિંગ શ્રેષ્ઠ બને છે.'
      },
      ur: {
        question: 'نئی دیوار پر پینٹ کرنے کا صحیح طریقہ کیا ہے؟',
        options: ['براہ راست پینٹ لگانا', 'گھسائی -> پرائمر -> 2 کوٹ وال پٹی -> باریک سینڈنگ -> پرائمر', 'تیزاب سے دھونا', 'سیمنٹ پینٹ لگانا'],
        explanation: 'پٹی اور پرائمر سے پینٹ کی مضبوطی اور خوبصورتی برقرار رہتی ہے۔'
      },
      kn: {
        question: 'ಹೊಸ ಗೋಡೆಗೆ ಪೇಂಟ್ ಮಾಡುವ ಸರಿಯಾದ ಹಂತಗಳು ಯಾವುವು?',
        options: ['ನೇರವಾಗಿ ಪೇಂಟ್ ಮಾಡುವುದು', 'ಸ್ಯಾಂಡಿಂಗ್ -> ಪ್ರೈಮರ್ -> 2 ಕೋಟ್ ಪುಟ್ಟಿ -> ನಯವಾದ ಸ್ಯಾಂಡಿಂಗ್ -> ಪ್ರೈಮರ್', 'ಆಸಿಡ್‌ನಿಂದ ತೊಳೆಯುವುದು', 'ಸಿಮೆಂಟ್ ಪೇಂಟ್ ಮಾಡುವುದು'],
        explanation: 'ಪುಟ್ಟಿ ಮತ್ತು ಪ್ರೈಮರ್ ಪೇಂಟ್ ಬಾಳಿಕೆಯನ್ನು ಹೆಚ್ಚಿಸುತ್ತವೆ.'
      },
      or: {
        question: 'ନୂଆ କାନ୍ଥରେ ରଙ୍ଗ କରିବାର ସଠିକ୍ ପଦ୍ଧତି କ’ଣ?',
        options: ['ସିଧାସଳଖ ରଙ୍ଗ କରିବା', 'ପଲିସ୍ -> ପ୍ରାଇମର୍ -> ୨ କୋଟ୍ ପୁଟି -> ସୂକ୍ଷ୍ମ ପଲିସ୍ -> ପ୍ରାଇମର୍', 'ଏସିଡ୍ ରେ ଧୋଇବା', 'ସିମେଣ୍ଟ ରଙ୍ଗ ମାରିବା'],
        explanation: 'ପୁଟି ଓ ପ୍ରାଇମର୍ ରଙ୍ଗର ଆୟୁଷ ବଢ଼ାଇଥାଏ।'
      },
      ml: {
        question: 'പുതിയ ഭിത്തിയിൽ പെയിന്റ് ചെയ്യുന്നതിന്റെ ശരിയായ രീതി എന്താണ്?',
        options: ['നേരിട്ട് പെയിന്റ് ചെയ്യുക', 'സാൻഡിംഗ് -> പ്രൈമർ -> 2 കോട്ട് പുട്ടി -> ഫൈൻ സാൻഡിംഗ് -> പ്രൈമർ', 'ആസിഡ് ഉപയോഗിച്ച് കഴുകുക', 'സിമന്റ് പെയിന്റ് അടിക്കുക'],
        explanation: 'പുട്ടിയും പ്രൈമറും പെയിന്റിന് ഈട് നൽകുന്നു.'
      }
    }
  };
}

function getCleaningTemplate(category: AssessmentCategory, seq: number): QuestionTemplateResult {
  return {
    correctIndex: 2,
    translations: {
      en: {
        question: 'Which cleaning solution is safest for removing hard water mineral scaling on natural Italian marble or granite without causing permanent etching or dullness?',
        options: ['Concentrated hydrochloric toilet acid', 'Caustic soda flakes', 'pH-neutral specialized descaling cleaner / stone safe detergent', 'Bleaching powder paste'],
        explanation: 'Strong acids dissolve calcium carbonate in marble causing irreversible etching; pH-neutral stone detergents clean safely.'
      },
      hi: {
        question: 'इटैलियन मार्बल या ग्रेनाइट पर से खारे पानी के दाग हटाने के लिए कौन सा क्लीनर सुरक्षित है?',
        options: ['तेज़ाब (हाइड्रोक्लोरिक एसिड)', 'कास्टिक सोडा', 'pH-न्यूट्रल मार्बल सेफ क्लीनर', 'ब्लीचिंग पाउडर पेस्ट'],
        explanation: 'तेज़ाब से मार्बल की चमक हमेशा के लिए खत्म हो जाती है, इसलिए pH-न्यूट्रल क्लीनर का उपयोग करना चाहिए।'
      },
      bn: {
        question: 'ইতালীয় মার্বেলের দাগ তুলতে কোন ক্লিনার নিরাপদ?',
        options: ['টয়লেট অ্যাসিড', 'কস্টিক সোডা', 'pH-নিউট্রাল মার্বেল ক্লিনার', 'ব্লিচিং পাউডার'],
        explanation: 'pH-নিউট্রাল ক্লিনার মার্বেলের ক্ষতি না করে দাগ পরিষ্কার করে।'
      },
      mr: {
        question: 'मार्बल किंवा ग्रॅनाईटवरील पाण्याचे डाग काढण्यासाठी कोणते क्लिनर सुरक्षित आहे?',
        options: ['हायड्रोक्लोरिक अॅसिड', 'कॉस्टिक सोडा', 'pH-न्यूट्रल मार्बल सेफ क्लिनर', 'ब्लिचिंग पावडर'],
        explanation: 'अॅसिडमुळे मार्बलची चकाकी नष्ट होते, म्हणून pH-न्यूट्रल क्लिनर वापरावे.'
      },
      te: {
        question: 'మార్బుల్ లేదా గ్రానైట్ మరకలను తొలగించడానికి ఏ క్లీనర్ సురక్షితమైనది?',
        options: ['యాసిడ్', 'కాస్టిక్ సోడా', 'pH-న్యూట్రల్ మార్బుల్ క్లీనర్', 'బ్లీచింగ్ పౌడర్'],
        explanation: 'pH-న్యూట్రల్ క్లీనర్ మార్బుల్‌ను దెబ్బతీయకుండా శుభ్రం చేస్తుంది.'
      },
      ta: {
        question: 'மார்matches or கிரானைட் தரையை சுத்தம் செய்ய பாதுகாப்பானது எது?',
        options: ['ஹைட்ரோகுளோரிக் அமிலம்', 'காஸ்டிக் சோடா', 'pH-நியூட்ரல் மார்பிள் கிளீனர்', 'பிளீச்சிங் பவுடர்'],
        explanation: 'pH-நியூட்ரல் கிளீனர் மார்பிளின் பளபளப்பை பாதுகாக்கும்.'
      },
      gu: {
        question: 'માર્બલ કે ગ્રેનાઈટ સાફ કરવા માટે કયું ક્લીનર સુરક્ષિત છે?',
        options: ['હાઇડ્રોક્લોરિક એસિડ', 'કોસ્ટિક સોડા', 'pH-ન્યુટ્રલ માર્બલ ક્લીનર', 'બ્લીચિંગ પાવડર'],
        explanation: 'pH-ન્યુટ્રલ ક્લીનરથી માર્બલની ચમક જળવાઈ રહે છે.'
      },
      ur: {
        question: 'ماربل یا گرینائٹ کی صفائی کے لیے کون سا کلینر محفوظ ہے؟',
        options: ['تیزاب', 'کاسٹک سوڈا', 'پی ایچ نیوٹرل ماربل کلینر', 'بلیچنگ پاؤڈر'],
        explanation: 'پی ایچ نیوٹرل کلینر سے ماربل کی چمک خراب نہیں ہوتی۔'
      },
      kn: {
        question: 'ಮಾರ್ಬಲ್ ಅಥವಾ ಗ್ರಾನೈಟ್ ಸ್ವಚ್ಛಗೊಳಿಸಲು ಯಾವುದು ಸುರಕ್ಷಿತ?',
        options: ['ಆಸಿಡ್', 'ಕಾಸ್ಟಿಕ್ ಸೋಡಾ', 'pH-ನ್ಯೂಟ್ರಲ್ ಮಾರ್ಬಲ್ ಕ್ಲೀನರ್', 'ಬ್ಲೀಚಿಂಗ್ ಪೌಡರ್'],
        explanation: 'pH-ನ್ಯೂಟ್ರಲ್ ಕ್ಲೀನರ್ ಮಾರ್ಬಲ್ ಹೊಳಪನ್ನು ಕಾಪಾಡುತ್ತದೆ.'
      },
      or: {
        question: 'ମାର୍ବଲ୍ ସଫା କରିବା ପାଇଁ କେଉଁ କ୍ଲିନର୍ ନିରାପଦ?',
        options: ['ଏସିଡ୍', 'କାଷ୍ଟିକ୍ ସୋଡା', 'pH-ନ୍ୟୁଟ୍ରାଲ୍ ମାର୍ବଲ୍ କ୍ଲିନର୍', 'ବ୍ଲିଚିଂ ପାଉଡର୍'],
        explanation: 'pH-ନ୍ୟୁଟ୍ରାଲ୍ କ୍ଲିନର୍ ମାର୍ବଲ୍ ର ଚମକ ନଷ୍ଟ କରେ ନାହିଁ।'
      },
      ml: {
        question: 'മാർബിൾ അല്ലെങ്കിൽ ഗ്രാനൈറ്റ് വൃത്തിയാക്കാൻ സുരക്ഷിതമായത് ഏതാണ്?',
        options: ['ആസിഡ്', 'കോസ്റ്റിക് സോഡ', 'pH-ന്യൂട്രൽ മാർബിൾ ക്ലീനർ', 'ബ്ലീച്ചിംഗ് പൗഡർ'],
        explanation: 'pH-ന്യൂട്രൽ ക്ലീനറുകൾ മാർബിളിന്റെ തിളക്കം സംരക്ഷിക്കുന്നു.'
      }
    }
  };
}

function getApplianceTemplate(category: AssessmentCategory, seq: number): QuestionTemplateResult {
  return {
    correctIndex: 1,
    translations: {
      en: {
        question: 'In an Inverter Split AC, if the indoor unit blower operates normally but cooling fails and the outdoor unit fan runs while the compressor remains silent, what is the most likely issue?',
        options: ['Clogged air filter mesh', 'Failed outdoor inverter PCB power module / IPM or open compressor winding', 'Thermostat battery drained', 'Indoor swing motor disengaged'],
        explanation: 'The Inverter IPM module directly drives the brushless DC compressor; its failure halts compression while leaving low-voltage fans running.'
      },
      hi: {
        question: 'इन्वर्टर स्प्लिट एसी में इनडोर ब्लोअर चल रहा है, आउटडोर पंखा घूम रहा है लेकिन कंप्रेसर बंद है और कूलिंग नहीं हो रही। मुख्य खराबी क्या हो सकती है?',
        options: ['एयर फिल्टर जाम होना', 'आउटडोर इन्वर्टर पीसीबी (IPM मॉड्यूल) या कंप्रेसर वाइंडिंग खराब होना', 'रिमोट की बैटरी खत्म होना', 'स्विंग मोटर टूटना'],
        explanation: 'इन्वर्टर एसी में कंप्रेसर को चलाने वाला आउटडोर IPM मॉड्यूल खराब होने पर कंप्रेसर चालू नहीं होता।'
      },
      bn: {
        question: 'ইনভার্টার এসির ফ্যান চলছে কিন্তু কম্প্রেসার বন্ধ ও ঠান্ডা হচ্ছে না। কারণ কী?',
        options: ['এয়ার ফিল্টার নোংরা', 'আউটডোর ইনভার্টার পিসিবি (IPM) বা কম্প্রেসার ওয়াইন্ডিং ত্রুটিযুক্ত', 'রিমোট ব্যাটারি শেষ', 'সুইং মোটর নষ্ট'],
        explanation: 'আউটডোর পিসিবি নষ্ট হলে কম্প্রেসার চালু হয় না।'
      },
      mr: {
        question: 'इन्व्हर्टर एसीमध्ये फॅन चालू आहे पण कॉम्प्रेसर बंद असून कुलिंग होत नाही. काय दोष असू शकतो?',
        options: ['फिल्टर चोकअप असणे', 'आउटडोअर इन्व्हर्टर पीसीबी (IPM) किंवा कॉम्प्रेसर वाइंडिंग खराब असणे', 'रिमोटची बॅटरी संपणे', 'स्विंग मोटर खराब असणे'],
        explanation: 'IPM मॉड्यूल खराब झाल्यास इन्व्हर्टर कॉम्प्रेसर चालू होत नाही.'
      },
      te: {
        question: 'ఇన్వర్టర్ ఏసీలో ఫ్యాన్ తిరుగుతున్నా కంప్రెసర్ ఆన్ కాకపోతే సమస్య ఏమిటి?',
        options: ['ఎయిర్ ఫిల్టర్ జామ్', 'అవుట్‌డోర్ ఇన్వర్టర్ పీసీబీ (IPM) లేదా కంప్రెసర్ వైండింగ్ వైఫల్యం', 'రిమోట్ బ్యాటరీ అయిపోవడం', 'స్వింగ్ మోటార్ సమస్య'],
        explanation: 'IPM మాడ్యూల్ పాడైతే కంప్రెసర్ పనిచేయదు.'
      },
      ta: {
        question: 'இன்வெர்ட்டர் ஏசியில் ஃபேன் ஓடுகிறது ஆனால் கம்ப்ரசர் ஓடவில்லை மற்றும் குளிரவில்லை. காரணம் என்ன?',
        options: ['ஏர் ஃபில்டர் அடைப்பு', 'அவுட்டோர் இன்வெர்ட்டர் பிசிபி (IPM) அல்லது கம்ப்ரசர் கோளாறு', 'ரிமோட் பேட்டரி தீர்ந்துவிட்டது', 'ஸ்விங் மோட்டார் பழுது'],
        explanation: 'IPM போர்டு பழுதானால் கம்ப்ரசர் இயங்காது.'
      },
      gu: {
        question: 'ઇન્વર્ટર AC માં પંખો ફરે છે પણ કોમ્પ્રેસર ચાલુ નથી થતું, શું ખામી હોઈ શકે?',
        options: ['એર ફિલ્ટર ગંદુ હોવું', 'આઉટડોર ઇન્વર્ટર PCB (IPM) અથવા કોમ્પ્રેસર વાઇન્ડિંગ ખરાબ હોવું', 'રિમોટની બેટરી પતી જવી', 'સ્વિંગ મોટર બગડવી'],
        explanation: 'IPM મોડ્યુલ બગડવાથી કોમ્પ્રેસર શરૂ થતું નથી.'
      },
      ur: {
        question: 'انورٹر اے سی میں پنکھا چل رہا ہے لیکن کمپریسر بند ہے اور کولنگ نہیں ہو رہی۔ کیا خرابی ہو سکتی ہے؟',
        options: ['فلٹر بند ہونا', 'آؤٹ ڈور انورٹر پی سی بی (IPM) یا کمپریسر وائنڈنگ کی خرابی', 'ریموٹ کی بیٹری ختم ہونا', 'سوئنگ موٹر کی خرابی'],
        explanation: 'آؤٹ ڈور پی سی بی خراب ہونے سے کمپریسر اسٹارٹ نہیں ہوتا۔'
      },
      kn: {
        question: 'ಇನ್ವರ್ಟರ್ ಎಸಿಯಲ್ಲಿ ಫ್ಯಾನ್ ಚಲಿಸುತ್ತಿದೆ ಆದರೆ ಕಂಪ್ರೆಸರ್ ಆನ್ ಆಗುತ್ತಿಲ್ಲ. ಕಾರಣವೇನು?',
        options: ['ಏರ್ ಫಿಲ್ಟರ್ ಜಾಮ್', 'ಔಟ್‌ಡೋರ್ ಇನ್ವರ್ಟರ್ ಪಿಸಿಬಿ (IPM) ಅಥವಾ ಕಂಪ್ರೆಸರ್ ವೈಫಲ್ಯ', 'ರಿಮೋಟ್ ಬ್ಯಾಟರಿ ಖಾಲಿ', 'ಸ್ವಿಂಗ್ ಮೋಟಾರ್ ದೋಷ'],
        explanation: 'IPM ಮಾಡ್ಯೂಲ್ ದೋಷದಿಂದ ಕಂಪ್ರೆಸರ್ ಕಾರ್ಯನಿರ್ವಹಿಸುವುದಿಲ್ಲ.'
      },
      or: {
        question: 'ଇନଭର୍ଟର୍ AC ରେ ଫ୍ୟାନ୍ ଚାଲୁଛି କିନ୍ତୁ କମ୍ପ୍ରେସର୍ ବନ୍ଦ ଅଛି। କାରଣ କ’ଣ?',
        options: ['ଫିଲ୍ଟର୍ ମଇଳା', 'ଆଉଟଡୋର୍ ଇନଭର୍ଟର୍ PCB (IPM) ବା କମ୍ପ୍ରେସର୍ ତ୍ରୁଟି', 'ରିମୋଟ୍ ବ୍ୟାଟେରୀ ସରିବା', 'ମୋଟର୍ ଖରାପ'],
        explanation: 'PCB ଖରାପ ହେଲେ କମ୍ପ୍ରେସର୍ ଚାଲେ ନାହିଁ।'
      },
      ml: {
        question: 'ഇൻവെർട്ടർ എസിയിൽ ഫാൻ ഓടുന്നുണ്ടെങ്കിലും കംപ്രസ്സർ പ്രവർത്തിക്കാത്തതിന്റെ കാരണം എന്താണ്?',
        options: ['എയർ ഫിൽട്ടർ അടഞ്ഞുപോകുക', 'ഔട്ട്ഡോർ ഇൻവെർട്ടർ പിസിബി (IPM) അല്ലെങ്കിൽ കംപ്രസ്സർ തകരാറ്', 'റിമോട്ട് ബാറ്ററി തീരുക', 'സ്വിംഗ് മോട്ടോർ തകരാറ്'],
        explanation: 'IPM മൊഡ്യൂൾ കേടായാൽ കംപ്രസ്സർ ഓണാകില്ല.'
      }
    }
  };
}

function getMasonryTemplate(category: AssessmentCategory, seq: number): QuestionTemplateResult {
  return {
    correctIndex: 0,
    translations: {
      en: {
        question: 'What is the standard water curing duration required for freshly constructed brick masonry and cement plaster in hot dry conditions?',
        options: ['Minimum 7 to 10 days continuously kept moist', '30 minutes only', '1 day without water', 'No curing needed if polymer is used'],
        explanation: 'Continuous moisture curing for 7-10 days enables complete cement hydration and maximum compressive strength.'
      },
      hi: {
        question: 'गर्म मौसम में नए ईंट निर्माण और प्लास्टर की तराई (Water Curing) कितने दिनों तक लगातार करनी चाहिए?',
        options: ['कम से कम 7 से 10 दिन लगातार गीला रखें', 'केवल 30 मिनट', '1 दिन', 'तराई की कोई जरूरत नहीं'],
        explanation: '7 से 10 दिन की तराई से सीमेंट की रासायनिक क्रिया पूरी होती है और निर्माण मजबूत बनता है।'
      },
      bn: {
        question: 'নতুন প্লাস্টার ও গাঁথুনির কিউরিং কত দিন করা উচিত?',
        options: ['কমপক্ষে ৭ থেকে ১০ দিন একটানা ভেজা রাখা', '৩০ মিনিট', '১ দিন', 'প্রয়োজন নেই'],
        explanation: '৭-১০ দিন কিউরিং করলে সিমেন্টের শক্তি পূর্ণমাত্রায় পৌঁছায়।'
      },
      mr: {
        question: 'नवीन विटांचे बांधकाम व प्लास्टरचे क्युरिंग (पाणी मारणे) किती दिवस करणे आवश्यक आहे?',
        options: ['किमान ७ ते १० दिवस सतत ओले ठेवणे', 'फक्त ३० मिनिटे', '१ दिवस', 'पाण्याची गरज नाही'],
        explanation: '७ ते १० दिवस पाणी दिल्याने सिमेंट पूर्णपणे पक्के होते व तडे जात नाहीत.'
      },
      te: {
        question: 'కొత్త ఇటుక కట్టడం మరియు ప్లాస్టరింగ్‌కు ఎన్ని రోజులు క్యూరింగ్ చేయాలి?',
        options: ['కనీసం 7 నుండి 10 రోజులు నిరంతరం తడిగా ఉంచడం', '30 నిమిషాలు', '1 రోజు', 'అవసరం లేదు'],
        explanation: '7-10 రోజులు క్యూరింగ్ చేయడం వల్ల నిర్మాణం పటిష్టంగా మారుతుంది.'
      },
      ta: {
        question: 'புதிய காரை பூச்சு மற்றும் செங்கல் வேலைக்கு எத்தனை நாட்கள் தண்ணீர் ஊற்ற வேண்டும்?',
        options: ['குறைந்தது 7 முதல் 10 நாட்கள் தொடர்ந்து நனைக்க வேண்டும்', '30 நிமிடங்கள்', '1 நாள்', 'தேவையில்லை'],
        explanation: '7-10 நாட்கள் க்யூரிங் செய்வது சிமெண்டிற்கு அதிக பலம் தரும்.'
      },
      gu: {
        question: 'નવા ચણતર અને પ્લાસ્ટર પર કેટલા દિવસ પાણી છાંટવું (ક્યોરિંગ) જોઈએ?',
        options: ['ઓછામાં ઓછા 7 થી 10 દિવસ સતત ભીનું રાખવું', 'માત્ર 30 મિનિટ', '1 દિવસ', 'જરૂર નથી'],
        explanation: '7 થી 10 દિવસ પાણી આપવાથી સિમેન્ટ મજબૂત બને છે.'
      },
      ur: {
        question: 'نئی چنائی اور پلستر کی ترائی کتنے دن تک لازمی کرنی چاہیے؟',
        options: ['کم از کم 7 سے 10 دن مسلسل گیلا رکھیں', 'صرف 30 منٹ', '1 دن', 'ترائی کی ضرورت نہیں'],
        explanation: '7 سے 10 دن ترائی کرنے سے سیمنٹ مضبوط ہوتا ہے۔'
      },
      kn: {
        question: 'ಹೊಸ ಗಾರೆ ಮತ್ತು ಇಟ್ಟಿಗೆ ಕೆಲಸಕ್ಕೆ ಎಷ್ಟು ದಿನ ಕ್ಯೂರಿಂಗ್ (ನೀರು ಹಾಕುವುದು) ಮಾಡಬೇಕು?',
        options: ['ಕನಿಷ್ಠ 7 ರಿಂದ 10 ದಿನ ನಿರಂತರವಾಗಿ ತೇವವಾಗಿಡುವುದು', '30 ನಿಮಿಷ', '1 ದಿನ', 'ಅಗತ್ಯವಿಲ್ಲ'],
        explanation: '7-10 ದಿನ ಕ್ಯೂರಿಂಗ್ ಮಾಡುವುದರಿಂದ ಸಿಮೆಂಟ್ ಗಟ್ಟಿಯಾಗುತ್ತದೆ.'
      },
      or: {
        question: 'ନୂଆ କାନ୍ଥ ଓ ପ୍ଲାଷ୍ଟରରେ କେତେ ଦିନ ପାଣି ଦେବା (କ୍ୟୁରିଂ) ଆବଶ୍ୟକ?',
        options: ['ଅତି କମରେ ୭ ରୁ ୧୦ ଦିନ', '୩୦ ମିନିଟ୍', '୧ ଦିନ', 'ଦରକାର ନାହିଁ'],
        explanation: '୭-୧୦ ଦିନ ପାଣି ଦେଲେ ସିମେଣ୍ଟ ମଜବୁତ ହୁଏ।'
      },
      ml: {
        question: 'പുതിയ പ്ലാസ്റ്ററിംഗിനും കട്ടപ്പണിക്കും എത്ര ദിവസം നനയ്ക്കണം (ക്യൂറിംഗ്)?',
        options: ['കുറഞ്ഞത് 7 മുതൽ 10 ദിവസം വരെ തുടർച്ചയായി', '30 മിനിറ്റ് മാത്രം', '1 ദിവസം', 'ആവശ്യമില്ല'],
        explanation: '7-10 ദിവസം ക്യൂറിംഗ് ചെയ്യുന്നത് സിമന്റിന് പരമാവധി ഉറപ്പ് നൽകുന്നു.'
      }
    }
  };
}

function getWeldingTemplate(category: AssessmentCategory, seq: number): QuestionTemplateResult {
  return {
    correctIndex: 1,
    translations: {
      en: {
        question: 'When performing Shielded Metal Arc Welding (SMAW), why must auto-darkening welding helmets with DIN 10-12 filter shade be worn at all times?',
        options: ['To look stylish', 'To shield the eyes from intense ultraviolet (UV) and infrared (IR) radiation that causes painful arc eye / corneal burns', 'To block wind from cooling the weld pool', 'To increase electrode burning speed'],
        explanation: 'Welding arcs produce intense UV/IR radiation which causes severe photokeratitis (arc eye) and permanent retinal burns.'
      },
      hi: {
        question: 'आर्क वेल्डिंग करते समय DIN 10-12 शेड वाला वेल्डिंग हेलमेट पहनना क्यों अनिवार्य है?',
        options: ['दिखावे के लिए', 'आँखों को पराबैंगनी (UV) और इन्फ्रारेड किरणों से बचाने के लिए जो कॉर्निया को जला सकती हैं', 'हवा रोकने के लिए', 'वेल्डिंग तेज करने के लिए'],
        explanation: 'वेल्डिंग की तेज UV किरणें आँखों के कॉर्निया को नुकसान पहुँचा सकती हैं, हेलमेट इससे रक्षा करता है।'
      },
      bn: {
        question: 'ওয়েল্ডিং করার সময় ওয়েল্ডিং হেলমেট পরা কেন বাধ্যতামূলক?',
        options: ['ফ্যাশনের জন্য', 'ইউভি (UV) এবং আইআর রশ্মি থেকে চোখ রক্ষা করতে', 'বাতাস আটকাতে', 'গতি বাড়াতে'],
        explanation: 'হেলমেট ক্ষতিকর অতিবেগুনি রশ্মি থেকে চোখকে রক্ষা করে।'
      },
      mr: {
        question: 'वेल्डिंग करताना संरक्षक वेल्डिंग हेल्मेट वापरणे का आवश्यक आहे?',
        options: ['फॅशनसाठी', 'डोळ्यांचे जळजळ करणाऱ्या अतिनील (UV) किरणांपासून रक्षण करण्यासाठी', 'वारा रोखण्यासाठी', 'वेल्डिंगचा वेग वाढवण्यासाठी'],
        explanation: 'वेल्डिंगच्या तीव्र प्रकाशाने डोळ्यांना इजा होऊ नये म्हणून हेल्मेट आवश्यक आहे.'
      },
      te: {
        question: 'వెల్డింగ్ చేసేటప్పుడు వెల్డింగ్ హెల్మెట్ ఎందుకు తప్పనిసరి?',
        options: ['స్టైల్ కోసం', 'కళ్ళను తీవ్రమైన UV మరియు IR కిరణాల నుండి రక్షించడానికి', 'గాలిని ఆపడానికి', 'వేగం పెంచడానికి'],
        explanation: 'హెల్మెట్ ప్రమాదకరమైన అతినీలలోహిత కిరణాల నుండి కళ్ళను కాపాడుతుంది.'
      },
      ta: {
        question: 'வெல்டிங் செய்யும் போது பாதுகாப்பு ஹெல்மெட் அணிவது ஏன் கட்டாயம்?',
        options: ['அழகுக்காக', 'கண்களை புற ஊதா (UV) கதிர்வீச்சில் இருந்து பாதுகாக்க', 'காற்றைத் தடுக்க', 'வேகத்தை அதிகரிக்க'],
        explanation: 'ஹெல்மெட் கண்களை தீவிர கதிர்வீச்சில் இருந்து பாதுகாக்கிறது.'
      },
      gu: {
        question: 'વેલ્ડીંગ કરતી વખતે હેલ્મેટ પહેરવું કેમ જરૂરી છે?',
        options: ['ફેશન માટે', 'આંખોને નુકસાનકારક UV અને IR કિરણોથી બચાવવા માટે', 'પવન રોકવા', 'ઝડપ વધારવા'],
        explanation: 'હેલ્મેટ આંખોને વેલ્ડીંગના તેજ કિરણોથી સુરક્ષિત રાખે છે.'
      },
      ur: {
        question: 'ویلڈنگ کرتے وقت ہیلمٹ پہننا کیوں لازمی ہے؟',
        options: ['فیشن کے لیے', 'آنکھوں کو نقصان دہ الٹرا وائلٹ شعاعوں سے بچانے کے لیے', 'ہوا روکنے کے لیے', 'رفتار بڑھانے کے لیے'],
        explanation: 'ہیلمٹ آنکھوں کو تیز روشنی اور جلنے سے بچاتا ہے۔'
      },
      kn: {
        question: 'ವೆಲ್ಡಿಂಗ್ ಮಾಡುವಾಗ ಹೆಲ್ಮೆಟ್ ಧರಿಸುವುದು ಏಕೆ ಕಡ್ಡಾಯ?',
        options: ['ಫ್ಯಾಷನ್‌ಗಾಗಿ', 'ಕಣ್ಣುಗಳನ್ನು ತೀವ್ರ UV ಕಿರಣಗಳಿಂದ ರಕ್ಷಿಸಲು', 'ಗಾಳಿ ತಡೆಯಲು', 'ವೇಗ ಹೆಚ್ಚಿಸಲು'],
        explanation: 'ಹೆಲ್ಮೆಟ್ ಕಣ್ಣುಗಳನ್ನು ಅಪಾಯಕಾರಿ ಕಿರಣಗಳಿಂದ ರಕ್ಷಿಸುತ್ತದೆ.'
      },
      or: {
        question: 'ୱେଲ୍ଡିଂ କରିବା ବେଳେ ହେଲମେଟ୍ ପିନ୍ଧିବା କାହିଁକି ଜରୁରୀ?',
        options: ['ଷ୍ଟାଇଲ୍ ପାଇଁ', 'ଆଖିକୁ କ୍ଷତିକାରକ UV ରଶ୍ମିରୁ ରକ୍ଷା କରିବା ପାଇଁ', 'ପବନ ଅଟକାଇବା ପାଇଁ', 'ସ୍ପିଡ୍ ବଢ଼ାଇବା ପାଇଁ'],
        explanation: 'ହେଲମେଟ୍ ଆଖିର ସୁରକ୍ଷା ନିଶ୍ଚିତ କରେ।'
      },
      ml: {
        question: 'വെൽഡിംഗ് ചെയ്യുമ്പോൾ വെൽഡിംഗ് ഹെൽമെറ്റ് ധരിക്കുന്നത് എന്തിനാണ്?',
        options: ['ഫാഷന് വേണ്ടി', 'കണ്ണുകളെ ദോഷകരമായ അൾട്രാവയലറ്റ് രശ്മികളിൽ നിന്ന് സംരക്ഷിക്കാൻ', 'കാറ്റ് തടയാൻ', 'വേഗത കൂട്ടാൻ'],
        explanation: 'ഹെൽമെറ്റ് കണ്ണിന് അൾട്രാവയലറ്റ് കിരണങ്ങളിൽ നിന്ന് പൂർണ്ണ സംരക്ഷണം നൽകുന്നു.'
      }
    }
  };
}
