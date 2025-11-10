<template>
  <BApp>
    <NavBar v-if="$store.state.isAuthenticated" />
    <router-view />
  </BApp>
</template>

<script setup>
import { BApp } from 'bootstrap-vue-next'
import NavBar from './components/NavBar.vue'
</script>

<style>
@import './assets/styles/style.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

</style>
