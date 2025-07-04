import { useContentStore } from "@/stores/content.ts";
import type { Card } from "@/types/Card.ts";

/**
 * Filters a given card based on the current video-on-demand (VOD) filter criteria.
 *
 * @param {Card} card - The card to be filtered, which contains data such as Twitch or YouTube IDs.
 * @return {boolean} Returns true if the card meets the active VOD filter criteria, otherwise false.
 */
export function filterVod(card: Card): boolean {
    const contentStore = useContentStore();
    const filter = contentStore.filters.vod;

    if (filter === "all") {
        return true;
    } else if (filter === "vod_only") {
        return Boolean(card.twitch_id || card.youtube_id);
    } else if (filter === "no_vod_only") {
        return !card.twitch_id && !card.youtube_id;
    } else {
        return true; // Fallback to ensure a boolean is always returned
    }
}
