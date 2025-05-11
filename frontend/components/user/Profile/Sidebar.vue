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
    const profilePath = '/user/profile';
    const packedPath = '/user/packed';
    const shippedPath = '/user/shipped';
    const arrivedPath = '/user/arrived';
    const chatPath = '/user/chat';
    const cancelPath = '/user/cancel';
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
            <nuxt-link to="/">
                <div class="flex justify-start lg:ml-0 ml-8 lg:justify-center items-center gap-5 lg:gap-3 px-2">
                    <img :class="meData?.image == null ? 'lg:w-[40px] w-[50px]' : 'lg:w-[50px] w-[60px]'" :src="meData?.image == null ? guest : `http://localhost:3333/account/${meData?.image}`" class="h-auto rounded-full" alt=""/>
                    <div class="">
                        <h1 class="lg:text-[16px] text-[20px] font-poppins_medium">{{ meData?.username }}</h1>
                        <p class="text-[14px] lg:pt-0 pt-1 font-poppins_regular">{{ meData?.email }}</p>
                    </div>
                </div>
            </nuxt-link>
            <div class="flex flex-col gap-2 ml-8">
                <nuxt-link to="/user/profile">
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
                <nuxt-link to="/user/packed">
                    <div class="flex justify-start cursor-pointer items-center pl-6 p-4 py-4 rounded-l-full gap-4" :class="path === packedPath ? 'bg-white' : 'bg-transparent'">
                        <div class="">
                            <svg class="w-[18px] h-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path :class="path === packedPath ? 'fill-primary' : 'fill-white'" d="M1.5 5.712V21.5775C1.5 21.8465 1.5865 22.0675 1.7595 22.2405C1.9325 22.4135 2.154 22.5 2.424 22.5H21.5775C21.8465 22.5 22.0675 22.4135 22.2405 22.2405C22.4135 22.0675 22.5 21.8465 22.5 21.5775V5.712H16.5V13.917C16.5 14.377 16.3105 14.727 15.9315 14.967C15.5525 15.207 15.161 15.221 14.757 15.009L12 13.644L9.2415 15.009C8.8385 15.22 8.4475 15.206 8.0685 14.967C7.6895 14.727 7.5 14.377 7.5 13.917V5.712H1.5ZM2.424 24C1.752 24 1.18 23.764 0.708 23.292C0.236 22.82 0 22.2485 0 21.5775V5.229C0 4.937 0.0464999 4.662 0.1395 4.404C0.2325 4.146 0.3725 3.9085 0.5595 3.6915L2.8965 0.8865C3.1135 0.5935 3.385 0.3725 3.711 0.2235C4.037 0.0745003 4.3865 0 4.7595 0H19.1835C19.5555 0 19.9095 0.0745003 20.2455 0.2235C20.5815 0.3725 20.858 0.593 21.075 0.885L23.4405 3.75C23.6275 3.967 23.7675 4.2095 23.8605 4.4775C23.9535 4.7445 24 5.0245 24 5.3175V21.5775C24 22.2475 23.764 22.819 23.292 23.292C22.82 23.764 22.2485 24 21.5775 24H2.424ZM2.07 4.212H21.9L19.905 1.815C19.808 1.719 19.697 1.6425 19.572 1.5855C19.447 1.5285 19.317 1.5 19.182 1.5H4.788C4.654 1.5 4.524 1.529 4.398 1.587C4.272 1.645 4.162 1.722 4.068 1.818L2.07 4.212ZM8.9985 5.712V13.4415L11.9985 11.9415L14.9985 13.4415V5.7135L8.9985 5.712Z"/>
                            </svg>
                        </div>
                        <p class="font-poppins_semibold text-[14px]" :class="path === packedPath ? 'text-primary' : 'text-white'">Packed</p>
                        <img :src="clip" class="absolute image w-[27px] mt-[9px] translate-x-1 right-0 h-auto" v-if="path === packedPath" alt=""/>
                    </div>
                </nuxt-link>
                <nuxt-link to="/user/shipped">
                    <div class="flex justify-start cursor-pointer items-center pl-6 p-4 py-4 rounded-l-full gap-4" :class="path === shippedPath ? 'bg-white' : 'bg-transparent'">
                        <div class="">
                            <svg class="w-[22px] h-auto"  viewBox="0 0 24 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path :class="path === shippedPath ? 'fill-primary' : 'fill-white'" d="M0.837209 0.846179V0C0.615168 0 0.40222 0.0891507 0.245213 0.24784C0.0882058 0.40653 0 0.621759 0 0.846179H0.837209ZM13.1163 0.846179H13.9535C13.9535 0.621759 13.8653 0.40653 13.7083 0.24784C13.5513 0.0891507 13.3383 0 13.1163 0V0.846179ZM13.1163 7.61561V6.76943C12.8942 6.76943 12.6813 6.85859 12.5243 7.01728C12.3673 7.17596 12.2791 7.39119 12.2791 7.61561H13.1163ZM0.837209 1.69236H13.1163V0H0.837209V1.69236ZM12.2791 0.846179V18.898H13.9535V0.846179H12.2791ZM1.67442 16.6415V0.846179H0V16.6415H1.67442ZM13.1163 8.46179H18.6977V6.76943H13.1163V8.46179ZM22.3256 12.1286V16.6415H24V12.1286H22.3256ZM13.9535 18.898V7.61561H12.2791V18.898H13.9535ZM19.6845 19.8954C19.5549 20.0264 19.4011 20.1303 19.2317 20.2012C19.0624 20.2721 18.8809 20.3086 18.6977 20.3086C18.5144 20.3086 18.3329 20.2721 18.1636 20.2012C17.9943 20.1303 17.8405 20.0264 17.7109 19.8954L16.5276 21.0913C17.1033 21.6731 17.8841 22 18.6982 22C19.5124 22 20.2931 21.6731 20.8688 21.0913L19.6845 19.8954ZM17.7109 17.9006C17.8405 17.7696 17.9943 17.6657 18.1636 17.5948C18.3329 17.5239 18.5144 17.4874 18.6977 17.4874C18.8809 17.4874 19.0624 17.5239 19.2317 17.5948C19.4011 17.6657 19.5549 17.7696 19.6845 17.9006L20.8677 16.7047C20.292 16.1229 19.5112 15.796 18.6971 15.796C17.883 15.796 17.1022 16.1229 16.5265 16.7047L17.7109 17.9006ZM6.28912 19.8954C6.15954 20.0264 6.0057 20.1303 5.83639 20.2012C5.66707 20.2721 5.4856 20.3086 5.30233 20.3086C5.11906 20.3086 4.93758 20.2721 4.76826 20.2012C4.59895 20.1303 4.44511 20.0264 4.31554 19.8954L3.13228 21.0913C3.70797 21.6731 4.48876 22 5.30288 22C6.11701 22 6.8978 21.6731 7.47349 21.0913L6.28912 19.8954ZM4.31554 17.9006C4.44511 17.7696 4.59895 17.6657 4.76826 17.5948C4.93758 17.5239 5.11906 17.4874 5.30233 17.4874C5.4856 17.4874 5.66707 17.5239 5.83639 17.5948C6.0057 17.6657 6.15954 17.7696 6.28912 17.9006L7.47237 16.7047C6.89668 16.1229 6.1159 15.796 5.30177 15.796C4.48764 15.796 3.70685 16.1229 3.13116 16.7047L4.31554 17.9006ZM19.6845 17.9006C19.9568 18.1759 20.093 18.5358 20.093 18.898H21.7674C21.7674 18.1049 21.4672 17.3094 20.8688 16.7036L19.6845 17.9006ZM20.093 18.898C20.093 19.2602 19.9568 19.6201 19.6845 19.8954L20.8688 21.0913C21.1544 20.8037 21.3798 20.4618 21.5342 20.0854C21.6886 19.709 21.7679 19.3055 21.7674 18.898H20.093ZM16.4651 18.0518H13.1163V19.7442H16.4651V18.0518ZM17.7109 19.8954C17.5808 19.7648 17.4777 19.6093 17.4076 19.4381C17.3375 19.2669 17.3017 19.0833 17.3023 18.898H15.6279C15.6279 19.6912 15.9282 20.4866 16.5265 21.0924L17.7109 19.8954ZM17.3023 18.898C17.3023 18.5358 17.4385 18.1759 17.7109 17.9006L16.5265 16.7047C16.2409 16.9923 16.0155 17.3342 15.8611 17.7106C15.7067 18.087 15.6275 18.4905 15.6279 18.898H17.3023ZM4.31554 19.8954C4.18548 19.7648 4.08238 19.6093 4.01225 19.4381C3.94211 19.2669 3.90633 19.0833 3.90698 18.898H2.23256C2.23256 19.6912 2.53284 20.4866 3.13116 21.0924L4.31554 19.8954ZM3.90698 18.898C3.90698 18.5358 4.04316 18.1759 4.31554 17.9006L3.13228 16.7047C2.84669 16.9923 2.62018 17.3342 2.46577 17.7106C2.31137 18.087 2.23211 18.4905 2.23256 18.898H3.90698ZM13.1163 18.0518H7.53488V19.7442H13.1163V18.0518ZM6.28912 17.9006C6.56149 18.1759 6.69767 18.5358 6.69767 18.898H8.37209C8.37209 18.1049 8.07181 17.3094 7.47349 16.7036L6.28912 17.9006ZM6.69767 18.898C6.69767 19.2602 6.56149 19.6201 6.28912 19.8954L7.47237 21.0913C7.75796 20.8037 7.98447 20.4618 8.13888 20.0854C8.29329 19.709 8.37254 19.3055 8.37209 18.898H6.69767ZM22.3256 16.6415C22.3256 17.42 21.7005 18.0518 20.9302 18.0518V19.7442C21.7444 19.7442 22.5252 19.4173 23.1009 18.8354C23.6766 18.2536 24 17.4644 24 16.6415H22.3256ZM18.6977 8.46179C19.6599 8.46179 20.5826 8.84811 21.263 9.53577C21.9434 10.2234 22.3256 11.1561 22.3256 12.1286H24C24 10.7072 23.4414 9.34412 22.447 8.33909C21.4526 7.33406 20.1039 6.76943 18.6977 6.76943V8.46179ZM0 16.6415C0 17.4644 0.323421 18.2536 0.899114 18.8354C1.47481 19.4173 2.25561 19.7442 3.06977 19.7442V18.0518C2.29954 18.0518 1.67442 17.42 1.67442 16.6415H0Z"/>
                            </svg>
                        </div>
                        <p class=" font-poppins_semibold text-[14px]" :class="path === shippedPath ? 'text-primary' : 'text-white'">Shipped</p>
                        <img :src="clip" class="absolute image w-[27px] mt-[9px] translate-x-1 right-0 h-auto" v-if="path === shippedPath" alt=""/>
                    </div>
                </nuxt-link>
                <nuxt-link to="/user/arrived">
                    <div class="flex justify-start cursor-pointer items-center pl-6 p-4 py-4 rounded-l-full gap-4" :class="path === arrivedPath ? 'bg-white' : 'bg-transparent'">
                        <div class="">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-[26px] h-auto" :class="path === arrivedPath ? 'fill-primary' : 'fill-white'" viewBox="0 0 24 24"><path d="M22 8a.76.76 0 0 0 0-.21v-.08a.77.77 0 0 0-.07-.16.35.35 0 0 0-.05-.08l-.1-.13-.08-.06-.12-.09-9-5a1 1 0 0 0-1 0l-9 5-.09.07-.11.08a.41.41 0 0 0-.07.11.39.39 0 0 0-.08.1.59.59 0 0 0-.06.14.3.3 0 0 0 0 .1A.76.76 0 0 0 2 8v8a1 1 0 0 0 .52.87l9 5a.75.75 0 0 0 .13.06h.1a1.06 1.06 0 0 0 .5 0h.1l.14-.06 9-5A1 1 0 0 0 22 16V8zm-10 3.87L5.06 8l2.76-1.52 6.83 3.9zm0-7.72L18.94 8 16.7 9.25 9.87 5.34zM4 9.7l7 3.92v5.68l-7-3.89zm9 9.6v-5.68l3-1.68V15l2-1v-3.18l2-1.11v5.7z"/></svg>
                        </div>
                        <p class=" font-poppins_semibold text-[14px]" :class="path === arrivedPath ? 'text-primary' : 'text-white'">Arrived</p>
                        <img :src="clip" class="absolute image w-[27px] mt-[9px] translate-x-1 right-0 h-auto" v-if="path === arrivedPath" alt=""/>
                    </div>
                </nuxt-link>
                <nuxt-link to="/user/chat">
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
                <nuxt-link to="/user/cancel">
                    <div class="flex justify-start cursor-pointer items-center pl-6 p-4 py-4 rounded-l-full gap-4" :class="path === cancelPath ? 'bg-white' : 'bg-transparent'">
                        <div class="">
                            <svg class="w-[24px] h-auto" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_280_82)">
                                <path :class="path === cancelPath ? 'fill-primary stroke-primary' : 'fill-white stroke-white'" d="M8 16L12 12M16 8L11.9992 12M11.9992 12L8 8M12 12L16 16" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="12" cy="12" r="11.25" :class="path === cancelPath ? 'stroke-primary' : 'stroke-white'" stroke-width="2"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_280_82">
                                <rect :class="path === cancelPath ? 'fill-primary w-[30px] h-[30px]' : 'fill-white w-[30px] h-[30px]'"/>
                                </clipPath>
                                </defs>
                            </svg>
                        </div>
                        <p class=" font-poppins_semibold text-[14px]" :class="path === cancelPath ? 'text-primary' : 'text-white'">Canceled</p>
                        <img :src="clip" class="absolute image w-[27px] mt-[9px] translate-x-1 right-0 h-auto" v-if="path === cancelPath" alt=""/>
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