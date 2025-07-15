import { User } from '../models/users.model';
import { Operator } from '../models/operators.model';
import { GoogleService } from './goggle.service';

const googleService = new GoogleService();

export class UsersService {
  async create(userDto: any): Promise<{ success: boolean; message: string; data?: any }> {
    let operator = null;

    if (userDto.utmTag) {
      operator = await Operator.findOne({ where: { link: userDto.utmTag } });

      if (!operator) {
        return {
          success: false,
          message: 'Ushbu havola (utmTag) orqali operator topilmadi',
        };
      }

      userDto.referrerOperatorId = operator.id;
      userDto.utmTag = operator.link;
      operator.referalCount++;
      await operator.save();
    }

    const user = await User.create(userDto);

    const allUsers = await User.findAll({
      include: ['referrerOperator'],
      limit: 1000,
    });

    await googleService.writeUsersToSheet('All_Users', allUsers, true);

    if (operator) {
      const operatorUsers = await User.findAll({
        where: { utmTag: operator.link },
        include: ['referrerOperator'],
      });

      const sheetName = operator.name.replace(/\s+/g, '_');
      await googleService.writeUsersToSheet(sheetName, operatorUsers);
    }

    return {
      success: true,
      message: 'Foydalanuvchi muvaffaqiyatli ro‘yxatdan o‘tdi',
    };
  }

  async findAll(): Promise<{ success: boolean; message: string; data: any[] }> {
    const users = await User.findAll({
      include: ['referrerOperator'],
    });

    return {
      success: true,
      message: 'Foydalanuvchilar ro‘yxati olindi',
      data: users,
    };
  }

  async findOne(id: number): Promise<{ success: boolean; message: string; data?: any }> {
    const user = await User.findByPk(id);
    if (!user) {
      return {
        success: false,
        message: `ID: ${id} bo‘lgan foydalanuvchi topilmadi`,
      };
    }

    return {
      success: true,
      message: `ID: ${id} bo‘lgan foydalanuvchi topildi`,
      data: user,
    };
  }

  async update(id: number, updateDto: any): Promise<{ success: boolean; message: string; data?: any }> {
    const user = await User.findByPk(id);
    if (!user) {
      return {
        success: false,
        message: `ID: ${id} bo‘lgan foydalanuvchi topilmadi`,
      };
    }

    Object.assign(user, updateDto);
    await user.save();

    return {
      success: true,
      message: `ID: ${id} bo‘lgan foydalanuvchi yangilandi`,
      data: user,
    };
  }

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const user = await User.findByPk(id);
    if (!user) {
      return {
        success: false,
        message: `ID: ${id} bo‘lgan foydalanuvchi topilmadi`,
      };
    }

    await user.destroy();

    return {
      success: true,
      message: `ID: ${id} bo‘lgan foydalanuvchi o‘chirildi`,
    };
  }
}
