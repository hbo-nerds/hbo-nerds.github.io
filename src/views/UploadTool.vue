<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col col-md-8">
        <div class="card mb-5">
          <div class="card-body">
            <div>
              <h2>Data uploaden</h2>
              <p>
                Wat fijn dat je ons weer hebt gevonden! Upload hier het bestand dat je hebt
                gedownload van de oude website en druk op de knop om je data in te laden en weer op
                te slaan.
              </p>
              <div class="input-group">
                <input id="formFile" accept=".json" class="form-control" type="file" />
                <button class="btn btn-primary" type="button" @click="uploadUserData">
                  Laad mijn data
                </button>
              </div>
              <div v-if="waiting" class="spinner-border mt-3" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <div
                v-if="success"
                class="alert alert-success alert-dismissible fade show mt-3 mb-0"
                role="alert"
              >
                <i class="bi bi-hand-thumbs-up-fill me-2"></i>Data succesvol ingeladen en
                opgeslagen!
                <button
                  aria-label="Close"
                  class="btn-close"
                  data-bs-dismiss="alert"
                  type="button"
                  @click="success = false"
                ></button>
              </div>
              <div
                v-if="invalid"
                class="alert alert-danger alert-dismissible fade show mt-3 mb-0"
                role="alert"
              >
                <i class="bi bi-hand-thumbs-down-fill me-2"></i>Geen bruikbare data gevonden. Heb je
                het juiste bestand geupload?
                <button
                  aria-label="Close"
                  class="btn-close"
                  data-bs-dismiss="alert"
                  type="button"
                  @click="invalid = false"
                ></button>
              </div>
            </div>
          </div>
        </div>
        <div class="card mb-3">
          <div class="card-body">
            <div>
              <h2>Data downloaden</h2>
              <p>Download een bestand met je opgeslagen data.</p>
              <button class="btn btn-primary" @click="downloadUserData">Download mijn data</button>
            </div>
          </div>
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

function uploadUserData() {
  waiting.value = true;
  invalid.value = false;
  success.value = false;
  const files = document.getElementById("formFile").files;
  if (files.length <= 0) {
    return false;
  }

  const fr = new FileReader();

  fr.onload = (e) => {
    const result = JSON.parse(e.target.result);
    if (!result.likedItems && !result.seenItems && !result.history && !result.playlists) {
      setTimeout(() => {
        waiting.value = false;
        invalid.value = true;
      }, 750);
    } else {
      generalStore.setLocaleStorageFromFile(result);
      setTimeout(() => {
        waiting.value = false;
        success.value = true;
      }, 750);
    }
  };
  fr.readAsText(files.item(0));
}
</script>

<style scoped></style>
