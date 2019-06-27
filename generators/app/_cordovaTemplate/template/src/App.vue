<template>
  <div id="app">
    <transition name="bounce" enter-active-class="bounceInRight" leave-active-class="bounceOutLeft" @after-enter="afterEnter">
      <router-view></router-view>
    </transition>
    <dialogs-wrapper transition-name="popups" duration="1000"></dialogs-wrapper>
  </div>
</template>
<script>
    export default {
        name: 'App',
        methods: {
            afterEnter(el) {
            }
        }
    }
</script>
<style lang="scss">


</style>