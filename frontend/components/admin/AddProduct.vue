<script setup lang="ts">
    import { API } from '#imports';
    import { onMounted, ref } from '#imports';
    import RupiahFormat from '~/public/icon/chevron.svg';
    import cookie from 'js-cookie';
    import preview from '~/public/product/preview.jpg';
</script>

<template>
    <section>
        <div class="">
            <h1 class="text-[24px] lg:text-[30px] font-poppins_semibold">Add Product</h1>
        </div>
        <div class="mt-8">
            <div class="">
                <img :src="preview" alt="" class="w-[380px] h-auto rounded-md"/>
            </div>
            <div class="">
                <div class="">
                    <label>Product Name: </label>
                    <input type="text" placeholder="Your Product"/>
                </div>
            </div>
        </div>
    </section>
</template>