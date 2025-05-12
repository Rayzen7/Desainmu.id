<script lang="ts" setup>
    import search from '~/public/icon/search.svg';
    import { useRoute, useRouter } from 'vue-router';
    import guest from '~/public/profile/guest.jpg';
    import { API } from '#imports';
    import { onMounted, ref, computed } from '#imports';
    import { watch } from '#imports';
    import cookie from 'js-cookie';
    import left from '~/public/icon/left-arrow.svg';    
    import send from '~/public/icon/send.svg';
    import AOS from 'aos';
    import 'aos/dist/aos.css';
    import Swal from 'sweetalert2';
    import { Path } from '~/utils/Path';

    interface chatProp {
        id: number,
        message: string,
        image: string,
        chat: any,
        sender: number,
        receiver: number,
        sender_user : {
            id: number,
            username: string,
            image: string,
        }
        receiver_user: {
            id: number,
            username: string,
            image: string
        },
        updatedAt: string,
        partner: {
            id: number,
            username: string,
            image: string,
        }
    }

    interface userDataProp {
        id: number,
        username: string,
        image: string,
        email: string,
        noHp: string,
        dateOfBirth: string,
        address: string,
        gender: string,
        role: any,
    }

    const navigate = useRouter();
    const allUserData = ref<chatProp[]>([]);
    const token = cookie.get('token');
    const searchName = ref('');
    const route = useRoute();
    const chatData = ref<chatProp[]>([]);
    const userId = computed(() => Number(route.query.user));
    const receiver = ref<userDataProp | null>(null);
    const receiverUsername = computed(() => receiver.value?.username);
    const selectedImage = ref<{ file: File | null, previewUrl: string | null }>({
      file: null,
      previewUrl: null,
    });
    const meId = ref<number | null>(null);        
    const roomId = computed(() => Number(route.query.room));
    const chatContainer = ref<HTMLElement | null>(null);
    const isOpen = ref(true);
    const isDesktop = ref(true);
    const checkScreenSize = () => {
      const isMobile = window.matchMedia('(max-width: 768px)').matches
      isDesktop.value = !isMobile;
    }

    const path = route.path;
    let chatInterval: string | number | NodeJS.Timeout | undefined;
    const chatMessage = ref({
        message: '',
        image: '',
    });

    const openImage = (imageUrl: any) => {
        selectedImage.value = {
          file: null,
          previewUrl: imageUrl,
        };
    };

    const closeImage = () => {
      selectedImage.value.previewUrl = null; 
    };

    onUnmounted(() => {
      window.removeEventListener('resize', checkScreenSize)
    });

    
    onMounted(() => {
        AOS.init();
        checkScreenSize()
        window.addEventListener('resize', checkScreenSize)

        const fetchReceiver = async() => {
            try {
                const response = await API.get(`/getuser/${userId.value}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                receiver.value = response.data.user;
            } catch (error) {
                console.error(error);
            }
        }

        const fetchMessage = async() => {
            try {
                const response = await API.get(`/room/admin/chat?name=${searchName.value}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const roomChat = response.data.roomChat.find((room: any) =>
                  room.id === roomId.value
                );

                if (roomChat) {
                  chatData.value = roomChat.chat;
                } else {
                  chatData.value = [];
                }

                allUserData.value = response.data.roomChat;
            } catch (error) {
                console.error(error);
            }
        }   

        const fetchMe = async() => {
            try {
               const response = await API.get('/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
               });

               meId.value = response.data.user.id;               
            } catch (error) {
                console.error(error);
            }
        }

        watch(searchName, async(newName) => {
            if (newName) {
                fetchMessage();
            } else {
                fetchMessage();
            }
        });

        const isAtBottom = (): boolean => {
          if (!chatContainer.value) return false;
          const { scrollTop, scrollHeight, clientHeight } = chatContainer.value;
          return scrollTop + clientHeight >= scrollHeight - 10; 
        };

        watch(chatData, () => {
          nextTick(() => {
            if (isAtBottom()) {
              scrollToBottom();
            }
          });
        });

        chatInterval = setInterval(() => {
            fetchMessage();           
            fetchReceiver();
            fetchMe();

            if (path !== '/super/chat') {
                clearInterval(chatInterval);
            }
        }, 1000);
    });

    onBeforeUnmount(() => {
        clearInterval(chatInterval);
    });

    const handleOpen = () => {
        isOpen.value = false;
    }
    
    const handleClose = () => {       
        isOpen.value = true;
        navigate.replace({ query: { ...route.query, user: undefined } });
    };

    function handleFileChange(event: Event) {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const previewUrl = URL.createObjectURL(file);
        selectedImage.value = {
          file,
          previewUrl,
        };
      }
    }

    const scrollToBottom = () => {
      nextTick(() => {
        if (chatContainer.value) {
          chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        }
      });
    };

    const handleMessage = async() => {
        const formData = new FormData();
        formData.append('sender', `${meId.value}`);
        formData.append('room_id', `${roomId.value}`);
        formData.append('message', chatMessage.value.message);
        formData.append('image', selectedImage.value.file ?? '');
        formData.append('receiver', `${userId.value}`);
        try {
            await API.post('/chat', formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            scrollToBottom();
            chatMessage.value.message = '';
            chatMessage.value.image = '';

            selectedImage.value = { file: null, previewUrl: null };
            const imageInput = document.getElementById('image') as HTMLInputElement;
            if (imageInput) imageInput.value = '';
        } catch (error) {
            console.error(error);
        }
    }

    const handleDeleteChat = async(id: any, sender: any) => {
        if (meId.value !== sender) {
            Swal.fire({
                title: 'Delete Forbidden',
                icon: 'error',
                confirmButtonColor: 'red',
                confirmButtonText: 'oke',
            });
            return;
        }        

        try {        
            Swal.fire({
                title: 'Delete Chat',
                text: 'Are you sure to delete your chat?',
                confirmButtonColor: 'red',
                confirmButtonText: 'yes',
                icon: 'question',
                showCancelButton: true,
                cancelButtonColor: 'green',
                cancelButtonText: 'no'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await API.delete(`/chat/${id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    Swal.fire({
                        icon: 'success',
                        title: response.data.message,
                        text: 'Your chat success deleted',
                        confirmButtonColor: 'green',
                        confirmButtonText: 'oke',
                    });
                }
            });
        } catch (error) {
            console.error(error);
        }
    }
</script>

<style scoped>
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }

    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
</style>

<template>
    <section>
        <div class="flex items-start justify-start gap-6">
            <div :class="(isOpen === false && !isDesktop) ? 'hidden' : 'block'" class="p-7 bg-white lg:border-1 border-0 rounded-lg border-[#B9B9B9] w-full lg:w-[300px] h-[85vh] overflow-y-auto no-scrollbar" data-aos="fade-up" data-aos-duration="900">
                <div class="flex-col gap-3 flex">
                    <h1 class="text-[24px] lg:text-[22px] font-poppins_semibold">Chat</h1>
                    <div class="flex mb-1 bg-[#F5F6FA] border-[#B9B9B9] border-1 rounded-md py-[10px] px-4 justify-start items-center gap-3">
                        <img class="h-auto w-[18px]" :src="search" alt=""/>
                        <input v-model="searchName" class="text-[12px] border-none outline-none font-poppins_regular" type="text" placeholder="Search">
                    </div>
                    <div class="flex mt-3 flex-col gap-6 overflow-hidden" v-for="(user, index) in allUserData" v-if="allUserData.length > 0" :key="index">                        
                        <nuxt-link :to="`/super/chat?user=${user.sender_user.id}&room=${user.id}`">
                            <div class="flex justify-start gap-3 items-center cursor-pointer shrink-0" @click="handleOpen">
                                <img :class="user.sender_user.image === null ? 'w-[32px] h-[32px]' : 'w-[38px] h-[38px]'" class="rounded-full " :src="user.sender_user.image === null ? guest : `${Path}/account/${user.sender_user.image}`" alt=""/>
                                <div class="flex justify-between w-full items-start">
                                    <div>
                                        <h1 class="text-[14px] text-primary font-poppins_medium">{{ user.sender_user.username }}</h1>
                                        <p class="text-[12px] font-poppins_regular text-gray">
                                            {{
                                              user.chat.length > 0
                                                ? (user.chat[user.chat.length - 1].message.length > 20
                                                    ? user.chat[user.chat.length - 1].message.slice(0, 20) + '...'
                                                    : user.chat[user.chat.length - 1].message)
                                                : ''
                                            }}
                                        </p>
                                    </div>
                                    <div class="">
                                        <p class="text-gray text-[10px] font-poppins_regular">{{ new Date(user.chat[user.chat.length - 1]?.updatedAt ?? null).getHours().toString().padStart(2, '0') }}:{{ new Date(user.chat[user.chat.length - 1]?.updatedAt ?? null).getMinutes().toString().padStart(2, '0') }}</p>
                                    </div>
                                </div>
                            </div>
                        </nuxt-link>
                    </div>
                    <div class="" v-else>
                        <p class="text-[14px] font-poppins_regular text-gray">User not Found</p>
                    </div>
                </div>
            </div>
            <div v-if="userId" class="bg-white relative border-1 rounded-lg border-[#B9B9B9] w-full lg:w-[650px] h-[85vh] overflow-y-auto no-scrollbar">
                <div class="px-5 py-7 gap-4 absolute top-0 left-0 flex items-center h-[8vh] w-full lg:w-[650px] border-b-[1px] border-[#B9B9B9]">
                    <img @click="handleClose" :src="left" class="w-[30px] cursor-pointer h-auto" alt=""/>
                    <p class="text-[18px] font-poppins_medium">{{ receiverUsername || 'Loading...' }}</p>
                </div>
                <div v-if="selectedImage.previewUrl" 
                     class="fixed inset-0 flex-col bg-black flex justify-center items-center z-50" 
                     @click="closeImage">
                     <p class="text-white font-poppins_medium text-[24px] lg:text-[30px] mb-4 cursor-pointer">Preview</p>
                    <img :src="selectedImage.previewUrl" class="max-w-[90%] max-h-[70%] object-contain" @click.stop />
                </div>
                <div ref="chatContainer" class="lg:my-20 my-16 overflow-y-scroll no-scrollbar h-[60vh]" data-aos="fade-up" data-aos-duration="900" data-aos-delay="40">
                    <div class="px-7 mt-12 lg:mt-6" v-for="(chat, index) in chatData" :key="index">
                        <div class="flex w-full" :class="chat.sender === userId ? 'justify-start' : 'justify-end'">
                            <div class="flex items-end gap-3" :class="chat.sender === userId ? 'flex-row' : 'flex-row-reverse'">
                                <img class="w-[40px] translate-y-4 h-auto rounded-full" :src="chat.sender_user.image === null ? guest : `${Path}/account/${chat.sender_user.image}`" alt=""/>
                                <div class="" :class="chat.sender === userId ? 'bg-[#F5F5F5] p-4 rounded-t-md rounded-r-md' : 'bg-primary p-4 text-white rounded-t-md rounded-l-md'">
                                    <img @click="openImage(`${Path}/${chat.image}`)" :src="`${Path}/${chat.image}`" class="w-[200px] h-auto cursor-pointer rounded-lg" :class="chat.image === null ? 'hidden mb-0' : 'mb-3 block'" alt=""/>
                                    <p class="text-[13px] max-w-[200px] font-poppins_regular">{{ chat.message }}</p>
                                    <div class="flex mt-2 items-center gap-2" :class="chat.sender === userId ? 'flex-row-reverse justify-end' : 'flex-row justify-end'">
                                        <p class="text-[10px] font-poppins_regular">{{ new Date(chat.updatedAt).getHours().toString().padStart(2, '0') }}:{{ new Date(chat.updatedAt).getMinutes().toString().padStart(2, '0') }}</p>
                                        <svg @click="handleDeleteChat(chat.id, chat.sender_user.id)" class="w-[3px] cursor-pointer h-auto" viewBox="0 0 5 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.23055 3.98939C3.26558 3.98939 4.10465 3.22428 4.10465 2.28046C4.10465 1.33665 3.26558 0.571533 2.23055 0.571533C1.19551 0.571533 0.356445 1.33665 0.356445 2.28046C0.356445 3.22428 1.19551 3.98939 2.23055 3.98939Z" :class="chat.sender === userId ? 'fill-[#757575]' : 'fill-white'"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.23055 10.8251C3.26558 10.8251 4.10465 10.06 4.10465 9.11616C4.10465 8.17234 3.26558 7.40723 2.23055 7.40723C1.19551 7.40723 0.356445 8.17234 0.356445 9.11616C0.356445 10.06 1.19551 10.8251 2.23055 10.8251Z" :class="chat.sender === userId ? 'fill-[#757575]' : 'fill-white'"/>
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M2.23055 17.6608C3.26558 17.6608 4.10465 16.8957 4.10465 15.9518C4.10465 15.008 3.26558 14.2429 2.23055 14.2429C1.19551 14.2429 0.356445 15.008 0.356445 15.9518C0.356445 16.8957 1.19551 17.6608 2.23055 17.6608Z" :class="chat.sender === userId ? 'fill-[#757575]' : 'fill-white'"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="px-5 py-7 absolute bottom-0 gap-4 z-10 flex items-center h-[8vh] w-full lg:w-[650px] border-t-[1px] border-[#B9B9B9]">
                    <input @keyup.enter="handleMessage" v-model="chatMessage.message" class="border-0 outline-none font-poppins_regular text-[12px] w-full" type="text" placeholder="Your message...">
                    <div class="flex gap-4 items-center shrink-0">
                        <label for="image">
                            <svg width="14" class="w-[16px] cursor-pointer h-auto" height="19" viewBox="0 0 14 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path :class="selectedImage.file ? 'fill-primary' : 'fill-[#9D9D9D]'" class="hover:fill-primary duration-200" d="M13.5893 4.85327V5.06421H9.08926V0.564209H9.3002C9.51114 0.564209 9.72207 0.669678 9.89786 0.845459L13.308 4.25562C13.4838 4.4314 13.5893 4.64233 13.5893 4.85327ZM8.80801 6.18921H13.5893V17.7205C13.5893 18.2126 13.2025 18.5642 12.7455 18.5642H0.933012C0.440825 18.5642 0.089262 18.2126 0.089262 17.7205V1.40796C0.089262 0.950928 0.440825 0.564209 0.933012 0.564209H7.96426V5.34546C7.96426 5.83765 8.31582 6.18921 8.80801 6.18921ZM4.02676 6.75171C3.1127 6.75171 2.33926 7.52515 2.33926 8.43921C2.33926 9.38843 3.1127 10.1267 4.02676 10.1267C4.97598 10.1267 5.71426 9.38843 5.71426 8.43921C5.71426 7.52515 4.97598 6.75171 4.02676 6.75171ZM11.3393 15.1892V11.2517L9.96817 9.88062C9.79239 9.70483 9.51114 9.70483 9.37051 9.88062L5.71426 13.5017L4.34317 12.1306C4.16739 11.9548 3.92129 11.9548 3.74551 12.0955L2.37442 13.5017L2.33926 15.1892H11.3393Z"/>
                            </svg>
                        </label>
                        <input @keyup.enter="handleMessage" @change="handleFileChange" type="file" id="image" class="hidden">
                        <button @click="handleMessage" class="bg-primary text-white flex justify-center items-center gap-2 px-4 py-2 rounded-lg cursor-pointer">
                            <p class="text-[12px] font-poppins_medium">Send</p>
                            <img :src="send" alt=""/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>