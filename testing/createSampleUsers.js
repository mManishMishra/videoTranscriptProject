const axios = require("axios");

const users = [
  { username: "admin", password: "admin", role: "admin" },
  { username: "manish", password: "user", role: "user" },
];

const registerUser = async (user) => {
  try {
    const response = await axios.post("http://localhost:5000/register", user);
    console.log(`User ${user.username} registered successfully:`, response.data);
  } catch (error) {
    console.error(`Error registering ${user.username}:`, error.response?.data || error.message);
  }
};

users.forEach(registerUser);