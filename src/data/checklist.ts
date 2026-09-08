export type ChecklistItem = {
  /** Stable id — used as the persistence key. Never renumber these. */
  id: string
  label: string
  /** Small piece of context printed beneath the item. */
  note?: string
}

export type Chapter = {
  id: string
  /** Two-digit chapter number, e.g. "01". */
  number: string
  title: string
  /** Quick visual identifier for the chapter, used wherever it's listed. */
  emoji: string
  /** One line of editorial context under the chapter title. */
  subtitle: string
  /** A short aside, printed in the margin of the page. */
  tip: string
  items: ChecklistItem[]
}

export const TRIP = {
  destination: 'Singapore',
  when: 'September 2026',
  kicker: 'Travel Checklist',
  flag: '🇸🇬',
  footer: 'Ready when you are.',
} as const

export const chapters: Chapter[] = [
  {
    id: 'essentials',
    number: '01',
    title: 'Essentials',
    emoji: '🛂',
    subtitle: 'The papers that decide whether the trip happens at all.',
    tip: 'If you check one thing today, check the expiry date on the passport.',
    items: [
      { id: 'ess-passport', label: 'Passport', note: 'Valid at least 6 months beyond arrival.' },
      { id: 'ess-visa', label: 'Singapore visa', note: 'Check whether your passport needs one.' },
      { id: 'ess-sgac', label: 'SG Arrival Card submitted', note: 'Free, online, within 3 days of arrival.' },
      { id: 'ess-flights', label: 'Flight tickets' },
      { id: 'ess-hotel', label: 'Hotel booking confirmation', note: 'Address saved offline for the arrival card.' },
      { id: 'ess-insurance', label: 'Travel insurance' },
      { id: 'ess-copies', label: 'Copies of passport & tickets', note: 'One printed, one in cloud storage.' },
      { id: 'ess-photos', label: 'Spare passport photos' },
      { id: 'ess-licence', label: 'Driving licence', note: 'Only if you plan to rent.' },
      { id: 'ess-contacts', label: 'Emergency contacts written down' },
    ],
  },
  {
    id: 'clothes',
    number: '02',
    title: 'Clothes',
    emoji: '👕',
    subtitle: 'Keep it light. Singapore is hot and humid.',
    tip: 'Two of everything is plenty. There is a laundry on every block.',
    items: [
      { id: 'clo-tees', label: 'Breathable t-shirts / tops', note: 'Cotton and linen over synthetics.' },
      { id: 'clo-shorts', label: 'Shorts' },
      { id: 'clo-trousers', label: 'Light trousers', note: 'For temples and smarter restaurants.' },
      { id: 'clo-smart', label: 'One smart outfit', note: 'Some rooftop bars enforce a dress code.' },
      { id: 'clo-underwear', label: 'Underwear & socks' },
      { id: 'clo-sleep', label: 'Sleepwear' },
      { id: 'clo-swim', label: 'Swimwear', note: 'Hotel pools, Sentosa, Jewel.' },
      { id: 'clo-rain', label: 'Packable rain jacket or poncho' },
      { id: 'clo-layer', label: 'Light cardigan or overshirt', note: 'Indoor air conditioning is fierce.' },
      { id: 'clo-shoes', label: 'Comfortable walking shoes' },
      { id: 'clo-sandals', label: 'Sandals or slides' },
      { id: 'clo-hat', label: 'Cap or hat' },
      { id: 'clo-sunglasses', label: 'Sunglasses' },
      { id: 'clo-bag', label: 'Small day bag' },
    ],
  },
  {
    id: 'toiletries',
    number: '03',
    title: 'Toiletries',
    emoji: '🧴',
    subtitle: 'Anything over 100ml goes in the hold, not the cabin.',
    tip: 'Hotels cover the basics. Pack only what you are fussy about.',
    items: [
      { id: 'toi-brush', label: 'Toothbrush & toothpaste' },
      { id: 'toi-deodorant', label: 'Deodorant' },
      { id: 'toi-sunscreen', label: 'Sunscreen SPF 50', note: 'You will use more than you think.' },
      { id: 'toi-aftersun', label: 'After-sun or aloe gel' },
      { id: 'toi-hair', label: 'Shampoo & conditioner' },
      { id: 'toi-wash', label: 'Body wash or soap' },
      { id: 'toi-razor', label: 'Razor & shaving gel' },
      { id: 'toi-comb', label: 'Comb or brush' },
      { id: 'toi-moisturiser', label: 'Moisturiser' },
      { id: 'toi-lipbalm', label: 'Lip balm with SPF' },
      { id: 'toi-hygiene', label: 'Feminine hygiene products' },
      { id: 'toi-clippers', label: 'Nail clippers', note: 'Hold luggage only.' },
      { id: 'toi-towel', label: 'Quick-dry travel towel' },
      { id: 'toi-laundry', label: 'Laundry sheets', note: 'Humidity means you will re-wash.' },
    ],
  },
  {
    id: 'health',
    number: '04',
    title: 'Health',
    emoji: '💊',
    subtitle: 'A small kit that saves an afternoon of your trip.',
    tip: 'Pharmacies here are excellent, though not at 2am on Pulau Ubin.',
    items: [
      { id: 'hea-prescription', label: 'Prescription medication', note: 'Keep it in original packaging.' },
      { id: 'hea-letter', label: 'Doctor’s letter for medication', note: 'Singapore restricts some drugs. Check the HSA rules.' },
      { id: 'hea-painkillers', label: 'Paracetamol / ibuprofen' },
      { id: 'hea-stomach', label: 'Anti-diarrhoeal & indigestion tablets' },
      { id: 'hea-antihistamine', label: 'Antihistamines' },
      { id: 'hea-rehydration', label: 'Rehydration salts', note: 'Genuinely useful in this heat.' },
      { id: 'hea-plasters', label: 'Plasters & blister pads' },
      { id: 'hea-antiseptic', label: 'Antiseptic cream' },
      { id: 'hea-repellent', label: 'Insect repellent', note: 'Dengue is present year-round.' },
      { id: 'hea-sanitiser', label: 'Hand sanitiser' },
      { id: 'hea-masks', label: 'Face masks' },
      { id: 'hea-vaccination', label: 'Vaccination records' },
    ],
  },
  {
    id: 'electronics',
    number: '05',
    title: 'Electronics',
    emoji: '📱',
    subtitle: 'Type G sockets, 230V. Bring the right adapter.',
    tip: 'The adapter is the one thing you cannot improvise at midnight.',
    items: [
      { id: 'ele-phone', label: 'Phone & charger' },
      { id: 'ele-adapter', label: 'Type G plug adapter', note: 'Same three-pin plug as the UK.' },
      { id: 'ele-powerbank', label: 'Power bank', note: 'Cabin baggage only, never in the hold.' },
      { id: 'ele-cables', label: 'Spare cables' },
      { id: 'ele-earphones', label: 'Earphones' },
      { id: 'ele-camera', label: 'Camera, batteries & memory cards' },
      { id: 'ele-esim', label: 'eSIM or local SIM arranged' },
      { id: 'ele-laptop', label: 'Laptop or tablet' },
      { id: 'ele-pouch', label: 'Waterproof phone pouch', note: 'For rain and for Sentosa.' },
      { id: 'ele-fan', label: 'Portable fan' },
    ],
  },
  {
    id: 'money',
    number: '06',
    title: 'Money',
    emoji: '💳',
    subtitle: 'Cards work almost everywhere. Almost.',
    tip: 'A little cash for the older stalls, a card for everything else.',
    items: [
      { id: 'mon-notify', label: 'Bank notified of travel dates' },
      { id: 'mon-cards', label: 'Cards that work abroad', note: 'Bring a second one, stored separately.' },
      { id: 'mon-cash', label: 'Some Singapore dollars in cash' },
      { id: 'mon-transit', label: 'Contactless card or EZ-Link for MRT', note: 'SimplyGo takes most contactless cards.' },
      { id: 'mon-wallet', label: 'Digital wallet set up on phone' },
      { id: 'mon-budget', label: 'Daily budget agreed' },
      { id: 'mon-hawker', label: 'Small change for hawker stalls', note: 'A few older stalls are still cash only.' },
      { id: 'mon-emergency', label: 'Emergency cash hidden in luggage' },
    ],
  },
  {
    id: 'before-flight',
    number: '07',
    title: 'Before Flight',
    emoji: '✈️',
    subtitle: 'The last twenty-four hours, in order.',
    tip: 'Do all of this the night before. Mornings lie to you about time.',
    items: [
      { id: 'bef-checkin', label: 'Online check-in done' },
      { id: 'bef-seats', label: 'Seats selected' },
      { id: 'bef-boarding', label: 'Boarding pass saved offline' },
      { id: 'bef-weigh', label: 'Baggage weighed' },
      { id: 'bef-liquids', label: 'Liquids in a 100ml clear bag' },
      { id: 'bef-powerbank', label: 'Power bank moved to hand luggage' },
      { id: 'bef-sgac', label: 'Arrival card submitted', note: 'Must be within 3 days of arrival.' },
      { id: 'bef-maps', label: 'Offline maps downloaded' },
      { id: 'bef-transfer', label: 'Airport transfer booked at both ends' },
      { id: 'bef-arrive', label: 'Leave for the airport 3 hours early' },
    ],
  },
  {
    id: 'weather',
    number: '08',
    title: 'Weather',
    emoji: '🌦️',
    subtitle: '26-34°C, humid, with a thunderstorm most afternoons.',
    tip: 'The rain is warm, heavy and brief. Plan around it, not for it.',
    items: [
      { id: 'wea-umbrella', label: 'Compact umbrella', note: 'September sits between monsoons, so showers are short and heavy.' },
      { id: 'wea-quickdry', label: 'Quick-dry fabrics packed' },
      { id: 'wea-bottle', label: 'Refillable water bottle', note: 'Tap water is safe to drink.' },
      { id: 'wea-chafe', label: 'Anti-chafe balm or powder' },
      { id: 'wea-spare', label: 'Spare shirt in the day bag' },
      { id: 'wea-haze', label: 'Haze forecast checked', note: 'NEA publishes the daily PSI reading.' },
      { id: 'wea-indoor', label: 'Indoor backup plans noted', note: 'Museums and malls for the wet hours.' },
    ],
  },
  {
    id: 'activities',
    number: '09',
    title: 'Activities',
    emoji: '🏝️',
    subtitle: 'Book the timed ones now. Wander the rest.',
    tip: 'Two a day is the honest limit. The heat wins the third one.',
    items: [
      { id: 'act-gardens', label: 'Gardens by the Bay', note: 'Supertree light show at 7.45pm and 8.45pm.' },
      { id: 'act-mbs', label: 'Marina Bay Sands SkyPark' },
      { id: 'act-sentosa', label: 'Sentosa & Universal Studios' },
      { id: 'act-zoo', label: 'Singapore Zoo or Night Safari' },
      { id: 'act-jewel', label: 'Jewel Changi Rain Vortex', note: 'Worth arriving early on the way home.' },
      { id: 'act-neighbourhoods', label: 'Chinatown, Little India, Kampong Glam' },
      { id: 'act-hawker', label: 'Hawker centre crawl', note: 'Maxwell, Lau Pa Sat, Old Airport Road.' },
      { id: 'act-botanic', label: 'Botanic Gardens & National Orchid Garden' },
      { id: 'act-merlion', label: 'Merlion Park at dusk' },
      { id: 'act-ubin', label: 'Pulau Ubin day trip' },
      { id: 'act-tickets', label: 'Timed tickets booked in advance' },
    ],
  },
  {
    id: 'before-leaving',
    number: '10',
    title: 'Before Leaving Home',
    emoji: '🏠',
    subtitle: 'The walk-through you do with your coat already on.',
    tip: 'Walk through the house once more with this page open.',
    items: [
      { id: 'lea-passport', label: 'Passport actually in the bag', note: 'Check it. Then check it again.' },
      { id: 'lea-lock', label: 'Windows and doors locked' },
      { id: 'lea-unplug', label: 'Appliances unplugged' },
      { id: 'lea-fridge', label: 'Fridge cleared of anything perishable' },
      { id: 'lea-bins', label: 'Bins taken out' },
      { id: 'lea-water', label: 'Water heater and heating off' },
      { id: 'lea-plants', label: 'Plants and pets arranged' },
      { id: 'lea-keys', label: 'Spare keys with a neighbour' },
      { id: 'lea-itinerary', label: 'Itinerary shared with family' },
      { id: 'lea-charge', label: 'Everything charged' },
      { id: 'lea-roaming', label: 'Roaming or eSIM switched on' },
      { id: 'lea-alarm', label: 'Alarm set' },
    ],
  },
]

export const allItemIds: string[] = chapters.flatMap((c) => c.items.map((i) => i.id))
export const totalItems = allItemIds.length

/** The verb each chapter counts in — "8 / 15 packed", "3 / 11 planned". */
export const chapterUnit: Record<string, string> = {
  essentials: 'in order',
  clothes: 'packed',
  toiletries: 'packed',
  health: 'packed',
  electronics: 'packed',
  money: 'sorted',
  'before-flight': 'done',
  weather: 'ready',
  activities: 'planned',
  'before-leaving': 'done',
}
