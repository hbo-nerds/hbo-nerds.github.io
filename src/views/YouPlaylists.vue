<template>
    <!-- main -->
    <main style="padding-top: 42px" class="position-relative">
        <div class="row justify-content-center">
            <div class="col col-xl-10">
                <div class="you-block">
                    <div class="you-block-title d-flex align-items-center mb-3">
                        <h2 class="fs-5 fw-bold m-0">Afspeellijsten</h2>
                        <button type="button" class="ms-auto btn btn-dark rounded-pill">Toon alles</button>
                    </div>
                    <div class="you-block-content row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-3xl-5 row-cols-4xl-6 g-3 mb-3">
                        <div class="col" v-for="playlist in playlists.slice(0, 6)">
                            <playlist-component :playlist="playlist"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import {storeToRefs} from "pinia";
import {useGeneralStore} from "@/stores/general.js";
import PlaylistComponent from "@/components/playlistComponent.vue";

const generalStore = useGeneralStore()
const {playlists} = storeToRefs(generalStore)
</script>