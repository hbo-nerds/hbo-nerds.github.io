<template>
    <div class="card border-0 bg-transparent position-relative">
        <div :class="card.type === 'stream' && card.free ? 'p-1 bg-warning' : ''" class="thumbnail-wrapper position-relative rounded-3 z-1"
             @click="goToCard"
             @click.middle="goToCard('middle')">
            <img v-lazy="{ src: imgScr, loading: images['320'][`default`]}" alt="thumbnail" class="w-100 rounded-3">
            <span class="badge rounded-0 bg-black position-absolute bottom-0 end-0 m-2"
                  style="--bs-bg-opacity: .75;">{{ duration }}</span>
            <span v-if="card.type === 'stream' && card.free"
                  class="badge rounded-0 bg-warning position-absolute top-0 end-0 m-2 text-uppercase">
                Gratis
            </span>

            <div v-if="isSeen"
                 class="bg-dark opacity-75 position-absolute top-0 bottom-0 start-0 end-0 d-flex align-items-center justify-content-center">
                <i class="text-light bi bi-eye-fill fs-4 opacity-100"></i>
            </div>
        </div>
        <div class="card-body pt-3 pb-0 px-0">
            <h3 class="fs-6 fw-bold mb-1" type="button" @click="goToCard" @click.middle="goToCard('middle')">{{
                    title
                }}</h3>
        </div>
    </div>
</template>

<script setup>
import {computed} from "vue";
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import router from "@/router/index.js";
import {useGeneralStore} from "@/stores/general.js";

const props = defineProps({
    card: {type: Object, required: true},
})
const contentStore = useContentStore()
const generalStore = useGeneralStore()
const {images, selectedCardId} = storeToRefs(contentStore)
const {seenItems} = storeToRefs(generalStore)

const imgScr = computed(() => {
    return images.value['320'][`${props.card['twitch_id']}`] ||
        images.value['320'][`${props.card['youtube_id']}`] ||
        (!props.card['twitch_id'] && !props.card['youtube_id'] ? images.value['320'][`no_video`] : images.value['320'][`default`])
})

const duration = computed(() => {
    return secondsToHms()
})
const title = computed(() => {
    return setMainTitle()
})
const isSeen = computed(() => {
    return seenItems.value.includes(props.card['id'])
})

function secondsToHms() {
    let d = Number(props.card.duration);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}

function setMainTitle() {
    if (['podcast', 'video'].includes(props.card['type']))
        return props.card['title']
    else {
        if (props.card['custom_title'])
            return props.card['custom_title']
        else if (props.card['title_main'])
            return props.card['titles'][props.card['title_main']]
        else
            return props.card['titles'][0]
    }
}

function goToCard() {
    selectedCardId.value = selectedCardId.value === props.card['id'] ? null : props.card['id']
    // router.push({path: `/item/${props.card['id']}`})
}
</script>

<style lang="sass" scoped>
.card
    &:hover .action-btn
        visibility: unset
    .action-btn
        visibility: hidden

</style>
