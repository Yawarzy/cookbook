"use strict";

// DOM Elements
const greeting = document.querySelector("#header__greeting");
const meals = document.querySelector(".meals");
const recipeForm = document.getElementById("recipe__form");
const recipeName = document.getElementById("recipe__name");
const container = document.querySelector("main .container");
const header = document.querySelector(".header");
const recipeContainer = document.querySelector(".recipe");
const backHomeBtn = document.querySelector(".back__home");
const main = document.querySelector("main");
const favourites = document.querySelector(".favourites");
const searchRes = document.querySelector(".search__res");

// Variables and Constants
let userName = "Yawar";

// ============================================================================ //
// functions
// ============================================================================ //

// Generates the meal information
const mealInfoGen = function (meal) {
  let ingredients = "";
  let measurements = "";
  let i = 1;
  for (const [key, value] of Object.entries(meal)) {
    if (key.includes("strIngredient")) {
      if (meal[`strIngredient${i}`]) {
        ingredients += `${value}, `;
      }
      i++;
    }
  }

  i = 1;
  for (const [key, value] of Object.entries(meal)) {
    if (key.includes("strMeasure")) {
      if (meal[`strMeasure${i}`] === null || meal[`strMeasure${i}`] === "") {
      } else {
        measurements += `${value}, `;
      }
      i++;
    }
  }

  ingredients = ingredients.split(",").filter((ing) => ing.length > 1);

  measurements = measurements.split(",").filter((measure) => {
    return measure.length > 1;
  });

  let ingMea = [];
  ingredients.forEach((ing, index) => {
    ingMea.push(`${ing} (${measurements[index]})`);
  });

  const recipeInformation = `
    <div class="recipe__information">
      <div class="recipe__img">
        <img
        src="${meal.strMealThumb}"
        alt=""
        class="recipe__actual-image"
        />
      </div>
      <div class="recipe__info__text">
      <button class="back__home"><i class="fas fa-regular fa-caret-left"></i> Go Back</button>
        <h2 class="main__recipe__name">
        ${meal.strMeal}
        </h2>
        <p class="recipe__category"><span class="badge">Category </span>${
          meal.strCategory
        }</p>
        <p class="recipe__origin"><span class="badge">Origin </span>${
          meal.strArea
        }</p>
        <p class="recipe__tags"><span class="badge">Tags </span>${
          meal.strTags || ":( No Tags!"
        }</p>
        <p class="recipe__ingredients"><span class="badge">Ingredients </span> ${ingMea}</p>
        <p class="recipe__instructions"><span class="badge">Instructions</span> ${
          meal.strInstructions
        }</p>
      </div>
    </div>
  `;

  recipeContainer.innerHTML = recipeInformation;
};

// Generates the meal element into the DOM
const mealElGenMod = function (meal) {
  meal.forEach((ml) => {
    // meal tag
    const mealEl = document.createElement("div");
    mealEl.className = "meal";
    mealEl.setAttribute("data-id", `${ml.idMeal}`);
    // meal img tag
    const mealImgEl = document.createElement("div");
    mealImgEl.className = "meal__img";
    mealImgEl.setAttribute("data-id", `${ml.idMeal}`);

    // meal actions tag
    const mealActionsEl = document.createElement("div");
    mealActionsEl.className = "meal__actions flex";
    mealActionsEl.setAttribute("data-id", `${ml.idMeal}`);

    mealEl.appendChild(mealImgEl);
    mealEl.appendChild(mealActionsEl);

    // img tag
    const mealImage = document.createElement("img");
    mealImage.className = "meal__actual-image";
    mealImage.src = ml.strMealThumb;
    mealImage.setAttribute("data-id", `${ml.idMeal}`);

    mealImgEl.appendChild(mealImage);

    // meal name tag
    const mealNameEl = document.createElement("h4");
    mealNameEl.className = "meal__name";
    mealNameEl.textContent = ml.strMeal;
    mealNameEl.setAttribute("data-id", `${ml.idMeal}`);

    // favourite button tag
    const favouriteEl = document.createElement("button");
    favouriteEl.className = "favourite";

    mealActionsEl.appendChild(mealNameEl);
    mealActionsEl.appendChild(favouriteEl);

    // favourite icon tag
    const iconEl = document.createElement("i");
    iconEl.className = "fa-solid fa-heart";

    let mealNames;
    if (localStorage.getItem("mealNames") === null) {
      mealNames = [];
    } else {
      mealNames = JSON.parse(localStorage.getItem("mealNames"));
      if (mealNames.includes(`${ml.strMeal}`))
        iconEl.classList.add("favourited");
    }

    favouriteEl.appendChild(iconEl);

    meals.appendChild(mealEl);
  });
};

// Fetches a random meal from the API
const randomMeal = function () {
  const url = "https://www.themealdb.com/api/json/v1/1/random.php";
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const randomMeal = data.meals;
      mealElGenMod(randomMeal);
    })
    .catch((err) => console.log(err));
};

