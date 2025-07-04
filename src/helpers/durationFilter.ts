import { useContentStore } from "@/stores/content.ts";
import type { Card } from "@/types/Card.ts";

/**
 * Filters a given card based on its duration and the active duration filter settings.
 *
 * @param {Card} card - The card object to be checked for the duration filter.
 * @return {boolean} Returns true if the card passes the duration filter, otherwise false.
 */
export function filterDuration(card: Card): boolean {
    const contentStore = useContentStore();
    const filter = contentStore.filters.duration;

    if (filter === "all") return true;
    if (filter === "over120") return card.duration / 60 > 120;
    return card.duration / 60 < filter;
}
