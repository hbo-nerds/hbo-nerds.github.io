<template>
  <div class="col-auto d-none d-md-block">
    <div class="button-container gap-2" @mouseenter="hover = true" @mouseleave="hover = false">
      <button class="btn btn-sm btn-dark border-0 rounded-3">
        <i class="bi bi-sliders2"></i>
      </button>
      <transition-group name="face">
        <div v-if="hover" class="dropdown">
          <button
            class="btn btn-sm btn-dark dropdown-toggle border-0 rounded-3 fw-lighter"
            type="button"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false"
          >
            upload datum:
            <span class="text-lowercase">{{ date_label }}</span>
          </button>
          <div class="dropdown-menu border-0 rounded-3 py-0 overflow-hidden">
            <div v-for="(date, idx) in groupedDates" :key="idx">
              <input
                :id="'date-hor-' + idx"
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
                :for="'date-hor-' + idx"
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
        <div v-if="hover" class="dropdown">
          <button
            class="btn btn-sm btn-dark dropdown-toggle border-0 rounded-3 fw-lighter"
            type="button"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false"
          >
            type:
            <span class="text-lowercase">{{ type_label }}</span>
          </button>
          <div class="dropdown-menu border-0 rounded-3 py-0 overflow-hidden">
            <div v-for="(type, idx) in groupedTypes" :key="idx">
              <input
                :id="'type-hor-' + idx"
                v-model="filters.type"
                :value="type.value"
                class="d-none"
                name="type"
                type="checkbox"
                @change="checkType(type.value)"
              />
              <label
                :for="'type-hor-' + idx"
                class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2 text-nowrap"
              >
                {{ type.label }} ({{ type.count }})
                <i v-if="filters.type.includes(type.value)" class="bi bi-check-lg ms-2"></i>
              </label>
            </div>
          </div>
        </div>
        <div v-if="hover" class="dropdown">
          <button
            class="btn btn-sm btn-dark dropdown-toggle border-0 rounded-3 fw-lighter"
            type="button"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false"
          >
            platform:
            <span class="text-lowercase">{{ platform_label }}</span>
          </button>
          <div class="dropdown-menu border-0 rounded-3 py-0 overflow-hidden">
            <div v-for="(platform, idx) in groupedPlatforms" :key="idx">
              <input
                :id="'platform-hor-' + idx"
                v-model="filters.platform"
                :value="platform.value"
                class="d-none"
                name="platform"
                type="checkbox"
                @change="checkPlatform(platform.value)"
              />
              <label
                :for="'platform-hor-' + idx"
                class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2 text-nowrap"
              >
                {{ platform.label }} ({{ platform.count }})
                <i v-if="filters.platform.includes(platform.value)" class="bi bi-check-lg ms-2"></i>
              </label>
            </div>
          </div>
        </div>
        <div v-if="hover" class="dropdown">
          <button
            class="btn btn-sm btn-dark dropdown-toggle border-0 rounded-3 fw-lighter"
            type="button"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false"
          >
            duur:
            <span class="text-lowercase">{{ duration_label }}</span>
          </button>
          <div class="dropdown-menu border-0 rounded-3 py-0 overflow-hidden">
            <div v-for="(duration, idx) in groupedDuration" :key="idx">
              <input
                :id="'duration-hor-' + idx"
                v-model="filters.duration"
                :value="duration.value.toString()"
                class="d-none"
                type="radio"
                @change="contentStore.filter()"
                :disabled="!duration.count"
              />
              <label
                :class="[{ 'text-decoration-line-through': !duration.count }]"
                :for="'duration-hor-' + idx"
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
      </transition-group>
    </div>
  </div>
  <div class="col-auto d-none d-md-block">
    <button
      class="btn btn-sm btn-dark border-0 rounded-3"
      type="button"
      title="Reset filters"
      @click="contentStore.resetFilters"
    >
      <i class="bi bi-arrow-repeat"></i>
    </button>
  </div>
</template>

<script setup>
import { useContentStore } from "@/stores/content.js";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const contentStore = useContentStore();
const { filters, groupedDates, groupedTypes, groupedPlatforms, groupedDuration } =
  storeToRefs(contentStore);

const hover = ref(false);

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

.button-container
  display: flex
  align-items: center

.main-button
  transition: width 0.3s ease-in-out

.fade-enter-active, .fade-leave-active
  transition: opacity 0.3s
.fade-enter, .fade-leave-to
  opacity: 0
</style>
