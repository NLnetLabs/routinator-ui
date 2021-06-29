import Vue from "vue";
import Router from "vue-router";

import Home from "./views/Home.vue";
import PageNotFound from "./views/404.vue";
import Connections from "./views/Connections.vue";
import Metrics from "./views/Metrics.vue";
import Repositories from "./views/Repositories.vue";

Vue.use(Router);

const router = new Router({
  base: "/",
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    // This is to support 1:1 url rewriting from https://rpki-validator.ripe.net/announcement-preview?asn=12654&prefix=93.175.146.0%2F25
    {
      path: "/announcement-preview",
      component: Home,
      props: route => ({ asn: route.query.asn, prefix: route.query.prefix })
    },
    {
      path: "/connections",
      name: "connections",
      component: Connections
    },
    {
      path: "/metrics",
      name: "metrics",
      component: Metrics
    },

    {
      path: "/repositories",
      name: "repositories",
      component: Repositories
    },
    {
      path: "/:prefix/:asn",
      name: "search",
      component: Home
    },
    {
      path: "/:prefix",
      name: "searchBgp",
      component: Home,
      props: route => ({
        validate_bgp: route.query.validateBgp,
        include: route.query.include,
        exact_match_only: route.query.exactMatchOnly
      })
    },
    { path: "*", component: PageNotFound }
  ]
});

export default router;
