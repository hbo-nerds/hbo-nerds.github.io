<template>
    <div class="card h-100 border-0 bg-transparent">
        <div class="stack-2 border border-3 border-dark bg-dark z-0"></div>
        <div class="stack border border-3 border-dark-subtle bg-dark-subtle z-0"></div>
        <div
            v-if="card"
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
                <transition name="fade">
                    <img
                        v-if="imageSrc"
                        :src="imageSrc"
                        alt="thumbnail"
                        class="w-100"
                        loading="lazy"
                    />
                </transition>

                <span
                    class="badge bg-black position-absolute bottom-0 end-0 m-2"
                    style="--bs-bg-opacity: 0.75"
                    ><i class="bi bi-collection-play me-1"></i> {{ playlist["items"].length }}
                    {{ playlist["items"].length > 1 ? "items" : "item" }}
                </span>
            </div>
        </div>
        <div
            v-else
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
                    {{ playlist["items"].length === 1 ? "item" : "items" }}
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
                    <ul
                        class="dropdown-menu dropdown-menu-end border-0 rounded-3 py-0 overflow-hidden"
                    >
                        <li>
                            <button
                                class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                                data-bs-target="#edit-playlist-modal"
                                data-bs-toggle="modal"
                                type="button"
                                @click="editPlaylistTitle = playlist['title']"
                            >
                                <i class="bi bi-pencil me-2"></i><span class="small">Bewerken</span>
                            </button>
                        </li>
                        <li>
                            <button
                                class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                                type="button"
                                @click="generalStore.deletePlaylist(playlist['title'])"
                            >
                                <i class="bi bi-trash me-2"></i
                                ><span class="small">Verwijderen</span>
                            </button>
                        </li>
                        <li>
                            <button
                                class="d-block w-100 btn btn-dark border-0 rounded-0 text-start py-2"
                                data-bs-target="#share-playlist-modal"
                                data-bs-toggle="modal"
                                type="button"
                                @click="sharePlaylistTitle = playlist['title']"
                            >
                                <i class="bi bi-share me-2"></i><span class="small">Delen</span>
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
import { useContentStore } from "@/stores/content.ts";
import { useGeneralStore } from "@/stores/general.ts";
import { storeToRefs } from "pinia";
import { onBeforeMount, onMounted, ref } from "vue";

const generalStore = useGeneralStore();

const props = defineProps({
    playlist: { type: Object, required: true },
});
const contentStore = useContentStore();
const { selectedCardId, sharePlaylistTitle, editPlaylistTitle } = storeToRefs(contentStore);

const card = ref(null);

const imageSrc = ref(null);
const loadImage = async () => {
    imageSrc.value = await contentStore.getCardImage(card.value);
};

onMounted(loadImage);
onBeforeMount(() => {
    if (props.playlist.items.length)
        card.value = contentStore.getSingleCard(props.playlist.items[0]);
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
      transform: translate3d(0.4rem, -0.4rem, 0px)
</style>
