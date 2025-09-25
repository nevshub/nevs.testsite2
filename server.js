// POSTS
app.post("/posts", (req, res) => {
  const { username, text } = req.body;
  if (!username || !text) return res.status(400).json({ success: false });

  let posts = [];
  if (fs.existsSync("posts.json")) {
    posts = JSON.parse(fs.readFileSync("posts.json"));
  }

  posts.push({ username, text, timestamp: Date.now() });
  fs.writeFileSync("posts.json", JSON.stringify(posts, null, 2));

  res.json({ success: true });
});

app.get("/posts", (req, res) => {
  if (!fs.existsSync("posts.json")) return res.json([]);
  res.json(JSON.parse(fs.readFileSync("posts.json")));
});

// SONGS
const songUpload = multer({ storage });
app.post("/songs", songUpload.single("song"), (req, res) => {
  const { username, title } = req.body;
  if (!req.file) return res.status(400).json({ success: false, msg: "No file" });

  let songs = [];
  if (fs.existsSync("songs.json")) {
    songs = JSON.parse(fs.readFileSync("songs.json"));
  }

  const songPath = "/uploads/" + req.file.filename;
  songs.push({ username, title, filePath: songPath });
  fs.writeFileSync("songs.json", JSON.stringify(songs, null, 2));

  res.json({ success: true, filePath: songPath });
});

app.get("/songs", (req, res) => {
  if (!fs.existsSync("songs.json")) return res.json([]);
  res.json(JSON.parse(fs.readFileSync("songs.json")));
});
