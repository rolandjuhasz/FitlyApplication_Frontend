import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { useToast } from "vue-toastification";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const usePostsStore = defineStore("postsStore", {
  state: () => {
    return {
      errors: {},
      posts: []
    };
  },
  getters: {
    userPostsCount: (state) => {
      const authStore = useAuthStore();
      if (!state.posts || state.posts.length === 0) return 0; // Ha nincs adat, 0-t adunk vissza
      return state.posts.filter((post) => post.user_id === authStore.user?.id).length;
    },
  },
  actions: {
    /******************* Get all posts *******************/
    async getAllPosts() {
      const res = await fetch(`${API_BASE_URL}/posts`);
      const data = await res.json();
      this.posts = data;

      return data;
    },
    /******************* Get a post *******************/
    async getPost(post) {
      const res = await fetch(`${API_BASE_URL}/posts/${post}`);
      const data = await res.json();

      return data.post ?? data;
    },
    /******************* Create a post *******************/
    async createPost(formData) {
      const toast = useToast();
      const form = new FormData();
    
      form.append("title", formData.title);
      form.append("content", formData.content);
      if (formData.image) {
        form.append("image", formData.image); 
      }
    
      const res = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,

        },
        body: form, 
      });
    
      const data = await res.json();
      if (res.ok) {
        toast.success("A poszt sikeresen létrehozva!", { timeout: 2000 });
      }
    
      if (data.errors) {
        this.errors = data.errors;
      } else {
        this.router.push({ name: "posts" });
        this.errors = {};
      }
    },
    
    /******************* Delete a post *******************/
    async deletePost(post) {
      const authStore = useAuthStore();
      const toast = useToast()
      if (authStore.user.id === post.user_id) {
        const res = await fetch(`${API_BASE_URL}/posts/${post.id}`, {
          method: "delete",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          toast.error("A poszt törölve!", {timeout: 2000})
          this.router.push({ name: "posts" });
        }
        console.log(data);
      }
    },
    /******************* Update a post *******************/
    async updatePost(post, formData) {
      const authStore = useAuthStore();
      const toast = useToast();
      if (authStore.user.id === post.user_id) {
        const res = await fetch(`${API_BASE_URL}/posts/${post.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
    
        const data = await res.json();
        if (data.errors) {
          this.errors = data.errors;
        } else {
          toast.success("Sikeres módosítás!", { timeout: 2000 });
          this.router.push({ name: "posts" });
          this.errors = {};
        }
      }
    },
  },
});