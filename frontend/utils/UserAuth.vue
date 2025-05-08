<script setup lang="ts">
    import { API } from '#imports';
    import { onMounted, ref } from '#imports';
    import { useRouter } from 'vue-router';
    import cookie from 'js-cookie';

    interface userDataProp {
        id: number,
        roleId: number
    }

    const navigate = useRouter();
    const token = cookie.get('token');
    const userData = ref<userDataProp[]>([]);

    onMounted(() => {
        const fetchUser = async() => {
            const response = await API.get('/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const roleId = response.data.user.roleId;
            if (roleId !== 3) {
                cookie.remove('token');
                window.location.reload();
            }
        }

        fetchUser();
    });
</script>

<template>
    <slot/>
</template>