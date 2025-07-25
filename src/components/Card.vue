<template>
    <div :id="'card_' + card.id" class="card h-100 border-0 bg-transparent">
        <div v-if="serie" class="stack-2 border border-3 border-dark bg-dark z-0"></div>
        <div v-if="serie" class="stack border border-3 border-dark-subtle bg-dark-subtle z-0"></div>
        <div
            :class="[card.id === selectedCardId ? `active ${typeClass}` : '']"
            class="img-wrapper position-relative"
            type="button"
            @click="goToCard"
            @click.middle="goToCard('middle')"
        >
            <div class="transform-wrapper position-relative">
                <transition name="fade">
                    <img
                        v-if="imageSrc"
                        :src="imageSrc"
                        alt="thumbnail"
                        class="w-100"
                        loading="lazy"
                    />
                </transition>
                <!-- date -->
                <span
                    class="badge bg-black position-absolute top-0 start-0 m-2"
                    style="--bs-bg-opacity: 0.75"
                    >{{ card.date }}</span
                >
                <!-- duration -->
                <span
                    class="badge bg-black position-absolute bottom-0 end-0 m-2"
                    style="--bs-bg-opacity: 0.75"
                    >{{ duration }}</span
                >
                <!-- free -->
                <span
                    v-if="card.type === 'stream' && card.free"
                    class="badge bg-warning position-absolute top-0 end-0 m-2 text-uppercase text-black"
                >
                    Gratis
                </span>
                <!-- type -->
                <div class="position-absolute bottom-0 start-0 m-2 d-flex gap-1">
                    <span class="badge bg-black" style="--bs-bg-opacity: 0.75">{{
                        card.type
                    }}</span>
                    <span v-if="isSeen" class="badge bg-black" style="--bs-bg-opacity: 0.75"
                        ><i class="bi bi-eye-fill"></i
                    ></span>
                    <span v-if="isLiked" class="badge bg-black" style="--bs-bg-opacity: 0.75"
                        ><i class="bi bi-hand-thumbs-up-fill"></i
                    ></span>
                </div>
            </div>
        </div>
        <div class="card-body pt-3 pb-0 px-2 px-sm-0">
            <div class="d-flex justify-content-between gap-2 position-relative">
                <a
                    v-if="card['twitch_id'] && card['youtube_id']"
                    :href="'https://www.twitch.tv/videos/' + card['twitch_id']"
                    class="flex-shrink-0 position-relative"
                    style="width: 32px; height: 32px"
                    target="_blank"
                    title="Bekijk op Twitch"
                >
                    <div class="position-absolute end-0 bottom-0 lh-1">
                        <img
                            v-if="!card.twitch_available"
                            alt="twitch_logo"
                            class="rounded-circle"
                            src="../assets/img/twitch/twitch-unavailable-24x24.png"
                        />
                        <img
                            v-else
                            alt="twitch_logo"
                            class="rounded-circle"
                            src="../assets/img/twitch/twitch-icon-24x24.png"
                        />
                    </div>
                    <div class="position-absolute top-0 start-0 lh-1">
                        <img
                            alt="youtube_logo"
                            class="rounded-circle"
                            src="../assets/img/youtube/youtube-icon-24x24.png"
                        />
                    </div>
                </a>
                <template v-else>
                    <a
                        v-if="card['twitch_id']"
                        :href="'https://www.twitch.tv/videos/' + card['twitch_id']"
                        target="_blank"
                        title="Bekijk op Twitch"
                    >
                        <img
                            v-if="!card.twitch_available"
                            alt="twitch_logo"
                            class="rounded-circle"
                            src="../assets/img/twitch/twitch-unavailable-32x32.png"
                        />
                        <img
                            v-else
                            alt="twitch_logo"
                            class="rounded-circle"
                            height="32"
                            src="../assets/img/twitch/twitch-icon-32x32.png"
                            width="32"
                        />
                    </a>
                    <a
                        v-else-if="card['type'] === 'podcast'"
                        :href="'https://youtube.com/watch?v=' + card['youtube_id']"
                        target="_blank"
                        title="Bekijk op YouTube"
                    >
                        <img
                            alt="podcast_icon"
                            class="rounded-circle"
                            src="../assets/img/podcast/podcast-icon-32x32.png"
                        />
                    </a>
                    <a
                        v-else-if="card['youtube_id']"
                        :href="'https://youtube.com/watch?v=' + card['youtube_id']"
                        target="_blank"
                    >
                        <img
                            alt="youtube_logo"
                            class="rounded-circle"
                            src="../assets/img/youtube/youtube-icon-32x32.png"
                        />
                    </a>
                </template>

                <div class="meta flex-grow-1">
                    <h3
                        class="fs-6 fw-bold mb-1"
                        type="button"
                        @click="goToCard"
                        @click.middle="goToCard('middle')"
                    >
                        {{ serie ? `${serie.title} - (${serie.count})` : title }}
                    </h3>

                    <div class="inline-meta text-body-secondary">
                        <span v-if="daysAgo < 14" class="small"
                            >{{ daysAgo }} {{ daysAgo !== 1 ? "dagen" : "dag" }} geleden</span
                        >
                        <span v-else-if="weeksAgo < 4" class="small"
                            >{{ weeksAgo }} {{ weeksAgo !== 1 ? "weken" : "week" }} geleden</span
                        >
                        <span v-else-if="monthsAgo < 12" class="small"
                            >{{ monthsAgo }}
                            {{ monthsAgo !== 1 ? "maanden" : "maand" }} geleden</span
                        >
                        <span v-else class="small">{{ yearAgo }} jaar geleden</span>
                        <span v-if="card['collection']" class="small"
                            ><i class="bi bi-collection-play"></i
                        ></span>
                    </div>
                    <div v-if="card.activities?.length" class="inline-meta text-body-secondary">
                        <span
                            v-for="act in card.activities.slice(0, 1)"
                            :key="act.title"
                            class="small"
                        >
                            {{ act.title }} {{ card.activities.length > 1 ? "en meer" : "" }}
                        </span>
                    </div>
                    <div
                        v-if="Array.isArray(card['activity'])"
                        class="inline-meta text-body-secondary"
                    >
                        <span v-for="act in card['activity']?.slice(0, 1)" class="small"
                            >{{ act }} {{ card["activity"]?.length > 1 ? "en meer" : "" }}</span
                        >
                    </div>
                    <div v-else-if="card['activity']" class="inline-meta text-body-secondary">
                        <span class="small">{{ card["activity"] }}</span>
                    </div>
                </div>
                <div>
                    <button
                        aria-expanded="false"
                        aria-label="Dropdown"
                        class="btn btn-circle btn-sm rounded-circle"
                        data-bs-auto-close="outside"
                        data-bs-offset="0,10"
                        data-bs-toggle="dropdown"
                        type="button"
                    >
                        <i class="bi bi-three-dots-vertical lh-1"></i>
                    </button>
                    <ul
                        class="dropdown-menu dropdown-menu-end border-0 rounded-3 py-0 overflow-hidden"
                    >
                        <li>
                            <button
                                class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                                type="button"
                                @click="generalStore.toggleLikedItem(card['id'])"
                            >
                                <i class="bi bi-hand-thumbs-up me-2"></i
                                ><span class="small"
                                    >Like <i v-if="isLiked" class="ms-2 bi bi-check-lg"></i
                                ></span>
                            </button>
                        </li>
                        <li>
                            <button
                                class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                                type="button"
                                @click="generalStore.toggleSeenItem(card['id'])"
                            >
                                <i class="bi bi-eye me-2"></i
                                ><span class="small"
                                    >Gezien <i v-if="isSeen" class="ms-2 bi bi-check-lg"></i
                                ></span>
                            </button>
                        </li>
                        <li>
                            <button
                                class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                                data-bs-target="#playlist-modal"
                                data-bs-toggle="modal"
                                type="button"
                                @click="playlistCardId = card.id"
                            >
                                <i class="bi bi-bookmark me-2"></i
                                ><span class="small">Bewaar in afspeellijst</span>
                            </button>
                        </li>
                        <li>
                            <button
                                class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                                data-bs-target="#share-modal"
                                data-bs-toggle="modal"
                                type="button"
                                @click="shareCardId = card.id"
                            >
                                <i class="bi bi-share me-2"></i><span class="small">Delen</span>
                            </button>
                        </li>
                        <li v-if="collections.length">
                            <hr class="dropdown-divider m-0 border-2" />
                        </li>
                        <li v-for="col in collections">
                            <RouterLink
                                :to="{ name: 'serie', params: { id: col['id'] } }"
                                class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                                title="Ga naar serie"
                            >
                                <i class="bi bi-collection-play me-2"></i
                                ><span class="small">Naar '{{ col.title }}'</span>
                            </RouterLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <button
            ref="canvasBtn"
            class="d-none"
            data-bs-target="#singleCardModel"
            data-bs-toggle="modal"
            type="button"
        ></button>
    </div>
