<script setup lang="ts">
    import { aboutUs } from '~/data/AboutUs';
    import { createdBy } from '~/data/AboutUs';
    import { onMounted } from 'vue';
    import AOS from 'aos';
    import 'aos/dist/aos.css';

    onMounted(() => {
        AOS.init();
    });
</script>

<template>
    <section data-aos="fade-up" data-aos-duration="900" class="flex justify-center items-center gap-2 flex-col px-2 lg:px-20 pb-10 lg:mt-0 -mt-8">
        <h1 class="lg:text-[42px] text-[32px] font-poppins_semibold text-primary">About Us</h1>
        <div class="flex justify-center items-center lg:gap-10 gap-x-4 gap-y-8 flex-wrap lg:mt-14 mt-10">
            <div class="" v-for="(user, index) in aboutUs" :key="index">
                <div class="flex cursor-pointer justify-start lg:justify-center lg:w-full w-[280px] items-center gap-4 bg-white p-4 border-2 border-primary rounded-md hover:bg-primary hover:-translate-y-2 group duration-200">
                    <img :src="user.img" alt="" class="lg:w-[60px] w-[40px] rounded-md h-auto"/>
                    <div class="">
                        <h1 class="lg:text-[16px] text-[14px] group-hover:text-white duration-200 font-poppins_medium">{{ user.name }}</h1>
                        <p class="lg:text-[14px] text-[12px] group-hover:text-white duration-200 font-poppins_regular">{{ user.division }}</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-24">
            <div class="flex justify-center items-center gap-x-6 gap-y-10 lg:gap-10 flex-wrap">
                <div class="" v-for="(img, index) in createdBy" :key="index">
                    <img :src="img.img" class="lg:w-[80px] w-[40px] rounded-md h-auto" alt="" />
                </div>
            </div>
        </div>
    </section>
</template>