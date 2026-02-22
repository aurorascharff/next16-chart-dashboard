export const REGIONS_DATA = [
  {
    countries: [
      { cities: ['New York', 'Los Angeles', 'Chicago'], name: 'United States' },
      { cities: ['Toronto', 'Vancouver', 'Montreal'], name: 'Canada' },
    ],
    name: 'North America',
  },
  {
    countries: [
      { cities: ['London', 'Manchester', 'Birmingham'], name: 'United Kingdom' },
      { cities: ['Berlin', 'Munich', 'Hamburg'], name: 'Germany' },
      { cities: ['Paris', 'Lyon', 'Marseille'], name: 'France' },
    ],
    name: 'Europe',
  },
  {
    countries: [
      { cities: ['Tokyo', 'Osaka', 'Kyoto'], name: 'Japan' },
      { cities: ['Seoul', 'Busan', 'Incheon'], name: 'South Korea' },
      { cities: ['Sydney', 'Melbourne', 'Brisbane'], name: 'Australia' },
    ],
    name: 'Asia Pacific',
  },
];

export const CATEGORIES = [
  { name: 'Electronics', subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Audio'] },
  { name: 'Clothing', subcategories: ["Men's", "Women's", 'Kids', 'Accessories'] },
  { name: 'Food', subcategories: ['Fresh', 'Packaged', 'Beverages', 'Snacks'] },
  { name: 'Home & Garden', subcategories: ['Furniture', 'Decor', 'Garden', 'Kitchen'] },
  { name: 'Sports', subcategories: ['Equipment', 'Apparel', 'Footwear', 'Outdoors'] },
];

export const MONTHS = [
  '2025-01',
  '2025-02',
  '2025-03',
  '2025-04',
  '2025-05',
  '2025-06',
  '2025-07',
  '2025-08',
  '2025-09',
  '2025-10',
  '2025-11',
  '2025-12',
];

export type MockSaleRecord = {
  month: string;
  revenue: number;
  units: number;
  city: string;
  country: string;
  region: string;
  subcategory: string;
  category: string;
};

function seededRandom(seed: number) {
  // Simple deterministic pseudo-random so data is stable across runs
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildSeed(...parts: string[]) {
  return parts
    .join('|')
    .split('')
    .reduce((acc, c) => {
      return acc + c.charCodeAt(0);
    }, 0);
}

const SEASONALITY: Record<string, number> = {
  '2025-01': 0.7,
  '2025-02': 0.65,
  '2025-03': 0.8,
  '2025-04': 0.85,
  '2025-05': 0.95,
  '2025-06': 1.05,
  '2025-07': 1.0,
  '2025-08': 0.9,
  '2025-09': 1.1,
  '2025-10': 1.15,
  '2025-11': 1.4,
  '2025-12': 1.6,
};

const CATEGORY_WEIGHT: Record<string, number> = {
  Electronics: 2.5,
  Clothing: 1.4,
  'Home & Garden': 1.2,
  Sports: 1.0,
  Food: 0.7,
};

const REGION_SCALE: Record<string, number> = {
  'North America': 1.6,
  Europe: 1.2,
  'Asia Pacific': 1.0,
};

export const MOCK_SALES: MockSaleRecord[] = REGIONS_DATA.flatMap(region => {
  return region.countries.flatMap(country => {
    return country.cities.flatMap(city => {
      return CATEGORIES.flatMap(cat => {
        return cat.subcategories.flatMap(subcategory => {
          return MONTHS.map(month => {
            const seed = buildSeed(region.name, country.name, city, cat.name, subcategory, month);
            const monthIndex = parseInt(month.split('-')[1], 10);
            const trend = 1 + (monthIndex - 1) * 0.03;
            const season = SEASONALITY[month] ?? 1;
            const catWeight = CATEGORY_WEIGHT[cat.name] ?? 1;
            const regionScale = REGION_SCALE[region.name] ?? 1;
            const base = 2000 + seededRandom(seed) * 8000;
            const revenue = base * season * catWeight * regionScale * trend;
            const unitBase = 20 + seededRandom(seed + 1) * 80;
            const units = unitBase * season * trend;
            return {
              category: cat.name,
              city,
              country: country.name,
              month,
              region: region.name,
              revenue: Math.round(revenue * 100) / 100,
              subcategory,
              units: Math.floor(units),
            };
          });
        });
      });
    });
  });
});