</template>

<script lang="ts" setup>
import router from "@/router/index.js";
import { useContentStore } from "@/stores/content.ts";
import { useGeneralStore } from "@/stores/general.ts";
import type { Card } from "@/types/Card.ts";
import type { Collection } from "@/types/Series.ts";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps<{
    card: Card;
    serie?: Collection;
}>();

const contentStore = useContentStore();
const generalStore = useGeneralStore();
const { selectedCardId, playlistCardId, shareCardId } = storeToRefs(contentStore);
const { seenItems, likedItems } = storeToRefs(generalStore);

const canvasBtn = ref(null);

const typeClass = computed(() => {
    return props.card
        ? props.card.type === "podcast"
            ? "bg-success"
            : props.card.type === "video"
              ? "bg-yt"
              : "bg-tw"
        : "";
});

const imageSrc = ref<null | string>(null);
const loadImage = async () => {
    imageSrc.value = await contentStore.getCardImage(props.card);
};

onMounted(loadImage);
watch(() => props.card.id, loadImage);

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
    if (["podcast", "video"].includes(props.card.type)) {
        return props.card.title || "untitled";
    } else if (props.card.custom_title) {
        return props.card.custom_title;
    } else {
        return props.card.titles?.[0];
    }
});

/**
 * Whether user has seen VOD.
 * @type {ComputedRef<*>}
 */
