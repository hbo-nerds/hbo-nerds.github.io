<template>
  <nav :class="{ 'hidden-navbar': !isNavbarVisible }" class="my-navbar bg-body py-2 z-3">
    <div class="container-fluid">
      <div class="row flex-nowrap align-items-center gx-0">
        <!-- left -->
        <div class="col-2 col-md-3 d-none d-sm-block">
          <div class="d-flex gap-3 align-items-center" style="padding-left: 4px">
            <button
              class="btn btn-dark bg-none btn-circle rounded-circle border-0"
              type="button"
              @click="generalStore.sideOpen = !generalStore.sideOpen"
            >
              <i class="text-body bi bi-list fs-5"></i>
            </button>
            <RouterLink class="text-decoration-none d-flex align-items-center gap-2" to="/">
              <img alt="Logo" src="../assets/img/detective_sicko.png" width="40px" />
              <span class="d-none text-body d-md-block text-truncate">Lekker Speuren</span>
            </RouterLink>
          </div>
        </div>
        <div v-if="!mobileSearch" class="col-3 d-sm-none">
          <div class="d-flex gap-3 align-items-center h-100">
            <RouterLink class="text-decoration-none d-flex align-items-center" to="/">
              <img alt="Logo" src="../assets/img/detective_sicko.png" width="40px" />
            </RouterLink>
          </div>
        </div>
        <!-- center search bar -->
        <div class="col">
          <!-- search desktop -->
          <div class="d-none d-sm-flex gap-2 align-items-center">
            <div
              :class="{ 'focus-margin': !focus }"
              class="input-group flex-nowrap position-relative"
            >
              <span
                v-if="focus"
                class="input-group-text rounded-start-pill border-end-0 bg-transparent pe-0"
                style="border-color: #1c62b9"
                ><i class="bi bi-search"></i
              ></span>
              <input
                v-model="search"
                :class="[focus ? 'border-start-0 focus-border' : 'rounded-start-pill']"
                autocomplete="off"
                class="form-control shadow-none bg-transparent"
                inputmode="search"
                name="search"
                placeholder="Start zoekopdracht"
                type="search"
                @focus="focus = true"
                @focusout="onFocusOut"
                @keydown.enter="
                  onFocusOut();
                  doSearch(true);
                "
              />
              <button
                class="btn btn-dark rounded-end-pill px-4"
                title="Search"
                type="button"
                @click="doSearch(true)"
              >
                <i class="bi bi-search"></i>
              </button>

              <PredictiveSearch ref="predSearch" :focus="focus" @search="searchFromPrediction" />
            </div>

            <FilterModal />
          </div>
          <!-- search mobile -->
          <div
            v-if="mobileSearch"
            class="d-flex d-sm-none gap-2 justify-content-end align-items-center position-relative"
          >
            <button
              class="btn btn-dark bg-trans btn-circle rounded-circle border-0"
              type="button"
              @click="mobileSearch = false"
            >
              <i class="bi bi-chevron-left"></i>
            </button>
            <div class="input-group flex-nowrap">
              <span
                class="input-group-text rounded-start-pill border-2 border-end-0 bg-transparent pe-0"
                style="border-color: #1c62b9"
                ><i class="bi bi-search"></i
              ></span>
              <input
                ref="mobileSearchInput"
                v-model="search"
                autocomplete="off"
                class="form-control shadow-none bg-transparent rounded-end-pill border-2 border-start-0 focus-border"
                inputmode="search"
                name="search"
                placeholder="Start zoekopdracht"
                style="background-color: #121212"
                type="search"
                @focus="focus = true"
                @focusout="onFocusOutMob"
                @keydown.enter="
                  onFocusOut();
                  doSearch(true);
                "
              />
            </div>
            <!-- filter -->
            <FilterModal :prefix="'mob-'" />
            <PredictiveSearch ref="predSearchMob" :focus="focus" @search="searchFromPrediction" />
          </div>
        </div>
        <!-- right desktop -->
        <div class="col-2 col-md-3 d-none d-sm-block">
          <div class="d-flex gap-2 align-items-center justify-content-end">
            <!-- Github -->
            <a
              href="https://github.com/hbo-nerds/hbo-nerds.github.io"
              target="_blank"
              title="View project on GitHub"
            >
              <button
                class="btn btn-dark btn-circle rounded-circle border-0"
                title="Bezoek project op GitHub"
                type="button"
              >
                <i class="bi bi-github"></i>
              </button>
            </a>
            <!-- theme -->
            <div class="dropdown">
              <button
                id="bd-theme"
                aria-expanded="false"
                aria-label="Toggle theme (dark)"
                class="btn btn-dark btn-circle rounded-circle border-0"
                data-bs-offset="0,10"
                data-bs-toggle="dropdown"
                title="Verander thema"
                type="button"
              >
                <i class="bi bi-moon-stars-fill"></i>
              </button>
              <ul
                aria-labelledby="bd-theme-text"
                class="dropdown-menu dropdown-menu-end border-0 rounded-3 py-0 overflow-hidden"
              >
                <li>
                  <button
                    class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                    data-bs-theme-value="light"
                    type="button"
                    @click="switchTheme('light')"
                  >
                    <i class="bi bi-sun-fill me-2"></i>
                    Light
                    <i v-if="generalStore.theme === 'light'" class="bi ms-auto bi-check2"></i>
                  </button>
                </li>
                <li>
                  <button
                    class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                    data-bs-theme-value="dark"
                    type="button"
                    @click="switchTheme('dark')"
                  >
                    <i class="bi bi-moon-stars-fill me-2"></i>
                    Dark
                    <i v-if="generalStore.theme === 'dark'" class="bi ms-auto bi-check2"></i>
                  </button>
                </li>
                <li>
                  <button
                    class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                    data-bs-theme-value="auto"
                    type="button"
                    @click="switchTheme('auto')"
                  >
                    <i class="bi bi-circle-half me-2"></i>
                    Systeem
                    <i v-if="generalStore.theme === 'auto'" class="bi ms-auto bi-check2"></i>
                  </button>
                </li>
              </ul>
            </div>
            <!-- profile -->
            <RouterLink v-if="profile" :to="{ name: 'you' }" title="Naar profiel">
              <button
                class="btn btn-dark btn-circle rounded-circle border-0 p-2"
                title="Naar profiel"
                type="button"
              >
                <img
                  :src="'/images/profile_pics/profile-' + (profile?.picture || 0) + '.png'"
                  alt="profile"
                  class="rounded-circle"
                  width="100%"
                />
              </button>
            </RouterLink>
          </div>
        </div>
        <!-- right mobile -->
        <div v-if="!mobileSearch" class="d-sm-none col-auto col-sm-3">
          <div class="d-flex gap-2 align-items-center justify-content-end">
            <!-- Bmc -->
            <a
              href="https://www.buymeacoffee.com/superruudje"
              target="_blank"
              title="Buy us a coffee"
            >
              <button
                class="btn btn-dark bg-trans btn-circle rounded-circle border-0"
                type="button"
              >
                <i class="bi bi-cup-hot-fill"></i>
              </button>
            </a>
            <!-- Github -->
            <a
              href="https://github.com/hbo-nerds/hbo-nerds.github.io"
              target="_blank"
              title="View project on GitHub"
            >
              <button
                class="btn btn-dark bg-trans btn-circle rounded-circle border-0"
                type="button"
              >
                <i class="bi bi-github"></i>
              </button>
            </a>
            <!-- theme -->
            <div class="dropdown">
              <button
                id="bd-theme"
                aria-expanded="false"
                aria-label="Toggle theme (dark)"
                class="btn btn-dark bg-trans btn-circle rounded-circle border-0"
                data-bs-offset="0,10"
                data-bs-toggle="dropdown"
                title="Verander thema"
                type="button"
              >
                <i class="bi bi-moon-stars-fill"></i>
              </button>
              <ul
                aria-labelledby="bd-theme-text"
                class="dropdown-menu dropdown-menu-end border-0 rounded-3 py-0 overflow-hidden"
              >
                <li>
                  <button
                    class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                    data-bs-theme-value="light"
                    type="button"
                    @click="switchTheme('light')"
                  >
                    <i class="bi bi-sun-fill me-2"></i>
                    Light
                    <i v-if="generalStore.theme === 'light'" class="bi ms-auto bi-check2"></i>
                  </button>
                </li>
                <li>
                  <button
                    class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                    data-bs-theme-value="dark"
                    type="button"
                    @click="switchTheme('dark')"
                  >
                    <i class="bi bi-moon-stars-fill me-2"></i>
                    Dark
                    <i v-if="generalStore.theme === 'dark'" class="bi ms-auto bi-check2"></i>
                  </button>
                </li>
                <li>
                  <button
                    class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                    data-bs-theme-value="auto"
                    type="button"
                    @click="switchTheme('auto')"
                  >
                    <i class="bi bi-circle-half me-2"></i>
                    Systeem
                    <i v-if="generalStore.theme === 'auto'" class="bi ms-auto bi-check2"></i>
                  </button>
                </li>
              </ul>
            </div>
            <!-- home view -->
            <div class="dropdown">
              <button
                id="bd-view"
                aria-expanded="false"
                aria-label="Toggle view"
                class="btn btn-dark bg-trans btn-circle rounded-circle border-0"
                data-bs-offset="0,10"
                data-bs-toggle="dropdown"
                title="Verander view"
                type="button"
              >
                <i
                  :class="
                    homeView === 'thumbnail'
                      ? 'bi-images'
                      : homeView === 'heatmap'
                        ? 'bi-calendar3'
                        : 'bi-dice-5'
                  "
                  class="bi"
                ></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end border-0 rounded-3 py-0 overflow-hidden">
                <li>
                  <button
                    class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                    data-bs-theme-value="light"
                    type="button"
                    @click="layoutStore.setHomeView('thumbnail')"
                  >
                    <i class="bi bi-images me-2 opacity-50"></i>
                    Thumbnail
                    <i v-if="homeView === 'thumbnail'" class="bi ms-auto bi-check2"></i>
                  </button>
                </li>
                <li>
                  <button
                    class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                    data-bs-theme-value="dark"
                    type="button"
                    @click="layoutStore.setHomeView('heatmap')"
                  >
                    <i class="bi bi-calendar3 me-2 opacity-50"></i>
                    Heatmap
                    <i v-if="homeView === 'heatmap'" class="bi ms-auto bi-check2"></i>
                  </button>
                </li>
                <li>
                  <button
                    class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                    data-bs-theme-value="auto"
                    type="button"
                    @click="layoutStore.setHomeView('random')"
                  >
                    <i class="bi bi-dice-5 me-2 opacity-50"></i>
                    Random
                    <i v-if="homeView === 'random'" class="bi ms-auto bi-check2"></i>
                  </button>
                </li>
              </ul>
            </div>
            <!-- search -->
            <button
              id="mobile-search-btn"
              class="d-sm-none btn btn-dark bg-trans btn-circle rounded-circle border-0"
              type="button"
              @click="startTyping"
            >
              <i class="bi bi-search"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import FilterModal from "@/components/Modals/FilterModal.vue";
