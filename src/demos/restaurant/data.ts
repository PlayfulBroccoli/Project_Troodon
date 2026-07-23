/**
 * Restaurant demo — config-driven content.
 *
 * This is a fictional brand built as a portfolio sample for NickBuilds, so it has
 * its own identity (not the studio's). Keeping every string/price here mirrors the
 * repo's config pattern (see src/config/site.ts, src/config/pricing.ts) and makes
 * the demo trivial to re-skin for a real client.
 */

export const restaurant = {
  name: 'Kuali Kitchen',
  monogram: 'KK',
  tagline: 'Smoky wok food, slow time',
  blurb:
    'A neighbourhood kitchen turning out South-East Asian street classics — pulled tea, charcoal noodles, rendang that’s been on the stove since dawn.',
  hours: 'Tue–Sun · 12:00–22:30',
  area: 'Bukit Bintang · KL',
  /** Where orders + bookings are sent. Uses the studio's WhatsApp helper for the link itself. */
  whatsappMessage: "Hi Kuali Kitchen! I'd like to place an order.",
  bookingMessage: "Hi Kuali Kitchen! I'd like to reserve a table.",
} as const

export type Category = 'Starters' | 'Mains' | 'Sides' | 'Drinks' | 'Desserts'

export type Dish = {
  id: string
  name: string
  desc: string
  /** RM — matches the currency used across the site. */
  price: number
  category: Category
  popular?: boolean
  veg?: boolean
}

export const categories: Category[] = ['Starters', 'Mains', 'Sides', 'Drinks', 'Desserts']

export const menu: Dish[] = [
  // Starters
  {
    id: 'roti',
    name: 'Roti Canai',
    desc: 'Hand-flipped flaky flatbread, curry dip.',
    price: 8,
    category: 'Starters',
    veg: true,
  },
  {
    id: 'satay',
    name: 'Chicken Satay',
    desc: 'Charcoal-grilled skewers, spiced peanut.',
    price: 14,
    category: 'Starters',
    popular: true,
  },
  // Mains
  {
    id: 'nasi-lemak',
    name: 'Nasi Lemak',
    desc: 'Coconut rice, sambal, peanut, half egg.',
    price: 16,
    category: 'Mains',
    popular: true,
    veg: true,
  },
  {
    id: 'char-kway-teow',
    name: 'Char Kway Teow',
    desc: 'Wok-charred flat noodles, prawn, chive.',
    price: 18,
    category: 'Mains',
  },
  {
    id: 'rendang',
    name: 'Beef Rendang Bowl',
    desc: 'Slow-braised eight hours, coconut rice.',
    price: 22,
    category: 'Mains',
  },
  {
    id: 'laksa',
    name: 'Laksa Lemak',
    desc: 'Spicy coconut broth, noodle, mint.',
    price: 17,
    category: 'Mains',
  },
  // Sides
  {
    id: 'pak-choi',
    name: 'Garlic Pak Choi',
    desc: 'Blanched, oyster glaze, garlic crisp.',
    price: 7,
    category: 'Sides',
    veg: true,
  },
  {
    id: 'spiced-fries',
    name: 'Chilli Salt Fries',
    desc: 'Hand-cut, lime, toasted chilli salt.',
    price: 9,
    category: 'Sides',
    veg: true,
  },
  // Drinks
  {
    id: 'teh-tarik',
    name: 'Teh Tarik',
    desc: 'Pulled black tea, condensed milk.',
    price: 6,
    category: 'Drinks',
    veg: true,
  },
  {
    id: 'lime-barley',
    name: 'Lime Barley',
    desc: 'House barley, fresh lime, ice.',
    price: 7,
    category: 'Drinks',
    veg: true,
  },
  {
    id: 'pandan-cooler',
    name: 'Pandan Cooler',
    desc: 'Iced pandan, young coconut.',
    price: 9,
    category: 'Drinks',
    popular: true,
    veg: true,
  },
  // Desserts
  {
    id: 'cendol',
    name: 'Cendol',
    desc: 'Pandan jelly, coconut, gula melaka.',
    price: 9,
    category: 'Desserts',
    veg: true,
  },
  {
    id: 'kuih',
    name: 'Kuih Platter',
    desc: 'Four bite-sized house sweets.',
    price: 11,
    category: 'Desserts',
    veg: true,
  },
]

/** Booking — lunch + dinner slots. */
export const bookingSlots: { label: string; service: 'Lunch' | 'Dinner' }[] = [
  { label: '12:00', service: 'Lunch' },
  { label: '12:30', service: 'Lunch' },
  { label: '13:00', service: 'Lunch' },
  { label: '13:30', service: 'Lunch' },
  { label: '18:00', service: 'Dinner' },
  { label: '18:30', service: 'Dinner' },
  { label: '19:00', service: 'Dinner' },
  { label: '19:30', service: 'Dinner' },
  { label: '20:00', service: 'Dinner' },
  { label: '20:30', service: 'Dinner' },
]

export const partySizes = [1, 2, 3, 4, 5, 6, 8]

/** Format a number as RM, matching money() in config/pricing.ts. */
export function money(n: number): string {
  return `RM ${n.toFixed(0)}`
}