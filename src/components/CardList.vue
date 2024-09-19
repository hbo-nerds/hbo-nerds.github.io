<template>
  <div class="card" @click="goToCard" @click.middle="goToCard('middle')">
    <div class="card-body">
      <div class="row">
        <div class="col-5 col-md-3">
          <div
            class="position-relative border border-3 rounded-1"
            :class="
              card.type === 'podcast'
                ? 'border-success'
                : card.type === 'video'
                  ? 'border-yt'
                  : 'border-tw'
            "
          >
            <img
              class="w-100"
              v-lazy="{
                src: images['320'][`${imgName}`] || images['320'][`default`],
                loading: 'Loading your image',
              }"
              alt="thumbnail"
            />
            <span
              class="badge rounded-0 position-absolute top-0 end-0 text-uppercase fw-bold"
              :class="
                card.type === 'podcast' ? 'bg-success' : card.type === 'video' ? 'bg-yt' : 'bg-tw'
              "
              >{{ card.type }}</span
            >
          </div>
        </div>
        <div class="col">
          <div class="row">
            <div class="col-12 col-md-8">
              <div class="content-wrapper h-100 d-flex flex-column">
                <h5 class="card-title">{{ title }}</h5>
                <p v-if="card.description">{{ card.description }}</p>
                <div class="mt-auto d-flex">
                  <div class="me-3"><i class="bi bi-calendar4-range me-3"></i>{{ card.date }}</div>
                  <div class="me-3"><i class="bi bi-clock me-3"></i>{{ duration }}</div>
                  <a
                    :href="`https://docs.google.com/forms/d/e/1FAIpQLSeuPAoJu8xsn6JrxrYnRY5v2hw6iSj3eZCXX8QIpFqN6Uy1bA/viewform?usp=pp_url&entry.483165980=${card.id}`"
                    target="_blank"
                    >Stuur een beschrijving op!</a
                  >
                </div>
              </div>
            </div>
            <div class="col-12 col-md-4">
              <div class="content-wrapper h-100 d-flex flex-column">
                <a
                  v-if="card['twitch_id']"
                  :href="'https://www.twitch.tv/videos/' + card['twitch_id']"
                  class="me-2 mb-2"
                  target="_blank"
                >
                  <img
                    style="width: 32px; height: 32px"
                    src="../assets/img/twitch.png"
                    alt="logo"
                  />
                </a>
                <a
                  v-if="card['youtube_id']"
                  :href="'https://youtube.com/watch?v=' + card['youtube_id']"
                  class="me-2 mb-2"
                  target="_blank"
                >
                  <img
                    style="width: 32px; height: 32px"
                    src="../assets/img/youtube.png"
                    alt="logo"
                  />
                </a>
                <a
                  v-if="card['twitchtracker_id']"
                  :href="
                    'https://twitchtracker.com/lekkerspelen/streams/' + card['twitchtracker_id']
                  "
                  class="mt-auto"
                  target="_blank"
                >
                  TwitchTracker
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import router from "@/router/index.js";
import { useContentStore } from "@/stores/content.js";
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { computed } from "vue";

const props = defineProps({
  card: { type: Object, required: true },
});
const generalStore = useGeneralStore();
const contentStore = useContentStore();
const { images } = storeToRefs(contentStore);

const imgName = computed(() => {
  if (props.card["type"] === "stream") {
    if (props.card["twitch_id"]) return props.card["twitch_id"];
    else if (props.card["youtube_id"]) {
      return props.card["youtube_id"];
    } else return "no_video";
  } else {
    return props.card["youtube_id"];
  }
});

const duration = computed(() => {
  return secondsToHms();
});
const title = computed(() => {
  return setMainTitle();
});

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

function goToCard(type = "left") {
  if (type === "middle") {
    const routeData = router.resolve({ path: `/item/${props.card["id"]}` });
    window.open(routeData.href, "_blank");
  } else router.push({ path: `/item/${props.card["id"]}` });
}
</script>

<style scoped lang="sass">
.card:hover
    cursor: pointer

.platform-link img
    height: 24px
    width: 24px
</style>
