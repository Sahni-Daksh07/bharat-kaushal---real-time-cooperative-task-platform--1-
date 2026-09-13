export interface DetectedFieldResult {
  detectedField: string;
  confidence: number; // 0 to 100
  matchedKeywords: string[];
  alternativeTrades: { field: string; confidence: number }[];
  isClarificationNeeded: boolean;
  rationale: string;
}

export interface TradeProfile {
  field: string;
  displayName: string;
  hindiName: string;
  iconName: string;
  keywords: string[];
  strongKeywords: string[];
  description: string;
  commonSkills: string[];
}

export const SUPPORTED_TRADES: TradeProfile[] = [
  {
    field: 'Plumbing',
    displayName: 'Plumbing & Pipefitting',
    hindiName: 'प्लंबिंग एवं पाइप फिटिंग',
    iconName: 'Wrench',
    description: 'Residential & commercial water supply, drainage, sanitary fixtures, and leakage repair.',
    strongKeywords: [
      'plumbing', 'plumber', 'pipe', 'pipes', 'pipefitting', 'fitting', 'leakage',
      'drain', 'drainage', 'faucet', 'tap', 'valves', 'angle valve', 'p-trap',
      'cistern', 'flush', 'water tank', 'geyser connection', 'washbasin', 'sanitary',
      'cpvc', 'upvc', 'pvc pipe', 'gi pipe', 'teflon', 'ptfe', 'pipe wrench',
      'sewer', 'blockage', 'overflow', 'plumbing repair', 'नल', 'पाइप', 'लीकेज'
    ],
    keywords: [
      'water', 'tank', 'bath', 'bathroom', 'kitchen sink', 'motor', 'pump',
      'pipeline', 'gasket', 'seal', 'pressure', 'nozzle', 'trap', 'choke'
    ],
    commonSkills: ['Pipe Fitting', 'Leakage Diagnosis & Repair', 'Sanitary Fixtures Installation', 'Water Tank & Pump Servicing', 'Drainage Unclogging']
  },
  {
    field: 'Electrical',
    displayName: 'Electrical & Power Systems',
    hindiName: 'इलेक्ट्रिकल एवं वायरिंग',
    iconName: 'Zap',
    description: 'Residential wiring, distribution panels, circuit breakers, lighting, and power safety.',
    strongKeywords: [
      'electrical', 'electrician', 'wiring', 'wire', 'mcb', 'rccb', 'elcb',
      'earthing', 'grounding', 'short circuit', 'fuse', 'db box', 'distribution board',
      'switchboard', 'socket', 'phase', 'neutral', 'voltage', 'current', 'tester',
      'multimeter', 'inverter', 'battery wiring', 'conduit', 'tripping', 'बिजली', 'वायरिंग', 'स्विच'
    ],
    keywords: [
      'power', 'light', 'fan', 'led', 'plug', 'panel', 'breaker', 'generator',
      'ac wiring', 'load calculation', 'substation', 'cable', 'transformer'
    ],
    commonSkills: ['Residential House Wiring', 'MCB & DB Box Setup', 'Earthing & Surge Protection', 'Inverter & Battery Wiring', 'Fault Diagnosis & Tripping Fixes']
  },
  {
    field: 'Carpentry',
    displayName: 'Carpentry & Woodwork',
    hindiName: 'बढ़ईगीरी एवं काष्ठकला',
    iconName: 'Hammer',
    description: 'Custom furniture, modular cabinetry, door/window frame fitting, laminates, and repairs.',
    strongKeywords: [
      'carpentry', 'carpenter', 'wood', 'wooden', 'woodwork', 'furniture', 'plywood',
      'laminate', 'veneer', 'hinges', 'hinge', 'door frame', 'window frame', 'modular kitchen',
      'wardrobe', 'cupboard', 'saw', 'sawing', 'planer', 'router', 'chiseling',
      'wood polish', 'sunmica', 'drawer slide', 'lock fitting', 'बढ़ई', 'फर्नीचर', 'प्लाईवुड'
    ],
    keywords: [
      'board', 'table', 'chair', 'bed', 'shelf', 'drilling', 'screws', 'nails',
      'adhesive', 'fevicol', 'cutting', 'leveling', 'sanding', 'varnish'
    ],
    commonSkills: ['Modular Furniture Assembly', 'Plywood & Laminate Work', 'Door & Window Frame Fitting', 'Lock & Hardware Installation', 'Wood Polishing & Refinishing']
  },
  {
    field: 'Painting',
    displayName: 'Painting & Surface Coating',
    hindiName: 'पेंटिंग एवं सतह परिष्करण',
    iconName: 'Paintbrush',
    description: 'Interior & exterior wall painting, waterproof coatings, texture design, and surface prep.',
    strongKeywords: [
      'painting', 'painter', 'paint', 'putty', 'wall putty', 'primer', 'emulsion',
      'distemper', 'texture paint', 'roller', 'paint brush', 'waterproofing', 'dampness',
      'sanding', 'scraping', 'enamel', 'exterior paint', 'interior paint', 'asian paints',
      'berger', 'nerolac', 'wall finishing', 'रंग', 'पुट्टी', 'पेंट'
    ],
    keywords: [
      'coat', 'coating', 'color', 'brush', 'roller', 'finish', 'gloss', 'matte',
      'sealer', 'plaster repair', 'spray', 'masking', 'stain'
    ],
    commonSkills: ['Wall Putty & Surface Leveling', 'Interior Emulsion Application', 'Exterior Weatherproof Coating', 'Texture & Stencil Design', 'Waterproofing & Anti-Damp Treatment']
  },
  {
    field: 'Deep Cleaning',
    displayName: 'Professional Deep Cleaning',
    hindiName: 'गहन सफाई एवं स्वच्छता',
    iconName: 'Sparkles',
    description: 'Full home sanitization, kitchen degreasing, bathroom descaling, and upholstery care.',
    strongKeywords: [
      'cleaning', 'cleaner', 'deep cleaning', 'sanitization', 'descaling', 'degreasing',
      'scrubbing', 'sofa cleaning', 'carpet cleaning', 'vacuuming', 'mop', 'housekeeping',
      'bathroom cleaning', 'kitchen cleaning', 'tile cleaning', 'acid wash', 'steam cleaning',
      'floor polishing', 'safai', 'सफाई', 'डीप क्लीनिंग'
    ],
    keywords: [
      'hygiene', 'dirt', 'stain removal', 'chemical', 'machine', 'pressure washer',
      'glass cleaning', 'disinfectant', 'dusting', 'polishing'
    ],
    commonSkills: ['Bathroom Descaling & Acid-free Cleaning', 'Kitchen Grease & Chimney Cleaning', 'Fabric & Leather Sofa Shampooing', 'Floor Scrubbing & Polishing', 'Full Home Sanitization']
  },
  {
    field: 'Appliance Repair',
    displayName: 'Home Appliance Care',
    hindiName: 'घरेलू उपकरण मरम्मत',
    iconName: 'Tv',
    description: 'Air conditioners, refrigerators, washing machines, microwaves, and RO water purifiers.',
    strongKeywords: [
      'appliance', 'ac repair', 'air conditioner', 'refrigerator', 'fridge', 'washing machine',
      'microwave', 'ro purifier', 'ro filter', 'compressor', 'gas charging', 'cooling coil',
      'pcb repair', 'condenser', 'drain motor', 'thermostat', 'inverter ac', 'उपकरण', 'एसी मरम्मत', 'फ्रिज'
    ],
    keywords: [
      'cooling', 'heating', 'machine repair', 'freon', 'r32', 'r410a', 'drum',
      'spin cycle', 'filter replacement', 'servicing', 'leak'
    ],
    commonSkills: ['AC Gas Charging & Leak Repair', 'Refrigerator Compressor Servicing', 'Washing Machine Drum & PCB Diagnostics', 'RO Membrane & Filter Replacement', 'Microwave Magnetron Repair']
  },
  {
    field: 'Masonry',
    displayName: 'Masonry & Civil Work',
    hindiName: 'राजमिस्त्री एवं निर्माण कार्य',
    iconName: 'Building',
    description: 'Brickwork, structural plastering, floor tiling, concrete work, and stone masonry.',
    strongKeywords: [
      'masonry', 'mason', 'rajmistri', 'brick', 'brickwork', 'plaster', 'plastering',
      'cement', 'mortar', 'tiling', 'tile fixing', 'flooring', 'grouting', 'concrete',
      'slab', 'foundation', 'waterproof plaster', 'mistri', 'मिस्त्री', 'प्लास्टर', 'चिनाई'
    ],
    keywords: [
      'sand', 'gravel', 'trowel', 'level', 'tile adhesive', 'lintel',
      'beam', 'construction', 'repair', 'civil work'
    ],
    commonSkills: ['Structural Brickwork & Wall Construction', 'Cement Plastering & Surface Leveling', 'Vitrified & Ceramic Tile Laying', 'Floor Screeding & Grouting', 'Minor Civil Renovations']
  },
  {
    field: 'Welding',
    displayName: 'Welding & Metal Fabrication',
    hindiName: 'वेल्डिंग एवं धातु निर्माण',
    iconName: 'Flame',
    description: 'Arc & gas welding, iron safety grills, gates, rolling shutters, and metal structures.',
    strongKeywords: [
      'welding', 'welder', 'fabrication', 'arc welding', 'mig welding', 'gas cutting',
      'iron gate', 'safety grill', 'rolling shutter', 'metal work', 'electrode', 'grinder',
      'welding rod', 'sheet metal', 'iron railing', 'वेल्डिंग', 'लोहा', 'ग्रिल'
    ],
    keywords: [
      'steel', 'iron', 'metal', 'cutting', 'fabricator', 'joint',
      'frame', 'structure', 'angle iron', 'channel'
    ],
    commonSkills: ['Shielded Metal Arc Welding (SMAW)', 'Safety Grill & Iron Gate Fabrication', 'Rolling Shutter Alignment & Repair', 'Angle Iron Frame Cutting & Welding', 'Metal Grinding & Rust Primer Application']
  }
];

