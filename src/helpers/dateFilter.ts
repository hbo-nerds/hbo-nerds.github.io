import { useContentStore } from "@/stores/content.ts";
import type { Card } from "@/types/Card.ts";

/**
 * Filters a card based on its date and a predefined range of date filters.
 *
 * @param {Card} card - The card object containing a date property to be filtered.
 * @return {boolean} Returns true if the card's date satisfies the filter criteria, otherwise false.
 */
export function filterDate(card: Card): boolean {
    const contentStore = useContentStore();
    const range = contentStore.filters.date.range;
    const after = contentStore.filters.date.after;
    const before = contentStore.filters.date.before;

    if (range === "all") return true;

    let toCheck = new Date(card.date);
    if (range === "other") {
        let start = after ? new Date(after) : new Date("2000-01-01");
        let end = before ? new Date(before) : new Date("2099-01-01");

        return toCheck < end && toCheck >= start;
    } else {
        return checkWithinWeeks(card, range);
    }
}

/**
 * Determines whether a given card's date falls within a specified number of weeks from the current date.
 *
 * @param {Card} card - The card object containing the date to check.
 * @param {number} weeks - The number of weeks to subtract from the current date for the comparison.
 * @return {boolean} Returns true if the card's date is within the specified number of weeks, otherwise false.
 */
export function checkWithinWeeks(card: Card, weeks: number) {
    let toCheck = new Date(card.date);
    let d = new Date();
    d.setDate(d.getDate() - 7 * weeks);
    return toCheck > d;
}
