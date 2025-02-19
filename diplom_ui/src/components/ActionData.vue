<script>
// import ActionStatus from './ActionStatus.vue'


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
    emits: ["action_launched", "action_stoped", "action_clicked"],

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
        },

        action_clicked() {
            // console.log(this.action_id)
            this.$emit("action_clicked", this.action_id)
        }
    }

}
</script>

<template>
    <div class="ActionDataContent" v-if="action">
        <div class="ActionDataNav">
            <div class="ActionDataNavBackButtonContainer">
                <button @click="action_clicked"> назад </button>
            </div>
            <div class="ActionDataNavLaunchButtonContainer">
                <button @click="launch_action"> старт </button>
            </div>
        </div>
        <span> {{ this.action.Name }}</span>
        <span> {{ this.action.Status.Name }}</span>
        <span> {{ this.action.LastLaunch }}</span>
        <span class="ActionDataDescription"> {{ this.action.Description }}</span>

    </div>
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

.ActionDataContent {
    display: flex;
    flex-direction: column;
    padding-left: 1%;
    padding-right: 1%;
    padding-top: 0.5%;
    padding-bottom: 0.5%;

}

.ActionDataNav {
    display: flex;
}

.ActionDataDescription {
    text-align: justify;
}

.ActionDataNavBackButtonContainer {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-content: center;
    width: 49%;
}

.ActionDataNavLaunchButtonContainer {
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-content: center;
    width: 49%;
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