<script setup lang="ts">
    import { API } from '#imports';
    import guest from '~/public/profile/guest.jpg';
    import { onMounted, ref } from '#imports';
    import change from '~/public/icon/change.png';
    import Swal from 'sweetalert2';
    import cookie from 'js-cookie'
    import { useRouter } from 'vue-router';
    import AOS from 'aos';
    import 'aos/dist/aos.css';
    import { Path } from '~/utils/Path';

    interface userDataProp {
        id: number,
        username: string,
        image: string,
        email: string,
        noHp: string,
        dateOfBirth: string,
        address: string,
        gender: string,
        role: any,
    }

    const navigate = useRouter();
    const token = cookie.get('token');
    const userData = ref<userDataProp | null>(null);
    const selectedImage = ref<File | null>(null);
    const thisUserProfleImage = ref();
    const userId = ref();
    const userDataForm = ref({
        username: "",
        image: "",
        email: "",
        no_hp: "",
        date_of_birth: "",
        address: "",
        gender: "",
        role_id: 3,
    });

    function handleFileChange(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        selectedImage.value = target.files[0];
      }
    }

    onMounted(() => {
        AOS.init();
        const fetchUser = async() => {
            try {
                const response = await API.get('/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                userData.value = response.data.user;
                userId.value = response.data.user.id;
                thisUserProfleImage.value = response.data.user.image;

                userDataForm.value.username = userData.value?.username || '';
                userDataForm.value.email = userData.value?.email || '';
                userDataForm.value.image = userData.value?.image || '';
                userDataForm.value.no_hp = userData.value?.noHp || '';
                userDataForm.value.address = userData.value?.address || '';
                userDataForm.value.date_of_birth = userData.value?.dateOfBirth || '';
                userDataForm.value.gender = userData.value?.gender || '';
            } catch (error) {
                console.error(error);
            }
        }

        fetchUser();
    });

    const handleUserEdit = async() => {
        const formData = new FormData();
        formData.append('username', userDataForm.value.username);
        formData.append('email', userDataForm.value.email);
        formData.append('no_hp', userDataForm.value.no_hp);
        formData.append('date_of_birth', userDataForm.value.date_of_birth);
        formData.append('address', userDataForm.value.address);
        formData.append('gender', userDataForm.value.gender);
        formData.append('role_id', '2');
        if (selectedImage.value) {
            formData.append('image', selectedImage.value);
        }

        try {
            Swal.fire({
                didOpen: () => {
                    Swal.showLoading();
                },
                timer: 1000,
                title: "Please Wait..."
            });

            await new Promise(resolve => setTimeout(resolve, 1000));
            Swal.fire({
                icon: 'question',
                text: 'Are you sure to update your profile?',
                title: 'Update Profile',
                confirmButtonColor: 'green',
                confirmButtonText: 'Yes',
                cancelButtonColor: 'red',
                cancelButtonText: 'No',
                showCancelButton: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await API.put(`/getuser/${userId.value}`, formData, {
                        'headers': {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": 'multipart/form-data'
                        },
                    });

                    Swal.fire({
                        title: response.data.message,
                        text: 'The page can be reload',
                        icon: 'success',
                        confirmButtonColor: 'green',
                        confirmButtonText: "Success"
                    });

                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                }
            });
        } catch (error: any) {
            Swal.fire({
                title: error.response.data.message,
                icon: 'error',
                confirmButtonColor: 'red',
                confirmButtonText: "Error"
            });
        }
    }
</script>

<template>
    <section class="min-h-[100vh]" data-aos="fade-up" data-aos-duration="900">
        <div class="flex flex-col gap-4">
            <h1 class="lg:text-[28px] text-[26px] font-poppins_semibold">My Profile</h1>
            <button class="text-white bg-[#1994FF] w-fit px-8 py-2 rounded-full font-poppins_medium text-[12px] lg:text-[14px]">Edit Profile</button>
        </div>
        <div class="lg:mt-14 mt-12 lg:flex-row flex-col flex items-start gap-12 ml-0 lg:ml-4">
            <div class="relative">
                <img :src="userData?.image === null ? guest : `${Path}/account/${userData?.image}`" :class="selectedImage ? 'opacity-65' : 'opacity-100'" class="w-[90px] border-2 border-primary rounded-full h-auto" alt=""/>
                <label for="imageProfile">
                    <img :src="change" alt="" class="w-[20px] absolute right-0 bottom-1 cursor-pointer" />
                </label>
                <input @change="handleFileChange" class="hidden" type="file" name="" id="imageProfile"/>
            </div>
            <div class="lg:w-[70%] w-full flex flex-col lg:gap-10 gap-8">
                <div class="flex flex-1 flex-col gap-2">
                    <label class="text-[14px] lg:text-[16px] font-poppins_medium" for="">Username</label>
                    <input v-model="userDataForm.username" class="border-2 outline-0 border-black focus-within:border-primary w-full h-[45px] px-3 text-[14px] font-poppins_regular rounded-lg" type="text" placeholder="Username" />
                </div>
                <div class="flex items-center gap-8">
                    <div class="flex flex-1 flex-col gap-2">
                        <label class="text-[14px] lg:text-[16px] font-poppins_medium" for="">Email Address</label>
                        <input v-model="userDataForm.email" class="border-2 outline-0 border-black focus-within:border-primary w-full h-[45px] px-3 text-[14px] font-poppins_regular rounded-lg" type="email" placeholder="Email Address" />
                    </div>
                    <div class="flex flex-1 flex-col gap-2">
                        <label class="text-[14px] lg:text-[16px] font-poppins_medium" for="">No. Handphone</label>
                        <input v-model="userDataForm.no_hp" class="border-2 outline-0 border-black focus-within:border-primary w-full h-[45px] px-3 text-[14px] font-poppins_regular rounded-lg" type="tel" placeholder="No. Handphone" />
                    </div>
                </div>
                <div class="flex items-center gap-8">
                    <div class="flex flex-1 flex-col gap-2">
                        <label class="text-[14px] lg:text-[16px] font-poppins_medium" for="">Date of Birth</label>
                        <input v-model="userDataForm.date_of_birth" class="border-2 outline-0 border-black focus-within:border-primary w-full h-[45px] px-3 text-[14px] font-poppins_regular rounded-lg" type="date" placeholder="Date of Birth" />
                    </div>
                    <div class="flex flex-1 flex-col gap-2">
                        <label class="text-[14px] lg:text-[16px] font-poppins_medium" for="">Gender</label>
                        <select v-model="userDataForm.gender" class="border-2 outline-0 border-black cursor-pointer focus-within:border-primary w-full h-[45px] px-3 text-[14px] font-poppins_regular rounded-lg">
                            <option value="" disabled selected>Select Gender</option>
                            <option value="Male">M</option>
                            <option value="Female">F</option>
                        </select>
                    </div>
                </div>
                <div class="flex flex-1 flex-col gap-2">
                    <label class="text-[14px] lg:text-[16px] font-poppins_medium" for="">Residence Address</label>
                    <input v-model="userDataForm.address" class="border-2 outline-0 border-black focus-within:border-primary w-full h-[45px] px-3 text-[14px] font-poppins_regular rounded-lg" type="text" placeholder="Residence Address" />
                </div>
                <button @click="handleUserEdit" class="text-white bg-[#1994FF] w-fit px-6 py-3 ml-auto border-2 border-[#1994FF] hover:bg-transparent hover:text-[#1994FF] cursor-pointer duration-150 rounded-full font-poppins_medium text-[12px]">Update Profile</button>
            </div>
        </div>
    </section>
</template>