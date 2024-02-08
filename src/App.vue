<template>
    <header class="sticky-top border-bottom">
        <navigation-bar></navigation-bar>
        <search-bar></search-bar>
    </header>
    <main class="flex-grow-1 bg-light-subtle">
        <router-view/>
    </main>
    <footer-bar></footer-bar>
</template>

<script setup>
import {RouterView} from 'vue-router'
import NavigationBar from "@/components/navigationBar.vue";
import FooterBar from "@/components/footerBar.vue";
import SearchBar from "@/components/searchBar.vue";
import {useContentStore} from "@/stores/content.js";

const contentStore = useContentStore()
contentStore.fetchData();
contentStore.setImages();

</script>

<style scoped lang="sass"></style>
