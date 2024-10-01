<template>
  <div class="items d-flex flex-column">
    <RouterLink to="/" class="item text-decoration-none py-3 rounded-3" active-class="active">
      <div class="d-flex flex-column align-items-center text-body">
        <i class="bi bi-house-door fs-5"></i>
        <i class="active bi bi-house-door-fill fs-5"></i>
        <span class="fs-7">Home</span>
      </div>
    </RouterLink>
    <RouterLink
      :to="'/series'"
      class="item text-decoration-none py-3 rounded-3"
      active-class="active"
    >
      <div class="d-flex flex-column align-items-center text-body">
        <i class="bi bi-collection-play fs-5"></i>
        <i class="active bi bi-collection-play-fill fs-5"></i>
        <span class="fs-7">Series</span>
      </div>
    </RouterLink>
    <RouterLink :to="'/you'" class="item text-decoration-none py-3 rounded-3" active-class="active">
      <div class="d-flex flex-column align-items-center text-body">
        <i class="bi bi-person fs-5"></i>
        <i class="active bi bi-person-fill fs-5"></i>
        <span class="fs-7">Jij</span>
      </div>
    </RouterLink>
    <RouterLink
      :to="'/over'"
      class="item text-decoration-none py-3 rounded-3"
      active-class="active"
    >
      <div class="d-flex flex-column align-items-center text-body">
        <i class="bi bi-question-circle fs-5"></i>
        <i class="active bi bi-question-circle-fill fs-5"></i>
        <span class="fs-7">Over</span>
      </div>
    </RouterLink>
  </div>
</template>

<script setup></script>

<style scoped lang="sass">
.item
    width: 64px
    &:hover
        background-color: rgba(var(--bs-tertiary-bg-rgb))
    &.active
        i:not(.active)
            display: none
        i.active
            display: block
    i.active
        display: none
</style>
