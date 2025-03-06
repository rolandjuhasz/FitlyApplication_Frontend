import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import { useToast } from "vue-toastification";

export const useReactionStore = defineStore("reactionStore", {
  state: () => ({
    reactions: {},
  }),
  actions: {
    async toggleReaction(post, reactionType) {
      const authStore = useAuthStore();
      const toast = useToast();

      if (!authStore.user) {
        toast.error("Be kell jelentkezned a reakciókhoz!", { timeout: 2000 });
        return;
      }

      const currentReaction = this.reactions[post.id] || null;
      const newReaction = currentReaction === reactionType ? null : reactionType;

      try {
        const res = await fetch(`/api/posts/${post.id}/reactions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            user_id: authStore.user.id,
            reaction: newReaction,
          }),
        });

        if (!res.ok) {
          throw new Error("Nem sikerült menteni a reakciót.");
        }

        const data = await res.json();
        this.reactions[post.id] = data.reaction;

        toast.success(
          newReaction ? `Reakció mentve: ${newReaction}` : "Reakció törölve!",
          { timeout: 2000 }
        );
      } catch (error) {
        console.error(error);
        toast.error("Hiba történt a reakció mentése közben!", { timeout: 2000 });
      }
    },
  },
});
