<template>
  <div :class="{ vch__container: true, 'dark-mode': darkMode }">
    <Transition mode="out-in" name="fade">
      <div v-if="loading">
        <div class="py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
      <div v-else>
        <svg ref="svg" :viewBox="viewbox" class="vch__wrapper">
          <g
            :transform="`translate(${LEFT_SECTION_WIDTH}, 0)`"
            class="vch__months__labels__wrapper"
          >
            <text
              v-for="(month, index) in heatmap.firstFullWeekOfMonths"
              :key="`${index}_month`"
              :x="getMonthLabelPosition(month).x"
              :y="getMonthLabelPosition(month).y"
              class="vch__month__label"
            >
              {{ lo.months[month.value] }}
            </text>
          </g>

          <g :transform="`translate(0, ${TOP_SECTION_HEIGHT})`" class="vch__days__labels__wrapper">
            <template v-for="i in [0, 1, 2, 3, 4, 5, 6]">
              <text
                :x="vertical ? SQUARE_SIZE * i : 0"
                :y="
                  vertical
                    ? SQUARE_SIZE - SQUARE_BORDER_SIZE
                    : SQUARE_SIZE - SQUARE_BORDER_SIZE + SQUARE_SIZE * i
                "
                class="vch__day__label"
              >
                {{ lo.days[(i + 1) % DAYS_IN_WEEK] }}
              </text>
            </template>
          </g>

          <g
            :transform="`translate(${LEFT_SECTION_WIDTH}, ${TOP_SECTION_HEIGHT})`"
            class="vch__year__wrapper"
          >
            <g
              v-for="(week, weekIndex) in heatmap.calendar"
              :key="weekIndex"
              :transform="`translate(${weekIndex * SQUARE_SIZE}, 0)`"
              class="vch__month__wrapper"
            >
              <template v-for="(day, dayIndex) in week" :key="dayIndex">
                <rect
                  :id="`rect_${endDate}_${weekIndex}_${dayIndex}`"
                  :data-day-index="dayIndex"
                  :data-week-index="weekIndex"
                  :height="SQUARE_SIZE - SQUARE_BORDER_SIZE"
                  :style="{
                    fill:
                      day.id && day.id.includes(selectedCardId)
                        ? '#ffc107'
                        : rangeColor[day.colorIndex],
                  }"
                  :transform="`translate(0, ${dayIndex * SQUARE_SIZE})`"
                  :width="SQUARE_SIZE - SQUARE_BORDER_SIZE"
                  class="vch__day__square"
                  @click="
                    hideTooltip($event, day);
                    $emit('dayClick', day, 'left');
                  "
                  @mouseover="showTooltip($event, day)"
                  @mouseout="hideTooltip($event, day)"
                  @click.middle="$emit('dayClick', day, 'middle')"
                />
              </template>
            </g>
          </g>
        </svg>
        <div v-if="showLegend" class="vch__legend">
          <slot name="legend">
            <div class="vch__legend-left">
              <slot name="vch__legend-left"></slot>
            </div>
            <div class="vch__legend-right">
              <slot name="legend-right">
                <div class="vch__legend">
                  <div>{{ lo.less }}</div>
                  <svg
                    v-if="!vertical"
                    :height="SQUARE_SIZE - SQUARE_BORDER_SIZE"
                    :viewBox="legendViewbox"
                    class="vch__external-legend-wrapper"
                  >
                    <g class="vch__legend__wrapper">
                      <rect
                        v-for="(color, index) in rangeColor"
                        :key="index"
                        :height="SQUARE_SIZE - SQUARE_BORDER_SIZE"
                        :style="{ fill: color }"
                        :width="SQUARE_SIZE - SQUARE_BORDER_SIZE"
                        :x="SQUARE_SIZE * index"
                      />
                    </g>
                  </svg>
                  <div>{{ lo.more }}</div>
                </div>
              </slot>
            </div>
          </slot>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { Heatmap } from "@/components/Heatmap/Heatmap";
import { useContentStore } from "@/stores/content.js";
import { Tooltip } from "bootstrap";
import { storeToRefs } from "pinia";
import { onMounted, ref, watch } from "vue";

const emit = defineEmits(["dayClick"]);
const props = defineProps({
  endDate: { required: true },
  showLegend: { type: Boolean, default: true },
  values: { type: Array, required: true },
  tooltip: { type: Boolean, default: true },
  vertical: { type: Boolean, default: false },
  darkMode: Boolean,
});

const contentStore = useContentStore();
const { selectedCardId } = storeToRefs(contentStore);

const activeTooltip = ref(null);

const loading = ref(false);
const SQUARE_BORDER_SIZE = 10 / 5;
const SQUARE_SIZE = 10 + SQUARE_BORDER_SIZE;
const LEFT_SECTION_WIDTH = Math.ceil(10 * 2.5);
const TOP_SECTION_HEIGHT = 10 + 10 / 2;
const BOTTOM_SECTION_HEIGHT = 10 + 10 / 2;
const DAYS_IN_WEEK = 7;

const svg = ref(null);
const heatmap = ref(false);
const width = ref(0);
const height = ref(0);
const viewbox = ref("0 0 0 0");
const legendViewbox = ref("0 0 0 0");
const legendWrapperTransform = ref("");
const lo = ref(Heatmap.DEFAULT_LOCALE);
const rangeColor = ref(
  props.darkMode ? Heatmap.DEFAULT_RANGE_COLOR_DARK : Heatmap.DEFAULT_RANGE_COLOR_LIGHT,
);

