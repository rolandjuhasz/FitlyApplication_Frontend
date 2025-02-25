import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

export const useCommentsStore = defineStore("commentsStore", {
  state: () => ({
    comments: [],
    errors: {},
  }),
  actions: {
    /******************* Get comments for a post *******************/
    async getComments(postId) {
        try {
          const res = await fetch(`/api/posts/${postId}/comments`);
          if (!res.ok) {
            throw new Error(`Error fetching comments for post ${postId}`);
          }
          const data = await res.json();
          this.comments = data.comments;
        } catch (error) {
          console.error("Failed to fetch comments:", error);
        }
      },
      
      

    /******************* Create a comment *******************/
    async createComment(postId, content) {
      const toast = useToast();
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ content }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Komment sikeresen hozzáadva!", { timeout: 2000 });
        this.comments.push(data.comment);
      } else {
        this.errors = data.errors || {};
      }
    },
  },
});
