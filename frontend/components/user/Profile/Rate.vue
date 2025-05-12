<script lang="ts" setup>
    import { API } from '#imports';
    import { onMounted, ref } from '#imports';
    import cookie from 'js-cookie';
    import RupiahFormat from '~/utils/RupiahFormat';
    import AOS from 'aos';
    import 'aos/dist/aos.css';
    import Swal from 'sweetalert2';
    import { useRoute, useRouter } from 'vue-router';
    import { Path } from '~/utils/Path';

    interface transactionDataProp {
        id: number,
        productId: number,
        product: {
            image: string,
            name: string,
            category: {
                name: string
            }
        },
        total: number,
        status: string,
        quantity: number,
        deliveredStatus1: string,        
        deliveredStatus2: string,        
        deliveredStatus3: string,        
        deliveredStatus4: string,        
    }

    interface UserProp {
        id: number
    }

    const transactionData = ref<transactionDataProp | null>(null);
    const token = cookie.get('token');   
    const route = useRoute();
    const navigate = useRouter();
    const userId = ref<UserProp | null>(null);
    const id = route.params.id;
    const productId = ref<transactionDataProp | null>(null);
    const commentData = ref({
        message: "",
    });

    onMounted(() => {
        AOS.init();
        const fetchArrivedUser = async() => {
            try {
                const response = await API.get(`/user/transaction/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                transactionData.value = response.data.transaction;
                productId.value = response.data.transaction.productId;
            } catch (error) {
                console.error(error);
            }
        }

        const fetchUser = async() => {
            try {
                const response = await API.get('/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                userId.value = response.data.user.id;
            } catch (error) {
                console.error(error);
            }
        }

        fetchUser();
        fetchArrivedUser();
    });

    const handleSubmit = async(e: { preventDefault: () => void; }) => {
        e.preventDefault();        
        try {
            const response = await API.post('/user/comment', {
                user_id: userId.value,
                message: commentData.value.message,
                product_id: productId.value
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            Swal.fire({
                title: response.data.message,
                text: "Thank you for your response",
                confirmButtonText: 'Success',
                confirmButtonColor: 'green',
                icon: 'success'
            });

            setTimeout(() => {
                navigate.push('/user/arrived');
            }, 3000);
        } catch (error: any) {
            Swal.fire({
                title: error.response.data.message,
                confirmButtonText: 'Error',
                confirmButtonColor: 'red',
                icon: 'error'
            });
        }
    }
</script>

<template>
    <section data-aos="fade-up" data-aos-duration="900">
        <h1 class=" text-[22px] lg:text-[30px] font-poppins_semibold">Rate the Product</h1>
        <div class="mt-8 flex flex-col gap-8">
            <div class="">
                <div class="border-2 flex lg:flex-row flex-col justify-between p-5 w-full lg:w-[90%] border-primary rounded-xl" data-aos="fade-up" data-aos-duration="900">
                    <div class="flex lg:flex-row flex-col justify-start items-center gap-2">
                        <img class="lg:w-[110px] w-[120px] h-auto" :src="`${Path}/image/${transactionData?.product.image}`" alt=""/>
                        <div class="flex flex-col w-full lg:gap-1 gap-2">
                            <h1 class="text-[18px] font-poppins_medium">{{ transactionData?.product.name }}</h1>
                            <p class="text-[14px] text-gray font-poppins_regular">{{ transactionData?.product.category.name }}</p>
                            <p class="text-[18px] font-poppins_medium text-secondary">{{ RupiahFormat(transactionData?.total ?? 0) }}</p>
                            <p class="text-[12px] text-gray font-poppins_regular">Currently packed, expected to arrive in 3-4 days</p>
                        </div>
                    </div>
                    <div class="flex flex-col lg:mt-0 mt-4 justify-end items-start lg:items-end">
                        <p class="text-[14px] text-gray font-poppins_regular">{{ `Total ${transactionData?.quantity} product: ${RupiahFormat(transactionData?.total ?? 0)}` }}</p>
                    </div>
                </div>
            </div>
        </div>
        <form @submit="handleSubmit" class="mt-8 w-full lg:w-[60%]" data-aos="fade-up" data-aos-duration="900">
            <p class="text-[18px] font-poppins_medium">Message : </p>
            <div class="flex flex-col gap-3 mt-4">
                <textarea v-model="commentData.message" required class="border-2 text-[14px] p-4 font-poppins_regular border-black rounded-md h-[160px]" placeholder="Your Comment"></textarea>
                <button type="submit" class="text-[14px] font-poppins_medium border-2 border-primary hover:bg-transparent hover:text-primary duration-150 px-8 py-2 rounded-lg bg-primary text-white cursor-pointer w-fit mt-4">Send</button>
            </div>
        </form>
    </section>
</template>