/* ==================== GLOBAL STYLES ==================== */
body {
  margin: 0;
  padding: 0;
  background-color: #111; /* dark gray/black */
  color: #ff6600;         /* orange font for consistency */
  font-family: Arial, sans-serif;
  text-align: center;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 40px;
}

a {
  color: #ff6600;
  text-decoration: none;
}

h1, h2, h3 {
  margin-bottom: 20px;
}

/* ==================== BUTTON STYLES ==================== */
.button {
  background-color: #ff6600;
  border: none;
  padding: 12px 28px;
  color: #111; /* darker text inside buttons */
  cursor: pointer;
  margin: 10px 5px;
  border-radius: 8px;
  font-size: 1.2em;
  text-decoration: none;
  transition: background 0.3s, transform 0.2s;
  display: inline-block;
}

.button:hover {
  background-color: #ff8533;
  transform: scale(1.05);
}

/* ==================== STREAM SECTION ==================== */
#streamSection {
  background-color: #222;  /* slightly lighter dark gray */
  border: 1px solid #333;
  border-radius: 8px;
  padding: 20px;
  width: 90%;
  max-width: 720px;
  margin-top: 30px;
  text-align: left;
}

#streamSection h2, #streamSection h3 {
  color: #ff6600;
}

#streamList li {
  background-color: #111;
  color: #ff6600;
  padding: 8px 12px;
  margin-bottom: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#streamList li button {
  background-color: #ff6600;
  color: #111;
  border: none;
  padding: 4px 10px;
  border-radius: 5px;
  font-size: 0.9em;
  cursor: pointer;
  margin-left: 5px;
}

#streamList li button:hover {
  background-color: #ff8533;
  transform: scale(1.05);
}

/* ==================== VIDEO STYLING ==================== */
#liveStream {
  width: 100%;
  max-width: 700px;
  margin-top: 20px;
  border-radius: 8px;
  background-color: #000;
    }
