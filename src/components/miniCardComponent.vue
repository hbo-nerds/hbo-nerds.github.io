<template>
    <div class="card h-100 border-0 bg-transparent" @click="goToCard">
        <div class="position-relative border border-3 rounded-1" :class="card.type === 'podcast' ? 'border-success' :
            card.type === 'video' ? 'border-yt' : 'border-tw'">
            <img :src="images['320'][`${imgName}`] || images['320'][`default`]" class="w-100" alt="thumbnail">
            <span class="badge rounded-0 bg-black position-absolute top-0 start-0"
                  style="--bs-bg-opacity: .75;">{{ card.date }}</span>
            <span class="badge rounded-0 bg-black position-absolute bottom-0 end-0"
                  style="--bs-bg-opacity: .75;">{{ duration }}</span>
            <span class="badge rounded-0 position-absolute top-0 end-0 text-uppercase fw-bold" :class="card.type === 'podcast' ? 'bg-success' :
            card.type === 'video' ? 'bg-yt' : 'bg-tw'">{{ card.type }}</span>
            <div class="position-absolute bottom-0 start-0">
                <a :href="'https://www.twitch.tv/videos/' + card['twitch_id']" class="platform-link" v-if="card['twitch_id']"><img src="../assets/img/twitch.png" alt="logo"></a>
                <a :href="'https://youtube.com/watch?v=' + card['youtube_id']" class="platform-link" v-if="card['youtube_id']"><img src="../assets/img/youtube.png" alt="logo"></a>
            </div>
        </div>
        <div class="card-body py-2 px-0">
            <span class="card-title m-0">{{ title }}</span>
        </div>
    </div>
</template>

<script setup>
import {computed} from "vue";
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import {useGeneralStore} from "@/stores/general.js";
import router from "@/router/index.js";

const props = defineProps({
    card: {type: Object, required: true},
})
const contentStore = useContentStore()
const {images} = storeToRefs(contentStore)

const imgName = computed(() => {
    if (props.card['type'] === 'stream') {
        if (props.card['twitch_id'])
            return props.card['twitch_id'];
        else if (props.card['youtube_id']) {
            return props.card['youtube_id']
        } else
            return 'no_video'
    } else {
        return props.card['youtube_id']
    }
})

const duration = computed(() => { return secondsToHms() })
const title = computed(() => { return setMainTitle() })

function secondsToHms() {
    let d = Number(props.card.duration);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}

function setMainTitle() {
    if (['podcast','video'].includes(props.card['type']))
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
    router.push({ path: `/item/${props.card['id']}` })
}
</script>

<style scoped lang="sass">
.card:hover
    cursor: pointer
.platform-link img
    height: 24px
    width: 24px
</style>
