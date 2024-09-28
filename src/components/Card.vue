<template>
  <div class="card h-100 border-0 bg-transparent">
    <div v-if="isSeries" class="stack-2 border border-3 border-dark bg-dark z-0"></div>
    <div v-if="isSeries" class="stack border border-3 border-dark-subtle bg-dark-subtle z-0"></div>
    <div
      :class="[
        card.type === 'podcast'
          ? 'border-success'
          : card.type === 'video'
            ? 'border-yt'
            : 'border-tw',
        { active: card.id === selectedCardId },
      ]"
      class="img-wrapper position-relative"
      type="button"
      @click="goToCard"
      @click.middle="goToCard('middle')"
    >
      <div class="corner-top"></div>
      <div class="corner-bottom"></div>
      <div class="edge-left"></div>
      <div class="edge-bottom"></div>

      <div class="transform-wrapper position-relative">
        <img :src="imgScr" alt="thumbnail" class="w-100" />
        <span
          class="badge bg-black position-absolute top-0 start-0 m-2"
          style="--bs-bg-opacity: 0.75"
          >{{ card.date }}</span
        >

        <span
          class="badge bg-black position-absolute bottom-0 end-0 m-2"
          style="--bs-bg-opacity: 0.75"
          >{{ duration }}</span
        >
        <span
          v-if="card.type === 'stream' && card.free"
          class="badge bg-warning position-absolute top-0 end-0 m-2 text-uppercase"
        >
          Gratis
        </span>

        <div
          v-if="isSeen"
          class="bg-dark opacity-75 position-absolute top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center"
        >
          <i class="text-light bi bi-eye-fill fs-4 opacity-100"></i>
        </div>
      </div>
    </div>
    <div class="card-body pt-3 pb-0 px-2 px-sm-0">
      <div class="d-flex justify-content-between gap-2 position-relative">
        <a
          v-if="card['twitch_id']"
          :href="'https://www.twitch.tv/videos/' + card['twitch_id']"
          target="_blank"
        >
          <img
            alt="logo"
            class="rounded-circle"
            height="32"
            src="../assets/img/twitch-icon.png"
            width="32"
          />
        </a>
        <a
          v-else-if="card['type'] === 'podcast'"
          :href="'https://youtube.com/watch?v=' + card['youtube_id']"
          target="_blank"
        >
          <img
            alt="logo"
            class="rounded-circle"
            height="32"
            src="../assets/img/podcast.png"
            width="32"
          />
        </a>
        <a
          v-else-if="card['youtube_id']"
          :href="'https://youtube.com/watch?v=' + card['youtube_id']"
          target="_blank"
        >
          <img
            alt="logo"
            class="rounded-circle"
            height="32"
            src="../assets/img/youtube.png"
            width="32"
          />
        </a>

        <div class="meta flex-grow-1">
          <h3
            class="fs-6 fw-bold mb-1"
            type="button"
            @click="goToCard"
            @click.middle="goToCard('middle')"
          >
            {{ isSeries ? `${collectionName} - (${collectionCount})` : title }}
          </h3>

          <div class="inline-meta text-body-secondary">
            <span v-if="daysAgo < 14" class="small"
              >{{ daysAgo }} {{ daysAgo !== 1 ? "dagen" : "dag" }} geleden</span
            >
            <span v-else-if="weeksAgo < 4" class="small"
              >{{ weeksAgo }} {{ weeksAgo !== 1 ? "weken" : "week" }} geleden</span
            >
            <span v-else-if="monthsAgo < 12" class="small"
              >{{ monthsAgo }} {{ monthsAgo !== 1 ? "maanden" : "maand" }} geleden</span
            >
            <span v-else class="small">{{ yearAgo }} jaar geleden</span>
            <span v-if="card['collection']" class="small"
              ><i class="bi bi-collection-play"></i
            ></span>
          </div>
          <div class="inline-meta text-body-secondary">
            <span v-for="act in card['activities']?.slice(0, 1)" class="small"
              >{{ act.title }} {{ card["activities"]?.length > 1 ? "en meer" : "" }}</span
            >
          </div>
          <div v-if="Array.isArray(card['activity'])" class="inline-meta text-body-secondary">
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
            class="btn btn-circle btn-sm rounded-circle"
            data-bs-toggle="dropdown"
            data-bs-offset="0,10"
          >
            <i class="bi bi-three-dots-vertical lh-1"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end">
            <li v-if="card['collection']">
              <RouterLink
                :to="{ name: 'serie', params: { id: card['collection'] } }"
                class="dropdown-item"
                title="Ga naar serie"
              >
                <i class="bi bi-collection-play me-2"></i>Naar collectie
              </RouterLink>
            </li>
            <li>
              <button
                class="dropdown-item"
                type="button"
                @click="generalStore.toggleSeenItem(card['id'])"
              >
                <i class="bi bi-eye me-2"></i>{{ isSeen ? "Niet gezien" : "Gezien" }}
              </button>
            </li>
            <li>
              <button
                class="dropdown-item"
                data-bs-target="#playlist-modal"
                data-bs-toggle="modal"
                type="button"
                @click="selectedCardId = card.id"
              >
                <i class="bi bi-collection-play me-2"></i>Bewaar
              </button>
            </li>
            <li>
              <button
                class="dropdown-item"
                type="button"
                @click="generalStore.toggleLikedItem(card['id'])"
              >
                <i class="bi bi-hand-thumbs-up me-2"></i>{{ isLiked ? "Niet leuk" : "Leuk!" }}
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <button
      ref="canvasBtn"
      class="d-none"
      type="button"
      data-bs-toggle="modal"
      data-bs-target="#singleCardModel"
    ></button>
  </div>
