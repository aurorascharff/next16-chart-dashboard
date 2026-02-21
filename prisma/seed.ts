/* eslint-disable no-console */
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:dev.db',
});

const prisma = new PrismaClient({ adapter });

const REGIONS_DATA = [
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

const CATEGORIES = [
  {
    name: 'Electronics',
    subcategories: ['Smartphones', 'Laptops', 'Tablets', 'Audio'],
  },
  {
    name: 'Clothing',
    subcategories: ["Men's", "Women's", 'Kids', 'Accessories'],
  },
  {
    name: 'Food',
    subcategories: ['Fresh', 'Packaged', 'Beverages', 'Snacks'],
  },
  {
    name: 'Home & Garden',
    subcategories: ['Furniture', 'Decor', 'Garden', 'Kitchen'],
  },
  {
    name: 'Sports',
    subcategories: ['Equipment', 'Apparel', 'Footwear', 'Outdoors'],
  },
];
const MONTHS = [
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

function randomRevenue(base: number) {
  return Math.round((base + Math.random() * base) * 100) / 100;
}

function randomUnits(base: number) {
  return Math.floor(base + Math.random() * base);
}

async function main() {
  console.log('🌱 Seeding database...');

  // Clear
  await prisma.salesData.deleteMany();
  await prisma.city.deleteMany();
  await prisma.country.deleteMany();
  await prisma.region.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();

  // Create categories and subcategories
  const subcategoryIds: string[] = [];
  for (const catData of CATEGORIES) {
    const category = await prisma.category.create({
      data: { name: catData.name },
    });

    for (const subName of catData.subcategories) {
      const sub = await prisma.subcategory.create({
        data: { categoryId: category.id, name: subName },
      });
      subcategoryIds.push(sub.id);
    }
  }

  for (const regionData of REGIONS_DATA) {
    const region = await prisma.region.create({
      data: { name: regionData.name },
    });

    for (const countryData of regionData.countries) {
      const country = await prisma.country.create({
        data: { name: countryData.name, regionId: region.id },
      });

      for (const cityName of countryData.cities) {
        const city = await prisma.city.create({
          data: { countryId: country.id, name: cityName },
        });

        // Generate sales data for each city × subcategory × month
        const salesRecords = [];
        for (const month of MONTHS) {
          for (const subcategoryId of subcategoryIds) {
            salesRecords.push({
              cityId: city.id,
              month,
              revenue: randomRevenue(5000),
              subcategoryId,
              units: randomUnits(50),
            });
          }
        }

        await prisma.salesData.createMany({ data: salesRecords });
      }
    }
  }

  console.log('✅ Seeding complete!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