// Add meal to LS
const addMealToLS = function (meal) {
  let mealNames;
  if (localStorage.getItem("mealNames") === null) {
    mealNames = [];
  } else {
    mealNames = JSON.parse(localStorage.getItem("mealNames"));
  }

  mealNames.push(meal);
  localStorage.setItem("mealNames", JSON.stringify(mealNames));
};

// Remove from LS
const removeMealFromLS = function (meal) {
  let mealNames;
  if (localStorage.getItem("mealNames") === null) {
    mealNames = [];
  } else {
    mealNames = JSON.parse(localStorage.getItem("mealNames"));
  }

  mealNames = mealNames.filter((mealName) => mealName !== meal);

  localStorage.setItem("mealNames", JSON.stringify(mealNames));
  console.log(mealNames);
};

// Create and load fav recipe to the DOM
const loadFavsToDOM = function (favMeal) {
  const fav = document.createElement("div");
  fav.className = "fav";
  const img = document.createElement("img");
  img.setAttribute("data-id", `${favMeal.idMeal}`);
  img.className = "fav__img";

  img.src = `${favMeal.strMealThumb}`;
  fav.appendChild(img);
  favourites.appendChild(fav);
};

// Fetch the fav recipes from localstorage and api
const loadFavs = function () {
  let mealNames;
  if (localStorage.getItem("mealNames") === null) {
    mealNames = [];
  } else {
    mealNames = JSON.parse(localStorage.getItem("mealNames"));
  }

  favourites.innerHTML = ``;
  mealNames.forEach((name) => {
    const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${name}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const mealInfo = data.meals[0];
        loadFavsToDOM(mealInfo);
      })
      .catch((err) => console.log(err));
  });
};

// ============================================================================ //
//  FUNCTIONS FOR EVENTLISTENERS
// ============================================================================ //

// Fetch a random meal and get a user name
const domContentEvent = function () {
  //   userName = prompt("What's your name, friend ?");
  greeting.textContent = `Hi, ${userName}`;

  loadFavs();

  const url = "https://www.themealdb.com/api/json/v1/1/random.php";

  for (let i = 0; i <= 11; i++) {
    randomMeal();
  }
};

// Search meal and error
const searchMeal = function (e) {
  e.preventDefault();

  const queryMeal = recipeName.value;
  recipeName.value = "";

  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${queryMeal}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.meals === null) {
        container.innerHTML = `<img src="./img/error.png">`;
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const meal = data.meals;
        searchRes.innerHTML = ``;
        searchRes.textContent = "Search results";
        meals.innerHTML = ``;
        mealElGenMod(meal);
      }
    })
    .catch((err) => console.log(err));
};

// Back from meal to home
const backMeal = function (e) {
  if (e.target.classList.contains("back__home")) {
    meals.style.display = "flex";
    header.style.display = "block";

    recipeContainer.innerHTML = "";
  }
};

const lookupMeal = function (e) {
  let checkClasses = [
    "meal",
    "meal__img",
    "meal__actual-image",
    "meal__name",
    "meal__actions",
  ];

  if (checkClasses.includes(e.target.className)) {
    // open meal info
    const mealId = e.target.dataset;
    meals.style.display = "none";
    header.style.display = "none";

    const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId.id}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const mealInfo = data.meals[0];

        mealInfoGen(mealInfo);
      })
      .catch((err) => console.log(err));
  }
};

const favAddRemove = function (e) {
  // add to favs and localstorage
  let btnClasses = ["fa-solid fa-heart"];

  if (btnClasses.includes(e.target.className)) {
    e.target.classList.add("favourited");
    const name = e.target.parentNode.parentNode.firstChild.textContent;

    addMealToLS(name);
    loadFavs();
  } else if (e.target.classList.contains("favourited")) {
    //remove from local storage

    const name = e.target.parentNode.parentNode.firstChild.textContent;
    e.target.classList.remove("favourited");
    removeMealFromLS(name);
    loadFavs();
  }
};

const favInfo = function (e) {
  // fav info
  if (
    e.target.classList.contains("fav") ||
    e.target.classList.contains("fav__img")
  ) {
    console.log(e.target.dataset.id);
    fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${e.target.dataset.id}`
    )
      .then((res) => res.json())
      .then((data) => {
        const meal = data.meals[0];
        console.log(meal);
        // recipeContainer.innerHTML = ``;
        meals.style.display = "none";
        mealInfoGen(meal);
      })
      .catch((err) => console.log(err));
  }
};

// ============================================================================ //
// Eventlisteners
// ============================================================================ //

// Get user name and fetch a random meal
document.addEventListener("DOMContentLoaded", domContentEvent);

// search meal
recipeForm.addEventListener("submit", searchMeal);

container.addEventListener("click", (e) => {
  // lookup meal
  lookupMeal(e);

  // Add Remove Fav
  favAddRemove(e);

  // Fav info
  favInfo(e);
});

// Back button working
recipeContainer.addEventListener("click", backMeal);
