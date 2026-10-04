import { prisma } from '../models/prisma';
import { adminAuth } from './firebase';

export const seedAdmin = async (): Promise<void> => {
  const adminEmail = process.env.GARMER_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@garmer.local';
  const adminPassword = process.env.GARMER_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;

  try {
    let firebaseUser: any = null;

    // 1. Try to find user in Firebase Authentication
    try {
      firebaseUser = await adminAuth.getUserByEmail(adminEmail);
    } catch (err: any) {
      if (err?.code !== 'auth/user-not-found') {
        console.warn('[Admin Seed] Firebase Auth check warning:', err?.message || err);
      }
    }

    // 2. If Firebase user doesn't exist, try creating via Admin SDK if password env var provided
    if (!firebaseUser) {
      if (adminPassword && adminPassword.length >= 6) {
        try {
          firebaseUser = await adminAuth.createUser({
            email: adminEmail,
            password: adminPassword,
            displayName: 'GarMer Admin',
            emailVerified: true
          });
          console.log(`[Admin Seed] Created Firebase Authentication account for ${adminEmail}`);
        } catch (createErr: any) {
          console.error(`[Admin Seed] Failed to create Firebase user for ${adminEmail}:`, createErr?.message || createErr);
          return;
        }
      } else {
        console.log(`--------------------------------------------------------------------------------`);
        console.log(`[Admin Seed Info] Firebase Auth user "${adminEmail}" was not found.`);
        console.log(`To create the Admin user automatically:`);
        console.log(`  Add GARMER_ADMIN_PASSWORD="YourDevelopmentPassword123!" to backend/.env`);
        console.log(`Or create "${adminEmail}" manually in Firebase Console -> Authentication.`);
        console.log(`--------------------------------------------------------------------------------`);
        return;
      }
    }

    const firebaseUid = firebaseUser.uid;

    // 3. Check PostgreSQL for existing record
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { firebaseUid },
          { email: adminEmail }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.role !== 'ADMIN') {
        console.error(`[Admin Seed Conflict] User ${adminEmail} already exists in database with role "${existingUser.role}". Refusing to overwrite user role.`);
        return;
      }

      if (existingUser.firebaseUid !== firebaseUid) {
        await prisma.user.update({
          where: { id: existingUser.id },
          data: { firebaseUid }
        });
        console.log(`[Admin Seed] Updated Firebase UID for existing Admin user ${adminEmail}`);
      } else {
        console.log(`[Admin Seed] Development Admin user (${adminEmail}) is already configured and linked.`);
      }
      return;
    }

    // 4. Create PostgreSQL Admin user record
    await prisma.user.create({
      data: {
        firebaseUid,
        email: adminEmail,
        role: 'ADMIN'
      }
    });

    console.log(`[Admin Seed Success] GarMer Admin account linked! Email: ${adminEmail} | Firebase UID: ${firebaseUid}`);
  } catch (error) {
    console.error('[Admin Seed Error]:', error);
  }
};
