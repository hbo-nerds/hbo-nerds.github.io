<template>
    <div class="container-fluid py-4">
        <div class="row g-3 justify-content-center">
            <!-- main -->
            <div class="col-12 col-lg-10">
                <h3>Series</h3>
                <p>Perfect voor een luie zondagmiddag binge!
                    Ontdek onze verzameling Video on Demand (VOD) afleveringen, van epische multiplayer avonturen tot
                    hilarische singleplayer escapades. Klik op een serie en laat je meevoeren door een wereld vol
                    plezier, verrassingen en onvergetelijke momenten. Het beste excuus voor een ontspannen bingesessie
                    op een luie zondagmiddag!</p>
                <div class="row g-2">
                    <series-container></series-container>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import SeriesContainer from "@/containers/SeriesContainer.vue";
</script>
