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

const CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Home & Garden', 'Sports'];
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

        // Generate sales data for each city × category × month
        const salesRecords = [];
        for (const month of MONTHS) {
          for (const category of CATEGORIES) {
            salesRecords.push({
              category,
              cityId: city.id,
              month,
              revenue: randomRevenue(5000),
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
