<script setup lang="ts">
    import { onMounted, ref } from 'vue';
    import { API } from '#imports';
    import cookie from 'js-cookie';
    import Swal from 'sweetalert2';
    import plusIcon from '~/public/icon/plus.svg';
    import editIcon from '~/public/icon/edit.svg';
    import deleteIcon from '~/public/icon/delete.svg';
    import AOS from 'aos';
    import 'aos/dist/aos.css';

    interface categoryDataProp {
        id: number,
        name: string,
    }

    const token = cookie.get('token');
    const categoryData = ref<categoryDataProp[]>([]);

    onMounted(() => {
        AOS.init();
        const fetchCategory = async() => {
            try {
                const response = await API.get('/super/category', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                categoryData.value = response.data.category;
                console.log(categoryData.value)
            } catch (error) {
                console.error(error);
            }
        }

        fetchCategory();
    });

    const handleAdd = async() => {
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
                title: 'Add Category',
                inputLabel: 'Category :',
                input: 'text',
                inputPlaceholder: 'blue',
                icon: 'question',
                confirmButtonColor: 'green',
                confirmButtonText: 'Add'
            }).then(async(value) => {
                if (value.isConfirmed && value.value) {
                    const response = await API.post('/super/category', {
                        name: value.value
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

    const handleUpdate = async(id: number) => {
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
                title: 'Update Category',
                inputLabel: 'Category :',
                input: 'text',
                icon: 'question',
                confirmButtonColor: 'green',
                confirmButtonText: 'Update'
            }).then(async(value) => {
                if (value.isConfirmed && value.value) {
                    const response = await API.put(`/super/category/${id}`, {
                        name: value.value
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

    const handleDelete = async(id: number) => {
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
                title: 'Are your sure to delete this category?',
                icon: 'question',
                confirmButtonColor: 'red',
                confirmButtonText: 'Yes',
                showDenyButton: true,
                denyButtonColor: 'green',
                denyButtonText: 'No'
            }).then(async(value) => {
                if (value.isConfirmed) {
                    const response = await API.delete(`/super/category/${id}`, {
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
            <h1 class="text-[24px] lg:text-[30px] font-poppins_semibold">Category List</h1>
            <button @click="handleAdd" class="font-poppins_medium text-white bg-green-500 p-2 cursor-pointer rounded-md">
                <img class="w-[26px] h-auto" :src="plusIcon"  alt=""/>
            </button>
        </div>
        <div class="mt-8 flex justify-start flex-wrap items-center gap-8">
            <div class="" v-for="(category, index) in categoryData" :key="index">
                <div class="bg-white px-6 py-4 rounded-md cursor-pointer hover:text-primary duration-200">
                    <h1 class="text-[16px] font-poppins_medium">{{ category.name }}</h1>
                    <div class="mt-3 flex justify-start gap-2 items-center">
                        <img @click="handleUpdate(category.id)" :src="editIcon" class="bg-blue-500 p-1 w-[24px] h-auto rounded-md" alt=""/>
                        <img @click="handleDelete(category.id)" :src="deleteIcon" class="bg-red-500 p-1 w-[24px] h-auto rounded-md" alt=""/>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>