import pkg from "pg";
import dotenv from "dotenv";
const { Pool } = pkg;
dotenv.config();

const PORT = process.env.PORT;
const DBSERVER = process.env.DBSERVER;
const DBUSER = process.env.DBUSER;
const DBPWD = process.env.DBPWD;
const DBHOST = process.env.DBHOST;
const DBPORT = process.env.DBPORT;
const DB = process.env.DB;

export default new Pool({
  connectionString: `${DBSERVER}://${DBUSER}:${encodeURIComponent(
    DBPWD
  )}@${DBHOST}:${DBPORT}/${DB}`,
});
