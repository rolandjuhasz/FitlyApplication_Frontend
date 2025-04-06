import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { useToast } from "vue-toastification";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useRecipesStore = defineStore("recipesStore", {
  state: () => ({
    recipes: [],
    errors: {},
  }),

  getters: {
    userRecipesCount: (state) => {
      const authStore = useAuthStore();
      return state.recipes.filter(recipe => recipe.user_id === authStore.user?.id).length;
    }
  },

  actions: {
    /******************* Get all recipes *******************/
    async getAllRecipes() {
      const res = await fetch(`api/recipes`);
      const data = await res.json();
      this.recipes = data;
      return data;
    },

    /******************* Get a single recipe *******************/
    async getRecipe(id) {
      const res = await fetch(`api/recipes/${id}`);
      const data = await res.json();
      return data.recipe ?? data;
    },

    /******************* Create a new recipe *******************/
    async createRecipe(formData) {
      const toast = useToast();
      const res = await fetch(`api/recipes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Recept sikeresen létrehozva!", { timeout: 2000 });
      }

      if (data.errors) {
        this.errors = data.errors;
      } else {
        this.router.push({ name: "addrecipe" });
        this.errors = {};
      }
    },

    /******************* Update a recipe *******************/
    async updateRecipe(recipe, formData) {
      const authStore = useAuthStore();
      const toast = useToast();

      if (authStore.user.id === recipe.user_id) {
        const res = await fetch(`/api/recipes/${recipe.id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        });

        const data = await res.json();
        if (data.errors) {
          this.errors = data.errors;
        } else {
          toast.success("Sikeres módosítás!", { timeout: 2000 });
          this.router.push({ name: "recipes" });
          this.errors = {};
        }
      }
    },
    
          
    /******************* Delete a recipe *******************/
    async deleteRecipe(recipe) {
      const authStore = useAuthStore();
      const toast = useToast();

      if (authStore.user.id === recipe.user_id) {
        const res = await fetch(`/api/recipes/${recipe.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.ok) {
          toast.error("A recept törölve!", { timeout: 2000 });
          this.router.push({ name: "home" });
        }
      }
    }
  }
});
