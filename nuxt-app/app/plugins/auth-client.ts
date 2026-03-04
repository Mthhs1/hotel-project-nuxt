import { createAuthClient } from "better-auth/vue"

/*
export const authClient = createAuthClient({
    baseURL: useRuntimeConfig().public.BETTER_AUTH_URL
})
*/

export default defineNuxtPlugin(() => {
  // 1. Chame o useRuntimeConfig() aqui dentro
  
  // 2. Crie a sua variável authClient igual você fez antes

  const authClient = createAuthClient({ baseURL:useRuntimeConfig().public.BETTER_AUTH_URL})
  
  // 3. Torne ela disponível para o projeto todo usando o 'provide':
  return {
    provide: {
      auth: authClient 
    }
  }
})