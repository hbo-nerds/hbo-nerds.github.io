<template>
  <!-- single-card -->
  <div :id="'singleCard_' + card.id" class="pt-3 pb-5">
    <div v-if="showCloseBtn" class="d-flex gap-2 mb-3">
      <button class="btn btn-dark rounded-3 border-0" @click="selectedCardId = null">Sluit</button>
    </div>
    <div :key="card.id" class="row g-3">
      <div class="col-12 col-lg-12">
        <img :src="imgScr" alt="thumbnail" class="w-100 mb-3" />
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
      <div class="col-12 col-3xl-6" v-if="card['twitch_id'] || card['youtube_id']">
        <div class="card border-0 rounded-4">
          <div class="card-body">
            <div class="d-flex flex-wrap gap-2">
              <a
                v-if="card['twitch_id']"
                :href="'https://www.twitch.tv/videos/' + card['twitch_id']"
                class="flex-grow-0"
                style="max-width: 60px"
                title="Bekijk op Twitch"
                target="_blank"
              >
                <img alt="twitch_vod" class="w-100 rounded-4" src="../assets/img/twitch-icon.png" />
              </a>
              <a
                v-if="card['youtube_id']"
                :href="'https://youtube.com/watch?v=' + card['youtube_id']"
                class="flex-grow-0"
                style="max-width: 60px"
                title="Bekijk op YouTube"
                target="_blank"
              >
                <img alt="youtube_vod" class="w-100 rounded-4" src="../assets/img/youtube.png" />
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
            type="button"
            @click="generalStore.toggleLikedItem(card.id)"
          >
            <i class="bi bi-hand-thumbs-up me-2"></i>Like
          </button>
          <button
            :class="{ active: isSeen }"
            class="btn btn-dark border-0 rounded-pill text-nowrap"
            type="button"
            @click="generalStore.toggleSeenItem(card.id)"
          >
            <i class="bi bi-eye me-2"></i>Gezien
          </button>
          <button
            class="btn btn-dark border-0 rounded-pill text-nowrap"
            data-bs-target="#playlist-modal"
            data-bs-toggle="modal"
            type="button"
            @click="playlistCardId = card.id"
          >
            <i class="bi bi-collection-play me-2"></i>Bewaar
          </button>
          <button class="btn btn-dark border-0 rounded-pill text-nowrap" @click="copyLink">
            <i class="bi bi-copy me-2"></i>Kopieer link
          </button>
          <a
            v-if="card['twitchtracker_id']"
            :href="'https://twitchtracker.com/lekkerspelen/streams/' + card['twitchtracker_id']"
            class="btn border rounded-pill text-nowrap d-flex align-items-center"
            target="_blank"
          >
            <img
              alt="logo"
              class="rounded-circle me-2"
              height="24"
              src="../assets/img/twitch_tracker_1x.png"
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
                :title="`Filter on '${act.title}'`"
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
            <div class="d-flex flex-wrap gap-2">
              <span v-for="tag in card.tags" class="badge rounded-pill text-bg-secondary">{{
                tag
              }}</span>
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
              <template v-for="(url, i) in card['extra_urls']" :key="i">
                <a
                  v-if="url.includes('twitch')"
                  :href="url"
                  class="btn border rounded-pill text-nowrap d-flex align-items-center"
                  target="_blank"
                >
                  <img
                    alt="logo"
                    class="rounded-circle me-2"
                    height="24"
                    src="../assets/img/twitch-icon.png"
                  />
                  <span>Twitch</span>
                </a>
                <a
                  v-else-if="url.includes('youtube')"
                  :href="url"
                  class="btn border rounded-pill text-nowrap d-flex align-items-center"
                  target="_blank"
                >
                  <img
                    alt="logo"
                    class="rounded-circle me-2"
                    height="24"
                    src="../assets/img/youtube.png"
                  />
                  <span>YouTube</span>
                </a>
                <a
                  v-else
                  :href="url"
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
        <div class="accordion" id="accordionCollections">
          <div v-for="(col, index) in collections" class="accordion-item" :key="index">
            <h2 class="accordion-header">
              <button
                aria-controls="collapseOne"
                aria-expanded="false"
                class="accordion-button collapsed"
                :data-bs-target="'#COL_' + index"
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
              <div class="accordion-body">
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
  </div>
</template>
<script setup>
import MiniCard from "@/components/MiniCard.vue";
import { useContentStore } from "@/stores/content.js";
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";

const contentStore = useContentStore();
const generalStore = useGeneralStore();
const { images, filters, selectedCardId, playlistCardId, getCompleteCollections } =
  storeToRefs(contentStore);
const { likedItems, seenItems } = storeToRefs(generalStore);

const readMore = ref(false);

const props = defineProps({
  card: { type: Object, required: true },
  showCloseBtn: { type: Boolean, default: true },
});

const card = computed(() => {
  return props.card;
});

const imgScr = computed(() => {
  return (
    images.value["640"][`${props.card["twitch_id"]}`] ||
    images.value["640"][`${props.card["youtube_id"]}`] ||
    (!props.card["twitch_id"] && !props.card["youtube_id"]
      ? images.value["640"][`no_video`]
      : images.value["640"][`default`])
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
  return contentStore.getCardTitle(card.value);
});

const shareUrl = computed(() => {
  const host = "https://" + window.location.host;
  return `${host}/item/${card.value["id"]}`;
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

const activities = computed(() => {
  if (card.value.activity)
    return [].concat(
      Array.isArray(card.value.activity)
        ? card.value.activity.map((act) => {
            return { title: act };
          })
        : [{ title: card.value.activity }],
    );
  else if (card.value.activities) return [].concat(card.value.activities);
  else return [];
});

onMounted(() => {
  generalStore.updateHistory(card.value.id);
});

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
 * Copy link to clipboard
 */
function copyLink() {
  navigator.clipboard.writeText(shareUrl.value);
}

/**
 * Search for clicked activity/game
 * @param activity
 */
function searchActivity(activity) {
  contentStore.resetFilters(); //reset
  filters.value.activity = [activity]; //set
  contentStore.filter(); //call
  //TODO close modal...
}
</script>

<style lang="sass" scoped></style>
