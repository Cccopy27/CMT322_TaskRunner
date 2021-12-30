"use strict";
import {auth, createUser} from "./firebase/config.js"
const section_all = document.querySelectorAll(".section");
const create_account = document.querySelector(".create-account");
const sign_in = document.querySelector(".sign-in--option");
const sign_in_form = document.querySelector(".sign-up--form");

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

sign_in_form.addEventListener("submit",(e)=>{
  e.preventDefault()

  const email = sign_in_form.email.value
  const password = sign_in_form.password.value

  createUser(auth, email, password).then((cred)=>{
    console.log("user created: ", cred.user)
  }).catch((err)=>{
    console.log(err.message)
  })
})

