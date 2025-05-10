<script setup lang="ts">
    import cookie from 'js-cookie';
    import { onMounted, watch, ref } from 'vue';
    import RupiahFormat from '~/utils/RupiahFormat';
    import { API } from '#imports';
    import { useRoute, useRouter } from 'vue-router';

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

    const transactionData = ref<transactionDataProp[]>([]);
    const route = useRoute();
    const sortBy = ref('');
    const orderBy = ref('');
    const token = cookie.get('token');
    const navigate = useRouter();

    onMounted(() => {
        const fetchTransaction = async() => {
            try {
                const response = await API.get(`/admin/transaction?sort=${sortBy.value}&order=${orderBy.value}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                transactionData.value = response.data.transaction;
            } catch (error) {
                console.error(error);
            }
        }

        watch(
          () => sortBy.value,
          async (newVal) => {
            if (newVal) {
                await fetchTransaction();
            }
          }
        );
      
        watch(
          () => orderBy.value,
          async (newVal) => {
            if (newVal) {
                await fetchTransaction();
            }
          }
        );

        fetchTransaction();
    });

    const handleUpdate = (id: number) => {
        navigate.push(`/admin/order?id=${id}`);
    }
</script>

<template>
    <section>
        <div class="flex justify-start lg:gap-0 gap-6 lg:justify-between items-center">
            <h1 class="text-[24px] lg:text-[30px] font-poppins_semibold">Order List</h1>
        </div>
        <div class="mt-8 flex items-center gap-6">
            <div class="border-1 border-black w-[140px] flex justify-center items-center rounded-md px-1 py-2">
                <label class="text-[14px] font-poppins_medium">Sort By : </label>
                <select v-model="sortBy" class="text-[12px] font-poppins_regular cursor-pointer border-none outline-none">
                    <option value="" selected disabled>Sort by</option>
                    <option value="ASC">ASC</option>
                    <option value="DESC">DESC</option>
                </select>
            </div>
            <div class="border-1 border-black w-[140px] flex justify-center items-center rounded-md px-1 py-2">
                <label class="text-[14px] font-poppins_medium">Order By : </label>
                <select v-model="orderBy" class="text-[12px] font-poppins_regular cursor-pointer border-none outline-none">
                    <option value="" selected disabled>Order</option>
                    <option value="status">Status</option>
                    <option value="total">Total</option>
                </select>
            </div>
        </div>
        <div class="overflow-x-scroll mt-10 rounded-lg border border-gray-300">
          <table class="min-w-full bg-white">
            <thead class="bg-gray-100">
              <tr class="font-poppins_medium text-center">
                <td class="py-4 min-w-[90px] px-4 border-b border-gray-300 text-[16px] text-black">No</td>
                <td class="py-4 min-w-[240px] px-4 border-b border-gray-300 text-[16px] text-black">User</td>
                <td class="py-4 min-w-[240px] px-4 border-b border-gray-300 text-[16px] text-black">Address</td>
                <td class="py-4 min-w-[240px] px-4 border-b border-gray-300 text-[16px] text-black">No. HP</td>
                <td class="py-4 min-w-[240px] px-4 border-b border-gray-300 text-[16px] text-black">Email</td>
                <td class="py-4 min-w-[240px] px-4 border-b border-gray-300 text-[16px] text-black">Product</td>
                <td class="py-4 min-w-[240px] px-4 border-b border-gray-300 text-[16px] text-black">Status</td>
                <td class="py-4 min-w-[240px] px-4 border-b border-gray-300 text-[16px] text-black">Quantity</td>
                <td class="py-4 min-w-[240px] px-4 border-b border-gray-300 text-[16px] text-black">Total</td>
                <td class="py-4 min-w-[240px] px-4 border-b border-gray-300 text-[16px] text-black">Action</td>
              </tr>
            </thead>
            <tbody>
              <tr v-if="transactionData.length > 0" class="hover:bg-gray-50 text-center font-poppins_regular" v-for="(transaction, index) in  transactionData" :key="index">
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[90px] px-4 border-b border-gray-300 text-[13px] text-gray-700">{{ index + 1 }}</td>
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[240px] px-4 border-b border-gray-300 text-[13px] text-gray-700">{{ transaction.user.username }}</td>
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[240px] px-4 border-b border-gray-300 text-[13px] text-gray-700">{{ transaction.user.address }}</td>
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[240px] px-4 border-b border-gray-300 text-[13px] text-gray-700">{{ transaction.user.noHp }}</td>
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[240px] px-4 border-b border-gray-300 text-[13px] text-gray-700">{{ transaction.user.email }}</td>
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[240px] px-4 border-b border-gray-300 text-[13px] text-gray-700">{{ transaction.product.name }}</td>
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[240px] px-4 border-b border-gray-300 text-[13px] text-gray-700">
                    <p :class="transaction.status === 'packed' ? 'bg-blue-500' : transaction.status === 'delivered' ? 'bg-amber-500' : transaction.status === 'finished' ? 'bg-green-500' : 'bg-red-500'" class="text-white w-fit px-4 h-[36px] flex justify-center items-center mx-auto rounded-md">{{ transaction.status }}</p>
                </td>
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[240px] px-4 border-b border-gray-300 text-[13px] text-gray-700">{{ transaction.quantity }} Product</td>
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[240px] px-4 border-b border-gray-300 text-[13px] text-gray-700">{{ RupiahFormat(transaction.total) }}</td>
                <td :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'" class="py-5 min-w-[240px] align-middle px-4 border-b border-gray-300 text-[13px] text-gray-700">
                    <button @click="handleUpdate(transaction.id)" class="bg-primary text-white rounded-md px-4 py-2 cursor-pointer">Update</button>
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