/*
  middleware/validate.js — request input validation.

  Why a separate middleware instead of checking inside the route?
  ──────────────────────────────────────────────────────────────
  Routes should only handle the "happy path" — valid input,
  successful response. Validation logic clutters that.

  By moving validation into middleware:
  - Routes stay clean and readable
  - Validation rules are reusable across routes
  - Bad input is rejected before any service code runs
  - Easy to add more rules later (e.g. block certain usernames)

  Express middleware signature: (req, res, next) => void
    Call next() to pass control to the next middleware/route.
    Call res.status(...).json(...) to short-circuit and respond.
*/

/*
  validateUsername — validates :username route parameter.
  
  GitHub username rules (from GitHub docs):
  - 1 to 39 characters
  - Letters, numbers, and single hyphens
  - Cannot start or end with a hyphen
*/
function validateUsername(req, res, next) {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  if (username.length > 39) {
    return res.status(400).json({
      error: 'GitHub usernames are at most 39 characters.',
    });
  }

  // Must start and end with alphanumeric, can contain hyphens in between
  if (!/^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(username)) {
    return res.status(400).json({
      error: 'Invalid GitHub username. Only letters, numbers, and hyphens allowed.',
    });
  }

  // Normalise to lowercase — GitHub usernames are case-insensitive
  // We attach the clean version to req so the route uses it consistently
  req.cleanUsername = username.toLowerCase();

  next();
}

module.exports = { validateUsername };
