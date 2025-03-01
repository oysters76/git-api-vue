<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  const { t, locale } = useI18n() 

  function changeLanguage(lang:string){
    locale.value = lang;
    localStorage.setItem("lang", lang);
  }

</script>

<template>
   <div style="display:flex;justify-content:flex-end;gap:15px;width:100%;">
    <button @click="changeLanguage('en')">English</button>
    <button @click="changeLanguage('fr')">Français</button>
    <button @click="changeLanguage('ja')">日本語</button>
   </div>
   <div id="app">
    <nav>
      <router-link to="/">{{ t("searchGitUserLinkText") }}</router-link> |
      <router-link to="/bf">{{ t("bfLinkText") }}</router-link> 
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