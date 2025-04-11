<script>
// import ActionStatus from './ActionStatus.vue'
import { IconInfoCircle } from '@tabler/icons-vue'
import { get_cookie } from './cookie';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

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
    components: {
        IconInfoCircle,
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
                "Authorization": get_cookie("token")
            }
        }).then(resp => {
            if (resp.status != 200 && resp.status != 404 && resp.status!=401) {
                toast.error(resp.status, {
                    autoClose: 5000,
                })
                return
            }
            resp.json().then(body => {
                this.action = body.action
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
                        return
                    }
                    if (resp.status != 200 && resp.status != 404) {
                        toast.error(resp.status, {
                            autoClose: 5000,
                        })
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
                    "Authorization": get_cookie("token")
                }
            }).then(resp => {
                if (resp.status == 401) {
                    this.$router.push("/login")
                    return
                }
                if (resp.status == 422) {
                    toast.error("Превышен лимит одновременно запущенных приложений", {
                        autoClose: 5000,
                    })
                    return
                }
                if (resp.status != 200 && resp.status != 404) {
                    toast.error(resp.status, {
                        autoClose: 5000,
                    })
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
                    return
                }
                if (resp.status != 200 && resp.status != 404) {
                    toast.error(resp.status, {
                        autoClose: 5000,
                    })
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
    <th v-if="action" scope="row" class="ActionName">
        <!-- <div @click="action_clicked" class="ActionNameClickable">{{ this.action.Name }}&#8744; -->
        <div @click="action_clicked" class="ActionNameClickable">
            <div>
                {{ this.action.Name }}
            </div>
            <IconInfoCircle color="gray" />
        </div>
    </th>
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
    font-size: 1.1rem;
}

.ActionWait {
    font-size: 1.1rem;
    /* text-align: left; */
}

.ActionStop {
    height: 2.5em;
    background-color: #005bff;
    color: white;
    border-radius: 7px;
    border: none;
    padding-left: 5%;
    padding-right: 5%;
    font-size: 1.1rem;
}

.ActionNameClickable {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 3px;
}

.ActionNameClickable div {
    width: calc(100% - 3px)
}
</style>