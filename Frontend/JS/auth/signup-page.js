document.addEventListener("DOMContentLoaded", () => {
  const nameinput = document.getElementById("name-input");
  const emailinput = document.getElementById("email-input");
  const passinput = document.getElementById("password-input");
  const confirmpassinput = document.getElementById("confirm-password-input");
  const submitbtn = document.getElementById("submit-button");

  submitbtn.addEventListener("click", async () => {
    event.preventDefault();
    const finalnameval = nameinput.value.trim();
    const finalemailval = emailinput.value.trim();
    const finalpassval = passinput.value.trim();
    const finalconfirmpassval = confirmpassinput.value.trim();

    if (finalpassval !== finalconfirmpassval) {
      alert("Password and Confirm Password is not same!! Please Try Again");
      return;
    }

    try {
      const response = await fetch("/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: finalnameval,
          email: finalemailval,
          password: finalpassval,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("SignUp Successful!!");
        window.location.href = "/login";
      } else {
        alert("Signup Unsuccessful");
      }
    } catch (err) {
      console.error(err);
      alert("Server Error!! Please Try Again Later!");
    }
  });
});
