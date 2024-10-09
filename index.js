import express from 'express';
import dotenv from 'dotenv';
import pool from './config/dbPool.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

async function checkVisisted() {
  const result = await pool.query("SELECT country_code FROM visited_countries");
  // Not parsed by default [ {Object: Object}, {Object: Object}... ]
  // If parsed             [ {country_code: 'TR'}, {country_code: 'NL'}... ]
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code); 
  });
  return countries; // [ 'TR', 'NL'... ]
}



// GET home page
app.get("/", async (req, res) => {
  const countries = await checkVisisted(); // [ 'TR', 'NL'... ]
  res.render("index.ejs", { countries: countries, total: countries.length, error:null });
});




//INSERT new country
app.post("/add", async (req, res) => {
  const input = req.body.input.trim();

  try {
    const result = await pool.query("SELECT country_code FROM countries WHERE (country_name) ILIKE '%' || $1 || '%';", [input]); // Turkey
    const data = result.rows[0]; // {country_code: 'TR'}
    const countryCode = data.country_code; // 'TR'
    try {
      await pool.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [countryCode]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
      const countries = await checkVisisted(); // [ 'TR', 'NL'... ]
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country has already been added, try again.", // Insert error
      });
    }
  } catch (err) {
    console.log(err);
    const countries = await checkVisisted(); // [ 'TR', 'NL'... ]
    res.render("index.ejs", {
      countries: countries,
      total: countries.length,
      error: "Country name does not exist, try again.", // Query error
    });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});