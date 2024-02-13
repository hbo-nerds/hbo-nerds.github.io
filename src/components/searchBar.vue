<template>
    <div class="bg-light-subtle">
        <div class="container">
            <div class="row py-3">
                <div class="col-12">
                    <div class="input-group">
                        <input class="form-control" type="search" placeholder="Zoek een video" v-debounce:300="input">
                        <span class="input-group-text"><i class="bi bi-search"></i></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {useContentStore} from "@/stores/content.js";

const store = useContentStore()

function input(search) {
    store.search = search
    store.filter()
}
</script>

<style scoped>

</style>