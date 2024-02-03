<template>
    <div class="card h-100 border border-4" @click="selectCard" :class="card.type === 'podcast' ? 'border-success' :
            card.type === 'video' ? 'border-danger' : 'border-warning'">
        <div class="position-relative">
            <img :src="images[`${fileName}`] || images[`default`]" class="card-img-top" alt="thumbnail">
            <span class="badge rounded-0 bg-secondary position-absolute top-0 start-0"
                  style="--bs-bg-opacity: .75;">{{ card.date }}</span>
            <span class="badge rounded-0 bg-secondary position-absolute bottom-0 end-0"
                  style="--bs-bg-opacity: .75;">{{ duration }}</span>
            <span class="badge rounded-0 position-absolute top-0 end-0 text-uppercase" :class="card.type === 'podcast' ? 'bg-success' :
            card.type === 'video' ? 'bg-danger' : 'bg-warning'">{{ card.type }}</span>
            <div class="position-absolute bottom-0 start-0">
                <a :href="card.youtube" class="btn btn-sm btn-light rounded-0" v-if="card.youtube"><i class="bi bi-youtube text-youtube"></i></a>
                <a :href="card.twitch" class="btn btn-sm btn-light rounded-0" v-if="card.twitch"><i class="bi bi-twitch text-twitch"></i></a>
                <a :href="card.url" class="btn btn-sm btn-light rounded-0" v-if="card.url"><i class="bi" :class="card.url.includes('apple') ? 'bi-apple' : 'bi-youtube text-youtube'"></i></a>
            </div>
        </div>
        <div class="card-body">
            <h6 class="card-title m-0">{{ card.title }}</h6>
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

const fileName = computed(() => {
    if (props.card.type === 'stream') {
        if (props.card.twitch)
            return props.card.twitch.split('/')[4];
        else if (props.card.youtube) {
            return GetYoutubeIDFromURL(props.card.youtube)
        } else
            return 'no_video'
    } else {
        return GetYoutubeIDFromURL(props.card.url)
    }
})

const duration = computed(() => {
    switch (props.card.type) {
        case 'stream':
            return ConvertMinutesToTime(props.card.total_duration)
        case 'video':
            return props.card.duration
        case 'podcast':
            return props.card.duration
        default:
            return props.card.duration
    }
})

const active = computed(() => {
    return props.card.id === generalStore.selectedCard.id && props.card.type === generalStore.selectedCard.type
})

function ConvertMinutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const seconds = 0
    return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function GetYoutubeIDFromURL(url) {
    let id = url.split('=')[1];
    if (id.includes('&')) {
        id = id.split('&')[0];
    }
    return id;
}

function selectCard() {
    active.value ? generalStore.selectCard('', '') : generalStore.selectCard(props.card.id, props.card.type)
}
</script>

<style scoped lang="sass">
.card:hover
    cursor: pointer
</style>
