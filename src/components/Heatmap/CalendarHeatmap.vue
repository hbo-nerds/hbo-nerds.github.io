<template>
  <div :class="{ vch__container: true, 'dark-mode': darkMode }">
    <svg ref="svg" :viewBox="viewbox" class="vch__wrapper">
      <g :transform="monthsLabelWrapperTransform" class="vch__months__labels__wrapper">
        <text
          v-for="(month, index) in heatmap.firstFullWeekOfMonths"
          :key="index"
          :x="getMonthLabelPosition(month).x"
          :y="getMonthLabelPosition(month).y"
          class="vch__month__label"
        >
          {{ lo.months[month.value] }}
        </text>
      </g>

      <g :transform="daysLabelWrapperTransform" class="vch__days__labels__wrapper">
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
            {{ lo.days[(i + startWeekday) % DAYS_IN_WEEK] }}
          </text>
        </template>
      </g>

      <g v-if="vertical" :transform="legendWrapperTransform" class="vch__legend__wrapper">
        <text :x="SQUARE_SIZE * 1.25" y="8">{{ lo.less }}</text>
        <rect
          v-for="(color, index) in rangeColor"
          :key="index"
          :height="SQUARE_SIZE - SQUARE_BORDER_SIZE"
          :rx="round"
          :ry="round"
          :style="{ fill: color }"
          :width="SQUARE_SIZE - SQUARE_BORDER_SIZE"
          :x="SQUARE_SIZE * 1.75"
          :y="SQUARE_SIZE * (index + 1)"
        />
        <text
          :x="SQUARE_SIZE * 1.25"
          :y="SQUARE_SIZE * (rangeColor.length + 2) - SQUARE_BORDER_SIZE"
        >
          {{ lo.more }}
        </text>
      </g>

      <g :transform="yearWrapperTransform" class="vch__year__wrapper">
        <g
          v-for="(week, weekIndex) in heatmap.calendar"
          :key="weekIndex"
          :transform="getWeekPosition(weekIndex)"
          class="vch__month__wrapper"
        >
          <template v-for="(day, dayIndex) in week" :key="dayIndex">
            <rect
              v-if="allowFutureDays || day.date < now"
              :data-bs-title="getTooltip(day)"
              :data-day-index="dayIndex"
              :data-week-index="weekIndex"
              :height="SQUARE_SIZE - SQUARE_BORDER_SIZE"
              :rx="round"
              :ry="round"
              :style="{ fill: rangeColor[day.colorIndex] }"
              :transform="getDayPosition(dayIndex)"
              :width="SQUARE_SIZE - SQUARE_BORDER_SIZE"
              class="vch__day__square"
              data-bs-html="true"
              data-bs-toggle="tooltip"
              @click="$emit('dayClick', day)"
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
                    :rx="round"
                    :ry="round"
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
</template>

<script setup>
import { Heatmap } from "@/components/Heatmap/Heatmap";
import { useContentStore } from "@/stores/content.js";
import { ref, toRef, watch } from "vue";

const emit = defineEmits(["dayClick"]);
const props = defineProps({
  endDate: { required: true },
  startWeekday: { type: Number, default: 0 }, // 0 for Sunday, 1 for Monday, etc.
  allowFutureDays: { type: Boolean, default: false },
  showLegend: { type: Boolean, default: true },
  max: { type: Number },
  rangeColor: { type: Array },
  values: { type: Array, required: true },
  locale: { type: Object },
  tooltip: { type: Boolean, default: true },
  vertical: { type: Boolean, default: false },
  round: { type: Number, default: 0 },
  darkMode: Boolean,
});

const contentStore = useContentStore();

