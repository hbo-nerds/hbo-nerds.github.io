import { filterActivity } from "@/helpers/activityFilter.ts";
import { filterDate } from "@/helpers/dateFilter.ts";
import { filterDuration } from "@/helpers/durationFilter.ts";
import { filterPaywall } from "@/helpers/paywallFilter.ts";
import { filterPlatform } from "@/helpers/platformFilter.ts";
import { filterSearchTerm } from "@/helpers/searchFilter.ts";
import { filterSeen } from "@/helpers/seenFilter.ts";
import { filterTag } from "@/helpers/tagFilter.ts";
import { filterType } from "@/helpers/typeFilter.ts";
import { filterVod } from "@/helpers/vodFilter.ts";
import type { Card } from "@/types/Card.ts";

export function filterCard(card: Card, searchTerm: string, exclude: string[] = []): boolean {
    return (
        filterSearchTerm(card, searchTerm) &&
        (exclude.includes("type") ? true : filterType(card)) &&
        (exclude.includes("platform") ? true : filterPlatform(card)) &&
        (exclude.includes("paywall") ? true : filterPaywall(card)) &&
        (exclude.includes("seen") ? true : filterSeen(card)) &&
        (exclude.includes("vod") ? true : filterVod(card)) &&
        (exclude.includes("date") ? true : filterDate(card)) &&
        (exclude.includes("duration") ? true : filterDuration(card)) &&
        (exclude.includes("activity") ? true : filterActivity(card)) &&
        (exclude.includes("tag") ? true : filterTag(card))
    );
}
