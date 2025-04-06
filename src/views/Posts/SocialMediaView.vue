<script setup>
import { usePostsStore } from "@/stores/post";
import { computed, onMounted, ref } from "vue";
import { RouterLink } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useCommentsStore } from "@/stores/comment";
import { useReactionStore } from "@/stores/reaction";


const authStore = useAuthStore();
const { getAllPosts, deletePost } = usePostsStore();
const { getComments } = useCommentsStore();
const reactionStore = useReactionStore();

const posts = ref([]);
const commentsPerPage = 3;

const loadComments = async (post) => {
  await getComments(post.id);
  const currentPage = post.currentPage || 1;
  const start = (currentPage - 1) * commentsPerPage;
  const end = start + commentsPerPage;
  post.comments = useCommentsStore().comments.filter(comment => comment.post_id === post.id).slice(start, end);
};

const createComment = async (postId, content) => {
  if (!content.trim()) return;
  await useCommentsStore().createComment(postId, content);
  const post = posts.value.find(p => p.id === postId);
  if (post) {
    post.newComment = "";
    await loadComments(post);
  }
};

onMounted(async () => {
  posts.value = await getAllPosts();
  for (let post of posts.value) {
    post.currentPage = 1;
    post.newComment = "";
    await loadComments(post);
  }
});

const nextPage = (post) => {
  post.currentPage++;
  loadComments(post);
};

const prevPage = (post) => {
  if (post.currentPage > 1) {
    post.currentPage--;
    loadComments(post);
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("hu-HU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).replace(/\./g, "-").replace(" ", "");
};

</script>

<template>
  <main class="container mx-auto p-6 max-w-6xl">
    <div v-if="posts.length > 0" class="space-y-8">
      <h1 class="text-4xl font-bold text-center text-[#eae3ea] mb-8">Legutóbbi posztok</h1>
      <div class="text-center mt-4">
        <RouterLink :to="{ name: 'create' }" class="auth-btn">
          Új poszt
        </RouterLink>
      </div>
      <div v-for="post in posts" :key="post.id" class="border-l-4 border-[#6ABC5C] pl-4 p-3 rounded-lg shadow-lg bg-[#FDFDFD] hover:shadow-xl transition-shadow duration-300">
        <div class="flex items-center gap-4">
          <img 
            :src="authStore.getProfileImageUrl(post.user?.avatar)" 
            alt="user" 
            class="w-16 h-16 object-cover rounded-full border-2 border-gray-200 hover:border-indigo-400 transition-all duration-300 cursor-pointer"
          >
          <h2 class="text-3xl font-bold text-[#131213] mb-2">{{ post.title }}</h2>
        </div>

        <p class="text-mx text-[#C7C8C7] mb-4 text-right">
          Poszt létrehozója 
          <span class="text-green-800 font-bold">{{ post.user.name }}</span>
        </p>

        <p class="text-[#131213] mb-4">{{ post.content }}</p>

        <div v-if="post.image_path" class="mb-4">
          <div class="flex justify-center items-center">
          <img 
            :src="`http://127.0.0.1:8000/storage/${post.image_path}`"
            alt="Post image"
            class="rounded-lg w-auto h-60 max-w-[500px] object-cover"
          />
        </div>
        </div>
        <div class="flex items-center gap-3 mb-4">
          <button 
            @click="reactionStore.toggleReaction(post, 'like')" 
            class="px-3 py-2 rounded-full bg-gray-200 hover:bg-blue-200 transition">
            👍
          </button>
          <button 
            @click="reactionStore.toggleReaction(post, 'dislike')" 
            class="px-3 py-2 rounded-full bg-gray-200 hover:bg-red-200 transition">
            👎
          </button>
          <button 
            @click="reactionStore.toggleReaction(post, 'love')" 
            class="px-3 py-2 rounded-full bg-gray-200 hover:bg-pink-200 transition">
            ❤️
          </button>
        </div>


        <div class="mb-6">
        <h3 class="text-lg font-bold text-[#131213] mb-4">Kommentek</h3>
    <div v-if="post.comments && post.comments.length > 0" class="space-y-4">
        <div v-for="comment in post.comments" :key="comment.id" class="flex items-start space-x-3">
              <img 
                :src="authStore.getProfileImageUrl(comment.user?.avatar)" 
                alt="user" 
                class="w-8 h-8 object-cover rounded-full border-2 border-gray-200 hover:border-indigo-400 transition-all duration-300 cursor-pointer"
              >
            <div class="flex-1 bg-[#F0F2F5] p-3 rounded-lg">
                <p class="text-[#131213] font-semibold">{{ comment.user.name }}</p>
                <p class="text-[#131213]">{{ comment.content }}</p>
                <div class="mt-2 text-sm text-[#65676B]">

                    <span class="text-[#65676B]">{{ formatDate(comment.created_at) }}</span>
                </div>
            </div>
        </div>
    </div>
    
    <div v-else class="text-[#C7C8C7]">Nincsenek kommentek</div>
    <form class="mt-6" @submit.prevent="createComment(post.id, post.newComment)">
    <div class="flex items-start space-x-3">
        <textarea 
            v-model="post.newComment" 
            placeholder="Küldj kommentet..." 
            class="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="2"
        ></textarea>
    </div>
    
      <div class="mt-2 flex justify-end">
          <button 
              type="submit" 
              class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Küldés
          </button>
      </div>
</form>
</div>
        <div v-if="authStore.user && authStore.user.id === post.user_id" class="flex items-center gap-6 mt-6">
          <form @submit.prevent="deletePost(post)">
            <button class="text-red-500 font-bold px-2 py-1 border border-red-300">Törlés</button>
          </form>
          <RouterLink :to="{ name: 'update', params: { id: post.id } }" class="text-green-500 font-bold px-2 py-1 border border-green-300">Módosítás</RouterLink>
        </div>

        <div class="flex justify-between mt-6">
          <button @click="prevPage(post)" class="text-blue-500 font-bold" :disabled="post.currentPage === 1">Előző</button>
          <button @click="nextPage(post)" class="text-blue-500 font-bold">Következő</button>
        </div>
      </div>
    </div>

    <div v-else class="text-center">
      <h2 class="text-2xl text-[#C7C8C7]">Nincsenek posztok!</h2>
      <div class="mt-5">
        <RouterLink :to="{ name: 'create' }" class="auth-btn">
          Új poszt
        </RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
textarea {
  resize: none;
}

.auth-btn {
      background-color: #6ABC5C;
      color: #131213;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: bold;
      transition: background 0.3s, transform 0.2s;
      margin: 15px;
    }
    
    .auth-btn:hover {
      background-color: #5aa34d;
      transform: scale(1.05);
    }
</style>


