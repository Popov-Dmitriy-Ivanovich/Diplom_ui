<script>
// import ActionStatus from './ActionStatus.vue'

import { IconChevronLeft, IconDeviceFloppy, IconTrashXFilled } from '@tabler/icons-vue'
import { get_cookie } from './cookie';

import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

export default {
    props: {
        action_id: Number,
        ar: Number
    },
    data() {
        return {
            action: null,
            fetch_error: null,
            action_description: null
        }
    },
    components: {
        IconChevronLeft, IconDeviceFloppy, IconTrashXFilled
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
            if (resp.status != 200 && resp.status != 404) {
                toast.error(resp.status, {
                    autoClose: 5000,
                })
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
        update_action() {
            let origin = window.location.origin;
            let url = origin + "/api/actions/" + this.action_id;
            fetch(url, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": get_cookie("token")
                },
                body: JSON.stringify({
                    ...this.action
                })
            }).then(resp => {
                if (resp.status == 401) {
                    this.$router.push("/login")
                    return
                }
                if (resp.status == 409) {
                    toast.error("Нельзя обновить не остановленное действие", {
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
                resp.json().then(body => {
                    toast.success("Действие обновлено", {
                        autoClose: 5000,
                    })
                    this.$emit("action_clicked", "update")
                })
            })
        },
        delete_action() {
            let origin = window.location.origin;
            let url = origin + "/api/actions/" + this.action_id;
            fetch(url, {
                method: 'DELETE',
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
                if (resp.status == 409) {
                    toast.error("Нельзя удалить не остановленное действие", {
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
                resp.json().then(body => {
                    this.$emit("action_clicked", "update")
                    toast.success("Действие удалено", {
                        autoClose: 5000,
                    })
                })
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
        <div class="ActionDataData" v-if="(ar & (1 << 2)) != (1 << 2)">
            <span class="ActionDataName"> {{ this.action.Name }}</span>
            <div class="LastLaunchAndStatus">
                <span v-if="action.Status"> Статус: {{ this.action.Status.Name }}</span>
                <span> Последний запуск: {{ this.action.LastLaunch }}</span>
            </div>
            <div class="ActionDataDescriptionContainer">
                <span class="ActionDataDescription" v-for="desc in action_description"> {{ desc }}</span>
            </div>
        </div>
        <div class="ActionDataDataAdmin" v-if="(ar & (1 << 2)) == (1 << 2)">
            <h1>Редактировать действие</h1>
            <div class="ActionDataDataAdminContent">
                <div class="LastLaunchAndStatus">
                    <span v-if="action.Status"> Статус: {{ this.action.Status.Name }}</span>
                    <span> Последний запуск: {{ this.action.LastLaunch }}</span>
                </div>
                <span> Название:</span>
                <input v-model="this.action.Name" />
                <span> Краткое описание:</span>
                <input v-model="this.action.ShortDesc" />
                <span> Детальное описание:</span>
                <textarea rows="5" cols="20" v-model="this.action.Description"></textarea>
                <span> Bash-скрипт:</span>
                <textarea rows="5" cols="20" v-model="this.action.Cmd"></textarea>
                <div class="SaveDelete">
                    <button @click="update_action">
                        <IconDeviceFloppy class="Icon" />
                    </button>

                    <button @click="delete_action">
                        <IconTrashXFilled class="Icon" />
                    </button>
                </div>
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

.ActionDataDataAdmin {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    align-content: center;
    flex-wrap: wrap;
}

.ActionDataDataAdminContent {
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.ActionDataDataAdminContent span {
    font-size: 1.1rem;
    margin-top: 1%;
}

.ActionDataDataAdminContent *:not(.Icon):not(button):not(.SaveDelete):not(.LastLaunchAndStatus *):not(.LastLaunchAndStatus):not(span) {
    font-size: 1.1rem;
    border-radius: 8px;
    border: 2px solid #9096a1;
    padding: 2% 1%;
    margin-top: 1%;
}

.ActionDataDataAdmin h1 {
    text-align: center;
}

.ActionDataDataAdminContent button {
    display: flex;
    align-items: center;
    margin-top: 2%;

    background-color: #005bff;
    color: white;
    border-radius: 7px;
    border: none;
    padding-left: 15%;
    padding-right: 15%;
    height: 2.5em;
    font-size: 1.1rem;
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
    margin-bottom: 2%;
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