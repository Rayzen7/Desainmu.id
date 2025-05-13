<script setup lang="ts">
    import Navbar from '~/components/Navbar.vue';
    import Product from '~/components/user/productDetail/Product.vue';
    import Footer from '~/components/Footer.vue';
    import Rating from '~/components/user/productDetail/Rating.vue';
    import AOS from 'aos';
    import 'aos/dist/aos.css';
    import { onMounted } from 'vue';

    onMounted(() => {
        AOS.init();
    });
</script>

<template>
    <nav class="relative z-10">
        <Navbar/>
    </nav>
    <section data-aos="fade-up" data-aos-duration="900" class="pb-10">
        <Product/>
        <Rating/>
    </section>
    <Footer/>
</template>