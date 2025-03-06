import { defineStore } from "pinia";

export const useProfileStore = defineStore("profileStore", {
  state: () => ({
    profile: null,
    errors: {},
  }),
  actions: {
    /******************* Get suer datas *******************/
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

    /******************* Profile update *******************/
    async updateProfile(updatedData) {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();

      if (res.ok) {
        this.profile = data;
      } else {
        this.errors = data.errors;
      }
    },
  },
});
