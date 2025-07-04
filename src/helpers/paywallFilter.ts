import { useContentStore } from "@/stores/content.ts";
import type { Card } from "@/types/Card.ts";

/**
 * Determines if a card should pass through the paywall filter based on its type and free status.
 *
 * @param {Card} card - The card object to evaluate. Contains properties such as type and free status.
 * @return {boolean} Returns true if the card can pass through the filter, otherwise false.
 */
export function filterPaywall(card: Card): boolean {
    const contentStore = useContentStore();
    const filter = contentStore.filters.free;

    if (!filter) return true;
    return card.type !== "stream" || Boolean(card.free);
}
