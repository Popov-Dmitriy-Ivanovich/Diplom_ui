<script>
import Action from './Action.vue'
import ActionData from './ActionData.vue'
import CreateAction from './CreateAction.vue'
import Users from './Users.vue'
import { IconReload } from '@tabler/icons-vue';
import { get_cookie } from './cookie.js';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
export default {
    data() {
        return {
            text: '',
            fetch_error: null,
            action_ids: [],
            show_action_data: null,
            user: null,
            token: null,
            ar: null,
            new_action: null,
            new_user: {
                login: null,
                password: null,
                access_rights: null,
            },
            username: null,
        }
    },
    mounted() {
        if (!get_cookie("token") || !get_cookie("ar")) {
            this.$router.push("/login")
        }
        this.username = get_cookie("username")
        this.token = get_cookie("token")
        this.ar = get_cookie("ar")
        this.fetch_action_ids()

    },
    components: {
        Action, ActionData, IconReload, Users, CreateAction
    },
    methods: {
        fetch_action_ids() {
            this.action_ids = []
            let origin = window.location.origin;
            let url_group = origin + "/api/actions";
            fetch(url_group, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": get_cookie("token")
                }
            }).then(resp => {
                if (resp.status == 401) {
                    this.$router.push("/login")
                }
                if (resp.status != 200 && resp.status != 404) {
                    toast.error(resp.status, {
                        autoClose: 5000,
                    })
                    return
                }
                resp.json().then(body => {
                    this.action_ids = body.ids;
                })
            })
        },
        register_new_user() {
            console.log(this.new_user.login, this.new_user.password)
        },
        exit() {
            this.$router.push("/login")
        }
    }
}
</script>

<template>
    <div class="Header">
        <h1>Добро пожаловать, {{ this.username }}</h1>
        <button @click="exit">Выход</button>
    </div>
    <div class="Content">
        <div class="TopScreenPanel">
            <div @click="fetch_action_ids" class="PageNameContainer" v-if="!show_action_data">
                <h1 class="PageName"> Доступные действия&nbsp;
                    <IconReload />
                </h1>
            </div>
        </div>
        <div class="ActionTableContainer">
            <table v-if="((ar & (1 << 3)) != 0) && action_ids && !this.show_action_data" class="ActionContainer">
                <thead>
                    <tr>
                        <th scope="col">Название</th>
                        <th scope="col">Описание</th>
                        <th scope="col">Статус </th>
                        <!-- <th scope="col">Действие</th> -->
                    </tr>
                </thead>
                <tbody>
                    <tr class="EmptyRow"></tr>

                    <tr v-for="id in action_ids">
                        <Action :action_id="id" @action_launched="(msg) => this.fetch_action_ids()"
                            @action_stoped="(msg) => this.fetch_action_ids()"
                            @action_clicked="(msg) => this.show_action_data = msg" />
                    </tr>
                </tbody>
            </table>
            <div v-if="((ar & (1 << 3)) != 0) && this.show_action_data" class="ActionDataMainPageContainer">
                <ActionData :ar="this.ar" :action_id="this.show_action_data"
                    @action_launched="(msg) => this.fetch_action_ids()" @action_stoped="(msg) => this.fetch_action_ids()"
                    @action_clicked="(msg) => this.show_action_data = null" />
            </div>
        </div>
        <div v-if="((ar & (1 << 2)) != 0)" class="CreateActionComponent">
            <CreateAction @action_created="(msg) => this.fetch_action_ids()" />
        </div>
        <div v-if="((ar & (1 << 1)) != 0)" class="UsersComponent">
            <Users />
        </div>
    </div>
</template>

<style>
.CreateActionComponent {
    width: 100%;
    max-width: 60em;
}

.UsersComponent {
    width: 100%;
    max-width: 60em;
}

html,
body {
    padding: 0%;
    margin: 0%;
    font-family: 'Montserrat';
}

.Header {
    display: flex;
    justify-content: end;
    margin-top: 1%;
}

.Header h1 {
    font-size: 1.5rem;
    margin: 0% 0%;
}

.Header button {
    font-size: 1.1rem;
    margin: 0% 2%;
    background-color: #005bff;
    color: white;
    border-radius: 7px;
    border: none;
    padding: 0% 0.5%;
}

.CreateUserContainer {
    display: flex;
    flex-direction: column;
}

.ActionDataMainPageContainer {
    box-shadow: rgba(90, 67, 221, 0.09) 0px 48px 100px 0px;
    background-color: #f5f7fa;
    border-radius: 15px;
}

.Content {
    margin: 1%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.LeftPageNameSpace {
    width: 20%;
}

.TopScreenPanel {
    display: flex;
    flex-direction: row;
    /* max-width: 80em; */
    max-width: 60em;
    /* height: 5%; */
    /* padding: 1%; */
    width: 100%;
    justify-content: center;
    align-items: center;
}

.PageName {
    /* width: 60%; */
    margin-top: 5%;
    margin-bottom: 0%;
    /* margin: 0px; */
    font-size: 1.6rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    text-align: center;
    align-content: center;
    justify-content: center;
}

.UpdateButtonContainer {
    width: 20%;
    display: flex;
    justify-content: center;
    align-items: center
}

.UpdateButton {
    background-color: #005bff;
    color: white;
    border-radius: 7px;
    border: none;
    padding-left: 5%;
    padding-right: 5%;
    height: 2.5em;
    font-size: 1.1rem;
}

.ActionTableContainer {
    box-shadow: rgba(90, 67, 221, 0.07) 0px 48px 100px 0px;

    border-radius: 15px;
    border: 2px solid #005bff;
    max-width: 60em;
    /* height: 70%; */
    width: 100%;
    margin-top: 2%;
}

table {
    border-collapse: collapse;
    letter-spacing: 1px;
    width: 98%;
    margin: 1%;
}

.EmptyRow {
    height: 3px;
}

thead,
tfoot {
    background-color: #f5f7fa;
    text-align: left;
}

th,
td {
    text-align: left;
    border: none;
    padding: 8px 10px;
}

tbody>tr:nth-of-type(odd) {
    background-color: #f5f7fa;
}
</style>