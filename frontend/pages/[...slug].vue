<script>
  export default {
    name: 'NotFoundPage',
  }
</script>

<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-[#53B0FF] to-[#1E6FF2] text-white">
    <i class="bx bx-x-circle text-8xl mb-6 animate-pulse"></i>
    <h1 class="lg:text-4xl text-[26px] text-center mb-4 font-poppins_medium">404 - Page Not Found</h1>
    <p class="lg:text-lg text-[14px] lg:px-auto px-7 max-w-md text-center opacity-80 font-poppins_regular">Oops! The page you are looking for seems to have vanished. Please check the URL or return to the homepage.</p>
    <div class="mt-12">
      <router-link to="/" class="px-6 py-2 text-[14px] lg:text-lg bg-primary rounded-full font-poppins_regular hover:bg-[#1E6FF2] transition-all">Go to Homepage</router-link>
    </div>
  </div>
</template>

