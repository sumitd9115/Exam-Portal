document.addEventListener("DOMContentLoaded", async () => {
  const userid = localStorage.getItem("userid");
  const testno = Number(localStorage.getItem("currentTestNo"));
  const examwrapper = document.querySelector(".exam-wrapper");
  const questionText = document.getElementById("question-text");
  const questionMarks = document.getElementById("question-marks");
  const questionOptions = document.getElementById("question-options");
  const timerEl = document.getElementById("timer");
  const nextbtn = document.getElementById("next-ques");

  let questions = [];
  let quesIds = [];
  let currIndex = 0;
  let selectedAnswers = {};
  let fullscreenViolations = 0;
  let isSubmitted = false;

  // OVERLAY PAGE
  const overlay = document.querySelector(".fullscreen-overlay");
  const overlaybtn = document.getElementById("enterFullscreenBtn");

  overlaybtn.addEventListener("click", async () => {
    await requestFullScreen();
    overlay.classList.add("disabled");
    examwrapper.classList.remove("disabled");
    startExam();
  });

  // START EXAM PAGE
  // Handling full Screen
  document.addEventListener("fullscreenchange", async () => {
    if(isSubmitted) return;
    if (!document.fullscreenElement) {
      alert(
        `You have tried to exit fullscreen!!`,
      );
      requestFullScreen();
      fullscreenViolations++;

      if (fullscreenViolations >= 1) {
        alert("You have exceeded violations limit!! Submitting test...");
        await autoSubmitExam();
      }
    }
  });

  async function requestFullScreen() {
    const elem = document.documentElement;

    if (elem.requestFullscreen) return elem.requestFullscreen();
    if (elem.webkitRequestFullscreen) return elem.webkitRequestFullscreen();
    if (elem.msRequestFullscreen) return elem.msRequestFullscreen();
  }

  async function startExam() {
    try {
      const response = await fetch("/api/getQuesAns", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          testno: testno,
        }),
      });

      const data = await response.json();
      if (!data.success) {
        alert("Failed to load questions");
        return;
      }

      questions = groupQuestions(data.data);

      const testDuration = questions[0].duration_minutes;
      console.log(testDuration);

      const endTime = Date.now() + testDuration * 60 * 1000;
      const interval = setInterval(() => {
        const rem = endTime - Date.now();

        if (rem <= 0) {
          clearInterval(interval);
          alert("Time is up! Exam will be submitted automatically.");
          autoSubmitExam();
          return;
        }

        const hrs = Math.floor(rem / (60 * 60 * 1000));
        const minutes = Math.floor((rem % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((rem % (60 * 1000)) / 1000);

        // Using normal JS logic
        // timerEl.innerHTML = `${hrs < 10 ? "0" + hrs : hrs} : ${minutes < 10 ? "0" + minutes : minutes} : ${seconds < 10 ? "0" + seconds : seconds}`;

        // Using Advance JS logic: padStart function()
        timerEl.innerHTML = `${String(hrs).padStart(2, "0")} : ${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`;
      }, 1000);

      showQuestion();
    } catch (err) {
      console.log("Error in fetching data!!");
    }
  }

  nextbtn.addEventListener("click", async () => {
    const q = questions[currIndex];

    if (localStorage.getItem("temp-selected-option") !== null) {
      const selectedItem = localStorage.getItem("temp-selected-option");
      selectedAnswers[q.question_id] = selectedItem;
      localStorage.removeItem("temp-selected-option");
    } else {
      alert(`Please select the option before proceeding!!`);
      return;
    }

    if (currIndex < questions.length - 1) {
      currIndex++;
      showQuestion();
    } else {
      alert("Test Completed!!");
      console.log("User Answers: ", selectedAnswers);
      await submittingMCQs();
      window.location.href = "/Home";
    }
  });

  async function autoSubmitExam() {
    if(isSubmitted) return;
    await submittingMCQs();
    window.location.href = "/Home";
  }

  async function submittingMCQs() {
    if(isSubmitted) return;
    isSubmitted = true;

    let idx = 0;
    questions.forEach((el) => {
      quesIds[idx] = el.question_id;
    })

    try {
      const response = await fetch("/api/submitMCQs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testno,
          userid,
          answers: selectedAnswers,
          quesIds
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert(data.message || "Error in submitting test!");
        return;
      }

      alert(`Test submitted successfully!\nYour Score: ${data.score}`);
    } catch (err) {
      console.error("Error submitting test:", err);
      alert("Server error while submitting test!");
    }
  }

  function showQuestion() {
    const q = questions[currIndex];

    questionText.textContent = currIndex + 1 + ". " + q.question;
    questionMarks.textContent = `Marks: ${q.marks}`;
    if (currIndex === questions.length - 1) {
      nextbtn.innerHTML = "";
      nextbtn.textContent = "Submit Test";
    }
    questionOptions.innerHTML = "";
    // nextbtn.disabled = !selectedAnswers[q.question_id];

    q.options.forEach((opt) => {
      const li = document.createElement("li");
      li.classList.add("option");
      li.textContent = opt.option_text;

      // if (selectedAnswers[q.question_id] === opt.option_id) {
      //   li.classList.add("selected");
      // }

      li.addEventListener("click", () => {
        localStorage.setItem("temp-selected-option", opt.option_id);
        // selectedAnswers[q.question_id] = opt.option_id;
        document
          .querySelectorAll(".option")
          .forEach((el) => el.classList.remove("selected"));

        li.classList.add("selected");
        nextbtn.disabled = false;
      });

      questionOptions.appendChild(li);
    });
  }

  function groupQuestions(data) {
    const ans = {};

    data.forEach((row) => {
      if (!ans[row.question_id]) {
        ans[row.question_id] = {
          duration_minutes: row.duration_minutes,
          question_id: row.question_id,
          question: row.question,
          marks: row.marks,
          options: [],
        };
      }

      ans[row.question_id].options.push({
        option_id: row.option_id,
        option_text: row.option_text,
      });
    });

    return Object.values(ans);
  }
});
