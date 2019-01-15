import Vue from 'vue'
['number', 'array', 'string', 'date'].map(m => require(`@/lib/${m}.js`));
import App from './App.vue'

import htmlToPdf from '@/pdf.js'
Vue.use(htmlToPdf)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
