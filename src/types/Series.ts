import type { Card } from "@/types/Card.ts";

export interface Series {
    id: number;
    title: string;
    count: number;
    card: Card;
}

export interface Collection {
    id: number;
    title: string;
    description?: string;
    card?: Card;
    count?: number;
    items?: Card[];
    created?: Date;
    updated?: Date;
}

export interface Playlist {
    title: string;
    description?: string;
    items: string[];
}
