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
  <div class="min-h-screen bg-[#0D0D0D] text-white flex flex-col items-center justify-center p-10">
    <Motion :initial="{ opacity: 0, y: -50 }" :animate="{ opacity: 1, y: 35 }" :transition="{ duration: 1 }">
      <img src="@/assets/images/logo.jpg" alt="Logo" class="w-40 h-40 mb-10 rounded-full shadow-xl" />
    </Motion>

    <Motion :initial="{ opacity: 0, y: 50 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 0.5 }">
      <div class="bg-[#002128] relative p-16 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">

        <!-- Háttérkép -->

        
        <h2 class="text-5xl font-bold text-[#FDFDFD] mb-10 text-center">Regisztráció</h2>
        <form @submit.prevent="authenticate('register', formData)">
          <div class="mb-6">
            <label for="name" class="block text-[#ffffff] mb-3 text-xl">Teljes név</label>
            <input
              type="text"
              id="name"
              v-model="formData.name"
              placeholder="Teljes név"
              class="w-full px-6 py-4 bg-[#131213] text-[#ffffff] rounded-lg focus:outline-none focus:ring-3 focus:ring-[#1A3E4A] text-lg"
              required
            />
            <p
            class="text-red-500 text-sm mt-2"
            v-if="errors.name && errors.name[0]"
          >
            {{ errors.name[0] }}
          </p>
          </div>
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
            <p
            class="text-red-500 text-sm mt-2"
            v-if="errors.email && errors.email[0]"
          >
            {{ errors.email[0] }}
          </p>
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
            <p
            class="text-red-500 text-sm mt-2"
            v-if="errors.password && errors.password[0]"
          >
            {{ errors.password[0] }}
          </p>
          </div>
          <div class="mb-8">
            <label for="password" class="block text-[#ffffff] mb-2 text-lg">Jelszó megerősítése</label>
            <input
              type="password_confirmation"
              id="password_password_confirmation"
              v-model="formData.password_confirmation"
              placeholder="Jelszó megerősítése"
              class="w-full px-6 py-4 bg-[#131213] text-[#FDFDFD] rounded-lg focus:outline-none focus:ring-3 focus:ring-[#1A3E4A] text-lg"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full px-6 py-4 bg-[#6ABC5C] text-[#131213] font-semibold rounded-lg hover:bg-[#4d8b48] transition-all transform hover:scale-105 text-lg"
          >
            Bejelentkezés
          </button>
        </form>
        <p class="mt-6 text-center text-[#C7C8C7] text-lg">
          Van már fiókod?
          <router-link to="/login" class="text-[#6ABC5C] hover:underline">Jelentkezz be!</router-link>
        </p>
      </div>
    </Motion>
  </div>
</template>
