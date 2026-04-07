document.addEventListener("DOMContentLoaded", () => {
      const emailinput = document.getElementById("email-input");
      const passinput = document.getElementById("password-input");
      const submitbtn = document.getElementById("submit-button");

      submitbtn.addEventListener("click", async () => {
        event.preventDefault();
        const finalemailval = emailinput.value.trim();
        const finalpassval = passinput.value.trim();

        try {
          const response = await fetch("/login", {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              email: finalemailval,
              password: finalpassval,
            }),
          });

          const data = await response.json();
          if (data.success) {
            alert("Login Successful");
            localStorage.setItem("userid", data.id);
            localStorage.setItem("name", data.name);
            localStorage.setItem("token", data.token);
            if (data.role === "user") {
              window.location.href = "/Home";
            } else {
              window.location.href = "/adminHome";
            }
          } else {
            alert("Invalid Credentials");
          }
        } catch (err) {
          console.error(err);
          alert("Server Error!! Please try again later!");
        }
      });
    });