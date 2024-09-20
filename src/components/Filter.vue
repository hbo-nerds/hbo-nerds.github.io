<template>
  <div class="row g-3">
    <!-- date -->
    <div class="col-sm-3">
      <h4 class="fs-7 py-2 fw-lighter border-bottom mb-3">Upload date</h4>
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
              { 'text-body-tertiary': filters.date.range !== date.value },
              { 'text-decoration-line-through': !date.count },
            ]"
            :for="'date-' + idx"
            class="form-check-label text-nowrap small w-100"
          >
            {{ date.label }} ({{ date.count }})
            <i v-if="filters.date.range === date.value" class="bi bi-check-lg ms-2"></i>
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
            Other...
            <i v-if="filters.date.range === 'other'" class="bi bi-x-lg ms-2"></i>
          </label>
        </div>
        <div v-if="filters.date.range === 'other'">
          <div class="mb-2">
            <label class="form-label small fw-lighter mb-1" for="afterDate">Na:</label>
            <input
              id="afterDate"
              v-model="filters.date.after"
              class="form-control form-control-sm"
              type="date"
              @change="contentStore.filter()"
            />
          </div>
          <div>
            <label class="form-label small fw-lighter mb-1" for="beforeDate">Voor:</label>
            <input
              id="beforeDate"
              v-model="filters.date.before"
              class="form-control form-control-sm"
              type="date"
              @change="contentStore.filter()"
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
            @change="contentStore.filter()"
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
            @change="contentStore.filter()"
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
      <h4 class="fs-7 py-2 fw-lighter border-bottom mb-3">Duration</h4>
      <div class="d-flex flex-column gap-1">
        <div v-for="(duration, idx) in groupedDuration" :key="idx" class="pe-3">
          <input
            :id="'duration-' + idx"
            v-model="filters.duration"
            :value="duration.value"
            class="d-none"
            type="radio"
            @change="contentStore.filter()"
            :disabled="!duration.count"
          />
          <label
            :class="[
              { 'text-body-tertiary': filters.duration !== duration.value },
              { 'text-decoration-line-through': !duration.count },
            ]"
            :for="'duration-' + idx"
            class="form-check-label text-nowrap small w-100"
          >
            {{ duration.label }} ({{ duration.count }})
            <i v-if="filters.duration === duration.value" class="bi bi-check-lg ms-2"></i>
          </label>
        </div>
      </div>
    </div>
    <!-- activity -->
    <div class="col-sm-12">
      <h4 class="small py-2 fw-lighter border-bottom mb-3">Activity</h4>
      <input
        id="f_activity"
        v-model="f_term"
        class="form-control form-control-sm mb-3"
        placeholder="Search activity"
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
    <!-- general -->
    <div class="col-sm-6">
      <h4 class="small py-2 fw-lighter border-bottom mb-3">General</h4>
      <div class="d-flex flex-column gap-1">
        <div class="pe-3">
          <input
            id="hide_no_vod"
            v-model="filters.vodOnly"
            class="d-none"
            name="VOD"
            type="checkbox"
            @change="contentStore.filter()"
          />
          <label
            class="form-check-label small text-nowrap w-100"
            for="hide_no_vod"
            :class="filters.vodOnly ? '' : 'text-body-tertiary'"
          >
            Hide no VOD items
            <i v-if="filters.vodOnly" class="bi bi-check-lg ms-2"></i>
          </label>
        </div>
        <div class="pe-3">
          <input
            id="hide_paywall"
            v-model="filters.free"
            class="d-none"
            name="free"
            type="checkbox"
            @change="contentStore.filter()"
          />
          <label
            class="form-check-label small text-nowrap w-100"
            for="hide_paywall"
            :class="filters.free ? '' : 'text-body-tertiary'"
          >
            Hide paywall items
            <i v-if="filters.free" class="bi bi-check-lg ms-2"></i>
          </label>
        </div>
      </div>
    </div>
    <!-- sort -->
    <div class="col-sm-6">
      <h4 class="small py-2 fw-lighter border-bottom mb-3">Sort</h4>
      <div class="d-flex flex-column gap-1">
        <div class="pe-3">
          <input id="order-1" v-model="sortOption" class="d-none" type="radio" value="newOld" />
          <label
            class="form-check-label text-nowrap small w-100"
            for="order-1"
            :class="sortOption === 'newOld' ? '' : 'text-body-tertiary'"
          >
            Upload date (new first)
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
            Upload date (old first)
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
            Duration (shortest first)
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
            Duration (longest first)
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
</script>

<style lang="css" scoped>
.accordion-button:not(.collapsed) {
  color: unset;
  background-color: unset;
}

label:first-letter {
  text-transform: uppercase;
}
</style>
