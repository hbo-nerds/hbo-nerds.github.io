<template>
    <nav class="bg-body py-2">
        <div class="container-fluid">
            <div class="row g-0 g-sm-3">
                <div class="col-3" v-if="!mobileSearch">
                    <div class="d-flex align-items-center">
                        <div type="button" class="d-flex align-items-center justify-content-center p-2" style="width: 40px;height: 40px"
                             data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                            <i class="bi bi-list fs-3"></i>
                        </div>
                        <router-link to="/" class="ps-3 text-decoration-none d-flex align-items-center">
                            <img src="../assets/img/lekkerSicko.png" alt="Logo" width="30px" height="26" class="me-1">
                            <span class="fs-7 text-body" style="line-height: 100%">Lekker<br>Speuren</span>
                        </router-link>
                    </div>
                </div>
                <div class="col-auto" v-if="mobileSearch">
                    <button @click="mobileSearch = false" type="button" class="btn rounded-pill me-3"><i class="bi bi-caret-left-square"></i></button>
                </div>
                <div class="col">
                    <div class="d-none d-sm-flex">
                        <div class="input-group flex-nowrap" :class="{ 'focus-margin' : !focus }">
                            <span v-if="focus" class="input-group-text rounded-start-pill border-end-0 bg-transparent pe-0"
                                  style="border-color: #1c62b9"><i class="bi bi-search"></i></span>
                            <input @focus="focus = true" @focusout="focus = false" type="search" class="form-control shadow-none"
                                   :class="[ focus ? 'border-start-0 focus-border' : 'rounded-start-pill' ]" placeholder="Zoek"
                                   style="background-color: #121212" v-model="search" @keydown.enter="doSearch"/>
                            <button @click="doSearch" type="button" class="input-group-text rounded-end-pill px-4"><i class="bi bi-search"></i></button>
                        </div>
                        <button type="button" class="ms-3 btn btn-dark rounded-pill"><i class="bi bi-dice-5"></i></button>
                    </div>
                    <div class="d-flex d-sm-none justify-content-end">
                        <div class="input-group flex-nowrap" v-if="mobileSearch">
                            <span class="input-group-text rounded-start-pill border-end-0 bg-transparent pe-0"
                                  style="border-color: #1c62b9"><i class="bi bi-search"></i></span>
                            <input type="search" class="form-control shadow-none border-start-0 focus-border"
                                   placeholder="Zoek" style="background-color: #121212" v-model="search"/>
                            <button @click="doSearch" type="button" class="input-group-text rounded-end-pill px-4"><i class="bi bi-search"></i></button>
                        </div>
                        <button v-if="!mobileSearch" @click="mobileSearch = true" type="button" class="btn rounded-pill"><i class="bi bi-search"></i></button>
                        <button type="button" class="btn rounded-pill"><i class="bi bi-dice-5"></i></button>
                    </div>
                </div>
                <div class="col-auto col-sm-3 d-flex align-items-center justify-content-end" v-if="!mobileSearch">
                    <a href="https://github.com/lekkersicko/lekker-speuren" target="_blank" title="Bekijk project op GitHub">
                        <button type="button" class="btn rounded-pill"><i class="bi bi-github"></i></button>
                    </a>
                    <div class="dropdown px-2">
                        <button
                            class="btn btn-link nav-link dropdown-toggle d-flex align-items-center"
                            id="bd-theme" type="button" aria-expanded="false" data-bs-toggle="dropdown"
                            data-bs-display="static" aria-label="Toggle theme (dark)">
                            <i class="bi bi-moon-stars-fill"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme-text">
                            <li>
                                <button @click="switchTheme('light')" type="button"
                                        class="dropdown-item d-flex align-items-center"
                                        :class="{active: generalStore.theme === 'light'}" data-bs-theme-value="light">
                                    <i class="bi bi-sun-fill me-2 opacity-50"></i>
                                    Light
                                    <i v-if="generalStore.theme === 'light'" class="bi ms-auto bi-check2"></i>
                                </button>
                            </li>
                            <li>
                                <button @click="switchTheme('dark')" type="button"
                                        class="dropdown-item d-flex align-items-center"
                                        :class="{active: generalStore.theme === 'dark'}" data-bs-theme-value="dark">
                                    <i class="bi bi-moon-stars-fill me-2 opacity-50"></i>
                                    Dark
                                    <i v-if="generalStore.theme === 'dark'" class="bi ms-auto bi-check2"></i>
                                </button>
                            </li>
                            <li>
                                <button @click="switchTheme('auto')" type="button"
                                        class="dropdown-item d-flex align-items-center"
                                        :class="{active: generalStore.theme === 'auto'}" data-bs-theme-value="auto">
                                    <i class="bi bi-circle-half me-2 opacity-50"></i>
                                    Auto
                                    <i v-if="generalStore.theme === 'auto'" class="bi ms-auto bi-check2"></i>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </nav>
