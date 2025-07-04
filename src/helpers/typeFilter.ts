import { useContentStore } from "@/stores/content.ts";
import type { Card } from "@/types/Card.ts";

/**
 * Filters a card based on the type filter set in the content store.
 *
 * @param {Card} card - The card object to be evaluated against the type filter.
 * @return {boolean} Returns true if the card's type matches the active filter or if no filter is applied, otherwise false.
 */
export function filterType(card: Card): boolean {
    const contentStore = useContentStore();
    const filter = contentStore.filters.type;

    if (!filter.length || filter.includes("all")) return true;
    return filter.includes(card.type);
}
