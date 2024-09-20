<template>
  <nav class="bg-body py-2">
    <div class="container-fluid">
      <div class="row align-items-center g-2">
        <div v-if="!mobileSearch" class="col-3">
          <div class="d-flex gap-3 align-items-center h-100">
            <div
              aria-controls="offcanvasExample"
              class="d-none d-md-flex align-items-center justify-content-center p-2"
              data-bs-target="#offcanvasExample"
              data-bs-toggle="offcanvas"
              style="width: 40px; height: 40px"
              type="button"
            >
              <i class="bi bi-list fs-3"></i>
            </div>
            <RouterLink class="text-decoration-none d-flex align-items-center" to="/">
              <img alt="Logo" src="../assets/img/lekkerspelen-official.png" width="30px" />
            </RouterLink>
          </div>
        </div>
        <!-- center search bar -->
        <div class="col">
          <!-- search desktop -->
          <div class="d-none d-sm-flex gap-2 align-items-center">
            <div :class="{ 'focus-margin': !focus }" class="input-group flex-nowrap">
              <span
                v-if="focus"
                class="input-group-text rounded-start-pill border-end-0 bg-transparent pe-0"
                style="border-color: #1c62b9"
                ><i class="bi bi-search"></i
              ></span>
              <input
                v-model="search"
                :class="[focus ? 'border-start-0 focus-border' : 'rounded-start-pill']"
                class="form-control shadow-none"
                inputmode="search"
                placeholder="Zoek"
                style="background-color: #121212"
                type="search"
                @focus="focus = true"
                @focusout="focus = false"
                @keydown.enter="doSearch"
              />
              <button
                class="input-group-text rounded-end-pill px-4"
                type="button"
                @click="doSearch"
              >
                <i class="bi bi-search"></i>
              </button>
            </div>
            <FilterModal v-if="!mobileSearch" />
            <button
              :class="{ active: view === 'random' }"
              class="btn btn-dark rounded-circle lh-1 p-2"
              type="button"
              @click="toggleView"
            >
              <i class="bi bi-dice-5"></i>
            </button>
          </div>
          <!-- search mobile -->
          <div
            v-if="showSearchMobile"
            class="d-flex d-sm-none gap-2 justify-content-end align-items-center"
          >
            <div>
              <button
                class="btn btn-sm btn-dark rounded-circle lh-1 p-2"
                type="button"
                @click="
                  mobileSearch = false;
                  search = '';
                "
              >
                <i class="bi bi-chevron-left"></i>
              </button>
            </div>
            <div class="input-group input-group-sm flex-nowrap">
              <span
                class="input-group-text rounded-start-pill border-2 border-end-0 bg-transparent pe-0"
                style="border-color: #1c62b9"
                ><i class="bi bi-search"></i
              ></span>
              <input
                ref="mobileSearchInput"
                v-model="search"
                class="form-control shadow-none rounded-end-pill border-2 border-start-0 focus-border"
                inputmode="search"
                placeholder="Zoek"
                style="background-color: #121212"
                type="search"
                @keydown.enter="doSearch"
              />
            </div>
          </div>
        </div>
        <div class="col-auto col-sm-3">
          <div class="d-flex gap-2 align-items-center justify-content-end">
            <!-- Github -->
            <a
              v-if="!showSearchMobile"
              href="https://github.com/lekkersicko/lekker-speuren"
              target="_blank"
              title="Bekijk project op GitHub"
            >
              <button class="btn btn-sm rounded-circle lh-1 p-2" type="button">
                <i class="bi bi-github"></i>
              </button>
            </a>
            <!-- theme -->
            <div v-if="!showSearchMobile" class="dropdown">
              <button
                id="bd-theme"
                aria-expanded="false"
                aria-label="Toggle theme (dark)"
                class="btn btn-sm rounded-circle lh-1 p-2"
                data-bs-display="static"
                data-bs-toggle="dropdown"
                type="button"
              >
                <i class="bi bi-moon-stars-fill"></i>
              </button>
              <ul aria-labelledby="bd-theme-text" class="dropdown-menu dropdown-menu-end">
                <li>
                  <button
                    :class="{ active: generalStore.theme === 'light' }"
                    class="dropdown-item d-flex align-items-center"
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
                    class="dropdown-item d-flex align-items-center"
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
                    class="dropdown-item d-flex align-items-center"
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
            <!-- random -->
            <button
              v-if="!mobileSearch"
              :class="{ active: view === 'random' }"
              class="d-sm-none btn btn-sm btn-dark rounded-circle lh-1 p-2"
              type="button"
              @click="toggleView"
            >
              <i class="bi bi-dice-5"></i>
            </button>
            <!-- search -->
            <button
              v-if="!mobileSearch"
              id="mobile-search-btn"
              class="d-sm-none btn btn-sm btn-dark rounded-circle lh-1 p-2"
              type="button"
              @click="startTyping"
            >
              <i class="bi bi-search"></i>
            </button>
            <!-- filter -->
            <FilterModal v-if="mobileSearch" />
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
          class="ps-3 text-decoration-none d-flex align-items-center"
          to="/"
          @click="closeCanvas"
        >
          <img alt="Logo" src="../assets/img/lekkerspelen-official.png" width="30px" />
        </RouterLink>
      </div>
      <div class="offcanvas-body py-3">
        <RouterLink class="item text-decoration-none rounded-3 d-block" to="/" @click="closeCanvas">
          <div class="d-flex align-items-center text-body px-3 py-2">
            <i class="bi bi-house-door fs-5 me-4"></i>
            <i class="active bi bi-house-door-fill fs-5 me-4"></i>
            <span class="fs-6 flex-grow-1">Home</span>
          </div>
        </RouterLink>
        <RouterLink
          class="item text-decoration-none rounded-3 d-block"
          to="/series"
          @click="closeCanvas"
        >
          <div class="d-flex align-items-center text-body px-3 py-2">
            <i class="bi bi-collection-play fs-5 me-4"></i>
            <i class="active bi bi-collection-play-fill fs-5 me-4"></i>
            <span class="fs-6 flex-grow-1">Series</span>
          </div>
        </RouterLink>
        <hr />
        <RouterLink
          class="item text-decoration-none rounded-3 d-block"
          to="/you"
          @click="closeCanvas"
        >
          <div class="d-flex align-items-center text-body px-3 py-2">
            <span class="fs-6 me-2">You</span>
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
            <span class="fs-6 flex-grow-1">Liked items</span>
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
import { storeToRefs } from "pinia";
import { computed, nextTick, ref } from "vue";

const generalStore = useGeneralStore();
const contentStore = useContentStore();
const { view } = storeToRefs(generalStore);
const { search } = storeToRefs(contentStore);
const focus = ref(false);
const mobileSearch = ref(false);
const closeOffcanvas = ref(false);
const mobileSearchInput = ref(null);

/**
 * Whether to show searchbar on mobile.
 * @type {ComputedRef<unknown>}
 */
const showSearchMobile = computed(() => {
  return !!(search.value || mobileSearch.value);
});

function toggleView() {
  if (view.value === "random") {
    generalStore.setView("main");
  } else {
    generalStore.setView("random");
    contentStore.pickRandomSet();
  }
}

function switchTheme(theme) {
  generalStore.setTheme(theme);
}

async function startTyping() {
  mobileSearch.value = true;
  await nextTick();
  mobileSearchInput.value.focus();
}

function doSearch() {
  contentStore.filter();
  generalStore.setView("main");
  router.push({ name: "home" });
}

function closeCanvas() {
  setTimeout(() => {
    closeOffcanvas.value.click();
  }, 200);
}
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