const isSeen = computed(() => {
    return seenItems.value.includes(props.card.id);
});

/**
 * Whether user has liked VOD.
 * @type {ComputedRef<*>}
 */
const isLiked = computed(() => {
    return likedItems.value.includes(props.card.id);
});

const collections = computed(() => {
    if (props.card.collection?.length) {
        let cols: Collection[] = [];
        props.card.collection.forEach((col) => {
            const collection = contentStore.getSingleCollection(col);
            if (collection) cols.push(collection);
        });
        return cols;
    }
    return [];
});

/**
 * Convert VOD seconds to h:m:s.
 * @returns {string}
 */
function secondsToHms() {
    let d = Number(props.card.duration);
    let h = Math.floor(d / 3600);
    let m = Math.floor((d % 3600) / 60);
    let s = Math.floor((d % 3600) % 60);

    return ("0" + h).slice(-2) + ":" + ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
}

/**
 * Navigate to item
 * @param type
 */
function goToCard(type = "left") {
    if (props.serie) {
        const path = `/series/${props.serie["id"]}`;
        if (type === "middle") {
            const routeData = router.resolve({ path: path });
            window.open(routeData.href, "_blank");
        } else router.push({ path: path });
    } else {
        const path = `/item/${props.card.id}`;
        if (type === "middle") {
            const routeData = router.resolve({ path: path });
            window.open(routeData.href, "_blank");
        } else {
            selectedCardId.value =
                selectedCardId.value === props.card["id"] ? null : props.card["id"];
            if (selectedCardId.value) scrollIntoView();
        }
    }
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

/**
 * Count amount of days ago.
 * @type {ComputedRef<number>}
 */
const daysAgo = computed(() => {
    return Math.round((Date.now() - new Date(props.card.date).getTime()) / (24 * 60 * 60 * 1000));
});

/**
 * Count amount of weeks ago.
 * @type {ComputedRef<number>}
 */
const weeksAgo = computed(() => {
    return Math.round(
        (Date.now() - new Date(props.card.date).getTime()) / (7 * 24 * 60 * 60 * 1000),
    );
});

/**
 * Count amount of months ago.
 * @type {ComputedRef<number>}
 */
const monthsAgo = computed(() => {
    return Math.floor(weeksAgo.value / 4);
});

/**
 * Count amount of years ago.
 * @type {ComputedRef<number>}
 */
const yearAgo = computed(() => {
    return new Date().getFullYear() - new Date(props.card["date"]).getFullYear();
});
</script>

<style lang="sass" scoped>
.fade-enter-active, .fade-leave-active
  transition: opacity 0.3s ease

.fade-enter-from, .fade-leave-to
  opacity: 0

.meta h3
  overflow: hidden
  text-overflow: ellipsis
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical

.inline-meta
  line-height: 1.2rem

  span:not(:first-of-type):before
    margin: 0 4px
    content: "•"

.stack
  position: absolute
  top: -4px
  height: 16px
  left: 8px
  right: 8px
  margin-top: -1px

.stack-2
  position: absolute
  top: -8px
  height: 16px
  left: 12px
  right: 12px
  margin-top: -1px

.img-wrapper
  .transform-wrapper
    aspect-ratio: 16 / 9
    transition-property: transform
    transition-timing-function: ease
    transition-duration: 100ms

  &.active
    .transform-wrapper
      transition-delay: 75ms
      transform: scale(0.97, 0.946)
</style>
