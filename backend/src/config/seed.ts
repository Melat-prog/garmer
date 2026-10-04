import { prisma } from '../models/prisma';

const DEFAULT_CATEGORIES = [
  "Men's Wear",
  "Women's Wear",
  "Children's Wear",
  "Sportswear",
  "Workwear",
  "Fabrics & Textiles"
];

export const seedCategories = async (): Promise<void> => {
  try {
    for (const name of DEFAULT_CATEGORIES) {
      await prisma.category.upsert({
        where: { name },
        update: {},
        create: { name }
      });
    }
    console.log('Categories verified and seeded safely.');
  } catch (error) {
    console.error('Category Seeding Error:', error);
  }
};
