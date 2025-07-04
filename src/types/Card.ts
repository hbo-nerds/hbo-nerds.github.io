export interface Card {
    id: string;
    type: "video" | "podcast" | "stream";
    date: string;
    title?: string;
    titles?: string[];
    custom_title?: string;
    duration: number;
    youtube_id?: string;
    description?: string;
    collection?: number[];
    activity?: string | string[];
    activities?: Activity[];
    twitch_id?: string;
    twitch_available?: boolean;
    twitchtracker_id?: string;
    tags?: string[];
    time_start?: string;
    time_end?: string;
    free?: boolean;
}

export interface Activity {
    title: string;
    duration: number;
}
