import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { useToast } from "vue-toastification";

export const usePostsStore = defineStore("postsStore", {
  state: () => {
    return {
      errors: {},
    };
  },
  actions: {
    /******************* Get all posts *******************/
    async getAllPosts() {
      const res = await fetch("/api/posts");
      const data = await res.json();

      return data;
    },
    /******************* Get a post *******************/
    async getPost(post) {
      const res = await fetch(`/api/posts/${post}`);
      const data = await res.json();

      return data.post ?? data;
    },
    /******************* Create a post *******************/
    async createPost(formData) {
      const res = await fetch("/api/posts", {
        method: "post",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.errors) {
        this.errors = data.errors;
      } else {
        this.router.push({ name: "home" });
        this.errors = {}
      }
    },
    /******************* Delete a post *******************/
    async deletePost(post) {
      const authStore = useAuthStore();
      const toast = useToast()
      if (authStore.user.id === post.user_id) {
        const res = await fetch(`/api/posts/${post.id}`, {
          method: "delete",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          toast.error("A poszt törölve!")
          this.router.push({ name: "home" });
        }
        console.log(data);
      }
    },
    /******************* Update a post *******************/
    async updatePost(post, formData) {
      const authStore = useAuthStore();
      const toast = useToast()
      if (authStore.user.id === post.user_id) {
        const res = await fetch(`/api/posts/${post.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (data.errors) {
          this.errors = data.errors;
        } else {
          toast.success("Sikeres módosítás!")
          this.router.push({ name: "posts" });
          this.errors = {}
        }
      }
    },
  },
});