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
        if (!token) {
            navigate.push('/');
        }

        const fetchUser = async() => {
            const response = await API.get('/me', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const roleId = response.data.user.roleId;
            if (roleId !== 1) {
                cookie.remove('token');
                navigate.push('/');
            }
        }

        fetchUser();
    });
</script>

<template>
    <slot/>
</template>