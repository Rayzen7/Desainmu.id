<script setup lang="ts">
    import authImage from '/auth/auth.png';
    import { ref } from 'vue';
    import { API } from '#imports';
    import { useRouter } from 'vue-router';
    import { toast } from 'vue3-toastify';
    import '../../main.css';
    import AOS from 'aos';
    import 'aos/dist/aos.css';
    import cookie from 'js-cookie';
    import facebook from '/auth/facebook.png';
    import twitter from '/auth/twitter.png';
    import instagram from '/auth/instagram.png';
    import Swal from 'sweetalert2';

    const navigate = useRouter();
    const data = ref({
            email: '',
            password: ''
        });

    onMounted(() => {
        AOS.init();
    });

    const handleSubmit = async(e: { preventDefault: () => void; }) => {
        e.preventDefault();
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
            const response = await API.post('/auth/login', {
                email: data.value.email,    
                password: data.value.password,
                role_id: 3
            });

            const token = response.data.token.token;
            const userRole = response.data.user.roleId;
            cookie.set('token', token, {
                expires: 1,
            });
            
            toast.success(response.data.message, {
                theme: 'colored',
                autoClose: 2000
            });

            if (userRole === 1) {
                setTimeout(() => {
                    navigate.push('/super');
                }, 3000);
            } else if (userRole === 2) {
                setTimeout(() => {
                    navigate.push('/admin');
                }, 3000);
            } else {
                setTimeout(() => {
                    navigate.push('/');
                }, 3000);
            }
        } catch(error: any) {
            toast.error(error.response.data.message, {
                theme: 'colored',
                autoClose: 2000
            });
        }
    }
</script>

<template>
    <section class="flex justify-between items-start min-h-[100vh] w-full">
        <div class="" data-aos="fade-right" data-aos-duration="1000">
            <img :src="authImage" class=" w-auto h-[100vh] image" alt="">
        </div>
        <div class="flex flex-col lg:w-[50vw] w-full mt-6 gap-10 pr-0 lg:pr-8" data-aos="fade-up" data-aos-duration="900">
            <div class="flex justify-between px-8 lg:px-12 items-center">
                <nuxt-link to="/">
                    <h1 class="text-primary text-[20px] lg:text-[28px] font-poppins_bold">Desainmu.ID</h1>
                </nuxt-link>
                <nuxt-link to="/auth/register">
                    <button class="text-white font-poppins_medium text-[12px] lg:text-[14px] border-2 border-primary hover:bg-transparent bg-primary rounded-full w-[90px] lg:w-[100px] h-[40px] lg:h-[45px] duration-200 hover:text-primary cursor-pointer">
                        Sign Up
                    </button>
                </nuxt-link>
            </div>
            <div class="flex flex-col justify-center lg:mt-2 mt-10 items-center">
                <h1 class="font-poppins_semibold text-[36px] lg:text-[42px] text-primary">Login</h1>
                <p class="lg:text-[16px] pt-2 text-[14px] text-black font-poppins_regular">Please Enter Your Account</p>
                <form @submit="handleSubmit" class="flex flex-col gap-6 mt-12">
                    <input 
                        type="email" 
                        class="border-2 w-[300px] text-black lg:w-[400px] h-[45px] lg:h-[50px] border-[#858585] font-poppins_medium text-[14px] px-3 outline-0 focus-within:border-black rounded-md" 
                        placeholder="Email"
                        v-model="data.email"
                    />
                    <input 
                        type="password" 
                        class="border-2 w-[300px] text-black lg:w-[400px] h-[45px] lg:h-[50px] border-[#858585] font-poppins_medium text-[14px] px-3 outline-0 focus-within:border-black rounded-md"
                        placeholder="Password"
                        v-model="data.password"
                    />
                    <p class="text-primary cursor-pointer text-end text-[14px] underline font-poppins_medium">Forgot Password</p>
                    <div>
                        <button type="submit" class="text-white font-poppins_medium text-[14px] border-2 border-primary hover:bg-transparent bg-primary rounded-full w-full h-[50px] duration-200 hover:text-primary cursor-pointer">
                            Sign In
                        </button>
                    </div>
                    <div class="flex mt-4 justify-center items-center gap-6">
                        <img class="lg:w-[45px] w-[35px] cursor-pointer h-auto" :src="facebook" alt="">
                        <img class="lg:w-[45px] w-[35px] cursor-pointer h-auto" :src="twitter" alt="">
                        <img class="lg:w-[45px] w-[35px] cursor-pointer h-auto" :src="instagram" alt="">
                    </div>
                </form>
            </div>
        </div>
    </section>
</template>