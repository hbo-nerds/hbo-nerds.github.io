<template>
    <div class="row g-3">
        <!-- date -->
        <div class="col-sm-3">
            <h4 class="fs-8 pb-3 fw-lighter border-bottom mb-3">Upload datum</h4>
            <div class="d-flex flex-column gap-1">
                <div v-for="(date, idx) in groupedDates" :key="idx" class="pe-3">
                    <input
                        :id="prefix + 'date-' + idx"
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
                            {
                                'text-body-tertiary':
                                    filters.date.range.toString() !== date.value.toString(),
                            },
                            { 'text-decoration-line-through': !date.count },
                        ]"
                        :for="prefix + 'date-' + idx"
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
                        :id="prefix + 'checkOther'"
                        v-model="filters.date.range"
                        class="d-none"
                        type="radio"
                        value="other"
                    />
                    <label
                        :class="filters.date.range === 'other' ? '' : 'text-body-tertiary'"
                        class="form-check-label text-nowrap small w-100"
                        :for="prefix + 'checkOther'"
                    >
                        Anders...
                        <i v-if="filters.date.range === 'other'" class="bi bi-check-lg ms-2"></i>
                    </label>
                </div>
                <div v-if="filters.date.range === 'other'">
                    <div class="mb-2">
                        <label class="form-label small fw-lighter mb-1" :for="prefix + 'beforeDate'"
                            >Voor:</label
                        >
                        <input
                            :id="prefix + 'beforeDate'"
                            :value="filters.date.before"
                            class="form-control form-control-sm"
                            type="date"
                            @focusout="setDateBefore($event)"
                        />
                    </div>
                    <div>
                        <label class="form-label small fw-lighter mb-1" :for="prefix + 'afterDate'"
                            >Op of na:</label
                        >
                        <input
                            :id="prefix + 'afterDate'"
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
            <h4 class="fs-8 pb-3 fw-lighter border-bottom mb-3">Type</h4>
            <div class="d-flex flex-column gap-1">
                <div v-for="(type, idx) in groupedTypes" :key="idx" class="pe-3">
                    <input
                        :id="prefix + 'type-' + idx"
                        v-model="filters.type"
                        :value="type.value"
                        class="d-none"
                        name="type"
                        type="checkbox"
                        @change="checkType(type.value as string)"
                    />
                    <label
                        :class="
                            filters.type.includes(type.value as string) ? '' : 'text-body-tertiary'
                        "
                        :for="prefix + 'type-' + idx"
                        class="form-check-label text-nowrap small w-100"
                    >
                        {{ type.label }} ({{ type.count }})
                        <i
                            v-if="filters.type.includes(type.value as string)"
                            class="bi bi-check-lg ms-2"
                        ></i>
                    </label>
                </div>
            </div>
        </div>
        <!-- platform -->
        <div class="col-sm-3">
            <h4 class="fs-8 pb-3 fw-lighter border-bottom mb-3">Platform</h4>
            <div class="d-flex flex-column gap-1">
                <div v-for="(platform, idx) in groupedPlatforms" :key="idx" class="pe-3">
                    <input
                        :id="prefix + 'platform-' + idx"
                        v-model="filters.platform"
                        :value="platform.value"
                        class="d-none"
                        name="platform"
                        type="checkbox"
                        @change="checkPlatform(platform.value as string)"
                    />
                    <label
                        :class="
                            filters.platform.includes(platform.value as string)
                                ? ''
                                : 'text-body-tertiary'
                        "
                        :for="prefix + 'platform-' + idx"
                        class="form-check-label text-nowrap small w-100"
                    >
                        {{ platform.label }} ({{ platform.count }})
                        <i
                            v-if="filters.platform.includes(platform.value as string)"
                            class="bi bi-check-lg ms-2"
                        ></i>
                    </label>
                </div>
            </div>
        </div>
        <!-- duration -->
        <div class="col-sm-3">
            <h4 class="fs-8 pb-3 fw-lighter border-bottom mb-3">Duur</h4>
            <div class="d-flex flex-column gap-1">
                <div v-for="(duration, idx) in groupedDuration" :key="idx" class="pe-3">
                    <input
                        :id="prefix + 'duration-' + idx"
                        v-model="filters.duration"
                        :value="duration.value.toString()"
                        class="d-none"
                        type="radio"
                        @change="contentStore.filter()"
                        :disabled="!duration.count"
                    />
                    <label
                        :class="[
                            {
                                'text-body-tertiary':
                                    filters.duration !== duration.value.toString(),
                            },
                            { 'text-decoration-line-through': !duration.count },
                        ]"
                        :for="prefix + 'duration-' + idx"
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
        <div class="col-sm-6">
            <h4 class="fs-8 pb-3 fw-lighter border-bottom mb-3">Activiteit</h4>
            <input
                :id="prefix + 'f_activity'"
                v-model="f_term"
                class="form-control form-control-sm mb-3"
                placeholder="Zoek activiteit"
                type="search"
            />
            <div v-for="(key, idx) in a_activities" :key="idx" class="form-check">
                <input
                    :id="prefix + 'act-' + idx"
                    v-model="filters.activity"
                    :value="key"
                    class="form-check-input"
                    name="activity"
                    type="checkbox"
                    @change="contentStore.filter()"
                />
                <label :for="prefix + 'act-' + idx" class="form-check-label small text-capitalize">
                    {{ key }} ({{ groupedActivities[key] }})
                </label>
            </div>
            <hr v-if="a_activities.length" />
            <div class="d-flex flex-column gap-1 overflow-y-auto" style="max-height: 150px">
                <div v-for="(key, idx) in f_activities" :key="idx" class="form-check">
                    <input
                        :id="prefix + 'act-' + idx"
                        v-model="filters.activity"
                        :value="key"
                        class="form-check-input"
                        name="activity"
                        type="checkbox"
                        @change="contentStore.filter()"
                    />
                    <label
                        :for="prefix + 'act-' + idx"
                        class="form-check-label small text-capitalize w-100"
                    >
                        {{ key }} ({{ groupedActivities[key] }})
                    </label>
                </div>
                <span v-if="!f_activities.length" class="form-check-label small text-capitalize"
                    >Geen activiteiten beschikbaar.</span
                >
            </div>
        </div>
        <!-- tag -->
        <div class="col-sm-6">
            <h4 class="fs-8 pb-3 fw-lighter border-bottom mb-3">Tag</h4>
            <input
                :id="prefix + 'f_tag'"
                v-model="f_tag"
                class="form-control form-control-sm mb-3"
                placeholder="Zoek tag"
                type="search"
            />
            <div v-for="(key, idx) in a_tags" :key="idx" class="form-check">
                <input
                    :id="prefix + 'tag-' + idx"
                    v-model="filters.tag"
                    :value="key"
                    class="form-check-input"
                    name="tag"
                    type="checkbox"
                    @change="contentStore.filter()"
                />
                <label :for="prefix + 'tag-' + idx" class="form-check-label small text-capitalize">
                    {{
                        key
                            .split(" ")
                            .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
                            .join("")
                    }}
                    ({{ groupedTags[key] }})
                </label>
            </div>
            <hr v-if="a_tags.length" />
            <div class="d-flex flex-column gap-1 overflow-y-auto" style="max-height: 150px">
                <div v-for="(key, idx) in f_tags" :key="idx" class="form-check">
                    <input
                        :id="prefix + 'tag-' + idx"
                        v-model="filters.tag"
                        :value="key"
                        class="form-check-input"
                        name="tag"
                        type="checkbox"
                        @change="contentStore.filter()"
                    />
                    <label
                        :for="prefix + 'tag-' + idx"
                        class="form-check-label small text-capitalize w-100"
                    >
                        {{
                            key
                                .split(" ")
                                .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
                                .join("")
                        }}
                        ({{ groupedTags[key] }})
                    </label>
                </div>
                <span v-if="!f_tags.length" class="form-check-label small text-capitalize"
                    >Geen tags beschikbaar.</span
                >
            </div>
        </div>
        <!-- vod -->
        <div class="col-sm-4">
            <h4 class="fs-8 pb-3 fw-lighter border-bottom mb-3">VOD</h4>
            <div class="d-flex flex-column gap-1">
                <div class="pe-3">
                    <input
                        :id="prefix + 'vod_all'"
                        v-model="filters.vod"
                        :value="'all'"
                        class="d-none"
                        name="vod_filter"
                        type="radio"
                        @change="contentStore.filter()"
                    />
                    <label
                        class="form-check-label small text-nowrap w-100"
                        :for="prefix + 'vod_all'"
                        :class="filters.vod === 'all' ? '' : 'text-body-tertiary'"
                    >
                        Met en zonder VOD
                        <i v-if="filters.vod === 'all'" class="bi bi-check-lg ms-2"></i>
                    </label>
                </div>
                <div class="pe-3">
                    <input
                        :id="prefix + 'vod_only'"
                        v-model="filters.vod"
                        :value="'vod_only'"
                        class="d-none"
                        name="vod_filter"
                        type="radio"
                        @change="contentStore.filter()"
                    />
                    <label
                        class="form-check-label small text-nowrap w-100"
                        :for="prefix + 'vod_only'"
                        :class="filters.vod === 'vod_only' ? '' : 'text-body-tertiary'"
                    >
                        Alleen met VOD
                        <i v-if="filters.vod === 'vod_only'" class="bi bi-check-lg ms-2"></i>
                    </label>
                </div>
                <div class="pe-3">
                    <input
                        :id="prefix + 'no_vod_only'"
                        v-model="filters.vod"
                        :value="'no_vod_only'"
                        class="d-none"
                        name="vod_filter"
                        type="radio"
                        @change="contentStore.filter()"
                    />
                    <label
                        class="form-check-label small text-nowrap w-100"
                        :for="prefix + 'no_vod_only'"
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
            <h4 class="fs-8 pb-3 fw-lighter border-bottom mb-3">Algemeen</h4>
            <div class="d-flex flex-column gap-1">
                <div class="pe-3">
                    <input
                        :id="prefix + 'hide_paywall'"
                        v-model="filters.free"
                        class="d-none"
                        name="free"
                        type="checkbox"
                        @change="contentStore.filter()"
                    />
                    <label
                        class="form-check-label small text-nowrap w-100"
                        :for="prefix + 'hide_paywall'"
                        :class="filters.free ? '' : 'text-body-tertiary'"
                    >
                        Verberg items met paywall
                        <i v-if="filters.free" class="bi bi-check-lg ms-2"></i>
                    </label>
                </div>
                <div class="pe-3">
                    <input
                        :id="prefix + 'hide_seen'"
                        v-model="filters.hideSeen"
                        class="d-none"
                        name="seen"
                        type="checkbox"
                        @change="contentStore.filter()"
                    />
                    <label
                        class="form-check-label small text-nowrap w-100"
                        :for="prefix + 'hide_seen'"
                        :class="filters.hideSeen ? '' : 'text-body-tertiary'"
                    >
                        Verberg bekeken items
                        <i v-if="filters.hideSeen" class="bi bi-check-lg ms-2"></i>
                    </label>
                </div>
            </div>
        </div>
        <!-- sort -->
        <div class="col-sm-4">
            <h4 class="fs-8 pb-3 fw-lighter border-bottom mb-3">Sorteer</h4>
            <div class="d-flex flex-column gap-1">
                <div class="pe-3">
                    <input
                        :id="prefix + 'order-1'"
                        v-model="sortOption"
                        class="d-none"
                        type="radio"
                        value="newOld"
                    />
                    <label
                        class="form-check-label text-nowrap small w-100"
                        :for="prefix + 'order-1'"
                        :class="sortOption === 'newOld' ? '' : 'text-body-tertiary'"
                    >
                        Upload datum (nieuwste eerst)
                        <i v-if="sortOption === 'newOld'" class="bi bi-check-lg ms-2"></i>
                    </label>
                </div>
                <div class="pe-3">
                    <input
                        :id="prefix + 'order-2'"
                        v-model="sortOption"
                        class="d-none"
                        type="radio"
                        value="oldNew"
                    />
                    <label
                        class="form-check-label text-nowrap small w-100"
                        :for="prefix + 'order-2'"
                        :class="sortOption === 'oldNew' ? '' : 'text-body-tertiary'"
                    >
                        Upload datum (oudste eerst)
                        <i v-if="sortOption === 'oldNew'" class="bi bi-check-lg ms-2"></i>
                    </label>
                </div>
                <div class="pe-3">
                    <input
                        :id="prefix + 'order-3'"
                        v-model="sortOption"
                        class="d-none"
                        type="radio"
                        value="shortLong"
                    />
                    <label
                        class="form-check-label text-nowrap small w-100"
                        :for="prefix + 'order-3'"
                        :class="sortOption === 'shortLong' ? '' : 'text-body-tertiary'"
                    >
                        Duur (kortste eerst)
                        <i v-if="sortOption === 'shortLong'" class="bi bi-check-lg ms-2"></i>
                    </label>
                </div>
                <div class="pe-3">
                    <input
                        :id="prefix + 'order-4'"
                        v-model="sortOption"
                        class="d-none"
                        type="radio"
                        value="longShort"
                    />
                    <label
                        class="form-check-label text-nowrap small w-100"
                        :for="prefix + 'order-4'"
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

