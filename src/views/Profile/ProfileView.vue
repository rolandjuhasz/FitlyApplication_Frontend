<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { usePostsStore } from "@/stores/post";
import { Motion } from "@motionone/vue";

const authStore = useAuthStore();
const postStore = usePostsStore();
const selectedTab = ref("profile");

onMounted(() => {
  postStore.getAllPosts();
});

const formattedDate = computed(() => {
  if (!authStore.user?.created_at) return "";
  const date = new Date(authStore.user.created_at);
  return date.toISOString().split("T")[0].replace(/-/g, ".") + " " + date.toTimeString().slice(0, 5);
});

const tabs = [
  { label: "Profil adatok", value: "profile" },
  { label: "Kalória adatok", value: "calories" },
  { label: "Test adatok", value: "bodyStats" }
];
</script>

<template>
  <div class="page-wrapper">
    <Motion :initial="{ opacity: 0, y: -50 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 1 }">
    <img src="@/assets/images/logo.png" alt="Logo" class="w-40 h-40 mb-5 rounded-full shadow-lg" />
  </Motion>

    <div class="container">

      <div class="sidebar">
        <div class="tabs">
          <Motion v-for="(tab, index) in tabs" :key="tab.value"
            :initial="{ opacity: 0, y: 50 }"
            :animate="{ opacity: 1, y: 0 }"
            :transition="{ delay: index * 0.3 }"
          >
            <button @click="selectedTab = tab.value"
              :class="{ 'active-tab': selectedTab === tab.value }"
              class="tab-btn"
            >
              {{ tab.label }}
            </button>
          </Motion>
        </div>
      </div>


      <div class="profile-container relative max-w-auto">
        <img 
      src="@/assets/images/animated.png" 
      alt="Animated Background" 
      class="absolute inset-0 w-full h-full object-cover opacity-10"
    />
        <Motion :initial="{ opacity: 0, y: 50 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: 1.2 }">
          
          <div v-if="selectedTab === 'profile'" class="glassmorphism">
            <h2>Felhasználónév: <span class="font-bold">{{ authStore.user.name }}</span></h2>
            <h2>Email cím: <span class="font-bold">{{ authStore.user.email }}</span></h2>
            <h2>Posztok száma: <span class="font-bold">{{ postStore.userPostsCount }}</span></h2>
            <h2>Regisztráció dátuma: <span class="font-bold">{{ formattedDate }}</span></h2>
          </div>
          <div v-if="selectedTab === 'calories'" class="glassmorphism">
            <p class="text-center">Itt jelennek meg a napi kalóriaadataid...</p>
          </div>
          <div v-if="selectedTab === 'bodyStats'" class="glassmorphism">
            <p class="text-center">Itt követheted a testsúly és testzsír százalék alakulását...</p>
          </div>
        </Motion>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.container {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 40px;
  max-width: 100%;
  width: 35%;
}

.sidebar {
  background: #002128;
  position: fixed;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
}

.tabs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tab-btn {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  background-color: #ddd;
  transition: background 0.3s;
  width: 100%;
  text-align: center;
}

.tab-btn:hover {
  background-color: #bbb;
}

.active-tab {
  background-color: #6ABC5C;
  color: white;
}

.profile-container {
  flex: 1;
  background: #002128;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%
}

.glassmorphism {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  color: #fff;
  text-align: center;
}
</style>
