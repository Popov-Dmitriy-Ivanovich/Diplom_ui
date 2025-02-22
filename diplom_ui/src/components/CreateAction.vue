<script>
import { get_cookie } from "./cookie.js"
import { IconCirclePlusFilled } from '@tabler/icons-vue'

export default {
    props: {},
    emits: ["action_created"],
    components: { IconCirclePlusFilled },
    data() {
        return {
            cmd: null,
            description: null,
            name: null,
            shortDesc: null,
        }
    },
    mounted() { },
    methods: {
        create_action() {
            let token = get_cookie("token")
            let origin = window.location.origin;
            let url = origin + "/api/actions/";
            fetch(url, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "Authorization": token
                },
                body: JSON.stringify({
                    cmd: this.cmd,
                    description: this.description,
                    name: this.name,
                    shortDesc: this.shortDesc,
                })
            }).then(resp => {
                if (resp.status == 401) {
                    this.$router.push("/login")
                    return
                }
                resp.json().then(body => {
                    this.$emit("action_created", "action_created")
                })
            })
        }
    }
}
</script>

<template>
    <div class="CreateActionDataContainer">
        <h1> Создать действие</h1>
        <div class="CreateActionDataContent">
            <input placeholder="Название" v-model="name">
            <input placeholder="Описание" v-model="shortDesc">
            <textarea placeholder="Детальное описание (отображается при нажатии на действие)" rows="5" cols="20"
                v-model="description"></textarea>
            <textarea placeholder="Команда (bash, будет выполнена на сервере)" rows="5" cols="20" v-model="cmd"></textarea>
            <button @click="create_action">
                <IconCirclePlusFilled class="IconCirclePlusFilled" />
            </button>
        </div>
    </div>
</template>

<style>
.CreateActionDataContainer {
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-content: center;
    align-items: center;
    margin: 2% 0%;
    padding: 1% 0%;
    border: 2px solid rgb(255, 83, 83);
    border-radius: 15px;
}

.CreateActionDataContent {
    display: flex;
    flex-direction: column;
    justify-content: center;

}

.CreateActionDataContent button {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #005bff;
    color: white;
    border-radius: 7px;
    border: none;
    padding-left: 15%;
    padding-right: 15%;
    height: 2.5em;
    font-size: 1.1rem;
    margin-top: 1%;
}

.CreateActionDataContent *:not(.IconCirclePlusFilled):not(button) {
    margin-top: 1%;
    border-radius: 5px;
    border: 2px solid #7f8797;
    font-size: 1.1rem;
}
</style>