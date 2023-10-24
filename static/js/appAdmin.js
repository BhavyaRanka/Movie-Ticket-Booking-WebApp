import router from "./routerAdmin.js";
// import store from "./astore.js";

const a = new Vue({
  el: "#app",
  delimiters: ["${", "}"],
  router: router,
  data: {
    message: "Hello World !!",
  },
  methods: {},
});