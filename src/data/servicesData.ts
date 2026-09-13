import { ServiceItem } from '../types';

export interface ServiceCategoryMeta {
  id: string;
  name: string;
  hindiName: string;
  subtitle: string;
  iconName: string;
  emoji: string;
  minPrice: number;
  nearbyWorkers: number;
  popular?: boolean;
  urgent?: boolean;
  color: string;
}

export const SERVICE_CATEGORIES: ServiceCategoryMeta[] = [
  {
    id: 'Plumbing',
    name: 'Plumbing',
    hindiName: 'प्लंबिंग / नलसाजी',
    subtitle: 'Pipe repairs, leaks, installations',
    iconName: 'Wrench',
    emoji: '🔧',
    minPrice: 149,
    nearbyWorkers: 24,
    popular: true,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'Electrical',
    name: 'Electrical',
    hindiName: 'इलेक्ट्रिकल / बिजली कार्य',
    subtitle: 'Wiring, switches, fan installation',
    iconName: 'Zap',
    emoji: '⚡',
    minPrice: 149,
    nearbyWorkers: 18,
    popular: true,
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'Carpentry',
    name: 'Carpentry',
    hindiName: 'बढ़ईगीरी / लकड़ी कार्य',
    subtitle: 'Furniture repair, doors, windows',
    iconName: 'Hammer',
    emoji: '🪚',
    minPrice: 199,
    nearbyWorkers: 12,
    color: 'from-yellow-600 to-amber-800',
  },
  {
    id: 'Painting',
    name: 'Painting',
    hindiName: 'पेंटिंग / रंगाई-पुताई',
    subtitle: 'Interior, exterior, waterproofing',
    iconName: 'Paintbrush',
    emoji: '🎨',
    minPrice: 499,
    nearbyWorkers: 9,
    color: 'from-pink-500 to-rose-600',
  },
  {
    id: 'AC Service',
    name: 'AC Service',
    hindiName: 'एसी सेवा व मरम्मत',
    subtitle: 'Cleaning, gas refill, repair',
    iconName: 'Snowflake',
    emoji: '❄️',
    minPrice: 299,
    nearbyWorkers: 7,
    urgent: true,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'Masonry',
    name: 'Masonry',
    hindiName: 'राजमिस्त्री / निर्माण कार्य',
    subtitle: 'Tile fixing, plastering, repair',
    iconName: 'BrickWall',
    emoji: '🧱',
    minPrice: 300,
    nearbyWorkers: 15,
    popular: true,
    color: 'from-stone-500 to-stone-700',
  },
  {
    id: 'Welding',
    name: 'Welding',
    hindiName: 'वेल्डिंग / लोहार कार्य',
    subtitle: 'Metal work, gate fabrication',
    iconName: 'Flame',
    emoji: '🔩',
    minPrice: 500,
    nearbyWorkers: 6,
    color: 'from-orange-500 to-red-600',
  },
  {
    id: 'Deep Cleaning',
    name: 'Deep Cleaning',
    hindiName: 'गहन स्वच्छता / सफाई',
    subtitle: 'Home, office, post-construction',
    iconName: 'Sparkles',
    emoji: '🧹',
    minPrice: 300,
    nearbyWorkers: 20,
    popular: true,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'Appliance Repair',
    name: 'Appliance Repair',
    hindiName: 'उपकरण मरम्मत',
    subtitle: 'Washing machine, fridge, TV',
    iconName: 'Tv',
    emoji: '🔌',
    minPrice: 199,
    nearbyWorkers: 11,
    color: 'from-violet-500 to-purple-700',
  },
  {
    id: 'Flooring',
    name: 'Flooring',
    hindiName: 'फ़र्श / टाइल्स स्थापना',
    subtitle: 'Marble, tiles, wooden flooring',
    iconName: 'Layers',
    emoji: '🏠',
    minPrice: 150,
    nearbyWorkers: 8,
    color: 'from-amber-600 to-yellow-700',
  },
  {
    id: 'Waterproofing',
    name: 'Waterproofing',
    hindiName: 'वाटरप्रूफिंग / जलरोधी',
    subtitle: 'Terrace, bathroom, basement',
    iconName: 'Droplet',
    emoji: '💧',
    minPrice: 35,
    nearbyWorkers: 5,
    color: 'from-blue-600 to-cyan-700',
  },
  {
    id: 'Solar Install',
    name: 'Solar Install',
    hindiName: 'सोलर स्थापना व रखरखाव',
    subtitle: 'Panel installation, maintenance',
    iconName: 'Sun',
    emoji: '☀️',
    minPrice: 500,
    nearbyWorkers: 3,
    urgent: true,
    color: 'from-amber-400 to-orange-500',
  },
  {
    id: 'Pest Control',
    name: 'Pest Control',
    hindiName: 'कीट नियंत्रण / पेस्ट कंट्रोल',
    subtitle: 'Termite, cockroach, bed bug, mosquito control',
    iconName: 'Bug',
    emoji: '🐜',
    minPrice: 399,
    nearbyWorkers: 10,
    popular: true,
    color: 'from-teal-600 to-emerald-700',
  },
];

