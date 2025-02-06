<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore()
const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>


<template>
<nav class="fixed top-0 left-0 w-full bg-[#131213] z-50 shadow-lg">
  <div class="container mx-auto flex justify-between items-center p-4">
    <div class="flex items-center space-x-4">
      <img src="@/assets/images/logo.png" alt="Logo" class="h-12 w-12 rounded-full" />
      <h1 class="text-2xl font-bold text-[#6ABC5C]">Fitly</h1>
    </div>
    
    <ul class="hidden md:flex space-x-6 text-lg">
      <li><RouterLink :to="{ name: 'home' }" class="nav-link" active-class="active">Kezdőlap</RouterLink></li>
      <li><RouterLink :to="{ name: 'workout' }" class="nav-link" active-class="active">Változtass!</RouterLink></li>
      <li><RouterLink :to="{ name: 'posts' }" class="nav-link" active-class="active">Közösség</RouterLink></li>
      <li v-if="authStore.user"><RouterLink :to="{ name: 'profile' }" class="nav-link" active-class="active">Profil</RouterLink></li>
    </ul>
    <form @submit.prevent="authStore.logout" v-if="authStore.user">
      <button class="auth-btn">Kijelentkezés</button>
    </form>
    
    <div class="hidden md:flex space-x-4" v-if="!authStore.user">
      <RouterLink :to="{name: 'register'}" class="auth-btn">Regisztráció</RouterLink>
      <RouterLink :to="{name: 'login'}" class="auth-btn bg-transparent border-2 border-[#6ABC5C] text-[#6ABC5C] hover:bg-[#6ABC5C] hover:text-[#131213]">Bejelentkezés</RouterLink>
    </div>
    

    <button @click="toggleMenu" class="md:hidden text-3xl text-white">
      ☰
    </button>
  </div>

  <div v-if="isMenuOpen" class="md:hidden bg-[#131213] p-4">
    <ul class="flex flex-col space-y-4 text-lg text-center">
      <li><RouterLink :to="{ name: 'home' }" class="nav-link" active-class="active">Kezdőlap</RouterLink></li>
      <li><RouterLink :to="{ name: 'workout' }" class="nav-link" active-class="active">Workouts</RouterLink></li>
      <li><RouterLink :to="{ name: 'posts' }" class="nav-link" active-class="active">Social media</RouterLink></li>
      <li><RouterLink :to="{name: 'register'}" class="auth-btn block">Regisztráció</RouterLink></li>
      <li><RouterLink :to="{name: 'login'}" class="auth-btn block bg-transparent border-2 border-[#6ABC5C] text-[#6ABC5C] hover:bg-[#6ABC5C] hover:text-[#131213]">Bejelentkezés</RouterLink></li>
    </ul>
  </div>
</nav>

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