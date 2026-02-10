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

  // Fetching Available Tests Data
  try {
    const finaluserid = localStorage.getItem("userid");
    const response = await fetch("/api/getTestsData", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userid: finaluserid,
      }),
    });
    const data = await response.json();

    if (data.success && data.data.length > 0) {
      const maincontent = document.getElementById("main-content");
      maincontent.innerHTML = "";

      data.data.forEach((el) => {
        const section = document.createElement("div");
        section.classList.add("section-1");

        const button = document.createElement("button");
        button.textContent = "Give Exam";

        section.innerHTML = `
                <h3>${el.test_title}</h3>
                <p>Testno: ${el.testno}</p> 
                <p>${el.no_ques} Questions • ${el.duration_minutes} Minutes</p>
                <p>Marks: ${el.total_marks}</p> 
              `;

        section.append(button);
        maincontent.appendChild(section);

        button.addEventListener("click", async () => {
          await requestFullScreen();
          localStorage.setItem("currentTestNo", el.testno);
          window.location.href = "/MCQ_Exampage";
        });
      });
    } else {
      const maincontent = document.getElementById("main-content");
      maincontent.innerHTML = "";

      const div = document.createElement("div");
      const h3 = document.createElement("h3");
      const p = document.createElement("p");

      div.classList.add("section-1", "empty-card");

      h3.textContent = "🎯 No Pending Tests";
      p.textContent = "You have completed all available exams.";

      div.append(h3, p);
      maincontent.appendChild(div);
    }
  } catch (err) {
    console.error("Error fetching data!!", err);
  }

  async function requestFullScreen() {
    const elem = document.documentElement;

    if (elem.requestFullscreen) {
      await elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) {
      await elem.webkitRequestFullscreen(); // Safari
    } else if (elem.msRequestFullscreen) {
      await elem.msRequestFullscreen(); // IE
    }
  }
});
