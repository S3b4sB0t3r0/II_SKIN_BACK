const { v2: cloudinary } = require("cloudinary");

console.log("ENV CHECK:");
console.log("Cloud:", process.env.CLOUD_NAME);
console.log("Key:", process.env.API_KEY);
console.log(
  "Secret:",
  process.env.API_SECRET ? "CARGADO ✅" : "NO ❌"
);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  secure: true
});

module.exports = cloudinary;