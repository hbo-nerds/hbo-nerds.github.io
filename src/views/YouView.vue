<template>
    <div class="container-fluid py-4">
        <div class="row g-3 justify-content-center">
            <!-- main -->
            <div class="col-12 col-lg-10">
                <div class="accordion accordion-flush">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseOne" aria-expanded="true"
                                    aria-controls="panelsStayOpen-collapseOne">
                                <i class="bi bi-clock-history me-3"></i>Geschiedenis
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseOne" class="accordion-collapse collapse show">
                            <div class="accordion-body px-0">
                                <p v-if="!historyContent.length">Bezochte items zullen hier te vinden zijn.</p>
                                <div v-else class="row g-2">
                                    <div class="col-6 col-md-3 col-xl-2" v-for="item in historyContent">
                                        <card-component :card="item"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseTwo" aria-expanded="true"
                                    aria-controls="panelsStayOpen-collapseTwo">
                                <i class="bi bi-hand-thumbs-up me-3"></i>Liked videos<span
                                class="ms-2 small fw-normal">({{ likedContent.length }})</span>
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseTwo" class="accordion-collapse collapse show">
                            <div class="accordion-body px-0">
                                <div class="row g-2">
                                    <div class="col-6 col-md-3 col-xl-2" v-for="item in likedContent">
                                        <card-component :card="item"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button class="accordion-button" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#panelsStayOpen-collapseThree" aria-expanded="true"
                                    aria-controls="panelsStayOpen-collapseThree">
                                <i class="bi bi-list-ul me-3"></i>Afspeellijsten
                            </button>
                        </h2>
                        <div id="panelsStayOpen-collapseThree" class="accordion-collapse collapse show">
                            <div class="accordion-body px-0">
                                <p v-if="!playlists.length">Jouw gemaakte afspeellijsten zullen hier te vinden zijn.</p>
                                <div v-else class="row g-2">
                                    <div class="col-6 col-md-3 col-xl-2" v-for="playlist in playlists">
                                        <playlist-component :playlist="playlist"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {storeToRefs} from "pinia";
import {useContentStore} from "@/stores/content.js";
import {defineAsyncComponent} from "vue";
import {useGeneralStore} from "@/stores/general.js";
import PlaylistComponent from "@/components/playlistComponent.vue";

const contentStore = useContentStore()
const generalStore = useGeneralStore()
const {likedContent, historyContent} = storeToRefs(contentStore)
const {playlists} = storeToRefs(generalStore)

const CardComponent = defineAsyncComponent(() =>
    import("@/components/cardComponent.vue")
)
</script>