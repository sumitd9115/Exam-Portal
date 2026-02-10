document.addEventListener("DOMContentLoaded", async () => {
  // Storing JWT Token of Logged in user and removing it when user clicks on Logout
  const token = localStorage.getItem("token");
  document.getElementById("logout-btn").addEventListener("click", async () => {
    await fetch("/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem("token");
    window.location.href = "/login";
  });

  // Fetching Name of Logged in User
  const name = localStorage.getItem("name");
  const userName = document.getElementById("user-name");
  const dropdown = document.querySelector(".dropdown-content");

  userName.addEventListener("click", () => {
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  });
  userName.innerText = `Welcome, ${name}`;

  try {
    const response = await fetch("/api/getAllTests", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    });
    const data = await response.json();

    if (data.success && data.data.length > 0) {
      const maincontent = document.getElementById("main-content");
      maincontent.innerHTML = "";

      data.data.forEach((el) => {
        const section = document.createElement("div");
        section.classList.add("section-1");

        section.innerHTML = `
                <h3>${el.test_title} - MCQ Test</h3>
                <p><strong>Test No:</strong> ${el.testno}</p>
                <p><strong>Questions:</strong> ${el.no_ques}</p>
                <p><strong>Total Marks:</strong> ${el.total_marks}</p>
                <p><strong>Duration:</strong> ${el.duration_minutes} Minutes</p> 
              `;

        maincontent.appendChild(section);
      });
    }
  } catch (err) {
    console.error("Error fetching data!!");
  }
});
