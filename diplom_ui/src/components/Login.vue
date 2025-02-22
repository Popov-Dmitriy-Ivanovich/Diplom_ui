<script>

import { get_cookie } from "./cookie.js"
export default {
    props: {},
    data() {
        return {
            username: null,
            password: null,
            login_status: null,
        }
    },
    mounted() { },
    methods: {
        login() {
            // document.cookie = "token=jwt";
            let origin = window.location.origin;
            let url_group = origin + "/auth/user/login";
            fetch(url_group,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({ login: this.username, password: this.password })
                }).then(resp => {
                    console.log(resp)
                    if (resp.status == 404) {
                        this.login_status = "Пользователь не найден"
                        return
                    }
                    if (resp.status == 422) {
                        this.login_status = "Пароль неверный"
                        return
                    }
                    resp.json().then(body => {
                        document.cookie = "token=" + body.token;
                        this.login_status = null
                        document.cookie = "ar=" + body.user.AccessRights
                        document.cookie = "username=" + body.user.Login
                        this.$router.push("/")
                    })
                })

            // this.$router.push({ path: "/" });
        }
    }
}
</script>

<template>
    <div class="LoginFormContainer">
        <div class="LoginFormComponents">
            <span class="LoginLabel"> Логин: </span>
            <input type="text" v-model="username" class="LoginInput">
            <span class="LoginError" v-if='login_status == "Пользователь не найден"'> {{ this.login_status }}</span>
            <span class="LoginLabel"> Пароль: </span>
            <input type="password" v-model="password" class="LoginInput">
            <span class="LoginError" v-if='login_status == "Пароль неверный"'> {{ this.login_status }}</span>
            <button @click="login" class=" LoginButton">Войти</button>
        </div>
    </div>
</template>

<style>
html {
    background-color: #e8ecef;
}

.LoginFormContainer {
    display: flex;
    /* flex-direction: column; */
    font-family: 'Montserrat';
    justify-content: center;
    align-items: center;
}

.LoginFormComponents {
    margin-top: 5%;
    display: flex;
    flex-direction: column;
    border-radius: 15px;
    box-shadow: rgba(90, 67, 221, 0.4) 0px 48px 100px 0px;
    /* border: 2px solid #005bff; */
    background-color: rgb(255, 255, 255);
    padding-top: 5%;
    padding-bottom: 7%;
    padding-left: 5%;
    padding-right: 5%;
}

.LoginInput {
    width: 14em;
    height: 2.5em;
    font-size: 1.3rem;
}

.LoginButton {
    margin-top: 5%;
    width: 12.5em;
    height: 2.2em;
    background-color: #005bff;
    color: white;
    border-radius: 7px;
    border: none;
    font-size: 1.5rem;
}

.LoginLabel {
    color: #2b3137;
    font-size: 1.5rem;
    margin-top: 5%;
    margin-bottom: 2%;
}

.LoginError {
    color: rgb(233, 32, 32);
}
</style>