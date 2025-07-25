<template>
    <div class="card border-0 bg-transparent position-relative">
        <div class="d-flex gap-2">
            <div class="flex-shrink-0" style="width: 40%">
                <div
                    class="thumbnail-wrapper position-relative"
                    @click="goToCard"
                    @click.middle="goToCard('middle')"
                >
                    <img :src="imageSrc" alt="thumbnail" class="w-100" />
                    <span
                        class="badge bg-black position-absolute bottom-0 end-0"
                        style="
                            --bs-bg-opacity: 0.75;
                            margin: 4px;
                            padding: 1px 4px;
                            font-size: 10px;
                        "
                        ><small>{{ duration }}</small></span
                    >
                </div>
            </div>
            <div class="flex-shrink-1 flex-grow-1">
                <h3
                    class="fs-8 fw-bold mb-1"
                    type="button"
                    @click="goToCard"
                    @click.middle="goToCard('middle')"
                >
                    {{ title }}
                </h3>

                <div class="inline-meta text-body-secondary">
                    <span v-if="daysAgo < 14" class="fs-8"
                        >{{ daysAgo }} {{ daysAgo > 1 ? "dagen" : "dag" }} geleden</span
                    >
                    <span v-else-if="weeksAgo < 4" class="fs-8"
                        >{{ weeksAgo }} {{ weeksAgo > 1 ? "weken" : "week" }} geleden</span
                    >
                    <span v-else-if="monthsAgo < 12" class="fs-8"
                        >{{ monthsAgo }} {{ monthsAgo > 1 ? "maanden" : "maand" }} geleden</span
                    >
                    <span v-else class="fs-8">{{ yearAgo }} jaar geleden</span>
                    <span v-if="card['collection']" class="fs-8"
                        ><i class="bi bi-collection-play"></i
                    ></span>
                </div>
                <div class="inline-meta text-body-secondary">
                    <span v-for="act in card['activities']?.slice(0, 1)" class="fs-8"
                        >{{ act.title }} {{ card["activities"]?.length > 1 ? "en meer" : "" }}</span
                    >
                </div>
                <div v-if="Array.isArray(card['activity'])" class="inline-meta text-body-secondary">
                    <span v-for="act in card['activity']?.slice(0, 1)" class="fs-8"
                        >{{ act }} {{ card["activity"]?.length > 1 ? "en meer" : "" }}</span
                    >
                </div>
                <div v-else-if="card['activity']" class="inline-meta text-body-secondary">
                    <span class="fs-8">{{ card["activity"] }}</span>
                </div>
            </div>
            <div class="flex-shrink-0">
                <button
                    aria-expanded="false"
                    aria-label="Dropdown"
                    class="btn btn-sm rounded-circle lh-1 p-1"
                    data-bs-auto-close="outside"
                    data-bs-offset="0,10"
                    data-bs-toggle="dropdown"
                    type="button"
                >
                    <i class="bi bi-three-dots-vertical"></i>
                </button>
                <ul class="dropdown-menu dropdown-menu-end border-0 rounded-3 py-0 overflow-hidden">
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
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useContentStore } from "@/stores/content.ts";
import { useGeneralStore } from "@/stores/general.ts";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";

const props = defineProps({
    card: { type: Object, required: true },
});
const contentStore = useContentStore();
const generalStore = useGeneralStore();
const { selectedCardId, playlistCardId, shareCardId } = storeToRefs(contentStore);
const { seenItems, likedItems } = storeToRefs(generalStore);

const imageSrc = ref(null);
const loadImage = async () => {
    imageSrc.value = await contentStore.getCardImage(props.card);
};

onMounted(loadImage);

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
    return setMainTitle();
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

function setMainTitle() {
    if (["podcast", "video"].includes(props.card["type"])) return props.card["title"];
    else {
        if (props.card["custom_title"]) return props.card["custom_title"];
        else if (props.card["title_main"]) return props.card["titles"][props.card["title_main"]];
        else return props.card["titles"][0];
    }
}

function goToCard() {
    selectedCardId.value = selectedCardId.value === props.card["id"] ? null : props.card["id"];
    // router.push({path: `/item/${props.card['id']}`})
}

/**
 * Count amount of days ago.
 * @type {ComputedRef<number>}
 */
const daysAgo = computed(() => {
    return Math.round((new Date() - new Date(props.card["date"])) / (24 * 60 * 60 * 1000));
});

/**
 * Count amount of weeks ago.
 * @type {ComputedRef<number>}
 */
const weeksAgo = computed(() => {
    return Math.round((new Date() - new Date(props.card["date"])) / (7 * 24 * 60 * 60 * 1000));
});

/**
 * Count amount of months ago.
 * @type {ComputedRef<number>}
 */
const monthsAgo = computed(() => {
    const now = new Date();
    return (
        now.getMonth() -
        new Date(props.card["date"]).getMonth() +
        12 * (now.getFullYear() - new Date(props.card["date"]).getFullYear())
    );
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
.card
  &:hover .action-btn
    visibility: unset

  .action-btn
    visibility: hidden

.inline-meta
  line-height: 0.8rem

  span:not(:first-of-type):before
    margin: 0 4px
    content: "•"
</style>
