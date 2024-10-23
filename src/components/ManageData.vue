<template>
  <div class="col-md">
    <div class="card bg-body">
      <div class="card-body p-3">
        <h5>Download jouw opgeslagen data.</h5>
        <button class="btn btn-dark border-0 rounded-pill" @click="downloadUserData">
          Download
        </button>
      </div>
    </div>
  </div>
  <div class="col-md">
    <div class="card bg-body">
      <div class="card-body p-3">
        <h5>Upload vanaf backup.</h5>
        <span v-if="success" class="d-flex gap-2 mb-3">
          <span class="badge rounded-pill text-bg-success">Yeah!</span>
          <span class="fw-lighter small">Data succesvol ingeladen en opgeslagen.</span>
        </span>
        <span v-if="invalid" class="d-flex gap-2 mb-3">
          <span class="badge rounded-pill text-bg-danger">Ooh!</span>
          <span class="fw-lighter small">Geen bruikbare data gevonden.</span>
        </span>
        <div v-if="files" class="fw-lighter mb-3">{{ files[0].name }}</div>
        <button v-if="!files" class="btn btn-light border-0 rounded-pill" @click="selectFile">
          Selecteer bestand
        </button>
        <template v-else>
          <button class="btn btn-light border-0 rounded-pill me-2" @click="uploadUserData">
            Upload bestand
            <template v-if="waiting">
              <span aria-hidden="true" class="spinner-border spinner-border-sm"></span>
              <span class="visually-hidden" role="status">Loading...</span>
            </template>
          </button>
          <button class="btn btn-dark border-0 rounded-pill" @click="cancelUpload">Annuleer</button>
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
    </div>
  </div>
  <div class="col-md">
    <div class="card bg-body">
      <div class="card-body p-3">
        <h5>Verwijder alle opgeslagen data.</h5>
        <button class="btn btn-danger rounded-pill" @click="clearStorage">Verwijder</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { toast } from "vue3-toastify";

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

function clearStorage() {
  if (window.confirm("Weet je het zeker?")) {
    localStorage.clear();
    toast("Alle data verwijderd");
    generalStore.getLocaleStorage();
  }
}
</script>

<style scoped></style>