<!--    <nav class="navbar bg-body">-->
<!--        <div class="container-fluid flex-nowrap px-2 px-md-4">-->
<!--            <div class="start d-flex align-items-center" style="flex: 1">-->
<!--                <div type="button" class="d-flex align-items-center justify-content-center p-2" style="width: 40px;height: 40px"-->
<!--                     data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">-->
<!--                    <i class="bi bi-list fs-3"></i>-->
<!--                </div>-->
<!--                <router-link to="/" class="ps-3 text-decoration-none d-flex align-items-center">-->
<!--                    <img src="../assets/img/lekkerSicko.png" alt="Logo" width="30px" height="26" class="me-1">-->
<!--                    <span class="fs-7 text-body" style="line-height: 100%">Lekker<br>Speuren</span>-->
<!--                </router-link>-->
<!--            </div>-->
<!--            <div class="center" style="flex: 0 1 732px;">-->
<!--                <div class="d-flex" style="margin-left: 40px">-->
<!--                    <div class="input-group flex-nowrap" :class="{ 'focus-margin' : !focus }">-->
<!--                        <span v-if="focus" class="input-group-text rounded-start-pill border-end-0 bg-transparent pe-0"-->
<!--                              style="border-color: #1c62b9"><i class="bi bi-search"></i></span>-->
<!--                        <input @focus="focus = true" @focusout="focus = false" type="search" class="form-control shadow-none"-->
<!--                               :class="[ focus ? 'border-start-0 focus-border' : 'rounded-start-pill' ]" placeholder="Zoek"-->
<!--                               style="background-color: #121212" v-model="search"/>-->
<!--                        <button @click="doSearch" type="button" class="input-group-text rounded-end-pill px-4"><i class="bi bi-search"></i></button>-->
<!--                    </div>-->
<!--                    <button type="button" class="ms-3 btn btn-dark rounded-pill"><i class="bi bi-dice-5"></i></button>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="end d-flex flex-row justify-content-end align-items-center gap-3 ms-3" style="flex: 1;min-width: 225px">-->
<!--                <a class="nav-link"-->
<!--                   href="https://github.com/lekkersicko/lekker-speuren" target="_blank"-->
<!--                   title="Bekijk project op GitHub"><i class="bi bi-github"></i></a>-->
<!--                <div class="dropdown px-2">-->
<!--                    <button-->
<!--                        class="btn btn-link nav-link dropdown-toggle d-flex align-items-center"-->
<!--                        id="bd-theme" type="button" aria-expanded="false" data-bs-toggle="dropdown"-->
<!--                        data-bs-display="static" aria-label="Toggle theme (dark)">-->
<!--                        <i class="bi bi-moon-stars-fill"></i>-->
<!--                    </button>-->
<!--                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme-text">-->
<!--                        <li>-->
<!--                            <button @click="switchTheme('light')" type="button"-->
<!--                                    class="dropdown-item d-flex align-items-center"-->
<!--                                    :class="{active: generalStore.theme === 'light'}" data-bs-theme-value="light">-->
<!--                                <i class="bi bi-sun-fill me-2 opacity-50"></i>-->
<!--                                Light-->
<!--                                <i v-if="generalStore.theme === 'light'" class="bi ms-auto bi-check2"></i>-->
<!--                            </button>-->
<!--                        </li>-->
<!--                        <li>-->
<!--                            <button @click="switchTheme('dark')" type="button"-->
<!--                                    class="dropdown-item d-flex align-items-center"-->
<!--                                    :class="{active: generalStore.theme === 'dark'}" data-bs-theme-value="dark">-->
<!--                                <i class="bi bi-moon-stars-fill me-2 opacity-50"></i>-->
<!--                                Dark-->
<!--                                <i v-if="generalStore.theme === 'dark'" class="bi ms-auto bi-check2"></i>-->
<!--                            </button>-->
<!--                        </li>-->
<!--                        <li>-->
<!--                            <button @click="switchTheme('auto')" type="button"-->
<!--                                    class="dropdown-item d-flex align-items-center"-->
<!--                                    :class="{active: generalStore.theme === 'auto'}" data-bs-theme-value="auto">-->
<!--                                <i class="bi bi-circle-half me-2 opacity-50"></i>-->
<!--                                Auto-->
<!--                                <i v-if="generalStore.theme === 'auto'" class="bi ms-auto bi-check2"></i>-->
<!--                            </button>-->
<!--                        </li>-->
<!--                    </ul>-->
<!--                </div>-->
<!--            </div>-->
<!--        </div>-->
<!--    </nav>-->

    <teleport to="body">
        <div class="offcanvas offcanvas-start bg-body" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
            <div class="offcanvas-header px-4 py-2">
                <div ref="closeOffcanvas" type="button" class="d-flex align-items-center justify-content-center p-2" style="width: 40px;height: 40px"
                     data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                    <i class="bi bi-list fs-3"></i>
                </div>
                <router-link @click="closeCanvas" to="/" class="ps-3 text-decoration-none d-flex align-items-center">
                    <img src="../assets/img/lekkerSicko.png" alt="Logo" width="30px" height="26" class="me-1">
                    <span class="fs-7 text-body" style="line-height: 100%">Lekker<br>Speuren</span>
                </router-link>
            </div>
            <div class="offcanvas-body py-3">
                <router-link @click="closeCanvas" to="/" class="item text-decoration-none rounded-3 d-block">
                    <div class="d-flex align-items-center text-body px-3 py-2">
                        <i class="bi bi-house-door fs-5 me-4"></i>
                        <i class="active bi bi-house-door-fill fs-5 me-4"></i>
                        <span class="fs-6 flex-grow-1">Home</span>
                    </div>
                </router-link>
                <router-link @click="closeCanvas" to="/series" class="item text-decoration-none rounded-3 d-block">
                    <div class="d-flex align-items-center text-body px-3 py-2">
                        <i class="bi bi-collection-play fs-5 me-4"></i>
                        <i class="active bi bi-collection-play-fill fs-5 me-4"></i>
                        <span class="fs-6 flex-grow-1">Series</span>
                    </div>
                </router-link>
                <hr>
                <router-link @click="closeCanvas" to="/you" class="item text-decoration-none rounded-3 d-block">
                    <div class="d-flex align-items-center text-body px-3 py-2">
                        <span class="fs-6 me-2">You</span>
                        <i class="bi bi-chevron-right fs-6 d-block"></i>
                    </div>
                </router-link>
                <router-link @click="closeCanvas" to="/series" class="item text-decoration-none rounded-3 d-block">
                    <div class="d-flex align-items-center text-body px-3 py-2">
                        <i class="bi bi-clock-history fs-5 me-4"></i>
                        <i class="active bi bi-clock-history fs-5 me-4"></i>
                        <span class="fs-6 flex-grow-1">Geschiedenis</span>
                    </div>
                </router-link>
                <router-link @click="closeCanvas" :to="{name: 'playlists'}" class="item text-decoration-none rounded-3 d-block">
                    <div class="d-flex align-items-center text-body px-3 py-2">
                        <i class="bi bi-collection-play fs-5 me-4"></i>
                        <i class="active bi bi-collection-play-fill fs-5 me-4"></i>
                        <span class="fs-6 flex-grow-1">Afspeellijsten</span>
                    </div>
                </router-link>
                <router-link @click="closeCanvas" :to="{name: 'liked-items'}" class="item text-decoration-none rounded-3 d-block">
                    <div class="d-flex align-items-center text-body px-3 py-2">
                        <i class="bi bi-hand-thumbs-up fs-5 me-4"></i>
                        <i class="active bi bi-hand-thumbs-up-fill fs-5 me-4"></i>
                        <span class="fs-6 flex-grow-1">Liked items</span>
                    </div>
                </router-link>
                <hr>
                <router-link @click="closeCanvas" to="/about" class="item text-decoration-none rounded-3 d-block">
                    <div class="d-flex align-items-center text-body px-3 py-2">
                        <i class="bi bi-question-circle fs-5 me-4"></i>
                        <i class="active bi bi-question-circle-fill fs-5 me-4"></i>
                        <span class="fs-7">Help</span>
                    </div>
                </router-link>
            </div>
        </div>
    </teleport>
</template>

<script setup>
import {useGeneralStore} from "@/stores/general.js";
import {useContentStore} from "@/stores/content.js";
import {ref} from "vue";
import {storeToRefs} from "pinia";

const generalStore = useGeneralStore()
const contentStore = useContentStore()
const {search} = storeToRefs(contentStore)
const focus = ref(false)
const mobileSearch = ref(false)
const closeOffcanvas = ref(false)

function switchTheme(theme) {
    generalStore.setTheme(theme)
}

function doSearch() {
    contentStore.filter()
}

function closeCanvas() {
    setTimeout(() => {
        closeOffcanvas.value.click()
    }, 200)
}
</script>

<style scoped>
.focus-margin {
    margin-left: 29px;
}
.focus-border {
    border-color: #1c62b9!important;
}

.offcanvas-body .item {
    &:hover {
        background-color: rgba(var(--bs-tertiary-bg-rgb));
    }
    &.router-link-active {
        i:not(.active) {
            display: none;
        }
        i.active {
            display: block;
        }
    }
    i.active {
        display: none;
    }
}
</style>