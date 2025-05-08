<script setup lang="ts">
    import { API } from '#imports';
    import { useRouter, useRoute } from 'vue-router';
    import { onMounted, ref } from '#imports';
    import RupiahFormat from '~/utils/RupiahFormat';
    import stars from '~/public/product/stars.png'
    import delivery from '~/public/product/delivery.png'
    import returns from '~/public/product/return.png'
    import Swal from 'sweetalert2';
    import cookie from 'js-cookie';

    interface productDataProp {
        id: number,
        name: string,
        image: string,
        description: string,
        quantity: number,
        price: number,
        address: string,
        category_id: number,
        created_by: number,
        category: any,
        transactionCount: number,
        commentCount: number,
    }

    interface meDataProp {
        address: string,
        id: number,
    }

    const route = useRoute();
    const id = route.params.id;
    const productData = ref<productDataProp | null>(null);
    const meData = ref<meDataProp | null>(null);
    const quantityCount = ref(1);
    const token = cookie.get('token');
    const receiver = ref(0);
    const navigate = useRouter();

    const handleQuantityPlus = () => {
        const quantityMax = productData.value?.quantity ?? 0;
        if (quantityCount.value >= quantityMax) {
            Swal.fire({
                title: 'Quantity has been exceeded',
                text: 'Please buy according to available stock',
                icon: 'warning',
                confirmButtonText: 'Oke',
                confirmButtonColor: 'orange',
            });
        } else {
            quantityCount.value = quantityCount.value + 1;
        }
    }

    const handleQuantityMin = () => {
        if (quantityCount.value === 0) {
            quantityCount.value = 0;
        } else {
            quantityCount.value = quantityCount.value - 1;
        }
    }

    onMounted(() => {
        const fetchById = async() => {
            try {
                const response = await API.get(`/product/${id}`);
                productData.value = response.data.product;
                receiver.value = response.data.product.user.id;
            } catch (error) {
                console.error(error);
            }
        }

        const fetchMe = async() => {
            try {
                const response = await API.get('/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }                    
                });

                meData.value = response.data.user;
            } catch (error) {
                console.error(error);
            }
        }

        fetchMe();
        fetchById();
    });

    const handleBuy = async() => {
        if (!token) {
            Swal.fire({
                title: "You can't purchase the product!",
                text: 'Please login before make a transaction',
                confirmButtonText: 'Login',
                'icon': 'error',
                confirmButtonColor: 'red'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate.push('/auth/login');
                }
            });
            return;
        }

        if (quantityCount.value === 0) {
            Swal.fire({
                title: "You can't purchase the product!",
                text: 'Please input your quantity on this product',
                confirmButtonText: 'Oke',
                'icon': 'error',
                confirmButtonColor: 'red'
            });
            return;
        }

        if (!meData.value?.address) {
            Swal.fire({
                title: "You can't purchase the product!",
                text: 'Please add your address on your user profile',
                confirmButtonText: 'Add',
                'icon': 'error',
                confirmButtonColor: 'red'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate.push('/');
                }
            });
            return;
        }

        try {
            const productPrice = productData.value?.price ?? 0;
            const productQuatity = productData.value?.quantity ?? 0;
                   
            const quantityUpdate = productQuatity - quantityCount.value;
            const total = quantityCount.value * productPrice;

            Swal.fire({
                title: 'Purchase',
                text: `Are you serious purchase the ${productData.value?.name} Product with ${quantityCount.value} quantity and total Rp. ${total}?`,
                showCancelButton: true,                
                confirmButtonColor: 'orange',
                confirmButtonText: 'buy',
                cancelButtonColor: 'red',
                icon: 'question',
            }).then(async(result) => {
                if (result.isConfirmed) {
                    Swal.fire({
                        didOpen: () => {
                            Swal.isLoading();
                        },
                        title: "Please wait...",
                        timer: 1000,
                    });
                
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    const response = await API.post('/user/transaction', {
                        product_id: id,
                        quantity: quantityCount.value,
                        total: total,
                        status: 'packed'
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });                    
                
                    await API.put(`user/product/${id}`, {
                        quantity: quantityUpdate
                    }, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    const { snapToken } = response.data;
                    window.snap.pay(snapToken, {
                        onSuccess: function (result: any) {
                            Swal.fire({
                                title: response.data.message,
                                text: 'You payment success',
                                confirmButtonColor: 'green',
                                confirmButtonText: 'success',
                            });
                        },
                        onPending: function (result: any) {
                            Swal.fire({
                                title: 'Pending',
                                text: 'Please complete the payment.',
                                icon: 'info',
                                confirmButtonColor: 'blue'
                            });
                        },
                        onError: function (result: any) {
                            Swal.fire({
                                title: 'Error',
                                text: 'Payment failed. Please try again.',
                                icon: 'error',
                                confirmButtonColor: 'red'
                            });
                        },
                        onClose: function () {
                            Swal.fire({
                                title: 'Cancelled',
                                text: 'Payment popup closed.',
                                icon: 'warning',
                                confirmButtonColor: 'orange'
                            });
                        }
                    });                                                    
                }
            });
        } catch (error: any) {
            Swal.fire({
                title: error,
                text: 'Please input your transaction correctly',
                confirmButtonColor: 'red',
                confirmButtonText: 'error',
                icon: 'error'
            });
        }
    }

    const handleChat = async() => {
        if (!meData.value?.id) {
            Swal.fire({
                title: "You not Login yet",
                text: "Please Login!",
                confirmButtonColor: 'red',
                confirmButtonText: 'Login',
                icon: 'error',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate.push('/auth/login');
                }
            });
            return;
        }

        try {
            const response = await API.post('/room/chat', {
                sender: meData.value?.id,
                receiver: receiver.value
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const chatData = response.data.roomChat;
            navigate.push(`/user/chat?user=${chatData.receiver}&room=${chatData.id}`);
        } catch (error) {
            navigate.push('/user/chat');
            console.error(error);
        }
    }
</script>

<template>
    <section class="mx-8 mt-4">
        <div class="flex justify-center gap-20 items-center lg:flex-row flex-col">
            <div class="lg:w-[500px] w-[300px] lg:mx-0 mx-auto">
                <img :src="`http://localhost:3333/image/${productData?.image}`" class="lg:w-[500px] lg:mx-0 mx-auto w-[200px] h-auto" alt=""/>
                <div class="flex items-center gap-4 lg:mt-0 mt-10">
                    <img :src="`http://localhost:3333/image/${productData?.image}`" class="lg:w-[166px] w-[90px] h-auto" alt=""/>
                    <img :src="`http://localhost:3333/image/${productData?.image}`" class="lg:w-[166px] w-[90px] h-auto" alt=""/>
                    <img :src="`http://localhost:3333/image/${productData?.image}`" class="lg:w-[166px] w-[90px] h-auto" alt=""/>
                </div>
            </div>
            <div class="lg:w-[600px] w-[300px] lg:mx-0 mx-auto flex flex-col gap-6">
                <div class="flex flex-col gap-2">
                    <p class="text-secondary text-[14px] lg:text-[16px] font-poppins_medium">Personal Accesories</p>
                    <h1 class="text-black lg:text-[28px] text-[22px] font-poppins_semibold">{{ productData?.name }}</h1>
                    <p class="font-poppins_regular text-[12px] lg:text-[14px] text-gray">Quantity: {{ productData?.quantity }}</p>
                    <p class="text-primary font-poppins_semibold text-[18px] lg:text-[24px]">{{ RupiahFormat(productData?.price ?? 0) }}</p>
                    <div class="flex items-center gap-4">
                        <img :src="stars" alt="" class="lg:w-[90px] h-auto w-[70px]"/>
                        <p class="lg:text-[14px] text-[12px] text-gray font-poppins_regular underline">{{ productData?.commentCount == 0 ? 'No preview yet' : `${productData?.commentCount} Preview` }}</p>
                    </div>
                    <p class="lg:text-[14px] text-[12px] text-justify font-poppins_regular">{{ productData?.description }}</p>
                </div>
                <div class="flex gap-8 items-center">
                    <p class="lg:text-[20px] text-[18px] font-poppins_medium">Quantity</p>
                    <div class="flex gap-2 text-[16px] lg:text-[18px] items-center font-poppins_regular py-2 bg-white border-1 justify-around rounded-md w-[160px] border-gray">
                        <p @click="handleQuantityMin" class="cursor-pointer">-</p>
                        <p>{{ quantityCount }}</p>
                        <p @click="handleQuantityPlus" class="cursor-pointer">+</p>
                    </div>
                </div>
                <div class="flex flex-col gap-4 mt-8">
                    <button @click="handleChat" class="h-[50px] w-full bg-secondary font-poppins_medium text-white text-[14px] rounded-xl cursor-pointer hover:bg-transparent hover:text-secondary border-2 border-secondary duration-150">Chat Now</button>
                    <button @click="handleBuy" class="h-[50px] w-full bg-primary font-poppins_medium text-white text-[14px] rounded-xl cursor-pointer hover:bg-transparent hover:text-primary border-2 border-primary duration-150">Buy Now</button>
                </div>
                <div class="flex flex-col gap-6 border-1 my-2 border-gray w-[300px] lg:mx-0 mx-auto lg:w-[400px] rounded-md p-4">
                    <div class="flex gap-4 items-center">
                        <img :src="delivery" alt="" class="lg:w-[50px] w-[35px] h-auto"/>
                        <div class="flex flex-col gap-1">
                            <p class=" font-poppins_medium text-[16px] lg:text-[18px]">Free Delivery</p>
                            <p class="text-[10px] lg:text-[12px] font-poppins_regular underline">Enter your postal code for Delivery Availability</p>
                        </div>
                    </div>
                    <div class="flex gap-4 items-center">
                        <img :src="returns" alt="" class="lg:w-[50px] w-[35px] h-auto"/>
                        <div class="flex flex-col gap-1">
                            <p class=" font-poppins_medium text-[16px] lg:text-[18px]">Return Delivery</p>
                            <p class="text-[10px] lg:text-[12px] font-poppins_regular underline">Free 30 Days Delivery Returns. Details</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>