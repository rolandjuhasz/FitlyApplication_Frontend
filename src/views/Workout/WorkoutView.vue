<script setup>
import { computed, onMounted } from "vue";
import { useRecipesStore } from "@/stores/recipes";

const recipesStore = useRecipesStore();

onMounted(() => {
  recipesStore.getAllRecipes();
});

const getProfileImageUrl = recipesStore.getProfileImageUrl;

const profileImage = computed(() => {
  if (!authStore.user || !authStore.user.profile_image) {
    return "/src/assets/images/default-user.jpg";
  }
  return `${import.meta.env.VITE_API_URL}/storage/${recipesStore.image_path}`;
});
</script>

<template>
  <div class="min-h-screen bg-[#131213] text-[#FDFDFD] flex flex-col items-center justify-center p-6">
    <h1 class="text-3xl font-bold mb-6">Receptek</h1>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="recipe in recipesStore.recipes" 
        :key="recipe.id" 
        class="bg-[#1E1E1E] text-white p-4 rounded-xl shadow-lg w-80"
      >
        <img 
          :src="recipe.image_urls.length ? recipe.image_urls[0] : 'https://via.placeholder.com/300'"
          alt="Recipe image" 
          class="rounded-lg w-full h-48 object-cover"
        />

        <h2 class="text-xl font-semibold mt-4">{{ recipe.name }}</h2>
        <p class="text-sm text-gray-400 mt-2">{{ recipe.description }}</p>

        <button class="mt-4 bg-[#FF6B6B] text-white px-4 py-2 rounded-lg">
          Megnézem
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>