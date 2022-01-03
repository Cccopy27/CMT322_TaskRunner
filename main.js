"use strict";

let current_slide = 0;

const slide = document.querySelectorAll(".slide-task-holder");
let maxSlide = slide.length;

const slider = document.querySelector(".task-card-content");
// slider.style.transform = "scale(0.5)";

const slider_btn_right = document.querySelector(".slider-button-right");
const slider_btn_left = document.querySelector(".slider-button-left");

const slide_to = function (move) {
  slide.forEach((current_sl, i) => {
    current_sl.style.transform = `translate(${100 * (i - move)}%)`;
  });
};

slide_to(0);

const direction = function (move, condition) {
  if (current_slide === condition) {
    return;
  }

  move === "right" ? current_slide++ : current_slide--;

  slide_to(current_slide);
};

slider_btn_right.addEventListener(
  "click",
  direction.bind(null, "right", maxSlide - 1)
);
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
});

// button get user self location
loc_btn_get.addEventListener("click", (e) => {
  e.preventDefault();

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

image_input.addEventListener("change", (e) => {
  const file = image_input.files;
  console.log(file.length);
  for (let i = 0; i < file.length; i++) {
    const image = document.createElement("img");
    image.setAttribute("src", `${URL.createObjectURL(file[i])}`);
    image_preview.appendChild(image);
  }

  // if(file){
  //   image_preview.src = URL.createObjectURL(file);
  // }
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
  onSnapshot,
  where,
  query,
  orderBy,
  getDoc,
  deleteDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, list,  deleteObject } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { async } from "@firebase/util";
let uid = "";
const auth = getAuth();
console.log(auth);

onAuthStateChanged(auth, (user) => {
  if (user) {
    uid = user.uid;
    console.log(uid);
    
  } else {
    
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
const post_input_photo = document.getElementById("task-photo");
const post_input_cat = document.querySelector(".post-task-cat-input");
const post_input_duration = document.querySelector(".post-task-input-duration");
const post_input_duration_unit = document.querySelector(
  ".task-duration-unit-opt"
);
const submit_btn = document.querySelector(".post-input-submit");
const inputs = document.querySelectorAll("input[list]");
const post_input_cat_list = document.querySelector(".post-task-cat-list");

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
task_categories_list.forEach((task) => {
  const taskList = document.createElement("option");
  taskList.value = task;
  post_input_cat_list.appendChild(taskList);
});

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

post_input.addEventListener("submit", async (e) => {
  console.log(uid);
  let error = false;
  e.preventDefault();
  const post_photo = post_input_photo.files;

  // convert filelist to array to user array method
  const image_arr = Array.from(post_photo);

  const image_name_temp = [];
  image_arr.forEach(item=>{
    image_name_temp.push(item.name);
  })
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
  console.log(postObj);

  // loading
  submit_btn.value = "Uploading task...Please wait";
  submit_btn.disabled = true;

  //add to database
  const addedDoc = await addDoc(collection(db, "task"), postObj);
  console.log("added document");


  // upload photo to storage firebase to get its photo URL
  image_arr.forEach((img) => {
    // the image will store in question/question.id/image.name
    const uploadPath = `task/${addedDoc.id}/${img.name}`;
    const storageRef = ref(storage, uploadPath);

    uploadBytes(storageRef, img)
      .then((storageImg) => {
        // get image URL from storage
        getDownloadURL(storageRef).then((imgURL) => {
          // update doc imgURL
          updateDoc(doc(db, "task", addedDoc.id), {
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

  submit_btn.value = "Post Task";
  submit_btn.disabled = false;
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

    //reset form
    post_input.reset();
  }
});



// output task with data
const task_list = document.querySelector(".search-task--section");
// fetch all data
// order by latest
const Outref = query(collection(db,"task"),orderBy("added_at","desc"));
// let document =[""];

onSnapshot(Outref, (snapshot)=>{
  console.log("I keep running in onSnapShot collections");
  task_list.innerHTML="";
  snapshot.docs.forEach((doc)=>{
    // document.push({...doc.data(), id: doc.id});
    // html format
    const html = `
            <div class="section-task-card" >
              <img class="search-task-img" src=${doc.data().post_photo_url} alt="" />
              <div class="padding-div">
                <p class="search-task-paragraph">
                  ${doc.data().post_title}
                </p>
              </div>

              <div class="padding-div">
                <div class="option-button-div">
                  <a href="#" class="btn--view-detail" id=${doc.id}>view details</a>
                  <button class="btn btn--apply">apply</button>
                </div>
              </div>
            </div>
            `
    task_list.innerHTML += html;
  });

  
},(error)=>{
  console.log(error);

})

// check task details

const task_details_ref = document.querySelector(".window-task-information");
// console.log(document);
// fetch data
const post_task_ref = document.querySelector(".post-task");
const browser_task_ref = document.querySelector(".browse-task--section");

task_list.addEventListener("click",(e)=>{
  // console.log(e);
  if(e.target.className === "btn--view-detail"){
    const fetchData = async()=>{
      const docSnap = await getDoc(doc(db,"task",e.target.id));
      console.log("hit");
      let taskDetailsHtml =`
      <div class="window-grid-container">
        <div class="window-img-container">
          <img class="window-img" src=${docSnap.data().post_photo_url} alt="" />
        </div>
        <p class="task-title">
          ${docSnap.data().post_title}
        </p>
        <p class="task-description">
          ${docSnap.data().post_des}
        </p>
        <div class="tag-container">
          <p class="task-tag">
            Categories: ${docSnap.data().post_categories}
          </p>
          <div class="btn-grp">
            <button class="btn-browse-edit">edit</button>
            <button class="btn-browse-delete">delete</button>
          </div>
        </div>
        
        <div class="task-details-bottom">
          <div class="customer-info-container">
            <div class="customer-info">
              <ion-icon
                class="customer-info-icon"
                name="person-outline"
              ></ion-icon>
              <p class="customer-info--text">Mr. Loh</p>
            </div>
            <div class="customer-info">
              <ion-icon
                class="customer-info-icon"
                name="location-outline"
              ></ion-icon>
              <p class="customer-info--text">
                ${docSnap.data().post_location}
              </p>
            </div>
            <div class="customer-info">
              <ion-icon
                class="customer-info-icon"
                name="call-outline"
              ></ion-icon>
               <p class="customer-info--text">0115261200</p>
            </div>
            <div class="customer-info">
              <ion-icon
                class="customer-info-icon"
                name="wallet-outline"
              ></ion-icon>
              <p class="customer-info--text">
                ${docSnap.data().post_price_unit} ${docSnap.data().post_price_amount}
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
              Start: 
                ${docSnap.data().post_start_date} ${docSnap.data().post_start_time}
              </p>
            </div>
            <div class="task-info">
              <ion-icon
              class="task-info-icon"
              name="time-outline"
              ></ion-icon>
              <p class="task-info-text">
                End: ${docSnap.data().post_end_date} ${docSnap.data().post_end_time}
              </p>
            </div>
            <div class="task-info">
              <ion-icon
              class="task-info-icon"
              name="timer-outline"
              ></ion-icon>
              <p class="task-info-text">
              ${docSnap.data().post_duration_amount} ${docSnap.data().post_duration_unit} 
              </p>
            </div>
            <div class="task-info">
              <ion-icon
              class="task-info-icon"
              name="people-outline"
              ></ion-icon>
              <p class="task-info-text">${docSnap.data().post_tasker_no} tasker required</p>
            </div>
          </div>
        </div>
        
        <div class="padding-div">
          <div class="option-button-div">
            <a href="#" class="btn--view-detail">Accept</a>
            <button class="btn btn--apply" id="close_task_details">Close</button>
          </div>
        </div>
      </div>`
      task_details_ref.innerHTML+=taskDetailsHtml;
      task_details_ref.classList.remove("display-hidden");

      // close task details
      const close_btn_ref = document.getElementById("close_task_details");
      close_btn_ref.addEventListener("click",e=>{
        console.log(e);
          e.preventDefault();
          task_details_ref.innerHTML="";
          task_details_ref.classList.add("display-hidden");
          listContainer.style.pointerEvents="";
      })

      const edit_btn_ref = document.querySelector(".btn-browse-edit");
      const delete_btn_ref = document.querySelector(".btn-browse-delete");

      // navigate to post task to edit
      edit_btn_ref.addEventListener("click",e=>{
        e.preventDefault();
        post_task_ref.classList.remove("display-hidden");
        browser_task_ref.classList.add("display-hidden");
      });

      // delete
      delete_btn_ref.addEventListener("click",eDel=>{
        eDel.preventDefault();
        Swal.fire({
          title: 'Do you want to delete the question?',
          showDenyButton: true,
          confirmButtonText: 'Yes',
          denyButtonText: `No`,
        }).then(async(result) => {
          // delete
          if(result.isConfirmed){
            Swal.fire({
              title:"Now Loading...",
              allowEscapeKey: false,
              allowOutsideClick: false,
            })
            Swal.showLoading();

            // delete storage image
            // loop each image
            
            docSnap.data().post_photo_name.forEach(image_name=>{
              // Create a reference to the file to delete
              const desertRef = ref(storage, `task/${e.target.id}/${image_name}`);
              // Delete the file
              deleteObject(desertRef).then(() => {
                  // File deleted successfully

              }).catch((error) => {
                  console.log(error);
              // Uh-oh, an error occurred!
              });
              })
              
              await deleteDoc(doc(collection(db,"task"),e.target.id));

              Swal.fire('Deleted!', '', 'success');
              task_details_ref.innerHTML="";
              task_details_ref.classList.add("display-hidden");
              listContainer.style.pointerEvents="";
          }
        })
      })

    }
    fetchData();  
    listContainer.style.pointerEvents="none";
    
  }
  else{
    task_details_ref.innerHTML="";
    task_details_ref.classList.add("display-hidden");
    listContainer.style.pointerEvents="";
  }
})


