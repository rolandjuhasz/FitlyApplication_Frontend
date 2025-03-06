<script setup>
import { ref, computed, onMounted, reactive } from "vue";
import { useAuthStore } from "@/stores/auth";
import { usePostsStore } from "@/stores/post";
import { Motion } from "@motionone/vue";
import { useProfileStore } from "@/stores/profile";
import { Pencil, Save, X } from "lucide-vue-next";

const user = reactive({
  name: '',
  email: '',
  age: '',
  height: '',
  weight: '',
  recommended_calories: '',
  lose_or_gain: '',
  goal_weight: '',
  created_at: '',
  birth_date: ''
});

const authStore = useAuthStore();
const profileSotre = useProfileStore();
const postStore = usePostsStore();
const selectedTab = ref("profile");

const editableUser = ref({ ...authStore.user });
const editMode = ref(false);

const saveChanges = async () => {
  // Számoljuk ki a kort, ha a születési dátum változott
  if (editableUser.value.birth_date) {
    editableUser.value.age = calculateAge(editableUser.value.birth_date);
  }

  await profileSotre.updateProfile(editableUser.value);
  authStore.user = { ...editableUser.value }; // User frissítése
  editableUser.value = { ...authStore.user }; // EditableUser szinkronizálása
  editMode.value = false;
};


const cancelEdit = () => {
  editableUser.value = { ...authStore.user };
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

const calculateAge = (birthday) => {
  const birthDate = new Date(birthday); // Átalakítjuk dátummá
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth();
    if (month < birthDate.getMonth() || (month === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--; // Ha még nem volt idén a születésnap
    }
    return age;
};

</script>

<template>
  <div class="page-wrapper">

    <header class="header">
      <Motion :initial="{ opacity: 0, y: -50 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 1 }">
        <img src="@/assets/images/logo.png" alt="Logo" class="logo" />
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
            <h2>Napi kalóriabevitel: <span class="font-bold">{{ authStore.user.daily_calories || 'Nincs adat' }}</span></h2>
            <h2>Heti cél: <span class="font-bold">{{ authStore.user.weekly_goal || 'Nincs adat' }}</span></h2>
          </div>

          <div v-if="selectedTab === 'bodyStats'" class="glassmorphism relative p-4">
            <button v-if="!editMode" @click="editMode = true" class="edit-button">
              <Pencil class="w-5 h-5 text-gray-600" />
            </button>

            <div v-if="editMode">
              <h2>Magasság: <input v-model="editableUser.height" type="number" class="input-class" /> cm</h2>
              <h2>Súly: <input v-model="editableUser.weight" type="number" class="input-class" /></h2>
              <h2>Ajánlott kalória: <input v-model="editableUser.recommended_calories" type="number" class="input-class" /></h2>
              <h2>Fogyni vagy felszedni: 
                <select v-model="editableUser.lose_or_gain" class="input-class">
                  <option value="lose">Fogyni</option>
                  <option value="gain">Tömeget növelni</option>
                </select>
              </h2>
              <h2>Célsúly: <input v-model="editableUser.goal_weight" type="number" class="input-class" /></h2>

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
              <h2>Kor: <span class="font-bold">{{ calculateAge(authStore.user.birthday) }}</span></h2>
              <h2>Magasság: <span class="font-bold">{{ authStore.user.height }} cm</span></h2>
              <h2>Súly: <span class="font-bold">{{ authStore.user.weight }}</span></h2>
              <h2>Ajánlott kalória: <span class="font-bold">{{ authStore.user.recommended_calories }}</span></h2>
              <h2>Fogyni vagy felszedni: <span class="font-bold">{{ authStore.user.lose_or_gain }}</span></h2>
              <h2>Célsúly: <span class="font-bold">{{ authStore.user.goal_weight }}</span></h2>
            </div>
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
  width: 200px; /* Fix szélesség */
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