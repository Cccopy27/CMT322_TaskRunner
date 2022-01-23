"use strict";
import { db, storage } from "./firebase/config";
import {
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  arrayUnion,
  doc,
  query,
  where,
  onSnapshot,
  getDocs,
  getDoc,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

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

const auth = getAuth();

const handle_sign_out = function (e) {
  e.preventDefault();
  auth.signOut
    .then(() => {
      location.replace("login.html");
    })
    .catch((error) => console.log(error));
};

onAuthStateChanged(auth, async (user) => {
  if (user) {
    let current_user = await getDocs(
      query(collection(db, "user"), where("user_id", "==", user.uid))
    );
    let user_doc = current_user.docs[0].data();
    let btn_holder = document.querySelector(".div-sign");
    btn_holder.innerHTML = "";
    let html = `<a class="btn btn_sign_out" href="#">Sign out</a>`;
    btn_holder.insertAdjacentHTML("afterbegin", html);
    const sign_out = document.querySelector(".btn_sign_out");
    sign_out.addEventListener("click", handle_sign_out);
    const browse = document.querySelector(".btn_task");
    const client = document.querySelector(".btn_client");
    user_doc.role === "tasker" ? client.remove() : browse.remove();
  }
});
