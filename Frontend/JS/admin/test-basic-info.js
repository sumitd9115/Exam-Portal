document.addEventListener("DOMContentLoaded", () => {
  const testnoinput = document.getElementById("testno-input");
  const Testtypeinput = document.getElementById("Testtype-input");
  const totalmarksinput = document.getElementById("Totalmarks-input");
  const durationinput = document.getElementById("Duration-input");
  const testTitle = document.getElementById("title-input");
  const createTest = document.getElementById("create-test");

  createTest.addEventListener("click", async () => {
    const finaltestno = Number(testnoinput.value.trim());
    const finaltesttype = Testtypeinput.value.trim().toUpperCase();
    const finaltotalmarks = Number(totalmarksinput.value.trim());
    const finalduration = Number(durationinput.value.trim());
    const finaltesttitle = testTitle.value.trim();

    if (
      !finaltestno ||
      !finaltesttype ||
      !finaltotalmarks ||
      !finalduration ||
      !finaltesttitle
    ) {
      alert("Please enter valid values in all the fields before proceeding!");
      return;
    }

    if (!["MCQ", "THEORY"].includes(finaltesttype)) {
      alert("Test type must be MCQ or THEORY");
      return;
    }

    if (finalduration % 10 != 0 && finalduration % 5 != 0) {
      alert(
        `Please enter valid duration!! ${finalduration} mins cannot be the duration of any test!!`,
      );
      return;
    }

    // Sending actual api with all data
    localStorage.setItem("testno", finaltestno);
    localStorage.setItem("totalmarks", finaltotalmarks);
    localStorage.setItem(
      "pendingTests",
      JSON.stringify({
        testno: finaltestno,
        testtype: finaltesttype,
        totalmarks: finaltotalmarks,
        duration: finalduration,
        testTitle: finaltesttitle,
      }),
    );

    if (finaltesttype === "MCQ") {
      window.location.href = "/MCQ_Test_Ques_Ans";
    } else if (finaltesttype === "THEORY") {
      window.location.href = "/Theory_Test_Ques_Ans";
    }
  });
});
