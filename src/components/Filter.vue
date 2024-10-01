<template>
  <div class="row g-3">
    <!-- date -->
    <div class="col-sm-3">
      <h4 class="fs-7 py-2 fw-lighter border-bottom mb-3">Upload datum</h4>
      <div class="d-flex flex-column gap-1">
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
              { 'text-body-tertiary': filters.date.range.toString() !== date.value.toString() },
              { 'text-decoration-line-through': !date.count },
            ]"
            :for="'date-' + idx"
            class="form-check-label text-nowrap small w-100"
          >
            {{ date.label }} ({{ date.count }})
            <i
              v-if="filters.date.range.toString() === date.value.toString()"
              class="bi bi-check-lg ms-2"
            ></i>
          </label>
        </div>
        <!-- other -->
        <div class="pe-3">
          <input
            id="checkOther"
            v-model="filters.date.range"
            class="d-none"
            type="radio"
            value="other"
          />
          <label
            :class="filters.date.range === 'other' ? '' : 'text-body-tertiary'"
            class="form-check-label text-nowrap small w-100"
            for="checkOther"
          >
            Anders...
            <i v-if="filters.date.range === 'other'" class="bi bi-check-lg ms-2"></i>
          </label>
        </div>
        <div v-if="filters.date.range === 'other'">
          <div class="mb-2">
            <label class="form-label small fw-lighter mb-1" for="beforeDate">Voor:</label>
            <input
              id="beforeDate"
              :value="filters.date.before"
              class="form-control form-control-sm"
              type="date"
              @focusout="setDateBefore($event)"
            />
          </div>
          <div>
            <label class="form-label small fw-lighter mb-1" for="afterDate">Op of na:</label>
            <input
              id="afterDate"
              :value="filters.date.after"
              class="form-control form-control-sm"
              type="date"
              @focusout="setDateAfter($event)"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- type -->
    <div class="col-sm-3">
      <h4 class="fs-7 py-2 fw-lighter border-bottom mb-3">Type</h4>
      <div class="d-flex flex-column gap-1">
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
    <!-- platform -->
    <div class="col-sm-3">
      <h4 class="fs-7 py-2 fw-lighter border-bottom mb-3">Platform</h4>
      <div class="d-flex flex-column gap-1">
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
    <!-- duration -->
    <div class="col-sm-3">
      <h4 class="fs-7 py-2 fw-lighter border-bottom mb-3">Duur</h4>
      <div class="d-flex flex-column gap-1">
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
    <!-- activity -->
    <div class="col-sm-12">
      <h4 class="small py-2 fw-lighter border-bottom mb-3">Activiteit</h4>
      <input
        id="f_activity"
        v-model="f_term"
        class="form-control form-control-sm mb-3"
        placeholder="Zoek activiteit"
        type="search"
      />
      <div v-for="(key, idx) in a_activities" :key="idx" class="form-check">
        <input
          :id="'act-' + idx"
          v-model="filters.activity"
          :value="key"
          class="form-check-input"
          name="activity"
          type="checkbox"
          @change="contentStore.filter()"
        />
        <label :for="'act-' + idx" class="form-check-label small text-capitalize">
          {{ key }} ({{ groupedActivities[key] }})
        </label>
      </div>
      <hr v-if="a_activities.length" />
      <div class="d-flex flex-column gap-1 overflow-y-auto" style="height: 150px">
        <div v-for="(key, idx) in f_activities" :key="idx" class="form-check">
          <input
            :id="'act-' + idx"
            v-model="filters.activity"
            :value="key"
            class="form-check-input"
            name="activity"
            type="checkbox"
            @change="contentStore.filter()"
          />
          <label :for="'act-' + idx" class="form-check-label small text-capitalize w-100">
            {{ key }} ({{ groupedActivities[key] }})
          </label>
        </div>
        <span v-if="!f_activities.length" class="form-check-label small text-capitalize"
          >Geen activiteiten beschikbaar.</span
        >
      </div>
    </div>
    <!-- vod -->
    <div class="col-sm-4">
      <h4 class="small py-2 fw-lighter border-bottom mb-3">VOD</h4>
      <div class="d-flex flex-column gap-1">
        <div class="pe-3">
          <input
            id="vod_all"
            v-model="filters.vod"
            :value="'all'"
            class="d-none"
            name="vod_filter"
            type="radio"
            @change="contentStore.filter()"
          />
          <label
            class="form-check-label small text-nowrap w-100"
            for="vod_all"
            :class="filters.vod === 'all' ? '' : 'text-body-tertiary'"
          >
            Met en zonder VOD
            <i v-if="filters.vod === 'all'" class="bi bi-check-lg ms-2"></i>
          </label>
        </div>
        <div class="pe-3">
          <input
            id="vod_only"
            v-model="filters.vod"
            :value="'vod_only'"
            class="d-none"
            name="vod_filter"
            type="radio"
            @change="contentStore.filter()"
          />
          <label
            class="form-check-label small text-nowrap w-100"
            for="vod_only"
            :class="filters.vod === 'vod_only' ? '' : 'text-body-tertiary'"
          >
            Alleen met VOD
            <i v-if="filters.vod === 'vod_only'" class="bi bi-check-lg ms-2"></i>
          </label>
        </div>
        <div class="pe-3">
          <input
            id="no_vod_only"
            v-model="filters.vod"
            :value="'no_vod_only'"
            class="d-none"
            name="vod_filter"
            type="radio"
            @change="contentStore.filter()"
          />
          <label
            class="form-check-label small text-nowrap w-100"
            for="no_vod_only"
            :class="filters.vod === 'no_vod_only' ? '' : 'text-body-tertiary'"
          >
            Alleen zonder VOD
            <i v-if="filters.vod === 'no_vod_only'" class="bi bi-check-lg ms-2"></i>
          </label>
        </div>
      </div>
    </div>
    <!-- general -->
    <div class="col-sm-4">
      <h4 class="small py-2 fw-lighter border-bottom mb-3">Algemeen</h4>
      <div class="d-flex flex-column gap-1">
        <div class="form-check">
          <input
            id="hide_paywall"
            v-model="filters.free"
            class="form-check-input"
            name="free"
            type="checkbox"
            @change="contentStore.filter()"
          />
          <label
            class="form-check-label small text-nowrap w-100"
            for="hide_paywall"
            :class="filters.free ? '' : 'text-body-tertiary'"
          >
            Verberg items met paywall
          </label>
        </div>
      </div>
    </div>
    <!-- sort -->
    <div class="col-sm-4">
      <h4 class="small py-2 fw-lighter border-bottom mb-3">Sorteer</h4>
      <div class="d-flex flex-column gap-1">
        <div class="pe-3">
          <input id="order-1" v-model="sortOption" class="d-none" type="radio" value="newOld" />
          <label
            class="form-check-label text-nowrap small w-100"
            for="order-1"
            :class="sortOption === 'newOld' ? '' : 'text-body-tertiary'"
          >
            Upload datum (nieuwste eerst)
            <i v-if="sortOption === 'newOld'" class="bi bi-check-lg ms-2"></i>
          </label>
        </div>
        <div class="pe-3">
          <input id="order-2" v-model="sortOption" class="d-none" type="radio" value="oldNew" />
          <label
            class="form-check-label text-nowrap small w-100"
            for="order-2"
            :class="sortOption === 'oldNew' ? '' : 'text-body-tertiary'"
          >
            Upload datum (oudste eerst)
            <i v-if="sortOption === 'oldNew'" class="bi bi-check-lg ms-2"></i>
          </label>
        </div>
        <div class="pe-3">
          <input id="order-3" v-model="sortOption" class="d-none" type="radio" value="shortLong" />
          <label
            class="form-check-label text-nowrap small w-100"
            for="order-3"
            :class="sortOption === 'shortLong' ? '' : 'text-body-tertiary'"
          >
            Duur (kortste eerst)
            <i v-if="sortOption === 'shortLong'" class="bi bi-check-lg ms-2"></i>
          </label>
        </div>
        <div class="pe-3">
          <input id="order-4" v-model="sortOption" class="d-none" type="radio" value="longShort" />
          <label
            class="form-check-label text-nowrap small w-100"
            for="order-4"
            :class="sortOption === 'longShort' ? '' : 'text-body-tertiary'"
          >
            Duur (langste eerst)
            <i v-if="sortOption === 'longShort'" class="bi bi-check-lg ms-2"></i>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContentStore } from "@/stores/content.js";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const contentStore = useContentStore();
const {
  sortOption,
  filters,
  groupedActivities,
  groupedTypes,
  groupedPlatforms,
  groupedDates,
  groupedDuration,
} = storeToRefs(contentStore);

const f_term = ref("");
const f_activities = computed(() => {
  return Object.keys(groupedActivities.value)
    .filter((i) => normalizeInput(i).includes(normalizeInput(f_term.value)))
    .sort((a, b) => {
      return a.toLowerCase().localeCompare(b.toLowerCase());
    });
});
const a_activities = computed(() => {
  return Object.keys(groupedActivities.value).filter((i) => filters.value.activity.includes(i));
});

function normalizeInput(input) {
  return !input
    ? ""
    : input
        .toLowerCase()
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
}

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

/**
 * Set the 'after' date when focus out.
 * @param e
 */
function setDateAfter(e) {
  filters.value.date.after = e.target.value;
  contentStore.filter();
}

/**
 * Set the 'before' date when focus out.
 * @param e
 */
function setDateBefore(e) {
  filters.value.date.before = e.target.value;
  contentStore.filter();
}
</script>

<style lang="css" scoped>
label:first-letter {
  text-transform: uppercase;
}
label:hover {
  cursor: pointer;
}
</style>
