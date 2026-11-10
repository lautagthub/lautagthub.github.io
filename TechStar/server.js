const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(
  session({
    secret: "techstar_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

// Base de datos SQLite
const db = new sqlite3.Database("./database/techstar.db", (err) => {
  if (err) {
    console.error("Error conectando a SQLite", err);
  } else {
    console.log("SQLite conectado.");
  }
});

// Crear tablas
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

// Registro
app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Completa todos los campos"
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      `INSERT INTO users (username, email, password)
       VALUES (?, ?, ?)`,
      [username, email, hashedPassword],
      function (err) {
        if (err) {
          return res.status(400).json({
            message: "El email ya está registrado"
          });
        }

        res.json({
          message: "Usuario registrado correctamente"
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Error del servidor"
    });
  }
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get(
    `SELECT * FROM users WHERE email = ?`,
    [email],
    async (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          message: "Usuario no encontrado"
        });
      }

      const validPassword = await bcrypt.compare(
        password,
        user.password
      );

      if (!validPassword) {
        return res.status(401).json({
          message: "Contraseña incorrecta"
        });
      }

      req.session.user = {
        id: user.id,
        username: user.username,
        email: user.email
      };

      res.json({
        message: "Sesión iniciada",
        user: req.session.user
      });
    }
  );
});

// Logout
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({
      message: "Sesión cerrada"
    });
  });
});

// Contacto
app.post("/contact", (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      message: "Completa todos los campos"
    });
  }

  db.run(
    `
    INSERT INTO messages
    (name, email, subject, message)
    VALUES (?, ?, ?, ?)
    `,
    [name, email, subject, message],
    function (err) {
      if (err) {
        return res.status(500).json({
          message: "Error al enviar mensaje"
        });
      }

      res.json({
        message: "Mensaje enviado correctamente"
      });
    }
  );
});

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(
    `Servidor TechStar iniciado en http://localhost:${PORT}`
  );
});