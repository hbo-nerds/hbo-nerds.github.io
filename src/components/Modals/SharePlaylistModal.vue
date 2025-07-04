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
                        <div class="text-center" type="button" @click="postOnX">
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
                        <input
                            id="playlist-link"
                            class="form-control border-0"
                            type="text"
                            readonly
                            :value="shareUrl"
                        />
                        <button class="btn btn-primary rounded-pill" @click="copyLink">
                            Kopieer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useContentStore } from "@/stores/content.ts";
import { useGeneralStore } from "@/stores/general.ts";
import { storeToRefs } from "pinia";
import { computed, type ComputedRef, ref } from "vue";
import { toast } from "vue3-toastify";

const generalStore = useGeneralStore();
const contentStore = useContentStore();
const { sharePlaylistTitle } = storeToRefs(contentStore);

const close = ref<HTMLButtonElement | null>(null);

const playlist = computed(() => {
    return sharePlaylistTitle.value ? generalStore.getPlaylist(sharePlaylistTitle.value) : null;
});

/**
 * The url to share
 * @type {ComputedRef<string|string>}
 */
const shareUrl: ComputedRef<string> = computed(() => {
    if (!playlist.value) return "";

    let search_params = new URLSearchParams();
    const combinedIds = playlist.value["items"].join("");
    search_params.append("items", combinedIds);
    search_params.append("title", playlist.value["title"]);
    if (playlist.value["description"])
        search_params.append("description", playlist.value["description"]);

    const host = window.location.origin;
    return `${host}/shared-playlist?${search_params.toString()}`;
});

/**
 * Copies the value of the `shareUrl` input field to the clipboard, displays
 * a toast notification indicating the link was copied, and triggers a click
 * action on the `close` element if it exists.
 *
 * @return {void} Does not return any value.
 */
function copyLink() {
    navigator.clipboard.writeText(shareUrl.value);
    toast("Link gekopieerd", {
        position: toast.POSITION.BOTTOM_LEFT,
    });
    close.value?.click();
}

/**
 * Opens the user's default email client with a prepopulated body field containing the current share URL.
 * Creates and uses an anchor element with a mailto URL to trigger the action.
 *
 * @return {void} This method does not return any value.
 */
function mailTo() {
    let a = document.createElement("a");
    a.target = "_blank";
    a.href = "mailto:?body=" + shareUrl.value;
    a.click();
}

/**
 * Opens a new browser tab and navigates to the Reddit submission page
 * for the specified subreddit with a prefilled title and body text.
 *
 * @return {void} This method does not return a value.
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
 * Opens a new window or tab to share a URL via a predefined platform (e.g., "X").
 * Constructs a share link using the current value of `shareUrl`, and triggers a click event to open the sharing URL.
 *
 * @return {void} This function does not return a value.
 */
function postOnX() {
    let a = document.createElement("a");
    a.target = "_blank";
    a.href = "https://x.com/intent/post?" + "url=" + shareUrl.value;
    a.click();
}

/**
 * Opens a new WhatsApp message window with a pre-filled text containing the specified share URL.
 *
 * This function dynamically creates an anchor element, sets it to open in a new tab,
 * appends the given URL text to the WhatsApp web messaging link, and triggers the click event on the anchor.
 *
 * @return {void} Does not return any value.
 */
function whatsApp() {
    let a = document.createElement("a");
    a.target = "_blank";
    a.href = "https://wa.me/?text=" + shareUrl.value;
    a.click();
}
</script>

<style scoped></style>
