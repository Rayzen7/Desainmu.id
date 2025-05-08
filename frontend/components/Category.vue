<script setup lang="ts">
    import { categoryData } from '~/data/CategoryData';
</script>

<style scoped>
    .no-scrolling::-webkit-scrollbar {
        width: 0;
    }
</style>

<template>
    <div class="lg:mt-12 mt-8 overflow-scroll no-scrolling lg:mx-20 mx-4">
        <div class="flex justify-start items-center gap-6 lg:gap-8 shrink-0">
            <div class="" v-for="(category, index) in categoryData" :key="index">   
                <div class="border-2 border-primary p-2 lg:p-4 rounded-xl flex gap-3 lg:gap-5 lg:w-[310px] w-[180px]">
                    <img :src="category.img" alt="" class="lg:w-[65px] w-[34px] h-auto">
                    <div class="flex flex-col gap-1">
                        <p class="lg:text-[20px] text-[12px] font-poppins_medium">{{ category.name }}</p>
                        <a href="#product" class="text-primary font-poppins_medium text-[10px] lg:text-[14px] cursor-pointer">Show All</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>