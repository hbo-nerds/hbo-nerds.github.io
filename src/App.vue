<template>
  <div class="h-100 d-flex flex-column" style="min-height: 100vh">
    <NavigationBarDesktop />
    <main
      id="main-content"
      class="flex-grow-1 d-flex flex-column bg-body overflow-y-auto overflow-x-hidden pb-5 pb-md-0"
    >
      <div class="container-fluid">
        <div class="row flex-nowrap">
          <div class="col-auto d-none d-md-block">
            <div class="sticky-top">
              <NavigationSideBar />
            </div>
          </div>
          <div class="col">
            <router-view />
          </div>
          <template v-if="selectedCard">
            <div class="d-none d-md-block col-md-4 col-lg-3">
              <div class="sticky-top overflow-y-auto hide-scrollbar z-3" style="max-height: 90vh">
                <SingleCard v-if="selectedCard" :card="selectedCard" />
              </div>
            </div>

            <div
              class="position-absolute top-0 bottom-0 left-0 right-0 d-md-none bg-body overflow-y-auto pb-5 z-3"
            >
              <SingleCard v-if="selectedCard" :card="selectedCard" />
            </div>
          </template>
        </div>
      </div>

      <!-- Modals -->
      <Teleport to="body">
        <div
          id="singleCardModel"
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
        <PlaylistModal :id="playlistCardId" />
      </Teleport>
    </main>
    <NavigationBarMobile />

    <Cookies v-if="showCookie" @ok="hideCookieBanner" />
  </div>
</template>

<script setup>
import Cookies from "@/components/Cookies.vue";
import NavigationBarDesktop from "@/components/NavigationBarDesktop.vue";
import NavigationBarMobile from "@/components/NavigationBarMobile.vue";
import NavigationSideBar from "@/components/NavigationSideBar.vue";
import PlaylistModal from "@/components/PlaylistModal.vue";
import SingleCard from "@/components/SingleCard.vue";
import { useContentStore } from "@/stores/content.js";
import { useGeneralStore } from "@/stores/general.js";
import { Tooltip } from "bootstrap";
import { storeToRefs } from "pinia";
import { onBeforeMount, onMounted, ref } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const contentStore = useContentStore();
const generalStore = useGeneralStore();

const { selectedCard, selectedCardId, playlistCardId } = storeToRefs(contentStore);
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

  new Tooltip(document.body, {
    selector: "[data-bs-toggle='tooltip']",
  });
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

<style lang="sass" scoped>
.modal.fade .modal-dialog
  transition: transform 0.1s ease-out
.fade
  transition: opacity 0.05s linear
</style>
