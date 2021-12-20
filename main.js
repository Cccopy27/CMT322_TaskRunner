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

// get user location using geolocation
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
  const { label } = await getData(locationURLfor, locKey, locQue);
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

image_input.addEventListener("change", e=>{
  const file = image_input.files;
  console.log(file.length);
  for(let i = 0; i < file.length; i++){
    const image = document.createElement("img");
    image.setAttribute("src",`${URL.createObjectURL(file[i])}`);
    image_preview.appendChild(image);

  }
  
  // if(file){
  //   image_preview.src = URL.createObjectURL(file);
  // }
})

