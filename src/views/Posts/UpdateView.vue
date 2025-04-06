<script setup>
import { useAuthStore } from "@/stores/auth";
import { usePostsStore } from "@/stores/post";
import { storeToRefs } from "pinia";
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const toast = useToast();
const router = useRouter();
const route = useRoute();
const { user } = storeToRefs(useAuthStore());
const { errors } = storeToRefs(usePostsStore());
const { getPost, updatePost } = usePostsStore();

const post = ref(null);

const formData = reactive({
  title: "",
  content: "",
});

onMounted(async () => {
  post.value = await getPost(route.params.id);

  if (user.value.id !== post.value.user_id) {
    router.push({ name: "posts" });
  } else {
    formData.title = post.value.title;
    formData.content = post.value.content;
  }
});
</script>

<template>
  <main class="bg-[#F4F4F9] min-h-screen flex justify-center items-center py-10">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
      <h1 class="text-3xl font-bold text-[#131213] mb-6 text-center">Módosítás</h1>

      <form
        @submit.prevent="updatePost(post, formData)"
        class="space-y-6"
      >
        <div>
          <label for="title" class="block text-lg font-semibold text-[#131213] mb-2">Poszt címe</label>
          <input
            type="text"
            id="title"
            placeholder="Írd be a poszt címét"
            v-model="formData.title"
            class="w-full p-4 bg-[#F9F9F9] border-2 border-[#D1D5DB] rounded-md focus:outline-none focus:border-[#6ABC5C] transition"
          />
          <p v-if="errors.title" class="text-red-500 text-sm mt-2">{{ errors.title[0] }}</p>
        </div>

        <div>
          <label for="content" class="block text-lg font-semibold text-[#131213] mb-2">Poszt leírása</label>
          <textarea
            id="content"
            rows="6"
            placeholder="Poszt tartalma..."
            v-model="formData.content"
            class="w-full p-4 bg-[#F9F9F9] border-2 border-[#D1D5DB] rounded-md focus:outline-none focus:border-[#6ABC5C] transition"
          ></textarea>
          <p v-if="errors.content" class="text-red-500 text-sm mt-2">{{ errors.content[0] }}</p>
        </div>

        <div class="text-center">
          <button
            type="submit"
            class="w-full py-3 bg-[#6ABC5C] text-white font-semibold rounded-md hover:bg-[#5aa34d] transition duration-300"
          >
            Módosítás
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

.input, .textarea {
  width: 100%;
  padding: 12px 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
  border: 2px solid #d1d5db;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.input:focus, .textarea:focus {
  border-color: #6ABC5C;
  outline: none;
}

button {
  width: 100%;
  padding: 12px 20px;
  background-color: #6ABC5C;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #5aa34d;
}
</style>
