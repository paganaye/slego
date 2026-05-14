import { DB_HOST, DB_USER, DB_NAME, DB_PASS } from "./config/private_keys";
import mysql from 'mysql2/promise';

export const db = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  database: DB_NAME,
  password: DB_PASS
});