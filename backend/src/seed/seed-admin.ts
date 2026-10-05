import 'dotenv/config';
import { seedAdmin } from './admin-seed.js';

/**
 * CLI entry: `npm run seed:admin` (builds first, see package.json).
 * Reads ADMIN_EMAIL / ADMIN_PASSWORD from the environment. Prints no secrets.
 */
const email = process.env['ADMIN_EMAIL'] ?? '';
const password = process.env['ADMIN_PASSWORD'] ?? '';

try {
  const result = await seedAdmin({ email, password });
  if (result.status === 'created') {
    console.log(`Admin created for ${email} (id ${result.id}).`);
  } else {
    console.log(`Admin ${email} already exists (id ${result.id}); unchanged.`);
  }
} catch (error) {
  console.error(`Seed failed: ${(error as Error)?.message ?? error}`);
  process.exitCode = 1;
}
