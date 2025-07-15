import sequelize from '../config/db';
import { User } from './users.model';
import { Operator } from './operators.model';
import { Login } from './login.model';
import { News } from './news.model';
// Bog‘lashlar
User.belongsTo(Operator, {
  as: 'referrerOperator',
  foreignKey: 'referrerOperatorId',
  onDelete: 'SET NULL',
});
Operator.hasMany(User, {
  as: 'users',
  foreignKey: 'referrerOperatorId',
  onDelete: 'SET NULL',
});

// 🔁 Model sync
export const initDb = async () => {
  try {
    await sequelize.sync({ alter: true }); // yoki { force: true } agar boshlang'ich bo‘lsa
    console.log('✅ All models synced');
  } catch (err) {
    console.error('❌ Sequelize sync error:', err);
  }
};

export { sequelize, User, Operator, Login ,News};
