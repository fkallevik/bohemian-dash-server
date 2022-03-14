const express = require("express");
const router = express.Router();
const session = require("express-session");
const hash = require("pbkdf2-password")();

/**
 * Auth Router
 *
 *
 */

// middleware
router.use(
  session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    // TODO: FK - Make a secret not easily parsed by humans and store in environment variables.
    secret: "shhhh, very secret",
  })
);

// dummy database
var users = {
  fk: { name: "Fredrik" },
};

// when you create a user, generate a salt
// and hash the password ('foobar' is the pass here)

hash({ password: "blackhelicopters" }, function (err, pass, salt, hash) {
  if (err) throw err;
  // store the salt & hash in the "db"
  users.fk.salt = salt;
  users.fk.hash = hash;
});

// Authenticate using our plain-object database of doom!

function authenticate(name, pass, fn) {
  if (!module.parent) {
    console.log("authenticating %s:%s", name, pass);
  }

  var user = users[name];

  // query the db for the given username
  if (!user) {
    return fn(null, null);
  }

  // apply the same algorithm to the POSTed password, applying
  // the hash against the pass / salt, if there is a match we
  // found the user
  hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
    if (err) {
      return fn(err);
    }

    if (hash === user.hash) {
      return fn(null, user);
    }

    fn(null, null);
  });
}

router.post("/login", function login(req, res, next) {
  authenticate(req.body.username, req.body.password, function (err, user) {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.json({
        error: true,
        data: "authentication_failed",
      });
    }

    // Regenerate session when signing in
    // to prevent fixation
    req.session.regenerate(function () {
      // Store the user's primary key
      // in the session store to be retrieved,
      // or in this case the entire user object
      req.session.user = user;
      res.json({ error: false });
    });
  });
});

router.post("/logout", function logout(req, res) {
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function () {
    res.json({ error: false });
  });
});

module.exports = router;
