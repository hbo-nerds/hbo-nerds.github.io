<template>
    <div id="data-modal" aria-hidden="true" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-md">
            <div class="modal-content bg-body border-0">
                <div class="modal-header border-0">
                    <h1 class="modal-title fs-5">Download of verwijder jouw data</h1>
                    <button
                        ref="close"
                        aria-label="Close"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        type="button"
                    ></button>
                </div>
                <div class="modal-body">
                    <div
                        class="btn btn-dark d-flex align-items-center gap-3 py-3 px-3"
                        @click="generalStore.exportProfile()"
                    >
                        <i class="fs-5 bi bi-cloud-download"></i>
                        <div class="text-start">
                            <h4 class="fs-6">Download jouw data</h4>
                            <div class="small fw-lighter">
                                Maak een kopie van jouw data als back-up
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div
                        class="btn btn-dark d-flex align-items-center gap-3 py-3 px-3"
                        @click="clearStorage"
                    >
                        <i class="fs-5 bi bi-trash"></i>
                        <div class="text-start">
                            <h4 class="fs-6">Verwijder jouw profiel</h4>
                            <div class="small fw-lighter">Verwijder jouw profiel en alle data</div>
                        </div>
                    </div>
                    <hr />
                    <div
                        class="btn btn-dark d-flex align-items-center gap-3 py-3 px-3"
                        @click="selectFile"
                    >
                        <i class="fs-5 bi bi-file-earmark-arrow-up"></i>
                        <div class="text-start">
                            <h4 class="fs-6">Importeer data</h4>
                            <div class="small fw-lighter">Upload een back-up van je profiel</div>
                        </div>
                    </div>

                    <input
                        id="formFile"
                        ref="fileInput"
                        accept=".json"
                        class="d-none"
                        type="file"
                        @change="pickFile"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useGeneralStore } from "@/stores/general.ts";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { toast } from "vue3-toastify";

const generalStore = useGeneralStore();
const { profile } = storeToRefs(generalStore);

const close = ref(null);
const profileCopy = ref({
    username: "",
    picture: 0,
});

const fileInput = ref(null);
const files = ref();

/**
 * Delete profile
 */
function clearStorage() {
    if (window.confirm("Weet je het zeker?")) {
        localStorage.clear();
        toast("Alle data verwijderd");
        generalStore.getLocaleStorage();
    }
}

/**
 * Start searching for file.
 */
function selectFile() {
    fileInput.value?.click();
}

/**
 * Set file.
 */
function pickFile() {
    files.value = fileInput.value?.files;
    uploadUserData();
}

/**
 * Read uploaded file, validate and (if valid) save the data.
 */
function uploadUserData() {
    const files = document.getElementById("formFile").files;
    if (files.length <= 0) return;

    const fr = new FileReader();

    fr.onload = (e) => {
        let content;
        try {
            content = JSON.parse(e.target.result);
        } catch (e) {
            console.error(e);
        }

        if (!isValid(content)) {
            setTimeout(() => {
                cancelUpload();
            }, 750);
        } else {
            generalStore.setLocaleStorageFromFile(content);
            setTimeout(() => {
                cancelUpload();
            }, 750);
        }
    };
    fr.readAsText(files.item(0));
}

/**
 * Cancel file upload.
 */
function cancelUpload() {
    fileInput.value.value = null;
    files.value = false;
}

/**
 * Check if JSON contains useful data.
 * @param content
 * @returns {[]|*|null|false}
 */
function isValid(content) {
    return (
        content.likedItems ||
        content.seenItems ||
        content.history ||
        content.playlists ||
        content.profile
    );
}

onMounted(() => {
    if (profile) profileCopy.value = { ...profile.value };
});
</script>

<style lang="sass" scoped>
.form-floating > .form-control:focus ~ label::after,
.form-floating > .form-control:not(:placeholder-shown) ~ label::after
  background-color: transparent

.profile_pics img.active
  outline: 3px solid red
</style>
