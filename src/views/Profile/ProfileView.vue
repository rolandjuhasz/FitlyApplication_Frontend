<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { usePostsStore } from "@/stores/post";
import { Motion } from "@motionone/vue";

const authStore = useAuthStore();
const postStore = usePostsStore();
const selectedTab = ref("profile");

onMounted(() => {
  postStore.getAllPosts();
});

import { computed } from "vue";

const formattedDate = computed(() => {
  if (!authStore.user?.created_at) return "";
  const date = new Date(authStore.user.created_at);
  return date.toISOString().split("T")[0].replace(/-/g, ".") + " " +
         date.toTimeString().slice(0, 5);
});

</script>

<template>
  <div class="wrapper h-screen flex items-center justify-center">
    <div class="profile-container container mx-auto p-6 max-w-3xl bg-[#F9F9F9] rounded-lg shadow-lg">

      <div class="tabs flex justify-center gap-4 mb-6">
        <Motion 
          :initial="{ opacity: 0, y: 50 }" 
          :animate="{ opacity: 1, y: 0 }" 
          :transition="{ delay: 0.3 }"
        >
          <button 
            @click="selectedTab = 'profile'" 
            :class="{ 'active-tab': selectedTab === 'profile' }"
            class="tab-btn"
          >
            Profil adatok
          </button>
        </Motion>

        <Motion 
          :initial="{ opacity: 0, y: 50 }" 
          :animate="{ opacity: 1, y: 0 }" 
          :transition="{ delay: 0.6 }"
        >
          <button 
            @click="selectedTab = 'calories'" 
            :class="{ 'active-tab': selectedTab === 'calories' }"
            class="tab-btn"
          >
            Kalória adatok
          </button>
        </Motion>

        <Motion 
          :initial="{ opacity: 0, y: 50 }" 
          :animate="{ opacity: 1, y: 0 }" 
          :transition="{ delay: 0.9 }"
        >
          <button 
            @click="selectedTab = 'bodyStats'" 
            :class="{ 'active-tab': selectedTab === 'bodyStats' }"
            class="tab-btn"
          >
            Test adatok
          </button>
        </Motion>
      </div>

      <Motion 
        :initial="{ opacity: 0, y: 50 }" 
        :animate="{ opacity: 1, y: 0 }" 
        :transition="{ delay: 1.2 }"
      >
        <div v-if="selectedTab === 'profile'" class="glassmorphism">
          <div class="profile-info mb-8 text-center">
            <h2 class="text-2xl text-[#131213]">Felhasználónév: <span class="font-bold">{{ authStore.user.name }}</span></h2>
            <h2 class="text-2xl text-[#131213]">Email cím: <span class="font-bold">{{ authStore.user.email }}</span></h2>
            <h2 class="text-2xl text-[#131213]">Posztok száma: <span class="font-bold">{{ postStore.userPostsCount }}</span></h2>
            <h2 class="text-2xl text-[#131213]">Regisztráció dátuma: <span class="font-bold">{{ formattedDate }}</span></h2>
          </div>
        </div>

        <div v-if="selectedTab === 'calories'" class="glassmorphism">
    <p class="text-center mt-4">Itt jelennek meg a napi kalóriaadataid...</p>

    <div class="mt-4">
      <h3 class="text-lg">Napi kalóriaszükséglet: {{  }} kcal</h3>
      <h3 class="text-lg">Felvitt kalóriák: {{  }} kcal</h3>
    </div>
  </div>

        <div v-if="selectedTab === 'bodyStats'" class="glassmorphism">
          <p class="text-center mt-4">Itt követheted a testsúly és testzsír százalék alakulását...</p>
        </div>
      </Motion>

    </div>
  </div>
</template>


<style scoped>
.glassmorphism {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  color: #131213;
}

.tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 20px;
}

.tab-content {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  background-color: #ddd;
  transition: background 0.3s;
}

.tab-btn:hover {
  background-color: #bbb;
}

.active-tab {
  background-color: #6ABC5C;
  color: white;
}

.wrapper {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-container {
  border-radius: 12px;
  padding: 24px;
  background: linear-gradient(#c6c2c641, #131213e7), 
  url("@/assets/images/animated.png") no-repeat center;
  background-size: cover;
  width: 700px; 
  min-height: 550px;
  display: flex;
  flex-direction: column;
}

.btn-edit:hover {
  background-color: #5aa34d;
}

.btn-logout:hover {
  background-color: #e03e2d;
}
</style>
