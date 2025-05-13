<script setup lang="ts">
    import facebook from '/home/navbar/facebook.png';
    import twitter from '/home/navbar/twitter.png';
    import instagram from '/home/navbar/instagram.png';
    import user from '/home/navbar/user.png';
    import order from '/home/navbar/order.png';
    import cancel from '/home/navbar/cancel.png';
    import logout from '/home/navbar/logout.png';
    import logo from '/logo/logo.png';
    import { ref, onMounted } from 'vue';
    import { API } from '#imports';
    import cookie from 'js-cookie';
    import { toast } from 'vue3-toastify';
    import Swal from 'sweetalert2';
    import chat from '~/public/icon/chat.svg';
    import { Path } from '~/utils/Path';

    const authNavbarValue = ref(false);
    const userProfile = ref(false);
    const token = cookie.get('token');
    const productName = ref('');
    const productValue = ref<productDataProp[]>([]);

    interface productDataProp {
        id: number,
        name: string,
        image: string,
        description: string,
        quantity: number,
        price: number,
        category_id: number,
        created_by: number,
        category: any,
        transactionCount: number,
    }

    const handleToggle = () => {
        userProfile.value = !userProfile.value;
    }

    const handleLogout = async() => {
        try {
            Swal.fire({
                didOpen: () => {
                    Swal.showLoading()
                },
                allowOutsideClick: false,
                title: "Please wait...",
                timer: 1000
            });

            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await API.post('/auth/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            cookie.remove('token');
            toast.success(response.data.message, {
                autoClose: 2000,
                theme: 'colored',
            });

            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error:any) {
            toast.error(error.response.data.message, {
                autoClose: 2000,
                theme: 'colored',
            });
        }
    }

    onMounted(() => {
        const authNavbar = async() => {
            if (token) {
                authNavbarValue.value = true;
            }
        }

        const fetchProduct = async() => {
            try {
                const response = await API.get(`/product?name=${productName.value}`);
                productValue.value = response.data.products.data;
            } catch (error) {
                console.error(error);
            }
        }

        watch(productName, async(value) => {
            if (value) {
                fetchProduct();
            } else {
                productValue.value = [];
            }
        });

        authNavbar();
    });
</script>

<template>
    <nav class="bg-white w-full h-[30vh] flex flex-col justify-center lg:px-8 px-4">
        <div class="flex justify-between items-center lg:px-12 px-0">
            <div class="flex items-center gap-4">
                <img class="w-[30px] h-auto" :src="facebook" alt=""/>
                <img class="w-[30px] h-auto" :src="twitter" alt=""/>
                <img class="w-[30px] h-auto" :src="instagram" alt=""/>
            </div>
            <p class="text-[16px] font-poppins_regular text-gray responsive">Customize the best items at the best price - Rp. 55.000</p>
            <p class="text-[16px] font-poppins_regular text-gray">Indonesia</p>
        </div>
        <hr class="w-full h-[1px] bg-[#D3D3D3] outline-none border-none my-6"/>
        <div class="flex justify-between items-center lg:px-12 px-0">
            <nuxt-link to="/" :class="token?.length ? '' : 'image'">
                <img :src="logo" class="lg:w-[100px] w-[50px] h-auto" alt=""/>
            </nuxt-link>
            <div class="relative">
                <input v-model="productName" class="lg:w-[860px] w-[220px] h-[40px] lg:h-[45px] outline-0 border-2 border-gray focus-within:border-black text-[12px] lg:text-[14px] font-poppins_regular px-3 rounded-md" type="text" placeholder="Enter your product name...">
                <div class="absolute p-4 pt-6 flex flex-col gap-5 w-full z-50 rounded-b-lg" :class="productValue.length > 0 ? 'bg-white' : 'bg-transparent'">
                    <div v-for="(products, index) in productValue" :key="index">
                        <nuxt-link :to="`/user/product/${products.id}`">
                            <div class="flex justify-start cursor-pointer items-center gap-2">
                                <img :src="`${Path}/image/${products.image}`" class="lg:w-[50px] w-[35px] h-auto" alt=""/>
                                <div class="font-poppins_regular">
                                    <h1 class="lg:text-[16px] text-[12px] font-poppins_medium">{{ products.name }}</h1>
                                    <p class="lg:text-[14px] text-[10px] text-gray">{{ products.category.name }}</p>
                                </div>
                            </div>
                        </nuxt-link>
                    </div>
                </div>
            </div>
            <div :class="authNavbarValue === false ? 'hidden' : 'flex'" class="flex justify-center items-center gap-5 lg:gap-6 relative">
                <div :class="userProfile == false ? 'opacity-0' : 'opacity-100'" class="bg-primary duration-200 absolute top-[18px] right-[10px] lg:top-[20px] lg:right-[10px] w-[200px] flex flex-col gap-4 justify-center items-start p-4 rounded-md min-h-[100px]">
                    <nuxt-link to="/user/profile">
                        <button class="flex justify-between items-center gap-2 cursor-pointer hover:translate-x-2 duration-200">
                            <img :src="user" alt="" class="w-[20px] h-auto"/>
                            <p class="text-white font-poppins_regular text-[13px]">Manage My Account</p>
                        </button>
                    </nuxt-link>
                    <nuxt-link to="/user/packed">
                        <button class="flex justify-between items-center gap-2 cursor-pointer hover:translate-x-2 duration-200">
                            <img :src="order" alt="" class="w-[20px] h-auto"/>
                            <p class="text-white font-poppins_regular text-[13px]">My Order</p>
                        </button>
                    </nuxt-link>
                    <nuxt-link to="/user/chat">
                        <button class="flex justify-between items-center gap-2 cursor-pointer hover:translate-x-2 duration-200">
                            <img :src="chat" alt="" class="w-[20px] h-auto"/>
                            <p class="text-white font-poppins_regular text-[13px]">Chat</p>
                        </button>
                    </nuxt-link>
                    <nuxt-link to="/user/cancel">
                        <button class="flex justify-between items-center gap-2 cursor-pointer hover:translate-x-2 duration-200">
                            <img :src="cancel" alt="" class="w-[20px] h-auto"/>
                            <p class="text-white font-poppins_regular text-[13px]">My Cancellations</p>
                        </button>
                    </nuxt-link>
                    <button @click="handleLogout" class="flex justify-between items-center gap-2 cursor-pointer hover:translate-x-2 duration-200">
                        <img :src="logout" alt="" class="w-[20px] h-auto"/>
                        <p class="text-white font-poppins_regular text-[13px]">Logout</p>
                    </button>
                </div>
                <button class="group" @click="handleToggle">
                    <svg class="lg:w-[30px] w-[24px] h-auto cursor-pointer" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" class="fill-black group-focus-within:fill-primary group-hover:fill-primary duration-150" clip-rule="evenodd" d="M13.8889 11.1111C13.8889 8.16426 15.0595 5.33811 17.1433 3.25437C19.227 1.17063 22.0532 0 25 0C27.9468 0 30.773 1.17063 32.8567 3.25437C34.9405 5.33811 36.1111 8.16426 36.1111 11.1111C36.1111 14.058 34.9405 16.8841 32.8567 18.9679C30.773 21.0516 27.9468 22.2222 25 22.2222C22.0532 22.2222 19.227 21.0516 17.1433 18.9679C15.0595 16.8841 13.8889 14.058 13.8889 11.1111ZM13.8889 27.7778C10.2053 27.7778 6.67263 29.2411 4.06796 31.8457C1.46329 34.4504 0 37.9831 0 41.6667C0 43.8768 0.877974 45.9964 2.44078 47.5592C4.00358 49.122 6.1232 50 8.33333 50H41.6667C43.8768 50 45.9964 49.122 47.5592 47.5592C49.122 45.9964 50 43.8768 50 41.6667C50 37.9831 48.5367 34.4504 45.932 31.8457C43.3274 29.2411 39.7947 27.7778 36.1111 27.7778H13.8889Z"/>
                    </svg>
                </button>
            </div>
            <div :class="authNavbarValue === false ? 'flex' : 'hidden'" class="flex justify-center items-center gap-6 relative">                
                <nuxt-link to="/auth/login">
                    <button class="text-white font-poppins_medium text-[12px] lg:text-[13px] border-2 border-primary hover:bg-transparent bg-primary rounded-md lg:rounded-full w-[80px] lg:w-[110px] h-[45px] duration-200 hover:text-primary cursor-pointer">
                        Sign In
                    </button>
                </nuxt-link>
            </div>
        </div>
        <hr class="w-full h-[1px] bg-[#D3D3D3] outline-none border-none mt-6"/>
    </nav>
</template>