/**
 * Return position of month label.
 * @param month
 * @returns {{x: number, y: number}}
 */
function getMonthLabelPosition(month) {
  return { x: SQUARE_SIZE * month.index, y: SQUARE_SIZE - SQUARE_BORDER_SIZE };
}

/**
 * Create and show the tooltip.
 * @param event
 * @param item
 */
async function showTooltip(event, item) {
  if (!item.id) return;
  activeTooltip.value = item.id;
  let el = event.target;
  const title = await createHtml(item);
  if (activeTooltip.value !== item.id) return;
  const tooltip = new Tooltip(el, {
    title: title,
    html: true,
    customClass: "customTooltip",
  });
  tooltip.show();
}

/**
 * Dispose the tooltip.
 * @param event
 * @param item
 */
function hideTooltip(event, item) {
  if (!item.id) return;
  activeTooltip.value = null;
  let el = event.target;
  const tooltip = Tooltip.getInstance(el);
  if (tooltip) tooltip.dispose();
}

/**
 * Create the HTML for inside the tooltip.
 * @param item
 */
async function createHtml(item) {
  let html = "";
  let date = item.date.toLocaleString("nl-NL", { dateStyle: "medium" });

  html +=
    "<div class='text-start d-flex flex-column gap-2 small'>" +
    " <div class='text-center fw-lighter'>" +
    date +
    " </div>" +
    "<hr class='m-0'>" +
    "<div class='d-flex flex-column gap-2'>";

  for (const id of item.id) {
    html += await genHTMl(id);
  }

  html +=
    "</div>" +
    " <hr class='m-0'>" +
    " <div class='text-center fw-lighter'>Klik om te openen</div>" +
    "</div>";

  return html;
}

async function genHTMl(id) {
  let card = contentStore.getSingleCard(id);
  let title = contentStore.getCardTitle(card);
  let thumbnail_new = await contentStore.getCardImage(card);
  let duration = contentStore.getCardDuration(card);

  let temp = "<div class='d-flex flex-column gap-2'>";

  temp +=
    "<div class='position-relative'>" +
    " <img class='w-100' alt='thumbnail' src=" +
    thumbnail_new +
    " />" +
    " <span class='badge bg-black position-absolute bottom-0 end-0 m-1' style='--bs-bg-opacity: 0.75'>" +
    duration +
    "</span>" +
    " <span class='badge bg-black position-absolute bottom-0 start-0 m-1' style='--bs-bg-opacity: 0.75'>" +
    card.type +
    "</span>" +
    "</div>" +
    "<span>" +
    title +
    "</span>" +
    "</div>";

  return temp;
}

/**
 * Watcher for colors and theme.
 */
watch(
  () => props.darkMode,
  (newValue) => {
    rangeColor.value = newValue
      ? Heatmap.DEFAULT_RANGE_COLOR_DARK
      : Heatmap.DEFAULT_RANGE_COLOR_LIGHT;
  },
);

/**
 * Watcher for resize.
 */
watch([width, height], ([w, h]) => (viewbox.value = ` 0 0 ${w} ${h}`), { immediate: true });

/**
 * Change position of legend.
 */
watch(
  [width, height, rangeColor],
  ([w, h, rc]) => {
    legendWrapperTransform.value = `translate(${w - SQUARE_SIZE * rc.length - 30}, ${h - BOTTOM_SECTION_HEIGHT})`;
  },
  { immediate: true },
);

async function initialize() {
  loading.value = true;

  //create heatmap
  heatmap.value = await new Heatmap(props.endDate, props.values, 1);

  width.value = LEFT_SECTION_WIDTH + SQUARE_SIZE * heatmap.value.weekCount + SQUARE_BORDER_SIZE;
  height.value = TOP_SECTION_HEIGHT + SQUARE_SIZE * 7;

  setTimeout(() => {
    loading.value = false;
  }, 700);
}

/**
 * Create new heatmap instance on data change.
 */
watch(
  () => props.values,
  async () => {
    await initialize();
  },
);

onMounted(async () => {
  await initialize();
});
</script>

<style lang="scss">
.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.tooltip {
  --bs-tooltip-bg: rgba(var(--bs-body-bg-rgb), 1) !important;
  --bs-tooltip-opacity: 1 !important;
  --bs-tooltip-color: rgba(var(--bs-body-color-rgb), var(--bs-text-opacity)) !important;

  .tooltip-inner {
    border: var(--bs-border-width) var(--bs-border-style) var(--bs-border-color) !important;
  }
}

.vch__container {
  .vch__legend {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .vch__external-legend-wrapper {
    margin: 0 8px;
  }
}

svg.vch__wrapper {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
    "Open Sans", "Helvetica Neue", sans-serif;
  line-height: 10px;
  width: 100%;

  .vch__months__labels__wrapper text.vch__month__label {
    font-size: 10px;
  }

  .vch__days__labels__wrapper text.vch__day__label,
  .vch__legend__wrapper text {
    font-size: 9px;
  }

  text.vch__month__label,
  text.vch__day__label,
  .vch__legend__wrapper text {
    fill: #767676;
  }

  rect.vch__day__square:hover {
    stroke: #555;
    stroke-width: 2px;
    paint-order: stroke;
  }

  rect.vch__day__square:focus {
    outline: none;
  }

  &.dark-mode {
    text.vch__month__label,
    text.vch__day__label,
    .vch__legend__wrapper text {
      fill: #fff;
    }
  }
}
</style>
