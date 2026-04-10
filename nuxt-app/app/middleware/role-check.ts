import { useAuthStore } from "~/stores/authStore"


export default defineNuxtRouteMiddleware((to, from) => {

    const authStore = useAuthStore()
    console.log(to.path);
    console.log(to.path.includes('/employee'));
    console.log(to.path.startsWith('/employee'));
})