<script setup>
import { useAuthStore } from "@/stores/auth";
import { usePostsStore } from "@/stores/post";
import { onMounted, ref } from "vue";
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();
const { getPost, deletePost } = usePostsStore();
const authStore = useAuthStore();
const post = ref();

onMounted(async () => (post.value = await getPost(route.params.id)));
</script>

<template>
  <main>
    <div v-if="post">
      <div class="border-l-4 mt-12 border-red-800">
        <h2 class="font-bold text-3xl">{{ post.title }}</h2>
        <p class="text-xs text-slate-600 mb-4">
          Posted by 
          <span class="text-red-800 font-bold">{{post.user }}</span> 
          <br>

        </p>
        <p>
          {{ post.content }}
        </p>


        <div
          v-if="authStore.user && authStore.user.id === post.user_id"
          class="flex items-center gap-6 mt-6">
          <form @submit.prevent="deletePost(post)">
            <button
              class="text-red-500 font-bold px-2 py-1 border border-red-300"
            >
              Delete
            </button>
          </form>

            <RouterLink
              :to="{ name: 'update', params: { id: post.id } }"
              class="text-green-500 font-bold px-2 py-1 border border-green-300"
              >Update</RouterLink
            >
        </div>
      </div>
    </div>
    <div v-else>
      <h2 class="title">Page not found!</h2>
    </div>
  </main>
</template>