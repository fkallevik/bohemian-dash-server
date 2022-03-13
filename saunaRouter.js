const express = require("express");
const router = express.Router();

const sqlite3 = require("sqlite3").verbose();

router.post("/sauna/data", (req, res) => {
  const { temperature, humidity } = req.body;

  const createdAt = new Date().toISOString();

  console.log(`${createdAt}: Temp: ${temperature}, Humi: ${humidity}`);

  const db = new sqlite3.Database("database.sqlite3");

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

module.exports = router;
