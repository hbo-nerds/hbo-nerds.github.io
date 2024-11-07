<template>
  <div class="h-100 d-flex flex-column" style="min-height: 100vh">
    <RefreshServiceWorker />
    <PwaPromptApple />
    <PwaPromptAndroid />
    <NavigationBarDesktop />
    <main
      id="main-content"
      class="flex-grow-1 d-flex flex-column bg-body overflow-y-auto overflow-x-hidden position-relative pb-5 pb-md-0"
    >
      <div class="container-fluid px-0">
        <div class="row flex-nowrap gx-0">
          <div class="col-auto d-none d-sm-block">
            <div class="sticky-top" style="padding: 0 4px">
              <NavigationSideBar />
            </div>
          </div>
          <div class="col" style="padding: 0 12px">
            <router-view v-slot="{ Component }">
              <keep-alive>
                <component :is="Component" />
              </keep-alive>
            </router-view>
          </div>
          <template v-if="selectedCard">
            <!-- desktop -->
            <div class="d-none d-sm-block col-sm-4 col-lg-3" style="padding: 0 12px">
              <div class="sticky-top overflow-y-auto hide-scrollbar z-1" style="max-height: 90vh">
                <SingleCard v-if="selectedCard" :card="selectedCard" />
              </div>
            </div>
            <!-- mobile -->
            <div
              class="position-fixed top-0 bottom-0 left-0 right-0 d-sm-none bg-body overflow-y-auto p-2 pb-5 z-3"
            >
              <SingleCard v-if="selectedCard" :card="selectedCard" />
            </div>
          </template>
        </div>
      </div>
      <div class="position-fixed bottom-0 end-0 m-3 rounded-circle bg-body" @click="toTop">
        <button
          class="btn btn-dark bg-trans btn-circle rounded-circle border-0"
          title="Terug naar boven"
          type="button"
        >
          <i class="bi bi-arrow-up"></i>
        </button>
      </div>

      <!-- Modals -->
      <Teleport to="body">
        <PlaylistModal :id="playlistCardId" />
      </Teleport>
      <Teleport to="body">
        <ShareModal :id="shareCardId" />
      </Teleport>
      <Teleport to="body">
        <EditPlaylistModal :title="editPlaylistTitle" />
      </Teleport>
      <Teleport to="body">
        <SharePlaylistModal :title="sharePlaylistTitle" />
      </Teleport>
    </main>
    <NavigationBarMobile />

    <Cookies v-if="showCookie" @ok="hideCookieBanner" />
  </div>
</template>

<script setup>
import Cookies from "@/components/Cookies.vue";
import EditPlaylistModal from "@/components/Modals/EditPlaylistModal.vue";
import PlaylistModal from "@/components/Modals/PlaylistModal.vue";
import ShareModal from "@/components/Modals/ShareModal.vue";
import SharePlaylistModal from "@/components/Modals/SharePlaylistModal.vue";
import NavigationBarDesktop from "@/components/NavigationBarDesktop.vue";
import NavigationBarMobile from "@/components/NavigationBarMobile.vue";
import NavigationSideBar from "@/components/NavigationSideBar.vue";
import PwaPromptAndroid from "@/components/PwaPromptAndroid.vue";
import PwaPromptApple from "@/components/PwaPromptApple.vue";
import RefreshServiceWorker from "@/components/RefreshServiceWorker.vue";
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

const { selectedCard, playlistCardId, shareCardId, sharePlaylistTitle, editPlaylistTitle } =
  storeToRefs(contentStore);
contentStore.fetchData();
generalStore.getLocaleStorage();

const showCookie = ref(false);

/**
 * Set locale storage and hide cookie banners.
 */
function hideCookieBanner() {
  localStorage.setItem("isCookieAccepted", "yes");
  showCookie.value = false;
}

/**
 * Scroll back to top.
 */
function toTop() {
  const el = document.getElementById("main-content");
  if (el) el.scrollTo({ top: 0, behavior: "smooth" });
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
#main-content
  padding-top: 60px

.modal.fade .modal-dialog
  transition: transform 0.1s ease-out

.fade
  transition: opacity 0.05s linear
</style>
