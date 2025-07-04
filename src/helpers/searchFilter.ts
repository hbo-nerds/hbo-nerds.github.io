import type { Card } from "@/types/Card.ts";

/**
 * Filters a given card based on the specified search term, ensuring all excluded words are absent
 * and all included words are present.
 *
 * @param {Card} card - The card object to be checked against the search term.
 * @param {string} searchTerm - The search term containing words to include and exclude.
 * @return {boolean} - Returns true if the card matches the search term criteria, false otherwise.
 */
export function filterSearchTerm(card: Card, searchTerm: string): boolean {
    const ex_words = excludedWords(searchTerm);
    for (let i = 0; i < ex_words.length; i++) {
        const word = normalizeInput(ex_words[i]);
        if (!checkWord(card, word, true)) return false;
    }

    const in_words = includedWords(searchTerm);
    for (let i = 0; i < in_words.length; i++) {
        const word = normalizeInput(in_words[i]);
        if (!checkWord(card, word, false)) return false;
    }

    return true;
}

/**
 * Checks whether the given word matches the criteria for a specific card type.
 *
 * @param {Card} card - The card object to be checked.
 * @param {string} word - The word to check against the card.
 * @param {boolean} isNegative - Determines if the check should be inverted (negative logic).
 * @return {boolean} Returns true if the word satisfies the criteria for the card type, otherwise false.
 */
function checkWord(card: Card, word: string, isNegative: boolean): boolean {
    switch (card.type) {
        case "podcast":
            return filterPodcast(card, word, isNegative);
        case "video":
            return filterVideo(card, word, isNegative);
        case "stream":
            return filterStream(card, word, isNegative);
    }
}

/**
 * Filters a podcast card based on the provided search string and an optional negative flag.
 *
 * @param {Card} card - The podcast card object containing title and description to search in.
 * @param {string} search - The normalized string to search for within the card's title and description.
 * @param {boolean} [negative=false] - Optional flag to invert the search result.
 * @return {boolean} Returns true if the search term is found in the card's title or description and matches the negative flag behavior, otherwise returns false.
 */
function filterPodcast(card: Card, search: string, negative = false) {
    return (
        (normalizeInput(card.title || "").includes(search) ||
            normalizeInput(card.description || "").includes(search)) !== negative
    );
}

/**
 * Filters a video card based on a search term and an optional negative match.
 *
 * @param {Card} card - The video card object containing title, description, and activity metadata.
 * @param {string} search - The search term to look for in the card's title, description, or activity.
 * @param {boolean} [negative=false] - If true, inverts the matching logic for the search term.
 * @return {boolean} Returns true if the card matches the search criteria, false otherwise.
 */
function filterVideo(card: Card, search: string, negative = false) {
    return (
        (normalizeInput(card.title || "").includes(search) ||
            normalizeInput(card.description || "").includes(search) ||
            (Array.isArray(card.activity)
                ? card.activity.some((act) => {
                      return normalizeInput(act).includes(search);
                  })
                : normalizeInput(card.activity || "").includes(search))) !== negative
    );
}

/**
 * Filters a card based on a search string and returns whether it matches the condition.
 *
 * @param {Card} card - The card object containing descriptions, titles, activities, and tags to be evaluated.
 * @param {string} search - The search string used to filter the card.
 * @param {boolean} [negative=false] - A flag indicating whether to reverse the search result condition.
 * @return {boolean} Returns true if the search matches the card's content and the condition evaluates to true; otherwise returns false.
 */
function filterStream(card: Card, search: string, negative = false) {
    return (
        (normalizeInput(card.description || "").includes(search) ||
            (card.titles
                ? card.titles.some((title) => {
                      return normalizeInput(title).includes(search);
                  })
                : false) ||
            (card.custom_title && normalizeInput(card.custom_title).includes(search)) ||
            (card.activities
                ? card.activities.some((game) => {
                      return normalizeInput(game.title).includes(search);
                  })
                : false) ||
            (card.tags
                ? card.tags.some((tag) => {
                      return normalizeInput(tag).includes(search);
                  })
                : false)) !== negative
    );
}

/**
 * Normalizes the given input string by converting it to lowercase,
 * removing diacritic marks, and ensuring a consistent format.
 *
 * @param {string} input - The string to be normalized.
 * @return {string} - The normalized string. Returns an empty string if the input is falsy.
 */
export function normalizeInput(input: string) {
    return !input
        ? ""
        : input
              .toLowerCase()
              .normalize("NFD")
              .replace(/\p{Diacritic}/gu, "");
}

/**
 * Extracts and returns a list of excluded words from the given search term.
 * The excluded words are identified as those starting with a hyphen (-).
 *
 * @param {string} searchTerm - The input string containing the words, some of which may be excluded.
 * @return {string[]} An array of excluded words, converted to lowercase without the leading hyphen.
 */
function excludedWords(searchTerm: string): string[] {
    return searchTerm
        .split(" ")
        .filter((w) => w.startsWith("-") && w.length)
        .map((w) => w.slice(1).toLowerCase())
        .filter((w) => w);
}

/**
 * Extracts and processes words from the given search term by filtering out words
 * that start with a hyphen and ensuring remaining words are non-empty and transformed to lowercase.
 *
 * @param {string} searchTerm - The input string containing words to be processed.
 * @return {string[]} An array of lowercase words that do not start with a hyphen.
 */
function includedWords(searchTerm: string): string[] {
    return searchTerm
        .split(" ")
        .filter((w) => !w.startsWith("-") && w.length)
        .map((w) => w.toLowerCase());
}
