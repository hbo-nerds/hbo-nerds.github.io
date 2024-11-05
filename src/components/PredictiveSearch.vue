<template>
  <ul
    v-if="hasContent || !search"
    :class="{ show: focus }"
    class="dropdown-menu ls-menu border-0 py-3 top-100 rounded-4 mt-1 w-100"
    @mouseover="mouseOver = true"
    @mouseleave="mouseOver = false"
  >
    <li>
      <div v-if="!hasContent" class="px-3 py-1">
        <span class="fw-lighter small">Start met typen voor snelle zoekopdrachten.</span>
      </div>
      <div
        v-for="(result, i) in highlightedResults"
        :key="i"
        class="w-100 btn btn-dark border-0 rounded-0 px-3 py-1 d-flex align-items-center gap-3"
      >
        <i :class="result.type === 'history' ? 'bi-clock-history' : 'bi-search'" class="bi"></i>
        <span
          @click="emit('search', result.value)"
          class="flex-grow-1 text-start text-truncate"
          v-html="result.label || result.value"
        ></span>
        <div
          v-if="result.type === 'history'"
          class="ms-auto btn btn-link btn-sm link-underline link-underline-opacity-0 link-underline-opacity-100-hover"
          type="button"
          aria-label="Verwijder"
          @click.prevent.stop="generalStore.removeSearchHistory(result.value)"
          >Verwijder</div
        >
      </div>
    </li>
  </ul>
</template>

<script setup>
import { useContentStore } from "@/stores/content.js";
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const emit = defineEmits(["search", ""]);
const props = defineProps({
  focus: { type: Boolean, default: false },
});

const mouseOver = ref(false);
defineExpose({ mouseOver });

const generalStore = useGeneralStore();
const contentStore = useContentStore();
const { search, groupedActivities } = storeToRefs(contentStore);
const { searchHistory } = storeToRefs(generalStore);

/**
 * Whether list has items
 * @type {ComputedRef<unknown>}
 */
const hasContent = computed(() => {
  return (
    filteredHistory.value.length ||
    predictionStartsWith.value.length ||
    predictionIncludes.value.length
  );
});

/**
 * Filtered search history
 * @type {ComputedRef<*>}
 */
const filteredHistory = computed(() => {
  return searchHistory.value
    .filter((term) => term.toLowerCase().startsWith(search.value.toLowerCase()))
    .slice(0, 15 - predictionStartsWith.value.length)
    .map((term) => {
      return {
        type: "history",
        value: term,
      };
    });
});

/**
 * Get smart search list (starts with)
 * @type {ComputedRef<string[]|*[]>}
 */
const predictionStartsWith = computed(() => {
  return search.value
    ? Object.keys(groupedActivities.value)
        .filter((activity) => activity.toLowerCase().startsWith(search.value.toLowerCase()))
        .slice(0, 10)
        .map((term) => {
          return {
            type: "startsWith",
            value: term,
          };
        })
    : [];
});

/**
 * Get smart search list (starts with)
 * @type {ComputedRef<string[]|*[]>}
 */
const predictionIncludes = computed(() => {
  return search.value
    ? Object.keys(groupedActivities.value)
        .filter(
          (activity) =>
            !activity.toLowerCase().startsWith(search.value.toLowerCase()) &&
            activity.toLowerCase().includes(search.value.toLowerCase()),
        )
        .slice(0, 15 - predictionStartsWith.value.length)
        .map((term) => {
          return {
            type: "includes",
            value: term,
          };
        })
    : [];
});

/**
 * Combined results.
 * @type {ComputedRef<*>}
 */
const results = computed(() => {
  return filteredHistory.value.concat(predictionStartsWith.value, predictionIncludes.value);
});

const highlightedResults = computed(() => {
  if (!search.value) return results.value;

  // Escape special characters in the search term
  const escapedTerm = search.value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Create a regular expression to match the search term, case-insensitive
  const regex = new RegExp(`(${escapedTerm})`, "gi");

  return results.value.map((result) => {
    result.label = result.value.replace(
      regex,
      '<strong class="text-decoration-underline fw-bolder">$1</strong>',
    );
    return result;
  });
});
</script>

<style scoped>
.dropdown-menu.ls-menu {
  background-color: var(--ls-btn-dark-bg);
}
</style>
