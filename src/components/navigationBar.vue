<template>
    <div class="bg-dark-subtle">
        <div class="container-xxl">
            <nav class="navbar navbar-expand-md">
                <div class="container-fluid">
                    <router-link to="/" class="navbar-brand">
                        <img src="../assets/img/lekkerSicko.png" alt="Logo" width="30" height="24"
                             class="d-inline-block align-text-top">
                        Lekker Speuren
                    </router-link>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <router-link class="nav-link" to="/" active-class="active">Home</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/series" active-class="active">Series</router-link>
                            </li>
                            <li class="nav-item">
                                <router-link class="nav-link" to="/you" active-class="active">You</router-link>
                            </li>
                        </ul>
                        <ul class="navbar-nav ms-auto">
                            <li class="nav-item">
                                <a class="nav-link position-relative"
                                   href="https://github.com/lekkersicko/lekker-speuren" target="_blank"
                                   title="Bekijk project op GitHub"><i class="bi bi-github"></i></a>
                            </li>
                            <li class="nav-item px-1 py-2 d-none d-md-block">
                                <div class="vr h-100 text-white"></div>
                            </li>
                            <li class="nav-item dropdown">
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
                                                :class="{active: store.theme === 'light'}" data-bs-theme-value="light">
                                            <i class="bi bi-sun-fill me-2 opacity-50"></i>
                                            Light
                                            <i v-if="store.theme === 'light'" class="bi ms-auto bi-check2"></i>
                                        </button>
                                    </li>
                                    <li>
                                        <button @click="switchTheme('dark')" type="button"
                                                class="dropdown-item d-flex align-items-center"
                                                :class="{active: store.theme === 'dark'}" data-bs-theme-value="dark">
                                            <i class="bi bi-moon-stars-fill me-2 opacity-50"></i>
                                            Dark
                                            <i v-if="store.theme === 'dark'" class="bi ms-auto bi-check2"></i>
                                        </button>
                                    </li>
                                    <li>
                                        <button @click="switchTheme('auto')" type="button"
                                                class="dropdown-item d-flex align-items-center"
                                                :class="{active: store.theme === 'auto'}" data-bs-theme-value="auto">
                                            <i class="bi bi-circle-half me-2 opacity-50"></i>
                                            Auto
                                            <i v-if="store.theme === 'auto'" class="bi ms-auto bi-check2"></i>
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    </div>
</template>

<script setup>
import {useGeneralStore} from "@/stores/general.js";

const store = useGeneralStore()

function switchTheme(theme) {
    store.setTheme(theme)
}
</script>

<style scoped></style>