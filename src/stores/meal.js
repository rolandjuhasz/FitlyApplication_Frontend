import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { useToast } from "vue-toastification";

export const useMealStore = defineStore("mealStore", {
  state: () => ({
    meals: [],
    totalCalories: 0,
    errors: {},
  }),

  actions: {
    /*************** Get all meals (admin or debug use) ***************/
    async getAllMeals() {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/meals', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
    
      if (!res.ok) {
        console.error('Error fetching meals:', res.statusText);
        throw new Error('Failed to fetch meals');
      }
    
      const data = await res.json();
      this.meals = data;
      return data;
    },
    

    /*************** Add meal to user ***************/
    async addMealToUser(mealData) {
      const toast = useToast();
      const res = await fetch(`/api/meals/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(mealData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Étel sikeresen hozzáadva!", { timeout: 2000 });
        this.getUserTotalCalories(mealData.user_id); // Frissítjük a kalóriákat
      }

      if (data.errors) {
        this.errors = data.errors;
      } else {
        this.errors = {};
      }
    },

    async createMeal(mealData) {
      const toast = useToast();
      const authStore = useAuthStore();
    
      const res = await fetch('/api/meals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(mealData),
      });
    
      const data = await res.json();
    
      if (res.ok) {
        toast.success("Új étel sikeresen hozzáadva!", { timeout: 2000 });
        
        if (authStore.user.recommended_calories >= mealData.kcal) {
          authStore.user.recommended_calories -= mealData.kcal;
          authStore.user = { ...authStore.user };
        } else {
          toast.warning("Az étel hozzáadva, de nincs elég kalória a napi keretből!", { timeout: 2000 });
        }
        
        await this.getAllMeals();
        return data;
      } else {
        toast.error("Hiba történt az étel hozzáadásakor!", { timeout: 2000 });
        this.errors = data.errors ?? {};
        return null;
      }
    },

    /*************** Get total calories for user ***************/
    async getUserTotalCalories(userId) {
      const res = await fetch(`/api/users/${userId}/calories`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      this.totalCalories = data.totalCalories ?? 0;
      this.consumedCalories = data.totalCalories ?? 0;  // Frissítjük a napi elfogyasztott kalóriát
      return this.totalCalories;
    },

    /*************** Remove meal from user ***************/
    async removeMealFromUser(mealId, userId) {
      const toast = useToast();

      const res = await fetch(`/api/meals/user/${mealId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.ok) {
        toast.error("Étel törölve!", { timeout: 2000 });
        this.getUserTotalCalories(userId); // frissítjük a kalóriát
      }
    }
  }
});
