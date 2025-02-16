<script>

import { get_cookie } from "./cookie.js"
export default {
    props: {},
    data() {
        return {
            username: null,
            password: null
        }
    },
    mounted() { },
    methods: {
        login() {
            document.cookie = "token=jwt";

            console.log(get_cookie("token"));
            this.$router.push({ path: "/" });
        }
    }
}
</script>

<template>
    <div class="LoginFormContainer">
        <div class="LoginFormComponents">
            <span class="LoginLabel"> Логин: </span>
            <input type="text" v-model="username" class="LoginInput">
            <span class="LoginLabel"> Пароль: </span>
            <input type="password" v-model="password" class="LoginInput">
            <button @click="login" class="LoginButton">Войти</button>
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
</style>