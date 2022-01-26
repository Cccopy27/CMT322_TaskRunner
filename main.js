"use strict";

let current_slide = 0;

let slide = document.querySelectorAll(".slide-task-holder");
let maxSlide;

// const slider = document.querySelector(".task-card-content");

const slider_btn_right = document.querySelector(".slider-button-right");
const slider_btn_left = document.querySelector(".slider-button-left");

const slide_to = function (move) {
  slide.forEach((current_sl, i) => {
    current_sl.style.transform = `translate(${100 * (i - move)}%)`;
  });
};

// slide_to(0).call(slide);

const direction = function (move, condition) {
  console.log(current_slide);

  let mov = condition ? current_slide < maxSlide - 1 : current_slide > 0;
  if (!mov) return;

  move === "right" ? current_slide++ : current_slide--;

  slide_to(current_slide);
};

slider_btn_right.addEventListener("click", direction.bind(null, "right", 1));
slider_btn_left.addEventListener("click", direction.bind(null, "left", 0));

//
const links = document.querySelectorAll(".list-section");
const section = document.querySelectorAll("section");

const listContainer = document.querySelector(".list-container");

const control = function (data, section_active, properties) {
  this.forEach((current) =>
    current.dataset[data] === section_active
      ? current.classList.remove(properties)
      : current.classList.add(properties)
  );
};

const controlNav = function (data, section_active, properties) {
  this.forEach((current) =>
    current.dataset[data] === section_active
      ? current.classList.add(properties)
      : current.classList.remove(properties)
  );
};

listContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains("list-section-link")) return;

  const section_active = e.target
    .closest(".list-section")
    .getAttribute("data-link");
  console.log(section_active);

  control.call(section, "section", section_active, "display-hidden");
  controlNav.call(links, "link", section_active, "list-section-active");
});

controlNav.call(links, "link", "1", "list-section-active");

//

const btn_apply = document.querySelector(".btn--apply");
const modal_window = document.querySelector(".window-task-information");
const browse_section = document.querySelector(".browse-task--section");

modal_window.addEventListener("click", function (e) {
  if (!e.target.classList.contains("btn--view-detail")) return;
});

// get user location
const loc_btn_get = document.querySelector(".form-location-get-btn");
const loc_btn_input = document.querySelector(".form-location-input-btn");
const map_location = document.querySelector("#map");
const display_map_button = document.querySelector(".map-btn");
const map_container = document.querySelector(".map-container");
let location_l;
const save_btn = document.querySelector(".save-btn");
const close_btn = document.querySelector(".close-btn");
const overlay = document.querySelector(".overlay");

const loc_text = document.getElementById("task-location");
const key = "56348ee0ae736660b862244f4a0535fc";
const locationURLfor = "http://api.positionstack.com/v1/forward";
const locationURLrev = "http://api.positionstack.com/v1/reverse";
let location_long;
let location_lat;
let location_regionCode;
let location_locality;

const getLocation = function () {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
    })
  );
};

const getData = async (locURL, locKey, locQue) => {
  const response = await fetch(locURL + locKey + locQue);
  const data = await response.json();
  console.log(data.data[0]);
  return data.data[0];
};

// button get user input location
loc_btn_input.addEventListener("click", async (e) => {
  e.preventDefault();
  Swal.fire({
    title: "Improve Location...",
    allowEscapeKey: false,
    allowOutsideClick: false,
  });
  Swal.showLoading();
  // forward geocoding
  const locKey = `?access_key=${key}`;
  const locQue = `&query=${loc_text.value}`;
  const { label, region_code, longitude, latitude, locality } = await getData(
    locationURLfor,
    locKey,
    locQue
  );
  location_long = longitude;
  location_lat = latitude;
  location_regionCode = region_code;
  location_locality = locality;
  loc_text.value = label;
  Swal.fire("Success!", "", "success");
});

// button get user self location
loc_btn_get.addEventListener("click", (e) => {
  e.preventDefault();
  Swal.fire({
    title: "Getting Location...",
    allowEscapeKey: false,
    allowOutsideClick: false,
  });
  Swal.showLoading();
  // geolocation + reverse geocoding
  getLocation()
    .then((data) => {
      const locKey = `?access_key=${key}`;
      const locQue = `&query=${data.coords.latitude},${data.coords.longitude} `;
      return getData(locationURLrev, locKey, locQue);
    })
    .then((data) => {
      loc_text.value = data.label;
      location_long = data.longitude;
      location_lat = data.latitude;
      location_regionCode = data.region_code;
      location_locality = data.locality;
      Swal.fire("Success!", "", "success");
    })
    .catch((error) => alert(`${error}`));
});

