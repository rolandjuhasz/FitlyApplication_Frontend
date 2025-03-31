<script setup>
import { useRecipesStore } from "@/stores/recipes";
import { storeToRefs } from "pinia";
import { reactive, ref } from "vue";

const { errors } = storeToRefs(useRecipesStore());
const { createRecipe } = useRecipesStore();

const formData = reactive({
  title: "",
  ingredients: "",
  description: "",
  avg_time: "",
  image_paths: null,
});

const fileInput = ref(null);

const handleFileUpload = (event) => {
  formData.image_paths = event.target.files;
};

const submitForm = () => {
  if (!formData.title || !formData.ingredients || !formData.description || !formData.avg_time) {
    alert("Please fill in all the fields.");
    return; // Ha valami hiányzik, ne küldd el a kérés
  }

  const formDataToSend = new FormData();
  formDataToSend.append("title", formData.title);
  formDataToSend.append("ingredients", formData.ingredients);
  formDataToSend.append("description", formData.description);
  formDataToSend.append("avg_time", formData.avg_time);

  if (formData.image_paths) {
    for (let i = 0; i < formData.image_paths.length; i++) {
      formDataToSend.append("image_paths[]", formData.image_paths[i]);
    }
  }

  createRecipe(formDataToSend);
};


</script>

<template>
  <main class="bg-[#F4F4F9] min-h-screen flex justify-center items-center py-10">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
      <h1 class="text-3xl font-bold text-[#131213] mb-6 text-center">Add a new recipe</h1>

      <form @submit.prevent="submitForm" enctype="multipart/form-data">

        <div>
          <label for="title" class="block text-lg font-semibold text-[#131213] mb-2">Recipe Title</label>
          <input
            type="text"
            id="title"
            placeholder="Enter recipe title"
            v-model="formData.title"
            class="w-full p-4 bg-[#F9F9F9] border-2 border-[#D1D5DB] rounded-md focus:outline-none focus:border-[#6ABC5C] transition"
          />
          <p v-if="errors.title" class="text-red-500 text-sm mt-2">{{ errors.title[0] }}</p>
        </div>

        <div>
          <label for="ingredients" class="block text-lg font-semibold text-[#131213] mb-2">Ingredients</label>
          <textarea
            id="ingredients"
            rows="4"
            placeholder="List ingredients"
            v-model="formData.ingredients"
            class="w-full p-4 bg-[#F9F9F9] border-2 border-[#D1D5DB] rounded-md focus:outline-none focus:border-[#6ABC5C] transition"
          ></textarea>
          <p v-if="errors.ingredients" class="text-red-500 text-sm mt-2">{{ errors.ingredients[0] }}</p>
        </div>

        <div>
          <label for="description" class="block text-lg font-semibold text-[#131213] mb-2">Description</label>
          <textarea
            id="description"
            rows="6"
            placeholder="Describe how to make the recipe"
            v-model="formData.description"
            class="w-full p-4 bg-[#F9F9F9] border-2 border-[#D1D5DB] rounded-md focus:outline-none focus:border-[#6ABC5C] transition"
          ></textarea>
          <p v-if="errors.description" class="text-red-500 text-sm mt-2">{{ errors.description[0] }}</p>
        </div>

        <div>
          <label for="avg_time" class="block text-lg font-semibold text-[#131213] mb-2">Average Cooking Time</label>
          <input
            type="text"
            id="avg_time"
            placeholder="E.g., 30 minutes"
            v-model="formData.avg_time"
            class="w-full p-4 bg-[#F9F9F9] border-2 border-[#D1D5DB] rounded-md focus:outline-none focus:border-[#6ABC5C] transition"
          />
          <p v-if="errors.avg_time" class="text-red-500 text-sm mt-2">{{ errors.avg_time[0] }}</p>
        </div>

        <div>
          <label for="image" class="block text-lg font-semibold text-[#131213] mb-2">Upload Image</label>
          <input
            type="file"
            id="image"
            ref="fileInput"
            multiple
            @change="handleFileUpload"
            class="w-full p-2 bg-[#F9F9F9] border-2 border-[#D1D5DB] rounded-md"
          />
          <p v-if="errors.image_paths" class="text-red-500 text-sm mt-2">{{ errors.image_paths[0] }}</p>
        </div>

        <div class="text-center">
          <button
            type="submit"
            class="w-full py-3 bg-[#6ABC5C] text-white font-semibold rounded-md hover:bg-[#5aa34d] transition duration-300"
          >
            Add Recipe
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
