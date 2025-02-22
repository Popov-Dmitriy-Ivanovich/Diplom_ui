<script>
// import ActionStatus from './ActionStatus.vue'
import UserCard from './UserCard.vue'
import { IconSquareRoundedPlus } from '@tabler/icons-vue'
import { get_cookie } from './cookie';


export default {
    props: {},
    data() {
        return {
            user_ids: null,
        }
    },
    components: { IconSquareRoundedPlus, UserCard },
    emits: [],

    mounted() {
        this.fetch_users()
    },
    methods: {
        fetch_users() {
            let token = get_cookie("token")
            let origin = window.location.origin;
            let url = origin + "/auth/user/";
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
                    this.user_ids = body.ids
                })
            })
        }
    }

}
</script>

<template>
    <div class="UsersComponentInternal">
        <h1 class="UserCardsContainerLabel"> Редактировать пользователей</h1>
        <div class="UserCardsContainer">
            <UserCard v-for="id in user_ids" :user_id="id" :should_create="false"
                @users_updated="(msg) => this.fetch_users()" />
            <UserCard :user_id=null :should_create=true @users_updated="(msg) => this.fetch_users()" />
        </div>
    </div>
</template>

<style>
.UsersComponentInternal {
    border: 2px solid rgb(255, 83, 83);
    border-radius: 15px;
    padding: 1% 0%;
    padding-bottom: 2%;
}

.UserCardsContainerLabel {
    text-align: center;
}

.UserCardsContainer {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    width: 100%;
}
</style>