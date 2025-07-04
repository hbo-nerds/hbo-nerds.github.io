import { useContentStore } from "@/stores/content.ts";
import { useGeneralStore } from "@/stores/general.ts";
import type { Card } from "@/types/Card.ts";

/**
 * Filters a given card based on whether it has been marked as "seen" or not.
 *
 * @param {Card} card A card object that is being evaluated.
 * @return {boolean} Returns true if the card should be visible (not seen or filter disabled), otherwise returns false.
 */
export function filterSeen(card: Card): boolean {
    const contentStore = useContentStore();
    const generalStore = useGeneralStore();
    const filter = contentStore.filters.hideSeen;

    if (!filter) return true;
    return !generalStore.seenItems.includes(card.id);
}
