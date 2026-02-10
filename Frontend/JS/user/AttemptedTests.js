document.addEventListener("DOMContentLoaded", async () => {
  // Fetching Token for logout integration
  const token = localStorage.getItem("token");
  document.getElementById("logout-btn").addEventListener("click", async () => {
    await fetch("/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    localStorage.removeItem("token");
    window.location.href = "/login";
  });

  // Fetching name of logged in user
  const name = localStorage.getItem("name");
  const userName = document.getElementById("user-name");
  const dropdown = document.querySelector(".dropdown-content");
  userName.addEventListener("click", () => {
    dropdown.style.display =
      dropdown.style.display === "block" ? "none" : "block";
  });
  userName.innerText = `Welcome, ${name}`;

  // Fetching data of students who have attempted tests
  try {
    const finaluserid = localStorage.getItem("userid");
    const response = await fetch("/api/getAttemptedTestsData", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        userid: finaluserid,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.log("Error in fetching data!!");
    }

    if (data.data.length > 0) {
      const ul = document.getElementById("tests-list");
      ul.innerHTML = "";
      data.data.forEach((el) => {
        const date = new Date(el.attempted_at);
        const formatted = date.toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        const li = document.createElement("li");
        li.classList.add("attempted-card");
        li.innerHTML = `
                <h3>${el.test_title}</h3>
                <p><strong>Testno:</strong> ${el.testno}</p>
                <p><strong>Attempted At: </strong>${formatted}</p>
                <p><strong>Score:</strong> ${el.marks_scored} / ${el.total_marks}</p> 
            `;
        const btn = document.createElement("button");
        btn.textContent = "View Results";
        btn.classList.add("view-btn");
        btn.onclick = () => {
          localStorage.setItem("viewResultTestNo", el.testno);
          window.location.href = "/viewResults";
        };

        li.append(btn);
        ul.appendChild(li);
      });
    } else {
      const ul = document.getElementById("tests-list");
      ul.innerHTML = "";
      const div = document.createElement("div");
      div.classList.add("attempted-card", "empty-card");
      const h3 = document.createElement("h3");
      const p = document.createElement("p");
      h3.textContent = "You have pending Tests!!";
      p.textContent = "Be prepared before appearing!";
      div.append(h3, p);
      ul.appendChild(div);
    }
  } catch (err) {
    console.error("Server Error!!");
  }
});
