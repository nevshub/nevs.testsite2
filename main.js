const ADMIN_PASSWORD = "GroveFire"; // Grove sacred password

const adminBtn = document.getElementById("adminBtn");
const guestBtn = document.getElementById("guestBtn");

adminBtn.addEventListener("click", () => {
  const pass = prompt("Enter Admin Password:");
  if(pass === ADMIN_PASSWORD){
    localStorage.setItem("userRole", "admin");
    window.location.href = "home.html";
  } else alert("Incorrect password.");
});

guestBtn.addEventListener("click", () => {
  localStorage.setItem("userRole", "guest");
  window.location.href = "home.html";
});
