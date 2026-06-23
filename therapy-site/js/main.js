// Minimal JS: mobile nav toggle and smooth scroll
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("main-nav");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("open");
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      document.body.classList.toggle("nav-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  // smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        closeNav();
      }
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 700) closeNav();
  });

  var SUPPORT_OPTIONS = [
    "Individual Counseling",
    "Adolescent Guidance",
    "Behaviour Addiction",
    "Substance Use Disorder",
    "Pre-Marital and Marital Counseling",
    "Exam Fear, Study Smart",
    "Positive Parenting Program",
    "Help me decide",
  ];

  function clean(value, maxLength) {
    return String(value || "")
      .replace(/[<>]/g, "")
      .replace(/[\u0000-\u001f\u007f]/g, "")
      .trim()
      .slice(0, maxLength);
  }

  function showFormMessage(form, type, text) {
    var success = form.querySelector(".form-success");
    var error = form.querySelector(".form-error");
    if (success) success.hidden = type !== "success";
    if (error) {
      error.hidden = type !== "error";
      if (text) error.textContent = text;
    }
  }

  function isRateLimited() {
    var key = "secondSunriseLastSubmit";
    var now = Date.now();
    var last = Number(window.localStorage && localStorage.getItem(key));
    if (last && now - last < 60000) return true;
    if (window.localStorage) localStorage.setItem(key, String(now));
    return false;
  }

  document.querySelectorAll(".contact-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var endpoint = form.getAttribute("data-endpoint") || "";
      var button = form.querySelector('button[type="submit"]');
      var honeypot = form.querySelector('[name="website"]');
      var formData = new FormData(form);
      var name = clean(formData.get("name"), 80);
      var phone = clean(formData.get("phone"), 20);
      var support = clean(formData.get("support"), 80);
      var message = clean(formData.get("message"), 1000);
      var phoneOk = /^[0-9+()\-\s]{7,20}$/.test(phone);

      showFormMessage(form);

      if (honeypot && honeypot.value) return;
      if (!name || !phoneOk || SUPPORT_OPTIONS.indexOf(support) === -1 || !message) {
        showFormMessage(form, "error", "Please complete the required fields correctly.");
        return;
      }

      if (!endpoint) {
        showFormMessage(
          form,
          "error",
          "Online submission is being configured. Please call +91 90357 78841."
        );
        return;
      }

      if (isRateLimited()) {
        showFormMessage(form, "error", "Please wait a minute before sending another request.");
        return;
      }

      var payload = {
        name: name,
        phone: phone,
        support: support,
        message: message,
        website: "",
        source: window.location.href,
        submittedAt: new Date().toISOString(),
      };

      if (button) {
        button.disabled = true;
        button.textContent = "Sending...";
      }

      fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      })
        .then(function () {
          form.reset();
          showFormMessage(form, "success");
        })
        .catch(function () {
          showFormMessage(form, "error");
        })
        .finally(function () {
          if (button) {
            button.disabled = false;
            button.textContent = "Request appointment";
          }
        });
    });
  });
});
