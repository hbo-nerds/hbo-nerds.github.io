<template>
    <div class="h-100 d-flex flex-column" style="min-height: 100vh">
        <navigation-bar></navigation-bar>
        <main class="flex-grow-1 bg-body overflow-y-auto">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-auto d-none d-md-block">
                        <div class="sticky-top">
                            <navigation-side/>
                        </div>
                    </div>
                    <div class="col">
                        <router-view/>
                    </div>
                </div>
            </div>

            <footer-bar></footer-bar>
        </main>
<!--        <div v-if="showCookie" class="bg-dark-subtle fixed-bottom">-->
<!--            <div class="container">-->
<!--                <div class="d-flex py-3 justify-content-center align-items-center">-->
<!--                    <i class="bi bi-cookie me-2 fs-4"></i>-->
<!--                    <p class="m-0">Wij gebruiken cookies om het gebruik van de website te kunnen meten met Google-->
<!--                        Analytics. <a href="https://policies.google.com/technologies/cookies?hl=nl" target="_blank">Lees-->
<!--                            meer.</a></p>-->
<!--                    <button @click="hideCookieBanner" class="btn btn-primary ms-2">Begrepen</button>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
    </div>
</template>

<script setup>
import {RouterView, useRoute, useRouter} from 'vue-router'
import NavigationBar from "@/components/navigationBar.vue";
import FooterBar from "@/components/footerBar.vue";
import {useContentStore} from "@/stores/content.js";
import {useGeneralStore} from "@/stores/general.js";
import {onBeforeMount, onMounted, ref} from "vue";
import NavigationSide from "@/components/navigationSide.vue";


const router = useRouter()
const route = useRoute();
const contentStore = useContentStore()
const generalStore = useGeneralStore()
contentStore.fetchData();
contentStore.setImages();
generalStore.getLocaleStorage();

const showCookie = ref(false)

function hideCookieBanner(){
    localStorage.setItem("isCookieAccepted", "yes");
    showCookie.value = false;
}

onBeforeMount(() => {
    let isCookieAccepted = localStorage.getItem("isCookieAccepted");
    if (isCookieAccepted === null || isCookieAccepted === "no") {
        localStorage.setItem("isCookieAccepted", "no");
        showCookie.value = true;
    }
})

onMounted(() => {
    getUrlQueryParams()
})

async function getUrlQueryParams() {
    //router is async so we wait for it to be ready
    await router.isReady()

    //once its ready we can access the query params
    if (route.query.filter)
        contentStore.setFilterFromQuery(new URLSearchParams(route.query.filter))

    contentStore.filter();
}
</script>

<style scoped lang="sass"></style>
