import { pool } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CreateAccesToken } from "../libs/jwt.js";
import dotenv from "dotenv";

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

export const getUsers = async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM users");
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const postUser = async (req, res) => {
  const {
    user_name,
    user_middle_name,
    user_last_name,
    user_last_second_name,
    user_username,
    user_email,
    user_phone,
    user_password,
    user_identification,
    user_birth_date,
  } = req.body;
  const finalPass = await bcrypt.hash(user_password, SALT_ROUNDS);
  console.log(req.body);
  try {
    const [user] = await pool.query(
      "SELECT * FROM users WHERE user_email = ? OR user_username = ? OR user_phone = ? OR user_identification = ?",
      [user_email, user_username, user_phone, user_identification]
    );

    if (user.length > 0) {
      if (user[0].user_email === user_email) {
        return res.status(400).json({ error: "Correo en uso" });
      } else if (user[0].user_username === user_username) {
        return res.status(400).json({ error: "Usuario en uso" });
      } else if (user[0].user_identification === user_identification) {
        return res.status(400).json({ error: "NIT en uso" });
      } else if (user[0].user_phone === user_phone) {
        return res.status(400).json({ error: "Teléfono en uso" });
      }
    }

    const [result] = await pool.query(
      "INSERT INTO users (user_name, user_middle_name, user_last_name, user_last_second_name, user_username, user_email, user_phone, user_password, user_identification, user_birth_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        user_name,
        user_middle_name,
        user_last_name,
        user_last_second_name,
        user_username,
        user_email,
        user_phone,
        finalPass,
        user_identification,
        user_birth_date,
      ]
    );

    let ids = result.insertId;
    const token = await CreateAccesToken({ id: ids, user_email: user_email });
    res.cookie("token", token);

    res.json({ message: "Usuario creado" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateUser = async (req, res) => {
  const {
    user_name,
    user_middle_name,
    user_last_name,
    user_last_second_name,
    user_username,
    user_email,
    user_phone,
  } = req.body;

  try {
    const [result] = await pool.query(
      "SELECT * FROM users WHERE user_email = ? OR user_phone = ?",
      [user_email, user_phone]
    );
    if (result.length === 0) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    } else {
      if (user_email !== result[0].user_email && result[0].user_phone === user_phone) {
        return res.status(400).json({ error: "Teléfono en uso" });
      } else if (
        user_email !== result[0].user_email &&
        result[0].user_username === user_username
      ) {
        return res.status(400).json({ error: "Usuario en uso" });
      }
    }

    await pool.query(
      "UPDATE users SET user_name = ?, user_middle_name = ?, user_last_name = ?, user_last_second_name = ?, user_username = ?, user_phone = ? WHERE user_email = ?",
      [
        user_name,
        user_middle_name,
        user_last_name,
        user_last_second_name,
        user_username,
        user_phone,
        user_email,
      ]
    );

    res.json({ message: "Usuario actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query(
      "SELECT * FROM users WHERE user_id = ?",
      [id]
    );
    if (result.length === 0) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const response = result[0].active === 1 ? "Usuario Eliminado" : "Usuario Restaurado";

    await pool.query("UPDATE users SET active = ? WHERE user_id = ? ", [
      result[0].active === 1 ? 0 : 1,
      id,
    ]);

    res.json({ message: response });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const LogIn = async (req, res) => {
  try {
    const { user_username, user_password } = req.body;
    const [result] = await pool.query(
      "select * from users where user_username = ?",
      [user_username]
    );

    if (result.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    const isMatch = await bcrypt.compare(
      user_password,
      result[0].user_password
    );

    if (!isMatch)
      return res.status(400).json({ error: "Contraseña incorrecta" });

    const token = await CreateAccesToken({ id: result[0].user_id });
    res.cookie("token", token);
    res.json(result[0]);
  } catch (error) {
    return res.status(404).json({ error: error.message });
  }
};

export const logOut = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, TOKEN_SECRET, async (err, decoded) => {
    if (err) return res.status(401).json({ message: "Unauthorized" });
    const [userFound] = await pool.query(
      "select * from users where user_id = ?",
      [decoded.id]
    );
    if (!userFound) return res.status(401).json({ error: "Unauthorized" });
    return res.json({
      id: userFound[0].user_id,
      user_name: userFound[0].user_name,
      user_middle_name: userFound[0].user_middle_name,
      user_last_name: userFound[0].user_last_name,
      user_last_second_name: userFound[0].user_last_second_name,
      user_username: userFound[0].user_username,
      user_email: userFound[0].user_email,
      user_phone: userFound[0].user_phone,
      user_identification: userFound[0].user_identification,
      user_birth_date: userFound[0].user_birth_date,
    });
  });
};
