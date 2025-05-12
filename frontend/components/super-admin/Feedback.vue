<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { API } from '#imports';
    import cookie from 'js-cookie';
    import AOS from 'aos';
    import 'aos/dist/aos.css';
    
    interface feedbackProp {
        name: string,
        comment: string,
    }

    const token = cookie.get('token');
    const feedbackData = ref<feedbackProp[]>([]);

    onMounted(() => {
        AOS.init();
        const fetchFeedback = async() => {
            try {
                const response = await API.get('/super/feedback', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                feedbackData.value = response.data.feedback;
            } catch (error) {
                console.error(error);
            }
        }

        fetchFeedback();
    });
</script>

<template>
    <section data-aos="fade-up" data-aos-duration="900">
        <div class="flex justify-start lg:gap-0 gap-6 lg:justify-between items-center">
            <h1 class="text-[24px] lg:text-[30px] font-poppins_semibold">Feedback</h1>
        </div>
        <div class="mt-8 flex justify-start items-center gap-10 flex-wrap">
            <div class="" v-for="(feedback, index) in feedbackData" :key="index">
                <div class="bg-white p-8 rounded-md flex flex-col gap-3 lg:w-[360px] w-full">
                    <h1 class="lg:text-[18px] text-[16px] font-poppins_medium text-primary">From : <span class="text-black">{{ feedback.name }}</span></h1>
                    <p class="lg:text-[14px] text-[12px] font-poppins_regular text-justify">Message : {{ feedback.comment }}</p>
                </div>
            </div>
        </div>
    </section>
</template>