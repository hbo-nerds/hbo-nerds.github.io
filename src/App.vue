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

      <!-- Modals -->
      <Teleport to="body">
        <div
          id="exampleModal"
          aria-hidden="true"
          aria-labelledby="exampleModalLabel"
          class="modal fade"
          tabindex="-1"
        >
          <div class="modal-dialog modal-dialog-scrollable modal-fullscreen-sm-down modal-lg">
            <div class="modal-content bg-body">
              <div class="modal-body">
                <SingleCard v-if="selectedCard" :card="selectedCard" />
              </div>
              <div class="modal-footer">
                <button
                  class="btn-light btn btn-sm rounded-3 ms-auto"
                  data-bs-dismiss="modal"
                  type="button"
                  @click="selectedCardId = null"
                >
                  Sluit
                </button>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
      <!-- Modal -->
      <Teleport to="body">
        <PlaylistModal :id="selectedCardId" />
      </Teleport>
    </main>
    <NavigationBarMobile />

    <div v-if="showCookie" class="bg-body fixed-bottom border-top pb-4 pb-sm-0">
      <div class="container">
        <div class="row py-3">
          <div class="col-12">
            <h3>Cookiebeleid</h3>
            <p>
              Wij gebruiken cookies om het gebruik van onze website te analyseren via Google
              Analytics. Deze gegevens worden uitsluitend gebruikt om de website te verbeteren. Wij
              delen geen gegevens met derden. Door verder te gaan, ga je akkoord met ons gebruik van
              cookies voor deze doeleinden.
            </p>
            <button class="btn btn-dark w-100" @click="hideCookieBanner">OK</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import NavigationBarDesktop from "@/components/NavigationBarDesktop.vue";
import NavigationBarMobile from "@/components/NavigationBarMobile.vue";
import NavigationSideBar from "@/components/NavigationSideBar.vue";
import PlaylistModal from "@/components/PlaylistModal.vue";
import SingleCard from "@/components/SingleCard.vue";
import { useContentStore } from "@/stores/content.js";
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { onBeforeMount, onMounted, ref } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const contentStore = useContentStore();
const generalStore = useGeneralStore();

const { selectedCard, selectedCardId } = storeToRefs(contentStore);
contentStore.fetchData();
contentStore.setImages();
generalStore.getLocaleStorage();

const showCookie = ref(false);

/**
 * Set locale storage and hide cookie banner.
 */
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

/**
 * Check the URL params for filter settings.
 * @returns {Promise<void>}
 */
async function getUrlQueryParams() {
  //router is async so we wait for it to be ready
  await router.isReady();

  //once its ready we can access the query params
  if (route.query.filter) contentStore.setFilterFromQuery(new URLSearchParams(route.query.filter));

  contentStore.filter();
}
</script>

<style lang="sass" scoped></style>
