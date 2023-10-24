import admindashboard from "./components/admindashboard.js";
// import search from "./components/search.js";
// import myProfile from "./components/profile.js";
import theaterProfile from "./components/theaterProfile.js";
// import token from "./components/tok  en.js";
// import Cart from "./components/acart.js";
// import Posts from "./components/post.js";

const routes = [
  {
    path: "/",
    component: admindashboard, 
  },
  {
    path: "/theater",
    component: theaterProfile,
    props: route => ({ name: route.query.name,
    place: route.query.place })
  }, 
  // {
  //   path: "/profile/",
  //   component: myProfile,
    
  // },
  // {
  //   path: "/search",
  //   component: search,
  // },
  
];

const router = new VueRouter({
  routes,
});

export default router;