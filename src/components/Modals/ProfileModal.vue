<template>
  <div id="profile-modal" aria-hidden="true" class="modal fade" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content bg-body border-0">
        <div class="modal-header border-0">
          <h1 class="modal-title fs-5">Wijzig profiel</h1>
          <button
            ref="close"
            aria-label="Close"
            class="btn-close"
            data-bs-dismiss="modal"
            type="button"
          ></button>
        </div>
        <div class="modal-body">
          <div>
            <div class="profile_pics d-flex flex-wrap gap-3 mb-4">
              <button
                v-for="i in 9"
                class="btn btn-dark rounded-circle"
                style="width: 60px; height: 60px"
                type="button"
                :class="{ active: i === profileCopy?.picture }"
                @click="profileCopy.picture = i"
              >
                <img
                  :alt="'profile_pic_' + i"
                  :src="'images/profile_pics/profile-' + i + '.avif'"
                  class="w-100"
                />
              </button>
              <button
                class="btn btn-dark rounded-circle"
                style="width: 60px; height: 60px"
                type="button"
                :class="{ active: 0 === profileCopy?.picture }"
                @click="profileCopy.picture = 0"
              >
                <img
                  :alt="'profile_pic_0'"
                  :src="'images/profile_pics/profile-0.avif'"
                  class="w-100"
                />
              </button>
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
</template>

<script setup>
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

const generalStore = useGeneralStore();
const { profile } = storeToRefs(generalStore);

const close = ref(null);
const profileCopy = ref({
  username: "",
  picture: 0,
});

/**
 * Save profile
 */
function storeProfile() {
  generalStore.storeProfile({ ...profileCopy.value });
  close.value.click();
}

onMounted(() => {
  if (profile) profileCopy.value = { ...profile.value };
});
</script>

<style scoped lang="sass">
.form-floating > .form-control:focus ~ label::after,
.form-floating > .form-control:not(:placeholder-shown) ~ label::after
  background-color: transparent

.profile_pics img.active
  outline: 3px solid red
</style>
