<template>
  <div>
    <MainMenu v-if="!$route.meta.hideNavbar"/>
    <div>
      <router-view />
    </div>
    <!-- https://datacom-be.onrender.com -->
  </div>
</template>

<script>
import MainMenu from "./components/MainMenu.vue";

export default {
  name: "App",
  components: {
    MainMenu,
  },
};
</script>

<style>
</style>
