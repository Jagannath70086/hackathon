const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

document.addEventListener("DOMContentLoaded", () => {
    const signUpForm = document.getElementById("signUpForm");
    const signInForm = document.getElementById("signInForm");

    signUpForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const name = document.getElementById("name").value;
      const phoneNo = document.getElementById("phoneNo").value;
      const password = document.getElementById("password").value;
      const department = document.getElementById("department").value;
    console.log(department);

      try {
        const res = await fetch("http://localhost:5500/auth/teacher/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, phoneNo, password, department }),
        });

        const data = await res.json();
        
        alert(data.message);
        if (data.success) {
          localStorage.setItem("token", data.token);
          window.location.href = "/public/teacher_home.html";
        }
      } catch (err) {
        console.error("Signup error:", err);
        alert("Error registering teacher!");
      }
    });

    signInForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const phoneNo = document.getElementById("loginPhoneNo").value;
        const password = document.getElementById("loginPassword").value;

        try {
          const res = await fetch("http://localhost:5500/auth/teacher/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ phoneNo, password }),
          });

          const data = await res.json();
          
          alert(data.message);
          if (data.success) {
            localStorage.setItem("token", data.token);
            window.location.href = "/public/teacher_home.html";
          }
        } catch (err) {
          console.error("Login error:", err);
          alert("Error logging in teacher!");
        }
    });
});
