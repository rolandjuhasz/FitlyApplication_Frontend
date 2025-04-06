<script setup>
import { usePostsStore } from "@/stores/post";
import { storeToRefs } from "pinia";
import { reactive } from "vue";

const { errors } = storeToRefs(usePostsStore());
const { createPost } = usePostsStore();

const formData = reactive({
  title: "",
  content: "",
  image: null, // Hozzáadjuk a képet
});

const handleFileChange = (event) => {
  formData.image = event.target.files[0]; // A fájlt hozzáadjuk a formData-hoz
};
</script>

<template>
  <main class="bg-[#F4F4F9] min-h-screen flex justify-center items-center py-10">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
      <h1 class="text-3xl font-bold text-[#131213] mb-6 text-center">Create a new post</h1>

      <form @submit.prevent="createPost(formData)" class="space-y-6">
        <div>
          <label for="title" class="block text-lg font-semibold text-[#131213] mb-2">Poszt címe</label>
          <input
            type="text"
            id="title"
            placeholder="Írd le a poszt címét"
            v-model="formData.title"
            class="w-full p-4 bg-[#F9F9F9] border-2 border-[#D1D5DB] rounded-md focus:outline-none focus:border-[#6ABC5C] transition"
          />
          <p v-if="errors.title" class="text-red-500 text-sm mt-2">{{ errors.title[0] }}</p>
        </div>

        <div>
          <label for="body" class="block text-lg font-semibold text-[#131213] mb-2">Poszt tartalma</label>
          <textarea
            id="body"
            rows="6"
            placeholder="Poszt tartalma..."
            v-model="formData.content"
            class="w-full p-4 bg-[#F9F9F9] border-2 border-[#D1D5DB] rounded-md focus:outline-none focus:border-[#6ABC5C] transition"
          ></textarea>
          <p v-if="errors.content" class="text-red-500 text-sm mt-2">{{ errors.content[0] }}</p>
        </div>

        <!-- File input for the image -->
        <div>
          <label for="image" class="block text-lg font-semibold text-[#131213] mb-2">Kép feltöltése</label>
          <input
            type="file"
            id="image"
            @change="handleFileChange"
            class="w-full p-4 bg-[#F9F9F9] border-2 border-[#D1D5DB] rounded-md focus:outline-none focus:border-[#6ABC5C] transition"
          />
          <p v-if="errors.image" class="text-red-500 text-sm mt-2">{{ errors.image[0] }}</p>
        </div>

        <div class="text-center">
          <button
            type="submit"
            class="w-full py-3 bg-[#6ABC5C] text-white font-semibold rounded-md hover:bg-[#5aa34d] transition duration-300"
          >
            Posztolás
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<style scoped>
.text-red-500 {
  color: #ef4444;
}
</style>
