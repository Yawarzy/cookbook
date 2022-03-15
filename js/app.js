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

// Variables and Constants
let userName = "Yawar";

// functions
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
    iconEl.className = "fa-regular fa-heart";
    favouriteEl.appendChild(iconEl);

    meals.appendChild(mealEl);
  });
};

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

// Eventlisteners

// Get user name and fetch a random meal
document.addEventListener("DOMContentLoaded", () => {
  //   userName = prompt("What's your name, friend ?");
  greeting.textContent = `Hi, ${userName}`;

  const url = "https://www.themealdb.com/api/json/v1/1/random.php";

  for (let i = 0; i <= 10; i++) {
    randomMeal();
  }
});

// search meal
recipeForm.addEventListener("submit", (e) => {
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
        meals.innerHTML = "<h4 class='search'>Search Results</h4>";
        mealElGenMod(meal);
        // console.log(meal);
      }
    })
    .catch((err) => console.log(err));
});

container.addEventListener("click", (e) => {
  let checkClasses = [
    "meal",
    "meal__img",
    "meal__actual-image",
    "meal__name",
    "meal__actions",
  ];

  if (checkClasses.includes(e.target.className)) {
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
});

recipeContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("back__home")) {
    meals.style.display = "block";
    header.style.display = "block";

    recipeContainer.innerHTML = "";
  }
});
