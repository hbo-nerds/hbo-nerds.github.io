<template>
    <div class="card h-100 border border-4" @click="selectCard" :class="card.type === 'podcast' ? 'border-success' :
            card.type === 'video' ? 'border-danger' : 'border-warning'">
        <div class="position-relative">
            <img :src="images[`${imgName}`] || images[`default`]" class="card-img-top" alt="thumbnail">
            <span class="badge rounded-0 bg-secondary position-absolute top-0 start-0"
                  style="--bs-bg-opacity: .75;">{{ card.date }}</span>
            <span class="badge rounded-0 bg-secondary position-absolute bottom-0 end-0"
                  style="--bs-bg-opacity: .75;">{{ duration }}</span>
            <span class="badge rounded-0 position-absolute top-0 end-0 text-uppercase" :class="card.type === 'podcast' ? 'bg-success' :
            card.type === 'video' ? 'bg-danger' : 'bg-warning'">{{ card.type }}</span>
            <div class="position-absolute bottom-0 start-0">
                <a :href="'https://youtube.com/watch?v=' + card['youtube_id']" class="btn btn-sm btn-light rounded-0" v-if="card['youtube_id']"><i class="bi bi-youtube text-youtube"></i></a>
                <a :href="'https://www.twitch.tv/videos/' + card['twitch_id']" class="btn btn-sm btn-light rounded-0" v-if="card['twitch_id']"><i class="bi bi-twitch text-twitch"></i></a>
            </div>
        </div>
        <div class="card-body">
            <h6 class="card-title m-0">{{ title }}</h6>
        </div>
    </div>
</template>

<script setup>
import {computed} from "vue";
import {useGeneralStore} from "@/stores/general.js";

const props = defineProps({
    card: {type: Object, required: true},
    images: {type: Object, required: true}
})
const generalStore = useGeneralStore()

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

const active = computed(() => {
    return props.card.id === generalStore.selectedCard.id && props.card.type === generalStore.selectedCard.type
})

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

function selectCard() {
    active.value ? generalStore.selectCard('', '') : generalStore.selectCard(props.card.id, props.card.type)
}
</script>

<style scoped lang="sass">
.card:hover
    cursor: pointer
</style>
