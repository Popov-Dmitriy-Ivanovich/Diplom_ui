<script>
import Action from './components/Action.vue'

export default {
    data() {
        return {
            text: '',
            fetch_error: null,
            action_ids: []
        }
    },
    components: {
        Action
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
            <div class="LeftPageNameSpace"></div>
            <h1 class="PageName"> Доступные программы </h1>
            <div class="UpdateButtonContainer">
                <button @click="fetch_action_ids" class="UpdateButton">
                    Обновить
                </button>
            </div>
        </div>
        <div class="ActionTableContainer">
            <table v-if="action_ids" class="ActionContainer">
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
                            @action_stoped="(msg) => this.fetch_action_ids()" />
                    </tr>
                </tbody>
            </table>
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
    max-width: 80em;
    /* height: 5%; */
    /* padding: 1%; */
    width: 100%;
}

.PageName {
    width: 60%;
    margin: 0px;
    font-size: 2rem;
    text-align: center;
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
}

.ActionTableContainer {
    border-radius: 15px;
    border: 2px solid #005bff;
    max-width: 80em;
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