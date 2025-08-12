/// <reference path="demo/chiptune2.js" />
/// <reference path="demo/libopenmpt.js" />

class jPlayer extends HTMLElement {
    _audioPlayer;
    /** @type {HTMLVideoElement} */
    _videoPlayer;
    _trackerPlayer;
    _playlist = [];
    _playlistSources = [];
    _observer;
    _style;
    _solo = false;
    _fallback;
    rendered = false;

    /** @type {HTMLElement} */
    #container;
    /** @type {HTMLElement} */
    #playingContainer;
    /** @type {HTMLElement} */
    #playlistContainer;

    static observedAttributes = ["solo", "id", "css", "fallback", "do-tracker-metadata"];

    /* 
        Modify this if you want to have a custom widget.
        Moderate JS knowledge required.
     */
    renderLoading() {
        return /* html */`
                <article>
                    <h1>Please wait... jPlayer2 is loading...</h1>
                    <p id="jplayer--loading-status"></p>
                    <p>Want to remove the thing above? Just remove it on the renderLoading() function.</p>
                </article>
            `;
    }

    renderPlaylistItem(track, isFirst, mode) {
        return /* html */ `
                <button class="playlist-item${isFirst ? ' playing' : ''}"${mode ? ` data-mode=${mode}` : ''} data-src=${track.src} data-art=${track.art}>
                    <div class="track-info-container">
                        <div class="album-art-container">
                            <img loading="lazy" src="${track.art}" alt="">
                        </div>
                        <div class="track-info">
                            <h2><span aria-hidden="true" class="ms" data-icon="equalizer"></span> ${track.title}</h2>
                            <p><span>${track.artist}</span> ${track.album ? `- <span>${track.album}</span>` : ''} ${mode ? `<span class="mode">${mode}</span>` : ''}</p>
                        </div>
                    </div>
                    <div class="card-background">
                        <img loading="lazy" src="${track.art}" alt="">
                    </div>
                </button>
            `;
    }

    renderError(title, err) {
        return /*html*/`
        <section id="jplayer--playing-card">
            <div class="now-playing-container">
                <div class="player-controls">
                    <div class="now-playing-info">
                        <div class="track-info error">
                            <h1>${title}</h1>
                            <p>${err.message}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        `
    }

