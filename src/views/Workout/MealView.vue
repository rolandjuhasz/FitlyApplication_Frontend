<script setup>
import { ref, onMounted } from 'vue';
import { useMealStore } from '@/stores/meal';
import { useAuthStore } from '@/stores/auth';

const mealStore = useMealStore();
const authStore = useAuthStore();
const meals = ref([]);

onMounted(async () => {
  meals.value = await mealStore.getAllMeals();
});

const addMeal = (meal) => {
  const mealData = {
    meal_id: meal.id,
    amount: 100,
    user_id: authStore.user.id,
  };

  if (authStore.user.recommended_calories >= meal.kcal) {
    authStore.user.recommended_calories -= meal.kcal;
    mealStore.addMealToUser(mealData);
    authStore.user = { ...authStore.user };
  } else {
    alert("Nincs elég kalória a hozzáadásra!");
  }
};

</script>

<template>
<div class="bg-[#002128] rounded-lg p-6 mt-12 overflow-x-auto">
  <h2 class="text-2xl font-bold text-white mb-4">Összes étel</h2>
  
  <!-- Scrollable horizontal container -->
  <div class="flex gap-6 min-w-max">
    <div 
      v-for="meal in meals" 
      :key="meal.id" 
      class="bg-[#131213] rounded-2xl overflow-hidden shadow-xl flex flex-col w-80 shrink-0"
    >
      <div class="p-6 flex-1 flex flex-col">
        <h3 class="text-xl font-bold text-white mb-2">{{ meal.name }}</h3>
        <p class="text-gray-300 text-sm mb-4">{{ meal.kcal }} kcal</p>
        <p class="text-gray-300 text-sm mb-4">{{ meal.fat }}g zsír</p>
        <p class="text-gray-300 text-sm mb-4">{{ meal.carb }}g szénhidrát</p>
        <p class="text-gray-300 text-sm mb-4">{{ meal.protein }}g protein</p>
        <p class="text-gray-300 text-sm mb-4">{{ meal.salt }}g só</p>
        <p class="text-gray-300 text-sm mb-4">{{ meal.sugar }}g cukor</p>
        <div class="flex justify-between items-center">
          <button 
            @click="addMeal(meal)"
            class="bg-[#6ABC5C] hover:bg-[#4d8b48] text-white px-4 py-2 rounded-full font-medium"
          >
            Hozzáadás
          </button>
        </div>
      </div>
    </div>
  </div>
</div>

</template>
