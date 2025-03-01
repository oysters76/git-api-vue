import { createRouter, createWebHistory } from 'vue-router';
import BfCompiler from '../BfIntepreter.vue';
import GitUserSearch from '../GitUserSearch.vue';

// Define routes
const routes = [
  {
    path: '/', 
    name: 'Home',
    component: GitUserSearch, 
  },
  {
    path: '/bf',
    name: 'bfcompiler',
    component: BfCompiler,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes, 
});

export default router;