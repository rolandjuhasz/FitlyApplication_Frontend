<script setup>
import { ref, computed, onMounted } from "vue";
import { useRecipesStore } from "@/stores/recipes";
import MealView from "./MealView.vue";

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
  <main class="bg-[#131213] min-h-screen">
      <MealView />
    <div class="container mx-auto px-4 py-12 max-w-7xl">
      <header class="mb-12 text-center">
        <h1 class="text-4xl font-bold text-white mb-2">Recept Kincsei</h1>
        <p class="text-[#6ABC5C] font-medium">Fedezd fel a gasztronómiai csodákat</p>
      </header>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div 
          v-for="recipe in recipesStore.recipes" 
          :key="recipe.id" 
          class="bg-[#002128] rounded-2xl overflow-hidden shadow-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col"
        >
          <div class="relative h-48 overflow-hidden">
            <img 
              :src="recipe.image_urls.length ? recipe.image_urls[0] : 'https://via.placeholder.com/300'"
              alt="Recipe image" 
              class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
              <button 
                class="bg-[#6ABC5C] hover:bg-[#4d8b48] text-white px-4 py-2 rounded-full font-medium transition-colors"
                @click="openModal(recipe)"
              >
                Gyors betekintő
              </button>
            </div>
          </div>

          <div class="p-6 flex-1 flex flex-col">
            <h2 class="text-xl font-bold text-white mb-2">{{ recipe.title }}</h2>
            <p class="text-gray-300 text-sm mb-4 line-clamp-3">{{ recipe.description }}</p>
            
            <div class="mt-auto flex justify-between items-center">
              <span class="text-[#6ABC5C] text-sm font-medium">{{ recipe.avg_time }} perc</span>
              <button 
                class="text-white bg-[#4d8b48] hover:bg-[#6ABC5C] px-4 py-2 rounded-full text-sm font-medium transition-colors"
                @click="openModal(recipe)"
              >
                Részletek
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="selectedRecipe" class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div class="bg-[#002128] text-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button 
          @click="closeModal" 
          class="sticky top-4 right-4 ml-auto bg-[#6ABC5C] hover:bg-[#4d8b48] text-white rounded-full p-3 shadow-lg z-10 transition-colors flex items-center justify-center"
          style="width: 44px; height: 44px;"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div class="relative h-64 w-full overflow-hidden">
          <img 
            :src="selectedRecipe.image_urls.length ? selectedRecipe.image_urls[0] : 'https://via.placeholder.com/300'"
            alt="Recipe image" 
            class="w-full h-full object-cover"
          />
        </div>
        
        <div class="p-8">
          <h2 class="text-3xl font-bold mb-2">{{ selectedRecipe.name }}</h2>
          <p class="text-[#6ABC5C] font-medium mb-6">{{ selectedRecipe.avg_time }} perc</p>
          
          <div class="mb-6">
            <h3 class="text-xl font-semibold mb-2">Leírás</h3>
            <p class="text-gray-300">{{ selectedRecipe.description }}</p>
          </div>
          
          <div class="grid md:grid-cols-2 gap-8">
            <div>
              <h3 class="text-xl font-semibold mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#6ABC5C]" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                Hozzávalók
              </h3>
              <div class="bg-[#131213]/50 p-4 rounded-lg">
                <p class="whitespace-pre-line">{{ selectedRecipe.ingredients }}</p>
              </div>
            </div>
            
            <div>
              <h3 class="text-xl font-semibold mb-3 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-[#6ABC5C]" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                </svg>
                Elkészítés
              </h3>
              <div class="bg-[#131213]/50 p-4 rounded-lg">
                <p class="text-gray-300">A recept elkészítési leírása itt jelenne meg, ha lenne a modellben erre külön mező.</p>
              </div>
            </div>
          </div>
        </div>
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

.modal-content {
  scrollbar-width: thin;
  scrollbar-color: #4d8b48 #002128;
}

.modal-content::-webkit-scrollbar {
  width: 8px;
}

.modal-content::-webkit-scrollbar-track {
  background: #002128;
}

.modal-content::-webkit-scrollbar-thumb {
  background-color: #4d8b48;
  border-radius: 4px;
}
</style>