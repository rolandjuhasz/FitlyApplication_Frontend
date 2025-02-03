<script setup>
import { ref } from "vue";
import { Motion } from "@motionone/vue";

const stats = ref([
  { label: "Boldog tagok", value: "10K+" },
  { label: "Teljesített edzés", value: "50K+" },
  { label: "Elégetett kalória", value: "1M+" }
]);

const features = ref([
  {
    icon: "🏋️",
    title: "Személyre szabott edzéstervek",
    description: "Edzéseid igényeidhez igazítva, hogy maximális eredményt érj el."
  },
  {
    icon: "📊",
    title: "Teljesítménykövetés",
    description: "Kövesd az edzéseid hatékonyságát és láthatod a fejlődésed."
  },
  {
    icon: "🍎",
    title: "Egészséges életmód tanácsok",
    description: "Kapj tippeket és tanácsokat az egészséges életmódhoz."
  }
]);
</script>

<template>
  <div class="min-h-screen bg-[#131213] text-[#FDFDFD] flex flex-col items-center justify-center p-6 overflow-hidden">

    <section class="relative text-center max-w-3xl mt-10 z-10">
      <Motion :initial="{ opacity: 0, y: -50 }" :animate="{ opacity: 1, y: 0 }" :transition="{ duration: 1 }">
        <h1 class="text-7xl font-extrabold text-[#6ABC5C] drop-shadow-lg">Formáld a jövődet!</h1>
      </Motion>
      <Motion :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :transition="{ delay: 0.5 }">
        <p class="text-xl text-[#C7C8C7] mt-4 max-w-xl mx-auto">
          Építsd fel az álomtested, kezdd el most az edzést!
        </p>
      </Motion>
      <Motion :initial="{ scale: 0.8, opacity: 0 }" :animate="{ scale: 1, opacity: 1 }" :transition="{ delay: 0.8 }">
        <button class="mt-6 px-10 py-4 bg-[#6ABC5C] text-[#131213] font-semibold rounded-2xl shadow-xl hover:bg-[#4d8b48] transition-all transform hover:scale-110 animate-glow">
          Kezdés
        </button>
      </Motion>
    </section>


    <section class="relative mt-20 z-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Motion v-for="(stat, index) in stats" :key="stat.label" :initial="{ opacity: 0, y: 50 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: index * 0.2 }">
          <div class="stat-card bg-[#002128] text-[#FDFDFD] p-6 rounded-2xl shadow-lg">
            <h3 class="text-4xl font-bold">{{ stat.value }}</h3>
            <p class="text-lg mt-2">{{ stat.label }}</p>
          </div>
        </Motion>
      </div>
    </section>

    <section class="relative mt-20 z-10">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Motion v-for="(feature, index) in features" :key="feature.title" :initial="{ opacity: 0, y: 50 }" :animate="{ opacity: 1, y: 0 }" :transition="{ delay: index * 0.2 }">
          <div class="bg-[#002128] text-[#FDFDFD] p-6 rounded-2xl shadow-lg flex flex-col items-center text-center">
            <span class="text-4xl mb-4">{{ feature.icon }}</span>
            <h3 class="text-2xl font-bold">{{ feature.title }}</h3>
            <p class="text-lg mt-2">{{ feature.description }}</p>
          </div>
        </Motion>
      </div>
    </section>
  </div>
</template>

<style scoped>
.stat-card {
  background-color: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 1.5rem;
  text-align: center;
  transition: transform 0.4s, box-shadow 0.4s;
}

.stat-card:hover {
  transform: translateY(-10px) scale(1.08);
  box-shadow: 0px 15px 30px rgba(106, 188, 92, 0.3);
}

@keyframes glow {
  0% {
    box-shadow: 0px 0px 20px rgba(106, 188, 92, 0.6);
  }
  50% {
    box-shadow: 0px 0px 30px rgba(106, 188, 92, 1);
  }
  100% {
    box-shadow: 0px 0px 20px rgba(106, 188, 92, 0.6);
  }
}

.animate-glow {
  animation: glow 1.5s infinite alternate;
}
</style>