const display_map = function (data) {
  map_container.classList.remove("display-hidden");

  location_l = [data.coords.latitude, data.coords.longitude];

  const map = L.map("map").setView(location_l, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  let marker_d = L.marker(location_l)
    .addTo(map)
    .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
    .openPopup();

  map.on("click", function (mapEvent) {
    marker_d.remove();

    let { lat, lng } = mapEvent.latlng;
    location_l = [lat, lng];

    marker_d = L.marker(location_l)
      .addTo(map)
      .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
      .openPopup();

    console.log(mapEvent);
  });
};

const remove_overlay = function () {
  map_container.classList.add("display-hidden");
  overlay.style.display = "none";
};

close_btn.addEventListener("click", remove_overlay);

save_btn.addEventListener("click", async function () {
  const locKey = `?access_key=${key}`;
  const locQue = `&query=${location_l[0]},${location_l[1]} `;
  const loc = await getData(locationURLrev, locKey, locQue);
  console.log(loc);
  loc_text.value = loc.label;
  location_long = loc.longitude;
  location_lat = loc.latitude;
  location_regionCode = loc.region_code;
  location_locality = loc.locality;
  remove_overlay();
});

display_map_button.addEventListener("click", function (e) {
  e.preventDefault();
  console.log(overlay);

  overlay.style.display = "block";

  getLocation().then((data) => display_map(data));
});

// handle image preview
const image_preview = document.querySelector(".form-input-image-preview");
const image_input = document.querySelector(".post-task-input-photo");

// if user upload image
image_input.addEventListener("change", (e) => {
  const file = image_input.files;
  // max 3
  if (file.length > 3) {
    Swal.fire("Maximum 3 photo", "", "info");
    image_input.value = "";
  } else {
    // preview image
    image_preview.innerHTML = "";
    for (let i = 0; i < file.length; i++) {
      const image = document.createElement("img");
      image.setAttribute("src", `${URL.createObjectURL(file[i])}`);
      image_preview.appendChild(image);
    }
  }
});

//////////////////////////////////////////////////////////////
//firebase
//////////////////////////////////////////////////////////////

// post task
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
import {
  ref,
  uploadBytes,
  getDownloadURL,
  list,
  deleteObject,
  connectStorageEmulator,
} from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { async } from "@firebase/util";
let overview_task = document.querySelector(".task-card-content");
let search_task_section = document.querySelector(".search-task--section");
let job_category = document.querySelector("#job--category");
let latest_oldest_option = document.querySelector("#date-list");
const search_task_button = document.querySelector(".search--task--button");
let input_field = document.querySelector(".job--choice");
const loader = document.querySelector(".loader");
const checkout = document.querySelector(".checkout");
let window_task = document.querySelector(".window-task-information");
let reject_button = document.querySelector(".btn--reject");
const total_earn_description = document.querySelector(
  ".total_earn_description"
);
const total_earn = document.querySelector(".total_earn");
const total_task_description = document.querySelector(
  ".total_task_description"
);
const total_task = document.querySelector(".total_task");
const history_checkpoint = document.querySelector(".history-checkpoint");

const auth = getAuth();
let uid;
let current_user;

const handle_state = function (class_name, message = undefined, add_class) {
  let parent_button = this.closest(".option-button-div");

  let target_button = parent_button.querySelector(class_name);

  if (!message) {
    target_button.remove();
    return;
  }
  target_button.style.backgroundColor = "#51ec82";
  target_button.style.color = "#fff";
  target_button.innerText = message;
  target_button.classList.add(add_class);
};

const render_search_result = async function (section) {
  section.innerHTML = "";
  let current_id;
  let template;
  if (current_user.role === "customer") {
    let current_customer_task = await getDocs(
      query(
        collection(db, "task"),
        where("created_by", "==", current_user.user_id)
      )
    );
    current_id = [...current_customer_task.docs].map((document) => document.id);
  }

  this.forEach((doc) => {
    if (current_user.role === "customer") {
      template = current_id.includes(doc.id)
        ? `<button class="btn btn--task btn--${current_user.role}">Complete</button>`
        : ``;
    } else {
      template = `<button class="btn btn--task btn--${current_user.role}">Apply</button>`;
    }

    let html = `<div class="section-task-card">
                  <img class="search-task-img" src=${
                    doc.data().post_photo_url
                  } />
                  <div class="padding-div">
                    <p class="search-task-paragraph">
                    ${doc.data().post_title}
                    </p>
                  </div>
                  
                  <div class="padding-div">
                    <div class="option-button-div">
                      <a href="#" class="btn--view-detail" id=${doc.id}>
                      view details
                      </a>
                      ${template} 
                    </div>
                  </div>
                </div>`;
    section.insertAdjacentHTML("beforeend", html);
    if (
      current_user.role === "customer" &&
      doc.data().status === "complete" &&
      current_id.includes(doc.id)
    ) {
      let complete_task = search_task_section.querySelector(`#${doc.id}`);
      handle_state.call(
        complete_task,
        ".btn--customer",
        "Pay now",
        "btn__to_pay"
      );
    } else if (
      current_user.role === "customer" &&
      doc.data().status === "paid" &&
      current_id.includes(doc.id)
    ) {
      let complete_task = search_task_section.querySelector(`#${doc.id}`);
      handle_state.call(complete_task, ".btn--customer");
    }
  });
};

const sort_task = function (order) {
  if (!(this.length - 1) || order === "pleaseselectanoption") return;

  this.sort(function (first_task, second_task) {
    let first_date = new Date(
      first_task.data().added_at.seconds * 1000 +
        first_task.data().added_at.nanoseconds / 1000000
    );
    let second_date = new Date(
      second_task.data().added_at.seconds * 1000 +
        second_task.data().added_at.nanoseconds / 1000000
    );
    if (order === "latest") {
      return second_date - first_date;
    } else {
      return first_date - second_date;
    }
  });

  return this;
};

const calculate_distance = function (distance_lat, distance_long, coords) {
  let degree_between_lat = (distance_lat - coords.latitude) * (Math.PI / 180);
  let degree_between_long =
    (distance_long - coords.longitude) * (Math.PI / 180);
  let distance =
    Math.pow(Math.sin(degree_between_lat), 2) +
    Math.cos((distance_lat * Math.PI) / 180) *
      Math.cos((coords.latitude * Math.PI) / 180) *
      Math.sin(degree_between_long / 2) *
      Math.sin(degree_between_long / 2);
  let distance_in_miles =
    2 * Math.atan2(Math.sqrt(distance), Math.sqrt(1 - distance));
  let distance_in_kilometer = distance_in_miles * 6371;
  return distance_in_kilometer;
};

const sort_distance = async function (order) {
  if (!(this.length - 1) || order === "pleaseselectanoption") return;

  let { coords } = await getLocation();
  this.sort((task_prev, task_next) => {
    let distance_previous_lat = task_prev.data().post_location_lat;
    let distance_previous_long = task_prev.data().post_location_long;
    let distance_next_lat = task_next.data().post_location_lat;
    let distance_next_long = task_next.data().post_location_long;
    let distance_prev = calculate_distance(
      distance_previous_lat,
      distance_previous_long,
      coords
    );
    let distance_next = calculate_distance(
      distance_next_lat,
      distance_next_long,
      coords
    );
    return distance_next - distance_prev;
  });

  return this;
};

const filter_task = function () {
  return this.filter(
    (doc) =>
      !(
        doc.data().tasker_id.includes(current_user.user_id) ||
        doc.data().tasker_id.length >= doc.data().post_tasker_no
      )
  );
};

const populate_data = async function () {
  input_field.removeEventListener("keyup", handle_empty_input);

  loader.classList.remove("loader--hidden");
  let filtered_task;
  let search_section_data = await getDocs(collection(db, "task"));
  console.log(search_section_data.docs.length);

  filtered_task =
    current_user.role === "tasker"
      ? filter_task.call(search_section_data.docs)
      : search_section_data.docs;

  loader.classList.add("loader--hidden");

  latest_oldest_option.onchange = async function (e) {
    let order = this.value.toLowerCase().replace(" ", "");

    let task_sorted =
      order !== "nearbyme"
        ? sort_task.call(filtered_task, order)
        : await sort_distance.call(filtered_task, order);

    await render_search_result.call(task_sorted, search_task_section);
  };
  await render_search_result.call(filtered_task, search_task_section);
};
/**------------------Logout function--------------------- */
const sign_out = document.querySelector(".signout__icon");
sign_out.addEventListener("click", (e) => {
  e.preventDefault();
  auth
    .signOut()
    .then(() => {
      location.replace("login.html");
      console.log("successfully log out");
    })
    .catch((err) => {
      console.log(err.message);
    });
});

onAuthStateChanged(auth, async (user) => {
  if (user) {
    let query_user = await getDocs(
      query(collection(db, "user"), where("user_id", "==", user.uid))
    );
    uid = user.uid;
    current_user = query_user.docs[0].data();
    total_earn.innerText = "0";
    total_task.innerText = "0";
    total_task_description.innerText = "Total task";
    if (current_user.role === "customer") {
      reject_button.classList.add("display-hidden");
      total_earn_description.innerText = "Total spend";
    } else {
      total_earn_description.innerText = "Total earn";
    }

    let query_task =
      current_user.role === "customer"
        ? query(collection(db, "task"), where("created_by", "==", user.uid))
        : query(
            collection(db, "task"),
            where("tasker_id", "array-contains", current_user.user_id)
          );

    onSnapshot(query_task, async (snapshot) => {
      overview_task.innerHTML = "";
      search_task_section.innerHTML = "";
      let count = 0;
      let index = 0;
      let task_holder = `<div class="slide-task-holder"></div>`;
      let total_holder = task_holder.repeat(
        Math.ceil(snapshot.docs.length / 3)
      );

      overview_task.insertAdjacentHTML("beforeend", total_holder);
      let all_holder = [...document.querySelectorAll(".slide-task-holder")];

      maxSlide = all_holder.length;

      snapshot.docs.forEach((doc) => {
        if (count % 3 === 0 && count !== 0) index++;
        let html = `<div class="section-task-card">
                        <img class="search-task-img" src=${
                          doc.data().post_photo_url
                        } />
                        <div class="padding-div">
                          <p class="search-task-paragraph">
                            ${doc.data().post_title}
                          </p>
                        </div>

                        <div class="padding-div">
                          <div class="option-button-div">
                            <a href="#" class="btn--view-detail" id=${doc.id}>
                              view details
                            </a>
                            <button class="btn btn--task btn--${
                              current_user.role
                            }">Complete</button>
                          </div>
                        </div>
                      </div>`;

        all_holder[index].insertAdjacentHTML("beforeend", html);
        if (
          current_user.role === "customer" &&
          doc.data().status === "complete"
        ) {
          let complete_task = overview_task.querySelector(`#${doc.id}`);
          handle_state.call(
            complete_task,
            ".btn--customer",
            "Pay now",
            "btn__to_pay"
          );
        } else if (
          current_user.role === "customer" &&
          doc.data().status === "paid"
        ) {
          let complete_task = overview_task.querySelector(`#${doc.id}`);
          handle_state.call(complete_task, ".btn--customer");
        } else if (
          current_user.role === "tasker" &&
          doc.data().status === "paid"
        ) {
          let complete_task = overview_task.querySelector(`#${doc.id}`);
          handle_state.call(complete_task, ".btn--tasker");
        } else if (
          current_user.role === "tasker" &&
          doc.data().status === "complete"
        ) {
          let complete_task = overview_task.querySelector(`#${doc.id}`);
          handle_state.call(
            complete_task,
            ".btn--tasker",
            "Pending",
            "btn__pending"
          );
        }
        count++;
      });
      slide = all_holder;
      slide_to(0);
      await populate_data();
    });

    let query_transaction =
      current_user.role === "customer"
        ? query(
            collection(db, "transaction_history"),
            where("customer_id", "==", current_user.user_id)
          )
        : query(
            collection(db, "transaction_history"),
            where("user_id", "==", current_user.user_id)
          );

    onSnapshot(query_transaction, async (snapshot) => {
      if (snapshot.docs.length !== 0) {
        history_checkpoint.innerHTML = "";

        let user = await getDocs(
          query(
            collection(db, "user"),
            where("user_id", "==", current_user.user_id)
          )
        );

        if (current_user.role === "customer") {
          total_earn.innerText = user.docs[0].data().total_spending;
          total_task.innerText = user.docs[0].data().total_task_completed;
        } else {
          total_earn.innerText = user.docs[0].data().earning;
          total_task.innerText = user.docs[0].data().completed_task;
        }
      }

      snapshot.docs.forEach(async (doc) => {
        let transaction_doc = doc.data();

        let user_data =
          current_user.role === "customer"
            ? await getDocs(
                query(
                  collection(db, "user"),
                  where("user_id", "==", transaction_doc.customer_id)
                )
              )
            : await getDocs(
                query(
                  collection(db, "user"),
                  where("user_id", "==", transaction_doc.user_id)
                )
              );

        let html = `<div class="transaction-detail">
                      <img class="customer-img" src="${
                        user_data.docs[0].data().profile_pic_url
                      }" alt="${user_data.docs[0].data().username}" />
                      <p class="transaction-date">${new Date(
                        transaction_doc.transaction_date.seconds * 1000 +
                          transaction_doc.transaction_date.nanoseconds / 1000000
                      )}</p>
                      <p class="transaction-fee">MYR<span> ${transaction_doc.amount.padEnd(
                        5,
                        ".00"
                      )}</span></p>
                    </div>`;
        history_checkpoint.insertAdjacentHTML("beforeend", html);
      });
    });

    // ------------- Profile of current user ----------------

    // get user profile data from database
    // update profile field with current data
    const profile_form_ref = document.querySelector(".profile_form");
    const username_ref = document.getElementById("username");
    const email_ref = document.getElementById("email");
    const contact_ref = document.getElementById("contact");
    const address_ref = document.getElementById("address");
    const profile_image_preview_ref = document.querySelector(
      ".profile-picture-input-preview"
    );
    const profile_image_input_ref = document.querySelector(
      ".profile-picture-input-file"
    );
    const gender_ref = document.getElementById("Gender");
    const marital_status_ref = document.getElementById("Marital_Status");
    const role_ref = document.querySelector(".profile-role-show-input");
    const profile_form_submit_ref = document.querySelector(".profile-form");

    // -------------------------------------------------------

    // user click to upload profile image
    profile_image_input_ref.addEventListener("change", (e) => {
      const file = profile_image_input_ref.files;

      // preview image
      profile_image_preview_ref.setAttribute(
        "src",
        `${URL.createObjectURL(file[0])}`
      );
    });

    // user click submit profile form
    profile_form_submit_ref.addEventListener("submit", (e) => {
      e.preventDefault();

      // alert user
      Swal.fire({
        title: "Now Loading...",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      Swal.showLoading();

      // data to update
      const profileObj = {
        username: username_ref.value,
        email: email_ref.value,
        contact: contact_ref.value,
        address: address_ref.value,
        gender: gender_ref.value,
        marital_status: marital_status_ref.value,
      };

      // if user change profile pic
      if (profile_image_input_ref.files.length !== 0) {
        // add new key to the update object
        profileObj["profile_pic_name"] = profile_image_input_ref.files[0].name;
      }

      // update database
      updateDoc(doc(collection(db, "user"), query_user.docs[0].id), profileObj)
        .then(() => {
          // if user change profile pic
          if (profile_image_input_ref.files.length !== 0) {
            // set path for photo upload
            const uploadPath = `user/${query_user.docs[0].id}/${profile_image_input_ref.files[0].name}`;
            const storageRef = ref(storage, uploadPath);

            // upload photo to storage firebase to get its photo URL
            uploadBytes(storageRef, profile_image_input_ref.files[0])
              .then((storageImg) => {
                // get image URL from storage
                getDownloadURL(storageRef).then((imgURL) => {
                  // update doc imgURL
                  updateDoc(doc(db, "user", query_user.docs[0].id), {
                    profile_pic_url: imgURL,
                    profile_pic_name: profile_image_input_ref.files[0].name,
                  }).then(() => {
                    // delete original image if user have previous image in database
                    if (query_user.docs[0].profile_pic_name) {
                      // Create a reference to the file to delete
                      const desertRef = ref(
                        storage,
                        `user/${query_user.docs[0].id}/${profile_image_input_ref.files[0].name}`
                      );

                      // Delete the file
                      deleteObject(desertRef)
                        .then(() => {
                          // File deleted successfully
                          Swal.fire("Saved!", "", "success");
                        })
                        .catch((error) => {
                          console.log(error);
                          // Uh-oh, an error occurred!
                          Swal.fire("Something wrong...", "", "error");
                        });
                    }
                  });
                });
              })
              .catch((err) => {
                console.log(err);
                Swal.fire("Something wrong...", "", "error");
              });
          }
          Swal.fire("Saved!", "", "success");
        })
        .catch((err) => {
          console.log(err);
          Swal.fire("Something wrong...", "", "error");
        });
    });

    // add listener to user doc to capture latest changes

    const profile_doc_ref = doc(collection(db, "user"), query_user.docs[0].id);

    onSnapshot(
      profile_doc_ref,
      (snapshot) => {
        if (snapshot.data()) {
          username_ref.value = snapshot.data().username;
          email_ref.value = snapshot.data().email;
          contact_ref.value = snapshot.data().contact;
          address_ref.value = snapshot.data().address;
          gender_ref.value = snapshot.data().gender;
          marital_status_ref.value = snapshot.data().marital_status;
          role_ref.value = snapshot.data().role;
          profile_image_preview_ref.src = snapshot.data().profile_pic_url;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
});

// ---------------------Post task section------------------------

const post_input = document.querySelector(".post-task-form");
const post_input_title = document.getElementById("task-title");
const post_input_des = document.getElementById("task-des");
const post_input_start_date = document.getElementById("task-start-date");
const post_input_start_time = document.getElementById("task-start-time");
const post_input_end_date = document.getElementById("task-end-date");
const post_input_end_time = document.getElementById("task-end-time");
// const loc_text = document.getElementById("task-location");
const post_input_price = document.getElementById("task-price");
const post_input_price_unit = document.querySelector(".task-price-unit-opt");
const post_input_tasker_number = document.getElementById("task-tasker-needed");
// const post_input_photo = document.getElementById("task-photo");
const post_input_cat = document.querySelector(".post-task-cat-input");
const post_input_duration = document.querySelector(".post-task-input-duration");
const post_input_duration_unit = document.querySelector(
  ".task-duration-unit-opt"
);
const submit_btn = document.querySelector(".post-input-submit");
const inputs = document.querySelectorAll("input[list]");
const post_input_cat_list = document.querySelector(".post-task-cat-list");
const edit_post_btn_grp = document.querySelector(".edit_post_btn_grp");

const browse_nav_link = document.querySelector(".list-browse");
const post_nav_link = document.querySelector(".list-post");
const overview_nav_link = document.querySelector(".list-overview");
let temp_array_image_arr = [];
let globalTaskDetailsId = "";
let globalTaskDetailsCusId = "";
let globalTaskDetailsTaskerId = [];
let globalTaskDetailsPhotoName = [];

// ------------------------------------------------------

// toggle edit mode in post page
const outputEditData = (current_layout) => {
  // loading
  Swal.showLoading();

  if (post_input.classList.contains("edit_mode")) {
    // update button from post to save
    edit_post_btn_grp.firstElementChild.setAttribute("value", "Save");
    // add cancel button
    const cancelBtn = document.createElement("input");
    cancelBtn.setAttribute("class", "post-input-cancel");
    cancelBtn.setAttribute("type", "submit");
    cancelBtn.setAttribute("value", "Cancel");
    edit_post_btn_grp.appendChild(cancelBtn);

    // user click cancel
    const post_input_cancel_btn = document.querySelector(".post-input-cancel");

    post_input_cancel_btn.addEventListener("click", (e) => {
      e.preventDefault();

      // alert user
      Swal.fire({
        title: "Do you want to discard your changes?",
        showDenyButton: true,
        confirmButtonText: "Yes",
        denyButtonText: `No`,
      }).then((result) => {
        // yes
        if (result.isConfirmed) {
          // remove edit mode
          post_input.classList.remove("edit_mode");
          post_input.removeAttribute("id");
          // reset form
          post_input.reset();
          listContainer.style.pointerEvents = "";
          image_preview.innerHTML = "";

          // reset button
          // update button
          edit_post_btn_grp.firstElementChild.setAttribute(
            "value",
            "Post Task"
          );
          // remove last btn
          edit_post_btn_grp.removeChild(edit_post_btn_grp.lastElementChild);

          // navigate to overview
          post_task_ref.classList.add("display-hidden");
          overview_ref.classList.remove("display-hidden");

          // change nav link color
          overview_nav_link.classList.add("list-section-active");
          browse_nav_link.classList.remove("list-section-active");

          modal_window.classList.add("display-hidden");

          isTaskDetailsOpen = false;

          //reset task details
          task_details_image_container_ref.innerHTML = "";
          task_details_tasker_no_ref.innerHTML = "";

          // reset global variable
          globalTaskDetailsId = "";
          globalTaskDetailsCusId = "";
          globalTaskDetailsTaskerId = [];
          globalTaskDetailsPhotoName = [];
        }
      });
    });

    // fetch data and put in current input value
    const fetchData = async () => {
      const docSnap = await getDoc(doc(db, "task", post_input.id));
      post_input_title.value = docSnap.data().post_title;
      post_input_des.value = docSnap.data().post_des;
      post_input_start_date.value = docSnap.data().post_start_date;
      post_input_start_time.value = docSnap.data().post_start_time;
      post_input_end_date.value = docSnap.data().post_end_date;
      post_input_end_time.value = docSnap.data().post_end_time;
      post_input_price.value = docSnap.data().post_price_amount;
      post_input_price_unit.value = docSnap.data().post_price_unit;
      post_input_tasker_number.value = docSnap.data().post_tasker_no;
      post_input_cat.value = docSnap.data().post_categories;
      post_input_duration.value = docSnap.data().post_duration_amount;
      post_input_duration_unit.value = docSnap.data().post_duration_unit;
      loc_text.value = docSnap.data().post_location;

      // preview image
      let count = 0;
      image_preview.innerHTML = "";
      temp_array_image_arr = [];
      docSnap.data().post_photo_url.forEach((item) => {
        temp_array_image_arr.push(docSnap.data().post_photo_name[count]);
        const image = document.createElement("img");
        image.setAttribute("src", item);
        image_preview.appendChild(image);
        count++;
      });
    };

    fetchData();
  }
  Swal.close();
};

// ---------------------Post task edit mode end---------------------

// --------------all task categories list here-----------------

const task_categories_list = [
  "Food Delivery",
  "Home Repairs",
  "General Cleaning",
  "Help Moving",
  "Heavy Lifting",
  "Personal Assistant",
  "Yard Work Services",
  "Wait in Line",
  "Office Administration",
  "Research",
  "Installation",
  "Painting",
  "Plumbing",
  "Baby Proofing",
  "Electrical Help",
  "Carpentry & Construction",
  "Mounting",
  "Wallpapering Service",
  "Repair Services",
  "Unpacking Services",
  "Packing Services",
  "Junk Removal",
  "Haircuts",
  "House Cleaning",
  "Goods Delivery",
  "Car Wash Services",
  "Walk the animal",
  "Welding",
];
// sort array
task_categories_list.sort();

// --------------all task categories list end -----------------

// append each task into datalist
const add_category = function (task_category_list) {
  task_category_list.forEach((task) => {
    const taskList = `<option>${task}</option>`;
    this.insertAdjacentHTML("beforeend", taskList);
  });
};

add_category.call(post_input_cat_list, task_categories_list);
add_category.call(job_category, task_categories_list);

const handle_empty_input = function (e) {
  latest_oldest_option.value = "Please select an option";
  if (e.target.value === "") {
    populate_data();
  }
};

// search task by customer and tasker

search_task_button.addEventListener("click", async (e) => {
  latest_oldest_option.value = "Please select an option";
  let input = input_field.value;
  let filtered_task;
  input_field.removeEventListener("keyup", handle_empty_input);

  loader.classList.remove("loader--hidden");

  let tasks = await getDocs(
    query(collection(db, "task"), where("post_categories", "==", input))
  );
  filtered_task =
    current_user.role === "tasker" ? filter_task.call(tasks.docs) : tasks.docs;

  input_field.addEventListener("keyup", handle_empty_input);

  await render_search_result.call(filtered_task, search_task_section);
  latest_oldest_option.onchange = async function (e) {
    let order = this.value.toLowerCase().replace(" ", "");
    let task =
      order !== "nearbyme"
        ? sort_task.call(filtered_task, order)
        : await sort_distance.call(filtered_task, order);
    await render_search_result.call(task, search_task_section);
  };

  loader.classList.add("loader--hidden");
});

// Accept task
const accept_task = async function (e) {
  if (!e.target.classList.contains("btn--tasker")) return;
  let parent_divider = e.target.closest(".option-button-div");
  let task_detail = parent_divider.querySelector(".btn--view-detail").id;
  Swal.fire({
    title: "Do you want to apply this task/job?",
    showDenyButton: true,
    confirmButtonText: "Yes",
    denyButtonText: `No`,
  }).then(async (result) => {
    if (result.isConfirmed) {
      let current_task = await getDoc(doc(db, "task", task_detail));

      let data = current_task.data();
      data.tasker_id.push(current_user.user_id);

      await updateDoc(doc(db, "task", current_task.id), data);
    }
  });
};

search_task_section.addEventListener("click", accept_task);

// keep checking user selected correct categories
post_input_cat.addEventListener("change", (e) => {
  let optionFound = false;
  for (let i = 0; i < task_categories_list.length; i++) {
    if (post_input_cat.value === task_categories_list[i]) {
      optionFound = true;
      break;
    }
  }
  if (optionFound) {
    post_input_cat.setCustomValidity("");
  } else {
    post_input_cat.setCustomValidity("Please select a valid category");
  }
});

// user click submit
post_input.addEventListener("submit", (e) => {
  let error = false;
  e.preventDefault();

  // alert user
  Swal.fire({
    title: "Do you want to upload this task?",
    showDenyButton: true,
    confirmButtonText: "Yes",
    denyButtonText: "No",
  }).then(async (result) => {
    // user click yes
    if (result.isConfirmed) {
      Swal.fire({
        title: "Uploading...",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      Swal.showLoading();

      // check mode (edit or post)
      const post_photo = image_input.files;

      // convert filelist to array to user array method
      const image_arr = Array.from(post_photo);
      console.log(image_arr, "-----------------");

      // store image name
      const image_name_temp = [];
      image_arr.forEach((item) => {
        image_name_temp.push(item.name);
      });

      // task obj to submit
      const postObj = {
        post_title: post_input_title.value,
        post_categories: post_input_cat.value,
        post_des: post_input_des.value,
        post_start_date: post_input_start_date.value,
        post_start_time: post_input_start_time.value,
        post_end_date: post_input_end_date.value,
        post_end_time: post_input_end_time.value,
        post_location: loc_text.value,
        post_price_amount: post_input_price.value,
        post_price_unit: post_input_price_unit.value,
        post_duration_amount: post_input_duration.value,
        post_duration_unit: post_input_duration_unit.value,
        post_tasker_no: post_input_tasker_number.value,
        post_photo_url: "",
        post_photo_name: image_name_temp,
        post_location_long: location_long,
        post_location_lat: location_lat,
        post_location_regionCode: location_regionCode,
        post_location_locality: location_locality,
        added_at: Timestamp.now(),
        created_by: uid,
        status: "incomplete",
        tasker_id: [],
      };

      // change taskobj according to mode
      if (post_input.classList.contains("edit_mode")) {
        // check user got upload image or not
        // use back old image
        if (postObj.post_photo_name.length === 0) {
          delete postObj.post_photo_name;
          delete postObj.post_photo_url;
        }
        // check location
        // use back old data
        if (postObj.post_location_long === undefined) {
          delete postObj.post_location_long;
          delete postObj.post_location_lat;
          delete postObj.post_location_regionCode;
          delete postObj.post_location_locality;
        }
        // customer not allow to change accepted user
        delete postObj.tasker_id;
      }

      //add or update to database
      const addedDoc = post_input.classList.contains("edit_mode")
        ? await updateDoc(doc(collection(db, "task"), post_input.id), postObj)
        : await addDoc(collection(db, "task"), postObj);

      // delete original image storage if required
      if (
        post_input.classList.contains("edit_mode") &&
        postObj.post_photo_name !== undefined
      ) {
        // delete storage image
        // loop each image
        temp_array_image_arr.forEach((image_name) => {
          // Create a reference to the file to delete
          const desertRef = ref(storage, `task/${post_input.id}/${image_name}`);
          // Delete the file
          deleteObject(desertRef)
            .then(() => {
              console.log("delete image");
              // File deleted successfully
            })
            .catch((error) => {
              console.log(error);
              // Uh-oh, an error occurred!
            });
        });
      }

      // upload photo to storage firebase to get its photo URL
      image_arr.forEach((img) => {
        // the image will store in question/question.id/image.name
        // update doc will giv undefined
        const tempDocId = addedDoc === undefined ? post_input.id : addedDoc.id;
        const uploadPath = `task/${tempDocId}/${img.name}`;
        const storageRef = ref(storage, uploadPath);

        // upload image
        uploadBytes(storageRef, img)
          .then((storageImg) => {
            // get image URL from storage
            getDownloadURL(storageRef).then((imgURL) => {
              // update doc imgURL
              updateDoc(doc(db, "task", tempDocId), {
                post_photo_url: arrayUnion(imgURL),
              });
            });
            console.log("added image successful");
          })
          .catch((err) => {
            console.log(err);
            error = true;
          });
      });

      if (error) {
        //fail to upload data
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      } else {
        //success upload data
        Swal.fire({
          icon: "success",
          title: "Successful!",
          text: "Post task successfully",
        });

        // remove cancel button if is edit mode
        if (post_input.classList.contains("edit_mode")) {
          edit_post_btn_grp.removeChild(edit_post_btn_grp.lastElementChild);
        }

        // update edit mode
        post_input.classList.remove("edit_mode");
        post_input.removeAttribute("id");
        //reset form
        post_input.reset();
        listContainer.style.pointerEvents = "";
        image_preview.innerHTML = "";

        //reset button
        // update button
        edit_post_btn_grp.firstElementChild.setAttribute("value", "Post Task");

        // navigate to overview
        post_task_ref.classList.add("display-hidden");
        overview_ref.classList.remove("display-hidden");
        modal_window.classList.add("display-hidden");

        // change nav
        overview_nav_link.classList.add("list-section-active");
        post_nav_link.classList.remove("list-section-active");
        browse_nav_link.classList.remove("list-section-active");

        // reset global variable
        globalTaskDetailsId = "";
        globalTaskDetailsCusId = "";
        globalTaskDetailsTaskerId = [];
        globalTaskDetailsPhotoName = [];
      }
    }
  });
});

// Payment for customer
const payment_description = document.querySelector(".checkout__task--heading");
const checkout__currency = document.querySelector(".checkout__currency");
const checkout__amount = document.querySelector(".checkout__amount");
const checkout_payee = document.querySelector(".checkout__payee");
const checkout__task_img = document.querySelector(".checkout__task--img");

const control_animation = function (remove_properties, add_properties) {
  this.classList.remove(remove_properties);
  this.classList.add(add_properties);
};

const getUser = function (
  update = false,
  price = 0,
  customer_Id = undefined,
  taskId = undefined
) {
  let user_data = [];
  return new Promise((resolve, reject) => {
    if (!this.length) resolve(this.length);
    this.forEach(async (user_id, i) => {
      let user = await getDocs(
        query(collection(db, "user"), where("user_id", "==", user_id))
      );

      user_data.push({ ...user.docs[0].data() });

      if (update) {
        let total = user.docs[0].data().earning ?? 0;
        let task = user.docs[0].data().completed_task ?? 0;
        total = parseInt(total) + parseInt(price);
        task = parseInt(task) + 1;
        console.log(total);
        console.log(task);
        await updateDoc(doc(db, "user", user.docs[0].id), {
          ...user.docs[0].data(),
          earning: total,
          completed_task: task,
        });
        let transaction_obj = {
          user_id,
          amount: price,
          transaction_date: new Date(),
          customer_id: customer_Id,
          taskId,
        };
        await addDoc(collection(db, "transaction_history"), transaction_obj);
      }

      if (i === this.length - 1) resolve(user_data);
    });
  });
};

const prepare_form = function (...user) {
  let payee = user.map((user_obj) =>
    user_obj.username
      ? user_obj.username
      : user_obj.user_id.slice(0, 3).padEnd(10, ".")
  );

  payment_description.innerText = this.data().post_des;
  checkout__currency.innerText = this.data().post_price_unit;
  checkout__amount.innerText = this.data().post_price_amount.concat(".00");
  checkout_payee.innerText = payee.join(" , ");
  checkout__task_img.src = this.data().post_photo_url;
  checkout__task_img.alt = this.data().post_photo_name;
};

const complete_payment = async function () {
  this.classList.add("animation__checkout--complete");

  await new Promise((resolve, reject) => {
    setTimeout(resolve, 1000);
  });

  control_animation.call(
    this,
    "animation__checkout--complete",
    "display-hidden"
  );
  overlay.style.display = "none";
};

const updateUserAndTask = async function (task, e) {
  e.preventDefault();

  if (!e.target.classList.contains("payment__input--submit")) return;

  this.classList.remove("animation__checkout");

  let customer_doc = await getDocs(
    query(collection(db, "user"), where("user_id", "==", current_user.user_id))
  );
  let total_spend = customer_doc.docs[0].data().total_spending ?? 0;
  let total_task = customer_doc.docs[0].data().total_task_completed ?? 0;
  total_spend = parseInt(total_spend) + parseInt(task.data().post_price_amount);
  total_task = parseInt(total_task) + 1;
  await updateDoc(doc(db, "user", customer_doc.docs[0].id), {
    ...customer_doc.docs[0].data(),
    total_spending: total_spend,
    total_task_completed: total_task,
  });

  await getUser.call(
    task.data().tasker_id,
    true,
    task.data().post_price_amount,
    task.data().created_by,
    task.id
  );
  let update_task = task.data();
  update_task.status = "paid";
  await updateDoc(doc(db, "task", task.id), update_task);

  await complete_payment.call(this);
};

const handle_payment = async function (e) {
  e.preventDefault();
  if (current_user.role !== "customer") return;
  if (!e.target.classList.contains("btn__to_pay")) {
    if (e.target.classList.contains("btn--view-detail")) return;
    let task_Id = e.target
      .closest(".option-button-div")
      .querySelector(".btn--view-detail").id;
    let task_detail_handle = await getDoc(doc(db, "task", task_Id));
    if (!task_detail_handle.data().tasker_id.length) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "No one pick up this job yet!",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "The tasker havent completed this job/task yet",
      });
    }

    return;
  }
  checkout.removeEventListener("click", updateUserAndTask);

  let btn_holder = e.target.closest(".option-button-div");
  let task_id = btn_holder.querySelector(".btn--view-detail").id;
  let task = await getDoc(doc(db, "task", task_id));

  let user_data = await getUser.call(task.data().tasker_id);

  prepare_form.call(task, ...user_data);

  overlay.style.display = "block";
  control_animation.call(checkout, "display-hidden", "animation__checkout");
  checkout.addEventListener("click", updateUserAndTask.bind(checkout, task));
};

const close_payment = async function (e) {
  if (
    !(
      e.target.classList.contains("close__payment") ||
      e.target.classList.contains("close__payment--icon")
    )
  )
    return;
  await complete_payment.call(this);
};

const tasker_complete = async function (e) {
  if (!e.target.classList.contains("btn--tasker")) return;
  Swal.fire({
    title: "Do you want to complete this task?",
    showDenyButton: true,
    confirmButtonText: "Yes",
    denyButtonText: "No",
  }).then(async (result) => {
    if (result.isConfirmed) {
      let parent_btn_task = e.target.closest(".option-button-div");
      let task_id = parent_btn_task.querySelector(".btn--view-detail").id;
      let task = await getDoc(doc(db, "task", task_id));
      let task_complete = task.data();
      task_complete.status = "complete";
      await updateDoc(doc(db, "task", task.id), task_complete);
    }
  });
};

// Complete task by tasker

overview_task.addEventListener("click", handle_payment);
search_task_section.addEventListener("click", handle_payment);
checkout.addEventListener("click", close_payment);
overview_task.addEventListener("click", tasker_complete);

// --------------------task details section----------------------

// use to prevent the user open multiple task details at once
let isTaskDetailsOpen = false;
let isProfileModalOpen = false;
const post_task_ref = document.querySelector(".post-task");
const overview_ref = document.querySelector(".main-section");
const task_details_modal_ref = document.querySelector(".window-grid-container");
const close_btn_ref = document.getElementById("close_task_details");
const edit_btn_ref = document.querySelector(".btn-browse-edit");
const delete_btn_ref = document.querySelector(".btn-browse-delete");
const edit_delete_ref = document.querySelector(".tag-container");
const task_details_title_ref = document.querySelector(".task-title");
const task_details_tag_ref = document.querySelector(".task-tag");
const task_details_des_ref = document.querySelector(".task-description");
const task_details_cus_name_ref = document.querySelector(".customer-info-name");
const task_details_location_ref = document.querySelector(".task-location");
const task_details_contact_ref = document.querySelector(
  ".customer-info-contact"
);
const task_details_price_ref = document.querySelector(".task-price");
const task_details_start_time_ref = document.querySelector(".task-start-time");
const task_details_end_time_ref = document.querySelector(".task-end-time");
const task_details_duration_ref = document.querySelector(".task-duration");
const task_details_tasker_no_ref = document.querySelector(".tasker-required");
const task_details_tasker_no_span_ref = document.querySelector(
  ".tasker-required-span"
);
const task_details_image_container_ref = document.querySelector(
  ".window-img-container"
);
const cus_profile_click_ref = document.querySelector(".customer-info-name");
const tasker_field = document.querySelector(".current__tasker");
// -------------------------------------------------------

// close task details

const close_task = function () {
  // hide task details
  modal_window.classList.add("display-hidden");
  listContainer.style.pointerEvents = "";
  // set to false so the user can open another task details
  isTaskDetailsOpen = false;
  // reset image and span container
  task_details_image_container_ref.innerHTML = "";
  task_details_tasker_no_ref.innerHTML = "";
  globalTaskDetailsId = "";
  globalTaskDetailsCusId = "";
  globalTaskDetailsTaskerId = [];
  globalTaskDetailsPhotoName = [];
};

const reject_task = async function (e) {
  if (!e.target.classList.contains("btn--reject")) return;
  let target_task = await getDoc(doc(db, "task", globalTaskDetailsId));
  let reject_task = target_task.data();

  Swal.fire({
    title: "Do you want to reject this task/job?",
    showDenyButton: true,
    confirmButtonText: "Yes",
    denyButtonText: `No`,
  }).then(async (result) => {
    if (result.isConfirmed) {
      close_task();
      reject_task.tasker_id = reject_task.tasker_id.filter(
        (data) => !data === current_user.user_id
      );
      await updateDoc(doc(db, "task", target_task.id), reject_task);
    }
  });
};

const reject_by_client = async (e) => {
  if (!e.target.classList.contains("btn__reject--tasker")) return;
  let tasker_id = e.target.id;
  let target_task = await getDoc(doc(db, "task", globalTaskDetailsId));
  if (target_task.data().status !== "complete") {
    let task_to_update = target_task.data();
    let updated_task = target_task
      .data()
      .tasker_id.filter((user_id) => !user_id === tasker_id);
    task_to_update.tasker_id = updated_task;
    globalTaskDetailsTaskerId = updated_task; //update this oso
    Swal.fire({
      title: "Do you want to reject this tasker/jobseeker?",
      showDenyButton: true,
      confirmButtonText: "Yes",
      denyButtonText: `No`,
    }).then(async (result) => {
      await updateDoc(doc(db, "task", target_task.id), task_to_update);
      e.target.closest(".tasker__list").remove();
    });
  } else {
    Swal.fire({
      title: "This task has been completed,cannot reject the tasker",

      confirmButtonText: "ok",
    });
  }
};

window_task.addEventListener("click", reject_task);
window_task.addEventListener("click", reject_by_client);

close_btn_ref.addEventListener("click", (e) => {
  e.preventDefault();
  close_task();
});

// when user click edit
edit_btn_ref.addEventListener("click", (e) => {
  e.preventDefault();

  // unhide post page and hide current page
  post_task_ref.classList.remove("display-hidden");

  browse_section.classList.contains("display-hidden")
    ? overview_ref.classList.add("display-hidden")
    : browse_section.classList.add("display-hidden");

  // turn edit mode on for post page
  post_input.classList.add("edit_mode");
  post_input.setAttribute("id", globalTaskDetailsId);

  // hide task details modal
  modal_window.classList.add("display-hidden");

  isTaskDetailsOpen = false;

  //reset task details
  task_details_image_container_ref.innerHTML = "";
  task_details_tasker_no_ref.innerHTML = "";

  // toggle edit mode
  browse_section.classList.contains("display-hidden")
    ? outputEditData(overview_task)
    : outputEditData(browse_section);
});

// when user click delete
delete_btn_ref.addEventListener("click", (e) => {
  e.preventDefault();

  // alert user
  Swal.fire({
    title: "Do you want to delete the question?",
    showDenyButton: true,
    confirmButtonText: "Yes",
    denyButtonText: `No`,
  }).then(async (result) => {
    // delete
    if (result.isConfirmed) {
      // loading
      Swal.fire({
        title: "Now Loading...",
        allowEscapeKey: false,
        allowOutsideClick: false,
      });
      Swal.showLoading();

      // delete storage image
      // loop each image
      globalTaskDetailsPhotoName.forEach((image_name) => {
        // Create a reference to the file to delete
        const desertRef = ref(
          storage,
          `task/${globalTaskDetailsId}/${image_name}`
        );
        // Delete the file
        deleteObject(desertRef)
          .then(() => {
            console.log("delete image");

            // File deleted successfully
          })
          .catch((error) => {
            console.log(error);
            // Uh-oh, an error occurred!
          });
      });

      // delete doc
      await deleteDoc(doc(collection(db, "task"), globalTaskDetailsId));
      Swal.close();
      Swal.fire("Deleted!", "", "success");

      // hide task details modal
      modal_window.classList.add("display-hidden");
      listContainer.style.pointerEvents = "";

      isTaskDetailsOpen = false;
      globalTaskDetailsId = "";

      //reset task details
      task_details_image_container_ref.innerHTML = "";
      task_details_tasker_no_ref.innerHTML = "";

      // reset global variable
      globalTaskDetailsId = "";
      globalTaskDetailsCusId = "";
      globalTaskDetailsTaskerId = [];
      globalTaskDetailsPhotoName = [];
    }
  });
});

// handle details (update all details with respective task)
const functionHandleDetails = (e) => {
  e.preventDefault();
  tasker_field.innerHTML = "";
  // if user click view details button for first time
  if (
    e.target.className === "btn--view-detail" &&
    !isTaskDetailsOpen &&
    !isProfileModalOpen
  ) {
    // set global task id so that can pass to edit page
    globalTaskDetailsId = e.target.id;

    // set to true to prevent user open another task details
    isTaskDetailsOpen = true;
    task_details_modal_ref.classList.remove("display-hidden");

    // fetch data
    const fetchData = async () => {
      const docSnap = await getDoc(doc(db, "task", e.target.id));
      const q = query(
        collection(db, "user"),
        where("user_id", "==", docSnap.data().created_by)
      );
      const userSnap = await getDocs(q);
      const userData = userSnap.docs[0];

      // ------------- add the data details start -------------
      // set global variable
      globalTaskDetailsCusId = userData.data().user_id;
      globalTaskDetailsTaskerId = docSnap.data().tasker_id;
      globalTaskDetailsPhotoName = docSnap.data().post_photo_name;

      // add image
      if (docSnap.data().post_photo_url) {
        docSnap.data().post_photo_url.forEach((img) => {
          const image = document.createElement("img");
          image.setAttribute("src", img);
          image.classList.add("window-img");
          task_details_image_container_ref.appendChild(
            image,
            task_details_modal_ref
          );
        });
      }

      // add the rest details
      task_details_title_ref.innerText = docSnap.data().post_title;
      task_details_tag_ref.innerText = `Categories: ${
        docSnap.data().post_categories
      }`;
      task_details_des_ref.innerText = `${
        docSnap.data().post_des
      } `;
      if (userData.data().gender && userData.data().username) {
        task_details_cus_name_ref.innerText =
          userData.data().gender === "Male" ? "Mr" : "Mrs";
        task_details_cus_name_ref.innerText += " " + userData.data().username;
      } else {
        task_details_cus_name_ref.innerText = "?";
      }

      task_details_location_ref.innerText = docSnap.data().post_location;
      if (userData.data().contact) {
        task_details_contact_ref.innerText = userData.data().contact;
      } else {
        task_details_contact_ref.innerText = "?";
      }
      task_details_price_ref.innerText =
        docSnap.data().post_price_unit + " " + docSnap.data().post_price_amount;
      task_details_start_time_ref.innerText =
        docSnap.data().post_start_date + docSnap.data().post_start_time;
      task_details_end_time_ref.innerText =
        docSnap.data().post_end_date + docSnap.data().post_end_time;
      task_details_duration_ref.innerText =
        docSnap.data().post_duration_amount +
        " " +
        docSnap.data().post_duration_unit;
      task_details_tasker_no_ref.innerText = `${
        docSnap.data().post_tasker_no
      } tasker `;
      const tasker_span = document.createElement("span");
      tasker_span.classList.add("tool-tip");
      tasker_span.innerText = `${
        docSnap.data().post_tasker_no
      } tasker required`;
      task_details_tasker_no_ref.appendChild(tasker_span);

      if (current_user.role === "customer") {
        let html = "";

        docSnap.data().tasker_id.forEach((user_id, i) => {
          let str = "";
          if (
            docSnap.data().status !== "paid" &&
            docSnap.data().created_by === current_user.user_id
          ) {
            str = `<a href="#" class="btn__reject--tasker" id=${user_id}>Reject</a></li>`;
          }

          html = html.concat(
            `<li class="tasker__list">tasker${i + 1}: ${user_id
              .slice(0, 5)
              .padEnd(10, ".")} ${str}`
          );
        });

        tasker_field.insertAdjacentHTML("beforeend", html);
      }

      // ------------- add the details end -------------

      // show modal
      modal_window.classList.remove("display-hidden");

      // only show edit delete button if user created it
      const authEditDelete = getAuth();
      const userEditDelete = authEditDelete.currentUser;
      // if user created it
      docSnap.data().created_by === userEditDelete.uid
        ? (edit_delete_ref.style.visibility = "visible")
        : (edit_delete_ref.style.visibility = "hidden");
    };

    // user can open task details
    Swal.showLoading();
    fetchData();
    listContainer.style.pointerEvents = "none";
    Swal.close();
  }
  // user click outside when open task details
  else if (
    e.target.className !== "btn--view-detail" &&
    isTaskDetailsOpen &&
    !isProfileModalOpen
  ) {
    isTaskDetailsOpen = false;
    // hide current task detail
    modal_window.classList.add("display-hidden");
    listContainer.style.pointerEvents = "";
    // reset image and span container
    task_details_image_container_ref.innerHTML = "";
    task_details_tasker_no_ref.innerHTML = "";
  }
  // user click outside when open profile modal
  else if (
    e.target.className !== "btn--view-detail" &&
    isTaskDetailsOpen &&
    isProfileModalOpen
  ) {
    isProfileModalOpen = false;
    profile_modal_container_ref.classList.add("display-hidden");
    task_details_modal_ref.classList.remove("display-hidden");
    profile_modal_user_container_ref.innerHTML = "";
  }
};

// when user click show profile for customer
cus_profile_click_ref.addEventListener("click", async () => {
  isProfileModalOpen = true;

  // hide task details
  task_details_modal_ref.classList.add("display-hidden");

  // get cus profile data from database
  const q = query(
    collection(db, "user"),
    where("user_id", "==", globalTaskDetailsCusId)
  );
  const querySnapshot = await getDocs(q);
  const user_id = querySnapshot.docs[0].data();

  showUserProfile([user_id]);
  // showUserProfile(tempUser);
});

// when user click show profile for tasker
task_details_tasker_no_ref.addEventListener("click", async () => {
  isProfileModalOpen = true;

  // hide task details
  task_details_modal_ref.classList.add("display-hidden");

  // get cus profile data from database
  // only query if there are tasker accepted
  const tempArr = [];

  if (globalTaskDetailsTaskerId.length !== 0) {
    const q = query(
      collection(db, "user"),
      where("user_id", "in", globalTaskDetailsTaskerId)
    );
    const querySnapshot = await getDocs(q);

    const pushData = new Promise((resolve, reject) => {
      querySnapshot.forEach((item) => {
        tempArr.push(item.data());
        if (tempArr.length === querySnapshot.docs.length) resolve();
        // if (index === array.length -1) resolve();
      });
    });

    pushData.then(() => {
      showUserProfile(tempArr);
    });
  } else {
    showUserProfile(tempArr);
  }
});

// when user click task details for
// browse task part
search_task_section.addEventListener("click", (e) => {
  e.preventDefault();
  functionHandleDetails(e, browse_section);
});

// overview part
overview_task.addEventListener("click", (e) => {
  e.preventDefault();
  functionHandleDetails(e, overview_ref);
});

// ------------- task details end ----------------

// ------------- task details profile ----------------

const profile_modal_user_container_ref = document.querySelector(
  ".profile_modal_popup_content_user_list"
);
const profile_modal_close_ref = document.querySelector(
  ".profile_modal_popup_close"
);
const profile_modal_container_ref = document.querySelector(
  ".profile_modal_popup_container"
);
const profile_modal_img_ref = document.querySelector(
  ".profile_modal_popup_picture_img"
);
const profile_modal_name_ref = document.querySelector(
  ".profile_modal_popup_content_name"
);
const profile_modal_role_ref = document.querySelector(
  ".profile_modal_popup_content_role"
);
const profile_modal_email_ref = document.querySelector(
  ".profile_modal_popup_content_email"
);
const profile_modal_contact_ref = document.querySelector(
  ".profile_modal_popup_content_contact"
);
const profile_modal_gender_ref = document.querySelector(
  ".profile_modal_popup_content_gender"
);
const profile_modal_status_ref = document.querySelector(
  ".profile_modal_popup_content_status"
);
const profile_modal_address_ref = document.querySelector(
  ".profile_modal_popup_content_address"
);

// function to show profile of user
const showUserProfile = (user_id) => {
  profile_modal_container_ref.classList.remove("display-hidden");
  let count = 0;

  // create tasker list based on current tasker / customer
  user_id.forEach((user) => {
    const userList = document.createElement("li");
    userList.classList.add("profile_modal_popup_content_user_li");
    userList.setAttribute("id", user.user_id);
    userList.innerText = `Tasker ${++count} : ${user.user_id}`;
    profile_modal_user_container_ref.appendChild(userList);
  });

  // console.log(user_id);

  // initialize data with first tasker
  // if got user
  if (user_id.length !== 0) {
    profile_modal_img_ref.setAttribute("src", user_id[0].profile_pic_url);
    profile_modal_name_ref.innerText = `Username: ${user_id[0].username}`;
    profile_modal_role_ref.innerText = `Role: ${user_id[0].role}`;
    profile_modal_email_ref.innerText = `Email: ${user_id[0].email}`;
    profile_modal_contact_ref.innerText = `Contact: ${user_id[0].contact}`;
    profile_modal_gender_ref.innerText = `Gender: ${user_id[0].gender}`;
    profile_modal_status_ref.innerText = `Marital Status: ${user_id[0].marital_status}`;
    profile_modal_address_ref.innerText = `Address: ${user_id[0].address}`;
    profile_modal_user_container_ref.firstElementChild.classList.add(
      "profile_modal_user_list_active"
    );
    // user click each user list on left side
    const profile_modal_user_list_ref = document.querySelectorAll(
      ".profile_modal_popup_content_user_li"
    );

    profile_modal_user_container_ref.addEventListener("click", (e) => {
      profile_modal_user_list_ref.forEach((user_nav) => {
        e.target.id === user_nav.id
          ? user_nav.classList.add("profile_modal_user_list_active")
          : user_nav.classList.remove("profile_modal_user_list_active");
      });

      // change right content according to the user data
      user_id.forEach((user_data) => {
        // == instead === because diff data type
        if (user_data.user_id == e.target.id) {
          profile_modal_img_ref.setAttribute("src", user_data.profile_pic_url);
          profile_modal_name_ref.innerText = `Username: ${user_data.username}`;
          profile_modal_role_ref.innerText = `Role: ${user_data.role}`;
          profile_modal_email_ref.innerText = `Email: ${user_data.email}`;
          profile_modal_contact_ref.innerText = `Contact: ${user_data.contact}`;
          profile_modal_gender_ref.innerText = `Gender: ${user_data.gender}`;
          profile_modal_status_ref.innerText = `Marital Status: ${user_data.marital_status}`;
          profile_modal_address_ref.innerText = `Address: ${user_data.address}`;
        }
      });
    });
  }
  // no user
  else {
    const userList = document.createElement("li");
    userList.classList.add("profile_modal_popup_content_user_li");
    userList.innerText = `No User`;
    profile_modal_user_container_ref.appendChild(userList);
  }

  // user click close modal
  profile_modal_close_ref.addEventListener("click", () => {
    isProfileModalOpen = false;
    // show task details modal
    task_details_modal_ref.classList.remove("display-hidden");

    // hide profile modal
    profile_modal_container_ref.classList.add("display-hidden");

    profile_modal_user_container_ref.innerHTML = "";

    // reset field
    profile_modal_img_ref.setAttribute("src", "");
    profile_modal_name_ref.innerText = "";
    profile_modal_role_ref.innerText = "";
    profile_modal_email_ref.innerText = "";
    profile_modal_contact_ref.innerText = "";
    profile_modal_gender_ref.innerText = "";
    profile_modal_status_ref.innerText = "";
    profile_modal_address_ref.innerText = "";
  });
};

// ------------- task details profile end----------------
