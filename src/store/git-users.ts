import { defineStore } from 'pinia' 
import { ref } from 'vue';

export const gitUsersStore = defineStore("gitUsers", ()=>{

    const gitUser = ref({}); 
    const loading = ref<boolean>(false); 
    const error = ref<string|null>(null); 

    const fetchUser = async (username:string): Promise<void> => {
        loading.value = true
        error.value = null
    
        try {
          const response = await fetch(`https://api.github.com/users/${username}`)
          if (!response.ok) throw new Error('User not found')
            gitUser.value = await response.json()
        
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