<template>
  <div class="h-100 d-flex flex-column" style="min-height: 100vh">
    <NavigationBarDesktop />
    <main
      id="main-content"
      class="flex-grow-1 d-flex flex-column bg-body overflow-y-auto overflow-x-hidden pb-5 pb-md-0"
    >
      <div class="container-fluid">
        <div class="row">
          <div class="col-auto d-none d-md-block">
            <div class="sticky-top">
              <NavigationSideBar />
            </div>
          </div>
          <div class="col">
            <router-view />
          </div>
        </div>
      </div>

      <!--<FooterBar class="d-none d-md-block mt-auto"></FooterBar>-->

      <!-- Modal -->
      <Teleport to="body">
        <PlaylistModal :id="selectedCardId" />
      </Teleport>
    </main>
    <NavigationBarMobile />

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
import NavigationBarDesktop from "@/components/NavigationBarDesktop.vue";
import NavigationBarMobile from "@/components/NavigationBarMobile.vue";
import NavigationSideBar from "@/components/NavigationSideBar.vue";
import PlaylistModal from "@/components/PlaylistModal.vue";
import { useContentStore } from "@/stores/content.js";
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { onBeforeMount, onMounted, ref } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const contentStore = useContentStore();
const generalStore = useGeneralStore();

const { selectedCardId } = storeToRefs(contentStore);
contentStore.fetchData();
contentStore.setImages();
generalStore.getLocaleStorage();

const showCookie = ref(false);

function hideCookieBanner() {
  localStorage.setItem("isCookieAccepted", "yes");
  showCookie.value = false;
}

onBeforeMount(() => {
  let isCookieAccepted = localStorage.getItem("isCookieAccepted");
  if (isCookieAccepted === null || isCookieAccepted === "no") {
    localStorage.setItem("isCookieAccepted", "no");
    showCookie.value = true;
  }
});

onMounted(() => {
  getUrlQueryParams();
});

async function getUrlQueryParams() {
  //router is async so we wait for it to be ready
  await router.isReady();

  //once its ready we can access the query params
  if (route.query.filter) contentStore.setFilterFromQuery(new URLSearchParams(route.query.filter));

  contentStore.filter();
}
</script>

<style scoped lang="sass"></style>
