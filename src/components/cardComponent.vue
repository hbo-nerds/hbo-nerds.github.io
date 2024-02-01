<template>
    <div class="card h-100">
        <img :src="images[`${fileName}`] || images[`default`]" class="card-img-top" alt="thumbnail">
        <div class="card-body">
            <h6 class="card-title">{{ card.title }}</h6>
            <div class="fst-italic">{{ card.date }}</div>
            <div class="fst-italic">{{ duration }}</div>
            <div class="d-flex">
                <a class="text-danger me-2" v-if="card.type === 'stream' && card.youtube" :href="card.youtube" target="_blank"><i class="bi bi-youtube"></i></a>
                <a class="text-black me-2" v-if="card.type === 'stream' && card.twitch" :href="card.twitch" target="_blank"><i class="bi bi-twitch"></i></a>
                <a class="text-danger me-2" v-if="card.type === 'video'" :href="card.url" target="_blank"><i class="bi bi-youtube"></i></a>
                <a class="text-danger me-2" v-if="card.type === 'podcast'" :href="card.url" target="_blank"><i class="bi bi-youtube"></i></a>
            </div>
        </div>
    </div>
</template>

<script setup>
import {computed} from "vue";

const props = defineProps({
    card: {type: Object, required: true},
    images: {type: Object, required: true}
})

const fileName = computed(() => {
    if (props.card.type === 'stream') {
        if (props.card.twitch)
            return props.card.twitch.split('/')[4];
        else if (props.card.youtube)
            return GetYoutubeIDFromURL(props.card.youtube)
        else
            return 'no_video'
    } else
        return GetYoutubeIDFromURL(props.card.url)
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
</script>

<style scoped lang="sass"></style>
