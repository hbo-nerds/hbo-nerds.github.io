<template>
  <div class="modal fade" id="share-playlist-modal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-md">
      <div class="modal-content bg-body border-0">
        <div class="modal-header border-0">
          <h1 class="modal-title fs-5">Delen</h1>
          <button
            ref="close"
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="d-flex flex-wrap gap-3 mb-3">
            <div class="text-center" type="button" @click="reddit">
              <img
                class="d-block mb-1"
                width="60"
                src="@/assets/svg/social-share-reddit.svg"
                alt="deel op Reddit"
              />
              <span class="fs-7">Reddit</span>
            </div>
            <div class="text-center" type="button" @click="x">
              <img
                class="d-block mb-1"
                width="60"
                src="@/assets/svg/social-share-x.svg"
                alt="deel op X"
              />
              <span class="fs-7">X</span>
            </div>
            <div class="text-center" type="button" @click="whatsApp">
              <img
                class="d-block mb-1"
                width="60"
                src="@/assets/svg/social-share-whatsapp.svg"
                alt="deel op X"
              />
              <span class="fs-7">WhatsApp</span>
            </div>
            <div class="text-center" type="button" @click="mailTo">
              <img
                class="d-block mb-1"
                width="60"
                src="@/assets/svg/social-share-email.svg"
                alt="deel via Email"
              />
              <span class="fs-7 text-body text-decoration-none">Email</span>
            </div>
          </div>
          <div class="bg-black border rounded-4 p-2 d-flex gap-2">
            <input class="form-control border-0" type="text" readonly :value="shareUrl" />
            <button class="btn btn-primary rounded-pill" @click="copyLink">Kopieer</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGeneralStore } from "@/stores/general.js";
import { computed, ref } from "vue";
import { toast } from "vue3-toastify";

const generalStore = useGeneralStore();

const props = defineProps({
  title: { type: String, required: false },
});

const close = ref(null);

const playlist = computed(() => {
  return generalStore.getPlaylist(props.title);
});

/**
 * The url to share
 * @type {ComputedRef<string|string>}
 */
const shareUrl = computed(() => {
  if (!playlist.value) return "";

  let search_params = new URLSearchParams(playlist.value["items"].map((s) => ["items", s]));
  search_params.append("title", playlist.value["title"]);

  const host = window.location.host;
  return `${host}/shared-playlist?${search_params.toString()}`;
});

/**
 * Copy link to clipboard.
 */
function copyLink() {
  navigator.clipboard.writeText(shareUrl.value);
  toast("Link gekopieerd!", {
    position: toast.POSITION.BOTTOM_LEFT,
  });
  close.value?.click();
}

/**
 * Share via mail.
 */
function mailTo() {
  let a = document.createElement("a");
  a.target = "_blank";
  a.href = "mailto:?body=" + shareUrl.value;
  a.click();
}

/**
 * Create post on Reddit.
 */
function reddit() {
  let a = document.createElement("a");
  a.target = "_blank";
  a.href =
    "https://www.reddit.com/r/lekkerspelen/" +
    "submit?" +
    "body=" +
    shareUrl.value +
    "&" +
    "title=" +
    shareUrl.value +
    "&" +
    "type=TEXT";
  a.click();
}

/**
 * Create post on X.
 */
function x() {
  let a = document.createElement("a");
  a.target = "_blank";
  a.href = "https://x.com/intent/post?" + "url=" + shareUrl.value + "&" + "text=" + cardTitle.value;
  a.click();
}

/**
 * Create message on WhatsApp.
 */
function whatsApp() {
  let a = document.createElement("a");
  a.target = "_blank";
  a.href =
    "https://api.whatsapp.com/send/?" +
    "text=" +
    shareUrl.value +
    "&" +
    "type=custom_url&" +
    "app_absent=0";
  a.click();
}
</script>

<style scoped></style>
