<template>
    <!-- single-card -->
    <div :id="'singleCard_' + card.id" class="pt-3 pb-5 overflow-x-hidden">
        <div v-if="showCloseBtn" class="d-flex gap-2 mb-3">
            <button
                class="btn btn-sm btn-dark rounded-3 border-0 fw-lighter w-100"
                title="Sluiten"
                @click="closeCard"
            >
                sluiten
            </button>
        </div>
        <div :key="card.id" class="row g-3">
            <div class="col-12 col-lg-12">
                <transition name="fade">
                    <img
                        v-if="imageSrc"
                        :src="imageSrc"
                        :srcset="`${imageSrc} 320w, ${imageSrc.replace('320px', '640px')} 640w`"
                        alt="thumbnail"
                        class="w-100 mb-3"
                        loading="lazy"
                        sizes="(max-width: 600px) 320px, 640px"
                        style="aspect-ratio: 16 / 9"
                    />
                </transition>
                <h5 class="fw-bold">{{ title }}</h5>
            </div>
            <!-- description -->
            <div class="col-12 col-3xl-6">
                <div class="card border-0 rounded-4 h-100">
                    <div class="card-body">
                        <div class="d-flex flex-wrap gap-2 mb-3 small">
                            <span class="text-nowrap">
                                <i class="bi bi-clock me-2"></i>
                                <span>{{ duration }}</span>
                            </span>
                            <span class="text-nowrap">
                                <i class="bi bi-calendar4-range me-2"></i>
                                <span>{{ date }}</span>
                            </span>
                        </div>
                        <p v-if="card.description">
                            {{
                                card.description.length > 100 && readMore
                                    ? card.description
                                    : card.description.slice(0, 100)
                            }}
                            <button
                                v-if="card.description.length > 100"
                                class="btn btn-link btn-sm"
                                title="toggle meer/minder"
                                @click="readMore = !readMore"
                            >
                                ...lees {{ readMore ? "minder" : "meer" }}
                            </button>
                        </p>
                        <a
                            :href="`https://docs.google.com/forms/d/e/1FAIpQLSeuPAoJu8xsn6JrxrYnRY5v2hw6iSj3eZCXX8QIpFqN6Uy1bA/viewform?usp=pp_url&entry.483165980=${card.id}`"
                            class="btn btn-sm btn-dark rounded-3 border-0"
                            target="_blank"
                            >{{ card.description ? "Feedback" : "Stuur een beschrijving" }}</a
                        >
                    </div>
                </div>
            </div>
            <!-- links -->
            <div v-if="card['twitch_id'] || card['youtube_id']" class="col-12 col-3xl-6">
                <div class="card border-0 rounded-4">
                    <div class="card-body">
                        <div class="d-flex flex-wrap gap-2">
                            <a
                                v-if="card['youtube_id']"
                                :href="'https://youtube.com/watch?v=' + card['youtube_id']"
                                class="flex-grow-0"
                                style="max-width: 60px"
                                target="_blank"
                                title="Bekijk op YouTube"
                            >
                                <img
                                    alt="youtube_vod"
                                    class="w-100 rounded-4"
                                    src="../assets/img/youtube/youtube-icon-60x60.png"
                                />
                            </a>
                            <a
                                v-if="card['twitch_id']"
                                :class="{ disabled: !card.twitch_available }"
                                :href="'https://www.twitch.tv/videos/' + card['twitch_id']"
                                :title="
                                    !card.twitch_available
                                        ? 'Niet meer beschikbaar'
                                        : 'Bekijk op Twitch'
                                "
                                class="flex-grow-0 position-relative"
                                style="max-width: 60px"
                                target="_blank"
                            >
                                <img
                                    v-if="!card.twitch_available"
                                    alt="twitch_vod"
                                    class="w-100 rounded-4"
                                    src="../assets/img/twitch/twitch-unavailable-60x60.png"
                                />
                                <img
                                    v-else
                                    alt="twitch_vod"
                                    class="w-100 rounded-4"
                                    src="../assets/img/twitch/twitch-icon-60x60.png"
                                />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <!-- actions -->
            <div class="col-12">
                <div class="d-flex flex-wrap gap-2">
                    <button
                        :class="{ active: isLiked }"
                        class="btn btn-dark border-0 rounded-pill text-nowrap"
                        title="Like"
                        type="button"
                        @click="generalStore.toggleLikedItem(card.id)"
                    >
                        <i class="bi bi-hand-thumbs-up me-2"></i>Like
                    </button>
                    <button
                        :class="{ active: isSeen }"
                        class="btn btn-dark border-0 rounded-pill text-nowrap"
                        title="Gezien"
                        type="button"
                        @click="generalStore.toggleSeenItem(card.id)"
                    >
                        <i class="bi bi-eye me-2"></i>Gezien
                    </button>
                    <button
                        class="btn btn-dark border-0 rounded-pill text-nowrap"
                        data-bs-target="#playlist-modal"
                        data-bs-toggle="modal"
                        title="Bewaar"
                        type="button"
                        @click="playlistCardId = card.id"
                    >
                        <i class="bi bi-bookmark me-2"></i>Bewaar in afspeellijst
                    </button>
                    <button
                        class="btn btn-dark border-0 rounded-pill text-nowrap"
                        data-bs-target="#share-modal"
                        data-bs-toggle="modal"
                        title="Deel"
                        type="button"
                        @click="shareCardId = card.id"
                    >
                        <i class="bi bi-share me-2"></i>Delen
                    </button>
                    <a
                        v-if="card['twitchtracker_id']"
                        :href="
                            'https://twitchtracker.com/lekkerspelen/streams/' +
                            card['twitchtracker_id']
                        "
                        class="btn border rounded-pill text-nowrap d-flex align-items-center"
                        target="_blank"
                    >
                        <img
                            alt="logo"
                            class="rounded-circle me-2"
                            src="../assets/img/twitch-tracker-24x24.png"
                        />
                        <span>TwitchTracker</span>
                    </a>
                </div>
            </div>
            <!-- activities -->
            <div class="col-12 col-3xl-6">
                <div class="card border-0 rounded-4 h-100">
                    <div class="card-body">
                        <div class="small fw-lighter mb-2">Activiteiten/games:</div>

                        <span v-if="!activities.length">-</span>
                        <div class="d-flex flex-wrap gap-2">
                            <button
                                v-for="act in activities"
                                :title="`Filter op '${act.title}'`"
                                class="btn border rounded-pill text-nowrap d-flex align-items-center text-truncate"
                                @click="searchActivity(act.title)"
                            >
                                <span class="text-truncate">{{ act.title }}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- tags -->
            <div class="col-12 col-3xl-6">
                <div class="card border-0 rounded-4 h-100">
                    <div class="card-body">
                        <div class="small fw-lighter mb-2">Tags:</div>

                        <span v-if="!card.tags || !card.tags.length">-</span>
                        <div class="d-flex flex-wrap">
                            <button
                                v-for="tag in card.tags"
                                :title="`Filter op #${tag}`"
                                class="btn btn-sm btn-link text-decoration-none"
                                @click="searchTag(tag)"
                            >
                                #{{
                                    tag
                                        .split(" ")
                                        .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
                                        .join("")
                                }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- bonus -->
            <div v-if="card['extra_urls']" class="col-12 col-3xl-6">
                <div class="card border-0 rounded-4 h-100">
                    <div class="card-body">
                        <div class="small fw-lighter mb-2">Extra:</div>

                        <div class="d-flex flex-wrap gap-2">
                            <template v-for="(obj, i) in card['extra_urls']" :key="i">
                                <a
                                    v-if="obj.url?.includes('twitch')"
                                    :href="obj.url"
                                    class="btn border rounded-pill text-nowrap d-flex align-items-center"
                                    target="_blank"
                                >
                                    <img
                                        alt="logo"
                                        class="rounded-circle me-2"
                                        src="../assets/img/twitch/twitch-icon-24x24.png"
                                    />
                                    <span>Twitch</span>
                                </a>
                                <a
                                    v-else-if="obj.url?.includes('youtube')"
                                    :href="obj.url"
                                    class="btn border rounded-pill text-nowrap d-flex align-items-center"
                                    target="_blank"
                                >
                                    <img
                                        alt="logo"
                                        class="rounded-circle me-2"
                                        src="../assets/img/youtube/youtube-icon-24x24.png"
                                    />
                                    <span>YouTube</span>
                                </a>
                                <a
                                    v-else
                                    :href="obj.url"
                                    class="btn border rounded-pill text-nowrap d-flex align-items-center"
                                    target="_blank"
                                >
                                    <span>Anders</span>
                                </a>
                            </template>
                        </div>
                    </div>
                </div>
            </div>
            <!-- series -->
            <div v-if="collections.length" class="col-12">
                <hr />
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <span class="fw-bold">Meer uit:</span>
                </div>
                <div id="accordionCollections" class="accordion">
                    <div v-for="(col, index) in collections" :key="index" class="accordion-item">
                        <h2 class="accordion-header">
                            <button
                                :data-bs-target="'#COL_' + index"
                                aria-controls="collapseOne"
                                aria-expanded="false"
                                class="accordion-button collapsed"
                                data-bs-toggle="collapse"
                                type="button"
                            >
                                {{ col.title }}
                            </button>
                        </h2>
                        <div
                            :id="'COL_' + index"
                            class="accordion-collapse collapse"
                            data-bs-parent="#accordionCollections"
                        >
                            <div class="accordion-body p-2">
                                <div v-for="card in col.items">
                                    <MiniCard :card="card" class="mb-3"></MiniCard>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- info -->
            <span class="small fst-italic">item-id: {{ card.id }}</span>
        </div>
        <div v-if="showCloseBtn" class="d-flex gap-2 mb-3 mt-3">
            <button
                class="btn btn-sm btn-dark rounded-3 border-0 fw-lighter w-100"
                title="Sluiten"
                @click="closeCard"
            >
                sluiten
            </button>
        </div>
    </div>
