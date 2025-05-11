<script setup lang="ts">
    import Chat from '~/components/admin/Chat.vue';
    import Sidebar from '~/components/admin/Sidebar.vue';
    import AdminAuth from '~/utils/AdminAuth.vue';
</script>

<template>
    <AdminAuth>
        <section class="flex w-full min-h-screen bg-[#f8f8f8]">
            <Sidebar/>
            <div class="lg:w-[75vw] w-full ml-0 lg:ml-auto mx-0 lg:mx-6 my-0 lg:my-10 lg:px-0 px-4 p-8 lg:p-2">
                <Chat/>
            </div>
        </section>
    </AdminAuth>
</template>