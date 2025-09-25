const express = require("express");
const multer = require("multer");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // serve HTML, CSS, JS, uploads

// Setup file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Save profile
app.post("/upload", upload.single("photo"), (req, res) => {
  const { username, bio } = req.body;
  const photoPath = req.file ? "/uploads/" + req.file.filename : null;

  // Load existing profiles
  let profiles = [];
  if (fs.existsSync("profiles.json")) {
    profiles = JSON.parse(fs.readFileSync("profiles.json"));
  }

  // Replace or add profile
  const existingIndex = profiles.findIndex((p) => p.username === username);
  if (existingIndex >= 0) {
    profiles[existingIndex] = { username, bio, photo: photoPath };
  } else {
    profiles.push({ username, bio, photo: photoPath });
  }

  fs.writeFileSync("profiles.json", JSON.stringify(profiles, null, 2));
  res.json({ success: true, username, bio, photo: photoPath });
});

// Fetch profiles
app.get("/profiles", (req, res) => {
  if (!fs.existsSync("profiles.json")) return res.json([]);
  const profiles = JSON.parse(fs.readFileSync("profiles.json"));
  res.json(profiles);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
