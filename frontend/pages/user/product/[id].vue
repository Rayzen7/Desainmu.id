<script setup lang="ts">
    import Navbar from '~/components/Navbar.vue';
    import Product from '~/components/user/productDetail/Product.vue';
    import Footer from '~/components/Footer.vue';
    import Rating from '~/components/user/productDetail/Rating.vue';
</script>

<template>
    <nav class="relative z-10">
        <Navbar/>
    </nav>
    <section class="pb-10">
        <Product/>
        <Rating/>
    </section>
    <Footer/>
</template>