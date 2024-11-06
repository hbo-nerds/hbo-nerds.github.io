<template>
  <Transition>
    <div
      v-if="(needRefresh || forceRefresh) && !closed"
      style="z-index: 4"
      class="position-fixed rounded-3 bg-body bottom-0 end-0 p-3 m-3"
    >
      <p>Nieuwe content beschikbaar, klik 'reload' om te updaten!</p>
      <div class="d-flex gap-2">
        <button
          class="btn btn-sm btn-dark"
          title="Reload"
          type="button"
          @click="updateServiceWorker()"
        >
          Reload
        </button>
        <button class="btn btn-sm btn-dark" title="Sluit" type="button" @click="closed = true">
          Sluit
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useRegisterSW } from "virtual:pwa-register/vue";
import { ref } from "vue";

const closed = ref(false);
const forceRefresh = ref(false);

const { needRefresh, updateServiceWorker } = useRegisterSW();

/**
 * Check is app is visible.
 */
document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState === "visible") {
    await checkForServiceWorkerUpdate();
  }
});

/**
 * Check for new service worker when app opens.
 * @returns {Promise<void>}
 */
async function checkForServiceWorkerUpdate() {
  closed.value = false;
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    const registration = await navigator.serviceWorker.getRegistration();

    if (registration) {
      // Trigger an update check on the service worker
      registration
        .update()
        .then(() => {
          if (registration.waiting) {
            // A new service worker is waiting to activate
            forceRefresh.value = true;
          }
        })
        .catch((error) => {
          console.error("Service Worker update check failed:", error);
        });
    }
  }
}
</script>

<style lang="sass" scoped>
.v-enter-active,
.v-leave-active
  transition: transform 0.5s ease

.v-enter-from,
.v-leave-to
  transform: translateX(100%)
</style>
