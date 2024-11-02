<template>
  <div class="row gx-4">
    <div class="col-3 col-md-2 col-xxl-1">
      <div
        class="d-flex align-items-center justify-content-center bg-body-tertiary rounded-circle"
        style="aspect-ratio: 1/1"
      >
        <img
          :src="'images/profile_pics/profile-' + (profile?.picture || 0) + '.png'"
          alt="profile_picture"
          class="w-75 rounded-circle"
        />
      </div>
    </div>
    <div class="col">
      <h1 class="fw-bolder">{{ profile?.username || "Onbekend" }}</h1>
      <div class="d-flex gap-2">
        <button
          class="btn btn-sm btn-dark border-0 rounded-pill"
          data-bs-target="#profile-modal"
          data-bs-toggle="modal"
        >
          <i class="bi bi-person-circle me-2"></i>{{ profile ? "Beheer" : "Maak" }} profiel
        </button>
        <button class="btn btn-sm btn-dark border-0 rounded-pill" @click="downloadUserData">
          <i class="bi bi-download me-2"></i>Download data
        </button>
      </div>
    </div>

    <teleport to="body">
      <div id="profile-modal" aria-hidden="true" class="modal fade" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered modal-md">
          <div class="modal-content bg-body border-0">
            <div class="modal-header border-0">
              <h1 class="modal-title fs-5">Profiel</h1>
              <button
                ref="close"
                aria-label="Close"
                class="btn-close"
                data-bs-dismiss="modal"
                type="button"
              ></button>
            </div>
            <div class="modal-body">
              <div class="profile_pics d-flex flex-wrap gap-3 mb-4">
                <div
                  v-for="i in 8"
                  class="text-center"
                  type="button"
                  @click="profileCopy.picture = i"
                >
                  <img
                    :alt="'profile_pic_' + i"
                    :class="{ active: i === profileCopy?.picture }"
                    :src="'images/profile_pics/profile-' + i + '.png'"
                    class="d-block rounded-circle"
                    width="60"
                  />
                </div>
                <div class="text-center" type="button" @click="profileCopy.picture = 0">
                  <img
                    :alt="'profile_pic_0'"
                    :class="{ active: 0 === profileCopy?.picture }"
                    :src="'images/profile_pics/profile-0.png'"
                    class="d-block rounded-circle"
                    width="60"
                  />
                </div>
              </div>
              <div class="form-floating mb-3">
                <input
                  id="profileName"
                  v-model="profileCopy.username"
                  class="form-control rounded-4 bg-transparent"
                  placeholder=""
                  required
                  type="text"
                />
                <label class="bg-transparent" for="profileName">Gebruikersnaam</label>
              </div>
              <div class="d-flex gap-2 w-100">
                <button
                  :disabled="!profileCopy.username"
                  class="btn btn-dark rounded-pill w-100"
                  type="button"
                  @click="storeProfile"
                >
                  Opslaan
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const generalStore = useGeneralStore();
const { likedItems, seenItems, history, playlists, profile } = storeToRefs(generalStore);
const close = ref(null);
const profileCopy = ref({
  username: "",
  picture: 0,
});

function storeProfile() {
  generalStore.storeProfile({ ...profileCopy.value });
  close.value.click();
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
