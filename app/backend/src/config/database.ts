import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Variável de ambiente obrigatória não configurada: ${name}`);
  }
  return value;
};

const dbPort = Number(requiredEnv('DB_PORT'));
if (Number.isNaN(dbPort)) {
  throw new Error('Variável de ambiente DB_PORT deve ser um número válido');
}

const sequelize = new Sequelize(
  requiredEnv('DB_NAME'),
  requiredEnv('DB_USER'),
  requiredEnv('DB_PASSWORD'),
  {
    host: requiredEnv('DB_HOST'),
    port: dbPort,
    dialect: 'postgres',
    logging: false,
  }
);

export async function connectWithRetry(maxRetries = 10, delay = 3000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await sequelize.authenticate();
      console.log('DB connected');
      return;
    } catch (err) {
      console.error(`DB connection attempt ${i + 1}/${maxRetries} failed. Retrying in ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error('Unable to connect to the database after multiple retries.');
}

export default sequelize;
