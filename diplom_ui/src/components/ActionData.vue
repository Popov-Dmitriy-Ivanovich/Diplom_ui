<script>
// import ActionStatus from './ActionStatus.vue'
import { IconChevronLeft } from '@tabler/icons-vue'
import { get_cookie } from './cookie';


export default {
    props: {
        action_id: Number
    },
    data() {
        return {
            action: null,
            fetch_error: null,
            action_description: null
        }
    },
    components: {
        IconChevronLeft,
    },
    emits: ["action_launched", "action_stoped", "action_clicked"],

    mounted() {
        let origin = window.location.origin;
        let url_group = origin + "/api/actions/" + this.action_id;
        fetch(url_group, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": get_cookie("token"),
            }
        }).then(resp => {
            if (resp.status == 401) {
                this.$router.push("/login")
            }
            if (resp.status != 200) {
                this.fetch_error = "Не удалось получить действие с id = " + this.action_id
                return
            }
            resp.json().then(body => {
                this.action = body.action
                this.action_description = body.action.Description.split('\n')
                fetch(url_group + "/status", {
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
            fetch(url_group, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": get_cookie("token"),
                }
            }).then(resp => {
                if (resp.status == 401) {
                    this.$router.push("/login")
                }
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
                <button @click="action_clicked">
                    <div>
                        <IconChevronLeft />
                        <div>
                            назад
                        </div>
                    </div>

                </button>
            </div>

        </div>
        <div class="ActionDataData">
            <span class="ActionDataName"> {{ this.action.Name }}</span>
            <div class="LastLaunchAndStatus">
                <span v-if="action.Status"> Статус: {{ this.action.Status.Name }}</span>
                <span> Последний запуск: {{ this.action.LastLaunch }}</span>
            </div>
            <div class="ActionDataDescriptionContainer">
                <span class="ActionDataDescription" v-for="desc in action_description"> {{ desc }}</span>
            </div>
        </div>
    </div>
</template>

<style>
html,
body {
    width: 100%;
    padding: 1%;
}

.ActionDataDescriptionContainer {
    margin: 4% 5%;
    margin-top: 2%;
    display: flex;
    flex-direction: column;
}

.ActionDataData {
    margin-top: 2%;
    display: flex;
    flex-direction: column;
}

.LastLaunchAndStatus {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    flex-wrap: wrap;
}

.LastLaunchAndStatus span {
    margin: 0% 1%;
}

.ActionDataName {
    text-align: center;
    font-size: 2rem;
    font-weight: 500;
    margin-top: 1%;
    margin-bottom: 1.5%;
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
    margin-top: 0.5%;
    display: flex;
}

.ActionDataDescription {
    margin-top: 1%;
    text-align: justify;
    text-indent: 6%;
    font-size: 1.05rem;
}

.ActionDataNavBackButtonContainer {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-content: center;
    width: 50%;
}

.ActionDataNavBackButtonContainer button {
    /* height: 2.5em;
    color: rgb(107, 110, 160);
    font-weight: 700;
    border-radius: 7px;
    border: 3px solid #005bff;
    padding: 0 2%; */
    background-color: #005bff;
    color: white;
    border-radius: 7px;
    border: none;
    padding-left: 5%;
    padding-right: 5%;
    height: 2.5em;
    /* padding: 0% 2%; */
    padding-left: 1%;
    padding-right: 3%;
    font-size: 1.1rem;
    margin-top: 2%;
    margin-left: 10%;
}

.ActionDataNavBackButtonContainer button div {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.ActionDataNavLaunchButtonContainer {
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-content: center;
    width: 50%;
}

.ActionDataNavLaunchButtonContainer button {
    background-color: #005bff;
    color: white;
    border-radius: 7px;
    border: none;
    padding-left: 5%;
    padding-right: 5%;
    height: 2.5em;
    padding: 0% 2%;
    margin-top: 2%;
    margin-right: 10%;
    font-size: 1.1rem;
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