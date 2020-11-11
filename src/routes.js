import Home from "./components/Home.svelte";
import Login from "./components/auth/Login.svelte";
import Register from "./components/auth/Register.svelte";

import Books from "./components/books/index.svelte";
import EditBook from "./components/books/edit.svelte";
import EditChapter from "./components/chapters/edit.svelte";


import NotFound from "./components/NotFound.svelte";
import Cookies from "./utils/Cookies";

const c = new Cookies();

const userLoggedIn = () => {
  let jwt;
  // console.log(c.getCookie("user-token"))
  if ((jwt = c.getCookie("user-jwt"))) {
    return true;
  } else return false;
};

export const routes = {
  // Exact path
  "/": userLoggedIn() ? Home : Login,
  "/login": Login,
  "/register": Register,
  "/books": userLoggedIn() ? Books : Login,
  "/books/:id": userLoggedIn() ? EditBook : Login,
  "/chapters/:id": userLoggedIn() ? EditChapter : Login,

  // Catch-all
  // This is optional, but if present it must be the last
  "*": NotFound,
};
