const searchBox = document.getElementById("search-box"),
  submit = document.getElementById("submit"),
  random = document.getElementById("random"),
  mealsEl = document.getElementById("meals"),
  resultHeading = document.getElementById("result-heading"),
  singleMealEl = document.getElementById("single-meal");

async function searchMeal(e) {
  e.preventDefault();

  singleMealEl.innerHTML = "";

  const term = searchBox.value;

  if (term.trim()) {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
      );
      const data = await res.json();

      resultHeading.innerHTML = `<h2>Search Result for '${term}'</h2>`;

      if (data.meals === null) {
        resultHeading.innerHTML = `<h2>There is no result for '${term}'</h2> Try Again`;
      } else {
        mealsEl.innerHTML = data.meals
          .map(
            (meal) => `
            <div class="meal">
                <img src="${meal.strMealThumb}" alt="strMeal"/>
                <div class="meal-info" data-mealId="${meal.idMeal}">
                    <h3>${meal.strMeal}</h3>
                </div>
            </div>
            `
          )
          .join("");
      }
      searchBox.value = "";
    } catch (e) {
      console.log(e);
    }
  } else {
    alert("Please Enter something to search");
  }
}

// Fetch meal by id
async function getMealById(mealId) {
  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
    );
    const data = await res.json();
    const meal = data.meals[0];
    addMealToDOM(meal);
  } catch (e) {
    console.log(e);
  }
}
//Adding Meal to DOM
function addMealToDOM(meal) {
  const ingredients = [];
  for (let i = 1; i < 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients.push(
        `${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
      );
    } else {
      break;
    }
  }

  singleMealEl.innerHTML = `
    <div class="single-meal">
    <h1>${meal.strMeal}</h1>
    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
    <div class="single-meal-info">
    ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}
    ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}
    </div>
    <div class="main">
        <p>${meal.strInstructions}</p>
        <h2>Ingredients</h2>
        <ul>
            ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
        </ul>
    </div>
    </div>
    `;
}
//Random Meal Funcion
async function getRandomMeal() {
  mealsEl.innerHTML = "";
  resultHeading.innerHTML = "";
  try {
    const res = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );
    const data = await res.json();
    const meal = data.meals[0];
    addMealToDOM(meal);
  } catch (e) {
    console.log(e);
  }
}
//Event Listener
submit.addEventListener("submit", searchMeal);
mealsEl.addEventListener("click", (e) => {
  const mealInfo = e.path.find((item) => {
    if (item.classList) {
      return item.classList.contains("meal-info");
    } else {
      return false;
    }
  });
  if (mealInfo) {
    const mealId = mealInfo.getAttribute("data-mealid");
    getMealById(mealId);
  }
});
random.addEventListener("click", getRandomMeal);