export function detectWorkerField(input: {
  skills?: string[];
  workDescription?: string;
  previousExperience?: string;
  occupation?: string;
  experienceYears?: number | string;
  rawText?: string;
}): DetectedFieldResult {
  const combinedText = [
    ...(input.skills || []),
    input.workDescription || '',
    input.previousExperience || '',
    input.occupation || '',
    input.rawText || '',
  ]
    .join(' ')
    .toLowerCase();

  if (!combinedText.trim()) {
    return {
      detectedField: 'Plumbing',
      confidence: 50,
      matchedKeywords: [],
      alternativeTrades: [],
      isClarificationNeeded: true,
      rationale: 'Insufficient input provided. Defaulted to Plumbing baseline.'
    };
  }

  const scores: { field: string; score: number; matched: string[] }[] = [];

  for (const trade of SUPPORTED_TRADES) {
    let score = 0;
    const matched: string[] = [];

    // Check strong keywords (high weight = 3 points)
    for (const kw of trade.strongKeywords) {
      const kwLower = kw.toLowerCase();
      if (combinedText.includes(kwLower)) {
        score += 3;
        if (!matched.includes(kw)) matched.push(kw);
      }
    }

    // Check secondary keywords (standard weight = 1 point)
    for (const kw of trade.keywords) {
      const kwLower = kw.toLowerCase();
      if (combinedText.includes(kwLower)) {
        score += 1;
        if (!matched.includes(kw)) matched.push(kw);
      }
    }

    scores.push({ field: trade.field, score, matched });
  }

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  const topMatch = scores[0];
  const secondMatch = scores[1];

  // Calculate percentage confidence
  let confidence = 0;
  if (topMatch.score > 0) {
    const totalScore = scores.reduce((sum, s) => sum + s.score, 0);
    // Base confidence from relative dominance + raw strength
    const dominance = (topMatch.score / (totalScore || 1)) * 100;
    const rawStrengthBoost = Math.min(30, topMatch.score * 5);
    confidence = Math.min(98, Math.round(dominance * 0.7 + rawStrengthBoost));
    if (confidence < 60 && topMatch.score >= 3) {
      confidence = 72;
    }
  } else {
    confidence = 45;
  }

  const isClarificationNeeded =
    topMatch.score === 0 ||
    confidence < 65 ||
    (secondMatch && secondMatch.score > 0 && topMatch.score - secondMatch.score <= 1);

  const matchedTradeObj = SUPPORTED_TRADES.find((t) => t.field === topMatch.field) || SUPPORTED_TRADES[0];

  const alternatives = scores.slice(1, 4).map((s) => ({
    field: s.field,
    confidence: s.score > 0 ? Math.min(90, Math.round((s.score / (topMatch.score || 1)) * confidence * 0.8)) : 20,
  }));

  const rationale = topMatch.matched.length > 0
    ? `Automatically matched based on key trade indicators: ${topMatch.matched.slice(0, 5).join(', ')}.`
    : `Inferred based on selected skill domain and general profile details.`;

  return {
    detectedField: topMatch.score > 0 ? topMatch.field : 'Plumbing',
    confidence,
    matchedKeywords: topMatch.matched,
    alternativeTrades: alternatives,
    isClarificationNeeded,
    rationale,
  };
}
