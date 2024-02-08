<template>
    <button class="btn btn-sm btn-primary mb-3" @click="deselectCard"><i class="bi bi-arrow-left"></i>Terug</button>
    <div v-if="card" class="card border border-3 position-sticky" style="top: 140px" :class="card.type === 'podcast' ? 'border-success' :
        card.type === 'video' ? 'border-yt' : 'border-tw'">
        <div class="position-relative rounded-1" >
            <img :src="images[`${imgName}`] || images[`default`]" class="card-img-top" alt="thumbnail">
            <span class="fs-5 badge rounded-0 bg-black position-absolute top-0 start-0"
                  style="--bs-bg-opacity: .75;">{{ card.date }}</span>
            <span class="fs-5 badge rounded-0 bg-black position-absolute bottom-0 end-0"
                  style="--bs-bg-opacity: .75;">{{ duration }}</span>
            <span class="fs-5 badge rounded-0 position-absolute top-0 end-0 text-uppercase fw-bold" :class="card.type === 'podcast' ? 'bg-success' :
        card.type === 'video' ? 'bg-yt' : 'bg-tw'">{{ card.type }}</span>

        </div>
        <div class="card-body text-center">
            <h3 class="card-title">{{ title }}</h3>
            <p v-if="card.description" class="card-text">{{ card.description }}</p>
            <button class="btn btn-sm btn-primary mb-3" @click="copyLink"><i class="bi bi-share me-2"></i>Delen</button>
            <div class="separator my-1">
                <a :href="'https://www.twitch.tv/videos/' + card['twitch_id']" target="_blank">Twitch</a>
                <span class="mx-2">|</span>
                <a :href="'https://twitchtracker.com/lekkerspelen/streams/' + card['twitchtracker_id']" target="_blank">TwitchTracker</a>
                <span class="mx-2">|</span>
                <a :href="'https://youtube.com/watch?v=' + card['youtube_id']" target="_blank">Youtube</a>
            </div>
            <div class="separator my-1">Tags</div>
            <div>
                <span v-for="(tag, idx) in card.tags" class="badge text-bg-secondary" :class="{'me-2' : idx < card.tags.length - 1}" :key="idx">{{tag}}</span>
            </div>
            <div class="separator my-1">Activiteiten</div>
            <div>
                <span v-for="(act, idx) in card.activities" class="badge text-bg-secondary" :class="{'me-2' : idx < card.activities.length - 1}" :key="idx">{{act.title}}</span>
            </div>
            <div class="separator my-1">Collectie</div>
            <div>{{ collection }}</div>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSeuPAoJu8xsn6JrxrYnRY5v2hw6iSj3eZCXX8QIpFqN6Uy1bA/viewform" target="_blank">Stuur een beschrijving op!</a>
        </div>
    </div>
</template>
<script setup>
import {computed} from "vue";
import {useContentStore} from "@/stores/content.js";
import {storeToRefs} from "pinia";
import {useGeneralStore} from "@/stores/general.js";

const contentStore = useContentStore()
const generalStore = useGeneralStore()
const {collections, content, images} = storeToRefs(contentStore)
const {selectedCard} = storeToRefs(generalStore)

const card = computed(() => {
    return content.value.length ? content.value.find(item => item.id === selectedCard.value) : null
})

const imgName = computed(() => {
    if (card.value['type'] === 'stream') {
        if (card.value['twitch_id'])
            return card.value['twitch_id'];
        else if (card.value['youtube_id']) {
            return card.value['youtube_id']
        } else
            return 'no_video'
    } else {
        return card.value['youtube_id']
    }
})

const duration = computed(() => { return secondsToHms() })
const title = computed(() => { return setMainTitle() })
const collection = computed(() => { return card.value.collection ? collections.value.find(col => col.id === card.value.collection).title : '' })

function secondsToHms() {
    let d = Number(card.value.duration);
    let h = Math.floor(d / 3600);
    let m = Math.floor(d % 3600 / 60);
    let s = Math.floor(d % 3600 % 60);

    return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
}

function setMainTitle() {
    if (['podcast','video'].includes(card.value['type']))
        return card.value['title']
    else {
        if (card.value['custom_title'])
            return card.value['custom_title']
        else if (card.value['title_main'])
            return card.value['titles'][card.value['title_main']]
        else
            return card.value['titles'][0]
    }
}

function copyLink() {
    const host = window.location.host;
    navigator.clipboard.writeText(`${host}?id=${card.value['id']}`);
    setTimeout(() => {

    }, 2000)
}

function deselectCard() {
    generalStore.selectCard('')
}
</script>

<style lang="sass" scoped>
.separator
    display: flex
    align-items: center
    text-align: center
.separator::before,
.separator::after
    content: ''
    flex: 1
    border-bottom: 1px solid #ced4da
.separator:not(:empty)::before
    margin-right: .25em
.separator:not(:empty)::after
    margin-left: .25em
</style>