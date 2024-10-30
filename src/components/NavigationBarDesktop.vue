<template>
  <nav class="bg-body py-2">
    <div class="container-fluid">
      <div class="row align-items-center gx-0">
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
                autocomplete="off"
              />
              <button
                class="btn btn-dark rounded-end-pill px-4"
                title="Search"
                type="button"
                @click="doSearch(true)"
              >
                <i class="bi bi-search"></i>
              </button>
              <ul
                :class="{ show: focus }"
                style="background-color: #272727"
                class="dropdown-menu border-0 py-3 top-100 rounded-4 mt-1 overflow-hidden w-100"
                @mouseenter="focus = true"
                v-if="filteredHistory.length || smartSearch.length"
              >
                <li>
                  <div
                    v-for="(search, i) in filteredHistory"
                    :key="i"
                    class="d-block w-100 btn btn-dark border-0 rounded-0 text-start px-3 py-1 d-flex align-items-center"
                    type="button"
                    @click="searchFromPrediction(search)"
                  >
                    <i class="bi bi-clock-history me-3"></i>
                    <span class="fw-bolder">{{ search }}</span>
                    <a
                      @click.stop="removeFromSearchHistory(i)"
                      type="button"
                      class="ms-auto small link-underline link-underline-opacity-0 link-underline-opacity-100-hover"
                      >Verwijder</a
                    >
                  </div>
                  <div
                    v-for="smart in smartSearch"
                    class="d-block w-100 btn btn-dark border-0 rounded-0 text-start px-3 py-1 d-flex align-items-center"
                    type="button"
                    @click="searchFromPrediction(smart)"
                  >
                    <i class="bi bi-search me-3"></i>
                    <span class="fw-bolder">{{ smart }}</span>
                  </div>
                </li>
              </ul>
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
                class="form-control shadow-none bg-transparent rounded-end-pill border-2 border-start-0 focus-border"
                inputmode="search"
                name="search"
                placeholder="Start zoekopdracht"
                style="background-color: #121212"
                type="search"
                @focus="focus = true"
                @keydown.enter="doSearch"
                @focusout="onFocusOut"
                autocomplete="off"
              />
            </div>
            <!-- filter -->
            <FilterModal :mob="true" />

            <ul
              :class="{ show: focus }"
              style="background-color: #272727"
              class="dropdown-menu border-0 py-3 top-100 rounded-4 mt-1 overflow-hidden w-100"
              @mouseenter="focus = true"
              v-if="filteredHistory.length || smartSearch.length"
            >
              <li>
                <div
                  v-for="(search, i) in filteredHistory"
                  :key="i"
                  class="d-flex gap-3 w-100 btn btn-dark border-0 rounded-0 px-3 py-1 align-items-center"
                  type="button"
                  @click="searchFromPrediction(search)"
                >
                  <i class="bi bi-clock-history"></i>
                  <span class="fw-bolder text-truncate">{{ search }}</span>
                  <a
                    @click.stop="removeFromSearchHistory(i)"
                    type="button"
                    class="ms-auto small link-underline link-underline-opacity-0 link-underline-opacity-100-hover"
                    >Verwijder</a
                  >
                </div>
                <div
                  v-for="smart in smartSearch"
                  class="d-block w-100 btn btn-dark border-0 rounded-0 text-start px-3 py-1 d-flex align-items-center"
                  type="button"
                  @click="searchFromPrediction(smart)"
                >
                  <i class="bi bi-search me-3"></i>
                  <span class="fw-bolder text-truncate">{{ smart }}</span>
                </div>
              </li>
            </ul>
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
                data-bs-display="static"
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
          </div>
        </div>
        <!-- right mobile -->
        <div class="d-sm-none col-auto col-sm-3">
          <div class="d-flex gap-2 align-items-center justify-content-end">
            <!-- Github -->
            <a
              v-if="!mobileSearch"
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
            <div v-if="!mobileSearch" class="dropdown">
              <button
                id="bd-theme"
                aria-expanded="false"
                aria-label="Toggle theme (dark)"
                class="btn btn-dark bg-trans btn-circle rounded-circle border-0"
                data-bs-display="static"
                data-bs-toggle="dropdown"
                type="button"
              >
                <i class="bi bi-moon-stars-fill"></i>
              </button>
              <ul class="dropdown-menu dropdown-menu-end border-0 rounded-3 py-0 overflow-hidden">
                <li>
                  <button
                    :class="{ active: generalStore.theme === 'light' }"
                    class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                    data-bs-theme-value="light"
                    type="button"
                    @click="switchTheme('light')"
                  >
                    <i class="bi bi-sun-fill me-2 opacity-50"></i>
                    Light
                    <i v-if="generalStore.theme === 'light'" class="bi ms-auto bi-check2"></i>
                  </button>
                </li>
                <li>
                  <button
                    :class="{ active: generalStore.theme === 'dark' }"
                    class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                    data-bs-theme-value="dark"
                    type="button"
                    @click="switchTheme('dark')"
                  >
                    <i class="bi bi-moon-stars-fill me-2 opacity-50"></i>
                    Dark
                    <i v-if="generalStore.theme === 'dark'" class="bi ms-auto bi-check2"></i>
                  </button>
                </li>
                <li>
                  <button
                    :class="{ active: generalStore.theme === 'auto' }"
                    class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                    data-bs-theme-value="auto"
                    type="button"
                    @click="switchTheme('auto')"
                  >
                    <i class="bi bi-circle-half me-2 opacity-50"></i>
                    Auto
                    <i v-if="generalStore.theme === 'auto'" class="bi ms-auto bi-check2"></i>
                  </button>
                </li>
              </ul>
            </div>
            <!-- search -->
            <button
              v-if="!mobileSearch"
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

  <Teleport to="body">
    <div
      id="offcanvasExample"
      aria-labelledby="offcanvasExampleLabel"
      class="offcanvas offcanvas-start bg-body"
      tabindex="-1"
    >
      <div class="offcanvas-header px-4 py-2">
        <div
          ref="closeOffcanvas"
          aria-controls="offcanvasExample"
          class="d-flex align-items-center justify-content-center p-2"
          data-bs-target="#offcanvasExample"
          data-bs-toggle="offcanvas"
          style="width: 40px; height: 40px"
          type="button"
        >
          <i class="bi bi-list fs-3"></i>
        </div>
        <RouterLink
          class="text-decoration-none d-flex align-items-center gap-2"
          to="/"
          @click="closeCanvas"
        >
          <img alt="Logo" src="../assets/img/lekker_speuren_logo.png" width="40px" />
          <span class="d-none text-light d-md-block special-elite-regular lh-1 text-truncate"
            >Lekker Speuren</span
          >
        </RouterLink>
      </div>
      <div class="offcanvas-body py-3">
        <hr />
        <RouterLink
          class="item text-decoration-none rounded-3 d-block"
          to="/you"
          @click="closeCanvas"
        >
          <div class="d-flex align-items-center text-body px-3 py-2">
            <span class="fs-6 me-2">Jij</span>
            <i class="bi bi-chevron-right fs-6 d-block"></i>
          </div>
        </RouterLink>
        <RouterLink
          :to="{ name: 'history' }"
          class="item text-decoration-none rounded-3 d-block"
          @click="closeCanvas"
        >
          <div class="d-flex align-items-center text-body px-3 py-2">
            <i class="bi bi-clock-history fs-5 me-4"></i>
            <i class="active bi bi-clock-history fs-5 me-4"></i>
            <span class="fs-6 flex-grow-1">Geschiedenis</span>
          </div>
        </RouterLink>
        <RouterLink
          :to="{ name: 'playlists' }"
          class="item text-decoration-none rounded-3 d-block"
          @click="closeCanvas"
        >
          <div class="d-flex align-items-center text-body px-3 py-2">
            <i class="bi bi-collection-play fs-5 me-4"></i>
            <i class="active bi bi-collection-play-fill fs-5 me-4"></i>
            <span class="fs-6 flex-grow-1">Afspeellijsten</span>
          </div>
        </RouterLink>
        <RouterLink
          :to="{ name: 'liked-items' }"
          class="item text-decoration-none rounded-3 d-block"
          @click="closeCanvas"
        >
          <div class="d-flex align-items-center text-body px-3 py-2">
            <i class="bi bi-hand-thumbs-up fs-5 me-4"></i>
            <i class="active bi bi-hand-thumbs-up-fill fs-5 me-4"></i>
            <span class="fs-6 flex-grow-1">Gelikete items</span>
          </div>
        </RouterLink>
        <hr />
        <RouterLink
          :to="{ name: 'about' }"
          class="item text-decoration-none rounded-3 d-block"
          @click="closeCanvas"
        >
          <div class="d-flex align-items-center text-body px-3 py-2">
            <i class="bi bi-question-circle fs-5 me-4"></i>
            <i class="active bi bi-question-circle-fill fs-5 me-4"></i>
            <span class="fs-6 flex-grow-1">Over</span>
          </div>
        </RouterLink>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import FilterModal from "@/components/FilterModal.vue";