import PredictiveSearch from "@/components/PredictiveSearch.vue";
import router from "@/router/index.js";
import { useContentStore } from "@/stores/content.js";
import { useGeneralStore } from "@/stores/general.js";
import { useLayoutStore } from "@/stores/layout.js";
import debounce from "lodash.debounce";
import { storeToRefs } from "pinia";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const generalStore = useGeneralStore();
const contentStore = useContentStore();
const layoutStore = useLayoutStore();
const { profile } = storeToRefs(generalStore);
const { search } = storeToRefs(contentStore);
const { homeView } = storeToRefs(layoutStore);

const focus = ref(false);
const mobileSearch = ref(false);
const mobileSearchInput = ref(null);
const predSearch = ref(null);
const predSearchMob = ref(null);

const isNavbarVisible = ref(true);
const lastScrollPosition = ref(0);
const isMobile = ref(window.innerWidth <= 768);

/**
 * Change UI color schema.
 * @param theme
 */
function switchTheme(theme) {
  generalStore.setTheme(theme);
}

/**
 * Focus on input[search] element to directly show keyboard on mobile devices.
 * @returns {Promise<void>}
 */
async function startTyping() {
  mobileSearch.value = true;
  await nextTick();
  mobileSearchInput.value.focus();
}

/**
 * Check for mouseOver on predictive search component
 * @type {ComputedRef<*>}
 */
