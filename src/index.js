import { GetCard } from './card.js';
import { GetDetails } from './details.js';

// The data object contains all the data from the JSON files
let data = {
    podcasts: [],
    videos: [],
    streams: [],
}

// The current card that is being shown in the details section
let currentCard = null;

let searchTimeout;

const cardsDOM = document.querySelector('#cards')
const searchDOM = document.querySelector('#search')

// Example list for the search bar
const exampleList = [
    'Pokémon',
    'PETER vs TIMON',
    'Speedrun',
    'Minecraft',
    'Tekenen',
    'Lion King',
    'Cuphead',
    'PUBG',
]

// Set a random example from the example list as the placeholder
searchDOM.setAttribute('placeholder', `Zoek een video - Bijvoorbeeld: ${exampleList[Math.floor(Math.random() * exampleList.length)]}`)

// Add an event listener to the search bar
searchDOM.addEventListener('input', (e) => {
    if (e.target.value.length < 3) {
        return
    }

    // Use a timeout to add a delay to the search that resets every time the user types
    if (searchTimeout) {
        clearTimeout(searchTimeout)
    }

    // We use a short delay to prevent the search from triggering on every keypress
    searchTimeout = setTimeout(() => {
        Search(e.target.value)
    }, 250)
})

document.getElementById('cards').addEventListener('click', function (event) {
    // Identify if the click event is from a card
    const clickedElement = event.target.closest('.card');
    if (clickedElement) {
        // Handle the card click
        showCardDetails(clickedElement.dataset.cardId, clickedElement.dataset.cardType);
    } else {
        clearDetails();
    }
});

async function Init() {
    await FetchData()

    RenderSharedCard()
}

async function FetchJson(url) {
    let res = await fetch(url)
    return await res.json()
}

async function FetchData() {
    let [podcasts, videos, streams] = await Promise.all([
        FetchJson('../data/podcasts.json'),
        FetchJson('../data/videos.json'),
        FetchJson('../data/streams.json'),
    ])

    data.podcasts = podcasts
    data.videos = videos
    data.streams = streams
    for (const podcast of data.podcasts) {
        podcast.type = 'podcast';
    }
    for (const video of data.videos) {
        video.type = 'video';
    }
    for (const stream of data.streams) {
        stream.type = 'stream';
    }
}

function GetShareIdFromUrl() {
    const urlParameters = new URLSearchParams(window.location.search);
    return urlParameters.get('id');
}


function GetShareTypeFromUrl() {
    const urlParameters = new URLSearchParams(window.location.search);
    return urlParameters.get('type');
}

function RenderSharedCard() {
    const shareId = GetShareIdFromUrl();
    const shareType = GetShareTypeFromUrl();
    if (shareId == null || shareType == null) {
        return;
    }

    showCardDetails(shareId, shareType);
}

// Normalize a string by removing diacritics and converting to lowercase
function NormalizeString(s) {
    return s == null ? '' : s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "")
}

async function Search(input) {
    const filtered = []

    // Copy the data object
    const filteredData = {
        podcasts: data.podcasts.slice(),
        videos: data.videos.slice(),
        streams: data.streams.slice(),
    }

    const normalizedInput = NormalizeString(input)

    const words = [];

    // Collect all the words. Words between quotes are treated as one word. 
    let word = '';
    let quote = false;
    let negativeWords = [];
    for (const char of normalizedInput) {
        if (char == ' ') {
            if (quote) {
                word += char;
            } else if (word.length > 0) {
                if (word.startsWith('-')) {
                    negativeWords.push(word.substring(1));
                } else {
                    words.push(word);
                }
                word = '';
            }
        } else if (char == '"') {
            quote = !quote;
            if (!quote) {
                if (word.startsWith('-')) {
                    negativeWords.push(word.substring(1));
                } else {
                    words.push(word);
                }
                word = '';
            }
        } else {
            word += char;
        }
    }

    if (word.startsWith('-')) {
        negativeWords.push(word.substring(1));
    } else {
        words.push(word);
    }

    for (const negativeWord of negativeWords) {
        ApplyFilter(filteredData, negativeWord, true)
    }

    for (const word of words) {
        ApplyFilter(filteredData, word)
    }

    for (const podcast of filteredData.podcasts) {
        filtered.push(podcast)
    }

    for (const video of filteredData.videos) {
        filtered.push(video)
    }

    for (const stream of filteredData.streams) {
        filtered.push(stream)
    }

    // Sort filtered by date, newest first. .date is a string in the format "DD/MM/YYYY"
    filtered.sort((a, b) => {
        const aDate = a.date.split('/').reverse().join('');
        const bDate = b.date.split('/').reverse().join('');
        return bDate.localeCompare(aDate);
    })

    // Render filtered data
    RenderCards(filtered)
}

function ApplyFilter(data, target, negative) {
    // Podcasts
    negative = !!negative;

    data.podcasts = data.podcasts.filter(podcast => {
        return (NormalizeString(podcast.title).includes(target) ||
            NormalizeString(podcast.description).includes(target)) != negative;
    });

    // Videos
    data.videos = data.videos.filter(video => {
        return (NormalizeString(video.title).includes(target) ||
            NormalizeString(video.description).includes(target) ||
            (Array.isArray(video.game) ? video.game.some(game => {
                return NormalizeString(game).includes(target)
            }) : NormalizeString(video.game).includes(target))) != negative;
    });

    // Streams
    data.streams = data.streams.filter(stream => {
        return (NormalizeString(stream.description).includes(target) ||
            stream.all_titles.some(title => {
                return NormalizeString(title).includes(target)
            }) ||
            stream.games.some(game => {
                return NormalizeString(game.title).includes(target)
            }) ||
            stream.tags.some(tag => {
                return NormalizeString(tag).includes(target)
            })) != negative;
    });
}

async function RenderCards(data) {
    let html = ''

    data.forEach(stream => {
        html += GetCard(stream);
    });

    cardsDOM.innerHTML = html
}

function setShareUrlClipBoard(cardId, cardType) {
    const host = window.location.host;
    navigator.clipboard.writeText(`${host}?id=${cardId}&type=${cardType}`);
}

function ListenForShareButton(detailedElement) {
    detailedElement.addEventListener('click', function (event) {
        const clickedElement = event.target.closest('#detailed-share');
        if (clickedElement) {
            const cardId = clickedElement.dataset.cardId;

            const cardType = clickedElement.dataset.cardType;
            setShareUrlClipBoard(cardId, cardType);
            const copyFeedbackElement = document.getElementById('detailed-share-copy-feedback');
            copyFeedbackElement.innerText = 'Gekopieerd!';
            setTimeout(() => {
                copyFeedbackElement.innerText = '';
            }, 2000);
        }
    });
}

function ListenForDetailedInteraction(detailedElement) {
    ListenForShareButton(detailedElement);
}

function showCardDetails(cardId, cardType) {
    if (currentCard == cardId) {
        clearDetails();
        return;
    }

    const cardData = data[cardType + "s"].find(data => data.id == cardId);
    const details = GetDetails(cardData);
    let detailedElement = document.getElementById('detailed');
    detailedElement.outerHTML = details;
    detailedElement = document.getElementById('detailed');
    ListenForDetailedInteraction(detailedElement);
    currentCard = cardId;
}

function clearDetails() {
    const element = document.getElementById('detailed');
    element.innerHTML = '';
    element.className = "";
    element.classList.add('empty');
    currentCard = null;
}

Init();