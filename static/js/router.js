import feed from "./components/feed.js";
import search from "./components/search.js";
// import myProfile from "./components/profile.js";
import userProfileShow from "./components/userProfileShow.js";
// import token from "./components/token.js";
// import Cart from "./components/acart.js";
// import Posts from "./components/post.js";

const routes = [
  {
    path: "/",
    component: feed,
  },
  {
    path: "/theater",
    component: userProfileShow,
    props: route => ({ name: route.query.name,
    place: route.query.place })
  }, 
  // {
  //   path: "/profile/",
  //   component: myProfile,
    
  // },
  {
    path: "/search",
    component: search,
  },
  
];

const router = new VueRouter({
  routes,
});

export default router;