const predSearchMouseOver = computed(() => {
  return predSearch.value?.mouseOver;
});

/**
 * Check for mouseOver on predictive search component
 * @type {ComputedRef<*>}
 */
const predSearchMobMouseOver = computed(() => {
  return predSearchMob.value?.mouseOver;
});

/**
 * Perform search and make shore main view is active.
 * @param save whether to save search in history
 */
async function doSearch(save = false) {
  if (save && search.value) generalStore.updateSearchHistory(search.value);
  generalStore.setView("main");
  if (route.path !== "/") {
    await router.push({ path: "/" });
  }
  contentStore.filter();
}

/**
 * Pick search from history
 * @param term
 */
function searchFromPrediction(term) {
  focus.value = false;
  search.value = term;
  doSearch(true);
}

/**
 * Listener for focusout
 */
function onFocusOut() {
  if (!predSearchMouseOver.value) focus.value = false;
}

/**
 * Listener for focusout on mobile
 */
function onFocusOutMob() {
  if (!predSearchMobMouseOver.value) focus.value = false;
}

/**
 * Auto-search with debounce.
 */
watch(
  search,
  debounce(() => {
    doSearch();
  }, 300),
);

/**
 * Check if on mobile
 */
function checkIfMobile() {
  isMobile.value = window.innerWidth <= 576;
}

function handleScroll(event) {
  // Only run on mobile devices
  checkIfMobile();
  if (!isMobile.value) {
    isNavbarVisible.value = true;
    return;
  }

  const mainContent = event.target;
  const currentScrollPosition = mainContent.scrollTop;

  isNavbarVisible.value =
    currentScrollPosition <= 60 ? true : currentScrollPosition <= lastScrollPosition.value;

  lastScrollPosition.value = currentScrollPosition;
}

onMounted(() => {
  const mainContent = document.getElementById("main-content");
  if (mainContent) {
    mainContent.addEventListener("scroll", handleScroll);
  }
});

onBeforeUnmount(() => {
  const mainContent = document.getElementById("main-content");
  if (mainContent) {
    mainContent.removeEventListener("scroll", handleScroll);
  }
});
</script>

<style scoped>
.my-navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  transition: transform 0.3s ease;
}

.hidden-navbar {
  transform: translateY(-100%);
}

.focus-margin {
  margin-left: 29px;
}

.focus-border {
  border-color: #1c62b9 !important;
}

.offcanvas-body .item {
  &:hover {
    background-color: rgba(var(--bs-tertiary-bg-rgb));
  }

  &.router-link-active {
    i:not(.active) {
      display: none;
    }

    i.active {
      display: block;
    }
  }

  i.active {
    display: none;
  }
}
</style>
