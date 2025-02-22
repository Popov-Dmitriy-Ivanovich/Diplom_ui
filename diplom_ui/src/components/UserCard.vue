<script>
// import ActionStatus from './ActionStatus.vue'
import { IconChevronLeft } from '@tabler/icons-vue'
import { get_cookie } from './cookie';


export default {
    props: {
        user_id: Number
    },
    data() {
        return {
            login: null,
            access_rights: null,
            password: null,
        }
    },
    components: {},
    emits: [],

    mounted() {
        let token = get_cookie("token")
        let origin = window.location.origin;
        let url = origin + "/auth/user/" + this.user_id;
        fetch(url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": token
            }
        }).then(resp => {
            if (resp.status == 401) {
                this.$router.push("/login")
            }
            resp.json().then(body => {
                console.log(body)
                this.login = body.user.Login
                this.access_rights = body.user.AccessRights
            })
        })
    },
    methods: {
        remove_ar(ar) {
            let new_ar = this.access_rights & (~ar)
            this.access_rights = 0

            this.access_rights = new_ar
        },

        add_ar(ar) {
            this.access_rights = this.access_rights | ar
        }
    }

}
</script>

<template>
    <div class="UserCard">
        <span> Логин:</span>
        <input type="text" v-model="this.login">
        <span> Пароль: </span>
        <input type="text" v-model="this.password" />
        <div v-if="((access_rights & (1 << 1)) != 0)" @click="remove_ar(1 << 1)">
            Создание пользователетей
        </div>
        <div v-if="((access_rights & (1 << 2)) != 0)" @click="remove_ar(1 << 2)">
            Создание действий
        </div>
        <div v-if="((access_rights & (1 << 3)) != 0)" @click="remove_ar(1 << 3)">
            Запуск действий
        </div>

        <div v-if="((access_rights & (1 << 1)) == 0)" @click="add_ar(1 << 1)">
            + Создание пользователетей
        </div>
        <div v-if="((access_rights & (1 << 2)) == 0)" @click="add_ar(1 << 2)">
            + Создание действий
        </div>
        <div v-if="((access_rights & (1 << 3)) == 0)" @click="add_ar(1 << 3)">
            + Запуск действий
        </div>
    </div>
</template>

<style>
.UserCard {
    display: flex;
    flex-direction: column;
    border: 2px solid red;
    border-radius: 15px;
    padding: 5% 10%;
}
</style>