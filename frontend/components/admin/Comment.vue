<script setup lang="ts">
    import { API } from '#imports';
    import { onMounted, ref } from '#imports';
    import Swal from 'sweetalert2';
    import cookie from 'js-cookie';
    import { Path } from '~/utils/Path';
    import deleteIcon from '~/public/icon/delete.svg';
    import guest from '~/public/profile/guest.jpg';
    import AOS from 'aos';
    import 'aos/dist/aos.css';

    interface commentDataProp {
        id: number,
        user: any,
        message: string,
        product: any,
    }

    const token = cookie.get('token');
    const commentData = ref<commentDataProp[]>([]);
    const commentMessage = ref();

    onMounted(() => {
        AOS.init();
        const fetchComment = async() => {
            try {
                const response = await API.get('/comment', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                commentData.value = response.data.comment;
            } catch (error) {
                console.error(error);
            }
        }

        fetchComment();
    });

    const handleMessageMore = (index: number) => {
        commentMessage.value = commentMessage.value === index ? null : index;
    }

    const handleDelete = async(id: number) => {
        try {
            Swal.fire({
                didOpen: () => {
                    Swal.showLoading()
                },
                title: 'Please Wait...',
                timer: 1000
            });

            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await API.delete(`/admin/comment/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            Swal.fire({
                title: response.data.message,
                text: 'You can be reload',
                icon: 'success',
                confirmButtonColor: 'green',
                confirmButtonText: 'success',
            });

            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error) {
            console.error(error);
        }
    }
</script>

<template>
    <section data-aos="fade-up" data-aos-duration="900">
        <div class="flex justify-start lg:gap-0 gap-6 lg:justify-between items-center">
            <h1 class="text-[24px] lg:text-[30px] font-poppins_semibold">User Comment</h1>
        </div>
        <div class="mt-8 flex justify-center lg:justify-start items-start gap-10 flex-wrap">
            <div class="" v-for="(comment, index) in commentData" :key="index">
                <div class="bg-white w-full lg:w-[280px] p-4 rounded-md">
                    <div class="flex items-center gap-4">
                        <img :src="comment.user.image ? `${Path}/account/${comment.user.image}` : guest" class="w-[50px] h-auto rounded-full" alt=""/>
                        <div>
                            <h1 class="text-[16px] font-poppins_medium">{{ comment.user.username }}</h1>
                            <p class="text-[12px] font-poppins_regular">{{ comment.user.email }}</p>
                        </div>
                    </div>
                    <div class="mt-4 flex flex-col gap-4">
                        <div class="flex flex-col gap-1">
                            <h1 class="text-[14px] text-primary font-poppins_medium">Product : </h1>
                            <p class="text-[14px] font-poppins_regular text-justify">{{ comment.product.name }}</p>
                        </div>
                        <div class="flex flex-col gap-1">
                            <h1 class="text-[14px] text-primary font-poppins_medium">Comment : </h1>
                            <p class="text-[12px] font-poppins_regular text-justify">{{ commentMessage === index ? comment.message : comment.message.slice(0, 100) + '...' }} <span @click="handleMessageMore(index)" class="text-primary underline italic cursor-pointer">More</span></p>
                        </div>
                        <div @click="handleDelete(comment.id)">
                            <img :src="deleteIcon" class="bg-red-500 p-1 w-[28px] rounded-md cursor-pointer h-auto" alt=""/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>