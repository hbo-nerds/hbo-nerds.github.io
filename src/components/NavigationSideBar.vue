<template>
  <div v-if="!generalStore.sideOpen" class="items d-flex flex-column">
    <RouterLink
      active-class="r-active"
      class="item btn btn-dark bg-none border-0 rounded-3 py-3"
      to="/"
    >
      <div class="d-flex flex-column align-items-center text-body">
        <i class="bi bi-house-door fs-5"></i>
        <i class="active bi bi-house-door-fill fs-5"></i>
        <span class="fs-9">Home</span>
      </div>
    </RouterLink>
    <RouterLink
      :to="'/series'"
      active-class="r-active"
      class="item btn btn-dark bg-none border-0 rounded-3 py-3"
    >
      <div class="d-flex flex-column align-items-center text-body">
        <i class="bi bi-collection-play fs-5"></i>
        <i class="active bi bi-collection-play-fill fs-5"></i>
        <span class="fs-9">Series</span>
      </div>
    </RouterLink>
    <RouterLink
      :to="'/you'"
      active-class="r-active"
      class="item btn btn-dark bg-none border-0 rounded-3 py-3"
    >
      <div class="d-flex flex-column align-items-center text-body">
        <i class="bi bi-person fs-5"></i>
        <i class="active bi bi-person-fill fs-5"></i>
        <span class="fs-9">Jij</span>
      </div>
    </RouterLink>
    <RouterLink
      :to="'/over'"
      active-class="r-active"
      class="item btn btn-dark bg-none border-0 rounded-3 py-3"
    >
      <div class="d-flex flex-column align-items-center text-body">
        <i class="bi bi-question-circle fs-5"></i>
        <i class="active bi bi-question-circle-fill fs-5"></i>
        <span class="fs-9">Over</span>
      </div>
    </RouterLink>
    <a
      href="https://www.buymeacoffee.com/superruudje"
      target="_blank"
      class="item btn btn-dark bg-none border-0 rounded-3 py-3"
    >
      <div class="d-flex flex-column align-items-center text-body">
        <img class="mb-2" src="@/assets/svg/bmc/bmc-logo-native.svg" alt="bmc-logo" width="20" />
        <span class="fs-9">Support</span>
      </div>
    </a>
  </div>
  <div v-else class="d-flex flex-column px-2 pt-2">
    <RouterLink
      active-class="r-active"
      class="open-item btn btn-dark bg-none border-0 rounded-3 d-block px-3 py-2"
      to="/"
    >
      <div class="d-flex align-items-center text-body">
        <i class="bi bi-house-door fs-5 me-4 lh-1"></i>
        <i class="active bi bi-house-door-fill fs-5 me-4 lh-1"></i>
        <span class="fs-7 flex-grow-1 text-start">Home</span>
      </div>
    </RouterLink>
    <RouterLink
      active-class="r-active"
      class="open-item btn btn-dark bg-none border-0 rounded-3 d-block px-3 py-2"
      to="/series"
    >
      <div class="d-flex align-items-center text-body">
        <i class="bi bi-collection-play fs-5 me-4 lh-1"></i>
        <i class="active bi bi-collection-play-fill fs-5 me-4 lh-1"></i>
        <span class="fs-7 flex-grow-1 text-start">Series</span>
      </div>
    </RouterLink>
    <hr />
    <RouterLink
      class="open-item btn btn-dark bg-none border-0 rounded-3 d-block px-3 py-2"
      to="/you"
    >
      <div class="d-flex align-items-center text-body">
        <span class="fs-6 me-2">Jij</span>
        <i class="bi bi-chevron-right fs-7 d-block"></i>
      </div>
    </RouterLink>
    <RouterLink
      :to="{ name: 'history' }"
      class="open-item btn btn-dark bg-none border-0 rounded-3 d-block px-3 py-2"
    >
      <div class="d-flex align-items-center text-body">
        <i class="bi bi-clock-history fs-5 me-4 lh-1"></i>
        <i class="active bi bi-clock-history fs-5 me-4 lh-1"></i>
        <span class="fs-7 flex-grow-1 text-start">Geschiedenis</span>
      </div>
    </RouterLink>
    <RouterLink
      :to="{ name: 'playlists' }"
      class="open-item btn btn-dark bg-none border-0 rounded-3 d-block px-3 py-2"
    >
      <div class="d-flex align-items-center text-body">
        <i class="bi bi-collection-play fs-5 me-4 lh-1"></i>
        <i class="active bi bi-collection-play-fill fs-5 me-4 lh-1"></i>
        <span class="fs-7 flex-grow-1 text-start">Afspeellijsten</span>
      </div>
    </RouterLink>
    <RouterLink
      :to="{ name: 'liked-items' }"
      class="open-item btn btn-dark bg-none border-0 rounded-3 d-block px-3 py-2"
    >
      <div class="d-flex align-items-center text-body">
        <i class="bi bi-hand-thumbs-up fs-5 me-4 lh-1"></i>
        <i class="active bi bi-hand-thumbs-up-fill fs-5 me-4 lh-1"></i>
        <span class="fs-7 flex-grow-1 text-start">Gelikete items</span>
      </div>
    </RouterLink>
    <hr />
    <RouterLink
      :to="{ name: 'about' }"
      class="open-item btn btn-dark bg-none border-0 rounded-3 d-block px-3 py-2"
    >
      <div class="d-flex align-items-center text-body">
        <i class="bi bi-question-circle fs-5 me-4 lh-1"></i>
        <i class="active bi bi-question-circle-fill fs-5 me-4 lh-1"></i>
        <span class="fs-7 flex-grow-1 text-start">Over</span>
      </div>
    </RouterLink>
    <hr />
    <a href="https://www.buymeacoffee.com/superruudje" target="_blank">
      <img
        src="https://img.buymeacoffee.com/button-api/?text=Buy us a coffee&emoji=☕&slug=superruudje&button_colour=FFDD00&font_colour=000000&font_family=Poppins&outline_colour=000000&coffee_colour=ffffff"
        alt="bmc-btn"
      />
    </a>
  </div>
</template>

<script setup>
import { useGeneralStore } from "@/stores/general.js";

const generalStore = useGeneralStore();
</script>

<style lang="sass" scoped>
.open-item.r-active
  background-color: rgba(var(--bs-tertiary-bg-rgb))

.item
  width: 64px

.item, .open-item
  &.r-active
    i:not(.active)
      display: none

    i.active
      display: block

  i.active
    display: none
</style>
