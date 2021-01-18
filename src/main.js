import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./plugins/element.js";
import i18n from "./i18n";

import(/* webpackPreload: true */ "typeface-lato/index.css");
import(/* webpackPreload: true */ "typeface-source-code-pro/index.css");

// import VueMatomo from "vue-matomo";
// Vue.use(VueMatomo, {
//   host: "//webstats.aws.nlnetlabs.nl/",
//   siteId: 4,
//   router: router,
//   enableHeartBeatTimer: true,
//   preInitActions: []
// });

Vue.config.productionTip = false;

new Vue({
  router,
  i18n,
  render: h => h(App)
}).$mount("#app");
