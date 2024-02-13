<template>
    <div class="bg-light-subtle">
        <div class="container">
            <div class="row py-3">
                <div class="col-12">
                    <div class="input-group">
                        <input class="form-control" type="search" placeholder="Zoek een video" @input="input"
                               v-model="store.search">
                        <span class="input-group-text"><i class="bi bi-search"></i></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref} from "vue";
import {useContentStore} from "@/stores/content.js";

const store = useContentStore()
const searchTimeout = ref();

function input() {
    if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
    }

    searchTimeout.value = setTimeout(() => {
        store.filter()
    }, 250)
}
</script>

<style scoped>

</style>