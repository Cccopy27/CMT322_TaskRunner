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

const loc_text = document.getElementById("task-location");
const key = "56348ee0ae736660b862244f4a0535fc";
const locationURLfor = "http://api.positionstack.com/v1/forward";
const locationURLrev = "http://api.positionstack.com/v1/reverse";

const getData = async(locURL,locKey,locQue) => {
  const response = await fetch(locURL+locKey+locQue);
  const data = await response.json();
  return data.data[0];
}

// button get user self location
loc_btn_input.addEventListener("click", e => {
  e.preventDefault();
  // get user input location
  const locKey = `?access_key=${key}`;
  const locQue = `&query=${loc_text.value}`;
  const result = getData(locationURLfor,locKey,locQue);
  console.log(result);
})

// button get user input location
loc_btn_get.addEventListener("click", e =>{
  e.preventDefault();
  //check browser support geolocation or not
  if(navigator.geolocation){
    // get user location
    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true
    });
  }
  else{
    console.log("geolocation not found");
  }
});

// success get data through geo api
const success = (pos) => {
  const locKey = `?access_key=${key}`;
  const locQue = `&query=${pos.coords.latitude},${pos.coords.longitude} `;
  const result = getData(locationURLrev,locKey,locQue);
  console.log(result);
}

const error = (err) => {
  console.log(`somethig wrong: ${err}`);
}


