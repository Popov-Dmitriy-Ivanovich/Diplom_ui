<script>
import ActionStatus from './ActionStatus.vue'


export default {
    props: {
        action_id: Number
    },
    data() {
        return {
            action: null,
            fetch_error: null
        }
    },
    emits: ["action_launched", "action_stoped"],
    components: {
        ActionStatus
    },
    mounted() {
        let origin = window.location.origin;
        let url_group = origin + "/api/actions/" + this.action_id;
        fetch(url_group).then(resp => {
            if (resp.status != 200) {
                this.fetch_error = "Не удалось получить действие с id = " + this.action_id
                return
            }
            resp.json().then(body => {
                this.action = body.action
                fetch(url_group + "/status").then(resp => {
                    if (resp.status != 200) {
                        this.fetch_error = "Ну удалось получить статус действия с ID = " + this.action_id
                        return
                    }
                    resp.json().then(body => {
                        this.action.Status = body.status
                    })
                })
            })
        })
    },
    methods: {
        launch_action() {
            let origin = window.location.origin;
            let url_group = origin + "/api/actions/" + this.action_id + "/run";
            fetch(url_group).then(resp => {
                if (resp.status != 200) {
                    this.fetch_error = "Не удалось запустить действие с id = " + this.action_id
                    return
                }
                this.$emit("action_launched", "action launched")
            })
        },
        stop_action() {
            let origin = window.location.origin;
            let url_group = origin + "/api/actions/" + this.action_id + "/stop";
            fetch(url_group).then(resp => {
                if (resp.status != 200) {
                    this.fetch_error = "Не удалось запустить действие с id = " + this.action_id
                    return
                }
                this.$emit("action_stoped", "action stoped")
            })
        }
    }

}
</script>

<template>
    <th v-if="action" scope="row" class="ActionName">{{ this.action.Name }}</th>
    <td v-if="action" class="ActionDescription">{{ this.action.ShortDesc }}</td>
    <!-- <td v-if="action" class="ActionLastLaunch"> {{ this.action.LastLaunch }}</td> -->
    <!-- <td v-if="action">
        <ActionStatus :action_id="action_id"></ActionStatus>
    </td> -->
    <td v-if="action">
        <div v-if="action.Status">
            <button v-if="action.Status.ID == 3 || action.Status.ID == 4" @click="launch_action"
                class="ActionLaunch">Старт</button>
            <button v-else-if="action.Status.ID == 1" class="ActionStop" @click="stop_action"> Стоп</button>
            <div v-else class="ActionWait"> ... </div>
        </div>
    </td>
</template>

<style>
html,
body {
    width: 100%;
    padding: 1%;
}

.ActionLaunch {
    background-color: #005bff;
    height: 2.5em;
    color: white;
    border-radius: 7px;
    border: none;
    padding-left: 5%;
    padding-right: 5%;
}

.ActionWait {}

.ActionStop {
    height: 2.5em;
    background-color: #005bff;
    color: white;
    border-radius: 7px;
    border: none;
    padding-left: 5%;
    padding-right: 5%;
}
</style>