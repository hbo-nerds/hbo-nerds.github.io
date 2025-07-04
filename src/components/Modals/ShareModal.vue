<template>
    <div class="modal fade" id="share-modal" tabindex="-1" aria-hidden="true">
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
                            id="modal-link"
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
import type { Card } from "@/types/Card.ts";
import { storeToRefs } from "pinia";
import { computed, type ComputedRef, ref } from "vue";
import { toast } from "vue3-toastify";

const contentStore = useContentStore();
const { shareCardId } = storeToRefs(contentStore);

const close = ref<HTMLButtonElement | null>(null);

const card: ComputedRef<Card | null> = computed(() => {
    return shareCardId.value ? contentStore.getSingleCard(shareCardId.value) : null;
});

const cardTitle = computed(() => {
    if (!card.value) return "";
    return contentStore.getCardTitle(card.value);
});

const shareUrl = computed(() => {
    if (!card.value) return "";
    return window.location.origin + `/item/${card.value.id}`;
});

/**
 * Copies the current share URL to the clipboard and displays a toast notification.
 * Optionally closes a UI element if present.
 *
 * @return {void} This method does not return a value.
 */
function copyLink() {
    navigator.clipboard.writeText(shareUrl.value);
    toast("Link gekopieerd", {
        position: toast.POSITION.BOTTOM_LEFT,
    });
    close.value?.click();
}

/**
 * Creates and triggers a "mailto" link to share a URL via email.
 * The function constructs an email link with the URL value specified in `shareUrl` and opens it in a new email composition window.
 *
 * @return {void} Does not return a value.
 */
function mailTo() {
    let a = document.createElement("a");
    a.target = "_blank";
    a.href = "mailto:?body=" + shareUrl.value;
    a.click();
}

/**
 * Opens a new tab directing the user to a Reddit submission page on the "lekkerspelen" subreddit.
 * The submission form is pre-filled with the provided `shareUrl` value for both the title and body fields.
 *
 * @return {void} This function does not return a value.
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
 * Opens a new tab or window to create a post on X (a hypothetical social media platform),
 * with pre-filled URL and text parameters based on specified input values.
 *
 * @return {void} Does not return any value.
 */
function postOnX() {
    let a = document.createElement("a");
    a.target = "_blank";
    a.href =
        "https://x.com/intent/post?" + "url=" + shareUrl.value + "&" + "text=" + cardTitle.value;
    a.click();
}

/**
 * Opens a WhatsApp chat in a new browser tab with a predefined message.
 * The message contains a URL retrieved from the `shareUrl` input element.
 * This function dynamically creates an anchor (`<a>`) element, sets its target and href,
 * and programmatically clicks it to initiate the WhatsApp chat link.
 *
 * @return {void} Does not return a value.
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
