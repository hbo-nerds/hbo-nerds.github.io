import { useContentStore } from "@/stores/content.ts";
import type { Card } from "@/types/Card.ts";

/**
 * Filters a platform based on the card's relevant platform identifiers
 * and the currently active platform filters.
 *
 * @param {Card} card - The card object containing platform identifiers.
 * @return {boolean} Returns true if the card matches the active platform filters, otherwise false.
 */
export function filterPlatform(card: Card): boolean {
    const contentStore = useContentStore();
    const filter = contentStore.filters.platform;

    if (!filter.length || filter.includes("all")) return true;
    return filter.some((platform) => card[platform + "_id"]);
}
