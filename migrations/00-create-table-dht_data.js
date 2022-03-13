var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("database.sqlite3");

db.serialize(function () {
  db.run(
    "CREATE TABLE IF NOT EXISTS dht_data \
        (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, \
         temperature REAL DEFAULT 0, \
         humidity REAL DEFAULT 0, \
         created_at TEXT DEFAULT NULL \
        )"
  );
});

db.close();
