<script setup>
import { ref, computed, onMounted, reactive, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { usePostsStore } from "@/stores/post";
import { Motion } from "@motionone/vue";
import { useProfileStore } from "@/stores/profile";
import { Pencil, Save, X } from "lucide-vue-next";


const calculateAge = (birthday) => {
  if (!birthday) return 0;
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth();
  if (month < birthDate.getMonth() || 
      (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const calculateRecommendedCalories = () => {
  const { height, weight, age, lose_or_gain } = editableUser.value;
  let bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age) -700;
  const tdee = bmr * 1.55;
  
  return Math.round(lose_or_gain === 'lose' ? tdee - 500 : tdee + 500);
};


const calculateWeeklyGoal = () => {
  const { lose_or_gain } = editableUser.value;
  return lose_or_gain === 'lose' 
    ? '0.5 kg fogyni hetente' 
    : '0.5 kg hízni hetente';
};

const authStore = useAuthStore();
const profileStore = useProfileStore();
const postStore = usePostsStore();
const selectedTab = ref("profile");

const editableUser = ref({
  ...authStore.user,
  age: calculateAge(authStore.user.birthday)
});

const editMode = ref(false);

watch(() => [editableUser.value.height, editableUser.value.weight, editableUser.value.lose_or_gain], () => {
  if (editMode.value) {
    editableUser.value.recommended_calories = calculateRecommendedCalories();
    editableUser.value.weekly_goal = calculateWeeklyGoal();
  }
});

const saveChanges = async () => {
  try {
    if (editableUser.value.birthday) {
      editableUser.value.age = calculateAge(editableUser.value.birthday);
    }
    editableUser.value.recommended_calories = calculateRecommendedCalories();
    editableUser.value.weekly_goal = calculateWeeklyGoal();
    
    await profileStore.updateProfile(editableUser.value);
    authStore.user = { ...editableUser.value };
    editMode.value = false;
  } catch (error) {
    console.error("Hiba a mentés során:", error);
  }
};

const cancelEdit = () => {
  editableUser.value = { ...authStore.user, age: calculateAge(authStore.user.birthday) };
  editMode.value = false;
};


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

const getProfileImageUrl = authStore.getProfileImageUrl;

const profileImage = computed(() => {
  if (!authStore.user || !authStore.user.avatar) {
    return "/src/assets/images/default-user.jpg";
  }
  return `${import.meta.env.VITE_API_URL}/storage/${authStore.user.avatars}`;
});
//-----------------------------//
const fileInput = ref(null);
const isUploading = ref(false);
const uploadError = ref(null);

const handleImageClick = () => {
  fileInput.value.click();
};

const handleFileUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    uploadError.value = 'Csak JPG, PNG vagy GIF fájl tölthető fel';
    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    uploadError.value = 'A kép mérete maximum 2MB lehet';
    return;
  }

  try {
    isUploading.value = true;
    uploadError.value = null;
    
    const formData = new FormData();
    formData.append('avatar', file);
    
    await authStore.uploadAvatar(formData);
    await authStore.getUser();
    
  } catch (error) {
    uploadError.value = 'Hiba történt a feltöltés közben';
    console.error('Upload error:', error);
  } finally {
    isUploading.value = false;
    event.target.value = '';
  }
};

const remainingCalories = computed(() => {
  const recommendedCalories = authStore.user.recommended_calories
  const consumedCalories = authStore.user.totalConsumedCalories || 0;
  return recommendedCalories - consumedCalories;
});
</script>

<template>
  <div class="page-wrapper">
    <header class="header">
  <Motion :initial="{ opacity: 0, y: -50 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 1 }">
    <div class="flex items-center justify-between w-full max-w-7xl mx-auto px-4">
      <img src="@/assets/images/logo.png" alt="Logo" class="logo" />
      
      <div class="relative group cursor-pointer" @click="handleImageClick">
      <img 
        :src="authStore.getProfileImageUrl(authStore.user?.avatar)" 
        alt="user" 
        class="w-24 h-24 object-cover rounded-full border-2 border-gray-200 hover:border-indigo-400 transition-all duration-300 cursor-pointer"
      >
      
      <div v-if="isUploading" class="absolute inset-0 flex items-center justify-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    </div>
    
    <div v-if="uploadError" class="text-red-500 text-sm mt-2">
      {{ uploadError }}
    </div>
    
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="handleFileUpload"
    >
    </div>
  </Motion>
</header>

    <div class="container">
      <div class="sidebar">
        <div class="tabs">
          <Motion v-for="(tab, index) in tabs" :key="tab.value"
            :initial="{ opacity: 0, x: -50 }"
            :animate="{ opacity: 1, x: 0 }"
            :transition="{ delay: index * 0.2, duration: 0.5 }"
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

      <div class="profile-container">
        <Motion :key="selectedTab" :initial="{ opacity: 0, y: 20 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 0.5 }">
          <div v-if="selectedTab === 'profile'" class="glassmorphism">
            <h2>Felhasználónév: <span class="font-bold">{{ authStore.user.name }}</span></h2>
            <h2>Email cím: <span class="font-bold">{{ authStore.user.email }}</span></h2>
            <h2>Posztok száma: <span class="font-bold">{{ postStore.userPostsCount }}</span></h2>
            <h2>Regisztráció dátuma: <span class="font-bold">{{ formattedDate }}</span></h2>
          </div>

          <div v-if="selectedTab === 'calories'" class="glassmorphism">
            <h2>Napi kalóriabevitel: <span class="font-bold">{{ remainingCalories || 'Nincs adat' }}</span></h2>
          </div>

          <div v-if="selectedTab === 'bodyStats'" class="glassmorphism relative p-4">
            <button v-if="!editMode" @click="editMode = true" class="edit-button">
              <Pencil class="w-5 h-5 text-gray-600" />
            </button>

          <div v-if="editMode">
            <h2>Születési dátum: <input v-model="editableUser.birthday" type="date" class="input-class" /></h2>
            <h2>Magasság: <input v-model.number="editableUser.height" type="number" min="100" max="250" class="input-class" /> cm</h2>
            <h2>Súly: <input v-model.number="editableUser.weight" type="number" min="30" max="200" class="input-class" /> kg</h2>
            <h2>Ajánlott kalória: <input v-model.number="editableUser.recommended_calories" type="number" class="input-class" readonly /></h2>
            <h2>Cél: 
              <select v-model="editableUser.lose_or_gain" class="input-class">
                <option value="lose">Fogyni</option>
                <option value="gain">Tömeget növelni</option>
              </select>
            </h2>
            <h2>Célsúly: <input v-model.number="editableUser.goal_weight" type="number" min="30" max="200" class="input-class" /> kg</h2>

            <div class="flex gap-2 mt-4">
              <button @click="saveChanges" class="btn-save">
                <Save class="w-5 h-5" /> Mentés
              </button>
              <button @click="cancelEdit" class="btn-cancel">
                <X class="w-5 h-5" /> Mégse
              </button>
            </div>
          </div>

          <div v-else>
            <h2>Kor: <span class="font-bold">{{ authStore.user.age || calculateAge(authStore.user.birthday) }}</span></h2>
            <h2>Magasság: <span class="font-bold">{{ authStore.user.height }} cm</span></h2>
            <h2>Súly: <span class="font-bold">{{ authStore.user.weight }} kg</span></h2>
            <h2>Ajánlott kalória: <span class="font-bold">{{ authStore.user.recommended_calories }}</span></h2>
            <h2>Cél: <span class="font-bold">{{ authStore.user.lose_or_gain === 'lose' ? 'Fogyni' : 'Tömeget növelni' }}</span></h2>
            <h2>Célsúly: <span class="font-bold">{{ authStore.user.goal_weight }} kg</span></h2>
          </div>
        </div>
        </Motion>
      </div>
    </div>
  </div>
</template>

<style scoped>
.group:hover .hover-overlay {
  box-shadow: inset 0 0 0 2px rgba(99, 102, 241, 0.5);
}
.group:hover img {
  transform: scale(1.03);
}
.transition-opacity {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Border animáció */
.transition-all {
  transition: all 0.3s ease-out;
}

/* Spinner animáció */
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}

/* Egér mutató */
.cursor-pointer {
  cursor: pointer;
}

/* Árnyék hover-nél */
.group:hover img {
  box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
}
.page-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #002128, #004050);
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.container {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
}

.sidebar {
  width: 200px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.tabs {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tab-btn {
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  transition: background 0.3s;
  text-align: center;
}

.tab-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
}

.active-tab {
  background-color: #6ABC5C;
  color: white;
}

.profile-container {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.glassmorphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 20px;
  color: white;
  text-align: left;
}

.input-class {
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  width: 100%;
  margin-top: 5px;
}

.edit-button {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: background 0.3s;
}

.edit-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.btn-save, .btn-cancel {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-save {
  background-color: #48bb78;
  color: white;
}

.btn-save:hover {
  background-color: #38a169;
}

.btn-cancel {
  background-color: #f56565;
  color: white;
}

.btn-cancel:hover {
  background-color: #e53e3e;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    max-width: 100%;
  }

  .profile-container {
    width: 100%;
  }

  .logo {
    width: 120px;
    height: 120px;
  }
}
</style>