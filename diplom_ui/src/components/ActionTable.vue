<script>
import Action from './Action.vue'
import ActionData from './ActionData.vue'
import { IconReload } from '@tabler/icons-vue';
import { get_cookie } from './cookie.js';

export default {
    data() {
        return {
            text: '',
            fetch_error: null,
            action_ids: [],
            show_action_data: null
        }
    },
    mounted() {
        if (!get_cookie("token")) {
            this.$router.push("/login")
        }
        this.fetch_action_ids()
    },
    components: {
        Action, ActionData, IconReload
    },
    methods: {
        fetch_action_ids() {
            this.action_ids = []
            let origin = window.location.origin;
            let url_group = origin + "/api/actions";
            fetch(url_group).then(resp => {
                if (resp.status != 200) {
                    this.fetch_error = "Не удалось получить список действий"
                    return
                }
                resp.json().then(body => {
                    this.action_ids = body.ids;
                })
            })
        }
    }
}
</script>

<template>
    <div class="Content">
        <div class="TopScreenPanel">
            <div @click="fetch_action_ids" class="PageNameContainer" v-if="!show_action_data">
                <h1 class="PageName"> Доступные программы&nbsp;
                    <IconReload />
                </h1>
            </div>
        </div>
        <div class="ActionTableContainer">
            <table v-if="action_ids && !this.show_action_data" class="ActionContainer">
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
            <div v-if="this.show_action_data" class="ActionDataMainPageContainer">
                <ActionData :action_id="this.show_action_data" @action_launched="(msg) => this.fetch_action_ids()"
                    @action_stoped="(msg) => this.fetch_action_ids()"
                    @action_clicked="(msg) => this.show_action_data = null" />
            </div>
        </div>
    </div>
</template>

<style>
html,
body {
    padding: 0%;
    margin: 0%;
    font-family: 'Montserrat';
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