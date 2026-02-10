document.addEventListener("DOMContentLoaded", () => {
  const Quesinput = document.getElementById("Ques-input");
  const ansinput = document.getElementById("answer-input");
  const marksinput = document.getElementById("marks-input");
  const donebtn = document.getElementById("done-btn");
  const addquesbtn = document.getElementById("add-ques");
  const addoptionsbtn = document.getElementById("Add-options-btn");
  const deleteoptionsbtn = document.getElementById("Delete-options-btn");

  const testno = localStorage.getItem("testno");
  const totalmarks = Number(localStorage.getItem("totalmarks"));
  let remainingMarks = totalmarks;
  let optionCnt = 1;

  donebtn.addEventListener("click", async () => {
    const success = await storeData();
    if (remainingMarks != 0) {
      alert(`${remainingMarks} marks are remaining!! Add more questions!`);
      return;
    } else if (success) {
      await storeTestBasicInfo();
      await storeQuesCount();
      alert("All questions added successfully!");
      window.location.href = "/adminHome";
    }
  });

  addquesbtn.addEventListener("click", async () => {
    await storeData();
  });

  addoptionsbtn.addEventListener("click", async () => {
    optionCnt++;
    const div = document.querySelector(".options");
    const input = document.createElement("input");
    input.id = `option${optionCnt}-input`;
    input.placeholder = `Enter your Option`;
    div.appendChild(input);
  });

  deleteoptionsbtn.addEventListener("click", () => {
    if (optionCnt <= 1) return;
    const input = document.getElementById(`option${optionCnt}-input`);
    if (input) input.remove();
    optionCnt--; 
  });

  async function storeQuesCount() {
    try {
      const res = await fetch("/api/storeQuesCount", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testno,
        }),
      });

      const data = await res.json();

      if (data.success) {
        console.log("Number of questions added successfully!");
        return true;
      } else {
        console.error("Failed to store question count:", data.message);
        return false;
      }
    } catch (err) {
      console.error("Error while storing question count:", err);
      return false;
    }
  }

  async function storeData() {
    const question = Quesinput.value.trim();
    const answer = ansinput.value.trim();
    const marks = Number(marksinput.value.trim());
    let options = [];
    for (let i = 1; i <= optionCnt; i++) {
      const optInput = document.getElementById(`option${i}-input`);
      const option = optInput.value.trim();
      options.push(option);
    }

    if (!question || !answer || !marks) {
      alert("Please fill all fields correctly!");
      return false;
    }

    if (options.some((opt) => !opt)) {
      alert("Please fill all option fields!");
      return false;
    }

    if (remainingMarks - marks < 0) {
      alert(`Exceeding total marks! Remaining: ${remainingMarks}`);
      return false;
    }

    try {
      const response = await fetch("/api/storeQuesAnsInfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          answer,
          marks,
          testno,
          options,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert("Failed to add question!");
        return false;
      }

      remainingMarks -= marks;

      alert("Question added successfully!");

      if (remainingMarks === 0) {
        await storeTestBasicInfo();
        await storeQuesCount();
        alert("Thank You!! This was the last question you can add!");
        window.location.href = "/adminHome";
      }

      Quesinput.value = "";
      ansinput.value = "";
      marksinput.value = "";

      for (let i = optionCnt; i > 1; i--) {
        const opt = document.getElementById(`option${i}-input`);
        if (opt) opt.remove();
      }
      const firstOption = document.getElementById("option1-input");
      if (firstOption) firstOption.value = "";
      optionCnt = 1;

      return true;
    } catch (err) {
      console.error("Server Error:", err);
      alert("Server Error! Check console for details.");
      return false;
    }
  }

  async function storeTestBasicInfo() {
    const pendingtest = JSON.parse(localStorage.getItem("pendingTests"));

    if (!pendingtest) {
      console.log("No pending test found in localStorage");
      return false;
    }

    try {
      const res = await fetch("/api/storeTestBasicInfo", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(pendingtest),
      });
      const data = await res.json();

      if (!data.success) {
        console.log("Fail to add test basic information to Backend!!");
        return false;
      }

      alert("Test Basic information added successfully!!");
      localStorage.removeItem("pendingTests");
      return true;
    } catch (err) {
      console.log("Server Error!! Please check database once again!", err);
      return false;
    }
  }
});
