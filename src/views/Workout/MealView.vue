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

const newMeal = ref({
  name: '',
  kcal: 0,
  fat: 0,
  carb: 0,
  protein: 0,
  salt: 0,
  sugar: 0,
});

const submitNewMeal = async () => {
  await mealStore.createMeal(newMeal.value);
  // Siker után ürítsük az űrlapot, üres értékekkel
  newMeal.value = {
    name: '',
    kcal: '',
    fat: '',
    carb: '',
    protein: '',
    salt: '',
    sugar: '',
  };
  // A lista frissítése már a store-ban történik
};



</script>

<template>
  <div class="bg-[#002128] rounded-2xl p-8 mt-12 mb-8 shadow-lg max-w-2xl mx-auto">
  <h2 class="text-3xl font-semibold text-white mb-6 text-center">Új étel hozzáadása</h2>
  <form @submit.prevent="submitNewMeal" class="grid grid-cols-1 md:grid-cols-2 gap-4 text-white" v-if="authStore.user">
  <input v-model="newMeal.name" type="text" placeholder="Étel neve" class="input-field" required />
  <input v-model="newMeal.kcal" type="text" placeholder="Kalória (kcal)" class="input-field" required />
  <input v-model="newMeal.fat" type="text" placeholder="Zsír (g)" class="input-field" />
  <input v-model="newMeal.carb" type="text" placeholder="Szénhidrát (g)" class="input-field" />
  <input v-model="newMeal.protein" type="text" placeholder="Fehérje (g)" class="input-field" />
  <input v-model="newMeal.salt" type="text" placeholder="Só (g)" class="input-field" />
  <input v-model="newMeal.sugar" type="text" placeholder="Cukor (g)" class="input-field" />
  <div class="md:col-span-2 flex justify-center">
    <button type="submit" class="bg-[#6ABC5C] hover:bg-[#4d8b48] transition-all duration-200 text-white px-6 py-3 rounded-full font-semibold">
      Mentés
    </button>
  </div>
</form>
<RouterLink 
  v-else 
  :to="{name: 'login'}" 
  class="auth-btn bg-transparent border-2 border-[#6ABC5C] text-[#6ABC5C] hover:bg-[#6ABC5C] hover:text-[#131213] block mx-auto text-center py-3 px-6 rounded-full"
>
  Bejelentkezés
</RouterLink>


</div>

<div class="bg-[#002128] rounded-lg p-6 mt-12 overflow-x-auto">
  <h2 class="text-2xl font-bold text-white mb-4">Összes étel</h2>

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
            v-if="authStore.user"
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

<style scoped>
    .nav-link {
      position: relative;
      color: #fdfdfd;
      transition: color 0.3s;
    }
    
    .nav-link:hover {
      color: #6ABC5C;
    }
    
    .nav-link::after {
      content: "";
      position: absolute;
      left: 50%;
      bottom: -2px;
      width: 0;
      height: 2px;
      background-color: #6ABC5C;
      transition: width 0.3s ease, left 0.3s ease;
    }
    
    .nav-link:hover::after {
      width: 100%;
      left: 0;
    }
    
    .auth-btn {
      background-color: #6ABC5C;
      color: #131213;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: bold;
      transition: background 0.3s, transform 0.2s;
    }
    
    .auth-btn:hover {
      background-color: #5aa34d;
      transform: scale(1.05);
    }

    .nav-link {
  position: relative;
  color: #fdfdfd;
  transition: color 0.3s;
}

.nav-link:hover,
.nav-link.active { /* Aktív elem kiemelése */
  color: #6ABC5C;
}

.nav-link::after {
  content: "";
  position: absolute;
  left: 50%;
  bottom: -2px;
  width: 0;
  height: 2px;
  background-color: #6ABC5C;
  transition: width 0.3s ease, left 0.3s ease;
}

.nav-link:hover::after,
.nav-link.active::after { /* Az aktív elem aláhúzása */
  width: 100%;
  left: 0;
}

    </style>