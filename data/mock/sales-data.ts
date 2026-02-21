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

export const MOCK_SALES: MockSaleRecord[] = REGIONS_DATA.flatMap(region => {
  return region.countries.flatMap(country => {
    return country.cities.flatMap(city => {
      return CATEGORIES.flatMap(cat => {
        return cat.subcategories.flatMap(subcategory => {
          return MONTHS.map(month => {
            const seed = buildSeed(region.name, country.name, city, cat.name, subcategory, month);
            return {
              category: cat.name,
              city,
              country: country.name,
              month,
              region: region.name,
              revenue: Math.round((5000 + seededRandom(seed) * 5000) * 100) / 100,
              subcategory,
              units: Math.floor(50 + seededRandom(seed + 1) * 50),
            };
          });
        });
      });
    });
  });
});
