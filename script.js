let songs = [
    { title: 'Giorno Theme', author: 'JoJo Bizarre Adventure', source: 'songs/Giorno Theme.mp3', img: 'images/Giorno.jpg' },
    { title: 'USSR Anthem', author: 'Alexander Alexandrov', source: 'songs/National Anthem of USSR.mp3', img: 'images/Ussr.jpg' },
    { title: 'Mii Channel Theme', author: 'Nintendo Wii', source: 'songs/Mii Channel Theme.mp3', img: 'images/MiiTheme.jpg' },
    { title: 'Abertura Phineas e Ferb', author: 'Phineas e Ferb', source: 'songs/Abertura Phineas e Ferb.mp3', img: 'images/PhineasFerb.jpg' },
    { title: 'Rick Roll', author: 'Rick Astley', source: 'songs/Never Gonna Give You Up.mp3', img: 'images/RickRoll.jpg' }
];

let shuffleHistory = [];

// START

// music
let song = document.querySelector('audio');

let songIndex = 0;
// image
let image = document.querySelector('img');
// song name and author
let description = document.querySelector('.description');
let songName = description.querySelector('h2');
let nameAuthor = description.querySelector('i');
// progress bar
let duration = document.querySelector('.duration');
let barra = duration.querySelector('.bar');
let progressBar = barra.querySelector('.progressBar');
// time
let time = document.querySelector('.time');
let currentTime = time.querySelector('.start');
let songTime = time.querySelector('.end');
// buttons
let leftButtons = document.querySelector('.leftButtons');
let buttonPause = leftButtons.querySelector('.button-pause');
let buttonPlay = leftButtons.querySelector('.button-play');
let previous = leftButtons.querySelector('.previous');
let next = leftButtons.querySelector('.next');
// repeat and shuffle
let rightButtons = document.querySelector('.rightButtons');
let buttonRepeat = rightButtons.querySelector('.button-repeat');
let buttonShuffle = rightButtons.querySelector('.button-shuffle');

let shuffle = false;
// volume
let soundZone = document.querySelector('.soundZone');
let soundMute = soundZone.querySelector('.soundMute');
let soundLow = soundZone.querySelector('.soundLow');
let soundHigh = soundZone.querySelector('.soundHigh');
let volumeSlider = soundZone.querySelector('.volumeSlider');


loadSong(songIndex);


// EVENTS

//update progress bar as song plays
song.addEventListener('timeupdate', updateBar);

//click on progress bar to change song time
barra.addEventListener('click', (e) => {
    let barraWidth = barra.offsetWidth;
    let clickX = e.offsetX;
    let duration = song.duration;

    song.currentTime = (clickX / barraWidth) * duration;

    updateBar();
    playSong();
});

//click play or pause button
buttonPlay.addEventListener('click', playSong);
buttonPause.addEventListener('click', pauseSong);

//go to next and previous song with buttons
previous.addEventListener('click', goToPreviousSong);
next.addEventListener('click', goToNextSong);

//repeat and shuffle
buttonRepeat.addEventListener('click', repeatSong);
buttonShuffle.addEventListener('click', shuffleSong);

//if song ends, go to next song
song.addEventListener('ended', goToNextSong);

//change volume with slider
volumeSlider.addEventListener('input', setVolume);

//change volume icon
soundHigh.addEventListener('click', muteVolume);
soundLow.addEventListener('click', muteVolume);
soundMute.addEventListener('click', muteVolume);

//mouse wheel to change volume
volumeSlider.addEventListener("wheel", (e) => {
    if (e.deltaY < 0) {
        volumeSlider.valueAsNumber += 10;
    } else {
        volumeSlider.value -= 10;
    }
    setVolume();
})


// FUNCTIONS

//loads song
function loadSong(songIndex) {
    song.setAttribute('src', songs[songIndex].source);

    song.addEventListener('loadeddata', () => {
        image.src = songs[songIndex].img;
        songName.textContent = songs[songIndex].title;
        nameAuthor.textContent = songs[songIndex].author;

        songTime.textContent = secondsMinutes(Math.floor(song.duration));
        progressBar.style.width = 0;
    });
}

//plays and pauses song and changes icons
function playSong() {
    song.play();
    buttonPlay.style.display = 'none';
    buttonPause.style.display = 'block';
}
function pauseSong() {
    song.pause();
    buttonPlay.style.display = 'block';
    buttonPause.style.display = 'none';
}

//got to previous song
function goToPreviousSong() {
    songIndex--;

    if (shuffle == true && shuffleHistory.length > 0) {
        songIndex = shuffleHistory.pop();
    }
    else if (songIndex < 0) {
        songIndex = songs.length - 1;
    }
    loadSong(songIndex);
    playSong();
}

//go to next song and check if shuffle is on
function goToNextSong() {

    shuffleHistory.push(songIndex);

    songIndex++;

    if (songIndex > songs.length - 1) {
        songIndex = 0;
    }

    shuffleCheck();

    loadSong(songIndex);
    playSong();
}

//change repeat icon color and status
function repeatSong() {
    if (song.loop == false) {
        song.loop = true;
        buttonRepeat.style.color = '#1db954';
    } else {
        song.loop = false;
        buttonRepeat.style.color = '#eee';
    }
}

//change shuffle icon color and status
function shuffleSong() {
    if (shuffle == false) {
        shuffle = true;
        buttonShuffle.style.color = '#1db954';
    } else {
        shuffle = false;
        buttonShuffle.style.color = '#eee';
    }
}

//check if shuffle is on and change songIndex
function shuffleCheck() {
    if (shuffle == true) {

        let tempSong = songIndex;

        do {
            tempSong = Math.floor(Math.random() * songs.length);
        }
        while (tempSong == shuffleHistory.at(-1));

        songIndex = tempSong;
    }


}

//turns seconds into minutes
function secondsMinutes(seconds) {
    let fieldMinutes = Math.floor(seconds / 60);
    let fieldSeconds = seconds % 60;

    if (fieldSeconds < 10) {
        fieldSeconds = '0' + fieldSeconds;
    }
    return `${fieldMinutes}:${fieldSeconds}`;
}

//update progress bar and time
function updateBar() {
    progressBar.style.width = Math.floor((song.currentTime / song.duration) * 100) + '%';
    currentTime.textContent = secondsMinutes(Math.floor(song.currentTime));
}

//changes volume and icon
function setVolume() {
    song.volume = volumeSlider.value / 100;
    changeVolumeIcon();
}

//mute volume and change icon
function muteVolume() {
    if (song.volume == 0) {
        song.volume = volumeSlider.value / 100;
        changeVolumeIcon();
    } else {
        song.volume = 0;
        changeVolumeIcon();
    }
}

//change volume icon
function changeVolumeIcon() {
    if (song.volume == 0) {
        soundLow.style.display = 'none';
        soundHigh.style.display = 'none';
        soundMute.style.display = 'block';
    } else if (song.volume < 0.5) {
        soundLow.style.display = 'block';
        soundHigh.style.display = 'none';
        soundMute.style.display = 'none';
    } else {
        soundLow.style.display = 'none';
        soundHigh.style.display = 'block';
        soundMute.style.display = 'none';
    }
}