import router from "@/router/index.js";
import { useContentStore } from "@/stores/content.js";
import { useGeneralStore } from "@/stores/general.js";
import debounce from "lodash.debounce";
import { storeToRefs } from "pinia";
import { computed, nextTick, ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const generalStore = useGeneralStore();
const contentStore = useContentStore();
const { search, groupedActivities } = storeToRefs(contentStore);
const { searchHistory } = storeToRefs(generalStore);
const focus = ref(false);
const mobileSearch = ref(false);
const closeOffcanvas = ref(false);
const mobileSearchInput = ref(null);

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
 * Filtered search history
 * @type {ComputedRef<*>}
 */
const filteredHistory = computed(() => {
  return searchHistory.value
    .filter((term) => term.toLowerCase().includes(search.value.toLowerCase()))
    .slice(0, 15 - smartSearch.value.length);
});

const smartSearch = computed(() => {
  return search.value
    ? Object.keys(groupedActivities.value)
        .filter((activity) => activity.toLowerCase().startsWith(search.value.toLowerCase()))
        .slice(0, 10)
    : [];
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
 * Remove item from history
 * @param index
 */
function removeFromSearchHistory(index) {
  generalStore.removeSearchHistory(index);
}

function onFocusOut() {
  setTimeout(() => {
    focus.value = false;
  }, 100);
}

/**
 * Always close canvas after navigation.
 */
function closeCanvas() {
  setTimeout(() => {
    closeOffcanvas.value.click();
  }, 200);
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
</script>

<style scoped>
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
