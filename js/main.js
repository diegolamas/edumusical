var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'violet',
    progressColor: 'purple'
});

wavesurfer.load('http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3');

var drop_handler = function(e) {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
        wavesurfer.loadBlob(e.dataTransfer.files[0]);
    }
};

var dragover_handler = function(e) {
    e.preventDefault();
    console.log("OVER");
};

var add_region_green = function(sec) {
    wavesurfer.addRegion({
        start: sec, // time in seconds
        end: sec, // time in seconds
        color: 'hsla(100, 100%, 30%, 0.80)'
    });
}

var add_region_blue = function(sec) {
    wavesurfer.addRegion({
        start: sec, // time in seconds
        end: sec, // time in seconds
        color: 'hsla(223, 100%, 44%, 0.80)'
    });
}
