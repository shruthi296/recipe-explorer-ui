import React, { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [active, setActive] = useState("chicken"); // default ingredient
  const [selectedMeal, setSelectedMeal] = useState(null);

  const searchRecipes = async (ingredient) => {
    setActive(ingredient);
    setLoading(true);
    setError("");
    setRecipes([]);
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
          ingredient
        )}`
      );
      const data = await res.json();
      if (data.meals && Array.isArray(data.meals)) {
        setRecipes(data.meals);
      } else {
        setRecipes([]);
        setError("No recipes found.");
      }
    } catch (e) {
      setError("Could not load recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // fetch full details for a single meal
  const fetchMealDetails = async (idMeal) => {
    try {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${idMeal}`
      );
      const data = await res.json();
      if (data.meals && data.meals.length > 0) {
        setSelectedMeal(data.meals[0]);
      }
    } catch (e) {
      console.error("Error loading meal details", e);
    }
  };

  useEffect(() => {
    searchRecipes("chicken");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ingredients = [
    "chicken",
    "beef",
    "onion",
    "fish",
    "egg",
    "potato",
    "cheese",
    "mushroom",
    "rice",
  ];

  return (
    <div className="app">
      <h1>🍽️ Recipe Explorer</h1>

      {/* Ingredient buttons */}
      <div className="choice-bar">
        {ingredients.map((ing) => (
          <button
            key={ing}
            className={`choice ${active === ing ? "active" : ""}`}
            onClick={() => searchRecipes(ing)}
          >
            {ing[0].toUpperCase() + ing.slice(1)}
          </button>
        ))}
      </div>

      {loading && <p className="info">Loading recipes…</p>}
      {error && <p className="error">{error}</p>}

      {/* Cards */}
      <div className="grid">
        {recipes.map((meal) => (
          <div
            key={meal.idMeal}
            className="card"
            onClick={() => fetchMealDetails(meal.idMeal)}
          >
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <h2>{meal.strMeal}</h2>
          </div>
        ))}
      </div>

      {!loading && !error && recipes.length === 0 && (
        <p className="info">Pick an ingredient above to see recipes.</p>
      )}

      {/* Modal with ingredients & description */}
      {selectedMeal && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={() => setSelectedMeal(null)}>
              ✖
            </button>
            <h2>{selectedMeal.strMeal}</h2>
            <img
              src={selectedMeal.strMealThumb}
              alt={selectedMeal.strMeal}
              className="modal-img"
            />

            <h3>Ingredients</h3>
            <ul>
              {Array.from({ length: 20 }).map((_, i) => {
                const ing = selectedMeal[`strIngredient${i + 1}`];
                const measure = selectedMeal[`strMeasure${i + 1}`];
                return (
                  ing &&
                  ing.trim() !== "" && (
                    <li key={i}>
                      {ing} – {measure}
                    </li>
                  )
                );
              })}
            </ul>

            <h3>Instructions</h3>
            <p>{selectedMeal.strInstructions}</p>
          </div>
        </div>
      )}
    </div>
  );
}
