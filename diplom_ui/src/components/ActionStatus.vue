<script>
export default {
    props: {
        action_id: Number
    },
    data() {
        return {
            status: null,
            fetch_error: null,
            status_color: null
        }
    },
    mounted() {
        let origin = window.location.origin;
        let url_group = origin + "/api/actions/" + this.action_id + "/status";
        fetch(url_group).then(resp => {
            if (resp.status != 200) {
                this.fetch_error = "Не удалось получить статус действия с id = " + this.action_id
                return
            }
            resp.json().then(body => {
                this.status = body.status
                if (this.status.ID === 1) {
                    this.StatusClass = "GreenStatus"
                }
                if (this.status.ID === 2) {
                    this.StatusClass = "YellowStatus"
                }
                if (this.status.ID === 3) {
                    this.StatusClass = "RedStatus"
                }
            })
        })
    }
}
</script>

<template>
    <span class="StatusContainer">
        <span :class="StatusClass" v-if="status" :id="status.id">{{ this.status.Name }}</span>
    </span>
</template>

<style>
.GreenStatus {
    color: #207020
}

.YellowStatus {
    color: rgb(181, 181, 71)
}

.RedStatus {
    color: rgb(148, 23, 23)
}

.StatusContainer {
    /* margin-left: 3%;
    margin-right: 3%; */
}
</style>