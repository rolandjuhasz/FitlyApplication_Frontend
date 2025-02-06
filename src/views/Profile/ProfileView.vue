<script setup>
import { onMounted, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import { usePostsStore } from "@/stores/post";

const authStore = useAuthStore();
const postStore = usePostsStore();
const selectedTab = ref("profile");

onMounted(() => {
  postStore.getAllPosts();
});
</script>

<template>
  <div class="wrapper h-screen flex items-center justify-center">
    <div class="profile-container container mx-auto p-6 max-w-3xl bg-[#F9F9F9] rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center text-[#131213] mb-6">User Profile</h1>

      <div class="tabs flex justify-center gap-4 mb-6">
        <button 
          @click="selectedTab = 'profile'" 
          :class="{ 'active-tab': selectedTab === 'profile' }"
          class="tab-btn"
        >
          Profil adatok
        </button>
        <button 
          @click="selectedTab = 'calories'" 
          :class="{ 'active-tab': selectedTab === 'calories' }"
          class="tab-btn"
        >
          Kalória adatok
        </button>
        <button 
          @click="selectedTab = 'bodyStats'" 
          :class="{ 'active-tab': selectedTab === 'bodyStats' }"
          class="tab-btn"
        >
          Test adatok
        </button>
      </div>

      <div v-if="selectedTab === 'profile'">
        <div class="profile-info mb-8 text-center">
          <div class="flex items-center justify-center mb-4">
            <div>
              <h2 class="text-2xl text-[#131213]">Felhasználónév: <span class="font-bold">{{ authStore.user.name }}</span></h2>
              <h2 class="text-2xl text-[#131213]">Email cím: <span class="font-bold">{{ authStore.user.email }}</span></h2>
            </div>
          </div>
          
          <div class="bio">
            <h3 class="text-xl font-semibold text-[#131213] mb-2">Posztok száma: {{ postStore.userPostsCount }}</h3>
          </div>
        </div>
      </div>

      <div v-if="selectedTab === 'calories'">
        <h2 class="text-2xl font-bold text-center">Kalória adatok</h2>
        <p class="text-center mt-4">Itt jelennek meg a napi kalóriaadataid...</p>
      </div>

      <div v-if="selectedTab === 'bodyStats'">
        <h2 class="text-2xl font-bold text-center">Test adatok</h2>
        <p class="text-center mt-4">Itt követheted a testsúly és testzsír százalék alakulását...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
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
  background-color: #f9f9f9;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.btn-edit:hover {
  background-color: #5aa34d;
}

.btn-logout:hover {
  background-color: #e03e2d;
}
</style>
