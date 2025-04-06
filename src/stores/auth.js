import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      user: null,
      errors: {},
      avatars: []
    };
  },
  actions: {
    /******************* Get authenticated user *******************/
    async getUser() {
      if (localStorage.getItem("token")) {
        const res = await fetch("/api/user", {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          this.user = data;
        }
      }
    },
    /******************* Login or Register user *******************/
    async authenticate(apiRoute, formData) {
      const res = await fetch(`/api/${apiRoute}`, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.errors) {
        this.errors = data.errors;
      } else {
        this.errors = {};
        localStorage.setItem("token", data.token);
        this.user = data.user;
        this.router.push({ name: "home" });
      }
    },
    /******************* Logout user *******************/
    async logout() {
      const res = await fetch("/api/logout", {
        method: "post",
        headers: {
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        this.user = null;
        this.errors = {};
        localStorage.removeItem("token");
        this.router.push({ name: "home" });
      }
    },
    /******************* Avatar *******************/
    getProfileImageUrl(imagePath) {
      const imageBaseUrl = "http://127.0.0.1:8000/storage/";
      return `${imageBaseUrl}${imagePath}`;
    },
    /******************* Avatar *******************/
    async uploadAvatar(formData) {
      try {
        const res = await fetch("/api/user/avatar", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });
    
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.message || 'Avatar feltöltése sikertelen');
        }
    
        if (data.errors) {
          this.errors = data.errors;
          throw new Error('Hiba történt a feltöltés során');
        }
    
        if (data.avatar_path) {
          this.user.avatar = data.avatar_path;
        }

        return data;

      } catch (error) {
        console.error('Avatar upload error:', error);
        throw error;
      }
    },
  },
});