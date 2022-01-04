"use strict";
import { db, auth } from "./firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

import { addDoc, collection } from "firebase/firestore";

const section_all = document.querySelectorAll(".section");
const create_account = document.querySelector(".create-account");
const sign_in = document.querySelector(".sign-in--option");
const sign_in_form = document.querySelector(".sign-up--form");
const login = document.querySelector(".login-form");

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
        user_id: cred.user.uid,
        role: user,
      });
      document.getElementById("error").innerHTML = ""
      this.reset();
    })
    .catch((err) => {
      console.log(err.message);
      // Changing HTML to draw attention
      document.getElementById("error").innerHTML = "<span style='color: red;'>"+
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
