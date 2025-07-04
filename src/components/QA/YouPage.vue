<template>
    <div class="accordion-item">
        <h2 class="accordion-header">
            <button
                aria-controls="collapseOne"
                aria-expanded="false"
                class="accordion-button collapsed"
                data-bs-target="#QA_you"
                data-bs-toggle="collapse"
                type="button"
            >
                De Jij pagina
            </button>
        </h2>
        <div id="QA_you" class="accordion-collapse collapse" data-bs-parent="#accordionQA">
            <div class="accordion-body">
                <p>
                    Ga naar het tabblad Jij om alles te zien wat je op Lekker Speuren hebt bekeken,
                    opgeslagen of geliket. Op deze pagina kun je ook jouw opgeslagen data beheren.
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
                            Klik links op je scherm op het 'Jij' icoon, deze bevindt zich in de
                            menubalk.
                        </p>
                        <img
                            alt="desktop_you_1"
                            class="w-75"
                            src="@/assets/img/qa/qa_you_desktop_1.png"
                        />
                        <p>Op de 'Jij' pagina vindt je de volgende informatie:</p>
                        <ol>
                            <li>
                                Geschiedenis: Dit zijn de door jouw laatst geopende items. Klik op
                                'Alle geschiedenis' voor meer.
                            </li>
                            <li>
                                Afspeellijsten: Dit zijn jouw persoonlijke afspeellijsten. Klik op
                                een afspeellijst om een overzicht te krijgen van alle items in de
                                lijst. Klik op 'Alle afspeellijsten' voor meer.
                            </li>
                            <li>
                                Gelikete items: Dit zijn jouw gelikete items. Klik op 'Alle
                                gelikete' voor meer.
                            </li>
                            <li>
                                Beheer je data: Download, upload of verwijder al jouw opgeslagen
                                data.
                            </li>
                        </ol>
                        <img
                            alt="desktop_you_2"
                            class="w-75"
                            src="@/assets/img/qa/qa_you_desktop_2.png"
                        />
                    </div>
                    <div
                        v-if="device === 'smartphone'"
                        class="d-flex flex-column gap-3"
                        role="tabpanel"
                        tabindex="0"
                    >
                        <p>
                            Klik op het 'Jij' icoon. Deze bevindt zich rechtsonder van het je
                            scherm.
                        </p>
                        <img
                            alt="smartphone_you_1"
                            class="w-25"
                            src="@/assets/img/qa/qa_you_smartphone_1.png"
                        />
                        <p>Op de 'Jij' pagina vindt je de volgende informatie:</p>
                        <ol>
                            <li>
                                Geschiedenis: Dit zijn de door jouw laatst geopende items. Klik op
                                'Alle geschiedenis' voor meer.
                            </li>
                            <li>
                                Afspeellijsten: Dit zijn jouw persoonlijke afspeellijsten. Klik op
                                een afspeellijst om een overzicht te krijgen van alle items in de
                                lijst. Klik op 'Alle afspeellijsten' voor meer.
                            </li>
                            <li>
                                Gelikete items: Dit zijn jouw gelikete items. Klik op 'Alle
                                gelikete' voor meer.
                            </li>
                            <li>
                                Beheer je data: Download, upload of verwijder al jouw opgeslagen
                                data.
                            </li>
                        </ol>
                        <img
                            alt="smartphone_you_2"
                            class="w-25"
                            src="@/assets/img/qa/qa_you_smartphone_2.png"
                        />
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
