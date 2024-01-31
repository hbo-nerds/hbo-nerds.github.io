export const GetCard = (data) => {
    let html = '';

    html += `
            <div class="${GetCardTypeClass(data)} card" data-card-id=${data.id} data-card-type=${data.type} >
                <div class="card-thumbnail" style="background-image: url(${GetThumbnail(data)}), url(../images/thumbnails/default_320px/default.webp);">
                    <span class="card-date card-thumbnail-info">${data.date}</span>
                    <span class="card-media-type">${GetMediaType(data)}</span>
                    <span class="card-duration card-thumbnail-info">${GetDuration(data)}</span>
                    <div class="card-media-icons">
                        ${GetMediaIcons(data)}
                    </div>
                </div>
                <div class="card-info">
                    <p class="card-title">${data.title}</p>
                </div>
            </div>
            `

    return html;
}

function GetCardTypeClass(data) {
    return data.type
}

function GetThumbnail(data) {
    let url = '../images/thumbnails/'

    if (data.type == 'stream') {
        if (data.twitch) {
            const id = data.twitch.split('/')[4];
            url += `stream_twitch_320px/${id}.webp`;
        } else if (data.youtube) {
            url += `stream_youtube_320px/${GetYoutubeIDFromURL(data.youtube)}.webp`;
        } else {
            url += 'default_320px/no_video.webp';
        }
    } else {
        url += `video_youtube_320px/${GetYoutubeIDFromURL(data.url)}.webp`;
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

function GetDuration(data) {
    if (data.type == 'stream') {
        return ConvertMinutesToTime(data.total_duration);
    } else if (data.type == 'video') {
        return data.duration;
    } else if (data.type == 'podcast') {
        return data.duration;
    }
}
function ConvertMinutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    const seconds = 0

    return `${hours}:${remainingMinutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function GetMediaIcons(data) {
    let html = '';
    const base = `<a class="card-media-link" target="_blank" href="{URL}"><img class="card-media-icon" src="../images/icons/{NAME}.png" alt=""></img></a>`
    if (data.type == 'stream') {
        if (data.twitch) {
            html += base.replace('{NAME}', 'twitch').replace('{URL}', data.twitch);
        }

        if (data.youtube) {
            html += base.replace('{NAME}', 'youtube').replace('{URL}', data.youtube);
        }
    } else {
        html += base.replace('{NAME}', data.url.includes('podcasts.apple.com') ? 'apple_podcast' : 'youtube').replace('{URL}', data.url);
    }
    return html;
}