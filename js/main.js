var nombre = "";

var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: 'violet',
    progressColor: 'purple',
    height: 400,
    hideScrollbar: true,
    cursorWidth: 3
});

wavesurfer.load('http://ia902606.us.archive.org/35/items/shortpoetry_047_librivox/song_cjrg_teasdale_64kb.mp3');

// song drop handler
var drop_handler = function(e) {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
        nombre = e.dataTransfer.files[0].name;
        document.getElementById('header').innerText = nombre.substring(0, nombre.length - 4);
        wavesurfer.loadBlob(e.dataTransfer.files[0]);
    }
};
var dragover_handler = function(e) {
    e.preventDefault();
};

// add
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

var add_region_red = function(sec) {
    wavesurfer.addRegion({
        start: sec, // time in seconds
        end: sec, // time in seconds
        color: 'hsla(360, 100%, 44%, 0.80)'
    });
}

var export_data = function() {
    wavesurfer.getRegions(nombre);
}

// import txt json
var load_data = function(input) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(input.files[0]);

}
var onReaderLoad = function(event) {
    wavesurfer.clearRegions();
    var obj = JSON.parse(event.target.result);
    obj.forEach(function(element) {
        wavesurfer.addRegion({
           start: element.start,
           end: element.start,
           color: element.color
        });
    });
}

// zoom handler
var slider = document.querySelector('#slider');
slider.oninput = function () {
    var zoomLevel = Number(slider.value);
    wavesurfer.zoom(zoomLevel);
};

// add with keys
var keypress_handler = function(e, sec) {
    switch (e.keyCode) {
        case 32: // space
            wavesurfer.playPause(); break;
        case 97: // a
            add_region_green(sec); break;
        case 115: // s
            add_region_blue(sec); break;
        case 100: // d
            add_region_red(sec); break;
        default:
            break;
    }
}

// (de)activates delete tool
var delete_tool = function() {
    document.querySelector('.wavesurfer-region').onclick = function (element) {console.log("o"); element.remove();}
}
