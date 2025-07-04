<template>
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button
                aria-controls="collapseOne"
                aria-expanded="false"
                class="accordion-button collapsed"
                data-bs-target="#QA_search"
                data-bs-toggle="collapse"
                type="button"
            >
                Geavanceerd zoeken
            </button>
        </h2>
        <div id="QA_search" class="accordion-collapse collapse" data-bs-parent="#accordionQA">
            <div class="accordion-body">
                <p>
                    Tijdens het zoeken naar content op Lekker Speuren kun je zoekopdrachten
                    verfijnen met geavanceerde filters.
                </p>
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
                        <p>
                            Klik bovenaan je scherm op het 'Filters' icoon, deze bevindt zich naast
                            de algemene zoekbalk.
                        </p>
                        <img
                            class="w-75"
                            src="@/assets/img/qa/qa_search_desktop_1.png"
                            alt="desktop_search_1"
                        />
                        <p>Je kunt nu jouw gewenste filters instellen in het popup scherm.</p>
                        <img
                            class="w-75"
                            src="@/assets/img/qa/qa_search_desktop_2.png"
                            alt="desktop_search_2"
                        />
                        <p>
                            Je kunt video's, streams en podcasts filteren op factoren zoals
                            uploaddatum, type, platform en duur. Op zoek naar specifieke content?
                            Gebruik de 'activiteit' of 'tag' filters om jouw favoriete content terug
                            te vinden.
                        </p>
                        <p>
                            Ook handig, je kunt direct zien hoeveel resultaten jouw filters hebben.
                        </p>
                    </div>
                    <div
                        v-if="device === 'smartphone'"
                        class="d-flex flex-column gap-3"
                        role="tabpanel"
                        tabindex="0"
                    >
                        <p>Om content te filters doe je het volgende:</p>
                        <ol>
                            <li>
                                Klik op het 'Zoek' icoon. Deze bevindt zich rechtsboven en
                                middenonder van het je scherm.
                            </li>
                            <li>
                                Klik nu op het 'Filter' icoon. Deze bevindt zich naast de algemene
                                zoekbalk.
                            </li>
                            <li>Je kunt nu jouw gewenste filters instellen in het popup scherm.</li>
                        </ol>
                        <div class="d-flex gap-3 flex-wrap">
                            <img
                                class="w-25"
                                src="@/assets/img/qa/qa_search_smartphone_1.png"
                                alt="smartphone_search_1"
                            />
                            <img
                                class="w-25"
                                src="@/assets/img/qa/qa_search_smartphone_2.png"
                                alt="smartphone_search_2"
                            />
                            <img
                                class="w-25"
                                src="@/assets/img/qa/qa_search_smartphone_3.png"
                                alt="smartphone_search_3"
                            />
                        </div>
                        <p>
                            Je kunt video's, streams en podcasts filteren op factoren zoals
                            uploaddatum, type, platform en duur. Op zoek naar specifieke content?
                            Gebruik de 'activiteit' of 'tag' filters om jouw favoriete content terug
                            te vinden.
                        </p>
                        <p>
                            Ook handig, je kunt direct zien hoeveel resultaten jouw filters hebben.
                        </p>
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
