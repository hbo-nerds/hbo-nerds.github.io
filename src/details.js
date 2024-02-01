export const GetDetails = (data) => {
    let html = '';

    const unavailable = IsUnavailable(data);

    html += `
        <div id="detailed" class="${GetDetailsTypeClass(data)}"
            style="background-image: url(${GetThumbnail(data)}), url(../images/thumbnails/default_640px/default.webp);">
            <div id="detailed-banner-space">
                <span class="card-media-type">${GetMediaType(data)}</span>
            </div>
            <div id="detailed-info">
                <div id="detailed-datetime">
                    <span id="detailed-date">${GetDate(data)}</span>
                    <span id="detailed-duration">${GetDuration(data)}</span>
                </div>

                <p id="detailed-title">${data.title}</p>

                <div>
                    <button id="detailed-share" data-card-id="${data.id}">Delen</button>
                    <p id="detailed-share-copy-feedback"></p>
                <div>

                ${unavailable ? `<b>Er bestaat geen VOD van deze stream :(</b><br><br><a target="_blank" href=${data.twitchtracker}>TwitchTracker</a>` : `
                <div class="detailed-line">
                    <div class="detailed-line-text">
                        ${GetLinks(data)}
                    </div>
                </div>

                <p id="detailed-description">${GetDescription(data)}</p>
                    ${GetTags(data)}
                `}
                <div class="detailed-line">
                    <div class="detailed-line-text">
                        Activiteiten
                    </div>
                </div>
                <div id="detailed-activities">
                ${GetActivities(data)}
                </div>
                ${GetTitles(data)}
            </div>
        </div>
        `

    return html;
}

function IsUnavailable(data) {
    return data.type == 'stream' && !data.twitch && !data.youtube;
}


function GetDetailsTypeClass(data) {
    return data.type
}

function GetThumbnail(data) {
    let url = '../images/thumbnails/'

    if (data.type == 'stream') {
        if (data.twitch) {
            const id = data.twitch.split('/')[4];
            url += `stream_twitch_640px/${id}.webp`;
        } else if (data.youtube) {
            url += `stream_youtube_640px/${GetYoutubeIDFromURL(data.youtube)}.webp`;
        } else {
            url += 'default_640px/no_video.webp';
        }
    } else {
        url += `video_youtube_640px/${GetYoutubeIDFromURL(data.url)}.webp`;
    }

    return url;
}

function GetYoutubeIDFromURL(url) {
    let id = url.split('=')[1];

    if (id.includes('&')) {
        id = id.split('&')[0];
    }

    return id;
}

function GetMediaType(data) {
    return data.type.toUpperCase();
}

function GetDate(data) {
    // Convert format from DD/MM/YYYY to Dutch date format e.g. 1 januari 2020
    const date = data.date.split('/').reverse().join('-');
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('nl-NL', options);
}

function GetDuration(data) {
    if (data.type == 'stream') {
        return ConvertMinutesToTime(data.total_duration);
    } else if (data.type == 'video') {
        return data.duration;
    } else if (data.type == 'podcast') {
        return data.duration;
    }
}

function GetLinks(data) {
    const links = [];

    const base = `<a target="_blank" href="{URL}">{WEBSITE}</a>`;
    if (data.type == 'stream') {
        if (data.twitch) {
            links.push(base.replace('{WEBSITE}', 'Twitch').replace('{URL}', data.twitch));
        }

        if (data.youtube) {
            links.push(base.replace('{WEBSITE}', 'Youtube').replace('{URL}', data.youtube));
        }

        if (data.twitchtracker) {
            links.push(`<a href="${data.twitchtracker}">TwitchTracker</a>`);
        }
    } else {
        links.push(base.replace('{WEBSITE}', data.url.includes('podcasts.apple.com') ? 'Apple Podcast' : 'Youtube').replace('{URL}', data.url));
    }

    return links.join(' | ');
}

function GetDescription(data) {

    return data.description ?? `<p><a href="https://docs.google.com/forms/d/e/1FAIpQLSeuPAoJu8xsn6JrxrYnRY5v2hw6iSj3eZCXX8QIpFqN6Uy1bA/viewform?usp=pp_url&entry.483165980=${data.id}">Stuur een beschrijving op!</a><p>`;
}

function GetTags(data) {
    if (data.tags == null || data.tags.length == 0) {
        return '';
    }

    let html = `
    <div class="detailed-line">
        <div class="detailed-line-text">
            Tags
        </div>
    </div>
    <div id="detailed-tags">`;

    for (const tag of data.tags) {
        html += `<span class="detailed-tag">${tag.toUpperCase()}</span>`
    }

    return html + '</div>';
}

function GetActivities(data) {
    let html = '';

    if (data.type == 'podcast') {
        return 'Podcast'
    } else if (data.type == 'video') {
        if (Array.isArray(data.game)) {
            html += `<span>` + data.game.join(', ') + `</span>`;
        } else {
            html += `<p>${data.game}</p>`
        }
    } else if (data.type == 'stream') {
        if (data.games.length == 1) {
            html += `<p>${data.games[0].title}</p>`
        } else {
            data.games.forEach(game => {
                html += `<p>${game.title} - ${ConvertMinutesToTime(game.duration)}</p>`
            })
        }
    }

    return html;
}

function GetTitles(data) {
    if (data.titles && data.titles.length > 1) {
        `<div class="detailed-line">
            <div class="detailed-line-text">
                Titels
            </div>
        </div>`

        let html = '';
        data.titles.forEach(title => {
            html += `<p>${title}</p>`
        })

        return html;
    }

    return '';
}

function ConvertMinutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const seconds = 0

    return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}