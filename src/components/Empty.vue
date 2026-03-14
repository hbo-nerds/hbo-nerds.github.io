<script setup lang="ts">
import { useSlots } from "vue";

const slots = useSlots();

const props = withDefaults(
    defineProps<{
        title: string;
        description?: string;
        icon?: string;
    }>(),
    {},
);
</script>

<template>
    <div class="empty-root">
        <div class="empty-container">
            <div v-if="props.icon" class="empty-icon">
                <i :class="`bi bi-${props.icon}`"></i>
            </div>

            <h3 v-if="props.title" class="empty-title">
                {{ props.title }}
            </h3>

            <div v-if="props.description" class="empty-description">
                {{ props.description }}
            </div>

            <div v-if="slots.default" class="empty-slot">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>
.empty-root {
    display: flex;
    justify-content: center;
    align-items: center;
}

.empty-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 32px;
    border-radius: 6px;
}

.empty-icon {
    background-color: rgb(255 255 255 / 0.1);
    border-radius: 6px;
    padding: 16px;
    line-height: 1;
    margin-bottom: 8px;
}

.empty-title {
    text-align: center;
    font-size: 16px;
    font-weight: 500;
}

.empty-description {
    text-align: center;
    font-size: 14px;
    line-height: 20px;
    opacity: 0.75;
}

.empty-slot {
    padding-top: 16px;
}
</style>