<script lang="ts" setup>
import { useContentStore } from "@/stores/content.ts";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const contentStore = useContentStore();
const {
    sortOption,
    filters,
    groupedActivities,
    groupedTags,
    groupedTypes,
    groupedPlatforms,
    groupedDates,
    groupedDuration,
} = storeToRefs(contentStore);

defineProps<{
    prefix: string;
}>();

const f_term = ref<string>("");
const f_tag = ref<string>("");

/**
 * Filter activities
 * @type {ComputedRef<string[]>}
 */
const f_activities = computed(() => {
    return Object.keys(groupedActivities.value)
        .filter((i) => normalizeInput(i).includes(normalizeInput(f_term.value)))
        .sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });
});

/**
 * List with active activities
 * @type {ComputedRef<string[]>}
 */
const a_activities = computed(() => {
    return Object.keys(groupedActivities.value).filter((i) => filters.value.activity.includes(i));
});

/**
 * Filter tags
 * @type {ComputedRef<string[]>}
 */
const f_tags = computed(() => {
    return Object.keys(groupedTags.value)
        .filter((i) => normalizeInput(i).includes(normalizeInput(f_tag.value)))
        .sort((a, b) => {
            return a.toLowerCase().localeCompare(b.toLowerCase());
        });
});

/**
 * List with active tags
 * @type {ComputedRef<string[]>}
 */
