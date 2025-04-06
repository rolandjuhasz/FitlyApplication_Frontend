<script setup>
import { ref, computed, onMounted } from "vue";
import { useRecipesStore } from "@/stores/recipes";

const recipesStore = useRecipesStore();
const selectedRecipe = ref(null);

onMounted(() => {
  recipesStore.getAllRecipes();
});


const openModal = (recipe) => {
  selectedRecipe.value = recipe;
};

const closeModal = () => {
  selectedRecipe.value = null;
};
</script>

<template>
  <main class="container mx-auto p-6 max-w-6xl">
  <div class="min-h-screen bg-[#131213] text-[#FDFDFD] flex flex-col items-center justify-center p-6">
    <h1 class="text-3xl font-bold mb-6">Receptek</h1>
    
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="recipe in recipesStore.recipes" 
        :key="recipe.id" 
        class="bg-[#1E1E1E] text-white p-4 rounded-xl shadow-lg w-80 h-96 flex flex-col"
      >
        <img 
          :src="recipe.image_urls.length ? recipe.image_urls[0] : 'https://via.placeholder.com/300'"
          alt="Recipe image" 
          class="rounded-lg w-full h-40 object-cover"
        />

        <h2 class="text-xl font-semibold mt-4">{{ recipe.title }}</h2>
        <p class="text-sm text-gray-400 mt-2 line-clamp-3 overflow-hidden">{{ recipe.description }}</p>

        <button 
          class="mt-auto bg-[#FF6B6B] text-white px-4 py-2 rounded-lg"
          @click="openModal(recipe)"
        >
          Megnézem
        </button>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="selectedRecipe" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-6">
    <div class="bg-[#1E1E1E] text-white p-6 rounded-xl shadow-lg w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
      <button @click="closeModal" class="absolute top-4 right-4 text-xl">&times;</button>
      <img 
        :src="selectedRecipe.image_urls.length ? selectedRecipe.image_urls[0] : 'https://via.placeholder.com/300'"
        alt="Recipe image" 
        class="rounded-lg w-full h-64 object-cover"
      />
      <h2 class="text-2xl font-semibold mt-4">{{ selectedRecipe.name }}</h2>
      <p class="text-gray-400 mt-2">{{ selectedRecipe.description }}</p>
      <p class="mt-4"><strong>Elkészítési idő:</strong> {{ selectedRecipe.avg_time }}</p>
      <p class="mt-2"><strong>Hozzávalók:</strong></p>
      <p>{{ selectedRecipe.ingredients }}</p>
    </div>
  </div>
  </main>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
