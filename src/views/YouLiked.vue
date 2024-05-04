<template>
    <div class="container-fluid py-4">
        <div class="row g-3 justify-content-center">
            <!-- main -->
            <div class="col-12 col-lg-10">
                <div class="row gx-2 gy-3">
                    <div class="col-12">{{ likedContent.length}} resultaten</div>
                    <div class="col-6 col-md-4 col-lg-3" v-for="(item, idx) in likedContent" :key="idx">
                        <card-component :card="item"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {storeToRefs} from "pinia";
import CardComponent from "@/components/cardComponent.vue";
import {useContentStore} from "@/stores/content.js";

const contentStore = useContentStore()
const {likedContent} = storeToRefs(contentStore)
</script>