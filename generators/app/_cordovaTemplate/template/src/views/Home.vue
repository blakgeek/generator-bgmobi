<template>
    <div class="screen">
        <header class="screen-header">
            <div>Home Screen</div>
        </header>
        <main class="screen-content">

        </main>
        <footer class="screen-footer">
            <div class="button button--positive">Click Me</div>
        </footer>
        <!-- loading mask -->
        <transition name="bounce" enter-active-class="bounceIn" leave-active-class="bounceOut">
            <div key="loadingMask" v-if="loading" class="loading-mask-wrapper">
                <div class="loading-mask">Loading</div>
            </div>
        </transition>
    </div>
</template>

<script>

    export default {
        name: 'home',
        data: () => ({
            loading: false
        }),
        methods: {},
        mounted() {

        },
        beforeDestroy() {
        }
    }
</script>

<style lang="scss" scoped>

    .screen {

        &-footer {
            margin-top: auto;
        }
    }

</style>
