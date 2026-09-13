const fs = require('fs');

let data = fs.readFileSync('src/utils/i18n.ts', 'utf8');

const additionalCats = {
  en: `
    cat_AC_Service_name: 'AC Service',
    cat_AC_Service_subtitle: 'Cleaning, gas refill, repair',`,
  hi: `
    cat_AC_Service_name: 'एसी सेवा व मरम्मत',
    cat_AC_Service_subtitle: 'सफाई, गैस रिफिल, मरम्मत',`,
  mr: `
    cat_AC_Service_name: 'एसी सेवा',
    cat_AC_Service_subtitle: 'स्वच्छता, गॅस भरणे, दुरुस्ती',`,
  bn: `
    cat_AC_Service_name: 'এসি সার্ভিস',
    cat_AC_Service_subtitle: 'ক্লিনিং, গ্যাস রিফিল, মেরামত',`,
  te: `
    cat_AC_Service_name: 'ఏసీ సర్వీస్',
    cat_AC_Service_subtitle: 'క్లీనింగ్, గ్యాస్ రీఫిల్, రిపేర్',`,
  ta: `
    cat_AC_Service_name: 'ஏசி சேவை',
    cat_AC_Service_subtitle: 'சுத்தம் செய்தல், எரிவாயு நிரப்புதல்',`
};

data = data.replace(/cat_Painting_subtitle: 'Interior, exterior, waterproofing',/g, "cat_Painting_subtitle: 'Interior, exterior, waterproofing'," + additionalCats.en);
data = data.replace(/cat_Painting_subtitle: 'इंटीरियर, एक्सटीरियर, वाटरप्रूफिंग',/g, "cat_Painting_subtitle: 'इंटीरियर, एक्सटीरियर, वाटरप्रूफिंग'," + additionalCats.hi);
data = data.replace(/cat_Painting_subtitle: 'ভিতরে, বাইরে, ওয়াটারপ্রুফিং',/g, "cat_Painting_subtitle: 'ভিতরে, বাইরে, ওয়াটারপ্রুফিং'," + additionalCats.bn);
data = data.replace(/cat_Painting_subtitle: 'आतील, बाहेरील, वॉटरप्रूफिंग',/g, "cat_Painting_subtitle: 'आतील, बाहेरील, वॉटरप्रूफिंग'," + additionalCats.mr);
data = data.replace(/cat_Painting_subtitle: 'లోపల, బయట, వాటర్‌ప్రూఫింగ్',/g, "cat_Painting_subtitle: 'లోపల, బయట, వాటర్‌ప్రూఫింగ్'," + additionalCats.te);
data = data.replace(/cat_Painting_subtitle: 'உட்புறம், வெளிப்புறம், நீர்ப்புகா',/g, "cat_Painting_subtitle: 'உட்புறம், வெளிப்புறம், நீர்ப்புகா'," + additionalCats.ta);

fs.writeFileSync('src/utils/i18n.ts', data);
console.log('Done AC Service!');
