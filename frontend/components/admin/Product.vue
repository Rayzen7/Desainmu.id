<script setup lang="ts">
    import plusIcon from '~/public/icon/plus.svg';
    import editIcon from '~/public/icon/edit.svg';
    import deleteIcon from '~/public/icon/delete.svg';
    import { API } from '#imports';
    import RupiahFormat from '~/utils/RupiahFormat';
    import { onMounted, ref } from '#imports';
    import { useRouter } from 'vue-router';
    import cookie from 'js-cookie';
    import Swal from 'sweetalert2';
    
    interface userDataProp {
        id: number,
        name: string,
        username: string,
        image: string,
        email: string,
        noHp: string,
        dateOfBirth: string,
        address: string,
        gender: string,
        role: any,
        category: any,
        price: number,
    }

    const token = cookie.get('token');
    const navigate = useRouter();
    const meData = ref<userDataProp[]>([]);

    onMounted(() => {
        const fetchProduct = async() => {
            try {
                const response = await API.get('/me', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                meData.value = response.data.user.product;
                console.log(meData.value)
            } catch (error) {
                console.error(error);
            }
        }

        fetchProduct();
    });

    const handleEdit = async(id: number) => {
        navigate.push(`/admin/product/edit/${id}`);
    }

    const handleDelete = async(id: number) => {
        try {
            const response = await API.delete(`/admin/product/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            Swal.fire({
                didOpen: () => {
                    Swal.showLoading();
                },
                timer: 1000,
                title: "Please Wait..."
            });

            await new Promise(resolve => setTimeout(resolve, 1000));
            Swal.fire({
                title: response.data.message,
                text: 'You can be reload on this page',
                confirmButtonColor: 'green',
                confirmButtonText: 'Success',
                icon: 'success'
            });

            setTimeout(() => {
                window.location.reload();
            }, 3000);
        } catch (error: any) {
            Swal.fire({
                title: error.response.data.message,
                confirmButtonColor: 'red',
                confirmButtonText: 'Error',
                icon: 'error'
            });
        }
    }
</script>

<template>
    <section class="min-h-screen">
        <div class="flex justify-between items-center">
            <h1 class="text-[24px] lg:text-[30px] font-poppins_semibold">Product List</h1>
            <nuxt-link to="/admin/product/add">
                <button class="font-poppins_medium text-white bg-green-500 p-2 cursor-pointer rounded-md">
                    <img class="w-[26px] h-auto" :src="plusIcon"  alt=""/>
                </button>
            </nuxt-link>
        </div>
        <div class="mt-8 flex justify-start flex-wrap items-center gap-8">
            <div class="" v-for="(product, index) in meData" :key="index">
                <div class="bg-white h-auto w-[220px] p-4 rounded-lg">
                    <img class="w-full rounded-md mx-auto h-auto" :src="`http://localhost:3333/image/${product.image}`" alt=""/>
                    <div class="mt-3 flex flex-col gap-1">
                        <h1 class="text-[16px] text-primary font-poppins_medium">{{ product.name.length > 15 ? product.name.slice(0, 15) + '...' : product.name }}</h1>
                        <p class="text-[14px] font-poppins_regular">{{ product.category.name }}</p>
                        <p class="text-[14px] font-poppins_medium text-secondary">{{ RupiahFormat(product.price) }}</p>
                        <div class="mt-2 flex items-center gap-2">
                            <button @click="handleEdit(product.id)" class="font-poppins_medium text-white bg-blue-500 p-1 cursor-pointer rounded-md">
                                <img class="w-[16px] h-auto" :src="editIcon" alt=""/>
                            </button>
                            <button @click="handleDelete(product.id)" class="font-poppins_medium text-white bg-red-500 p-1 cursor-pointer rounded-md">
                                <img class="w-[16px] h-auto" :src="deleteIcon" alt=""/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>