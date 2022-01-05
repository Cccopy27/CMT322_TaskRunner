"use strict";
import { db, auth } from "./firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { addDoc, collection} from "firebase/firestore";

const section_all = document.querySelectorAll(".section");
const create_account = document.querySelector(".create-account");
const sign_in = document.querySelector(".sign-in--option");
const sign_in_form = document.querySelector(".sign-up--form");
const login = document.querySelector(".login-form");
const password = document.querySelector("#password");
const validation_message = document.querySelector(".validation--popup");
const validation_list = document.querySelectorAll(".validation--list");
const icon_tick = `<ion-icon class="validation--icon tick" name="checkmark-circle-outline"></ion-icon>`;
const icon_cross = `<ion-icon class="validation--icon cross" name="close-circle-outline"></ion-icon>`;
(() => {
  section_all.forEach((current) => {
    current.classList.contains("section-main")
      ? current.classList.remove("section-hidden")
      : current.classList.add("section-hidden");
  });
})();

const toggle_section = () => {
  section_all.forEach((current) => current.classList.toggle("section-hidden"));
};

create_account.addEventListener("click", toggle_section);
sign_in.addEventListener("click", toggle_section);

sign_in_form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = sign_in_form.email.value;
  const password = sign_in_form.password.value;

  let user;
  if (document.querySelector(".option--tasker").checked) {
    user = document.querySelector(".option--tasker").value;
  } else if (document.querySelector(".option--customer").checked) {
    user = document.querySelector(".option--customer").value;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user created: ", cred.user);
      addDoc(collection(db, "user"), {
        email,
        password,
        role: user,
        username: "",
        contact: "",
        address: "",
        profile_pic_name: "",
        profile_pic_url: "",
        gender: "",
        marital_status: "",
        user_id: cred.user.uid,
      });
      document.getElementById("error").innerHTML = "";
      this.reset();
    })
    .catch((err) => {
      console.log(err.message);
      // Changing HTML to draw attention
      document.getElementById("error").innerHTML =
        "<span style='color: red;'>" +
        "*Password must be at least 6 characters</span>";
    });
});

login.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = login.email.value;
  const password = login.password.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
      console.log("user login: ", cred.user);
      location.replace("dashboard.html");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

let render = true;

password.addEventListener("focus", function (e) {
  validation_message.classList.remove("validation--hidden");
  if (render) {
    validation_list.forEach((paragraph) => {
      paragraph.insertAdjacentHTML("afterbegin", icon_cross);
    });
  }
  render = false;
});

const render_validation = function (icon_to_render) {
  let validation_state = this.querySelector(".validation--icon");
  validation_state.remove();
  this.insertAdjacentHTML("afterbegin", icon_to_render);
};

password.addEventListener("keyup", function () {
  let lowerCaseLetter = /[a-z]/;
  if (this.value.match(lowerCaseLetter)) {
    render_validation.call(validation_list[0], icon_tick);
  } else {
    render_validation.call(validation_list[0], icon_cross);
  }

  let upperCaseLetter = /[A-Z]/;
  if (this.value.match(upperCaseLetter)) {
    render_validation.call(validation_list[1], icon_tick);
  } else {
    render_validation.call(validation_list[1], icon_cross);
  }

  let number = /[0-9]/;
  if (this.value.match(number)) {
    render_validation.call(validation_list[2], icon_tick);
  } else {
    render_validation.call(validation_list[2], icon_cross);
  }

  let length = this.value.length;
  if (length >= 8) {
    render_validation.call(validation_list[3], icon_tick);
  } else {
    render_validation.call(validation_list[3], icon_cross);
  }
});
