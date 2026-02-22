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

function hash(str: string) {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function buildSeed(...parts: string[]) {
  return hash(parts.join('|'));
}

// Each category has its own seasonal curve
//                               Jan  Feb  Mar  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec
const CATEGORY_SEASONALITY: Record<string, number[]> = {
  Electronics:    [0.6, 0.55, 0.7, 0.75, 0.8, 0.85, 0.8, 0.9, 1.0, 1.1, 1.6, 2.0],
  Clothing:       [0.7, 0.65, 1.0, 1.2, 1.1, 0.9, 0.7, 0.8, 1.1, 1.2, 1.3, 1.1],
  Food:           [0.9, 0.85, 0.9, 0.95, 1.0, 1.1, 1.15, 1.1, 1.0, 0.95, 1.05, 1.2],
  'Home & Garden':[0.5, 0.5, 0.8, 1.1, 1.4, 1.3, 1.2, 1.1, 0.9, 0.7, 0.6, 0.55],
  Sports:         [0.6, 0.65, 0.9, 1.1, 1.3, 1.5, 1.4, 1.2, 1.0, 0.8, 0.6, 0.55],
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

const COUNTRY_SCALE: Record<string, number> = {
  'United States': 1.8,
  Canada: 0.6,
  'United Kingdom': 1.0,
  Germany: 1.1,
  France: 0.9,
  Japan: 1.4,
  'South Korea': 0.8,
  Australia: 0.7,
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
            const season = CATEGORY_SEASONALITY[cat.name]?.[monthIndex - 1] ?? 1;
            const catWeight = CATEGORY_WEIGHT[cat.name] ?? 1;
            const regionScale = REGION_SCALE[region.name] ?? 1;
            const countryScale = COUNTRY_SCALE[country.name] ?? 1;
            const cityJitter = 0.7 + seededRandom(hash(city)) * 0.6;
            const subJitter = 0.6 + seededRandom(hash(subcategory + cat.name)) * 0.8;
            const base = 1500 + seededRandom(seed) * 10000;
            const revenue = base * season * catWeight * regionScale * countryScale * cityJitter * subJitter * trend;
            const unitBase = 15 + seededRandom(seed + 1) * 90;
            const units = unitBase * season * countryScale * cityJitter * trend;
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