</template>

<script setup>
import router from "@/router/index.js";
import { useContentStore } from "@/stores/content.js";
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

const props = defineProps({
  card: { type: Object, required: true },
  isSeries: { type: Boolean, default: false },
});
const contentStore = useContentStore();
const generalStore = useGeneralStore();
const { images, selectedCardId } = storeToRefs(contentStore);
const { seenItems, likedItems } = storeToRefs(generalStore);

const canvasBtn = ref(null);

/**
 * Look for VOD thumbnail.
 * @type {ComputedRef<unknown>}
 */
const imgScr = computed(() => {
  return (
    images.value["320"][`${props.card["twitch_id"]}`] ||
    images.value["320"][`${props.card["youtube_id"]}`] ||
    (!props.card["twitch_id"] && !props.card["youtube_id"]
      ? images.value["320"][`no_video`]
      : images.value["320"][`default`])
  );
});

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
  if (["podcast", "video"].includes(props.card["type"])) return props.card["title"];
  else {
    if (props.card["custom_title"]) return props.card["custom_title"];
    else if (props.card["title_main"]) return props.card["titles"][props.card["title_main"]];
    else return props.card["titles"][0];
  }
});

/**
 * Check VOD collection name.
 * @type {ComputedRef<*|null>}
 */
const collectionName = computed(() => {
  return props.card["collection"]
    ? contentStore.getCollection(props.card["collection"]).title
    : null;
});

/**
 * Check VOD collection count.
 * @type {ComputedRef<*|null>}
 */
const collectionCount = computed(() => {
  return props.card["collection"] ? contentStore.countSeriesItems(props.card["collection"]) : 0;
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

/**
 * Navigate to item
 * @param type
 */
function goToCard(type = "left") {
  if (props.isSeries) {
    const path = `/series/${props.card["collection"]}`;
    if (type === "middle") {
      const routeData = router.resolve({ path: path });
      window.open(routeData.href, "_blank");
    } else router.push({ path: path });
  } else {
    selectedCardId.value = selectedCardId.value === props.card["id"] ? null : props.card["id"];
    if (selectedCardId.value && canvasBtn.value) canvasBtn.value.click();
  }
  // const path = props.isSeries ? `/series/${props.card['collection']}` : `/item/${props.card['id']}`
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
.meta h3
  overflow: hidden
  text-overflow: ellipsis
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical

.inline-meta
  line-height: 16px

  span:not(:first-of-type):before
    margin: 0 4px
    content: "•"

.dropdown-menu
  background-color: #292929
  --bs-dropdown-link-hover-bg: #3d3d3d

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
  *
    transition-property: transform
    transition-timing-function: ease
    transition-duration: 100ms

  &.border-success
    .corner-top
      border-right-color: rgb(25, 135, 84)

    .corner-bottom
      border-top-color: rgb(25, 135, 84)

    .edge-left, .edge-bottom
      background: rgb(25, 135, 84)

  &.border-yt
    .corner-top
      border-right-color: #FF0000

    .corner-bottom
      border-top-color: #FF0000

    .edge-left, .edge-bottom
      background: #FF0000

  &.border-tw
    .corner-top
      border-right-color: #6441A5

    .corner-bottom
      border-top-color: #6441A5

    .edge-left, .edge-bottom
      background: #6441A5

  &.active
    .corner-top, .corner-bottom,
    .edge-left, .edge-bottom
      transition-delay: 75ms

    .corner-top
      transform: translateY(-0.4rem) scale(1)

    .corner-bottom
      transform: translateX(0.4rem) scale(1)

    .edge-left
      transform: scaleX(1)

    .edge-bottom
      transform: scaleY(1)

    .transform-wrapper
      transform: translate3d(0.4rem, -0.4rem, 0px)
      transition-delay: 75ms

.corner-top
  position: absolute
  top: 0
  left: 0
  width: 0
  height: 0
  border-top: 0.4rem solid transparent
  border-bottom: 0.4rem solid transparent
  border-right: 0.4rem solid
  transform-origin: left center
  transform: translateY(-0.4rem) scale(0)

.corner-bottom
  position: absolute
  bottom: 0
  right: 0
  width: 0
  height: 0
  border-left: 0.4rem solid transparent
  border-right: 0.4rem solid transparent
  border-top: 0.4rem solid
  transform-origin: center bottom
  transform: translateX(0.4rem) scale(0)

.edge-left
  position: absolute
  top: 0
  bottom: 0
  left: 0
  transform-origin: 0 100%
  width: 0.4rem
  transform: scaleX(0)

.edge-bottom
  position: absolute
  bottom: 0
  left: 0
  right: 0
  transform-origin: 0 100%
  height: 0.4rem
  transform: scaleY(0)
</style>