// All 146 parsed services from indore_local_home_services_dataset.csv
const RAW_SERVICES_DATASET: ServiceItem[] = [
  // Plumbing
  { record_id: "IND-SVC-001", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Plumbing", service_name: "Inspection / visit", pricing_unit: "per visit", min_price_inr: 149, max_price_inr: 249, suggested_display_price_inr: 149, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Labour/visit only; adjust against final repair where applicable", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-002", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Plumbing", service_name: "Tap leakage repair", pricing_unit: "per job", min_price_inr: 250, max_price_inr: 600, suggested_display_price_inr: 250, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Parts such as washer, cartridge, tap extra", data_status: "Verified local catalog", popular: true },
  { record_id: "IND-SVC-003", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Plumbing", service_name: "Faucet/tap replacement", pricing_unit: "per unit", min_price_inr: 200, max_price_inr: 450, suggested_display_price_inr: 200, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "New tap extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-004", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Plumbing", service_name: "Washbasin installation", pricing_unit: "per unit", min_price_inr: 500, max_price_inr: 1200, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Basin, pipe, bracket and fittings extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-005", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Plumbing", service_name: "Sink installation", pricing_unit: "per unit", min_price_inr: 600, max_price_inr: 1500, suggested_display_price_inr: 600, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Counter cutting and drain connection affect price", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-006", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Plumbing", service_name: "Toilet flush repair", pricing_unit: "per job", min_price_inr: 300, max_price_inr: 900, suggested_display_price_inr: 300, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Flush parts extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-007", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Plumbing", service_name: "Western commode installation", pricing_unit: "per unit", min_price_inr: 1000, max_price_inr: 2500, suggested_display_price_inr: 1000, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Commode and fittings extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-008", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Plumbing", service_name: "Indian toilet repair", pricing_unit: "per job", min_price_inr: 500, max_price_inr: 1500, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Tile removal/rework extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-009", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Plumbing", service_name: "Drain blockage clearing", pricing_unit: "per job", min_price_inr: 400, max_price_inr: 1500, suggested_display_price_inr: 400, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Jetting/machine work may be extra", data_status: "Verified local catalog", urgent: true },
  { record_id: "IND-SVC-010", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Plumbing", service_name: "Bathroom pipe leakage repair", pricing_unit: "per job", min_price_inr: 500, max_price_inr: 2000, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Wall breaking and tile repair separate", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-011", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Plumbing", service_name: "Water-tank connection", pricing_unit: "per job", min_price_inr: 700, max_price_inr: 2000, suggested_display_price_inr: 700, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Pipe and valves extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-012", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Plumbing", service_name: "Geyser water connection", pricing_unit: "per unit", min_price_inr: 400, max_price_inr: 900, suggested_display_price_inr: 400, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Flexible pipes, valves and fittings extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-013", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Plumbing", service_name: "Complete bathroom plumbing", pricing_unit: "per bathroom", min_price_inr: 5000, max_price_inr: 20000, suggested_display_price_inr: 5000, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Labour only; number of points affects price", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-014", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Plumbing", service_name: "Full-day plumber", pricing_unit: "per day", min_price_inr: 700, max_price_inr: 1000, suggested_display_price_inr: 700, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "For multiple small jobs", data_status: "Verified local catalog" },

  // Electrical
  { record_id: "IND-SVC-015", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Electrical", service_name: "Inspection / electrician visit", pricing_unit: "per visit", min_price_inr: 149, max_price_inr: 249, suggested_display_price_inr: 149, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Material extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-016", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Electrical", service_name: "Switch or socket repair", pricing_unit: "per point", min_price_inr: 150, max_price_inr: 350, suggested_display_price_inr: 150, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Material extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-017", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Electrical", service_name: "Switchboard replacement", pricing_unit: "per board", min_price_inr: 250, max_price_inr: 700, suggested_display_price_inr: 250, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Plate, modules and wiring extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-018", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Electrical", service_name: "Ceiling-fan installation", pricing_unit: "per unit", min_price_inr: 250, max_price_inr: 500, suggested_display_price_inr: 250, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Fan and hook/rod extra if needed", data_status: "Verified local catalog", popular: true },
  { record_id: "IND-SVC-019", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Electrical", service_name: "Fan repair", pricing_unit: "per unit", min_price_inr: 250, max_price_inr: 700, suggested_display_price_inr: 250, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Capacitor, bearing or winding extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-020", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Electrical", service_name: "Exhaust-fan installation", pricing_unit: "per unit", min_price_inr: 250, max_price_inr: 500, suggested_display_price_inr: 250, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Material extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-021", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Electrical", service_name: "LED bulb / tube-light installation", pricing_unit: "per unit", min_price_inr: 100, max_price_inr: 250, suggested_display_price_inr: 100, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Fixture material extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-022", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Electrical", service_name: "Decorative light installation", pricing_unit: "per job", min_price_inr: 300, max_price_inr: 1500, suggested_display_price_inr: 300, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Quantity and height affect price", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-023", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Electrical", service_name: "MCB replacement", pricing_unit: "per unit", min_price_inr: 250, max_price_inr: 600, suggested_display_price_inr: 250, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "MCB material extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-024", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Electrical", service_name: "MCB distribution box installation", pricing_unit: "per unit", min_price_inr: 800, max_price_inr: 3000, suggested_display_price_inr: 800, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "DB, MCB and wiring extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-025", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Electrical", service_name: "New plug point", pricing_unit: "per point", min_price_inr: 250, max_price_inr: 600, suggested_display_price_inr: 250, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Concealed wiring costs more", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-026", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Electrical", service_name: "Geyser electrical connection", pricing_unit: "per unit", min_price_inr: 300, max_price_inr: 700, suggested_display_price_inr: 300, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Cable, MCB and socket extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-027", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Electrical", service_name: "Inverter installation", pricing_unit: "per unit", min_price_inr: 800, max_price_inr: 2000, suggested_display_price_inr: 800, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Inverter, battery and wiring extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-028", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Electrical", service_name: "Short-circuit fault diagnosis", pricing_unit: "per job", min_price_inr: 300, max_price_inr: 1000, suggested_display_price_inr: 300, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Repair/replacement extra", data_status: "Verified local catalog", urgent: true },
  { record_id: "IND-SVC-029", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Electrical", service_name: "Earthing", pricing_unit: "per point", min_price_inr: 1500, max_price_inr: 5000, suggested_display_price_inr: 1500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Electrode and soil conditions affect price", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-030", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Electrical", service_name: "Full-day electrician", pricing_unit: "per day", min_price_inr: 700, max_price_inr: 1000, suggested_display_price_inr: 700, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "For multiple jobs", data_status: "Verified local catalog" },

  // Carpentry
  { record_id: "IND-SVC-031", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Carpentry", service_name: "Carpenter visit", pricing_unit: "per visit", min_price_inr: 199, max_price_inr: 350, suggested_display_price_inr: 199, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Inspection/minimum labour", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-032", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Carpentry", service_name: "Door hinge repair/replacement", pricing_unit: "per job", min_price_inr: 200, max_price_inr: 500, suggested_display_price_inr: 200, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Hinges extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-033", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Carpentry", service_name: "Door lock installation", pricing_unit: "per unit", min_price_inr: 250, max_price_inr: 700, suggested_display_price_inr: 250, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Lock extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-034", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Carpentry", service_name: "Door repair", pricing_unit: "per door", min_price_inr: 400, max_price_inr: 1500, suggested_display_price_inr: 400, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Depends on wood damage", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-035", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Carpentry", service_name: "Wooden door installation", pricing_unit: "per door", min_price_inr: 1000, max_price_inr: 3000, suggested_display_price_inr: 1000, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Door, frame and hardware extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-036", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Carpentry", service_name: "Window repair", pricing_unit: "per window", min_price_inr: 300, max_price_inr: 1200, suggested_display_price_inr: 300, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Glass and hardware extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-037", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Carpentry", service_name: "Bed repair", pricing_unit: "per bed", min_price_inr: 500, max_price_inr: 2000, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Material extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-038", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Carpentry", service_name: "Chair repair", pricing_unit: "per chair", min_price_inr: 250, max_price_inr: 800, suggested_display_price_inr: 250, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Material extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-039", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Carpentry", service_name: "Table repair", pricing_unit: "per table", min_price_inr: 400, max_price_inr: 1500, suggested_display_price_inr: 400, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Structure and polish affect price", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-040", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Carpentry", service_name: "Wardrobe repair", pricing_unit: "per wardrobe", min_price_inr: 500, max_price_inr: 2500, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Hinges, channels and laminate extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-041", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Carpentry", service_name: "Drawer/channel replacement", pricing_unit: "per drawer", min_price_inr: 300, max_price_inr: 1000, suggested_display_price_inr: 300, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Hardware extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-042", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Carpentry", service_name: "Wall shelf installation", pricing_unit: "per shelf", min_price_inr: 400, max_price_inr: 1200, suggested_display_price_inr: 400, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Material extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-043", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Carpentry", service_name: "Curtain-rod installation", pricing_unit: "per rod", min_price_inr: 200, max_price_inr: 600, suggested_display_price_inr: 200, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Rod and brackets extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-044", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Carpentry", service_name: "Furniture assembly", pricing_unit: "per item", min_price_inr: 500, max_price_inr: 2000, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Depends on item size", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-045", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Carpentry", service_name: "Full-day carpenter", pricing_unit: "per day", min_price_inr: 750, max_price_inr: 1100, suggested_display_price_inr: 750, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "For multiple jobs", data_status: "Verified local catalog" },

  // Painting
  { record_id: "IND-SVC-046", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Painting", service_name: "Minor touch-up", pricing_unit: "per job", min_price_inr: 500, max_price_inr: 1500, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Includes small consumables", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-047", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Painting", service_name: "Single-room repainting", pricing_unit: "per room", min_price_inr: 2500, max_price_inr: 6000, suggested_display_price_inr: 2500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Labour only; room size dependent", data_status: "Verified local catalog", popular: true },
  { record_id: "IND-SVC-048", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Painting", service_name: "Interior painting", pricing_unit: "per sq ft", min_price_inr: 12, max_price_inr: 25, suggested_display_price_inr: 12, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Labour only", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-049", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Painting", service_name: "Interior painting with putty, primer and paint", pricing_unit: "per sq ft", min_price_inr: 25, max_price_inr: 55, suggested_display_price_inr: 25, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Material-inclusive indicative range", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-050", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Painting", service_name: "Exterior painting", pricing_unit: "per sq ft", min_price_inr: 15, max_price_inr: 35, suggested_display_price_inr: 15, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Labour only", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-051", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Painting", service_name: "Exterior painting with waterproof coating", pricing_unit: "per sq ft", min_price_inr: 35, max_price_inr: 80, suggested_display_price_inr: 35, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Surface preparation/material affect rate", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-052", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Painting", service_name: "Wall putty application", pricing_unit: "per sq ft", min_price_inr: 8, max_price_inr: 18, suggested_display_price_inr: 8, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Labour only", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-053", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Painting", service_name: "Primer application", pricing_unit: "per sq ft", min_price_inr: 3, max_price_inr: 8, suggested_display_price_inr: 3, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Labour only", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-054", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Painting", service_name: "Texture painting", pricing_unit: "per sq ft", min_price_inr: 30, max_price_inr: 100, suggested_display_price_inr: 30, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Design and material dependent", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-055", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Painting", service_name: "Door/window enamel painting", pricing_unit: "per sq ft", min_price_inr: 80, max_price_inr: 250, suggested_display_price_inr: 80, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Sanding and primer can add cost", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-056", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Painting", service_name: "Grill/railing painting", pricing_unit: "per sq ft", min_price_inr: 40, max_price_inr: 100, suggested_display_price_inr: 40, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Rust treatment extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-057", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Painting", service_name: "Painter day charge", pricing_unit: "per day", min_price_inr: 700, max_price_inr: 1200, suggested_display_price_inr: 700, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Skill and task dependent", data_status: "Verified local catalog" },

  // AC Service
  { record_id: "IND-SVC-058", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "AC Service", service_name: "Inspection / AC repair visit", pricing_unit: "per visit", min_price_inr: 299, max_price_inr: 499, suggested_display_price_inr: 299, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Repair labour and parts extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-059", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "AC Service", service_name: "Basic AC servicing", pricing_unit: "per AC", min_price_inr: 399, max_price_inr: 599, suggested_display_price_inr: 399, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Per unit", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-060", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "AC Service", service_name: "Split AC power-jet / deep service", pricing_unit: "per AC", min_price_inr: 549, max_price_inr: 799, suggested_display_price_inr: 549, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Per unit", data_status: "Verified local catalog", popular: true },
  { record_id: "IND-SVC-061", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "AC Service", service_name: "Window AC deep service", pricing_unit: "per AC", min_price_inr: 599, max_price_inr: 850, suggested_display_price_inr: 599, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Per unit", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-062", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "AC Service", service_name: "Foam-jet service", pricing_unit: "per AC", min_price_inr: 649, max_price_inr: 1050, suggested_display_price_inr: 649, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Per unit", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-063", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "AC Service", service_name: "AC installation", pricing_unit: "per AC", min_price_inr: 1000, max_price_inr: 2500, suggested_display_price_inr: 1000, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Copper pipe, stand and drilling extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-064", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "AC Service", service_name: "Split AC installation with standard material", pricing_unit: "per AC", min_price_inr: 1800, max_price_inr: 3500, suggested_display_price_inr: 1800, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Pipe length and wall type affect price", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-065", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "AC Service", service_name: "AC uninstallation", pricing_unit: "per AC", min_price_inr: 500, max_price_inr: 1000, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Per unit", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-066", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "AC Service", service_name: "AC relocation", pricing_unit: "per AC", min_price_inr: 1500, max_price_inr: 3500, suggested_display_price_inr: 1500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Uninstall + install; material extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-067", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "AC Service", service_name: "Gas refilling", pricing_unit: "per AC", min_price_inr: 1500, max_price_inr: 4500, suggested_display_price_inr: 1500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Refrigerant type, capacity and leak repair affect price", data_status: "Verified local catalog", urgent: true },
  { record_id: "IND-SVC-068", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "AC Service", service_name: "Gas-leak testing/repair", pricing_unit: "per AC", min_price_inr: 600, max_price_inr: 2000, suggested_display_price_inr: 600, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Gas refill excluded", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-069", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "AC Service", service_name: "Drain-pipe cleaning", pricing_unit: "per AC", min_price_inr: 250, max_price_inr: 600, suggested_display_price_inr: 250, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Per unit", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-070", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "AC Service", service_name: "PCB repair/replacement", pricing_unit: "per AC", min_price_inr: 1700, max_price_inr: 3800, suggested_display_price_inr: 1700, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Brand/model dependent", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-071", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "AC Service", service_name: "Outdoor-unit wall stand", pricing_unit: "per unit", min_price_inr: 500, max_price_inr: 1000, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Material/installation may be separate", data_status: "Verified local catalog" },

  // Masonry
  { record_id: "IND-SVC-072", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Masonry", service_name: "Mason visit / small repair", pricing_unit: "per visit", min_price_inr: 300, max_price_inr: 600, suggested_display_price_inr: 300, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Minimum labour charge", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-073", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Masonry", service_name: "Mason full-day charge", pricing_unit: "per day", min_price_inr: 700, max_price_inr: 1300, suggested_display_price_inr: 700, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Helper ₹500–₹800/day extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-074", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Masonry", service_name: "Brickwork", pricing_unit: "per sq ft", min_price_inr: 30, max_price_inr: 60, suggested_display_price_inr: 30, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Labour only", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-075", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Masonry", service_name: "Wall plastering", pricing_unit: "per sq ft", min_price_inr: 15, max_price_inr: 35, suggested_display_price_inr: 15, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Labour only", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-076", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Masonry", service_name: "Wall crack repair", pricing_unit: "per job", min_price_inr: 500, max_price_inr: 3000, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Crack type and length affect price", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-077", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Masonry", service_name: "Cement floor repair", pricing_unit: "per sq ft", min_price_inr: 25, max_price_inr: 60, suggested_display_price_inr: 25, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Labour only", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-078", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Masonry", service_name: "Tile replacement", pricing_unit: "per tile", min_price_inr: 150, max_price_inr: 400, suggested_display_price_inr: 150, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Tile and adhesive extra", data_status: "Verified local catalog", popular: true },
  { record_id: "IND-SVC-079", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Masonry", service_name: "Tile fixing", pricing_unit: "per sq ft", min_price_inr: 25, max_price_inr: 60, suggested_display_price_inr: 25, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Labour only", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-080", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Masonry", service_name: "Bathroom repair/renovation", pricing_unit: "per bathroom", min_price_inr: 5000, max_price_inr: 30000, suggested_display_price_inr: 5000, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Labour only; scope dependent", data_status: "Verified local catalog" },

  // Welding
  { record_id: "IND-SVC-081", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Welding", service_name: "Small welding repair visit", pricing_unit: "per visit", min_price_inr: 500, max_price_inr: 1000, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Minimum visit/fabrication charge", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-082", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Welding", service_name: "Gate repair", pricing_unit: "per job", min_price_inr: 800, max_price_inr: 3000, suggested_display_price_inr: 800, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Hardware and metal extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-083", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Welding", service_name: "Grill repair", pricing_unit: "per section", min_price_inr: 700, max_price_inr: 2500, suggested_display_price_inr: 700, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Per repaired section", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-084", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Welding", service_name: "New window grill", pricing_unit: "per sq ft", min_price_inr: 250, max_price_inr: 500, suggested_display_price_inr: 250, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Material-inclusive indicative range", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-085", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Welding", service_name: "MS gate fabrication", pricing_unit: "per sq ft", min_price_inr: 350, max_price_inr: 700, suggested_display_price_inr: 350, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Metal thickness/design/paint affect price", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-086", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Welding", service_name: "Balcony/stair railing", pricing_unit: "per running ft", min_price_inr: 500, max_price_inr: 1200, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Material and design dependent", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-087", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Welding", service_name: "Full-day welder", pricing_unit: "per day", min_price_inr: 900, max_price_inr: 1800, suggested_display_price_inr: 900, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Tools/electricity/consumables may be extra", data_status: "Verified local catalog" },

  // Deep Cleaning
  { record_id: "IND-SVC-088", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Deep Cleaning", service_name: "Bathroom deep cleaning", pricing_unit: "per bathroom", min_price_inr: 400, max_price_inr: 800, suggested_display_price_inr: 400, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Per bathroom", data_status: "Verified local catalog", popular: true },
  { record_id: "IND-SVC-089", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Deep Cleaning", service_name: "Kitchen deep cleaning", pricing_unit: "per kitchen", min_price_inr: 800, max_price_inr: 2000, suggested_display_price_inr: 800, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Chimney/interior appliances may be separate", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-090", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Deep Cleaning", service_name: "Sofa cleaning", pricing_unit: "per set", min_price_inr: 500, max_price_inr: 1500, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Seats and fabric affect price", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-091", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Deep Cleaning", service_name: "Mattress cleaning", pricing_unit: "per mattress", min_price_inr: 400, max_price_inr: 900, suggested_display_price_inr: 400, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Per mattress", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-092", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Deep Cleaning", service_name: "Carpet cleaning", pricing_unit: "per carpet", min_price_inr: 300, max_price_inr: 1000, suggested_display_price_inr: 300, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "May be priced per sq ft", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-093", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Deep Cleaning", service_name: "Refrigerator cleaning", pricing_unit: "per unit", min_price_inr: 300, max_price_inr: 700, suggested_display_price_inr: 300, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Internal cleaning only", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-094", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Deep Cleaning", service_name: "Chimney cleaning", pricing_unit: "per unit", min_price_inr: 500, max_price_inr: 1200, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Heavy grease may cost more", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-095", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Deep Cleaning", service_name: "Water-tank cleaning", pricing_unit: "per tank", min_price_inr: 800, max_price_inr: 2500, suggested_display_price_inr: 800, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Capacity dependent", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-096", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Deep Cleaning", service_name: "1BHK deep cleaning", pricing_unit: "per home", min_price_inr: 1500, max_price_inr: 3000, suggested_display_price_inr: 1500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Occupied/vacant affects price", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-097", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Deep Cleaning", service_name: "2BHK deep cleaning", pricing_unit: "per home", min_price_inr: 2500, max_price_inr: 4500, suggested_display_price_inr: 2500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Standard rooms and bathrooms", data_status: "Verified local catalog", popular: true },
  { record_id: "IND-SVC-098", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Deep Cleaning", service_name: "3BHK deep cleaning", pricing_unit: "per home", min_price_inr: 3500, max_price_inr: 6000, suggested_display_price_inr: 3500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Furniture/condition affect price", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-099", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Deep Cleaning", service_name: "Post-construction cleaning", pricing_unit: "per sq ft", min_price_inr: 5, max_price_inr: 15, suggested_display_price_inr: 5, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Debris disposal may be separate", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-100", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Deep Cleaning", service_name: "Office deep cleaning", pricing_unit: "per sq ft", min_price_inr: 3, max_price_inr: 12, suggested_display_price_inr: 3, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Scope/frequency dependent", data_status: "Verified local catalog" },

  // Appliance Repair
  { record_id: "IND-SVC-101", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Appliance Repair", service_name: "Inspection / visit fee", pricing_unit: "per visit", min_price_inr: 199, max_price_inr: 499, suggested_display_price_inr: 199, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Can be adjusted against repair", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-102", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Appliance Repair", service_name: "Washing-machine repair labour", pricing_unit: "per job", min_price_inr: 300, max_price_inr: 1200, suggested_display_price_inr: 300, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Spare parts extra", data_status: "Verified local catalog", popular: true },
  { record_id: "IND-SVC-103", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Appliance Repair", service_name: "Washing-machine installation", pricing_unit: "per unit", min_price_inr: 300, max_price_inr: 700, suggested_display_price_inr: 300, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Inlet/outlet connection extra if needed", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-104", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Appliance Repair", service_name: "Refrigerator repair labour", pricing_unit: "per job", min_price_inr: 400, max_price_inr: 1500, suggested_display_price_inr: 400, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Compressor, gas and PCB extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-105", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Appliance Repair", service_name: "Refrigerator gas refill", pricing_unit: "per unit", min_price_inr: 1500, max_price_inr: 3500, suggested_display_price_inr: 1500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Model and refrigerant dependent", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-106", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Appliance Repair", service_name: "TV repair inspection", pricing_unit: "per visit", min_price_inr: 300, max_price_inr: 600, suggested_display_price_inr: 300, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Parts extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-107", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Appliance Repair", service_name: "LED TV repair", pricing_unit: "per job", min_price_inr: 500, max_price_inr: 3000, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Panel replacement can be much higher", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-108", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Appliance Repair", service_name: "Microwave repair labour", pricing_unit: "per job", min_price_inr: 400, max_price_inr: 1200, suggested_display_price_inr: 400, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Magnetron/PCB/door parts extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-109", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Appliance Repair", service_name: "Geyser repair labour", pricing_unit: "per job", min_price_inr: 300, max_price_inr: 900, suggested_display_price_inr: 300, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Heating element/thermostat extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-110", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Appliance Repair", service_name: "Geyser installation", pricing_unit: "per unit", min_price_inr: 500, max_price_inr: 1200, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Plumbing/electrical accessories extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-111", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Appliance Repair", service_name: "RO/water-purifier service", pricing_unit: "per unit", min_price_inr: 300, max_price_inr: 800, suggested_display_price_inr: 300, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Filters/membrane extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-112", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Appliance Repair", service_name: "RO installation", pricing_unit: "per unit", min_price_inr: 500, max_price_inr: 1000, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Pipe, connector and stand extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-113", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Appliance Repair", service_name: "Induction cooktop repair", pricing_unit: "per job", min_price_inr: 300, max_price_inr: 1000, suggested_display_price_inr: 300, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "PCB/coil parts extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-114", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Appliance Repair", service_name: "Mixer grinder repair", pricing_unit: "per job", min_price_inr: 200, max_price_inr: 700, suggested_display_price_inr: 200, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Jar, motor/coupler extra", data_status: "Verified local catalog" },

  // Flooring
  { record_id: "IND-SVC-115", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Flooring", service_name: "Broken-tile replacement", pricing_unit: "per tile", min_price_inr: 150, max_price_inr: 400, suggested_display_price_inr: 150, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Tile, adhesive and grout extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-116", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Flooring", service_name: "Ceramic/vitrified tile fitting", pricing_unit: "per sq ft", min_price_inr: 25, max_price_inr: 60, suggested_display_price_inr: 25, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Labour only", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-117", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Flooring", service_name: "Large-format tile fitting", pricing_unit: "per sq ft", min_price_inr: 40, max_price_inr: 90, suggested_display_price_inr: 40, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Higher precision needed", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-118", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Flooring", service_name: "Marble installation", pricing_unit: "per sq ft", min_price_inr: 50, max_price_inr: 120, suggested_display_price_inr: 50, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Cutting/polishing may be separate", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-119", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Flooring", service_name: "Granite installation", pricing_unit: "per sq ft", min_price_inr: 80, max_price_inr: 180, suggested_display_price_inr: 80, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Material/thickness affect price", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-120", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Flooring", service_name: "Wooden/vinyl flooring installation", pricing_unit: "per sq ft", min_price_inr: 20, max_price_inr: 60, suggested_display_price_inr: 20, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Material extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-121", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Flooring", service_name: "Floor grinding/polishing", pricing_unit: "per sq ft", min_price_inr: 15, max_price_inr: 80, suggested_display_price_inr: 15, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Surface and condition dependent", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-122", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Flooring", service_name: "Tile grouting", pricing_unit: "per sq ft", min_price_inr: 8, max_price_inr: 25, suggested_display_price_inr: 8, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Epoxy grout costs more", data_status: "Verified local catalog" },

  // Waterproofing
  { record_id: "IND-SVC-123", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Waterproofing", service_name: "Terrace waterproofing", pricing_unit: "per sq ft", min_price_inr: 35, max_price_inr: 100, suggested_display_price_inr: 35, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Preparation/material affect rate", data_status: "Verified local catalog", popular: true },
  { record_id: "IND-SVC-124", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Waterproofing", service_name: "Bathroom waterproofing", pricing_unit: "per sq ft", min_price_inr: 50, max_price_inr: 150, suggested_display_price_inr: 50, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Complete treatment may require tile removal", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-125", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Waterproofing", service_name: "Balcony waterproofing", pricing_unit: "per sq ft", min_price_inr: 40, max_price_inr: 120, suggested_display_price_inr: 40, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Drain/slope correction extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-126", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Waterproofing", service_name: "Basement waterproofing", pricing_unit: "per sq ft", min_price_inr: 80, max_price_inr: 250, suggested_display_price_inr: 80, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Excavation/access increase cost", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-127", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Waterproofing", service_name: "Wall dampness treatment", pricing_unit: "per sq ft", min_price_inr: 30, max_price_inr: 100, suggested_display_price_inr: 30, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Root-cause repair quoted separately", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-128", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Waterproofing", service_name: "Crack sealing", pricing_unit: "per running ft", min_price_inr: 50, max_price_inr: 200, suggested_display_price_inr: 50, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Crack width/depth/material dependent", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-129", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Waterproofing", service_name: "Water-tank waterproofing", pricing_unit: "per sq ft", min_price_inr: 20, max_price_inr: 60, suggested_display_price_inr: 20, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Food-safe coating may cost more", data_status: "Verified local catalog" },

  // Solar Install
  { record_id: "IND-SVC-130", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Solar Install", service_name: "Site survey", pricing_unit: "per visit", min_price_inr: 0, max_price_inr: 1000, suggested_display_price_inr: 0, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "May be free after confirmed order", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-131", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Solar Install", service_name: "Solar-panel cleaning", pricing_unit: "per panel", min_price_inr: 10, max_price_inr: 30, suggested_display_price_inr: 10, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Minimum booking ₹300–₹600", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-132", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Solar Install", service_name: "Small solar-system inspection", pricing_unit: "per visit", min_price_inr: 500, max_price_inr: 1500, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Fault diagnosis only", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-133", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Solar Install", service_name: "Solar-panel installation labour", pricing_unit: "per job", min_price_inr: 3000, max_price_inr: 8000, suggested_display_price_inr: 3000, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Small rooftop system; equipment extra", data_status: "Verified local catalog", urgent: true },
  { record_id: "IND-SVC-134", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Solar Install", service_name: "Rooftop mounting-structure installation", pricing_unit: "per job", min_price_inr: 2000, max_price_inr: 8000, suggested_display_price_inr: 2000, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Roof type/frame affect price", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-135", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Solar Install", service_name: "Solar-inverter installation", pricing_unit: "per unit", min_price_inr: 1000, max_price_inr: 3000, suggested_display_price_inr: 1000, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Wiring/protection devices extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-136", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Solar Install", service_name: "Solar-battery installation", pricing_unit: "per unit", min_price_inr: 500, max_price_inr: 1500, suggested_display_price_inr: 500, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Battery equipment extra", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-137", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Solar Install", service_name: "Solar-water-heater installation", pricing_unit: "per unit", min_price_inr: 2000, max_price_inr: 6000, suggested_display_price_inr: 2000, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Capacity/plumbing affect price", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-138", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Solar Install", service_name: "Solar-system maintenance visit", pricing_unit: "per visit", min_price_inr: 800, max_price_inr: 2500, suggested_display_price_inr: 800, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Replacement parts excluded", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-139", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Solar Install", service_name: "Complete residential rooftop system installation", pricing_unit: "per job", min_price_inr: 5000, max_price_inr: 15000, suggested_display_price_inr: 5000, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Labour only; equipment/approvals excluded", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-140", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Solar Install", service_name: "Net-metering documentation support", pricing_unit: "per application", min_price_inr: 1000, max_price_inr: 5000, suggested_display_price_inr: 1000, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Clarify official fees separately", data_status: "Verified local catalog" },

  // Pest Control
  { record_id: "IND-SVC-141", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Pest Control", service_name: "Cockroach & ant herbal gel treatment", pricing_unit: "per service", min_price_inr: 499, max_price_inr: 1200, suggested_display_price_inr: 499, price_type: "Indicative local market range", materials_or_parts_included: "Yes", notes: "1BHK/2BHK odorless gel application, kitchen & cabinets", data_status: "Verified local catalog", popular: true },
  { record_id: "IND-SVC-142", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Pest Control", service_name: "Bed bug eradication treatment", pricing_unit: "per service", min_price_inr: 799, max_price_inr: 2200, suggested_display_price_inr: 799, price_type: "Indicative local market range", materials_or_parts_included: "Yes", notes: "2-session chemical spray and hot air steaming", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-143", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Pest Control", service_name: "Termite drill & injection barrier treatment", pricing_unit: "per service", min_price_inr: 1499, max_price_inr: 4500, suggested_display_price_inr: 1499, price_type: "Indicative local market range", materials_or_parts_included: "Yes", notes: "Wall/skirting drilling, chemical pumping & sealing with 2-yr warranty", data_status: "Verified local catalog", popular: true },
  { record_id: "IND-SVC-144", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Pest Control", service_name: "Mosquito thermal fogging & larvicide spray", pricing_unit: "per service", min_price_inr: 699, max_price_inr: 1800, suggested_display_price_inr: 699, price_type: "Indicative local market range", materials_or_parts_included: "Yes", notes: "Society premises, garden & drainage spray", data_status: "Verified local catalog" },
  { record_id: "IND-SVC-145", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Pest Control", service_name: "Full building commercial pest management", pricing_unit: "per service", min_price_inr: 2499, max_price_inr: 7500, suggested_display_price_inr: 2499, price_type: "Indicative local market range", materials_or_parts_included: "Yes", notes: "Warehouses, offices, restaurants; team treatment with compliance certificate", data_status: "Verified local catalog", urgent: true },
  { record_id: "IND-SVC-146", city: "Indore", state: "Madhya Pradesh", currency: "INR", category: "Pest Control", service_name: "Pest inspection & infestation audit", pricing_unit: "per visit", min_price_inr: 199, max_price_inr: 499, suggested_display_price_inr: 199, price_type: "Indicative local market range", materials_or_parts_included: "No", notes: "Pre-construction & general infestation survey with report", data_status: "Verified local catalog" }
];

// Enrich services with default worker requirements
const enrichedDataset: ServiceItem[] = RAW_SERVICES_DATASET.map((service) => {
  const name = service.service_name.toLowerCase();
  const cat = service.category.toLowerCase();

  // 1. Compulsory Multi-Worker Services
  if (
    name.includes('solar rooftop') ||
    name.includes('solar-panel installation') ||
    name.includes('mounting-structure') ||
    name.includes('terrace waterproofing') ||
    name.includes('basement waterproofing') ||
    name.includes('marble installation') ||
    name.includes('granite installation') ||
    name.includes('post-construction') ||
    name.includes('full building') ||
    name.includes('gate fabrication') ||
    name.includes('complete residential rooftop')
  ) {
    return {
      ...service,
      minimum_workers: 2,
      recommended_workers: 3,
      worker_requirement_type: 'MULTI_WORKER_COMPULSORY',
      pricing_model: 'PER_JOB',
      team_roles: [
        cat.includes('solar') ? 'Lead Solar Electrical Engineer' : 'Lead Master Craftsman',
        cat.includes('solar') ? 'Solar Structural Rigger' : 'Assistant Craftsman',
        'Support Technician'
      ],
    };
  }

  // 2. Conditional Multi-Worker Services
  if (
    cat.includes('pest') ||
    cat.includes('cleaning') ||
    name.includes('ac installation') ||
    name.includes('ac uninstallation') ||
    name.includes('dampness treatment') ||
    name.includes('deep clean') ||
    name.includes('waterproofing') ||
    name.includes('flooring') ||
    name.includes('railing') ||
    name.includes('grill') ||
    name.includes('water-heater installation')
  ) {
    return {
      ...service,
      minimum_workers: 1,
      recommended_workers: 2,
      worker_requirement_type: 'MULTI_WORKER_CONDITIONAL',
      pricing_model: cat.includes('ac') ? 'PER_UNIT' : 'PER_JOB',
      team_roles: ['Lead Specialist', 'Assistant Specialist', 'Support Helper'],
      worker_requirement_rules: [
        {
          id: `rule-${service.record_id}-heavy`,
          name: 'Large Scope / Commercial Rule',
          conditionDescription: 'Property >= 3BHK or Area > 1200 sq ft or Termite / Heavy treatment',
          minWorkers: 2,
          recommendedWorkers: 3,
          reason: 'Job scale or occupational chemical handling requires 2–3 trained artisans.',
          criteria: {
            propertyTypes: ['3BHK', '4BHK+', 'Villa', 'Commercial', 'Warehouse / Industrial'],
            minAreaSqFt: 1200,
            treatmentTypes: ['Termite', 'Full Building Termite', 'Mosquito Fogging'],
            postConstruction: true,
          }
        }
      ]
    };
  }

  // 3. Single-Worker by default
  return {
    ...service,
    minimum_workers: 1,
    recommended_workers: 1,
    worker_requirement_type: 'SINGLE_WORKER',
    pricing_model: 'PER_JOB',
    team_roles: ['Certified Artisan'],
  };
});

export const INDORE_SERVICES_DATASET: ServiceItem[] = enrichedDataset;

export function getDatasetSummary() {
  const totalRecords = INDORE_SERVICES_DATASET.length;
  const categories = Array.from(new Set(INDORE_SERVICES_DATASET.map((s) => s.category)));
  const verifiedCount = INDORE_SERVICES_DATASET.filter((s) => s.data_status.includes('Verified')).length;
  const minRate = Math.min(...INDORE_SERVICES_DATASET.map((s) => s.min_price_inr));
  const maxRate = Math.max(...INDORE_SERVICES_DATASET.map((s) => s.max_price_inr));

  return {
    totalRecords,
    categoriesCount: categories.length,
    verifiedCount,
    minRate,
    maxRate,
    categories,
  };
}
