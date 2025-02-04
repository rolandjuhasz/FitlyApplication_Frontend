<script setup>
import { usePostsStore } from "@/stores/post";
import { onMounted, ref } from "vue";
import { RouterLink } from "vue-router";

const { getAllPosts } = usePostsStore();
const posts = ref([]);

onMounted(async () => {
  posts.value = await getAllPosts();
});
</script>

<template>
    <main class="container mx-auto p-6">
      <h1 class="text-4xl font-bold text-center text-[#131213] mb-8">Latest Posts</h1>
  
      <div v-if="posts.length > 0" class="space-y-8">
        <div
          v-for="post in posts"
          :key="post.id"
          class="border-l-4 border-[#6ABC5C] pl-4 p-6 rounded-lg shadow-lg bg-[#FDFDFD] hover:shadow-xl transition-shadow duration-300">
          <h2 class="text-2xl font-bold text-[#131213] mb-2">
            {{ post.title }}
          </h2>
          <p class="text-sm text-[#C7C8C7] mb-4">
            Posted by  
            <span class="text-[#6ABC5C] font-bold">
              {{post.user }}
            </span>
          </p>
          <p class="text-[#131213] mb-4">
            {{ post.content }}
          </p>
          <!-- <RouterLink
            :to="{ name: 'show', params: { id: post.id } }"
            class="text-[#6ABC5C] font-bold underline hover:text-[#4A8F4A] transition-colors duration-300">
            Read more...
          </RouterLink> -->
        </div>
      </div>
      <div v-else class="text-center">
        <h2 class="text-2xl text-[#C7C8C7]">There are no posts</h2>
      </div>
    </main>
</template>