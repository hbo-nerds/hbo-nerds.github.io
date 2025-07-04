import { useContentStore } from "@/stores/content.ts";
import type { Card } from "@/types/Card.ts";

/**
 * Filters cards based on their tags and current tag filters.
 *
 * @param {Card} card - The card object to be checked against the tag filters.
 * @return {boolean} Returns true if the card matches the tag filters or if no filters are applied; otherwise, returns false.
 */
export function filterTag(card: Card): boolean {
    const contentStore = useContentStore();
    const filter = contentStore.filters.tag;

    if (!filter.length) return true;

    const tags = card.tags;
    if (!tags) return false;
    return filter.some((r) => tags.includes(r));
}
