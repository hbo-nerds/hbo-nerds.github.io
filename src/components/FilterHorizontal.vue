<template>
  <div class="col-auto d-none d-md-block">
    <div class="dropdown">
      <button
        class="btn btn-dark dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Upload datum: {{ filters.date.range }}
      </button>

      <div class="dropdown-menu p-3">
        <div v-for="(date, idx) in groupedDates" :key="idx" class="pe-3">
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
            :class="[
              { 'text-body-tertiary': filters.date.range !== date.value.toString() },
              { 'text-decoration-line-through': !date.count },
            ]"
            :for="'date-' + idx"
            class="form-check-label text-nowrap small w-100"
          >
            {{ date.label }} ({{ date.count }})
            <i v-if="filters.date.range === date.value.toString()" class="bi bi-check-lg ms-2"></i>
          </label>
        </div>
      </div>
    </div>
  </div>
  <div class="col-auto d-none d-md-block">
    <div class="dropdown">
      <button
        class="btn btn-dark dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Type: {{ filters.type.join(", ") }}
      </button>

      <div class="dropdown-menu p-3">
        <div v-for="(type, idx) in groupedTypes" :key="idx" class="pe-3">
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
            :class="filters.type.includes(type.value) ? '' : 'text-body-tertiary'"
            :for="'type-' + idx"
            class="form-check-label text-nowrap small w-100"
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
        class="btn btn-dark dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Platform: {{ filters.platform.join(", ") }}
      </button>

      <div class="dropdown-menu p-3">
        <div v-for="(platform, idx) in groupedPlatforms" :key="idx" class="pe-3">
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
            :class="filters.platform.includes(platform.value) ? '' : 'text-body-tertiary'"
            :for="'platform-' + idx"
            class="form-check-label text-nowrap small w-100"
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
        class="btn btn-dark dropdown-toggle"
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Duur: {{ filters.duration }}
      </button>

      <div class="dropdown-menu p-3">
        <div v-for="(duration, idx) in groupedDuration" :key="idx" class="pe-3">
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
            :class="[
              { 'text-body-tertiary': filters.duration !== duration.value.toString() },
              { 'text-decoration-line-through': !duration.count },
            ]"
            :for="'duration-' + idx"
            class="form-check-label text-nowrap small w-100"
          >
            {{ duration.label }} ({{ duration.count }})
            <i
              v-if="filters.duration === duration.value.toString()"
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

const contentStore = useContentStore();
const { filters, groupedDates, groupedTypes, groupedPlatforms, groupedDuration } =
  storeToRefs(contentStore);

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
