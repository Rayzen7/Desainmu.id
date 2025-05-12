<script setup lang="ts">
    import { API } from '#imports';
    import { onMounted, ref } from '#imports';
    import cookie from 'js-cookie';
    import { useRouter, useRoute } from 'vue-router';
    import preview from '~/public/product/preview.jpg';
    import Swal from 'sweetalert2';
    import AOS from 'aos';
    import 'aos/dist/aos.css';
    import { Path } from '~/utils/Path';

    interface productDataProp {
        id: number,
        name: string,
        category: {
            name: string,
        }
    }

    const token = cookie.get('token');
    const categoryData = ref<productDataProp[]>([]);
    const selectedImage = ref<File | null>(null);
    const previewImage = ref<string | null>(null);
    const navigate = useRouter();
    const route = useRoute();
    const id = route.params.id;
    const productPostData = ref({
        name: '',
        quantity: 0,
        description: '',
        price: '',
        category: '',
    })

    onMounted(() => {
        AOS.init();
        const fetchCategory = async() => {
            try {
                const response = await API.get('/category/product', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                categoryData.value = response.data.category;
            } catch (error) {
                console.error(error);
            }
        }

        const fetchProductId = async() => {
            try {
                const response = await API.get(`/admin/product/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const getById = response.data.product;
                productPostData.value.name = getById.name;
                previewImage.value = `${Path}/image/${getById.image}`; 
                productPostData.value.quantity = getById.quantity;
                productPostData.value.price = getById.price;
                productPostData.value.category = getById.categoryId;
                productPostData.value.description = getById.description;
            } catch (error) {
                console.error(error);
            }
        }

        fetchCategory();
        fetchProductId();
    });

    // const handleFileChange = (e: any) => {
    //     const file = e.target.files[0];
    //     selectedImage.value = file;
    //     previewImage.value = URL.createObjectURL(file);
    // }

    const handleFileChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        if (!target || !target.files || target.files.length === 0) return;
        const file = target.files[0];
        selectedImage.value = file;
  
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
  
            const size = Math.min(img.width, img.height);
            canvas.width = size;
            canvas.height = size;
  
            ctx?.drawImage(img, (img.width - size) / 2, (img.height - size) / 2, size, size, 0, 0, size, size);
            const croppedUrl = canvas.toDataURL('image/png');
            previewImage.value = croppedUrl;
  
            canvas.toBlob((blob) => {
              if (blob) {
                const croppedFile = new File([blob], file.name, {
                  type: 'image/png',
                  lastModified: Date.now(),
                });
                selectedImage.value = croppedFile;
              }
            }, 'image/png');
          };
  
          if (event.target?.result) {
            img.src = event.target.result as string;
          }
        };
  
        reader.readAsDataURL(file);
    };

    const handleSubmit = async() => {
        try {
            Swal.fire({
                didOpen: () => {
                    Swal.showLoading();
                },
                timer: 1000,
                title: "Please Wait..."
            });

            await new Promise(resolve => setTimeout(resolve, 1000));
            const formData = new FormData();
            formData.append('_method', 'PUT');
            formData.append('name', productPostData.value.name);
            formData.append('image', selectedImage.value ?? '');
            formData.append('description', productPostData.value.description);
            formData.append('quantity', `${productPostData.value.quantity}`);
            formData.append('price', `${productPostData.value.price}`);
            formData.append('category_id', `${productPostData.value.category}`);
            const response = await API.put(`/admin/product/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            Swal.fire({
                title: response.data.message,
                text: 'You can redirect to Product Page',
                icon: 'success',
                confirmButtonColor: 'green',
                confirmButtonText: 'Success'
            });

            setTimeout(() => {
                navigate.push('/admin/product');
            }, 3000);
        } catch (error: any) {
            Swal.fire({
                title: error.response.data.message,
                icon: 'error',
                confirmButtonColor: 'red',
                confirmButtonText: 'Error'
            });
        }
    }
</script>

<template>
    <section data-aos="fade-up" data-aos-duration="900">
        <div class="">
            <h1 class="text-[24px] lg:text-[30px] font-poppins_semibold">Edit Product</h1>
        </div>
        <div class="mt-8 lg:flex-row flex-col flex justify-center items-center lg:items-start gap-10">
            <div class="">
                <img :src="previewImage ? previewImage : preview" alt="" class="lg:w-[380px] w-[280px] h-auto rounded-md"/>
            </div>
            <div class="flex flex-col gap-8">
                <div class="flex flex-col gap-2">
                    <label class="text-[16px] font-poppins_medium">Product Name: </label>
                    <input v-model="productPostData.name" class="border-2 border-black outline-0 rounded-md w-[260px] px-3 font-poppins_regular text-[14px] py-3" type="text" placeholder="Your Product"/>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-[16px] font-poppins_medium">Image: </label>
                    <input @change="handleFileChange" class="border-2 border-black outline-0 rounded-md w-[260px] px-3 font-poppins_regular text-[14px] py-3 cursor-pointer" type="file"/>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-[16px] font-poppins_medium">Quantity: </label>
                    <input v-model="productPostData.quantity" class="border-2 border-black outline-0 rounded-md w-[260px] px-3 font-poppins_regular text-[14px] py-3" type="number" placeholder="Quantity"/>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-[16px] font-poppins_medium">Description: </label>
                    <textarea v-model="productPostData.description" class="border-2 h-[120px] border-black outline-0 rounded-md w-[260px] px-3 font-poppins_regular text-[14px] py-3" type="text" placeholder="Your Description"/>
                </div>
            </div>
            <div class="flex flex-col gap-8">
                <div class="flex flex-col gap-2">
                    <label class="text-[16px] font-poppins_medium">Price: </label>
                    <input v-model="productPostData.price" class="border-2 border-black outline-0 rounded-md w-[260px] px-3 font-poppins_regular text-[14px] py-3" type="number" placeholder="Your Product"/>
                </div>
                <div class="flex flex-col gap-2">
                    <label class="text-[16px] font-poppins_medium">Category: </label>
                    <select v-model="productPostData.category" class="border-2 border-black outline-0 rounded-md w-[260px] px-3 cursor-pointer font-poppins_regular text-[14px] py-3">
                        <option disabled selected value="">Select Category</option>
                        <option :value="category.id" v-for="(category, index) in categoryData" :key="index">
                            {{ category?.name }}
                        </option>
                    </select>
                </div>
                <button @click="handleSubmit" class="w-full h-[50px] cursor-pointer mt-2 border-2 border-primary hover:text-primary hover:bg-transparent duration-200 rounded-md text-[14px] font-poppins_medium text-white bg-primary">Edit Product</button>
            </div>
        </div>
    </section>
</template>