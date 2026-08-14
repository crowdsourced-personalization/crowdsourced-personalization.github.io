/* ------------------------------------------------------------------
   Email signup -> Google Form -> Google Sheet

   Fill in the two values below. See README.md for how to find them.

   FORM_ID   the long id in your form's URL:
             https://docs.google.com/forms/d/e/<FORM_ID>/viewform
   ENTRY_ID  the name of the email question's input, e.g. "entry.1234567890"
   ------------------------------------------------------------------ */

var FORM_ID  = "1FAIpQLSfA2L4Wr18Gk3ZjUlO6eEtfqa2MLcf9qZpLPfeJASmG27DNGg";
var ENTRY_ID = "entry.2026087984";

(function () {
  var form   = document.getElementById("email-form");
  var input  = document.getElementById("email");
  var button = document.getElementById("submit-btn");
  var status = document.getElementById("form-status");

  function say(message, kind) {
    status.textContent = message;
    status.className = "form-status" + (kind ? " " + kind : "");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var email = input.value.trim();
    if (!email || !input.checkValidity()) {
      say("Please enter a valid email address.", "err");
      input.focus();
      return;
    }

    if (FORM_ID.indexOf("PASTE") !== -1) {
      say("Signup is not configured yet.", "err");
      return;
    }

    button.disabled = true;
    say("Sending…");

    var body = new URLSearchParams();
    body.append(ENTRY_ID, email);

    /* Google Forms does not send CORS headers, so the response is opaque and
       cannot be inspected. mode:"no-cors" lets the POST through; a resolved
       promise means the request left the browser. Verify actual delivery in
       the linked Sheet. */
    fetch("https://docs.google.com/forms/d/e/" + FORM_ID + "/formResponse", {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString()
    })
      .then(function () {
        form.reset();
        say("Thanks — you're on the list.", "ok");
      })
      .catch(function () {
        say("Something went wrong. Please try again.", "err");
      })
      .then(function () {
        button.disabled = false;
      });
  });
})();
