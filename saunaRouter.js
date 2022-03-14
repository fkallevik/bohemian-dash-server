const express = require("express");
const router = express.Router();

const sqlite3 = require("sqlite3").verbose();

router.post("/sauna/data", (req, res) => {
  const { temperature, humidity } = req.body;

  const createdAt = new Date().toISOString();

  console.log(`${createdAt}: Temp: ${temperature}, Humi: ${humidity}`);

  const db = new sqlite3.Database("database.sqlite3");

  // TODO FK: Add validation of data / error handling
  // Important to sanitize data to prevent sql injection
  db.run(
    `INSERT INTO dht_data (temperature, humidity, created_at) VALUES (?, ?, ?)`,
    [temperature, humidity, createdAt],
    function (error) {
      if (error !== null) {
        console.log("Error: ", error);
      }
    }
  );

  db.close();
  res.end();
});

router.get("/sauna/data", (req, res) => {
  const db = new sqlite3.Database("database.sqlite3");

  // Limit to entries for the last 4 hours
  // Sensor pushes 1 entry per min
  const limit = 60 * 4;

  db.all(
    `SELECT * FROM dht_data ORDER BY created_at DESC LIMIT ${limit}`,
    function (error, rows) {
      if (error !== null) {
        console.log("Error: ", error);
        return res.json({ error: true });
      }

      res.json({ error: false, data: rows });

      db.close();
    }
  );
});

module.exports = router;
