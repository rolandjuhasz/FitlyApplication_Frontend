import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HeroView.vue'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import { useAuthStore } from '@/stores/auth'
import SocialMediaView from '@/views/Posts/SocialMediaView.vue'
import UpdateView from '@/views/Posts/UpdateView.vue'
import ProfileView from '@/views/Profile/ProfileView.vue'
// import ShowView from '@/views/Posts/ShowView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guest: true },
    },
    {
      path: "/profile",
      name: "profile",
      component: ProfileView,
      meta: { auth: true },
    },
    {
      path: '/posts',
      name: 'posts',
      component: SocialMediaView,
    },
    // {
    //   path: "/posts/:id",
    //   name: "show",
    //   component: ShowView,
    // },
    {
      path: "/posts/update/:id",
      name: "update",
      component: UpdateView,
      meta: { auth: true },
    },

  ],
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  await authStore.getUser();

  if (authStore.user && to.meta.guest) {
    return { name: "home" };
  }

  if (!authStore.user && to.meta.auth) {
    return { name: "login" };
  }
});

export default router
