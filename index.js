import express from "express";
import dotenv from "dotenv";
import pool from "./config/dbPool.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Store active user ID to track the current session context (in-memory state)
let activeUserId = 1;

// General error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong. Please try again later.");
});

// Fetch users from the database
const fetchUsers = async () => (await pool.query("SELECT * FROM users")).rows;

// Fetch visited countries for a given user ID
const checkVisited = async (userId) =>
  (
    await pool.query(
      "SELECT country_code FROM visited_countries WHERE user_id = $1",
      [userId]
    )
  ).rows.map((row) => row.country_code);

// Helper function to render the home page
const renderHomePage = async (res, options = {}) => {
  try {
    const users = await fetchUsers();
    const currentUser = users.find((user) => user.id === activeUserId);
    const countries = await checkVisited(activeUserId);

    res.render("pages/index.ejs", {
      countries,
      total: countries.length,
      users,
      color: currentUser ? currentUser.color : "#ffffff",
      ...options,
    });
  } catch (err) {
    res.status(500).send("Error rendering the home page.");
  }
};

// GET home page
app.get("/", (req, res) => renderHomePage(res));

// POST route to switch users or add a new user
app.post("/user", (req, res) => {
  if (req.body.add) {
    return res.render("pages/new.ejs");
  }

  const userId = parseInt(req.body.user);
  activeUserId = userId;
  renderHomePage(res);
});

// POST route to add a new country for a user
app.post("/add", async (req, res) => {
  const input = req.body.country_input.trim();

  try {
    // Search for the country by name
    const countryResult = await pool.query(
      "SELECT country_code, country_name FROM countries WHERE country_name ILIKE '%' || $1 || '%';",
      [input]
    );

    if (countryResult.rowCount === 0) {
      return renderHomePage(res, {
        error: "Country not found. Please try again.",
      });
    }

    const rows = countryResult.rows;
    const exactMatch = rows.find(
      (row) => row.country_name.toLowerCase() === input.toLowerCase()
    );
    const countryCode = exactMatch
      ? exactMatch.country_code
      : rows[0].country_code;

    // Check if the country is already added for this user
    const checkResult = await pool.query(
      "SELECT 1 FROM visited_countries WHERE user_id = $1 AND country_code = $2",
      [activeUserId, countryCode]
    );

    if (checkResult.rowCount > 0) {
      return renderHomePage(res, {
        error: "Country has already been added. Please try a different one.",
      });
    }

    // Insert the visited country for the active user
    await pool.query(
      "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
      [countryCode, activeUserId]
    );

    renderHomePage(res);
  } catch (err) {
    res.status(500).send("Error adding the country.");
  }
});

// POST route for adding a new user
app.post("/new", async (req, res) => {
  const userName = req.body.name
    .trim()
    .toLowerCase()
    .replace(/^./, (str) => str.toUpperCase());
  const userColor = req.body.color;

  try {
    // Insert the new user and use RETURNING to get the inserted user data
    const result = await pool.query(
      "INSERT INTO users (name, color) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *",
      [userName, userColor]
    );

    if (result.rowCount > 0) {
      const newUser = result.rows[0];
      activeUserId = newUser.id;
      return renderHomePage(res);
    }

    res.redirect("/");
  } catch (err) {
    res.status(500).send("Error adding the new user.");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
