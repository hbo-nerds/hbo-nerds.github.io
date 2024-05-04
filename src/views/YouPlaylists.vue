<template>
    <div class="container-fluid py-4">
        <div class="row g-3 justify-content-center">
            <!-- main -->
            <div class="col-12 col-lg-10">
                <div class="row gx-2 gy-3">
                    <div class="col-12">{{ playlists.length}} resultaten</div>
                    <div class="col-6 col-md-4 col-lg-3" v-for="(item, idx) in playlists" :key="idx">
                        <playlist-component :playlist="item"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {storeToRefs} from "pinia";
import {useGeneralStore} from "@/stores/general.js";
import PlaylistComponent from "@/components/playlistComponent.vue";
import CardComponent from "@/components/cardComponent.vue";

const generalStore = useGeneralStore()
const {playlists} = storeToRefs(generalStore)
</script>