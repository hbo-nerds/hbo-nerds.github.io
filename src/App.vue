<template>
    <div class="h-100 d-flex flex-column" style="min-height: 100vh">
        <header class="border-bottom">
            <navigation-bar></navigation-bar>
            <search-bar v-if="['home'].includes(route.name)"></search-bar>
        </header>
        <main class="flex-grow-1 bg-light-subtle overflow-y-auto d-flex flex-column">
            <router-view class="flex-grow-1"/>
            <footer-bar></footer-bar>
        </main>
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
