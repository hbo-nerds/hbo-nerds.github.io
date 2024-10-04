<template>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button
        aria-controls="collapseOne"
        aria-expanded="false"
        class="accordion-button collapsed"
        data-bs-target="#QA_playlist"
        data-bs-toggle="collapse"
        type="button"
      >
        Playlists maken
      </button>
    </h2>
    <div id="QA_playlist" class="accordion-collapse collapse" data-bs-parent="#accordionQA">
      <div class="accordion-body">
        <p>....</p>
        <!-- devices -->
        <ul class="nav nav-underline mb-3">
          <li class="nav-item">
            <button
              :class="{ active: device === 'desktop' }"
              class="nav-link"
              @click="device = 'desktop'"
            >
              Computer
            </button>
          </li>
          <li class="nav-item">
            <button
              :class="{ active: device === 'smartphone' }"
              class="nav-link"
              @click="device = 'smartphone'"
            >
              Smartphone
            </button>
          </li>
        </ul>
        <!-- content -->
        <div class="tab-content">
          <div
            v-if="device === 'desktop'"
            class="d-flex flex-column gap-3"
            role="tabpanel"
            tabindex="0"
          >
            ...
          </div>
          <div
            v-if="device === 'smartphone'"
            class="d-flex flex-column gap-3"
            role="tabpanel"
            tabindex="0"
          >
            ...
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const device = ref("desktop");
</script>

<style scoped></style>
