<template>
    <nav aria-label="Page navigation">
        <ul class="pagination">
            <!-- Previous Button -->
            <li :class="['page-item', { disabled: currentPage === 1 }]">
                <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
                    &laquo;
                </button>
            </li>

            <!-- First Page -->
            <li v-if="shouldShowFirstPage" :class="['page-item', { active: 1 === currentPage }]">
                <button class="page-link" @click="changePage(1)">
                    1
                </button>
            </li>

            <!-- Ellipsis Before Current Range -->
            <li v-if="showLeftEllipsis" class="page-item disabled">
                <span class="page-link">...</span>
            </li>

            <!-- Pages Around Current Page -->
            <li
                v-for="page in visiblePages"
                :key="page"
                :class="['page-item', { active: page === currentPage }]"
            >
                <button class="page-link" @click="changePage(page)">
                    {{ page }}
                </button>
            </li>

            <!-- Ellipsis After Current Range -->
            <li v-if="showRightEllipsis" class="page-item disabled">
                <span class="page-link">...</span>
            </li>

            <!-- Last Page -->
            <li v-if="shouldShowLastPage" :class="['page-item', { active: totalPages === currentPage }]">
                <button class="page-link" @click="changePage(totalPages)">
                    {{ totalPages }}
                </button>
            </li>

            <!-- Next Button -->
            <li :class="['page-item', { disabled: currentPage === totalPages }]">
                <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
                    &raquo;
                </button>
            </li>
        </ul>
    </nav>
</template>

<script>
import { computed, defineComponent } from 'vue';

export default defineComponent({
    props: {
        totalItems: {
            type: Number,
            required: true,
        },
        itemsPerPage: {
            type: Number,
            required: true,
        },
        currentPage: {
            type: Number,
            required: true,
        },
        maxVisiblePages: {
            type: Number,
            default: 5, // How many pages to show around the current page
        },
    },
    emits: ['update:currentPage'],
    setup(props, { emit }) {
        const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage));

        const visiblePages = computed(() => {
            const pages = [];
            const halfRange = Math.floor(props.maxVisiblePages / 2);

            let start = Math.max(2, props.currentPage - halfRange); // Start after page 1
            let end = Math.min(totalPages.value - 1, props.currentPage + halfRange); // End before last page

            if (props.currentPage <= halfRange + 1) {
                start = 2;
                end = Math.min(totalPages.value - 1, props.maxVisiblePages);
            } else if (props.currentPage >= totalPages.value - halfRange) {
                start = Math.max(2, totalPages.value - props.maxVisiblePages + 1);
                end = totalPages.value - 1;
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            return pages;
        });

        const showLeftEllipsis = computed(() => {
            return props.currentPage > Math.floor(props.maxVisiblePages / 2) + 2;
        });

        const showRightEllipsis = computed(() => {
            return props.currentPage < totalPages.value - Math.floor(props.maxVisiblePages / 2) - 1;
        });

        const shouldShowFirstPage = computed(() => props.currentPage > 1);
        const shouldShowLastPage = computed(() => props.currentPage < totalPages.value);

        const changePage = (page) => {
            if (page >= 1 && page <= totalPages.value) {
                emit('update:currentPage', page);
            }
        };

        return {
            totalPages,
            visiblePages,
            showLeftEllipsis,
            showRightEllipsis,
            shouldShowFirstPage,
            shouldShowLastPage,
            changePage,
        };
    },
});
</script>

<style scoped></style>
