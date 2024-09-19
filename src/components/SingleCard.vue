<template>
  <transition>
    <div :key="card.id" class="row g-3">
      <div class="col-12 col-lg-6">
        <img :src="imgScr" alt="thumbnail" class="w-100 mb-2" />
        <h5 class="fw-bold">{{ title }}</h5>
      </div>
      <!-- description -->
      <div class="col-12 col-lg-6">
        <div class="card border-0 rounded-4" style="background-color: rgba(255, 255, 255, 0.1)">
          <div class="card-body">
            <div class="d-flex gap-3 mb-3 small">
              <span>
                <i class="bi bi-clock me-2"></i>
                <span>{{ duration }}</span>
              </span>
              <span>
                <i class="bi bi-calendar4-range me-2"></i>
                <span>{{ date }}</span>
              </span>
            </div>
            <p v-if="card.description">{{ card.description }}</p>
            <a
              :href="`https://docs.google.com/forms/d/e/1FAIpQLSeuPAoJu8xsn6JrxrYnRY5v2hw6iSj3eZCXX8QIpFqN6Uy1bA/viewform?usp=pp_url&entry.483165980=${card.id}`"
              target="_blank"
              >Stuur een beschrijving op!</a
            >
          </div>
        </div>
      </div>
      <!-- actions -->
      <div class="col-12">
        <div class="d-flex flex-wrap gap-2">
          <button
            :class="{ active: isLiked }"
            class="btn border rounded-pill text-nowrap"
            type="button"
            @click="generalStore.toggleLikedItem(card.id)"
          >
            <i :class="isLiked ? 'bi-hand-thumbs-up-fill' : 'bi-hand-thumbs-up'" class="bi me-2"></i
            >Like
          </button>
          <button
            :class="{ active: isSeen }"
            class="btn border rounded-pill text-nowrap"
            type="button"
            @click="generalStore.toggleSeenItem(card.id)"
          >
            <i :class="isSeen ? 'bi-eye-fill' : 'bi-eye'" class="bi me-2"></i>Gezien
          </button>
          <button
            :data-bs-target="'#playlistModal-' + card.id"
            class="btn border rounded-pill text-nowrap"
            data-bs-toggle="modal"
            type="button"
          >
            <i class="bi bi-collection-play me-2"></i>Bewaar
          </button>
          <button class="btn border rounded-pill text-nowrap" @click="copyLink">
            <i class="bi bi-copy me-2"></i>Kopieer link
          </button>
        </div>
      </div>

      <!-- links -->
      <div class="col-12 col-lg-6">
        <div
          class="card border-0 rounded-4 h-100"
          style="background-color: rgba(255, 255, 255, 0.1)"
        >
          <div class="card-body">
            <div class="small fw-lighter mb-2">Bekijk op:</div>
            <ul class="mb-0">
              <li v-if="card['twitch_id']">
                <a :href="'https://www.twitch.tv/videos/' + card['twitch_id']" target="_blank">
                  <i class="bi bi-twitch me-2"></i>Twitch
                </a>
              </li>
              <li v-if="card['youtube_id']">
                <a :href="'https://youtube.com/watch?v=' + card['youtube_id']" target="_blank">
                  <i class="bi bi-youtube me-2"></i>YouTube
                </a>
              </li>
              <li v-if="card['twitchtracker_id']">
                <a
                  :href="
                    'https://twitchtracker.com/lekkerspelen/streams/' + card['twitchtracker_id']
                  "
                  target="_blank"
                >
                  <i class="bi bi-twitch me-2"></i>TwitchTracker
                </a>
              </li>
              <li v-for="(extra, idx) in card['extra_urls']">
                <a :href="extra" target="_blank">
                  <i class="bi bi-gift me-2"></i>Extra {{ idx + 1 }}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- activities -->
      <div class="col-12 col-lg-6">
        <div
          class="card border-0 rounded-4 h-100"
          style="background-color: rgba(255, 255, 255, 0.1)"
        >
          <div class="card-body">
            <div class="small fw-lighter mb-2">Activiteiten/games:</div>
            <ul class="mb-0">
              <li v-for="act in card.activities">
                <span
                  :title="`Zoek op '${act.title}'`"
                  class="text-decoration-underline text-wrap"
                  type="button"
                  @click="searchActivity(act.title)"
                  >{{ act.title }}</span
                >
              </li>
              <template v-if="Array.isArray(card.activity)">
                <li v-for="act in card.activity">
                  <span
                    :title="`Zoek op '${act}'`"
                    class="text-decoration-underline text-wrap"
                    type="button"
                    @click="searchActivity(act)"
                    >{{ act }}</span
                  >
                </li>
              </template>
              <li v-if="card.activity">
                <span
                  :title="`Zoek op '${card.activity}'`"
                  class="text-decoration-underline text-wrap"
                  type="button"
                  @click="searchActivity(card.activity)"
                  >{{ card.activity }}</span
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- tags -->
      <div class="col-12 col-lg-6">
        <div
          class="card border-0 rounded-4 h-100"
          style="background-color: rgba(255, 255, 255, 0.1)"
        >
          <div class="card-body">
            <div class="small fw-lighter mb-2">Tags:</div>
            <ul class="mb-0">
              <li v-for="tag in card.tags">
                <span class="text-wrap">{{ tag }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- series -->
      <div v-if="collectionName" class="mb-3">
        <div class="d-flex align-items-center justify-content-between mb-3">
          <span class="fw-bold">Meer zoals dit</span>
          <button
            class="btn btn-sm border rounded-pill text-nowrap"
            @click="show_more = !show_more"
          >
            Toon
            {{ show_more ? "minder" : "meer" }}
          </button>
        </div>
        <div class="row g-2">
          <div
            v-for="card in collectionItems.slice(0, show_more ? collectionItems.length : 2)"
            class="col-6"
          >
            <MiniCard :card="card"></MiniCard>
          </div>
        </div>
      </div>

      <!-- info -->
      <span class="small fst-italic">Item-nummer: {{ card.id }}</span>
    </div>
  </transition>

  <!-- Modal -->
  <Teleport to="body">
    <PlaylistModal :id="card.id" :key="card['id']" />
  </Teleport>
</template>
<script setup>
import MiniCard from "@/components/MiniCard.vue";
import PlaylistModal from "@/components/PlaylistModal.vue";
import { useContentStore } from "@/stores/content.js";
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";

const contentStore = useContentStore();
const generalStore = useGeneralStore();
const { images, filters } = storeToRefs(contentStore);
const { likedItems, seenItems } = storeToRefs(generalStore);

const show_more = ref(false);

const props = defineProps({
  card: { type: Object, required: true },
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

const duration = computed(() => {
  return secondsToHms();
});
const title = computed(() => {
  return setMainTitle();
});
const shareUrl = computed(() => {
  const host = window.location.host;
  return `${host}/item/${card.value["id"]}`;
});
const isLiked = computed(() => {
  return likedItems.value.includes(props.card["id"]);
});
const isSeen = computed(() => {
  return seenItems.value.includes(props.card["id"]);
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
const collectionName = computed(() => {
  return card.value.collection ? contentStore.getCollection(card.value.collection).title : null;
});
const collectionItems = computed(() => {
  return collectionName.value ? contentStore.getSingleCollection(card.value["collection"]) : [];
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
 * Returns card main title
 * @returns {any}
 */
function setMainTitle() {
  if (["podcast", "video"].includes(card.value["type"])) return card.value["title"];
  else {
    if (card.value["custom_title"]) return card.value["custom_title"];
    else if (card.value["title_main"]) return card.value["titles"][card.value["title_main"]];
    else return card.value["titles"][0];
  }
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
}
</script>

<style lang="sass" scoped>
.v-enter-active
    transition: opacity 0.3s ease

.v-enter-from,
.v-leave-to
    opacity: 0
</style>
