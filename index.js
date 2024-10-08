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
  const countries = await checkVisisted();
  res.render("index.ejs", { countries: countries, total: countries.length });
});


//INSERT new country
app.post("/add", async (req, res) => {
  const input = req.body.country.trim();

  
  try {
    // Check if the country exists in the countries table
    const result = await pool.query("SELECT country_code FROM countries WHERE (country_name) ILIKE '%' || $1 || '%';", [input]);
    const data = result.rows[0]; // {country_code: 'TR'}
    const countryCode = data.country_code; // 'TR'


    // If the country does not exist
    if (!data) {
      const countries = await checkVisisted();
      return res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "Country name does not exist, try again.",
      });
    }


      // Check if the country has already been added to visited_countries
      const visitedResult = await pool.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [countryCode]);
      

      // Country has already been added
      if (visitedResult.rows.length > 0) {
        const countries = await checkVisisted();
        return res.render("index.ejs", {
          countries: countries,
          total: countries.length,
          error: "Country has already been added, try again.",
        });
      }
      

      // Insert new country if it hasn't been added yet
      await pool.query("INSERT INTO visited_countries (country_code) VALUES ($1)", [countryCode]);
      res.redirect("/");

      
    } catch (err) {
      console.error("Error:", err); // Enhanced error logging
      const countries = await checkVisisted();
      res.render("index.ejs", {
        countries: countries,
        total: countries.length,
        error: "An error occurred, please try again.", // General error
      });
    }
  });


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});