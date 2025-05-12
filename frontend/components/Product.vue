<script setup lang="ts">
    import { categoryIcon } from '~/data/CategoryData';
    import { ref, onMounted } from 'vue';
    import { API } from '#imports';
    import RupiahFormat from '~/utils/RupiahFormat';
    import star from '/home/product/star.png'
    import { productService, testimonial } from '~/data/ProductData';
    import right from '~/public/icon/right.svg'
    import left from '~/public/icon/left.svg'
    import { Path } from '~/utils/Path';

    interface productDataProp {
        id: number,
        name: string,
        image: string,
        description: string,
        quantity: number,
        price: number,
        category_id: number,
        created_by: number,
        category: any,
        transactionCount: number,
    }

    interface categoryDataProp {
        id: number,
        name: string
    }

    const productData = ref<productDataProp[]>([]);
    const categoryData = ref<categoryDataProp[]>([]);
    const selectedValue = ref('');
    const nextPage = ref('');
    const prevPage = ref('');

    const fetchProduct = async (customUrl?: string) => {
        try {
            let url = '';
            if (customUrl) {                
                url = `/product${customUrl}&category=${selectedValue.value}`;
            } else {
                url = `/product/?page=1&category=${selectedValue.value}`;
            }

            const response = await API.get(url);
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
        fetchCategory();
        fetchProduct();
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
    <section class="flex lg:flex-row flex-col-reverse justify-center items-start gap-12 mt-16 lg:mt-14" id="product">
        <div class="flex flex-col gap-12 lg:justify-normal justify-center lg:items-start items-center lg:w-auto w-full">
            <div class="flex w-[20vw] responsive-flex flex-col justify-center gap-8 border-2 border-primary p-6 rounded-lg">
                <div class="" v-for="(category, index) in categoryIcon" :key="index">
                    <div class="flex justify-between cursor-pointer group items-center">
                        <div class="flex justify-center items-center gap-3">
                            <img class="w-[20px] h-auto group-hover:rotate-[15deg] group-hover:w-[22px] duration-200" :src="category.image" alt="">
                            <p class="text-gray font-poppins_medium text-[15px] group-hover:text-black group-hover:translate-x-1 duration-150">{{ category.name }}</p>
                        </div>
                        <p class="text-[16px] group-hover:text-black duration-150 font-poppins_medium text-gray">{{ category.quantity }}</p>
                    </div>
                </div>
            </div>
            <div class="lg:mx-0 lg:w-auto w-[80vw] mx-4">
                <div class="">
                    <h1 class="lg:text-[30px] text-[20px] font-poppins_medium">Our Services</h1>
                    <hr class="lg:w-full w-[160px] mt-2 lg:mt-3 h-[2px] border-none outline-none bg-black"/>
                </div>
                <div class="lg:mt-12 mt-8 flex flex-col gap-8 border-2 border-black rounded-xl p-6">
                    <div class="" v-for="(service, index) in productService" :key="index">
                        <div class="flex justify-start items-center gap-6">
                            <img class="lg:w-[40px] w-[30px] h-[30px] lg:h-[40px]" :src="service.img" alt=""/>
                            <div class="flex flex-col gap-1">
                                <h1 class="lg:text-[16px] text-[14px] font-poppins_medium">{{ service.title }}</h1>
                                <p class="text-gray text-[12px] lg:text-[14px] font-poppins_regular">{{ service.desc }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="lg:w-[64vw] w-auto lg:mx-0 mx-4 h-auto lg:justify-normal flex flex-col gap-20">
            <div class="">
                <div class="flex justify-between items-center">
                    <div class="">
                        <h1 class="lg:text-[34px] text-[20px] font-poppins_medium text-black">Product</h1>
                        <hr class="lg:w-[200px] w-[120px] mt-2 lg:mt-3 h-[2px] border-none outline-none bg-black"/>
                    </div>
                    <label class="border-2 flex justify-center gap-2 border-black p-2 rounded-md">
                        <p class="lg:text-[14px] responsive text-[12px] font-poppins_medium">Category : </p>
                        <select v-model="selectedValue" class="outline-none cursor-pointer border-none text-[12px] lg:text-[14px] font-poppins_regular">
                            <option value="" selected>All Category</option>
                            <option :value="category.name" v-for="(category, index) in categoryData" :key="index">{{ `${index + 1} | ${category.name}` }}</option>
                        </select>
                    </label>
                </div>
                <div class="mt-10 flex flex-wrap items-center gap-x-6 gap-y-12" :class="productData.length == 0 ? 'justify-center' : 'justify-start'">
                    <div class="" v-if="productData.length > 0" v-for="(product, index) in productData" :key="index">
                        <nuxt-link :to="`/user/product/${product.id}`">
                            <div class="flex lg:flex-row flex-col relative cursor-pointer lg:px-2 p-4 justify-start items-center border-2 border-primary w-[150px] lg:w-[275px] min-h-[230px] lg:min-h-[130px] rounded-xl">
                                <img :src="`${Path}/image/${product.image}`" alt="" class="w-[80px] h-auto"/>
                                <div class="flex flex-col gap-1 lg:mt-0 mt-3">
                                    <h1 class="lg:text-[15px] text-[14px] text-start font-poppins_medium">{{ product.name }}</h1>   
                                    <p class="text-[12px] text-start text-gray font-poppins_regular">{{ product.category.name }}</p>
                                    <p class="text-[14px] text-start font-poppins_regular text-secondary">{{ RupiahFormat(product.price) }}</p>
                                </div>
                                <div class="flex justify-center lg:w-auto w-[90%] absolute font-poppins_regular items-center lg:translate-0 lg:left-[50%] -translate-x-[50%] left-[50%] bottom-[-18px] gap-4 bg-primary text-white px-4 py-2 rounded-md">
                                    <div class="flex justify-center items-center gap-1">
                                        <img :src="star" class="lg:w-[14px] w-[12px] h-auto" alt=""/>
                                        <p class="lg:text-[12px] text-[10px]">5</p>
                                    </div>
                                    <p class="lg:text-[12px] text-[10px]">{{ `${product.transactionCount}+ Sold` }}</p>
                                </div>
                            </div>
                        </nuxt-link>
                    </div>  
                    <div class="text-center text-[24px] mt-14 lg:mt-20 text-gray font-poppins_medium" v-else>
                        <p>Data Not Found</p>
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
            </div>
            <div class="">
                <div class="">
                    <h1 class="lg:text-[34px] text-[20px] font-poppins_medium text-black">Testimonial</h1>
                    <hr class="lg:w-[260px] w-[160px] mt-2 lg:mt-3 h-[2px] border-none outline-none bg-black"/>
                </div>
                <div class="lg:mt-12 mt-8 flex lg:flex-row flex-col justify-center items-center gap-8">
                    <div class="" v-for="(test, index) in testimonial" :key="index">
                        <div class="p-4 border-2 rounded-xl flex flex-col gap-5" :class="test.color == 'primary' ? 'border-primary' : 'border-secondary'">
                            <div class="flex justify-start items-center gap-4">
                                <img :src="test.img" class="w-[60px] h-auto" alt=""/>
                                <div class="">
                                    <h1 class="font-poppins_medium text-[18px]">{{ test.name }}</h1>
                                    <p class="text-[14px] font-poppins_regular">{{ test.region }}</p>
                                </div>
                            </div>
                            <p class="text-[13px] font-poppins_medium text-justify">{{ test.test }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>