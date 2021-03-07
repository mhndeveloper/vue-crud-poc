import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import Vuelidate from 'vuelidate';
import ApolloClient from 'apollo-boost'
import VueApollo from "vue-apollo";

Vue.config.productionTip = false
Vue.use(Vuelidate);
Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: new ApolloClient({
    uri: 'https://vue-crud-poc.herokuapp.com/v1/graphql'
  })
});

new Vue({
  vuetify,
  apolloProvider,
  render: h => h(App)
}).$mount('#app')
