<script setup lang="ts">
    import Profile from '~/components/super-admin/Profile.vue';
    import Sidebar from '~/components/super-admin/Sidebar.vue';
    import SuperAuth from '~/utils/SuperAuth.vue';
</script>

<template>
    <SuperAuth>
        <section class="flex w-full min-h-screen bg-[#f8f8f8]">
            <Sidebar/>
            <div class="lg:w-[75vw] w-full ml-0 lg:ml-auto mx-0 lg:mx-6 my-0 lg:my-10 p-8 lg:p-2">
                <Profile/>
            </div>
        </section>
    </SuperAuth>
</template>