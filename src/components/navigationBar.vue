<template>
    <nav class="navbar bg-body">
        <div class="container-fluid flex-nowrap px-2 px-md-4">
            <div class="start d-flex align-items-center" style="flex: 1">
                <div type="button" class="d-flex align-items-center justify-content-center p-2" style="width: 40px;height: 40px">
                    <i class="bi bi-list fs-3"></i>
                </div>
                <router-link to="/" class="ps-3 text-decoration-none d-flex align-items-center">
                    <img src="../assets/img/lekkerSicko.png" alt="Logo" width="30px" height="26" class="me-1">
                    <span class="fs-7 text-body" style="line-height: 100%">Lekker<br>Speuren</span>
                </router-link>
            </div>
            <div class="center" style="flex: 0 1 732px;">
                <div class="d-flex" style="margin-left: 40px">
                    <div class="input-group flex-nowrap" :class="{ 'focus-margin' : !focus }">
                        <span v-if="focus" class="input-group-text rounded-start-pill border-end-0 bg-transparent pe-0"
                              style="border-color: #1c62b9"><i class="bi bi-search"></i></span>
                        <input @focus="focus = true" @focusout="focus = false" type="search" class="form-control shadow-none"
                               :class="[ focus ? 'border-start-0 focus-border' : 'rounded-start-pill' ]" placeholder="Zoek"
                               style="background-color: #121212" v-model="search"/>
                        <button @click="doSearch" type="button" class="input-group-text rounded-end-pill px-4"><i class="bi bi-search"></i></button>
                    </div>
                    <button type="button" class="ms-3 btn btn-dark rounded-pill"><i class="bi bi-dice-5"></i></button>
                </div>
            </div>
            <div class="end d-flex flex-row justify-content-end align-items-center gap-3 ms-3" style="flex: 1;min-width: 225px">
                <a class="nav-link"
                   href="https://github.com/lekkersicko/lekker-speuren" target="_blank"
                   title="Bekijk project op GitHub"><i class="bi bi-github"></i></a>
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
    </nav>
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

function switchTheme(theme) {
    generalStore.setTheme(theme)
}

function doSearch() {
    contentStore.filter()
}
</script>

<style scoped>
.focus-margin {
    margin-left: 29px;
}
.focus-border {
    border-color: #1c62b9!important;
}
</style>