const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PLAYER_STORAGE_KEY = 'User_Storage' 
// 
const playlist = $('.playlist')
const cd = $('.cd')
const WidthCd = cd.offsetWidth
const nameSong = $('header h2')
const thumbSong = $('.cd-thumb')
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const progress = $('#progress')
const audio = $('#audio')
const player = $('.player')
const repeatBtn = $('.btn-repeat')
const randomBtn = $('.btn-random')

let historySongIndex = 0
// 
const app = {
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    loadConfig: function() {
        // handler randomBtn + repeatBtn
        this.isRandom = this.config.isRandom
        this.isRandom === true ? randomBtn.classList.add('active') : randomBtn.classList.remove('active')
        this.isRepeat = this.config.isRepeat
        this.isRepeat === true ? repeatBtn.classList.add('active') : repeatBtn.classList.remove('active')

        // handler historySong
        this.currentIndex = this.config.currentIndex
    },
    currentIndex: 0,
    songs: [
        {
            title: 'Buồn lắm em ơi',
            singer: 'Trịnh Đình Quang',
            path: './access/music/y2mate.com - BUỒN LẮM EM ƠI  TRỊNH ĐÌNH QUANG Official MV 4K.mp3',
            img: './access/img/buonlamemoi_img.jpg' 
        },
        {
            title: 'Em giấu anh điều gì',
            singer: 'Trịnh Đình Quang',
            path: './access/music/y2mate.com - Trịnh Đình Quang  Em Giấu Anh Điều Gì  MV LYRICS.mp3',
            img: './access/img/emdauanhdieugi_img.jpg'
        },
        {
            title: 'Em là con thuyền cô đơn',
            singer: 'Thái Học',
            path: './access/music/y2mate.com - Em Là Con Thuyền Cô Đơn Andy Remix  Thái Học  Thuyền Không Bến Thuyền Mãi Lênh Đênh REMIX.mp3',
            img: './access/img/emlaconthuyencodon_img.jpg' 
        },
        {
            title: 'Kiếp này em gả cho anh',
            singer: 'Thái Học',
            path: './access/music/y2mate.com - KIẾP NÀY EM GẢ CHO ANH  THÁI HỌC OFFICIAL MUSIC VIDEO.mp3.webm',
            img: './access/img/kiepnayemgachoanh_img.jpg' 
        },
        {
            title: 'Mưa trong lòng',
            singer: 'Trịnh Đình Quang',
            path: './access/music/y2mate.com - Mưa Trong Lòng  Trịnh Đình Quang MV 4K  Nhạc trẻ hay 2016.mp3',
            img: './access/img/muatronglong_img.jpg' 
        },
        {
            title: 'Tình thương phu thê',
            singer: 'Thái Học',
            path: './access/music/y2mate.com - Tình Thương Phu Thê  Chí Hướng  Thái Học Cover  Nhạc Hot TIKTOK  cảm ơn em đã thương anh .mp3',
            img: './access/img/tinhthuongphuthe_img.jpg' 
        },
    ],
    // function render HTML playlist
    renderPlaylist: function() {
        let song = this.songs.map((song, index) => {
            return `<div class="song">
                        <div class="thumb" style="background-image: url(${song.img})">
                        </div>
                        <div class="body">
                        <h3 class="title">${song.title}</h3>
                        <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                        </div>
                        </div>`
        })
        playlist.innerHTML = song.join('')
    },
    // function render current Song on UI
    renderCurrentSong: function() {
        nameSong.textContent = this.currentSong.title
        thumbSong.style.backgroundImage = `url(${this.currentSong.img})`
        audio.src = this.currentSong.path
        // active song
        if($('.song.active') !== null) {
            $('.song.active').classList.remove('active')
        }
        $$('.song').forEach((song, index) => {
            if(index === this.currentIndex) {
                song.classList.add('active')
            }
        })
    },
    // save current song
    saveCurrentSong: function(i) {
        this.setConfig('currentIndex', i);
    },
    // function defineProperties
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', 
        {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    // function handler events
    handlerEvents: function() {
        let listenedSongs = [this.currentIndex]
        const _this = this
        let isPlaying = false
        // rotate cd when playing
        const cdRotate = cd.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 15000,
            iterations: Infinity
        })        
        cdRotate.pause()
        // handler cd when scroll
        document.onscroll = function() {
            let scroll = window.scrollY || document.documentElement.scrollTop
            let newWidthCd = WidthCd - scroll
            Object.assign(cd.style, {
                width: newWidthCd > 0 ? newWidthCd + 'px' : 0,
                opacity: newWidthCd / WidthCd 
            })
        }
        // handler when click play, pause
        playBtn.onclick = function() {
            isPlaying = !isPlaying
            _this.setConfig('isPlaying', isPlaying)
            player.classList.toggle("playing")
            
            if(isPlaying) {
                cdRotate.play()
                audio.play()
            } else {
                cdRotate.pause()
                audio.pause()
            }
        }
        // hear from the keyboard
        window.onkeydown = function(e) {
            switch(e.keyCode) {
                case 32:
                    setTimeout(function() {
                        playBtn.click()
                    }, 250);
                    break;
                case 37: 
                    setTimeout(function() {
                        prevBtn.click()
                    }, 250);
                    break;
                case 39: 
                    setTimeout(function() {
                        nextBtn.click()
                    }, 250);
                    break;
                }
        }
        // function play song
        function play() {
            if(!isPlaying) {
                isPlaying = true
            }
            if(!player.classList.contains("playing")) {
                player.classList.add("playing")
            }
            cdRotate.play()
            audio.play()
        }
        // function pause song
        function pause() {
            if(isPlaying) {
                isPlaying = false
            }
            if(player.classList.contains("playing")) {
                player.classList.remove("playing")
            }
            cdRotate.pause()
            audio.pause()
        }
        // handler when rewinding
        progress.onchange = function(e) {
            audio.currentTime = Math.floor(e.target.value * audio.duration / 100 || 0)
            _this.setConfig('currentTime', audio.currentTime)
            play()
        }
        // handle song tempo
        audio.ontimeupdate = function() {
            progress.setAttribute('value', Math.floor(audio.currentTime * 100 / audio.duration || 0))
            progress.value = Math.floor(audio.currentTime * 100 / audio.duration || 0)
            if(progress.value == 100) {
                endSongHandler()
            }
        }
        // function when active ransomBtn
        handlerActiveRandom = function() {
            if(listenedSongs.length > _this.songs.length - 1) {
                listenedSongs = []
            }
            let randomIndexSong 
            do {
                randomIndexSong = Math.floor(Math.random() * _this.songs.length)
            } while (_this.currentIndex == randomIndexSong)
            _this.currentIndex = randomIndexSong
            // push index song listened in to listenedSongs
            listenedSongs.push(randomIndexSong)

            // save history song
            _this.saveCurrentSong(_this.currentIndex)
        }
        // handler when click nextBtn, prevBtn
        nextBtn.onclick = function() {
            // handler next
            if(_this.currentIndex === _this.songs.length - 1) {
                _this.currentIndex = 0  
            } 
            // when active randomBtn
            else if(randomBtn.classList.contains("active")) {
                handlerActiveRandom()
            }
            else {
                ++_this.currentIndex
            }
            _this.renderCurrentSong();
            resetSongTempo()
            play()

            // save history song
            _this.saveCurrentSong(_this.currentIndex)
        }
        prevBtn.onclick = function() {
            // handler next
            if(_this.currentIndex === 0) {
                _this.currentIndex = _this.songs.length - 1;  
            }
            // when active randomBtn
            else if(randomBtn.classList.contains("active")) {
                handlerActiveRandom()
            }
            else {
                --_this.currentIndex
            }

            _this.renderCurrentSong();
            resetSongTempo()
            play()

            // save history song
            _this.saveCurrentSong(_this.currentIndex)
        }
        // toggler active repeatBtn, randomBtn 
        repeatBtn.onclick = function() {
            if(repeatBtn.classList.contains('active')) {
                isRepeat = false;
            } else {
                isRepeat = true;
            }
            _this.setConfig('isRepeat', isRepeat);
            repeatBtn.classList.toggle('active')

            // save history song
            _this.saveCurrentSong(_this.currentIndex)
    }
        randomBtn.onclick = function() {
            // isRandom = true;
            if(randomBtn.classList.contains('active')) {
                isRandom = false;
            } else {
                isRandom = true;
            }
            _this.setConfig('isRandom', isRandom);
            randomBtn.classList.toggle('active')

            // save history song
            _this.saveCurrentSong(_this.currentIndex)
    }
        // handler clicking song of playlist
        const songs = $$('.song')
        songs.forEach((song, index) => {
            song.onclick = function() {                
                _this.currentIndex = index;

                // save history song
                _this.saveCurrentSong(_this.currentIndex)

                _this.renderCurrentSong();
                resetSongTempo();
                play();
                // scrollTop
                (document.body && document.documentElement).scrollTop = 0
            }
        })
        // handler end song
        // let listenedSongs = [this.currentIndex]
        function endSongHandler() {
            // handler when active repeatBtn
            if(repeatBtn.classList.contains('active')) {
                resetSongTempo()
                play()
            }
            // handler when active randomBtn
            else if(randomBtn.classList.contains('active')) {
                handlerActiveRandom();

                _this.renderCurrentSong()
                resetSongTempo()
                play()

                 
            }
            // handler when default end song
            else {
                resetSongTempo()
                pause()
            }

            // save history song
            _this.saveCurrentSong(_this.currentIndex)
        }
        // reset song tempo
        resetSongTempo = () => progress.value = 0;
        
        _this.saveCurrentSong(historySongIndex)
    },

    start: function() {
        /**
         * all handler function will be called in here
         */
        this.loadConfig();
        
        this.renderPlaylist();
        
        this.defineProperties();
        
        this.handlerEvents();

        // this.saveCurrentSong()
        
        this.saveCurrentSong(historySongIndex);
        
        this.renderCurrentSong();
    }
}
app.start();
