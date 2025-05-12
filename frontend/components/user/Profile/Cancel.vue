<script lang="ts" setup>
    import { API } from '#imports';
    import { onMounted, ref } from '#imports';
    import cookie from 'js-cookie';
    import RupiahFormat from '~/utils/RupiahFormat';
    import AOS from 'aos';
    import 'aos/dist/aos.css';
    import { useRouter } from 'vue-router';
    import { Path } from '~/utils/Path';

    interface transactionDataProp {
        id: number,
        product: {
            id: number,
            image: string,
            name: string,
            category: {
                name: string
            }
        },
        total: number,
        status: string,
        quantity: number,
        deliveredStatus1: string,        
        deliveredStatus2: string,        
        deliveredStatus3: string,        
        deliveredStatus4: string,        
    }

    const transactionData = ref<transactionDataProp[]>([]);
    const token = cookie.get('token');    
    const navigate = useRouter();

    onMounted(() => {
        AOS.init();
        const fetchCancelUser = async() => {
            try {
                const response = await API.get('/user/transaction?status=canceled', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                transactionData.value = response.data.transaction;
            } catch (error) {
                console.error(error);
            }
        }

        fetchCancelUser();
    });

    const handleTransactionProduct = (id: number) => {
        navigate.push(`/user/product/${id}`);
    }
</script>

<template>
    <section>
        <h1 class="lg:text-[30px] text-[26px] font-poppins_semibold">Canceled</h1>
        <div class="mt-8 flex flex-col gap-8" v-if="transactionData.length > 0">
            <div class="" v-for="(transaction, index) in transactionData" :key="index" data-aos="fade-up" data-aos-duration="900">
                <div class="border-2 bg-white flex lg:flex-row flex-col justify-between p-5 w-full lg:w-[90%] border-red-500 rounded-xl" data-aos="fade-up" data-aos-duration="900">
                    <div class="flex lg:flex-row flex-col justify-start items-center gap-2">
                        <img class="lg:w-[110px] w-[120px] h-auto" :src="`${Path}/image/${transaction.product.image}`" alt=""/>
                        <div class="flex flex-col w-full lg:gap-1 gap-2">
                            <h1 class="text-[18px] font-poppins_medium">{{ transaction.product.name }}</h1>
                            <p class="text-[14px] text-gray font-poppins_regular">{{ transaction.product.category.name }}</p>
                            <p class="text-[18px] font-poppins_medium text-secondary">{{ RupiahFormat(transaction.total) }}</p>
                            <p class="text-[12px] text-gray font-poppins_regular">Currently packed, expected to arrive in 3-4 days</p>
                        </div>
                    </div>
                    <div class="flex flex-row lg:gap-0 gap-3 lg:flex-col lg:mt-0 mt-6 justify-center lg:justify-between items-start lg:items-end">
                        <button class="text-[14px] cursor-pointer lg:w-fit font-poppins_medium text-primary border-2 w-[160px] px-6 border-primary rounded-md p-2"  @click="handleTransactionProduct(transaction.product.id)">Buy Back</button>
                        <p class="lg:text-[14px] text-[12px] text-gray font-poppins_regular">{{ `Total ${transaction.quantity} product: ${RupiahFormat(transaction.total)}` }}</p>
                    </div>
                </div>
                <div class="mt-8 ml-10 relative">
                  <div class="w-[4px] bg-green-500 relative" :class="transaction.deliveredStatus4 ? 'h-[100px]' : 'h-0'">
                    <div class="absolute top-0 py-6 flex flex-col gap-14 -translate-x-[2.5%]">                     
                      <div class="items-center gap-8 shrink-0" :class="transaction.deliveredStatus4 ? 'flex' : 'hidden'">
                        <div class="w-[35px] h-[35px] rounded-full bg-white border-[3px] border-green-500"></div>
                        <p class="text-[14px] bg-green-500 flex-1 w-[600px] text-white font-poppins_medium p-3 rounded-md">{{ transaction.deliveredStatus4 }}</p>
                      </div>                      
                    </div>
                  </div>
                </div>
            </div>
        </div>
        <p class="mt-8 text-[20px] font-poppins_medium text-gray" v-else>You have not ordered any products</p>
    </section>
</template>