    renderPlayingCard(paused = false) {
        const currentTrack = this._playlist[0];
        return /* html */ `
                <section id="jplayer--playing-card">
                    <div class="now-playing-container">
                        <div class="player-controls">
                            <div class="now-playing-info">
                                <div class="album-art-container">
                                    <img loading="lazy" src="${currentTrack?.art}" alt="">
                                </div>
                                <div class="track-info">
                                    <h1>${currentTrack?.title}</h1>
                                    <p><span>${currentTrack?.artist}</span> <span ${currentTrack?.tracker ? 'data-tracker="true"' : ''}>${currentTrack?.album != '' ? (!currentTrack?.tracker ? '- ' : ' ') + currentTrack?.album : ''}</span></p>
                                </div>
                            </div>
                            <div class="controls">
                                <span id="pos">0:00</span>
                                <span id="sep">/</span>
                                <span id="dur">0:00</span>
                                <div class="center">
                                    ${this._playlist.length > 1 ? `
                                    <button aria-hidden="true" class="ms" id="shuffle">shuffle</button>
                                    <button aria-hidden="true" class="ms" id="prev">skip_previous</button>
                                    ` : ''}
                                    <button aria-hidden="true" class="ms" id="playpause">${this._paused || paused ? 'play_arrow' : 'pause'}</button>
                                    ${this._playlist.length > 1 ? `
                                    <button aria-hidden="true" class="ms" id="next">skip_next</button>
                                    <button aria-hidden="true" class="ms" id="repeat">repeat</button>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="progress">
                            <input type="range" min="0" max="1000000" value="0">
                        </div>
                        <div class="card-background">
                            <img loading="lazy" src="${currentTrack?.art}" alt="">
                        </div>
                    </div>
                </section>
            `;
    }

    renderPlaylistCard() {
        return /* html */ `
                <section id="jplayer--playlist-card" style="display: ${this._solo ? 'none' : ''};">
                    ${this._playlist.length > 0 ?
                `${this._playlist.map(({ html }) => html).join('')}` :
                `Loading tracks...`
            }
                </section>
            `;
    }

    render() {
        this._shadow.innerHTML = /* html */ `
                <style>
                    ${!this.rendered ? /* css */ `
                        #jplayer--container {
                            display: none;
                            opacity: 0;
                            animation: fadein 250ms forwards;
                        }
    
                        @keyframes fadein {
                            from { opacity: 0; }
                            to   { opacity: 1; }
                        }
                    ` : ''}
                    ${this._style || ''}
                </style>
                <article id="jplayer--container">
                    ${this.renderPlayingCard()}
                    ${this.renderPlaylistCard()}
                </article>
            `;

        this.#container = this._shadow.querySelector('#jplayer--container');
        this.#playingContainer = this.#container.querySelector('#jplayer--playing-card');
        this.#playlistContainer = this.#container.querySelector('#jplayer--playlist-card');

        this.#playlistContainer?.querySelectorAll('.playlist-item').forEach((el) => {
            el.addEventListener('click', () => this.playTrack(el));
        });

        if (this.#playlistContainer?.querySelector('.playlist-item')) {
            this.playTrack(this.#playlistContainer.querySelector('.playlist-item'));
        }

        window.addEventListener('resize', () => {
            this.loadOverflow();
        })

        this.initListeners();
        setTimeout(() => this.loadOverflow(), 100);

        this.rendered = true;
        this.emit('load');
    }

    constructor() {
        super();
        this._internals = this.attachInternals();
        this._shadow = this.attachShadow({ mode: 'open' });
        this._mutationObserver = new MutationObserver(() => this.updatePlaylist());
        this._intersectionObserver = null;
        this._audioPlayer = new Audio();
        this._paused = true;

        this._audioPlayer.addEventListener('durationchange', () => this.progress());
        this._audioPlayer.addEventListener('timeupdate', () => this.progress());
        this._audioPlayer.addEventListener('ended', () => this.nextTrack());

        this._videoPlayer = document.createElement('video');

        if (typeof ChiptuneJsPlayer !== 'undefined') {
            window['libopenmpt'] = Module;
            this._trackerAudioContext = new AudioContext();
            this._trackerPlayer = new ChiptuneJsPlayer(new ChiptuneJsConfig(0, undefined, undefined, this._trackerAudioContext));
        }

        if (typeof window.jsmediatags !== 'undefined') {
            this._mediaTags = window.jsmediatags;
        }

        this._shadow.innerHTML = this.renderLoading();
        this._playlistPlaceholder = this._shadow.querySelector('article');
    }

    loadOverflow() {
        setTimeout(() => {
            this.#container.querySelectorAll('.track-info > *').forEach((el, key) => {
                el.classList.toggle("overflow", isOverflowing(el));
                el.style.setProperty("--d", (el.textContent.length * 10) + "ms");
            });
        }, 150);
    }

    initListeners() {
        const playPause = this.#playingContainer?.querySelector('#playpause');
        playPause?.addEventListener('click', () => this.playPause(playPause));

        const next = this.#playingContainer?.querySelector('#next');
        next?.addEventListener('click', () => this.nextTrack());

        const prev = this.#playingContainer?.querySelector('#prev');
        prev?.addEventListener('click', () => this.prevTrack());

        const repe = this.#playingContainer?.querySelector('#repeat');
        repe?.addEventListener('click', () => this.repeat(repe));

        const shuf = this.#playingContainer?.querySelector('#shuffle');
        shuf?.addEventListener('click', () => this.shuffle(shuf));

        const progressBar = this.#playingContainer?.querySelector('.progress input[type="range"]');
        progressBar?.addEventListener('input', () => this.progressChanged(progressBar));

        const videoElement = this.#playingContainer?.querySelector('#jplayer--video-player');
        videoElement?.appendChild(this._videoPlayer);
    }

    connectedCallback() {
        this._intersectionObserver = new IntersectionObserver(this._handleIntersection.bind(this), {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });
        this._intersectionObserver.observe(this._playlistPlaceholder);
    }

    disconnectedCallback() {
        this._mutationObserver.disconnect();
        if (this._intersectionObserver) {
            this._intersectionObserver.unobserve(this._playlistPlaceholder);
            this._intersectionObserver.disconnect();
            this._intersectionObserver = null;
        }
    }

    _handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('player is loading');
                this._mutationObserver.observe(this, { childList: true });
                const placeholder = entry.target;
                const placeholderStyle = window.getComputedStyle(placeholder);
                const hostElement = this;
                if (placeholderStyle.display === 'none' || placeholderStyle.visibility === 'hidden') {
                    return;
                }
                let parent = hostElement.parentElement;
                while (parent) {
                    const parentStyle = window.getComputedStyle(parent);
                    if (parentStyle.display === 'none' || parentStyle.visibility === 'hidden') {
                        return;
                    }
                    parent = parent.parentElement;
                }
                observer.unobserve(placeholder);
                this.updatePlaylist();
            }
        });
    }

    emit(type, detail = {}) {
        this.dispatchEvent(new CustomEvent(`jPlayer2:${type}`, { bubbles: true, detail }));
    }

    seek(secs) {
        if (this._trackerPlayer && this._trackerPlayer?.currentPlayingNode !== null) {
            let module = this._trackerPlayer?.currentPlayingNode.modulePtr;
            libopenmpt._openmpt_module_set_position_seconds(module, secs);
        } else {
            this._audioPlayer.currentTime = secs;
        }
        this.emit('seek', secs)
    }

    progressChanged(el) {
        if (this._trackerPlayer && this._trackerPlayer?.currentPlayingNode !== null) {
            let duration = this._trackerPlayer?.duration();
            let module = this._trackerPlayer?.currentPlayingNode.modulePtr;
            libopenmpt._openmpt_module_set_position_seconds(module, (el.value / 1000000) * duration);
            this.emit('seek', (el.value / 1000000) * duration);
        } else {
            let duration = this._audioPlayer.duration;
            this._audioPlayer.currentTime = (el.value / 1000000) * duration;
            this.emit('seek', (el.value / 1000000) * duration);
        }
    }

    getProgress() {
        if (this._trackerPlayer && this._trackerPlayer?.currentPlayingNode !== null) {
            return this._trackerPlayer?.getCurrentTime();
        } else {
            return this._audioPlayer.currentTime;
        }
    }

    progress() {
        try {
            let pos = this.#playingContainer.querySelector('#pos');
            let dur = this.#playingContainer.querySelector('#dur');
            let prg = this.#playingContainer.querySelector('.progress input[type="range"]');
            if (this._trackerPlayer && this._trackerPlayer?.currentPlayingNode !== null) {
                let duration = this._trackerPlayer?.duration();
                let position = this._trackerPlayer?.getCurrentTime();
                let order = this._trackerPlayer?.getCurrentOrder();
                let totalOrder = this._trackerPlayer?.getTotalOrder();
                pos.textContent = `${formatTime(position)}.${order}`;
                dur.textContent = `${formatTime(duration)}.${totalOrder}`;
                let val = ((position ?? 0) / (duration ?? 0)) * 1000000;
                val = Object.is(val, NaN) ? 0 : val;
                prg.value = val;

                if ("mediaSession" in navigator) {
                    navigator.mediaSession.setPositionState({
                        duration: duration,
                        position: position
                    })
                }

                if (position > 1 && duration > 1 && position >= (duration - 0.15)) {
                    this.nextTrack();
                }

                this.emit('timeUpdate', position);
            } else {
                let duration = this._audioPlayer.duration;
                let position = this._audioPlayer.currentTime;
                pos.textContent = formatTime(position);
                dur.textContent = formatTime(duration);
                let val = ((position ?? 0) / (duration ?? 0)) * 1000000;
                val = Object.is(val, NaN) ? 0 : val;
                prg.value = val;

                if ("mediaSession" in navigator) {
                    navigator.mediaSession.setPositionState({
                        duration: duration,
                        position: position
                    })
                }

                this.emit('timeUpdate', position);
            }
        } catch { }
    }

    repeat(el) {
        if (this._repeat) {
            this._repeatOne = true;
            this._repeat = false;
            el.innerHTML = 'repeat_one_on';
        } else if (this._repeatOne) {
            this._repeat = false;
            this._repeatOne = false;
            el.innerHTML = 'repeat';
        } else {
            this._repeat = true;
            this._repeatOne = false;
            el.innerHTML = 'repeat_on';
        }

        if (this._trackerPlayer && this._trackerPlayer?.currentPlayingNode === null) {
            this._audioPlayer.loop = this._repeatOne;
        } else {
            libopenmpt._openmpt_module_set_repeat_count(this._trackerNode.modulePtr, this._repeatOne ? -1 : 0);
        }

        this.emit('repeat', { all: this._repeat, one: this._repeat });
    }

    playPause(el, play = undefined) {
        try {
            let paused = false;
            if (this._trackerPlayer && this._trackerPlayer?.currentPlayingNode !== null) {
                if ((play == undefined || (play == true && this._trackerPlayer?.currentPlayingNode.paused))) {
                    this._trackerPlayer?.togglePause();
                }
                paused = !this._trackerPlayer?.currentPlayingNode.paused;
                if (!paused) {
                    el.innerHTML = 'play_arrow';
                } else {
                    el.innerHTML = 'pause';
                }
            } else {
                paused = this._audioPlayer.paused
                if (paused || play) {
                    this._audioPlayer.play();
                    el.innerHTML = 'pause';
                } else {
                    this._audioPlayer.pause();
                    el.innerHTML = 'play_arrow';
                }
            }

            if ("mediaSession" in navigator) {
                navigator.mediaSession.playbackState = paused ? "playing" : "paused";
            }

            this._paused = paused;
            this.emit('playChanged', !paused);
        } catch (err) {
            this.#playingContainer.innerHTML = this.renderError('An error occured.', err);
        }
    }

    shuffle(el) {
        if (this._shuffle) {
            this._shuffle = false;
            el.innerHTML = 'shuffle'
        } else {
            this._shuffle = true;
            el.innerHTML = 'shuffle_on'
        }

        this.emit('shuffle', this._shuffle);
    }

    prevTrack() {
        let el = this.#playlistContainer.querySelector('.playlist-item.playing')
        let tracks = this.#playlistContainer.querySelectorAll('.playlist-item')
        if (this.getProgress() > 3) {
            this.progressChanged({ value: 0 });
            return;
        } else if (this._shuffle) {
            this.playTrack(tracks.item(getRandomArbitrary(0, tracks.length - 1)));
            return;
        }
        let trackVal = Object.values(tracks);
        let track = trackVal.find((val) => val.dataset.src === el.dataset.src);
        let trackIndex = trackVal.indexOf(track);
        this.playTrack(tracks.item(trackIndex - 1) ?? tracks.item(tracks.length - 1));
    }

    nextTrack() {
        let el = this.#playlistContainer.querySelector('.playlist-item.playing')
        let tracks = this.#playlistContainer.querySelectorAll('.playlist-item')
        if (this._repeatOne) {
            this.progressChanged({ value: 0 });
            return;
        } if (this._shuffle) {
            this.playTrack(tracks.item(getRandomArbitrary(0, tracks.length - 1)))
            return;
        }
        this._audioPlayer.pause();
        this._trackerPlayer?.stop();
        let trackVal = Object.values(tracks);
        let track = trackVal.find((val) => val.dataset.src === el.dataset.src);
        let trackIndex = trackVal.indexOf(track);
        if (trackIndex === tracks.length - 1 && !this._repeat && !this._repeatOne) {
            let playPause = this.#playingContainer.querySelector('#playpause');
            playPause.innerHTML = 'play_arrow'
        }
        this.playTrack(tracks.item(trackIndex + 1) ?? tracks.item(this._repeat ? 0 : trackIndex));
    }

    playTracker(buf) {
        if (!this._trackerPlayer) {
            console.error('Tracker deps not initialised');
            throw new Error('You must import the necessary dependencies for playing Tracker files. See https://github.com/jbcarreon123/jPlayer2?tab=readme-ov-file#tracker-files for more info.')
        }

        this._trackerPlayer?.stop();
        this._trackerNode = this._trackerPlayer?.createLibopenmptNode(buf, this._trackerPlayer?.config);
        if (!this._trackerNode) {
            return;
        }

        libopenmpt._openmpt_module_set_repeat_count(this._trackerNode.modulePtr, this._repeatOne ? -1 : 0);
        libopenmpt._openmpt_module_set_render_param(this._trackerNode.modulePtr, OPENMPT_MODULE_RENDER_STEREOSEPARATION_PERCENT, this._trackerPlayer?.config.stereoSeparation);
        libopenmpt._openmpt_module_set_render_param(this._trackerNode.modulePtr, OPENMPT_MODULE_RENDER_INTERPOLATIONFILTER_LENGTH, this._trackerPlayer?.config.interpolationFilter);

        this._trackerPlayer.currentPlayingNode = this._trackerNode;
        this._trackerNode.connect(this._trackerAudioContext.destination);
    }

    async playTrack(el) {
        try {
            let isPlaying = Object.values(this.#playingContainer.querySelectorAll('button.ms')).find((el) => el.innerHTML === 'pause');
            this.#playingContainer.innerHTML = this.renderPlayingCard(!isPlaying);
            this.initListeners();

            let track = this._fetchedPlaylist.find(({ src }) => src === el.dataset.src);
            let source = this._playlistSources.find((data) => data.src === el.dataset.src);
            let data = await this.processMetadata(source, track, this._fetchedPlaylist.indexOf(track), el.dataset.art);

            let playPause = this.#playingContainer.querySelector('#playpause');

            if (el.dataset.mode === 'tracker') {
                if (!this._trackerPlayer) {
                    console.error('Tracker deps not initialised');
                    throw new Error('You must import the necessary dependencies for playing Tracker files. See https://github.com/jbcarreon123/jPlayer2?tab=readme-ov-file#tracker-files for more info.')
                }

                this._audioPlayer.pause();
                this._trackerPlayer?.stop();
                this._trackerPlayer?.load(el.dataset.src, (out) => {
                    clearInterval(this._trackerInterval);
                    this.playTracker(out);
                    this._trackerInterval = setInterval(() => this.progress(), 50);
                    this._trackerPlayer?.currentPlayingNode.addEventListener('timeupdate', () => this.progress());
                    if (!isPlaying)
                        this.playPause(playPause);
                    else {
                        navigator.mediaSession.playbackState = 'playing';
                        let playPause = this.#playingContainer.querySelector('#playpause');
                        playPause.innerHTML = 'pause'
                    }
                });
            } else {

                clearInterval(this._trackerInterval);
                this._trackerPlayer?.stop();
                this._audioPlayer.src = el.dataset.src;
                this._audioPlayer.load();
                this._audioPlayer.loop = this._repeatOne;
                if (isPlaying)
                    this.playPause(playPause);
            }

            this.#playingContainer.querySelector('.album-art-container img').src = el.dataset.art;
            this.#playingContainer.querySelector('.card-background img').src = el.dataset.art;

            this.#playingContainer.querySelector('.track-info h1').textContent = data.title;
            this.#playingContainer.querySelector('.track-info p').innerHTML = `<p><span>${data.artist}</span> <span ${data.tracker ? 'data-tracker="true"' : ''}>${data.album != '' ? (!data.tracker ? '- ' : ' ') + data.album : ''}</span></p>`;

            this.#playlistContainer.querySelectorAll('.playlist-item').forEach((el) => {
                el.classList.remove('playing');
            })
            el.classList.add('playing');

            if ("mediaSession" in navigator) {
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: data.title,
                    artist: data.artist,
                    album: data.album,
                    artwork: [{
                        src: el.dataset.art,
                        sizes: '512x512',
                        type: getType(el.dataset.art)
                    }]
                });

                navigator.mediaSession.setActionHandler('nexttrack', () => this.nextTrack());
                navigator.mediaSession.setActionHandler('previoustrack', () => this.prevTrack());
                navigator.mediaSession.setActionHandler('play', () => this.playPause(playPause));
                navigator.mediaSession.setActionHandler('pause', () => this.playPause(playPause));
                navigator.mediaSession.setActionHandler('seekto', (secs) => this.seek(secs.seekTime));
            }

            this.emit('playing', {
                ...data,
                art: el.dataset.art
            });
        } catch (err) {
            console.error(err);
            this.#playingContainer.innerHTML = this.renderError('An error occured.', err);
        }
    }

    async fetchTrackData(el) {
        try {
            let loading = this._shadow.querySelector('#jplayer--loading-status');
            if (loading) loading.innerHTML += `<br />Fetching: ${el.src}`;
            const response = await fetch(el.src);
            if (!response.ok) {
                console.error(`Failed to fetch: ${el.src} - ${response.status}`);
                return { ok: false };
            }
            const buffer = await response.arrayBuffer();
            return { ok: true, src: el.src, buffer };
        } catch (error) {
            console.error("Error fetching track:", error);
            return { ok: false };
        }
    }

    async processMetadata(el, fetchedData, index, art = undefined) {
        if (!fetchedData) return;
        if (fetchedData.ok) {
            let loading = this._shadow.querySelector('#jplayer--loading-status');
            if (loading) loading.innerHTML += `<br />Processing metadata: ${el.src}`;
            try {
                const metadata = readMetadata(fetchedData.buffer);
                const trackInfo = {
                    src: el.src,
                    title: metadata.info.trackTitle ?? el.dataset.title ?? "Unknown title",
                    artist: metadata.info.trackAuthor ?? el.dataset.artist ?? "Unknown artist",
                    album: metadata.info.albumTitle ?? metadata.info.trackTitle ?? '',
                    art: art ?? metadata.info.mainPicture?.image ?? this._fallback,
                    raw: metadata
                };

                metadata.info.mainPicture.register(() => {
                    if (metadata.info.mainPicture?.image) {
                        trackInfo.art = art ?? metadata.info.mainPicture.image;
                    } else if (el.dataset.art) {
                        trackInfo.art = el.dataset.art;
                    } else {
                        trackInfo.art = this._fallback;
                    }

                    trackInfo['html'] = this.renderPlaylistItem(trackInfo, index === 0);

                    this._playlist[index] = trackInfo;
                })

                if (metadata.info.mainPicture?.image) {
                    trackInfo.art = art ?? metadata.info.mainPicture.image;
                } else if (el.dataset.art) {
                    trackInfo.art = el.dataset.art;
                } else {
                    trackInfo.art = this._fallback;
                }

                trackInfo['html'] = this.renderPlaylistItem(trackInfo, index === 0);
                return trackInfo;
            } catch (error) {
                return await this.processTrackerMetadata(el, fetchedData.buffer, index, error);
            }
        }
        return this.createDefaultTrackInfo(el, index);
    }

    async processTrackerMetadata(el, buffer, index, error) {
        if (this._trackerPlayer && this._doTrackerMetadata) {
            try {
                this._trackerPlayer?.play(buffer);
                const metadata = this._trackerPlayer?.metadata();
                const trackInfo = {
                    src: el.src,
                    title: el.dataset.title ?? metadata['title'] ?? "Unknown title",
                    artist: el.dataset.artist ?? metadata['artist'] ?? "Unknown artist",
                    album: el.dataset.album ?? metadata['type']?.toUpperCase() ?? '',
                    art: el.dataset.art ?? this._fallback,
                    tracker: !!metadata['type'],
                };
                trackInfo['html'] = this.renderPlaylistItem(trackInfo, index === 0, 'tracker');
                return trackInfo;
            } catch (trackerError) {
                console.warn("Error processing tracker metadata:", trackerError);
                return this.createDefaultTrackInfo(el, index);
            } finally {
                this._trackerPlayer?.stop();
            }
        } else {
            if (this._trackerPlayer) {
                return this.createDefaultTrackInfo(el, index, true);
            } else {
                console.error('Cannot load file', el.src, error);
                return undefined;
            }
        }
    }

    createDefaultTrackInfo(el, index, isTracker = false) {
        const parts = el.src.split('/');
        const title = el.dataset.title ?? decodeURIComponent(parts[parts.length - 1]);
        const artist = el.dataset.artist ?? "Unknown artist";
        const album = el.dataset.album ?? '';
        const art = el.dataset.art ?? this._fallback;
        const trackInfo = { src: el.src, title, artist, album, art, tracker: isTracker };
        trackInfo['html'] = this.renderPlaylistItem(trackInfo, index === 0, isTracker ? 'tracker' : undefined);
        return trackInfo;
    }

    async updatePlaylist() {
        if (this._playlist.length > 0) return;

        this._fallback = this.getAttribute('fallback');
        const cssUrl = this.getAttribute('css');
        this._solo = this.getAttribute('solo') !== null;
        this._doTrackerMetadata = this.getAttribute('do-tracker-metadata') !== null;
        this._playlistSources = Array.from(this.querySelectorAll('source'));

        const fetchedDataPromises = this._playlistSources.map((el) =>
            this.fetchTrackData(el)
                .catch(error => {
                    console.error(`Error fetching ${el.src}:`, error);
                    return { ok: false }; // Ensure a consistent failure object
                })
        );

        this._fetchedPlaylist = await Promise.all(fetchedDataPromises);

        const metadataPromises = this._playlistSources.map((el, index) =>
            this.processMetadata(el, this._fetchedPlaylist[index], index)
        );
        this._playlist = await Promise.all(metadataPromises);
        this._playlist = this._playlist.filter((s) => s);

        if (cssUrl) {
            try {
                const response = await fetch(cssUrl);
                if (response.ok) {
                    this._style = await response.text();
                } else {
                    console.warn(`Failed to fetch CSS: ${cssUrl} - ${response.status}`);
                    this._style = '';
                }
            } catch (error) {
                console.error("Error fetching CSS:", error);
                this._style = '';
            }
        } else {
            this._style = '';
        }

        setTimeout(() => {
            this.render();
            this.initListeners();
        }, 10);
    }
}

function arrayBufferToFile(arrayBuffer, fileName) {
    const blob = new Blob([arrayBuffer]);
    const file = new File([blob], fileName);
    return file;
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getType(base64String) {
    if (!base64String ?? typeof base64String !== 'string' ?? !base64String.startsWith('data:')) {
        return null;
    }
    const dataURIPart = base64String.substring(5, base64String.indexOf(';'));
    return dataURIPart;
}

/** @param {HTMLElement} el  */
function isOverflowing(el) {
    var curOverflow = getComputedStyle(el, 'overflow');
    if (!curOverflow || curOverflow === "visible")
        el.style.overflow = "hidden";
    var isOverflowing = el.clientWidth < el.scrollWidth;
    el.style.overflow = curOverflow;
    return isOverflowing;
}

function formatTime(seconds) {
    let s = Math.floor(seconds / 60).toString()
        + ":" + Math.floor(seconds % 60).toString().padStart(2, "0")
    return s === 'NaN:NaN' ? '0:00' : s;
}

/** @param {ArrayBuffer} buffer  */
function readMetadata(buffer) {
    var metadata = { info: {}, tags: [] };
    let dec = new TextDecoder("windows-1252");
    let dv = new DataView(buffer, 0);

    let textDecoders = [
        new TextDecoder("iso-8859-1"),
        {
            /** @param {ArrayBuffer} blob  */
            decode(blob) {
                let isBigEndian = new Uint8Array(blob.slice(0, 1))[0] == 254;
                return (new TextDecoder(isBigEndian ? "utf-16be" : "utf-16le")).decode(blob)
            }
        },
        new TextDecoder("utf-16le"),
        new TextDecoder("utf-8"),
    ]

    if (dec.decode(buffer.slice(0, 4)) == "OggS") {
        let offset = 0;
        let marray = [];
        for (let i = 0; i < 2; i++) {
            let position = dv.getUint32(offset + 6, true);

            let segsCount = dv.getUint8(offset + 26);

            let segs = new Uint8Array(buffer.slice(offset + 27, offset + 27 + segsCount));

            let size = 0;
            for (let a = 0; a < segs.length; a++) size += segs[a];

            offset += 27 + segsCount;
            let data = new Uint8Array(buffer.slice(offset, offset + size));
            offset += size;

            if (i == 1) {
                for (let a = 0; a < size; a++) {
                    marray.push(data[a]);
                }
            }

            if (position === 0xFFFFFFFF) i--;
        }

        let mbuffer = new Uint8Array(marray).buffer;
        let mdv = new DataView(mbuffer, 0);


        if (marray[0] == 3 && dec.decode(mbuffer.slice(1, 7)) == "vorbis") {
            let vendorLength = mdv.getUint32(7, true);
            let vendor = textDecoders[3].decode(mbuffer.slice(11, 11 + vendorLength));

            let p = 11 + vendorLength;
            let tagCounts = mdv.getUint32(p, true);
            p += 4;

            for (let i = 0; i < tagCounts; i++) {
                let tagLength = mdv.getUint32(p, true);
                let tag = textDecoders[3].decode(mbuffer.slice(p + 4, p + 4 + tagLength));
                p += 4 + tagLength;

                let sep = tag.indexOf('=');
                let key = tag.slice(0, sep).toUpperCase();
                let value = tag.slice(sep + 1);
                metadata.tags.push([key, value]);

                switch (key) {
                    case "TITLE":
                        metadata.info.trackTitle = value;
                        break;
                    case "ARTIST":
                        metadata.info.trackAuthor = metadata.info.trackAuthor ? metadata.info.trackAuthor + ", " + value : value;
                        break;
                    case "ALBUM":
                        metadata.info.albumTitle = value;
                        break;
                    case "METADATA_BLOCK_PICTURE":
                        let data = metadata.info.mainPicture = {
                            image: null,
                            callbacks: [],
                            load() {
                                for (let c of this.callbacks) c();
                            },
                            register(callback) {
                                if (this.image) callback();
                                this.callbacks.push(callback);
                            }
                        }
                        fetch("data:application/octet-stream;base64," + value)
                            .then(x => x.blob())
                            .then(blob => blob.arrayBuffer())
                            .then(buffer => {
                                let dv = new DataView(buffer);
                                let typeSize = dv.getUint32(4);
                                let type = textDecoders[3].decode(buffer.slice(8, 8 + typeSize));
                                let offset = 8 + typeSize;
                                let descSize = dv.getUint32(offset);
                                offset += 4 + descSize;
                                let size = dv.getUint32(offset + 16);
                                let blob = new Blob([buffer.slice(offset + 20, offset + 20 + size)], { type });
                                data.image = URL.createObjectURL(blob);
                                data.load();
                            });
                        break;
                }
            }
        }
    } else if (dec.decode(buffer.slice(0, 3)) == "ID3") {
        let totalLength = dv.getUint8(6) << 21 | dv.getUint8(7) << 14 | dv.getUint8(8) << 7 | dv.getUint8(9);
        let offset = 10;
        if (dv.getUint8(5) & 64) offset += dv.getUint32(10);
        let tagTF = {
            "TIT2": "trackTitle",
            "TPE1": "trackAuthor",
            "TALB": "albumTitle",
            "TPE2": "albumAuthor",
            "APIC": "mainPicture",
        }
        while (offset < totalLength) {
            let tag = dec.decode(buffer.slice(offset, offset + 4))
            let length = dv.getUint32(offset + 4);
            let data = buffer.slice(offset + 10, length + offset + 10)
            if (tag == "APIC") {
                let a = 1;
                let enc = dv.getUint8(offset + 10);
                let type = "";
                let byte = "";
                while ((byte = dv.getUint8(offset + 10 + a)) != 0) {
                    type += String.fromCharCode(byte);
                    a++;
                }
                if (type.includes("javascript")) throw new Error("Ehh?");
                a += 2;
                let b = [1, 2, 2, 1][enc];
                let aa = a;
                while ((b == 1 ? dv.getUint8(offset + 10 + a) : dv.getUint16(offset + 10 + a)) != 0) a += b;
                let decbe = textDecoders[enc];
                let desc = decbe.decode(data.slice(aa, a));
                a += b;
                let blob = new Blob([data.slice(a, length)], { type });
                let reader = new FileReader();
                data = {
                    image: null,
                    callbacks: [],
                    load() {
                        for (let c of this.callbacks) c();
                    },
                    register(callback) {
                        if (this.image) callback();
                        this.callbacks.push(callback);
                    }
                }
                reader.onload = function (image) {
                    data.image = image.target.result;
                    data.load();
                };
                reader.readAsDataURL(blob);
            } else if (tag == "TXXX") {
                let enc = dv.getUint8(offset + 10);
                let decbe = textDecoders[enc];
                let keylen = 0;
                let b = [1, 2, 2, 1][enc];
                while ((b == 1 ? dv.getUint8(offset + 10 + keylen) : dv.getUint16(offset + 10 + keylen)) != 0) keylen += b;
                tag = decbe.decode(data.slice(1, keylen + 1)).replace(/^[\s\x00]+|[\s\x00]+$/gm, "");
                data = decbe.decode(data.slice(keylen + 2, length)).replace(/^[\s\x00]+|[\s\x00]+$/gm, "");
            } else if (tag.startsWith("T")) {
                let decbe = textDecoders[dv.getUint8(offset + 10)];
                data = decbe.decode(data.slice(1, length)).replace(/^[\s\x00]+|[\s\x00]+$/gm, "");
            }
            metadata.tags.push([tag, data]);
            if (tagTF[tag]) metadata.info[tagTF[tag]] = data;
            offset += length + 10;
        }
    }
    return metadata;
}

customElements.define("player-container", jPlayer);