<template>
  <div class="col-auto d-none d-md-block">
    <div class="dropdown">
      <button
        class="btn btn-dark dropdown-toggle border-0 rounded-3"
        type="button"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
      >
        Upload datum:
        <span class="text-lowercase">{{ date_label }}</span>
      </button>
      <div class="dropdown-menu border-0 rounded-3 py-0 overflow-hidden">
        <div v-for="(date, idx) in groupedDates" :key="idx">
          <input
            :id="'date-' + idx"
            v-model="filters.date.range"
            :value="date.value"
            class="d-none"
            name="date-filter"
            type="radio"
            @change="contentStore.filter()"
            :disabled="!date.count"
          />
          <label
            :class="[{ 'text-decoration-line-through': !date.count }]"
            :for="'date-' + idx"
            class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2 text-nowrap"
          >
            {{ date.label }} ({{ date.count }})
            <i
              v-if="filters.date.range.toString() === date.value.toString()"
              class="bi bi-check-lg ms-2"
            ></i>
          </label>
        </div>
      </div>
    </div>
  </div>
  <div class="col-auto d-none d-md-block">
    <div class="dropdown">
      <button
        class="btn btn-dark dropdown-toggle border-0 rounded-3"
        type="button"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
      >
        Type:
        <span class="text-lowercase">{{ type_label }}</span>
      </button>
      <div class="dropdown-menu border-0 rounded-3 py-0 overflow-hidden">
        <div v-for="(type, idx) in groupedTypes" :key="idx">
          <input
            :id="'type-' + idx"
            v-model="filters.type"
            :value="type.value"
            class="d-none"
            name="type"
            type="checkbox"
            @change="checkType(type.value)"
          />
          <label
            :for="'type-' + idx"
            class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2 text-nowrap"
          >
            {{ type.label }} ({{ type.count }})
            <i v-if="filters.type.includes(type.value)" class="bi bi-check-lg ms-2"></i>
          </label>
        </div>
      </div>
    </div>
  </div>
  <div class="col-auto d-none d-md-block">
    <div class="dropdown">
      <button
        class="btn btn-dark dropdown-toggle border-0 rounded-3"
        type="button"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
      >
        Platform:
        <span class="text-lowercase">{{ platform_label }}</span>
      </button>
      <div class="dropdown-menu border-0 rounded-3 py-0 overflow-hidden">
        <div v-for="(platform, idx) in groupedPlatforms" :key="idx">
          <input
            :id="'platform-' + idx"
            v-model="filters.platform"
            :value="platform.value"
            class="d-none"
            name="platform"
            type="checkbox"
            @change="checkPlatform(platform.value)"
          />
          <label
            :for="'platform-' + idx"
            class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2 text-nowrap"
          >
            {{ platform.label }} ({{ platform.count }})
            <i v-if="filters.platform.includes(platform.value)" class="bi bi-check-lg ms-2"></i>
          </label>
        </div>
      </div>
    </div>
  </div>
  <div class="col-auto d-none d-md-block">
    <div class="dropdown">
      <button
        class="btn btn-dark dropdown-toggle border-0 rounded-3"
        type="button"
        data-bs-toggle="dropdown"
        data-bs-auto-close="outside"
        aria-expanded="false"
      >
        Duur:
        <span class="text-lowercase">{{ duration_label }}</span>
      </button>
      <div class="dropdown-menu border-0 rounded-3 py-0 overflow-hidden">
        <div v-for="(duration, idx) in groupedDuration" :key="idx">
          <input
            :id="'duration-' + idx"
            v-model="filters.duration"
            :value="duration.value.toString()"
            class="d-none"
            type="radio"
            @change="contentStore.filter()"
            :disabled="!duration.count"
          />
          <label
            :class="[{ 'text-decoration-line-through': !duration.count }]"
            :for="'duration-' + idx"
            class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2 text-nowrap"
          >
            {{ duration.label }} ({{ duration.count }})
            <i
              v-if="filters.duration.toString() === duration.value.toString()"
              class="bi bi-check-lg ms-2"
            ></i>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContentStore } from "@/stores/content.js";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const contentStore = useContentStore();
const { filters, groupedDates, groupedTypes, groupedPlatforms, groupedDuration } =
  storeToRefs(contentStore);

/**
 * Look for the label of current date filter
 * @type {ComputedRef<*>}
 */
const date_label = computed(() => {
  const item = groupedDates.value.find(
    (item) => item.value.toString() === filters.value.date.range.toString(),
  );
  return item ? item.label : filters.value.date.range;
});

/**
 * Look for the label of current type filter
 * @type {ComputedRef<string|[string]|*>}
 */
const type_label = computed(() => {
  const items = filters.value.type.map((type) => {
    const found = groupedTypes.value.find((item) => item.value === type);
    return found ? found.label : type;
  });
  return items.length ? items.join(", ") : filters.value.type;
});

/**
 * Look for the label of current platform filter
 * @type {ComputedRef<string|[string]|*>}
 */
const platform_label = computed(() => {
  const items = filters.value.platform.map((type) => {
    const found = groupedPlatforms.value.find((item) => item.value === type);
    return found ? found.label : type;
  });
  return items.length ? items.join(", ") : filters.value.platform;
});

/**
 * Look for the label of current duration filter
 * @type {ComputedRef<*>}
 */
const duration_label = computed(() => {
  const item = groupedDuration.value.find(
    (item) => item.value.toString() === filters.value.duration.toString(),
  );
  return item ? item.label : filters.duration;
});

/**
 * If 'all' is chosen, remove other options.
 * If other type is selected, remove 'all' option.
 * @param value
 */
function checkType(value) {
  if (value === "all" && filters.value.type.includes("all")) filters.value.type = ["all"];
  else if (filters.value.type.includes(value) && filters.value.type.includes("all"))
    filters.value.type.splice(filters.value.type.indexOf("all"), 1);

  contentStore.filter();
}

/**
 * If 'all' is chosen, remove other options.
 * If other type is selected, remove 'all' option.
 * @param value
 */
function checkPlatform(value) {
  if (value === "all" && filters.value.platform.includes("all")) filters.value.platform = ["all"];
  else if (filters.value.platform.includes(value) && filters.value.platform.includes("all"))
    filters.value.platform.splice(filters.value.platform.indexOf("all"), 1);

  contentStore.filter();
}
</script>

<style lang="sass" scoped>
label:first-letter
  text-transform: uppercase
label:hover
  cursor: pointer
</style>
