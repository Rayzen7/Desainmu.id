<script setup lang="ts">
    import bg1 from '/home/offer/1.png';
    import bg2 from '/home/offer/2.png';
    import bg3 from '/home/offer/3.png';
    import { ref, onMounted } from 'vue';

    const offerImage = [
        {
            id: 1,
            image: bg1,
        },
        {
            id: 2,
            image: bg2,
        },
        {
            id: 3,
            image: bg3,
        },
    ];

    const scrollContainer = ref<HTMLDivElement>();
    const currentIndex = ref(0);
    const widthPerImage = ref(0);

    onMounted(() => {
        if (scrollContainer.value?.firstElementChild) {
            widthPerImage.value = (scrollContainer.value.firstElementChild as HTMLElement).offsetWidth;
        }

        setInterval(() => {
            currentIndex.value++;                
            if (currentIndex.value >= offerImage.length) {
                currentIndex.value = 0;
            }

            scrollContainer.value?.scrollTo({
                left: (widthPerImage.value + 32) * currentIndex.value,
                behavior: 'smooth'
            });
        }, 3000);
    });
</script>

<style scoped>
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }

    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
</style>

<template>
    <section class="lg:mt-4 -mt-2">
        <div class="flex justify-center items-center gap-4 lg:gap-12 font-poppins_medium text-[10px] lg:text-[20px] mb-8 cursor-pointer">
            <a href="#" class="text-black hover:text-primary duration-150">Home</a>
            <a href="#product" class="text-black hover:text-primary duration-150">Product</a>
            <a href="#product" class="text-black hover:text-primary duration-150">Categories</a>
            <a href="#feedback" class="text-black hover:text-primary duration-150">Feedback</a>
            <nuxt-link to="/about">
                <p class="text-black hover:text-primary duration-150">About Us</p>
            </nuxt-link>
        </div>
        <div ref="scrollContainer" class="flex justify-start items-center overflow-hidden lg:mt-0 -mt-3 mx-4 lg:mx-20 gap-8 no-scrollbar">
            <div class="shrink-0 w-[100%]" v-for="(image, index) in offerImage" :key="index">
                <img :src="image.image" alt="" class="w-full h-auto">
            </div>
        </div>
    </section>
</template>