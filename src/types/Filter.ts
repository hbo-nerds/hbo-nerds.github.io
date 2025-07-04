export interface FilterOption {
    count: number;
    label: string;
    value: string | number;
}

export interface Filters {
    type: string[];
    platform: string[];
    free: boolean;
    hideSeen: boolean;
    vod: Vod;
    date: {
        range: Range;
        after?: string;
        before?: string;
    };
    duration: Duration;
    activity: string[];
    tag: string[];
}

export type Vod = "all" | "vod_only" | "no_vod_only";
export type Range = "all" | "other" | number;
export type Duration = "all" | 20 | 60 | 120 | "over120";
