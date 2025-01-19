function addAltClickListener(img) {
    img.addEventListener('click', function (e) {
        if (e.altKey) {
            e.preventDefault();
            const imageUrl = img.src;
            window.open(`https://penguinpaint.statichost.app?import=${encodeURIComponent(imageUrl)}`, '_blank');
        }
    });
}

function checkForNewImages() {
    document.querySelectorAll('img:not([data-alt-listener])').forEach(img => {
        addAltClickListener(img);
        img.setAttribute('data-alt-listener', 'true');
    });
}

setInterval(checkForNewImages, 3000);
