import { Operator } from '../models/operators.model';
import { User } from '../models/users.model';
import { generateSlug, generateLink } from '../utils/slug';
import { GoogleService } from './goggle.service';

const googleService = new GoogleService();

export class OperatorService {
  async create(name: string): Promise<{ success: boolean; message: string; data: Operator }> {
    const slug = generateSlug(name);
    const operator = await Operator.create({
      name,
      slug,
      link: generateLink(slug),
    });

    await googleService.ensureSheetExists('All_Users');
    await googleService.ensureSheetExists(slug);

    return {
      success: true,
      message: 'Operator muvaffaqiyatli yaratildi',
      data: operator,
    };
  }

  async findAll(): Promise<{ success: boolean; message: string; data: Operator[] }> {
    const operators = await Operator.findAll({
      include: [{ model: User, as: 'users', include: ['referrerOperator'] }],
      limit: 1000,
    });

    const allUsers = operators.flatMap(op =>
  (op.users ?? []).map(user => ({
    ...user.toJSON(),
    referrerOperator: user.referrerOperator,
  })),
);

    await googleService.writeUsersToSheet('All_Users', allUsers, true);

   for (const operator of operators) {
  const ownUsers = (operator.users ?? []).filter(user => user.utmTag === operator.link);
  await googleService.writeUsersToSheet(generateSlug(operator.name), ownUsers);
}



    return {
      success: true,
      message: `Topildi: ${operators.length} operator`,
      data: operators,
    };
  }

  async findById(id: number): Promise<{ success: boolean; message: string; data?: Operator }> {
    const operator = await Operator.findByPk(id, {
      include: [{ model: User, as: 'users', include: ['referrerOperator'] }],
    });

    if (!operator) {
      return {
        success: false,
        message: `ID: ${id} bo‘yicha operator topilmadi`,
      };
    }

    return {
      success: true,
      message: 'Operator va foydalanuvchilari topildi',
      data: operator,
    };
  }

  async update(id: number, data: { name?: string }): Promise<{ success: boolean; message: string; data?: Operator }> {
    const operator = await Operator.findByPk(id);
    if (!operator) {
      return {
        success: false,
        message: `ID: ${id} bo‘yicha operator topilmadi`,
      };
    }

    if (data.name) {
      const slug = generateSlug(data.name);
      operator.slug = slug;
      operator.link = generateLink(slug);
    }

    Object.assign(operator, data);
    await operator.save();

    return {
      success: true,
      message: `Operator ID: ${id} muvaffaqiyatli yangilandi`,
      data: operator,
    };
  }

  async delete(id: number): Promise<{ success: boolean; message: string }> {
    const deleted = await Operator.destroy({ where: { id } });
    if (!deleted) {
      return {
        success: false,
        message: `ID: ${id} bo‘yicha operator topilmadi`,
      };
    }

    return {
      success: true,
      message: `Operator ID: ${id} o‘chirildi`,
    };
  }
}
