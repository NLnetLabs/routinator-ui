import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home.vue";
import PageNotFound from "./views/404.vue";


Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/:asn/:prefix",
      name: "search",
      component: Home
    },
    {
      path: '/announcement-preview',
      component: Home,
      props: route => ({ asn: route.query.asn, prefix: route.query.prefix })
    },
    // https://rpki-validator.ripe.net/announcement-preview?asn=12654&prefix=93.175.146.0%2F25
    { path: "*", component: PageNotFound }
  ]
});

export default router;
