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
        <img
          alt="app_icon"
          class="rounded-4 border"
          height="80"
          src="/web-app-manifest-512x512.png"
          width="80"
        />
        <p class="small">
          Deze website is beschikbaar als app voor je telefoon of tablet. Tik op
          <strong>Delen</strong>&nbsp;<i class="bi bi-box-arrow-up"></i>&nbsp;<i
            class="bi bi-chevron-right"
          ></i>
          <strong>Zet op beginscherm</strong>&nbsp;<i class="bi bi-plus-square"></i>
        </p>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";

const show = ref<boolean>(false);
const manuallyClosed = ref<boolean>(false);

/**
 * Check for PWA prompt on iOS devices.
 */
function showIosInstallModal() {
  // detect if the device is on iOS
  const isIos = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent);
  };

  // check if the device is in standalone mode
  const isInStandaloneMode = () => {
    return "standalone" in (window as any).navigator && (window as any).navigator.standalone;
  };

  show.value = isIos() && !isInStandaloneMode();
}

onMounted(showIosInstallModal);
</script>

<style lang="sass" scoped>
.v-enter-active,
.v-leave-active
  transition: transform 0.5s ease

.v-enter-from,
.v-leave-to
  transform: translateX(100%)
</style>
