<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { onMounted, reactive } from "vue";
import { Motion } from "@motionone/vue";

const { errors } = storeToRefs(useAuthStore());
const { authenticate } = useAuthStore();

const formData = reactive({
  email: "",
  password: "",
});

onMounted(() => (errors.value = {}));
</script>

<template>
  <div class="min-h-screen bg-[#131213] text-[#FDFDFD] flex flex-col items-center justify-center p-6 overflow-hidden">

  <Motion :initial="{ opacity: 0, y: -50 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 1 }">
    <img src="@/assets/images/logo.png" alt="Logo" class="w-40 h-40 mb-5 rounded-full shadow-lg" />
  </Motion>


  <Motion 
  :initial="{ opacity: 0, y: 50 }" 
  :animate="{ opacity: 1, y: 0 }" 
  :transition="{ delay: 0.5 }"
>
  <div 
    class="relative bg-[#002128] p-16 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
  >
    <img 
      src="@/assets/images/animated.png" 
      alt="Animated Background" 
      class="absolute inset-0 w-full h-full object-cover opacity-10"
    />

    <h2 class="text-5xl font-bold text-[#FDFDFD] mb-10 text-center relative z-10">Bejelentkezés</h2>
    <form @submit.prevent="authenticate('login', formData)" class="relative z-10">
      <div class="mb-6">
        <label for="email" class="block text-[#ffffff] mb-2 text-lg">Email cím</label>
        <input
          type="email"
          id="email"
           v-model="formData.email"
          placeholder="Email"
          class="w-full px-6 py-4 bg-[#131213] text-[#ffffff] rounded-lg focus:outline-none focus:ring-3 focus:ring-[#1A3E4A] text-lg"
          required
        />
        <p class="error" v-if="errors.email && errors.email[0]">{{ errors.email[0] }}</p>
      </div>
      <div class="mb-8">
        <label for="password" class="block text-[#ffffff] mb-2 text-lg">Jelszó</label>
        <input
          type="password"
          id="password"
          v-model="formData.password"
          placeholder="Jelszó"
          class="w-full px-6 py-4 bg-[#131213] text-[#FDFDFD] rounded-lg focus:outline-none focus:ring-3 focus:ring-[#1A3E4A] text-lg"
          required
        />
        <p class="error" v-if="errors.password && errors.password[0]">{{ errors.password[0] }}</p>
      </div>
      <button
        type="submit"
        class="w-full px-6 py-4 bg-[#6ABC5C] text-[#131213] font-semibold rounded-lg hover:bg-[#4d8b48] transition-all transform hover:scale-105 text-lg"
      >
        Bejelentkezés
      </button>
    </form>
    <p class="mt-6 text-center text-[#C7C8C7] text-lg relative z-10">
      Nincs még fiókod?
      <router-link to="/register" class="text-[#6ABC5C] hover:underline">Regisztrálj itt!</router-link>
    </p>
  </div>
</Motion>

  </div>
</template>