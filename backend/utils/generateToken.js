const jwt = require('jsonwebtoken');

/**
 * Generates a JSON Web Token (JWT) for a given user ID.
 * @param {string} id - The user's MongoDB document ID.
 * @returns {string} The generated JWT.
 */
const generateToken = (id) => {
  // 'sign' creates a token. It takes the payload (data to store),
  // a secret key (from your .env file), and an expiration time.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d', // The user will stay logged in for 30 days
  });
};

module.exports = generateToken;