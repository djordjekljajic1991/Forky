import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import View from './views/View.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// if (model.hot) {
//   model.hot.accept();
// }

// import icons from '../img/icons.svg'; //parcel 1

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime/runtime';
import { version } from 'core-js';

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    // loading recipe
    await model.loadRecipe(id);
    //  const { recipe } = model.state;

    ///rendering recipe

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    ////1) get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2) Load search results
    await model.loadSearchResults(query);

    //3) Render results

    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //render initial pagination buttons

    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  //3) Render new results

  // resultsView.render(model.state.search.results);
  resultsView.render(model.getSearchResultsPage(goToPage));

  //render new pagination buttons

  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update the recipe servings (in the state)
  model.updateServings(newServings);

  //Update view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  //// 1 add/remove bookmark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  //2 update recipe view

  recipeView.update(model.state.recipe);

  // 3 render bookmarks

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    ///SPiner

    addRecipeView.renderSpinner();
    // console.log(newRecipe);

    ///Upload the new recipe data
    await model.uploadRecipe(newRecipe);

    //render

    recipeView.render(model.state.recipe);

    //Success message\\
    addRecipeView.renderMessage();

    //render bookmark view

    bookmarksView.render(model.state.bookmarks);

    ///Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    //close form window

    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('baaam', err);
    addRecipeView.renderError(err.message);
  }
};

///Publisher Subscriber pattern   ostatak u recipeView
const init = function () {
  bookmarksView.addHadlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandelerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
// window.addEventListener('hashchange', showRecipe);
// window.addEventListener('load', showRecipe);
/////////////////////////////////
