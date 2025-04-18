document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Token not found. Please log in again.");
      window.location.href = "/";
      return;
    }
  
    try {
      const decoded = jwt_decode(token);
      console.log("Decoded token data:", decoded);
      document.getElementById("name").innerText += decoded.name;
      document.getElementById("phoneNo").innerText += decoded.phoneNo;
      document.getElementById("department").innerText += decoded.department;
    } catch (err) {
      console.error("Failed to decode token:", err);
      alert("Invalid token. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/";
    }
  });

  function logout() {
    localStorage.removeItem("token");
    location.reload();
  }