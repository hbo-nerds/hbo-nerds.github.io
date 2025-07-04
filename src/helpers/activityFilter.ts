import { normalizeInput } from "@/helpers/searchFilter.ts";
import { useContentStore } from "@/stores/content.ts";
import type { Activity, Card } from "@/types/Card.ts";

/**
 * Filters a card based on the activity defined in the filter settings.
 *
 * @param {Card} card - The card object to be evaluated.
 * @return {boolean} Returns true if the card's activity matches the defined filter, otherwise false.
 */
export function filterActivity(card: Card): boolean {
    const contentStore = useContentStore();
    const filter = contentStore.filters.activity;

    if (!filter.length) return true;

    const act = card.activity ?? card.activities;

    if (!act) return false;

    if (Array.isArray(act)) {
        if (typeof act[0] === "string") {
            // act is string[]
            return filter.some((r) => (act as string[]).includes(r));
        } else {
            // act is Activity[]
            return filter.some((r) => {
                return (act as Activity[])
                    .map((x) => normalizeInput(x.title))
                    .includes(normalizeInput(r));
            });
        }
    } else {
        return filter.includes(act);
    }
}
