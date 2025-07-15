import { Login } from '../models/login.model';
import bcrypt from 'bcrypt';

export class AuthService {
  async register(username: string, password: string) {
    const existingUser = await Login.findOne({ where: { username } });

    if (existingUser) {
      return { success: false, message: 'Foydalanuvchi mavjud' };
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await Login.create({ username, password: hashed });

    return { success: true, message: 'Ro‘yxatdan o‘tdi', data: { id: user.id, username: user.username } };
  }

  async login(username: string, password: string) {
    const user = await Login.findOne({ where: { username } });

    if (!user) return { success: false, message: 'Foydalanuvchi topilmadi' };

    const match = await bcrypt.compare(password, user.password);
    if (!match) return { success: false, message: 'Parol noto‘g‘ri' };

    return { success: true, message: 'Muvaffaqiyatli login', data: { id: user.id, username: user.username } };
  }
}
