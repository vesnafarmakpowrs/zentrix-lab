import AppDataSource from '../config/orm.config';
import { User } from '../models/user.model';
import bcrypt from 'bcrypt';

async function seed() {
  await AppDataSource.initialize();
  console.log('Seeding started.');
  // Example: Seed a default user (ensure passwords are hashed in production)
  const userRepository = AppDataSource.getRepository(User);
  const hashedPassword = await bcrypt.hash('adminpass', 10);
  const admin = userRepository.create({ username: 'admin', password: hashedPassword, role: 'GameMaster' });
  await userRepository.save(admin);

  console.log('Seeding completed.');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Error during seeding:', error);
  process.exit(1);
});
