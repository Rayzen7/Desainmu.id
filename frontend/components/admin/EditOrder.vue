<script lang="ts" setup>
    import cookie from 'js-cookie';
    import { onMounted, ref } from 'vue';
    import RupiahFormat from '~/utils/RupiahFormat';
    import { API } from '#imports';
    import { useRoute, useRouter } from 'vue-router';
    import Swal from 'sweetalert2';
    import AOS from 'aos';
    import 'aos/dist/aos.css';

    interface transactionDataProp {
        id: number,
        user: {
            username: string,
            address: string,
            email: string,
            noHp: string,
        },
        product: {
            name: string
        },
        quantity: number,
        total: number,
        status: string,
        delivered_status_1: string,
        delivered_status_2: string,
        delivered_status_3: string,
        delivered_status_4: string,
    }

    const token = cookie.get('token');
    const transactionData = ref<transactionDataProp | null>(null);
    const transactionDataPost = ref({
        status: '',
        delivered_status_1: '',
        delivered_status_2: '',
        delivered_status_3: '',
        delivered_status_4: '',
    });
    const route = useRoute();
    const id = route.params.id;
    const navigate = useRouter();

    onMounted(() => {
        AOS.init();
        const fetchTransactionId = async() => {
            try {
                const response = await API.get(`/admin/transaction/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                transactionData.value = response.data.transaction;
                transactionDataPost.value.status = response.data.transaction.status;
                transactionDataPost.value.delivered_status_1 = response.data.transaction.deliveredStatus1;
                transactionDataPost.value.delivered_status_2 = response.data.transaction.deliveredStatus2;
                transactionDataPost.value.delivered_status_3 = response.data.transaction.deliveredStatus3;
                transactionDataPost.value.delivered_status_4 = response.data.transaction.deliveredStatus4;
            } catch (error) {
                
            }
        }

        fetchTransactionId();
    });

    const handleUpdate = async() => {
        try {
            Swal.fire({
                didOpen: () => {
                    Swal.showLoading();
                },
                timer: 1000,
                title: 'Please Wait...'
            });

            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await API.put(`/admin/transaction/${id}`, {
                status: transactionDataPost.value.status,
                delivered_status_1: transactionDataPost.value.delivered_status_1,
                delivered_status_2: transactionDataPost.value.delivered_status_2,
                delivered_status_3: transactionDataPost.value.delivered_status_3,
                delivered_status_4: transactionDataPost.value.delivered_status_4,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            Swal.fire({
                title: response.data.message,
                text: 'You can be reload',
                icon: 'success',
                confirmButtonText: 'Success',
                confirmButtonColor: 'green',
            });

            setTimeout(() => {
                navigate.push('/admin/order');
            }, 3000);
        } catch (error: any) {
            Swal.fire({
                title: error.response.data.message,
                icon: 'error',
                confirmButtonText: 'Error',
                confirmButtonColor: 'red',
            });
        }
    }
</script>

<template>
    <section data-aos="fade-up" data-aos-duration="900">
        <div class="flex justify-start lg:gap-0 gap-6 lg:justify-between items-center">
            <h1 class="text-[24px] lg:text-[30px] font-poppins_semibold">Order Status</h1>
        </div>
        <div class="mt-8 flex lg:flex-row flex-col items-center lg:items-start lg:gap-24 gap-6">
            <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-3">
                    <label class="text-[16px] font-poppins_medium">User :</label>
                    <input type="text" :value="transactionData?.user.username" disabled class="text-[14px] font-poppins_regular border-2 border-black outline-0 rounded-md w-[300px] h-[45px] px-2"/>
                </div>
                <div class="flex flex-col gap-3">
                    <label class="text-[16px] font-poppins_medium">Email :</label>
                    <input type="text" :value="transactionData?.user.email" disabled class="text-[14px] font-poppins_regular border-2 border-black outline-0 rounded-md w-[300px] h-[45px] px-2"/>
                </div>
                <div class="flex flex-col gap-3">
                    <label class="text-[16px] font-poppins_medium">No. HP :</label>
                    <input type="text" :value="transactionData?.user.noHp" disabled class="text-[14px] font-poppins_regular border-2 border-black outline-0 rounded-md w-[300px] h-[45px] px-2"/>
                </div>
                <div class="flex flex-col gap-3">
                    <label class="text-[16px] font-poppins_medium">Product :</label>
                    <input type="text" :value="transactionData?.product.name" disabled class="text-[14px] font-poppins_regular border-2 border-black outline-0 rounded-md w-[300px] h-[45px] px-2"/>
                </div>
                <div class="flex flex-col gap-3">
                    <label class="text-[16px] font-poppins_medium">Quantity :</label>
                    <input type="text" :value="transactionData?.quantity" disabled class="text-[14px] font-poppins_regular border-2 border-black outline-0 rounded-md w-[300px] h-[45px] px-2"/>
                </div>
                <div class="flex flex-col gap-3">
                    <label class="text-[16px] font-poppins_medium">Total :</label>
                    <input type="text" :value="RupiahFormat(transactionData?.total ?? 0)" disabled class="text-[14px] font-poppins_regular border-2 border-black outline-0 rounded-md w-[300px] h-[45px] px-2"/>
                </div>
            </div>
            <div class="flex flex-col gap-6">
                <div class="flex flex-col gap-3">
                    <label class="text-[16px] font-poppins_medium">Status :</label>
                    <select v-model="transactionDataPost.status" class="text-[14px] cursor-pointer font-poppins_regular border-2 border-black outline-0 rounded-md w-[300px] h-[45px] px-2">
                        <option value="packed">Packed</option>
                        <option value="delivered">Delivered</option>
                        <option value="finished">Finished</option>
                        <option value="canceled">Canceled</option>
                    </select>
                </div>
                <div class="flex flex-col gap-3">
                    <label class="text-[16px] font-poppins_medium">Delivered Status 1 :</label>
                    <input type="text" v-model="transactionDataPost.delivered_status_1" placeholder="Delivered Status 1" class="text-[14px] font-poppins_regular border-2 border-black outline-0 rounded-md w-[300px] h-[45px] px-2"/>
                </div>
                <div class="flex flex-col gap-3">
                    <label class="text-[16px] font-poppins_medium">Delivered Status 2 :</label>
                    <input type="text" v-model="transactionDataPost.delivered_status_2" placeholder="Delivered Status 2" class="text-[14px] font-poppins_regular border-2 border-black outline-0 rounded-md w-[300px] h-[45px] px-2"/>
                </div>
                <div class="flex flex-col gap-3">
                    <label class="text-[16px] font-poppins_medium">Delivered Status 3 :</label>
                    <input type="text" v-model="transactionDataPost.delivered_status_3" placeholder="Delivered Status 3" class="text-[14px] font-poppins_regular border-2 border-black outline-0 rounded-md w-[300px] h-[45px] px-2"/>
                </div>
                <div class="flex flex-col gap-3">
                    <label class="text-[16px] font-poppins_medium">Delivered Status 4 :</label>
                    <input type="text" v-model="transactionDataPost.delivered_status_4" placeholder="Delivered Status 4" class="text-[14px] font-poppins_regular border-2 border-black outline-0 rounded-md w-[300px] h-[45px] px-2"/>
                </div>
                <button @click="handleUpdate" class="text-white font-poppins_medium bg-primary text-[14px] border-2 border-primary hover:text-primary hover:bg-transparent duration-200 h-[50px] rounded-md cursor-pointer mt-8">Update Status</button>
            </div>
        </div>
    </section>
</template>