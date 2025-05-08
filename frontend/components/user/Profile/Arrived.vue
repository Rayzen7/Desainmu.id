<script lang="ts" setup>
    import { API } from '#imports';
    import { onMounted, ref } from '#imports';
    import cookie from 'js-cookie';
    import RupiahFormat from '~/utils/RupiahFormat';
    import AOS from 'aos';
    import 'aos/dist/aos.css';
    import Swal from 'sweetalert2';

    interface transactionDataProp {
        id: number,
        product: {
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

    onMounted(() => {
        AOS.init();
        const fetchArrivedUser = async() => {
            try {
                const response = await API.get('/user/transaction?status=finished', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                transactionData.value = response.data.transaction;
            } catch (error) {
                console.error(error);
            }
        }

        fetchArrivedUser();
    });
</script>

<template>
    <section data-aos="fade-up" data-aos-duration="900">
        <h1 class="text-[26px] lg:text-[30px] font-poppins_semibold">Arrived</h1>
        <div class="mt-8 flex flex-col gap-8" v-if="transactionData.length > 0">
            <div class="" v-for="(transaction, index) in transactionData" :key="index" data-aos="fade-up" data-aos-duration="900">
                <div class="border-2 flex lg:flex-row flex-col justify-between p-5 w-full lg:w-[90%] border-primary rounded-xl" data-aos="fade-up" data-aos-duration="900">
                    <div class="flex lg:flex-row flex-col justify-start items-center gap-2">
                        <img class="lg:w-[110px] w-[120px] h-auto" :src="`http://localhost:3333/image/${transaction.product.image}`" alt=""/>
                        <div class="flex flex-col w-full lg:gap-1 gap-2">
                            <h1 class="text-[18px] font-poppins_medium">{{ transaction.product.name }}</h1>
                            <p class="text-[14px] text-gray font-poppins_regular">{{ transaction.product.category.name }}</p>
                            <p class="text-[18px] font-poppins_medium text-secondary">{{ RupiahFormat(transaction.total) }}</p>
                            <p class="text-[12px] text-gray font-poppins_regular">Your package has arrived</p>
                        </div>
                    </div>
                    <div class="flex flex-row lg:gap-0 gap-3 lg:flex-col lg:mt-0 mt-6 justify-center lg:justify-between items-start lg:items-end">
                        <nuxt-link :to="`/user/rate/${transaction.id}`">
                            <button class="text-[14px] cursor-pointer w-fit font-poppins_medium text-primary border-2 px-6 border-primary rounded-md p-2">Rate</button>
                        </nuxt-link>
                        <p class="lg:text-[14px] text-[12px] text-gray font-poppins_regular">{{ `Total ${transaction.quantity} product: ${RupiahFormat(transaction.total)}` }}</p>
                    </div>
                </div>
                <div class="mt-12 lg:ml-10 ml-4 relative">
                  <div class="lg:w-[4px] w-[2px] bg-green-500 relative h-[100px]">
                    <div class="absolute top-0 py-6 flex flex-col gap-8 lg:gap-14 lg:-translate-x-[2.5%] -translate-x-[4%]">
                      <div class="items-center gap-8 shrink-0" :class="transaction.deliveredStatus1 ? 'flex' : 'hidden'">
                        <div class="lg:w-[35px] w-[25px] h-[25px] lg:h-[35px] rounded-full bg-white border-[3px] border-green-500"></div>
                        <p class="text-[12px] lg:text-[14px] bg-green-500 flex-1 w-[220px] lg:w-[600px] text-white font-poppins_medium p-3 rounded-md">{{ transaction.deliveredStatus1 }}</p>
                      </div>                    
                    </div>
                  </div>
                </div>
            </div>
        </div>
        <p class="mt-8 text-[20px] font-poppins_medium text-gray" v-else>You have not ordered any products</p>
    </section>
</template>