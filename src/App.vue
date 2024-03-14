<template>
    <div class="h-100 d-flex flex-column">
        <header class="border-bottom">
            <navigation-bar></navigation-bar>
            <search-bar v-if="['home'].includes(route.name)"></search-bar>
        </header>
        <main class="flex-grow-1 bg-light-subtle overflow-y-auto">
            <router-view/>
            <footer-bar class="d-sm-none"></footer-bar>
        </main>
        <footer-bar class="d-none d-sm-block"></footer-bar>
    </div>
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
contentStore.filter()
generalStore.getLikedItems();
</script>

<style scoped lang="sass"></style>
