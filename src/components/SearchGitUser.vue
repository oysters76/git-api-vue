<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { gitUserStore } from '../store/gitUser'; // Adjust the path as needed
    import GitUserBadge from './GitUserBadge.vue';
    import { useI18n } from 'vue-i18n';

    const {t} = useI18n();

    const store = gitUserStore();
    const username = ref('');

    const searchUser = async () => {
        if (username.value) {
            await store.fetchUser(username.value);
        }
    };

    // Destructure the store's state for easier access
    // Use computed to make the store state reactive in the template
    const gitUser = computed(() => store.gitUser);
    const loading = computed(() => store.loading);
    const error = computed(() => store.error);
</script>

<template>
    <div>
      <h1>
        <span>{{ t('gitSearchTitle') }}</span>
      </h1>
      <div class="row">
        <input v-model="username" :placeholder="t('gitUserSearchTitle')" />
        <button @click="searchUser" :disabled="loading">{{ t('gitUserSearchBtnText') }}</button>
      </div>
  
      <div v-if="loading">{{ t('gitloadingText') }}</div>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="gitUser.login">
        <GitUserBadge :gitUser="gitUser"/>
      </div>
    </div>
  </template>

<style scoped>
  h1 > span{
    color: #FFD700; 
    background-image: linear-gradient(45deg, #FFD700 43%, #B8860B 2%); 
    background-clip: text; 
    -webkit-background-clip: text; 
    -webkit-text-fill-color: transparent;
  }
  .error {
    color: red;
  }
  .row{
    display:flex; 
    gap: 10px;
    justify-content: center;
  }
  .row > input{
    border-radius: 5px;
    padding: auto 25px 5px auto;
  }
</style>