// ==========================
// Tabs Login / Registro
// ==========================

function showTab(tabId, button) {

  const tabs =
    document.querySelectorAll(".tab-content");

  const buttons =
    document.querySelectorAll(".tab-btn");

  tabs.forEach(tab => {
    tab.classList.remove("active");
  });

  buttons.forEach(btn => {
    btn.classList.remove("active");
  });

  const selectedTab =
    document.getElementById(tabId);

  if (selectedTab) {
    selectedTab.classList.add("active");
  }

  if (button) {
    button.classList.add("active");
  }
}


// ==========================
// REGISTRO
// ==========================

const registerForm =
  document.getElementById("registerForm");

if (registerForm) {

  registerForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const username =
        document.getElementById(
          "registerUsername"
        ).value;

      const email =
        document.getElementById(
          "registerEmail"
        ).value;

      const password =
        document.getElementById(
          "registerPassword"
        ).value;

      try {

        const response =
          await fetch("/register", {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              username,
              email,
              password
            })
          });

        const data =
          await response.json();

        alert(data.message);

        if (response.ok) {
          registerForm.reset();
        }

      } catch (error) {

        alert(
          "Error al registrar usuario"
        );

        console.error(error);
      }
    }
  );

}


// ==========================
// LOGIN
// ==========================

const loginForm =
  document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const email =
        document.getElementById(
          "loginEmail"
        ).value;

      const password =
        document.getElementById(
          "loginPassword"
        ).value;

      try {

        const response =
          await fetch("/login", {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              email,
              password
            })
          });

        const data =
          await response.json();

        alert(data.message);

        if (response.ok) {

          localStorage.setItem(
            "techstarUser",
            JSON.stringify(data.user)
          );

          loginForm.reset();
        }

      } catch (error) {

        alert(
          "Error al iniciar sesión"
        );

        console.error(error);
      }
    }
  );

}


// ==========================
// CONTACTO
// ==========================

const contactForm =
  document.getElementById("contactForm");

if (contactForm) {

  contactForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const name =
        document.getElementById(
          "name"
        ).value;

      const email =
        document.getElementById(
          "email"
        ).value;

      const subject =
        document.getElementById(
          "subject"
        ).value;

      const message =
        document.getElementById(
          "message"
        ).value;

      try {

        const response =
          await fetch("/contact", {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json"
            },

            body: JSON.stringify({
              name,
              email,
              subject,
              message
            })
          });

        const data =
          await response.json();

        alert(data.message);

        if (response.ok) {
          contactForm.reset();
        }

      } catch (error) {

        alert(
          "Error al enviar mensaje"
        );

        console.error(error);
      }
    }
  );

}


// ==========================
// Usuario logueado
// ==========================

window.addEventListener(
  "DOMContentLoaded",
  () => {

    const savedUser =
      localStorage.getItem(
        "techstarUser"
      );

    if (savedUser) {

      const user =
        JSON.parse(savedUser);

      console.log(
        `Usuario logueado: ${user.username}`
      );

    }

  }
);