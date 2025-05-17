<script setup lang="ts">
    import { API } from '#imports';
    import { ref, onMounted, watch } from '#imports';
    import { useRouter } from 'vue-router';
    import AOS from 'aos';
    import 'aos/dist/aos.css';
    import cookie from 'js-cookie';
    import Swal from 'sweetalert2';

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
        roleId: number,
    }
    
    const token = cookie.get('token');
    const navigate = useRouter();
    const userData = ref<userDataProp[]>([]);
    const searchName = ref('');
    const statusValue = ref('');

    onMounted(() => {
        AOS.init();
        const fetchUser = async() => {
            try {
                const response = await API.get('/super/getuser', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const user = response.data.user;
                const filteredUser = user.filter((users: any) => {
                    const roleUser = users.roleId !== 1;
                    const searchUser = searchName.value ? users.username.toLowerCase().includes(searchName.value.toLowerCase()) : true;
                    const status = statusValue.value ? statusValue.value === users.role.name : true;

                    return roleUser && searchUser && status;
                });

                userData.value = filteredUser;
            } catch (error) {
                
            }
        }        
        
        watch(
            () => searchName.value,
            async(newValue: any) => {
            if (newValue) {
                fetchUser();
            } else {
                fetchUser();
            }
        });
        
        watch(
            () => statusValue.value,
            async(newValue: any) => {
                if (newValue) {
                    fetchUser();
                } else {
                    fetchUser();
                }
            });
            
        fetchUser();
    });

    const handleDelete = async(id: number, username: string) => {
        try {
            Swal.fire({
                didOpen: () => {
                    Swal.showLoading()
                },
                title: 'Please Wait...',
                timer: 1000
            });

            await new Promise(resolve => setTimeout(resolve, 1000));
            Swal.fire({
                title: `Are you sure to delete ${username} user?`,
                showDenyButton: true,
                confirmButtonColor: 'red',
                confirmButtonText: 'Yes',
                denyButtonColor: 'green',
                denyButtonText: 'No',
                icon: 'question'
            }).then(async(result) => {
                if (result.isConfirmed) {
                    const response = await API.delete(`/super/getuser/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                
                    Swal.fire({
                        title: response.data.message,
                        icon: 'success',
                        confirmButtonColor: 'green',
                        confirmButtonText: 'success',
                        text: 'You can be reload'
                    });
                
                    setTimeout(() => {
                        window.location.reload();
                    }, 3000);
                }
            });            
        } catch (error: any) {
            Swal.fire({
                title: error.response.message,
                icon: 'error',
                confirmButtonColor: 'red',
                confirmButtonText: 'error'
            });
        }
    }

    const handleEdit = async(id: number) => {
        try {
            Swal.fire({
                didOpen: () => {
                    Swal.showLoading()
                },
                title: 'Please Wait...',
                timer: 1000
            });

            await new Promise(resolve => setTimeout(resolve, 1000));
            Swal.fire({
                title: 'Update User Status',
                inputLabel: 'Status :',
                input: 'select',
                inputPlaceholder: 'Select Status',
                icon: 'question',
                inputOptions: {
                    2: 'Admin',
                    3: 'User'
                },
                confirmButtonColor: 'green',
                confirmButtonText: 'Update'
            }).then(async(value) => {
                if (value.isConfirmed && value.value) {
                    const response = await API.put(`/super/getuser/${id}`, {
                        role_id: value.value
                    }, {
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
                }
            });
            
        } catch (error) {
            console.error(error);
        }
    }
</script>

<template>
    <section data-aos="fade-up" data-aos-duration="900">
        <div class="flex justify-start lg:gap-0 gap-6 lg:justify-between items-center">
            <h1 class="text-[24px] lg:text-[30px] font-poppins_semibold">User List</h1>
        </div>
        <div class="mt-8 flex items-center gap-6">
            <div class="border-1 border-black w-[240px] flex items-center gap-2 rounded-md px-4 py-3">
                <label class="text-[14px] image font-poppins_medium">Sort By : </label>
                <input v-model="searchName" type="text" class="text-[12px] w-[120px] font-poppins_regular border-none outline-none" placeholder="Search name..." />
            </div>
            <div class="border-1 border-black w-[170px] flex justify-center items-center rounded-md px-1 py-3">
                <label class="text-[14px] image font-poppins_medium">Status : </label>
                <select v-model="statusValue" class="text-[12px] font-poppins_regular cursor-pointer border-none outline-none">
                    <option value="" selected>All Status</option>
                    <option value="Admin">admin</option>
                    <option value="User">user</option>
                </select>
            </div>
        </div>
        <div class="overflow-x-scroll mt-10 rounded-lg border border-gray-300">
          <table class="min-w-full bg-white">
            <thead class="bg-gray-100">
              <tr class="font-poppins_medium text-center">
                <td class="py-4 min-w-[90px] px-4 border-b border-gray-300 text-[16px] text-black">No</td>
                <td class="py-4 min-w-[240px] px-4 border-b border-gray-300 text-[16px] text-black">Username</td>
                <td class="py-4 min-w-[240px] px-4 border-b border-gray-300 text-[16px] text-black">Address</td>
                <td class="py-4 min-w-[240px] px-4 border-b border-gray-300 text-[16px] text-black">No. HP</td>
                <td class="py-4 min-w-[240px] px-4 border-b border-gray-300 text-[16px] text-black">Email</td>
                <td class="py-4 min-w-[240px] px-4 border-b border-gray-300 text-[16px] text-black">Date of Birth</td>
                <td class="py-4 min-w-[240px] px-4 border-b border-gray-300 text-[16px] text-black">Gender</td>
                <td class="py-4 min-w-[240px] px-4 border-b border-gray-300 text-[16px] text-black">Status</td>
                <td class="py-4 min-w-[240px] px-4 border-b border-gray-300 text-[16px] text-black">Action</td>
              </tr>
            </thead>
            <tbody>
              <tr v-if="userData.length > 0" class="hover:bg-gray-50 text-center font-poppins_regular" v-for="(user, index) in  userData" :key="index">
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[90px] px-4 border-b border-gray-300 text-[13px] text-gray-700">{{ index + 1 }}</td>
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[240px] px-4 border-b border-gray-300 text-[13px] text-gray-700">{{ user.username }}</td>
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[240px] px-4 border-b border-gray-300 text-[13px] text-gray-700">{{ user.address ?? 'Nothing' }}</td>
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[240px] px-4 border-b border-gray-300 text-[13px] text-gray-700">{{ user.noHp ?? 'Nothing' }}</td>
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[240px] px-4 border-b border-gray-300 text-[13px] text-gray-700">{{ user.email ?? 'Nothing' }}</td>
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[240px] px-4 border-b border-gray-300 text-[13px] text-gray-700">{{ user.dateOfBirth ?? 'Nothing' }}</td>
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[240px] px-4 border-b border-gray-300 text-[13px] text-gray-700">{{ user.gender ?? 'Nothing' }}</td>
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[240px] px-4 border-b border-gray-300 text-[13px] text-gray-700">
                    <p :class="user.roleId === 2 ? 'bg-green-500' : user.roleId === 3 ? 'bg-blue-500' : ''" class="text-white w-fit px-4 h-[36px] flex justify-center items-center mx-auto rounded-md">{{ user.role.name }}</p>
                </td>
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[240px] flex justify-center items-center gap-4 align-middle px-4 border-b border-gray-300 text-[13px] text-gray-700">
                    <button @click="handleEdit(user.id)" class="bg-blue-500 text-white rounded-md px-4 py-2 cursor-pointer">Update</button>
                    <button @click="handleDelete(user.id, user.username)" class="bg-red-500 text-white rounded-md px-4 py-2 cursor-pointer">Delete</button>
                </td>
              </tr>
              <tr v-else>
                <td class="text-[16px] px-3 py-5 font-poppins_medium min-w-[200px]">Data Not Found</td>
              </tr>
            </tbody>
          </table>
        </div>
    </section>
</template>