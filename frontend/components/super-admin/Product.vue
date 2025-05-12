<script setup lang="ts">
    import { API } from '#imports';
    import RupiahFormat from '~/utils/RupiahFormat';
    import { onMounted, ref } from '#imports';
    import { useRouter } from 'vue-router';
    import cookie from 'js-cookie';
    import AOS from 'aos';
    import 'aos/dist/aos.css';
    import right from '~/public/icon/right.svg'
    import left from '~/public/icon/left.svg'
    import { Path } from '~/utils/Path';
    
    interface productDataProp {
        name: string,
        image: string,
        description: string,
        quantity: number,
        price: number,
        category: any,
        user: any,
    }

    const token = cookie.get('token');
    const navigate = useRouter();
    const productData = ref<productDataProp[]>([]);
    const selectedValue = ref('');
    const nextPage = ref('');
    const prevPage = ref('');
    const categoryData = ref<productDataProp[]>([]);

    const fetchProduct = async (customUrl?: string) => {
        try {
            let url = '';
            if (customUrl) {                
                url = `/super/product${customUrl}&category=${selectedValue.value}`;
            } else {
                url = `/super/product/?page=1&category=${selectedValue.value}`;
            }

            const response = await API.get(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            productData.value = response.data.products.data;
            nextPage.value = response.data.products.meta.nextPageUrl;
            prevPage.value = response.data.products.meta.previousPageUrl;
        } catch (error) {
            console.error(error);
        }
    }

    const fetchCategory = async() => {
        try {
            const response = await API.get('/category/product');
            categoryData.value = response.data.category;
        } catch (error) {
            console.error(error);
        }
    }

    onMounted(() => {
        AOS.init();
        fetchProduct();
        fetchCategory();
    });

    watch(selectedValue, async(newValue) => {
        if (newValue) {
            await fetchProduct();
        } else {
            await fetchProduct();
        }
    });
</script>

<template>
    <section class="min-h-screen" data-aos="fade-up" data-aos-duration="900">
        <div class="flex lg:flex-row flex-col justify-start lg:gap-0 gap-4 lg:justify-between items-start lg:items-center">
            <h1 class="text-[24px] lg:text-[30px] font-poppins_semibold">Product List</h1>
            <label class="border-2 flex justify-center gap-2 border-black p-2 rounded-md">
                <p class="lg:text-[14px] responsive text-[12px] font-poppins_medium">Category : </p>
                <select v-model="selectedValue" class="outline-none cursor-pointer border-none text-[12px] lg:text-[14px] font-poppins_regular">
                    <option value="" selected>All Category</option>
                    <option :value="category.name" v-for="(category, index) in categoryData" :key="index">{{ `${index + 1} | ${category.name}` }}</option>
                </select>
            </label>
        </div>
        <div class="lg:mt-8 mt-14 flex justify-center lg:justify-start flex-wrap items-center lg:gap-8 gap-4">
            <div class="" v-if="productData.length > 0" v-for="(product, index) in productData" :key="index">
                <div class="bg-white h-auto w-[140px] lg:w-[220px] p-4 rounded-lg">
                    <img class="w-full rounded-md mx-auto h-auto" :src="`${Path}/image/${product.image}`" alt=""/>
                    <div class="mt-3 flex flex-col gap-1">
                        <h1 class="lg:text-[16px] text-[14px] text-primary font-poppins_medium">{{ product.name.length > 12 ? product.name.slice(0, 12) + '...' : product.name }}</h1>
                        <p class="lg:text-[14px] text-[10px] font-poppins_regular">{{ product.category.name }}</p>
                        <p class="lg:text-[14px] text-[12px] font-poppins_medium text-secondary">{{ RupiahFormat(product.price) }}</p>
                        <p class="lg:text-[12px] text-[10px] font-poppins_regular">created by : {{ product.user.username }}</p>
                    </div>
                </div>
            </div>
            <div class="mt-2" v-else>
                <p class="text-gray font-poppins_medium text-[24px]">Data not Found</p>
            </div>
        </div>
        <div class="lg:mt-30 mt-20 flex justify-center items-center gap-4">
            <button @click="() => prevPage && fetchProduct(prevPage)" :class="prevPage == null ? 'bg-[#b8b8b8]' : 'bg-primary'" class="p-1 rounded-md cursor-pointer hover:-translate-x-2 duration-150">
                <img class="w-[26px] lg:w-[32px] h-auto" :src="left" alt=""/>
            </button>
            <button @click="() => nextPage && fetchProduct(nextPage)" :class="nextPage == null ? 'bg-[#b8b8b8]' : 'bg-primary'" class="p-1 rounded-md cursor-pointer hover:translate-x-2 duration-150">
                <img class="w-[26px] lg:w-[32px] h-auto" :src="right" alt=""/>
            </button>
        </div>
    </section>
</template>