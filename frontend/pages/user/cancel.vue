<script setup lang="ts">
    import Sidebar from '~/components/user/Profile/Sidebar.vue';
    import Cancel from '~/components/user/Profile/Cancel.vue';
</script>

<template>
    <section class="flex w-full bg-[#f8f8f8]">
        <Sidebar/>
        <div class="lg:w-[75vw] w-full ml-0 lg:ml-auto mx-0 lg:mx-6 my-0 lg:my-10 p-8 lg:p-2">
            <Cancel/>
        </div>
    </section>
</template>