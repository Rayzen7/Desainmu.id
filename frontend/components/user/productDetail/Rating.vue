<script setup lang="ts">
    import stars from '~/public/product/stars.png';
    import guest from '~/public/profile/guest.jpg';
    import share from '~/public/home/product/share.png';
    import { onMounted, ref, watch } from 'vue';
    import cookie from 'js-cookie';
    import { API } from '#imports';
    import { useRoute, useRouter } from 'vue-router';
    import Swal from 'sweetalert2';
    import menu from '~/public/icon/kebab.svg';
    import { Path } from '~/utils/Path';

    interface commentDataProp {
        id: number,
        message: string,
        user: {
            image: string,
            username: string,
        },
        updatedAt: any,
        userId: any,
    }

    const token = cookie.get('token');
    const route = useRoute();
    const router = useRouter();
    const id = route.params.id;
    const commentData = ref<commentDataProp[]>([]);
    const commentCount = ref(null);
    const meId = ref(0);
    const commentId = ref(route.query.comment || '');
    const commentDetail = ref<commentDataProp | null>(null);

    watch(() => route.query.comment, async (newVal) => {
        commentId.value = newVal || '';
        if (commentId.value) {
            try {
                const response = await API.get(`/comment/${commentId.value}`);
                commentDetail.value = response.data.comment;
            } catch (error) {
                console.error('Failed to fetch comment detail:', error);
            }
        }
    });

    onMounted(() => {
        const fetchComment = async () => {
            try {
                const response = await API.get(`/comment?product=${id}`);
                commentData.value = response.data.comment;
                commentCount.value = response.data.commentCount;
            } catch (error) {
                console.error(error);
            }
        };

        const fetchMe = async () => {
            try {
                const response = await API.get('/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                meId.value = response.data.user.id;
            } catch (error) {
                console.error(error);
            }
        };

        fetchMe();
        fetchComment();
    });

    const handleShare = async (message: string) => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Check Out These Product Comments!',
                    text: message,
                    url: window.location.href,
                });
            } catch (error) {
                console.error('Share Failed:', error);
            }
        } else {
            Swal.fire({
                text: 'The sharing feature is not supported in this browser.',
                icon: 'error',
                confirmButtonColor: 'red',
                confirmButtonText: 'Oke',
            });
        }
    };

    const handleCommentDetail = async () => {
        if (!meId.value) {
            Swal.fire({
                title: 'Failed!',
                text: 'Please Login!',
                icon: 'error',
                confirmButtonColor: 'red',
            }).then((result) => {
                if (result.isConfirmed) {
                    router.push('/auth/login');
                }
            });
            return;
        }

        setTimeout(() => {
            Swal.fire({
                title: "Action this Comment?",
                text: commentDetail.value?.message.slice(0, 40) + '...',
                icon: 'question',
                confirmButtonColor: 'green',
                confirmButtonText: 'Copy',
                denyButtonColor: 'red',
                denyButtonText: 'Delete',
                showDenyButton: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    navigator.clipboard.writeText(commentDetail.value?.message || '')
                        .then(() => {
                            Swal.fire({
                                title: 'Copied!',
                                text: 'Comment has been copied to clipboard.',
                                icon: 'success',
                                confirmButtonColor: 'green',
                            });
                        })
                        .catch(() => {
                            Swal.fire({
                                title: 'Failed!',
                                text: 'Could not copy the text.',
                                icon: 'error',
                                confirmButtonColor: 'red',
                            });
                        });
                    return;
                }
            
                if (result.isDenied) {
                    if (commentDetail.value?.userId !== meId.value) {
                        Swal.fire({
                            title: 'Failed!',
                            text: 'This not Your Comment',
                            icon: 'error',
                            confirmButtonColor: 'red',
                        });
                        return;
                    }
                
                    try {
                        const response = await API.delete(`/user/comment/${commentId.value}`, {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        });
                    
                        Swal.fire({
                            title: response.data.message,
                            text: 'Your comment success deleted',
                            icon: 'success',
                            confirmButtonColor: 'green',
                        });
                    
                        setTimeout(() => {
                            window.location.reload();
                        }, 3000);
                    } catch (error) {
                        console.error(error);
                    }
                }
            });
        }, 1000);
    };

    const handleMenuClick = async (id: number) => {
        commentId.value = id.toString();
        await router.push({ query: { ...route.query, comment: commentId.value } });
        handleCommentDetail();
    };
</script>

<template>
    <section class="mt-24 lg:px-24 px-8">
        <h1 class="text-center font-poppins_semibold text-[26px] lg:text-[34px]">Product Ratings</h1>
        <div class="lg:mt-12 mt-8" v-if="commentData.length > 0">
            <hr class="bg-gray outline-0 border-none h-[2px] opacity-50 w-full"/>
            <div class="flex flex-col gap-2 my-6 lg:my-10 mx-8">
                <div class="flex items-center gap-8">
                    <h1 class="lg:text-[50px] text-[36px] font-poppins_semibold">5.0</h1>
                    <img class="lg:w-[220px] w-[140px] -mt-1 h-auto" :src="stars" alt=""/>
                </div>
                <p class="lg:text-[24px] text-[18px] font-poppins_regular">{{ commentCount }} Review</p>
            </div>
            <hr class="bg-gray outline-0 border-none h-[2px] opacity-50 w-full"/>
        </div>
        <div class="flex flex-col" v-if="commentData.length > 0">
            <div class="" v-for="(comment, index) in commentData" :key="index">
                <div class="">
                    <div class="mx-8 my-8 flex justify-between items-start">
                        <div class="flex lg:flex-row flex-col items-start gap-6">
                            <img :src="comment.user.image === null ? `${guest}` : `${Path}/account/${comment.user.image}`" class="lg:w-[50px] w-[40px] rounded-full h-auto" alt=""/>
                            <div class="flex flex-col gap-2">
                                <h1 class="text-[18px] font-poppins_medium">{{ comment.user.username }}</h1>
                                <img class="lg:w-[100px] w-[80px] h-auto" :src="stars" alt=""/>
                                <p class="lg:text-[14px] text-[12px] w-full lg:w-[850px] font-poppins_regular mt-2 text-justify">{{ comment.message }}</p>
                                <div class="flex items-center gap-2 mt-3 cursor-pointer" @click="handleShare(comment.message)">
                                    <img class="w-[20px] h-auto" :src="share" alt=""/>
                                    <p class="text-[12px] lg:text-[14px] font-poppins_regular">Share</p>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-3">
                            <p class="text-[14px] image font-poppins_regular text-gray">{{ comment.updatedAt.slice(0, 10) }}</p>
                            <img @click="handleMenuClick(comment.id)" :src="menu" alt="" class="w-[4px] cursor-pointer h-auto" />
                        </div>
                    </div>
                    <hr class="bg-gray outline-0 border-none h-[2px] opacity-20 w-full"/>
                </div>
            </div>
        </div>
        <div class="mt-12 text-center font-poppins_medium text-[20px] lg:text-[24px] text-gray" v-else>
            <h1>No Preview yet</h1>
        </div>
    </section>
</template>
