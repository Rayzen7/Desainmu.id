<script setup lang="ts">
    import Category from '~/components/Category.vue';
    import Feedback from '~/components/Feedback.vue';
    import Footer from '~/components/Footer.vue';
    import Navbar from '~/components/Navbar.vue';   
    import Offer from '~/components/Offer.vue';
    import Product from '~/components/Product.vue';
import UserAuth from '~/utils/UserAuth.vue';
    
</script>

<template>
    <Navbar/>
    <UserAuth>
        <Offer/>
        <Category/>
        <Product/>
        <Feedback/>
        <Footer/>
    </UserAuth>
</template>