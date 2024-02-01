<template>
    <main>
        <div class="container py-5">
            <div class="row mb-5">
                <div class="col-12 col-md-6 m-auto">
                    <input class="form-control" type="text" placeholder="Zoek een video" v-model="searchTerm"
                           @input="searchListener">
                </div>
            </div>
            <div class="row g-3">
                <div class="col-6 col-lg-3" v-for="(card, idx) in filteredData" :key="idx">
                    <card-component :card="card" :images="images"/>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import {filename} from 'pathe/utils'
import podcasts from '../assets/podcasts.json'
import streams from '../assets/streams.json'
import videos from '../assets/videos.json'
import CardComponent from "@/components/cardComponent.vue";
import {computed, ref} from "vue";

const glob = import.meta.glob('@/assets/img/thumbnails/*/*.webp', {eager: true})
const images = Object.fromEntries(
    Object.entries(glob).map(([key, value]) => [filename(key), value.default])
)

const searchTerm = ref()
const data = ref({podcasts: [], videos: [], streams: []})
const searchTimeout = ref();
const filteredData = ref([])

fetchData()

function fetchData() {
    for (const podcast of podcasts) {
        podcast.type = 'podcast';
        data.value.podcasts.push(podcast)
    }
    for (const video of videos) {
        video.type = 'video';
        data.value.videos.push(video)
    }
    for (const stream of streams) {
        stream.type = 'stream';
        data.value.streams.push(stream)
    }
}

function normalizedInput(input) {
    return input == null ? '' : input.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
}

const posWords = computed(() => {
    return searchTerm.value ? searchTerm.value.split(' ').filter((w) => !w.startsWith('-') && w.length).map(w => w.toLowerCase()) : [];
})

const negWords = computed(() => {
    return searchTerm.value ? searchTerm.value.split(' ').filter(w => w.startsWith('-') && length).map(w => w.slice(1).toLowerCase()) : [];
})

function searchListener() {
    if (searchTerm.value.length < 3) return;

    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
    }

    searchTimeout.value = setTimeout(() => {
        search()
    }, 250)
}

function search() {
    filteredData.value = [];

    negWords.value.forEach((pw) => {
        filterPodcasts(pw, true)
        filterVideos(pw, true)
        filterStreams(pw, true)
    })
    posWords.value.forEach((pw) => {
        filterPodcasts(pw, false)
        filterVideos(pw, false)
        filterStreams(pw, false)
    })

    for (const podcast of data.value.podcasts) {
        filteredData.value.push(podcast)
    }
    for (const video of data.value.videos) {
        filteredData.value.push(video)
    }
    for (const stream of data.value.streams) {
        filteredData.value.push(stream)
    }
}

/**
 * Filter for podcasts
 * @param word
 * @param negative
 */
function filterPodcasts(word, negative) {
    negative = !!negative;
    data.value.podcasts = data.value.podcasts.filter((podcast) => {
        return (normalizedInput(podcast['title']).includes(word) || normalizedInput(podcast['description']).includes(word)) !== negative
    })
}

/**
 * Filter for videos
 * @param word
 * @param negative
 */
function filterVideos(word, negative) {
    negative = !!negative;
    data.value.videos = data.value.videos.filter((video) => {
        return (normalizedInput(video['title']).includes(word) || normalizedInput(video['description']).includes(word) ||
            (Array.isArray(video['game']) ? video['game'].some(game => {
                return normalizedInput(game).includes(word)
            }) : normalizedInput(video['game']).includes(word))) !== negative;
    });
}

/**
 * Filter for streams
 * @param word
 * @param negative
 */
function filterStreams(word, negative) {
    negative = !!negative;
    data.value.streams = data.value.streams.filter(stream => {
        return (normalizedInput(stream['description']).includes(word) || stream['all_titles'].some(title => {
                return normalizedInput(title).includes(word)
            }) ||
            stream['games'].some(game => {
                return normalizedInput(game.title).includes(word)
            }) ||
            stream['tags'].some(tag => {
                return normalizedInput(tag).includes(word)
            })) !== negative;
    });
}


function oldsearch() {
    if (searchValue.value < 3) return;

    const filtered = []

    // Copy the data object
    const filteredData = {
        podcasts: data.value.podcasts.slice(),
        videos: data.value.videos.slice(),
        streams: data.value.streams.slice(),
    }

    const normalizedInput = NormalizeString(searchValue.value)

    const words = [];

    // Collect all the words. Words between quotes are treated as one word.
    let word = '';
    let quote = false;
    let negativeWords = [];
    for (const char of normalizedInput) {
        if (char == ' ') {
            if (quote) {
                word += char;
            } else if (word.length > 0) {
                if (word.startsWith('-')) {
                    negativeWords.push(word.substring(1));
                } else {
                    words.push(word);
                }
                word = '';
            }
        } else if (char == '"') {
            quote = !quote;
            if (!quote) {
                if (word.startsWith('-')) {
                    negativeWords.push(word.substring(1));
                } else {
                    words.push(word);
                }
                word = '';
            }
        } else {
            word += char;
        }
    }

    if (word.startsWith('-')) {
        negativeWords.push(word.substring(1));
    } else {
        words.push(word);
    }

    for (const negativeWord of negativeWords) {
        ApplyFilter(filteredData, negativeWord, true)
    }

    for (const word of words) {
        ApplyFilter(filteredData, word)
    }

    for (const podcast of filteredData.podcasts) {
        filtered.push(podcast)
    }

    for (const video of filteredData.videos) {
        filtered.push(video)
    }

    for (const stream of filteredData.streams) {
        filtered.push(stream)
    }
}

function NormalizeString(s) {
    return s == null ? '' : s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
}

function ApplyFilter(data, target, negative) {
    // Podcasts
    negative = !!negative;

    data.podcasts = data.podcasts.filter(podcast => {
        return (NormalizeString(podcast.title).includes(target) ||
            NormalizeString(podcast.description).includes(target)) !== negative;
    });

    // Videos
    data.videos = data.videos.filter(video => {
        return (NormalizeString(video.title).includes(target) ||
            NormalizeString(video.description).includes(target) ||
            (Array.isArray(video.game) ? video.game.some(game => {
                return NormalizeString(game).includes(target)
            }) : NormalizeString(video.game).includes(target))) !== negative;
    });

    // Streams
    data.streams = data.streams.filter(stream => {
        return (NormalizeString(stream.description).includes(target) ||
            stream.all_titles.some(title => {
                return NormalizeString(title).includes(target)
            }) ||
            stream.games.some(game => {
                return NormalizeString(game.title).includes(target)
            }) ||
            stream.tags.some(tag => {
                return NormalizeString(tag).includes(target)
            })) !== negative;
    });
}
</script>
