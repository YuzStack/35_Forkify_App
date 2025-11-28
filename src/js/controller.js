import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

// From parcel...
// if (module.hot) {
//   module.hot.accept();
// }

const controllRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    // 0. Update results view to mark selected search result
    resultsView.update(model.getSearchResultsPage());

    // 1. Update bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // 2. Load the recipe
    recipeView.renderSpinner();
    await model.loadRecipe(id);

    // 3. Render the recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    console.error(err);
    recipeView.renderError('Something went wrong! Please try again :)');
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1. Get search query
    const query = searchView.getQuery();
    if (!query) return;

    // 2. Load search results
    await model.loadSearchResults(query);

    // 3. Render results
    resultsView.render(model.getSearchResultsPage());

    // 4. Render initial pagination button(s)
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError('Something went wrong! Please try again :)');
  }
};

const controlPagination = function (pageNum) {
  // 1. Render new page of results
  resultsView.render(model.getSearchResultsPage(pageNum));

  // 2. Render current pagination button(s)
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // Update the recipe servings (in state)
  model.updateServings(newServings);

  // Update the recipe view
  recipeView.update(model.state.recipe);
};

const controlAAddBookmark = function () {
  // 1. Add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  // 2. Update recipe view
  recipeView.update(model.state.recipe);

  // 3. Render bookmarks
  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    // Render loading spinner
    addRecipeView.renderSpinner();

    // Upload the new Recie data
    await model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(model.state.recipe);

    // Display success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    // Close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, 1000 * MODAL_CLOSE_SEC);
  } catch (err) {
    console.error('❌❌', err);
    addRecipeView.renderError(err.message);
  }
};

// Publisher-Subscriber Pattern ‼️ (The standard & recommended way to add event listeners in an MVC Design pattern)
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controllRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
