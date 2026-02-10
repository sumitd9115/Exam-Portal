document.addEventListener("DOMContentLoaded", async () => {
  const mainBody = document.getElementById("main-body");
  const summaryClass = document.querySelector(".summary");
  const totalMarks = document.getElementById("total-marks");
  const marksObtained = document.getElementById("marks-obtained");
  const userid = localStorage.getItem("userid");
  const testno = localStorage.getItem("viewResultTestNo");

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

  try {
    const response = await fetch("/api/getTestResults", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        userid,
        testno,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.log("Error in fetching data!!");
    }

    let Srno = 1;
    let total_marks = 0;
    let marks_obtained = 0;

    data.data.forEach((el) => {
      const tr = document.createElement("tr");

      tr.classList.add(el.is_correct ? "correct" : "wrong");

      tr.innerHTML = `
        <td>${Srno}</td>
        <td>${el.question}</td>
        <td>${el.selected_option}</td>
        <td>${el.correct_option}</td>
        <td>${el.marks}</td>
        <td>${el.marks_scored}</td>
        <td>${el.is_correct ? "✔ Correct" : "✖ Wrong"}</td>
      `;

      mainBody.appendChild(tr);

      Srno++;
      total_marks += el.marks;
      marks_obtained += el.marks_scored;
    });

    totalMarks.innerHTML = `<strong>Total Marks:</strong> ${total_marks}`;
    marksObtained.innerHTML = `<strong>Marks Obtained:</strong> ${marks_obtained}`;

    const p = document.createElement("p");
    if (marks_obtained >= total_marks / 2) {
      p.classList.add("pass");
      p.textContent = "Status: PASSED ✅";
    } else {
      p.classList.add("fail");
      p.textContent = "Status: FAILED ❌";
    }
    summaryClass.appendChild(p);
  } catch (err) {
    console.log("Server Error: ", err);
  }
});
