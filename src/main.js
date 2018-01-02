import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from  'vue-infinite-scroll'
import './util/pub.js'

import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/product.css'

// window.axios = axios;

Vue.use(infiniteScroll);
Vue.use(VueLazyload, {
  loading: 'static/loading-svg/loading-bars.svg',
  try: 3 // default 1
});

Vue.config.productionTip = false;
new Vue({
  el: '#app',
  // store,
  router,
  render: h => h(App),
});
