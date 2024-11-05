<template>
  <div class="row gx-4">
    <div class="col-3 col-md-2 col-xxl-1">
      <div
        class="d-flex align-items-center justify-content-center bg-body-tertiary rounded-circle"
        style="aspect-ratio: 1/1"
      >
        <img
          :src="'images/profile_pics/profile-' + (profile?.picture || 0) + '.avif'"
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
          title="Wijzig profiel"
        >
          <i class="bi bi-person-circle me-2"></i>Wijzig profiel
        </button>
        <button
          class="btn btn-sm btn-dark border-0 rounded-pill"
          data-bs-target="#data-modal"
          data-bs-toggle="modal"
          title="Beheer data"
        >
          <i class="bi bi-download me-2"></i>Beheer data
        </button>
      </div>
    </div>

    <teleport to="body">
      <ProfileModal />
      <DataModal />
    </teleport>
  </div>
</template>

<script setup>
import DataModal from "@/components/Modals/DataModal.vue";
import ProfileModal from "@/components/Modals/ProfileModal.vue";
import { useGeneralStore } from "@/stores/general.js";
import { storeToRefs } from "pinia";

const generalStore = useGeneralStore();
const { profile } = storeToRefs(generalStore);
</script>

<style lang="sass" scoped>
.form-floating > .form-control:focus ~ label::after,
.form-floating > .form-control:not(:placeholder-shown) ~ label::after
  background-color: transparent

.profile_pics img.active
  outline: 3px solid red
</style>
