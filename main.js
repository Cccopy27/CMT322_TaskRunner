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
} from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { async } from "@firebase/util";
let overview_task = document.querySelector(".task-card-content");
let search_task_section = document.querySelector(".search-task--section");
let job_category = document.querySelector("#job--category");
const search_task_button = document.querySelector(".search--task--button");
const loader = document.querySelector(".loader");

const auth = getAuth();
let uid;

const render_search_result = function (section) {
  section.innerHTML = "";
  this.forEach((doc) => {
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
                      <button class="btn btn--apply">Complete</button>
                    </div>
                  </div>
                </div>`;
    section.insertAdjacentHTML("beforeend", html);
  });
};

const populate_data = async function () {
  let search_section_data = await getDocs(collection(db, "task"));

  render_search_result.call(search_section_data.docs, search_task_section);
};

onAuthStateChanged(auth, async (user) => {
  if (user) {
    let query_user = await getDocs(
      query(collection(db, "user"), where("user_id", "==", user.uid))
    );
    uid = user.uid;
    let current_user = query_user.docs[0].data();
    console.log(current_user);

    let query_task = query(
      collection(db, "task"),
      where("created_by", "==", user.uid)
      // orderBy("added_at", "desc")
    );

    onSnapshot(query_task, (snapshot) => {
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
                            <button class="btn btn--apply">Complete</button>
                          </div>
                        </div>
                      </div>`;

        all_holder[index].insertAdjacentHTML("beforeend", html);
        count++;
      });
      slide = all_holder;
      slide_to(0);
      populate_data();
    });

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

    // handle profile image
    profile_image_input_ref.addEventListener("change", (e) => {
      const file = profile_image_input_ref.files;
      console.log(file);
      // preview image
      profile_image_preview_ref.setAttribute(
        "src",
        `${URL.createObjectURL(file[0])}`
      );
    });
    // user submit profile form
    profile_form_submit_ref.addEventListener("submit", (e) => {
      e.preventDefault();

      const profileObj = {
        username: username_ref.value,
        email: email_ref.value,
        contact: contact_ref.value,
        address: address_ref.value,
        gender: gender_ref.value,
        marital_status: marital_status_ref.value,
      };
      // if user change profile pic
      console.log(query_user.docs[0].profile_pic_name);
      if (profile_image_input_ref.files.length !== 0) {
        profileObj["profile_pic_name"] = profile_image_input_ref.files[0].name;
      }
      if (!query_user.docs[0].profile_pic_name) {
        console.log("hi");
      }

      updateDoc(doc(collection(db, "user"), query_user.docs[0].id), profileObj)
        .then(() => {
          // if user change profile pic
          if (profile_image_input_ref.files.length !== 0) {
            // upload photo to storage firebase to get its photo URL
            const uploadPath = `user/${query_user.docs[0].id}/${profile_image_input_ref.files[0].name}`;
            const storageRef = ref(storage, uploadPath);

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
    const profile_doc_ref = doc(collection(db, "user"), query_user.docs[0].id);

    // add listener to user doc
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

const post_input = document.querySelector(".post-task-form");
const post_input_title = document.getElementById("task-title");
const post_input_des = document.getElementById("task-des");
const post_input_start_date = document.getElementById("task-start-date");
const post_input_start_time = document.getElementById("task-start-time");
const post_input_end_date = document.getElementById("task-end-date");
const post_input_end_time = document.getElementById("task-end-time");
const post_input_location = document.getElementById("task-location");
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

// toggle edit mode
const outputEditData = (current_layout) => {
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

    // handle cancel
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
          // update edit mode
          post_input.classList.remove("edit_mode");
          post_input.removeAttribute("id");
          //reset form
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
          edit_post_btn_grp.removeChild(edit_post_btn_grp.lastChild);

          // navigate to browse mode
          post_task_ref.classList.add("display-hidden");
          current_layout.classList.remove("display-hidden");
          task_details_ref.innerHTML = "";
          task_details_ref.classList.add("display-hidden");
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
      post_input_location.value = docSnap.data().post_location;

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

// all task categories list here
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

// append each task into datalist
const add_category = function (task_category_list) {
  task_category_list.forEach((task) => {
    const taskList = `<option>${task}</option>`;
    this.insertAdjacentHTML("beforeend", taskList);
  });
};

add_category.call(post_input_cat_list, task_categories_list);
add_category.call(job_category, task_categories_list);

search_task_button.addEventListener("click", async (e) => {
  let search_section = e.target.closest(".search--input--field");
  let input = search_section.querySelector(".job--choice").value;
  loader.classList.remove("loader--hidden");

  let tasks = await getDocs(
    query(collection(db, "task"), where("post_categories", "==", input))
  );
  render_search_result.call(tasks.docs, search_task_section);

  loader.classList.add("loader--hidden");
});

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

// handle submit
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

      // task obj
      const postObj = {
        post_title: post_input_title.value,
        post_categories: post_input_cat.value,
        post_des: post_input_des.value,
        post_start_date: post_input_start_date.value,
        post_start_time: post_input_start_time.value,
        post_end_date: post_input_end_date.value,
        post_end_time: post_input_end_time.value,
        post_location: post_input_location.value,
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
      console.log(postObj);

      //add or update to database

      const addedDoc = post_input.classList.contains("edit_mode")
        ? await updateDoc(doc(collection(db, "task"), post_input.id), postObj)
        : await addDoc(collection(db, "task"), postObj);
      // console.log(addedDoc);

      // delete original image storage if required
      if (
        post_input.classList.contains("edit_mode") &&
        temp_array_image_arr.length !== 0
      ) {
        // delete storage image
        // loop each image
        temp_array_image_arr.forEach((image_name) => {
          // Create a reference to the file to delete
          const desertRef = ref(storage, `task/${post_input.id}/${image_name}`);
          // Delete the file
          deleteObject(desertRef)
            .then(() => {
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
      console.log("finished");
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
        // remove last btn
        edit_post_btn_grp.removeChild(edit_post_btn_grp.lastChild);

        // navigate to overview
        post_task_ref.classList.add("display-hidden");
        overview_ref.classList.remove("display-hidden");
        task_details_ref.innerHTML = "";
        task_details_ref.classList.add("display-hidden");

        // change nav
        overview_nav_link.classList.add("list-section-active");
        post_nav_link.classList.remove("list-section-active");
      }
    }
  });
});

// check task details
const task_details_ref = document.querySelector(".window-task-information");
// use to prevent the user open multiple task details at once
let isTaskDetailsOpen = false;
// fetch data
const post_task_ref = document.querySelector(".post-task");
const browser_task_ref = document.querySelector(".browse-task--section");
const overview_ref = document.querySelector(".main-section");

const functionHandleDetails = (e, current_layout) => {
  e.preventDefault();
  // if user click view details button
  if (e.target.className === "btn--view-detail" && !isTaskDetailsOpen) {
 
    // set to true to prevent user open another task details
    isTaskDetailsOpen = true;
    const fetchData = async () => {
      // fetch data
      const docSnap = await getDoc(doc(db, "task", e.target.id));
      // fetch user data that create this task
      const q = query(collection(db,"user"),where("user_id","==",docSnap.data().created_by))
      const userSnap = await getDocs(q);
      const userData = userSnap.docs[0];
      // add image html
      let imgHtml = "";
      if (docSnap.data().post_photo_url) {
        docSnap.data().post_photo_url.forEach((img) => {
          imgHtml += `<img class="window-img" src=${img} alt="" />`;
        });
      }

      // add details html
      let taskDetailsHtml = `
      <div class="window-grid-container">
        
          ${imgHtml}
        
        <div class="task--info">
          <h2 class="task-title">
            ${docSnap.data().post_title}
          </h2>
          <p class="task-tag">
              Categories: ${docSnap.data().post_categories}
          </p>
          
          <div class="tag-container">
          
            <button class="btn-browse-edit">edit</button>
            <button class="btn-browse-delete">delete</button>
            
          </div>

            <p class="task-description">
              ${docSnap.data().post_des} lOREn dniwnd wnwindwi wnnwi wnmos nrnrn
            </p>
          
          </div>

          <div class="task-details-bottom">
            <div class="customer-info-container">
              <div class="customer-info">
                <ion-icon
                  class="customer-info-icon"
                  name="person-outline"
                ></ion-icon>
                <p class="customer-info--text">Mr${userData.data().username === undefined ? "?":userData.data().username }</p>
              </div>
              <div class="customer-info">
                <ion-icon
                  class="customer-info-icon"
                  name="location-outline"
                ></ion-icon>
                <p class="customer-info--text">
                  address
                  <span class="tool-tip">
                    ${docSnap.data().post_location}
                  </span>
                </p>
              </div>
              <div class="customer-info">
                <ion-icon
                  class="customer-info-icon"
                  name="call-outline"
                ></ion-icon>
                <p class="customer-info--text">${userData.data().contact === undefined ? "?": userData.data().contact}</p>
              </div>
              <div class="customer-info">
                <ion-icon
                  class="customer-info-icon"
                  name="wallet-outline"
                ></ion-icon>
                <p class="customer-info--text">
                  ${docSnap.data().post_price_unit} ${
        docSnap.data().post_price_amount
      }
                </p>
              </div>
            </div>
            <div class="task-info-container">
              <div class="task-info">
                <ion-icon
                class="task-info-icon"
                name="time-outline"
                ></ion-icon>
                <p class="task-info-text">
                Start
                <span class="tool-tip">

                ${docSnap.data().post_start_date} ${
        docSnap.data().post_start_time
      }
                </span> 
                 
                </p>
              </div>
              <div class="task-info">
                <ion-icon
                class="task-info-icon"
                name="time-outline"
                ></ion-icon>
                <p class="task-info-text">
                End
                <span class="tool-tip">

                ${docSnap.data().post_start_date} ${
        docSnap.data().post_start_time
      }
                </span> 
                </p>
              </div>
              <div class="task-info">
                <ion-icon
                class="task-info-icon"
                name="timer-outline"
                ></ion-icon>
                <p class="task-info-text">
                ${docSnap.data().post_duration_amount} ${
        docSnap.data().post_duration_unit
      } 
                </p>
              </div>
              <div class="task-info">
                <ion-icon
                class="task-info-icon"
                name="people-outline"
                ></ion-icon>
                <p class="task-info-text">
                <span class="tool-tip">

                ${docSnap.data().post_tasker_no} tasker required

                  
                </span> 
                ${docSnap.data().post_tasker_no} tasker</p>
              </div>
            </div>

            <div class="padding-div accept--button">
            <div class="option-button-div">
              <a href="#" class="btn--view-detail">Accept</a>
              <button class="btn btn--apply" id="close_task_details">Close</button>
            </div>
          </div>

          </div>
          
    
      </div>`;
      task_details_ref.innerHTML += taskDetailsHtml;
      task_details_ref.classList.remove("display-hidden");

      // close task details
      const close_btn_ref = document.getElementById("close_task_details");
      close_btn_ref.addEventListener("click", (e) => {
        e.preventDefault();
        task_details_ref.innerHTML = "";
        task_details_ref.classList.add("display-hidden");
        listContainer.style.pointerEvents = "";
        // set to false so the user can open another task details
        isTaskDetailsOpen = false;
      });

      const edit_btn_ref = document.querySelector(".btn-browse-edit");
      const delete_btn_ref = document.querySelector(".btn-browse-delete");

      // navigate to edit page
      edit_btn_ref.addEventListener("click", (eEdit) => {
        eEdit.preventDefault();
        post_task_ref.classList.remove("display-hidden");
        current_layout.classList.add("display-hidden");
        post_input.classList.add("edit_mode");
        post_input.setAttribute("id", e.target.id);
        task_details_ref.innerHTML = "";
        task_details_ref.classList.add("display-hidden");
        // toggle edit mode
        outputEditData(current_layout);
      });

      // handle delete
      delete_btn_ref.addEventListener("click", (eDel) => {
        eDel.preventDefault();
        // alert user
        Swal.fire({
          title: "Do you want to delete the question?",
          showDenyButton: true,
          confirmButtonText: "Yes",
          denyButtonText: `No`,
        }).then(async (result) => {
          // delete
          if (result.isConfirmed) {
            Swal.fire({
              title: "Now Loading...",
              allowEscapeKey: false,
              allowOutsideClick: false,
            });
            Swal.showLoading();

            // delete storage image
            // loop each image
            docSnap.data().post_photo_name.forEach((image_name) => {
              // Create a reference to the file to delete
              const desertRef = ref(
                storage,
                `task/${e.target.id}/${image_name}`
              );
              // Delete the file
              deleteObject(desertRef)
                .then(() => {
                  // File deleted successfully
                })
                .catch((error) => {
                  console.log(error);
                  // Uh-oh, an error occurred!
                });
            });
            Swal.showLoading();
            await deleteDoc(doc(collection(db, "task"), e.target.id));
            Swal.close();
            Swal.fire("Deleted!", "", "success");
            task_details_ref.innerHTML = "";
            task_details_ref.classList.add("display-hidden");
            listContainer.style.pointerEvents = "";
          }
        });
      });
    };
    Swal.showLoading();
    fetchData();
    listContainer.style.pointerEvents = "none";
    Swal.close();
  } else {
    isTaskDetailsOpen = false;
    task_details_ref.innerHTML = "";
    task_details_ref.classList.add("display-hidden");
    listContainer.style.pointerEvents = "";
  }
};
// when user click task
// browse task part
search_task_section.addEventListener("click", (e) => {
  e.preventDefault();
  functionHandleDetails(e, browser_task_ref);
});

// overview part
overview_task.addEventListener("click", (e) => {
  functionHandleDetails(e, overview_ref);
});
