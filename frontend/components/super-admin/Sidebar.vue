<script setup lang="ts">
    import particle1 from '~/public/sidebar/1.png';
    import particle2 from '~/public/sidebar/2.png';
    import particle3 from '~/public/sidebar/3.png';
    import guest from '~/public/profile/guest.jpg';
    import cookie from 'js-cookie';
    import { onMounted, ref } from 'vue';
    import { useRouter, useRoute } from 'vue-router';
    import clip from '~/public/icon/clip-side.svg';
    import logout from '~/public/icon/logout.png'
    import Swal from 'sweetalert2';
    import { API } from '#imports';
    import list from '~/public/icon/list.svg';
    import { Path } from '~/utils/Path';

    interface meDataProp {
        username: string,
        image: string
        email: string,
        no_hp: number,
        date_of_birth: string,
        address: string,
        gender: string,
        role: any,
    }

    const meData = ref<meDataProp | null>(null);
    const token = cookie.get('token');
    const navigate = useRouter();
    const route = useRoute();
    const path = route.path;
    const dashboardPath = '/super';
    const productList = '/super/product';
    const chatPath = '/super/chat';
    const feedbackPath = '/super/feedback';
    const profilePath = '/super/profile';
    const categoryPath = '/super/category';
    const isClose = ref(true);
    const checkScreenSize = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches
      isClose.value = isMobile;
    }

    onUnmounted(() => {
      window.removeEventListener('resize', checkScreenSize)
    })

    onMounted(() => {
        if (!token) {
            navigate.push('/');
        }

        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)

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
    });

    const handleLogout = async() => {
        try {            
            Swal.fire({
                didOpen: () => {
                    Swal.showLoading();
                },
                title: "Please Wait...",
                timer: 1000
            });
            
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await API.post('/auth/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            cookie.remove('token');
            Swal.fire({
                icon: 'success',
                title: response.data.message,
                text: "You can be redirect to Home Page",
                confirmButtonText: "Success",
                confirmButtonColor: 'green'
            });

            setTimeout(() => {
                navigate.push('/');
            }, 3000);
        } catch (error: any) {
            Swal.fire({
                icon: 'error',
                title: error.response.data.message,
                confirmButtonText: "Error",
                confirmButtonColor: 'red'
            });
        }
    }

    const handleClose = () => {
        isClose.value = true;
    }

    const handleOpen = () => {
        isClose.value = false;
    }
</script>

<template>
    <img :src="list" @click="handleOpen" class="absolute image-reverse right-10 w-[50px] hover:py-5 duration-200 p-3 py-4 rounded-b-md h-auto bg-primary z-10" alt=""/>
    <aside :class="isClose === false ? 'translate-0' : '-translate-x-[300%]'" class="lg:w-[18vw] w-full duration-1000 overflow-hidden lg:z-0 z-10 fixed bg-[#1994FF] h-screen text-white">
        <svg @click="handleClose" xmlns="http://www.w3.org/2000/svg" class="fill-white z-50 m-6 w-[30px] right-0 absolute image-reverse h-auto" viewBox="0 0 24 24"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"/></svg>
        <div class="w-full absolute h-[100vh] overflow-hidden">
            <img class="w-[160px] h-auto" :src="particle1" alt=""/>
            <img class="w-[160px] float-end translate-x-2 h-auto" :src="particle2" alt=""/>
            <img class="w-[160px] h-auto" :src="particle3" alt=""/>
        </div>
        <div class="relative z-20 py-14 lg:py-10 flex flex-col justify-between h-screen">
            <nuxt-link to="/super">
                <div class="flex justify-start lg:ml-0 ml-8 lg:justify-center items-center gap-5 lg:gap-3 px-2">
                    <img :class="meData?.image == null ? 'lg:w-[40px] w-[50px]' : 'lg:w-[50px] w-[60px]'" :src="meData?.image == null ? guest : `${Path}/account/${meData?.image}`" class="h-auto rounded-full" alt=""/>
                    <div class="">
                        <h1 class="lg:text-[16px] text-[20px] font-poppins_medium">{{ meData?.username }}</h1>
                        <p class="text-[14px] lg:pt-0 pt-1 font-poppins_regular">{{ meData?.email.slice(0, 13) + '...' }}</p>
                    </div>
                </div>
            </nuxt-link>
            <div class="flex flex-col gap-2 ml-8">
                <nuxt-link to="/super">
                    <div class="flex justify-start cursor-pointer items-center pl-6 p-4 py-4 rounded-l-full gap-4" :class="path === dashboardPath ? 'bg-white' : 'bg-transparent'">
                        <div class="">
                            <svg class="w-[24px] h-auto" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path :class="path === dashboardPath ? 'fill-white stroke-primary' : 'fill-primary stroke-white'" d="M13 3.1875C13.2683 3.1875 13.5302 3.26388 13.7559 3.40625L13.8496 3.4707L21.4336 9.1582C21.5655 9.25717 21.6787 9.37835 21.7686 9.51562L21.8506 9.6582C21.9489 9.85488 22 10.0721 22 10.292V20.583C22 20.9587 21.8506 21.3193 21.585 21.585C21.3193 21.8506 20.9587 22 20.583 22H16.3584C16.2413 22 16.1287 21.9538 16.0459 21.8711C15.9631 21.7883 15.9171 21.6756 15.917 21.5586V16.25C15.917 15.573 15.6812 14.9204 15.2559 14.4014L15.0625 14.1875C14.5155 13.6405 13.7735 13.333 13 13.333C12.2265 13.333 11.4845 13.6405 10.9375 14.1875C10.3905 14.7345 10.083 15.4765 10.083 16.25V21.5586C10.083 21.6465 10.0569 21.7317 10.0088 21.8037L9.9541 21.8711C9.87129 21.9538 9.75866 22 9.6416 22H5.41699C5.08806 22 4.77071 21.8855 4.51855 21.6787L4.41504 21.585C4.14936 21.3193 4 20.9587 4 20.583V10.292L4.00977 10.1279C4.02242 10.0192 4.04771 9.91246 4.08496 9.80957L4.14941 9.6582C4.22319 9.51065 4.32238 9.37767 4.44141 9.26465L4.56641 9.1582L12.1504 3.4707C12.3956 3.28694 12.6936 3.1875 13 3.1875Z" stroke="#FEFEFE" stroke-width="2.4"/>
                            </svg>
                        </div>
                        <p class=" font-poppins_semibold text-[14px]" :class="path === dashboardPath ? 'text-primary' : 'text-white'">Dashboard</p>
                        <img :src="clip" class="absolute image w-[27px] mt-[9px] translate-x-1 right-0 h-auto" v-if="path === dashboardPath" alt=""/>
                    </div>
                </nuxt-link>
                <nuxt-link to="/super/product">
                    <div class="flex justify-start cursor-pointer items-center pl-6 p-4 py-4 rounded-l-full gap-4" :class="path === productList ? 'bg-white' : 'bg-transparent'">
                        <div class="">
                            <svg class="w-[24px] h-auto" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_227_586)">
                                <path :class="path === productList ? 'fill-primary' : 'fill-white'" d="M14 13.6243V26.1902L13.125 26.6095L1.75 21.1717V7.54446L13.125 2.09357L24.5 7.54446V17.2932H22.75V9.43131L14 13.6243ZM13.125 3.98041L9.83008 5.55279L18.3203 9.66716L21.6699 8.06858L13.125 3.98041ZM12.25 24.3164V13.6243L3.5 9.43131V20.1234L12.25 24.3164ZM4.58008 8.06858L13.125 12.1568L16.3789 10.6106L7.875 6.49621L4.58008 8.06858ZM19.25 24.002V22.3248H28V24.002H19.25ZM19.25 18.9704H28V20.6476H19.25V18.9704ZM15.75 27.3564V25.6792H17.5V27.3564H15.75ZM15.75 20.6476V18.9704H17.5V20.6476H15.75ZM15.75 24.002V22.3248H17.5V24.002H15.75ZM19.25 27.3564V25.6792H28V27.3564H19.25Z"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_227_586">
                                <rect width="28" height="26.8352" fill="white" transform="translate(0 0.521179)"/>
                                </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <p class=" font-poppins_semibold text-[14px]" :class="path === productList ? 'text-primary' : 'text-white'">Product List</p>
                        <img :src="clip" class="absolute image w-[27px] mt-[9px] translate-x-1 right-0 h-auto" v-if="path === productList" alt=""/>
                    </div>
                </nuxt-link>
                <nuxt-link to="/super/chat">
                    <div class="flex justify-start cursor-pointer items-center pl-6 p-4 py-4 rounded-l-full gap-4" :class="path === chatPath ? 'bg-white' : 'bg-transparent'">
                        <div class="">
                            <svg class="w-[24px] h-auto" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path :class="path === chatPath ? 'fill-primary stroke-white' : 'fill-white stroke-primary'" d="M7.77448 10.2575H18.2307M7.77448 15.7425H15.2313M13.0026 25C15.6094 24.9994 18.1451 24.15 20.2262 22.5803C22.3073 21.0105 23.8207 18.8058 24.5375 16.2995C25.2542 13.7932 25.1354 11.1217 24.1989 8.68895C23.2624 6.25621 21.5592 4.19458 19.3469 2.81584C17.1346 1.43711 14.5334 0.816261 11.9369 1.04719C9.34041 1.27813 6.8897 2.34828 4.95543 4.09581C3.02117 5.84334 1.70855 8.17319 1.21609 10.733C0.723633 13.2929 1.07812 15.9434 2.22595 18.2839C2.36605 18.5693 2.41276 18.891 2.34141 19.1998L1.28281 23.787C1.25297 23.9157 1.25639 24.05 1.29276 24.177C1.32913 24.304 1.39724 24.4197 1.49068 24.5132C1.58413 24.6066 1.69982 24.6747 1.82687 24.7111C1.95392 24.7475 2.08813 24.7509 2.21687 24.7211L6.80281 23.6612C7.11244 23.5934 7.43598 23.6346 7.7187 23.7779C9.36288 24.5854 11.1709 25.0035 13.0026 25Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <p class=" font-poppins_semibold text-[14px]" :class="path === chatPath ? 'text-primary' : 'text-white'">Chat</p>
                        <img :src="clip" class="absolute image w-[27px] mt-[9px] translate-x-1 right-0 h-auto" v-if="path === chatPath" alt=""/>
                    </div>
                </nuxt-link>
                <nuxt-link to="/super/category">
                    <div class="flex justify-start cursor-pointer items-center pl-6 p-4 py-4 rounded-l-full gap-4" :class="path === categoryPath ? 'bg-white' : 'bg-transparent'">
                        <div class="">
                            <svg xmlns="http://www.w3.org/2000/svg" :class="path === categoryPath ? 'fill-primary stroke-white' : 'fill-white stroke-primary'" class="w-[24px] h-auto" viewBox="0 0 24 24"><path d="M4 11h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm10 0h6a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zM4 21h6a1 1 0 0 0 1-1v-6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1zm13 0c2.206 0 4-1.794 4-4s-1.794-4-4-4-4 1.794-4 4 1.794 4 4 4z"/></svg>
                        </div>
                        <p class=" font-poppins_semibold text-[14px]" :class="path === categoryPath ? 'text-primary' : 'text-white'">Category</p>
                        <img :src="clip" class="absolute image w-[27px] mt-[9px] translate-x-1 right-0 h-auto" v-if="path === categoryPath" alt=""/>
                    </div>
                </nuxt-link>
                <nuxt-link to="/super/feedback">
                    <div class="flex justify-start cursor-pointer items-center pl-6 p-4 py-4 rounded-l-full gap-4" :class="path === feedbackPath ? 'bg-white' : 'bg-transparent'">
                        <div class="">
                            <svg :class="path === feedbackPath ? 'fill-primary' : 'fill-white'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20 2H4c-1.103 0-2 .894-2 1.992v12.017C2 17.106 2.897 18 4 18h3v4l6.351-4H20c1.103 0 2-.894 2-1.992V3.992A1.998 1.998 0 0 0 20 2zm-9 8a2 2 0 1 1-2-2c.086 0 .167.015.25.025.082-.014.164-.025.25-.025A1.5 1.5 0 0 1 11 9.5c0 .086-.012.168-.025.25.01.083.025.165.025.25zm4 2a2 2 0 0 1-2-2c0-.086.015-.167.025-.25A1.592 1.592 0 0 1 13 9.5 1.5 1.5 0 0 1 14.5 8c.086 0 .168.011.25.025.083-.01.164-.025.25-.025a2 2 0 0 1 0 4z"/></svg> 
                        </div>
                        <p class=" font-poppins_semibold text-[14px]" :class="path === feedbackPath ? 'text-primary' : 'text-white'">Feedback</p>
                        <img :src="clip" class="absolute image w-[27px] mt-[9px] translate-x-1 right-0 h-auto" v-if="path === feedbackPath" alt=""/>
                    </div>
                </nuxt-link>
                <nuxt-link to="/super/profile">
                    <div class="flex justify-start cursor-pointer items-center pl-6 p-4 py-4 rounded-l-full gap-4" :class="path === profilePath ? 'bg-white' : 'bg-transparent'">
                        <div class="">
                            <svg class="w-[20px] h-auto" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path :class="path === profilePath ? 'fill-primary' : 'fill-white'" fill-rule="evenodd" clip-rule="evenodd" d="M16.3635 8.72719C16.3635 9.8845 15.9038 10.9944 15.0854 11.8127C14.2671 12.6311 13.1572 13.0908 11.9999 13.0908C10.8426 13.0908 9.73265 12.6311 8.91431 11.8127C8.09597 10.9944 7.63623 9.8845 7.63623 8.72719C7.63623 7.56988 8.09597 6.45998 8.91431 5.64164C9.73265 4.82329 10.8426 4.36356 11.9999 4.36356C13.1572 4.36356 14.2671 4.82329 15.0854 5.64164C15.9038 6.45998 16.3635 7.56988 16.3635 8.72719ZM14.1817 8.72719C14.1817 9.30585 13.9518 9.8608 13.5426 10.27C13.1335 10.6791 12.5785 10.909 11.9999 10.909C11.4212 10.909 10.8663 10.6791 10.4571 10.27C10.0479 9.8608 9.81805 9.30585 9.81805 8.72719C9.81805 8.14854 10.0479 7.59358 10.4571 7.18441C10.8663 6.77524 11.4212 6.54537 11.9999 6.54537C12.5785 6.54537 13.1335 6.77524 13.5426 7.18441C13.9518 7.59358 14.1817 8.14854 14.1817 8.72719Z"/>
                                <path :class="path === profilePath ? 'fill-primary' : 'fill-white'" fill-rule="evenodd" clip-rule="evenodd" d="M12 0C5.37273 0 0 5.37273 0 12C0 18.6273 5.37273 24 12 24C18.6273 24 24 18.6273 24 12C24 5.37273 18.6273 0 12 0ZM2.18182 12C2.18182 14.28 2.95964 16.3789 4.26327 18.0458C5.17903 16.8438 6.36017 15.8696 7.71452 15.1993C9.06886 14.5291 10.5598 14.1808 12.0709 14.1818C13.5626 14.1801 15.035 14.519 16.3758 15.1728C17.7166 15.8265 18.8904 16.7779 19.8076 17.9542C20.7529 16.7145 21.3893 15.2675 21.6642 13.733C21.9392 12.1985 21.8448 10.6206 21.3889 9.1298C20.933 7.63902 20.1286 6.27823 19.0423 5.16004C17.9561 4.04185 16.6192 3.19839 15.1422 2.69946C13.6653 2.20054 12.0908 2.06048 10.5489 2.29088C9.00711 2.52128 7.54232 3.11552 6.27575 4.02442C5.00918 4.93333 3.97725 6.13077 3.26534 7.51767C2.55343 8.90457 2.18202 10.4411 2.18182 12ZM12 21.8182C9.74608 21.8218 7.56016 21.0464 5.81236 19.6233C6.51579 18.6159 7.45221 17.7935 8.5419 17.226C9.63159 16.6584 10.8423 16.3626 12.0709 16.3636C13.2842 16.3626 14.4802 16.651 15.5596 17.2051C16.639 17.7591 17.5706 18.5627 18.2771 19.5491C16.5158 21.0185 14.2938 21.8218 12 21.8182Z"/>
                            </svg>
                        </div>
                        <p class=" font-poppins_semibold text-[14px]" :class="path === profilePath ? 'text-primary' : 'text-white'">Profile</p>
                        <img :src="clip" class="absolute image w-[27px] mt-[9px] translate-x-1 right-0 h-auto" v-if="path === profilePath" alt=""/>
                    </div>
                </nuxt-link>
            </div>
            <div class="lg:mx-auto mx-0 lg:ml-auto ml-16 lg:mb-0 mb-3">
                <button @click="handleLogout" class="bg-white text-[14px] font-poppins_semibold text-primary px-6 py-3 rounded-lg flex justify-center items-center gap-2 cursor-pointer">
                    <img :src="logout" class="w-[24px] h-auto" alt=""/>
                    <p>Logout</p>
                </button>
            </div>
        </div>
    </aside>
</template>