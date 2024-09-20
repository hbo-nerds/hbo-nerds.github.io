<template>
  <div class="bg-body py-3">
    <div class="d-flex gap-2 flex-wrap">
      <div class="flex-shrink-0 ms-auto">
        <button class="btn btn-sm btn-dark rounded-pill" type="button">
          Over deze data<i class="ms-2 bi bi-exclamation-circle"></i>
        </button>
      </div>
      <div class="flex-shrink-0">
        <FilterModal />
      </div>
    </div>
  </div>
</template>

<script setup>
import FilterModal from "@/components/FilterModal.vue";
</script>

<style lang="sass" scoped>
.hide-scrollbar
    scrollbar-color: transparent transparent

    &::-webkit-scrollbar
        display: none !important
        -ms-overflow-style: none !important
        scrollbar-width: none !important
</style>
