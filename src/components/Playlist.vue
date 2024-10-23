<template>
  <div class="card h-100 border-0 bg-transparent">
    <div class="stack-2 border border-3 border-dark bg-dark z-0"></div>
    <div class="stack border border-3 border-dark-subtle bg-dark-subtle z-0"></div>
    <div
      :class="[
        card.type === 'podcast' ? 'bg-success' : card.type === 'video' ? 'bg-yt' : 'bg-tw',
        { active: card.id === selectedCardId },
      ]"
      class="img-wrapper position-relative"
      type="button"
      @click="goToCard"
      @click.middle="goToCard('middle')"
    >
      <div class="transform-wrapper position-relative">
        <img :src="imgScr" alt="thumbnail" class="w-100" />
        <span
          class="badge bg-black position-absolute bottom-0 end-0 m-2"
          style="--bs-bg-opacity: 0.75"
          ><i class="bi bi-collection-play me-1"></i> {{ playlist["items"].length }}
          {{ playlist["items"].length > 1 ? "items" : "item" }}
        </span>
      </div>
    </div>

    <div class="card-body pt-3 pb-0 px-2 px-sm-0">
      <div class="d-flex justify-content-between gap-2 position-relative">
        <div class="meta flex-grow-1">
          <h3
            class="fs-6 fw-bold mb-1"
            type="button"
            @click="goToCard"
            @click.middle="goToCard('middle')"
          >
            {{ playlist["title"] }}
          </h3>
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
          <ul class="dropdown-menu dropdown-menu-end border-0 rounded-3 py-0 overflow-hidden">
            <li>
              <button
                class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                type="button"
                @click="generalStore.deletePlaylist(playlist['title'])"
              >
                <i class="bi bi-trash me-2"></i><span class="small">Verwijder</span>
              </button>
            </li>
          </ul>
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
import { computed, onBeforeMount, ref } from "vue";

const generalStore = useGeneralStore();

const props = defineProps({
  playlist: { type: Object, required: true },
});
const contentStore = useContentStore();
const { images } = storeToRefs(contentStore);

const card = ref(null);

const imgScr = computed(() => {
  return card.value
    ? images.value["320"][`${card.value["twitch_id"]}`] ||
        images.value["320"][`${card.value["youtube_id"]}`] ||
        (!card.value["twitch_id"] && !card.value["youtube_id"]
          ? images.value["320"][`no_video`]
          : images.value["320"][`default`])
    : images.value["320"][`default`];
});

onBeforeMount(() => {
  if (props.playlist.items.length) card.value = contentStore.getSingleCard(props.playlist.items[0]);
});

/**
 * Navigate to item
 * @param type
 */
function goToCard(type = "left") {
  const path = `/you/playlist/${props.playlist["title"]}`;
  if (type === "middle") {
    const routeData = router.resolve({ path: path });
    window.open(routeData.href, "_blank");
  } else {
    router.push({ name: "playlist", params: { title: props.playlist["title"] } });
  }
}
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
