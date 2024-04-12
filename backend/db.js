import { createPool } from "mysql2/promise";

const USERNAME_DB = "root";
const PASSWORD_DB = "123321";
const NAME_DB = "parcial_pruebas";

export const pool = createPool({
  host: "localhost",
  port: "3306",
  user: USERNAME_DB,
  password: PASSWORD_DB,
  database: NAME_DB,
});
