import { defineStore } from 'pinia' 
import { ref } from 'vue';

const GIT_USERS_URL_TEMPLATE = (username:string) => `https://api.github.com/users/${username}`;

export interface GitHubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  user_view_type: string;
  site_admin: boolean;
  name: string;
  company: string | null;
  blog: string;
  location: string;
  email: string | null;
  hireable: boolean;
  bio: string;
  twitter_username: string | null;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export const gitUserStore = defineStore("gitUsers", ()=>{

    const gitUser = ref<GitHubUser>({} as GitHubUser); 
    const loading = ref<boolean>(false); 
    const error = ref<string|null>(null); 

    const fetchUser = async (username:string): Promise<void> => {
        loading.value = true
        error.value = null
    
        try {
          const response = await fetch(GIT_USERS_URL_TEMPLATE(username))
          if (!response.ok) throw new Error('User not found')
            gitUser.value = await response.json();
        
        } catch (err) {
          if (err instanceof Error){
             error.value = err.message
          }else {
            error.value = "An unknown error has occurred!";
          }
        } finally {
          loading.value = false
        }
      };

    return { gitUser, loading, error, fetchUser }

});