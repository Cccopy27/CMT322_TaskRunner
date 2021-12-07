"use strict";

const sample_task = document.querySelector(".sample-tasks-grid");
const description_div = document.querySelectorAll(".description-div");
const section_hidden = document.querySelectorAll(".section");

description_div.forEach((current) => {
  current.classList.add("hidden-div");
});

sample_task.addEventListener("click", function (e) {
  if (!e.target.classList.contains("card-button")) return;

  const card_container = e.target.closest(".card-container");
  const target_description_div =
    card_container.querySelector(".description-div");
  target_description_div.classList.toggle("hidden-div");
});

const section_display = (entries, observer) => {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const observerOption = {
  root: null,
  threshold: 0.3,
};

const sectionObserver = new IntersectionObserver(
  section_display,
  observerOption
);

section_hidden.forEach((current) => sectionObserver.observe(current));
