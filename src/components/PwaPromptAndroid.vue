<template>
  <Transition>
    <div
      v-if="show && !manuallyClosed"
      class="position-fixed rounded-3 bg-body bottom-0 end-0 p-3 m-3"
      style="z-index: 4; max-width: 420px"
    >
      <div class="d-flex align-items-center justify-content-between mb-2">
        <span class="badge rounded-pill text-bg-warning">Tip!</span>
        <button
          @click="manuallyClosed = true"
          aria-label="Close"
          class="btn-close"
          type="button"
        ></button>
      </div>
      <div class="d-flex gap-2">
        <p class="small">
          Deze website is beschikbaar als app voor je telefoon of tablet. Tik op onderstaand knop om
          de app te installeren.
        </p>
      </div>
      <button class="btn btn-dark me-2" @click="installApp">Installeer App</button>
      <button class="btn btn-dark" @click="dontShowAnymore">Niet meer tonen</button>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const show = ref<boolean>(false);
const manuallyClosed = ref<boolean>(false);
const deferredPrompt = ref<any>(null);

// Check if the user opted out
if (!localStorage.getItem("pwaDismissed")) {
  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevents the default mini-infobar or install dialog from appearing on mobile
    e.preventDefault();
    deferredPrompt.value = e;

    // Only show the prompt if not manually dismissed
    if (!localStorage.getItem("pwaDismissed")) {
      show.value = true;
    }
  });
}

/**
 * Open installation prompt.
 */
async function installApp() {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt();
    const { outcome } = await deferredPrompt.value.userChoice;
    deferredPrompt.value = null;
    console.log(outcome);
  }
}

function dontShowAnymore() {
  localStorage.setItem("pwaDismissed", "true");
  manuallyClosed.value = true;
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
