<template>
  <v-app>
    <v-main>
      <Crud/>
    </v-main>
  </v-app>
</template>

<script>
import Crud from './components/Crud';

export default {
  name: 'App',

  components: {
    Crud,
  },

  data: () => ({
    //
  }),
};
</script>