const SQUARE_BORDER_SIZE = Heatmap.SQUARE_SIZE / 5;
const SQUARE_SIZE = Heatmap.SQUARE_SIZE + SQUARE_BORDER_SIZE;
const LEFT_SECTION_WIDTH = Math.ceil(Heatmap.SQUARE_SIZE * 2.5);
const RIGHT_SECTION_WIDTH = SQUARE_SIZE * 3;
const TOP_SECTION_HEIGHT = Heatmap.SQUARE_SIZE + Heatmap.SQUARE_SIZE / 2;
const BOTTOM_SECTION_HEIGHT = Heatmap.SQUARE_SIZE + Heatmap.SQUARE_SIZE / 2;
const DAYS_IN_WEEK = Heatmap.DAYS_IN_WEEK;
const yearWrapperTransform = `translate(${LEFT_SECTION_WIDTH}, ${TOP_SECTION_HEIGHT})`;
const svg = ref(null);
const now = ref(new Date());
const heatmap = ref(new Heatmap(props.endDate, props.values, props.max, props.startWeekday));
const width = ref(0);
const height = ref(0);
const viewbox = ref("0 0 0 0");
const legendViewbox = ref("0 0 0 0");
const daysLabelWrapperTransform = ref("");
const monthsLabelWrapperTransform = ref("");
const legendWrapperTransform = ref("");
const lo = ref({});
const rangeColor = ref(
  props.rangeColor ||
    (props.darkMode ? Heatmap.DEFAULT_RANGE_COLOR_DARK : Heatmap.DEFAULT_RANGE_COLOR_LIGHT),
);

/**
 * Return the translate-position for a week.
 * @param index
 * @returns {string}
 */
function getWeekPosition(index) {
  return props.vertical
    ? `translate(0, ${SQUARE_SIZE * heatmap.value.weekCount - (index + 1) * SQUARE_SIZE})`
    : `translate(${index * SQUARE_SIZE}, 0)`;
}

/**
 * Return the translate-position for a day.
 * @param index
 * @returns {string}
 */
function getDayPosition(index) {
  return props.vertical
    ? `translate(${index * SQUARE_SIZE}, 0)`
    : `translate(0, ${index * SQUARE_SIZE})`;
}

/**
 * Return position of month label.
 * @param month
 * @returns {{x: number, y: number}}
 */
function getMonthLabelPosition(month) {
  return props.vertical
    ? {
        x: 3,
        y: SQUARE_SIZE * heatmap.value.weekCount - SQUARE_SIZE * month.index - SQUARE_SIZE / 4,
      }
    : { x: SQUARE_SIZE * month.index, y: SQUARE_SIZE - SQUARE_BORDER_SIZE };
}

/**
 *
 * @param item
 */
function getTooltip(item) {
  console.log(item)
  let html = "";
  let date = item.date.toLocaleString("nl-NL", { dateStyle: "medium" });
  if (item.id) {
    let card = contentStore.getSingleCard(item.id);
    let title = contentStore.getCardTitle(card);
    let thumbnail = contentStore.getCardThumbnail(card);
    let duration = contentStore.getCardDuration(card);
    let activities = contentStore.getCardActivities(card);

    html +=
      "<div class='text-start d-flex flex-column gap-2 small'>" +
      "        <div class='text-center fw-lighter'>" +
      date +
      "</div>" +
      "        <hr class='m-0'>" +
      "        <div class='d-flex justify-content-between gap-2'>" +
      "          <span>Duur</span>" +
      "          <span>" +
      duration +
      "</span>" +
      "        </div>" +
      "        <hr class='m-0'>" +
      "        <div class='d-flex justify-content-between gap-2'>" +
      "          <span class='text-nowrap'>Bekijk op</span>" +
      "          <div class='d-flex justify-content-end flex-wrap gap-2'>";

    if (card["twitch_id"]) html += "<span class='badge text-bg-secondary'>Twitch</span>";
    if (card["youtube_id"]) html += "<span class='badge text-bg-secondary'>YouTube</span>";
    if (card["twitchtracker_id"])
      html += "<span class='badge text-bg-secondary'>TwitchTracker</span>";
    if (!card["twitch_id"] && !card["youtube_id"] && !card["twitchtracker_id"])
      html += "<span>-</span>";

    html +=
      "    </div>" +
      "        </div>" +
      "        <hr class='m-0'>" +
      "        <div class='d-flex justify-content-between gap-2'>" +
      "          <span class='text-nowrap'>Activiteiten</span>" +
      "          <div class='d-flex justify-content-end flex-wrap gap-2 overflow-hidden'>";

    activities.forEach((activity) => {
      html += "<span class='badge text-bg-secondary text-truncate'>" + activity.title + "</span>";
    });

    html +=
      "     </div>" +
      "        </div>" +
      "        <hr class='m-0'>" +
      "        <img alt='thumbnail' src=" +
      thumbnail +
      " />" +
      "        <span>" +
      title +
      "</span>" +
      "        <hr class='m-0'>" +
      "        <div class='text-center fw-lighter'>Klik om te openen</div>" +
      "      </div>";

    return html;
  } else {
    html +=
      "<div class='text-start d-flex flex-column gap-2 small'>" +
      "        <div class='text-center fw-lighter'>" +
      date +
      "</div>" +
      "      </div>";
    return html;
  }
}

