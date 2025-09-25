const ADMIN_PASSWORD = "Nev123"; 
let role = localStorage.getItem("userRole") || "guest";

// Prompt for role if not already set
if(!localStorage.getItem("userRole")) {
  const input = prompt("Enter Admin password (leave empty if guest):");
  if(input === ADMIN_PASSWORD) role = "admin";
  else if(input) role = "member";
  else role = "guest";
  localStorage.setItem("userRole", role);
}

// DOM elements
const postForm = document.getElementById("postForm");
const updateText = document.getElementById("updateText");
const postUpdateBtn = document.getElementById("postUpdateBtn");
const updatesFeed = document.getElementById("updatesFeed");

// Load updates from storage
let updates = JSON.parse(localStorage.getItem("updates") || "[]");

// Show post form if admin
if(role === "admin") {
  postForm.style.display = "block";
}

// Render updates
function renderUpdates() {
  updatesFeed.innerHTML = "";
  updates.forEach((update, index) => {
    const updateDiv = document.createElement("div");
    updateDiv.style.border = "1px solid #444";
    updateDiv.style.borderRadius = "8px";
    updateDiv.style.padding = "10px";
    updateDiv.style.marginBottom = "15px";
    updateDiv.style.background = "#222";

    updateDiv.innerHTML = `
      <p>${update.text}</p>
      <small>Posted: ${update.timestamp}</small>
    `;

    if(role === "admin") {
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "button";
      editBtn.style.marginLeft = "10px";
      editBtn.onclick = () => {
        const newText = prompt("Edit update:", update.text);
        if(newText) {
          updates[index].text = newText;
          localStorage.setItem("updates", JSON.stringify(updates));
          renderUpdates();
        }
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "button";
      deleteBtn.style.marginLeft = "5px";
      deleteBtn.onclick = () => {
        if(confirm("Delete this update?")) {
          updates.splice(index, 1);
          localStorage.setItem("updates", JSON.stringify(updates));
          renderUpdates();
        }
      };

      updateDiv.appendChild(editBtn);
      updateDiv.appendChild(deleteBtn);
    }

    updatesFeed.appendChild(updateDiv);
  });
}

// Post new update
postUpdateBtn?.addEventListener("click", () => {
  const text = updateText.value.trim();
  if(!text) return alert("Please write something.");
  const newUpdate = {
    text,
    timestamp: new Date().toLocaleString()
  };
  updates.unshift(newUpdate); // newest first
  localStorage.setItem("updates", JSON.stringify(updates));
  updateText.value = "";
  renderUpdates();
});

// Initial render
renderUpdates();
