<template>
  <div class="dropdown">
    <button
      class="btn btn-dark dropdown-toggle border-0 rounded-3"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      {{ a_sortlabel }}
    </button>
    <ul class="dropdown-menu border-0 rounded-3 py-0 overflow-hidden">
      <li v-for="option in sortOptions">
        <button
          class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
          type="button"
          @click="$emit('select', option.value)"
        >
          {{ option.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  sortOptions: { type: Array, required: true },
  active: { type: String, default: true },
});

const a_sortlabel = computed(() => {
  return props.sortOptions.find((option) => option.value === props.active).label;
});
</script>

<style scoped></style>
