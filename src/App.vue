<script setup lang="ts">

</script>

<template>
   <div id="app">
    <nav>
      <router-link to="/">Search</router-link> |
      <router-link to="/bf">BF Compiler</router-link> 
     </nav>
    <router-view></router-view> <!-- This is where the routed components will appear -->
  </div>
</template>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
nav {
  padding: 10px;
}
nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
  margin: 0 10px;
}
nav a.router-link-exact-active {
  color: #42b983; /* Highlight the active link */
}
</style>