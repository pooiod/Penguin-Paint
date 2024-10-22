function addAltClickListener(img) {
    img.addEventListener('click', function (e) {
        if (e.altKey) {
            const imageUrl = img.src;
            window.open(`https://penguinpaint.pages.dev/?import=${encodeURIComponent(imageUrl)}`, '_blank');
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
