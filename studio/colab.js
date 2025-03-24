if (!window.Paho) {
    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js';
    script.onload = function() {
        start();
    };
    document.head.appendChild(script);
} else {
    start();
}
