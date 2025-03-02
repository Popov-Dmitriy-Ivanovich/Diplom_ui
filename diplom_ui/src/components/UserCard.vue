<script>
// import ActionStatus from './ActionStatus.vue'
import { IconSquareRoundedPlus, IconDeviceFloppy, IconTrashXFilled, IconCirclePlusFilled } from '@tabler/icons-vue'
import { get_cookie } from './cookie';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    props: {
        user_id: Number,
        should_create: Boolean
    },
    data() {
        return {
            login: null,
            access_rights: null,
            password: null,
        }
    },
    components: { IconSquareRoundedPlus, IconDeviceFloppy, IconTrashXFilled, IconCirclePlusFilled },
    emits: ["users_updated"],

    mounted() {
        if (this.should_create) {
            this.login = "Введите логин";
            this.access_rights = 0;
            this.password = "Введите пароль";
        } else {
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
                    return
                }
                if (resp.status != 200 && resp.status != 404) {
                    toast.error(resp.status, {
                        autoClose: 5000,
                    });
                    return
                }
                resp.json().then(body => {
                    console.log(body)
                    this.login = body.user.Login
                    this.access_rights = body.user.AccessRights
                })
            })
        }

    },
    methods: {
        remove_ar(ar) {
            let new_ar = this.access_rights & (~ar)
            this.access_rights = 0

            this.access_rights = new_ar
        },

        add_ar(ar) {
            this.access_rights = this.access_rights | ar
        },

        update_user() {
            let token = get_cookie("token")
            let origin = window.location.origin;
            let url = origin + "/auth/user/";
            fetch(url, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    id: this.user_id,
                    login: this.login,
                    password: this.password,
                    accessRights: this.access_rights
                })
            }).then(resp => {
                if (resp.status == 401) {
                    this.$router.push("/login")
                    return
                }
                if (resp.status != 200 && resp.status != 404) {
                    toast.error(resp.status, {
                        autoClose: 5000,
                    })
                    return
                }
                resp.json().then(body => {
                    toast.success("Пользователь обновлен!", {
                        autoClose: 5000,
                    });
                    this.password = null
                    this.$emit("users_updated", "update")
                })
            })
        },
        create_user() {
            let token = get_cookie("token")
            let origin = window.location.origin;
            let url = origin + "/auth/user/";
            fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    login: this.login,
                    password: this.password,
                    accessRights: this.access_rights
                })
            }).then(resp => {
                if (resp.status == 401) {
                    this.$router.push("/login")
                    return
                }
                if (resp.status != 200 && resp.status != 404) {
                    toast.error("Не удалось создать пользователя. Возможно login уже существует", {
                        autoClose: 5000,
                    })
                    return
                }
                resp.json().then(body => {
                    toast.success("Пользователь создан!", {
                        autoClose: 5000,
                    });
                    this.login = "Введите логин";
                    this.password = "Введите пароль";
                    this.$emit("users_updated", "create")
                })
            })
        },
        delete_user() {
            let token = get_cookie("token")
            let origin = window.location.origin;
            let url = origin + "/auth/user/" + this.user_id;
            fetch(url, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": token
                }
            }).then(resp => {
                if (resp.status == 401) {
                    this.$router.push("/login")
                    return
                }
                if (resp.status != 200 && resp.status != 404) {
                    toast.error(resp.status, {
                        autoClose: 5000,
                    })
                    return
                }
                resp.json().then(body => {
                    toast.success("Пользователь удален!", {
                        autoClose: 5000,
                    });
                    this.$emit("users_updated", "delete")
                })
            })
        }
    }

}
</script>

<template>
    <div class="UserCard">
        <h2 v-if="should_create"> Создать </h2>
        <h2 v-if="!should_create"> {{ this.login }} </h2>
        <span class="InputLabel"> Логин:</span>
        <input type="text" v-model="this.login">
        <span class="InputLabel"> Пароль: </span>
        <input type="text" v-model="this.password" />
        <div class="existingAR" v-if="((access_rights & (1 << 1)) != 0)" @click="remove_ar(1 << 1)">
            администратор
        </div>
        <div class="existingAR" v-if="((access_rights & (1 << 2)) != 0)" @click="remove_ar(1 << 2)">
            программист
        </div>
        <div class="existingAR" v-if="((access_rights & (1 << 3)) != 0)" @click="remove_ar(1 << 3)">
            пользователь
        </div>

        <div class="ArToAdd" v-if="((access_rights & (1 << 1)) == 0)" @click="add_ar((1 << 1) | (1 << 2) | (1 << 3))">
            <IconSquareRoundedPlus /> администратор
        </div>
        <div class="ArToAdd" v-if="((access_rights & (1 << 2)) == 0)" @click="add_ar((1 << 2) | (1 << 3))">
            <IconSquareRoundedPlus /> программист
        </div>
        <div class="ArToAdd" v-if="((access_rights & (1 << 3)) == 0)" @click="add_ar(1 << 3)">
            <IconSquareRoundedPlus /> пользователь
        </div>

        <div class="SaveDelete">
            <button v-if="!should_create" @click="update_user">
                <IconDeviceFloppy />
            </button>
            <button v-if="should_create" @click="create_user">
                <IconCirclePlusFilled />
            </button>
            <button v-if="!should_create" @click="delete_user">
                <IconTrashXFilled />
            </button>
        </div>
    </div>
</template>

<style>
.SaveDelete {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 0% 10%;
}

.UserCard {
    display: flex;
    flex-direction: column;
    border: 2px solid rgb(235, 139, 139);
    border-radius: 15px;
    padding: 1% 2%;
    background-color: #e3e4e6;
    margin: 0% 1%;
}

.UserCard input {
    border: 2px solid #6a707a;
    background-color: #e8ecef;
    border-radius: 5px;
    font-size: 1.1rem;
}

.UserCard span {
    color: black;
    font-size: 1.1rem;
    margin-top: 4%;
}

.UserCard button {
    display: flex;
    align-items: center;
    margin-top: 10%;

    background-color: #005bff;
    color: white;
    border-radius: 7px;
    border: none;
    padding-left: 15%;
    padding-right: 15%;
    height: 2.5em;
    font-size: 1.1rem;
}

.ArToAdd {
    background-color: #bbcfee;
    padding: 2% 3%;
    border-radius: 5px;
    margin-top: 2%;
    display: flex;
    align-items: start;
    align-content: center;
    font-size: 1.1rem;
    cursor: pointer;
}

.existingAR {
    background-color: #90b9f7;
    padding: 2% 3%;
    border-radius: 5px;
    margin-top: 2%;
    display: flex;
    align-items: start;
    align-content: center;
    font-size: 1.1rem;
    cursor: pointer;
}
</style>