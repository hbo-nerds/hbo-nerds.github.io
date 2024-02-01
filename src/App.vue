<template>
    <navigation-bar></navigation-bar>
    <main class="flex-grow-1">
        <router-view/>
    </main>
    <footer-bar></footer-bar>
</template>

<script setup>
import {RouterView} from 'vue-router'
import NavigationBar from "@/components/navigationBar.vue";
import FooterBar from "@/components/footerBar.vue";
</script>

<style scoped lang="sass"></style>
