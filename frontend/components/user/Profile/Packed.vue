<script lang="ts" setup>
    import { API } from '#imports';
    import { onMounted, ref } from '#imports';
    import cookie from 'js-cookie';
    import RupiahFormat from '~/utils/RupiahFormat';
    import AOS from 'aos';
    import 'aos/dist/aos.css';
    import { Path } from '~/utils/Path';

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
        quantity: number
    }

    const transactionData = ref<transactionDataProp[]>([]);
    const token = cookie.get('token');    

    onMounted(() => {
        AOS.init();
        const fetchPackedUser = async() => {
            try {
                const response = await API.get('/user/transaction?status=packed', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                transactionData.value = response.data.transaction;
            } catch (error) {
                console.error(error);
            }
        }

        fetchPackedUser();
    });
</script>

<template>
    <section data-aos="fade-up" data-aos-duration="900">
        <h1 class="text-[26px] lg:text-[30px] font-poppins_semibold">Packed</h1>
        <div class="mt-8 flex flex-col gap-8" v-if="transactionData.length > 0">
            <div class="" v-for="(transaction, index) in transactionData" :key="index">
                <div class="border-2 bg-white flex lg:flex-row flex-col justify-between p-5 w-full lg:w-[90%] border-primary rounded-xl" data-aos="fade-up" data-aos-duration="900">
                    <div class="flex lg:flex-row flex-col justify-start items-center gap-6">
                        <img class="lg:w-[110px] w-[120px] rounded-md h-auto" :src="`${Path}/image/${transaction.product.image}`" alt=""/>
                        <div class="flex flex-col w-full lg:gap-1 gap-2">
                            <h1 class="text-[18px] font-poppins_medium">{{ transaction.product.name }}</h1>
                            <p class="text-[14px] text-gray font-poppins_regular">{{ transaction.product.category.name }}</p>
                            <p class="text-[18px] font-poppins_medium text-secondary">{{ RupiahFormat(transaction.total) }}</p>
                            <p class="text-[12px] text-gray font-poppins_regular">Currently packed, expected to arrive in 3-4 days</p>
                        </div>
                    </div>
                    <div class="flex flex-col lg:mt-0 mt-4 justify-end items-start lg:items-end">
                        <p class="text-[14px] text-gray font-poppins_regular">{{ `Total ${transaction.quantity} product: ${RupiahFormat(transaction.total)}` }}</p>
                    </div>
                </div>
            </div>
        </div>
        <p class="mt-8 text-[20px] font-poppins_medium text-gray" v-else>You have not ordered any products</p>
    </section>
</template>