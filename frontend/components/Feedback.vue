<script setup lang="ts">
    import logo from '~/public/home/feedback/logo.png';
    import { API } from '#imports';
    import Swal from 'sweetalert2';
    import { ref } from '#imports';

    const feedbackData = ref({
        name: '',
        comment: ''
    });

    const handleSubmit = async() => {
        try {
            Swal.fire({
                title: 'Please wait...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await API.post('/feedback', {
                name: feedbackData.value.name,
                comment: feedbackData.value.comment,
            });

            Swal.fire({
                title: response.data.message,
                icon: 'success',
                text: 'You can be reload on this page',
                confirmButtonColor: 'green',
                confirmButtonText: 'Success',
            }).then((result) => {
                if (result) {
                    window.location.reload();
                }
            })
        } catch (error: any) {
            Swal.fire({
                title: error.response.data.message,
                icon: 'error',
                text: 'Please input your feedback correctly',
                confirmButtonColor: 'red',
                confirmButtonText: 'Error'
            })
        }
    }
</script>

<template>
    <section class="flex justify-center items-center gap-0 lg:mx-0 mx-4 lg:gap-32 mt-16" id="feedback">
        <div class="">
            <img :src="logo" class="w-[400px] image h-auto" alt="">
        </div>
        <div class="bg-primary w-[500px] p-8 rounded-xl text-white flex flex-col">
            <div class="flex flex-col gap-10 lg:gap-4 justify-center items-center">
                <div class="w-[110px] h-[8px] rounded-full bg-white"></div>
                <h1 class="lg:text-[26px] text-[24px] font-poppins_semibold">Send Your Feedback</h1>
            </div>
            <div class="lg:mt-7 mt-4">
                <h1 class="lg:text-[22px] text-[18px] font-poppins_medium">Let us know your feedback</h1>
                <p class="lg:text-[16px] text-[12px] mt-1 font-poppins_regular">We value feedback and strive tp provide the set <br class="responsive"/> possible experince for you</p>
            </div>
            <div class="flex flex-col justify-center items-center gap-4 mt-8">
                <input v-model="feedbackData.name" class="text-black border-none outline-0 bg-white p-4 rounded-md text-[14px] font-poppins_medium w-full h-[45px]" type="text" placeholder="Name"/>
                <textarea v-model="feedbackData.comment" class="text-black border-none outline-0 bg-white p-4 rounded-md text-[14px] font-poppins_medium w-full h-[170px]" type="text" placeholder="Message"/>
                <button type="submit" @click="handleSubmit" class="text-white mt-4 font-poppins_medium text-[14px] border-secondary bg-secondary rounded-md w-full h-[50px] cursor-pointer">
                    Confirm
                </button>
            </div>
        </div>
    </section>
</template>