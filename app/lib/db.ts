import postgres from 'postgres';

const connectionString = 
  process.env.POSTGRES_URL || 
  process.env.DATABASE_URL || 
  process.env.POSTGRES_PRISMA_URL;

if (!connectionString) {
  throw new Error(
    'Something went wrong: Please make sure you have set the correct credentials.'
  );
}

const sql = postgres(connectionString, {
  ssl: 'require',
});

export default sql;