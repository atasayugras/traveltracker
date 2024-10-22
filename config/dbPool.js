<<<<<<< HEAD
// This folder contains configuration files, including the database connection and environment-specific settings.
import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false, // Required for Render
  },
});

export default pool;
=======
import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();
const {Pool} = pkg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

  export default pool;
>>>>>>> 300e092 (Add tabs, refactor code)
