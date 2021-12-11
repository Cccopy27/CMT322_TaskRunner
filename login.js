"use strict";
const section_all = document.querySelectorAll(".section");
const create_account = document.querySelector(".create-account");
const sign_in = document.querySelector(".sign-in--option");

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