const a_tags = computed(() => {
    return Object.keys(groupedTags.value).filter((i) => filters.value.tag.includes(i));
});

/**
 * Normalizes the input string by converting it to lowercase, removing diacritics,
 * and returning an empty string if the input is falsy.
 *
 * @param {string} input - The string to be normalized.
 * @return {string} The normalized string, or an empty string if the input is falsy.
 */
function normalizeInput(input: string) {
    return !input
        ? ""
        : input
              .toLowerCase()
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "");
}

/**
 * If 'all' is chosen, remove other options.
 * If another type is selected, remove the 'all' option.
 * @param value
 */
function checkType(value: string) {
    if (value === "all" && filters.value.type.includes("all")) filters.value.type = ["all"];
    else if (filters.value.type.includes(value) && filters.value.type.includes("all"))
        filters.value.type.splice(filters.value.type.indexOf("all"), 1);

    contentStore.filter();
}

/**
 * If 'all' is chosen, remove other options.
 * If another type is selected, remove the 'all' option.
 * @param value
 */
function checkPlatform(value: string) {
    if (value === "all" && filters.value.platform.includes("all")) filters.value.platform = ["all"];
    else if (filters.value.platform.includes(value) && filters.value.platform.includes("all"))
        filters.value.platform.splice(filters.value.platform.indexOf("all"), 1);

    contentStore.filter();
}

/**
 * Set the 'after' date when focus out.
 * @param e
 */
function setDateAfter(e: Event) {
    const target = e.target as HTMLInputElement;
    filters.value.date.after = target.value;
    contentStore.filter();
}

/**
 * Set the 'before' date when focus out.
 * @param e
 */
function setDateBefore(e: Event) {
    const target = e.target as HTMLInputElement;
    filters.value.date.before = target.value;
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
