import { defineStore } from "pinia";

export const useProfileStore = defineStore("profileStore", {
  state: () => ({
    profile: null,
    errors: {},
  }),
  actions: {
    /******************* Lekéri a bejelentkezett felhasználó profilját *******************/
    async fetchProfile() {
      if (localStorage.getItem("token")) {
        const res = await fetch("/api/user", {
          headers: {
            authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();

        if (res.ok) {
          this.profile = data;
        }
      }
    },

    /******************* Profil frissítése *******************/
    async updateProfile(updatedData) {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();

      if (res.ok) {
        this.profile = data; // Frissítjük a store-ban a profilt
      } else {
        this.errors = data.errors;
      }
    },
  },
});
