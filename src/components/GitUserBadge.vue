<script setup lang="ts">

import type { GitHubUser } from '../store/gitUser';
// Define the prop using defineProps
const props = defineProps<{
  gitUser: GitHubUser;
}>();

</script>

<template>
    <div class="badge">
    <img :src="props.gitUser.avatar_url" alt="User Avatar" />
    <h2>{{ props.gitUser.name }}</h2>
    <p class="bio">{{ props.gitUser.bio }}</p>
    <div class="stats">
      <p class="followers">Followers: {{ props.gitUser.followers }}</p>
      <p class="followings">Following: {{ props.gitUser.following }}</p>
    </div>
  </div>
</template>

<style scoped>
 .badge {
  display: grid;
  grid-template-columns: 120px 1fr; /* Avatar on the left, rest on the right */
  grid-template-rows: auto auto auto; /* Rows for name, bio, and stats */
  gap: 10px; /* Spacing between grid items */
  align-items: center; /* Center items vertically */
  padding: 15px;
  border: 1px solid #e1e4e8;
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 400px; /* Limit the badge width */
  margin: 20px auto; /* Center the badge */
}

.badge > img {
  width: 100%;
  height: auto;
  border-radius: 50%; /* Circular avatar */
  grid-row: 1 / -1; /* Span all rows */
  grid-column: 1; /* First column */
}

.badge > h2 {
  grid-row: 1;
  grid-column: 2;
  margin: 0;
  font-size: 1.5rem;
  color: #24292e;
}

.badge > .bio {
  grid-row: 2;
  grid-column: 2;
  margin: 0;
  font-size: 0.9rem;
  color: #586069;
}

.badge > .stats {
  grid-row: 3;
  grid-column: 2;
  display: flex;
  gap: 15px; /* Spacing between followers and following */
  font-size: 0.9rem;
  color: #586069;
}

.badge > .stats > .followers,
.badge > .stats > .followings {
  margin: 0;
}
</style>