</template>
<script lang="ts" setup>
import MiniCard from "@/components/MiniCard.vue";
import { useContentStore } from "@/stores/content";
import { useGeneralStore } from "@/stores/general.ts";
import type { Card } from "@/types/Card";
import { storeToRefs } from "pinia";
import { computed, type ComputedRef, onMounted, ref, watch } from "vue";

const contentStore = useContentStore();
const generalStore = useGeneralStore();
const { filters, selectedCardId, playlistCardId, shareCardId, getCompleteCollections } =
    storeToRefs(contentStore);
const { likedItems, seenItems } = storeToRefs(generalStore);

const readMore = ref(false);

const props = withDefaults(
    defineProps<{
        card: Card;
        showCloseBtn?: boolean;
    }>(),
    {
        showCloseBtn: true,
    },
);

const card: ComputedRef<Card> = computed(() => {
    return props.card;
});

const imageSrc = ref<null | string>(null);
const loadImage = async () => {
    imageSrc.value = await contentStore.getCardImage(props.card);
};

/**
 * Convert seconds to h:m:s.
 * @type {ComputedRef<string>}
 */
const duration = computed(() => {
    return secondsToHms();
});

/**
 * Get VOD title.
 * @type {ComputedRef<ComputedRef<*>>}
 */
const title = computed(() => {
    return contentStore.getCardTitle(card.value);
});

