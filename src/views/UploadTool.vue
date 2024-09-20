<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col col-md-8">
        <div class="border-bottom pb-3">
          <h1 class="fs-6 fw-bold mb-5">Opgeslagen data</h1>
          <div class="fs-2 mb-3">Beheer jouw opgeslagen data op Lekker Speuren</div>
        </div>
        <!-- download -->
        <div class="pt-4 mb-4">
          <h6 class="fw-semibold mb-3">Download een kopie van jouw opgeslagen data.</h6>
          <button class="btn btn-dark rounded-pill" @click="downloadUserData">Download</button>
        </div>
        <!-- upload -->
        <div class="pt-4 mb-4">
          <h6 class="fw-semibold mb-3">Upload een opgeslagen backup.</h6>
          <span class="d-flex gap-2 mb-3" v-if="success">
            <span class="badge rounded-pill text-bg-success">Yeah!</span>
            <span class="fw-lighter small">Data succesvol ingeladen en opgeslagen.</span>
          </span>
          <span class="d-flex gap-2 mb-3" v-if="invalid">
            <span class="badge rounded-pill text-bg-danger">Ooh!</span>
            <span class="fw-lighter small">Geen bruikbare data gevonden.</span>
          </span>
          <div v-if="files" class="fw-lighter mb-3">{{ files[0].name }}</div>
          <button v-if="!files" class="btn btn-light rounded-pill" @click="selectFile">
            Selecteer bestand
          </button>
          <template v-else>
            <button class="btn btn-light rounded-pill me-2" @click="uploadUserData">
              Upload bestand
              <template v-if="waiting">
                <span aria-hidden="true" class="spinner-border spinner-border-sm"></span>
                <span class="visually-hidden" role="status">Loading...</span>
              </template>
            </button>
            <button class="btn btn-dark rounded-pill" @click="cancelUpload">Annuleer</button>
          </template>
          <input
            id="formFile"
            ref="fileInput"
            accept=".json"
            class="d-none"
            type="file"
            @change="handleFileChange"
          />
        </div>
        <!-- delete -->
        <div class="pt-4 mb-4">
          <h6 class="fw-semibold mb-3">Verwijder alle opgeslagen data.</h6>
          <button class="btn btn-danger rounded-pill" @click="clearStorage">Verwijder</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { ref } from "vue";

const generalStore = useGeneralStore();

const { likedItems, seenItems, history, playlists } = storeToRefs(generalStore);
const success = ref(false);
const waiting = ref(false);
const invalid = ref(false);
const fileInput = ref(null);
const files = ref();

/**
 * Start searching for file.
 */
function selectFile() {
  if (fileInput.value) fileInput.value.click();
}

/**
 * Set file.
 */
function handleFileChange() {
  files.value = fileInput.value?.files;
}

/**
 * Cancel file upload.
 */
function cancelUpload() {
  fileInput.value.value = null;
  files.value = false;
}

/**
 * Create JSON file from localeStorage data.
 */
function downloadUserData() {
  const userData = {
    likedItems: likedItems.value,
    seenItems: seenItems.value,
    history: history.value,
    playlists: playlists.value,
  };

  const a = document.createElement("a");
  const file = new Blob([JSON.stringify(userData, null, 2)], { type: "text/plain" });
  a.href = URL.createObjectURL(file);
  a.download = "mijn-lekker-speuren-data.json";
  a.click();
}

/**
 * Read uploaded file, validate and (if valid) save the data.
 * @returns {boolean}
 */
function uploadUserData() {
  waiting.value = true;
  invalid.value = false;
  success.value = false;
  const files = document.getElementById("formFile").files;
  if (files.length <= 0) {
    waiting.value = false;
    return false;
  }

  const fr = new FileReader();

  fr.onload = (e) => {
    const result = JSON.parse(e.target.result);
    if (!result.likedItems && !result.seenItems && !result.history && !result.playlists) {
      setTimeout(() => {
        waiting.value = false;
        invalid.value = true;
        cancelUpload();
      }, 750);
    } else {
      generalStore.setLocaleStorageFromFile(result);
      setTimeout(() => {
        waiting.value = false;
        success.value = true;
        cancelUpload();
      }, 750);
    }
  };
  fr.readAsText(files.item(0));
}
</script>

<style scoped></style>
