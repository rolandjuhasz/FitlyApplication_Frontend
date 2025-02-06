<script setup>
import { useAuthStore } from "@/stores/auth";
import { storeToRefs } from "pinia";
import { onMounted, reactive } from "vue";
import { Motion } from "@motionone/vue";

const { errors } = storeToRefs(useAuthStore());
const { authenticate } = useAuthStore();

const formData = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

onMounted(() => (errors.value = {}));
</script>

<template>
  <div class="min-h-screen bg-[#131213] text-[#FDFDFD] flex flex-col items-center justify-center p-6 overflow-hidden">

    <Motion :initial="{ opacity: 0, y: -50 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 1 }">
      <img src="@/assets/images/logo.png" alt="Logo" class="w-40 h-40 mb-5 rounded-full shadow-xl" />
    </Motion>

    <Motion :initial="{ opacity: 0, y: 50 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.6 }">
      <div class="relative bg-[#002128] p-16 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <img 
  src="@/assets/images/animated.png" 
  alt="Animated Background" 
  class="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
/>
      <h2 class="text-5xl font-bold text-[#FDFDFD] mb-5 text-center">Regisztráció</h2>

        
        <form @submit.prevent="authenticate('register', formData)">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div class="col-span-2">
              <label class="block text-[#ffffff] text-lg">Teljes név</label>
              <input v-model="formData.name" type="text" placeholder="Teljes név"
                class="w-full px-4 py-3 bg-[#131213] text-white rounded-lg focus:ring-3 focus:ring-[#1A3E4A] text-lg" required />
              <p class="text-red-500 text-sm mt-1" v-if="errors.name">{{ errors.name[0] }}</p>
            </div>

            <div>
              <label class="block text-[#ffffff] text-lg">Email</label>
              <input v-model="formData.email" type="email" placeholder="Email"
                class="w-full px-4 py-3 bg-[#131213] text-white rounded-lg focus:ring-3 focus:ring-[#1A3E4A] text-lg" required />
              <p class="text-red-500 text-sm mt-1" v-if="errors.email">{{ errors.email[0] }}</p>
            </div>

            <div>
              <label class="block text-[#ffffff] text-lg">Jelszó</label>
              <input v-model="formData.password" type="password" placeholder="Jelszó"
                class="w-full px-4 py-3 bg-[#131213] text-white rounded-lg focus:ring-3 focus:ring-[#1A3E4A] text-lg" required />
              <p class="text-red-500 text-sm mt-1" v-if="errors.password">{{ errors.password[0] }}</p>
            </div>

            <div class="col-span-2">
              <label class="block text-[#ffffff] text-lg">Jelszó megerősítése</label>
              <input v-model="formData.password_confirmation" type="password" placeholder="Jelszó megerősítése"
                class="w-full px-4 py-3 bg-[#131213] text-white rounded-lg focus:ring-3 focus:ring-[#1A3E4A] text-lg" required />
            </div>

          </div>

          <button type="submit"
            class="w-full mt-6 px-6 py-4 bg-[#6ABC5C] text-[#131213] font-semibold rounded-lg hover:bg-[#4d8b48] transition-all transform hover:scale-105 text-lg">
            Regisztráció
          </button>
        </form>

        <p class="mt-4 text-center text-[#C7C8C7] text-lg">
          Van már fiókod?
          <router-link to="/login" class="text-[#6ABC5C] hover:underline">Jelentkezz be!</router-link>
        </p>
      </div>
    </Motion>

  </div>
</template>