/**
 * Whether user has seen VOD.
 * @type {ComputedRef<*>}
 */
const isSeen = computed(() => {
    return seenItems.value.includes(props.card["id"]);
});

/**
 * Whether user has liked VOD.
 * @type {ComputedRef<*>}
 */
const isLiked = computed(() => {
    return likedItems.value.includes(props.card["id"]);
});

/**
 * Get formatted date string.
 * @type {ComputedRef<string|string>}
 */
const date = computed(() => {
    return date
        ? new Date(props.card["date"]).toLocaleString("nl-NL", {
              weekday: "short",
              day: "2-digit",
              month: "long",
              year: "2-digit",
          })
        : "-";
});

/**
 * Return collections card is in.
 * @type {ComputedRef<*|*[]>}
 */
const collections = computed(() => {
    return card.value.collection
        ? getCompleteCollections.value.filter((collection) => {
              if (Array.isArray(card.value.collection))
                  return card.value.collection.includes(collection.id);
              else return card.value.collection === collection.id;
          })
        : [];
});

/**
 * Create array of item activities.
 * @type {ComputedRef<*[]|[]>}
 */
const activities = computed<{ title: string }[]>(() => {
    if (card.value.activity) {
        if (Array.isArray(card.value.activity)) {
            return card.value.activity.map((act) => ({ title: act }));
        } else {
            return [{ title: card.value.activity }];
        }
    } else if (card.value.activities?.length) {
        return card.value.activities;
    } else {
        return [];
    }
});

function closeCard() {
    selectedCardId.value = null;
    scrollIntoView();
}

/**
 * Scroll card into view.
 */
function scrollIntoView() {
    setTimeout(() => {
        const el = document.getElementById("card_" + props.card.id);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 200);
}

onMounted(() => {
    loadImage();
    generalStore.updateHistory(card.value.id);
});

watch(
    () => card.value,
    () => {
        loadImage();
        generalStore.updateHistory(card.value.id);
    },
);

/**
 * Convert durations to h-m-s
 * @returns {string}
 */
function secondsToHms() {
    let d = Number(card.value.duration);
    let h = Math.floor(d / 3600);
    let m = Math.floor((d % 3600) / 60);
    let s = Math.floor((d % 3600) % 60);

    return ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
}

/**
 * Search for clicked activity/game
 * @param activity
 */
function searchActivity(activity) {
    contentStore.resetFilters(); //reset
    filters.value.activity = [activity]; //set
    contentStore.filter(); //call
}

/**
 * Search for clicked tag
 * @param tag
 */
function searchTag(tag) {
    contentStore.resetFilters(); //reset
    filters.value.tag = [tag]; //set
    contentStore.filter(); //call
}
</script>

<style lang="sass" scoped>
.fade-enter-active, .fade-leave-active
  transition: opacity 0.3s ease

.fade-enter-from, .fade-leave-to
  opacity: 0

a.disabled
  cursor: not-allowed
</style>
