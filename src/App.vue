<template>
    <header class="sticky-top border-bottom">
        <navigation-bar></navigation-bar>
        <search-bar v-if="route.name === 'home'"></search-bar>
    </header>
    <main class="flex-grow-1 bg-light-subtle">
        <router-view/>
    </main>
    <footer-bar></footer-bar>
</template>

<script setup>
import {RouterView, useRoute} from 'vue-router'
import NavigationBar from "@/components/navigationBar.vue";
import FooterBar from "@/components/footerBar.vue";
import SearchBar from "@/components/searchBar.vue";
import {useContentStore} from "@/stores/content.js";
import {useGeneralStore} from "@/stores/general.js";

const route = useRoute();
const contentStore = useContentStore()
const generalStore = useGeneralStore()
contentStore.fetchData();
contentStore.setImages();
generalStore.getLikedItems();

console.log(route.name)

</script>

<style scoped lang="sass"></style>
