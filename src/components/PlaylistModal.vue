<template>
    <div class="modal fade" :id="'playlistModal-' + id" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered mx-auto">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-6 me-2">Bewaar video in...</h1>
                    <button ref="close" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div v-for="(i, idx) in playlists" class="py-2" :key="idx">
                        <div class="form-check">
                            <input @change="toggle($event, i.title)" name="playlist" class="form-check-input" type="checkbox"
                                   :id="'box-' + idx" :checked="getValue(i.items)" :value="'list'+idx">
                            <label class="form-check-label" :for="'box-' + idx">
                                {{i.title}}
                            </label>
                        </div>
                    </div>
                    <div @click="create = true" class="mt-3" type="button" v-if="!create">
                        <i class="bi bi-plus-lg me-2"></i>Maak nieuwe afspeellijst
                    </div>
                    <div v-else class="mt-3">
                        <form @submit.prevent="createList">
                            <div class="mb-3">
                                <label for="newListName" class="form-label small">Naam</label>
                                <input v-model="listName" type="text" class="form-control" id="newListName"
                                       placeholder="Lijst titel" required>
                            </div>
                            <button type="submit" class="btn btn-sm btn-outline-primary rounded-pill float-end">Maak
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {storeToRefs} from "pinia";
import {useGeneralStore} from "@/stores/general.js";
import {ref} from "vue";

const generalStore = useGeneralStore()
const {playlists} = storeToRefs(generalStore)

const props = defineProps({
    id: {type: String, required: true}
})

const close = ref(null)
const create = ref(false)
const listName = ref('')

function createList() {
    close.value.click() //hide modal
    generalStore.createPlaylist(listName.value) //create new list
    generalStore.togglePlaylistItem(listName.value, props.id) //add item to new list
    listName.value = '';
}

function toggle(event, title) {
    generalStore.togglePlaylistItem(title, props.id)
}

function getValue(items) {
    return items.includes(props.id)
}

</script>

<style scoped></style>