/**
 * Watcher for colors and theme.
 */
watch([toRef(props, "rangeColor"), toRef(props, "darkMode")], ([rc, dm]) => {
  rangeColor.value =
    rc || (dm ? Heatmap.DEFAULT_RANGE_COLOR_DARK : Heatmap.DEFAULT_RANGE_COLOR_LIGHT);
});

/**
 * Watcher for change in layout.
 */
watch(
  () => props.vertical,
  (v) => {
    if (v) {
      width.value = LEFT_SECTION_WIDTH + SQUARE_SIZE * Heatmap.DAYS_IN_WEEK + RIGHT_SECTION_WIDTH;
      height.value =
        TOP_SECTION_HEIGHT + SQUARE_SIZE * heatmap.value.weekCount + SQUARE_BORDER_SIZE;
      daysLabelWrapperTransform.value = `translate(${LEFT_SECTION_WIDTH}, 0)`;
      monthsLabelWrapperTransform.value = `translate(0, ${TOP_SECTION_HEIGHT})`;
    } else {
      width.value = LEFT_SECTION_WIDTH + SQUARE_SIZE * heatmap.value.weekCount + SQUARE_BORDER_SIZE;
      height.value = TOP_SECTION_HEIGHT + SQUARE_SIZE * Heatmap.DAYS_IN_WEEK;
      daysLabelWrapperTransform.value = `translate(0, ${TOP_SECTION_HEIGHT})`;
      monthsLabelWrapperTransform.value = `translate(${LEFT_SECTION_WIDTH}, 0)`;
    }
  },
  { immediate: true },
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
    legendWrapperTransform.value = props.vertical
      ? `translate(${LEFT_SECTION_WIDTH + SQUARE_SIZE * Heatmap.DAYS_IN_WEEK}, ${TOP_SECTION_HEIGHT})`
      : `translate(${w - SQUARE_SIZE * rc.length - 30}, ${h - BOTTOM_SECTION_HEIGHT})`;
  },
  { immediate: true },
);

/**
 * Watch for change in locale.
 */
watch(
  () => props.locale,
  (l) => (lo.value = l ? { ...Heatmap.DEFAULT_LOCALE, ...l } : Heatmap.DEFAULT_LOCALE),
  { immediate: true },
);

/**
 * Change legend boxes.
 */
watch(
  rangeColor,
  (rc) =>
    (legendViewbox.value = `0 0 ${Heatmap.SQUARE_SIZE * (rc.length + 1)} ${Heatmap.SQUARE_SIZE}`),
  { immediate: true },
);

/**
 * Create new heatmap instance on data change.
 */
watch(
  () => props.values,
  () => {
    heatmap.value = new Heatmap(props.endDate, props.values, props.max, props.startWeekday);
  },
);
</script>

<style lang="scss">
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
