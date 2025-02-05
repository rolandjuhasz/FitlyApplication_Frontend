<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();


</script>

<template>
    <div class="profile-container container mx-auto p-6 max-w-3xl bg-[#F9F9F9] rounded-lg shadow-lg">
      <h1 class="text-3xl font-bold text-center text-[#131213] mb-6">User Profile</h1>
      
      <div class="profile-info mb-8">
        <div class="flex items-center mb-4">
          <div>
            <h2 class="text-2xl font-bold text-[#131213]">{{ authStore.user.name }}</h2>
            <p class="text-lg text-[#6ABC5C]">{{ authStore.user.email }}</p>
          </div>
        </div>
        
        <div class="bio">
          <h3 class="text-xl font-semibold text-[#131213] mb-2">Bio</h3>
          <p class="text-[#333333]">{{ authStore.user.password }}</p>
        </div>
      </div>
  
      <div class="flex justify-center gap-4">
        <button class="btn-edit text-white bg-[#6ABC5C] px-6 py-2 rounded-lg hover:bg-[#5aa34d] transition duration-300">
          Edit Profile
        </button>
        <button class="btn-logout text-white bg-red-500 px-6 py-2 rounded-lg hover:bg-red-400 transition duration-300">
          Logout
        </button>
      </div>
    </div>
  </template>
  
  
  <style scoped>
  .profile-container {
    background-color: #f9f9f9;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .profile-info {
    margin-bottom: 24px;
  }
  
  .profile-info img {
    border-radius: 50%;
  }
  
  .bio {
    margin-top: 16px;
  }
  
  .btn-edit, .btn-logout {
    font-weight: bold;
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
  }
  
  .btn-edit:hover {
    background-color: #5aa34d;
  }
  
  .btn-logout:hover {
    background-color: #e03e2d;
  }
  </style>
  