// ==UserScript==
// @name         Open in PenguinPaint
// @namespace    https://penguinpaint.statichost.app
// @version      2025-01-24
// @description  Alt click any image to open it in PenguinPaint
// @author       pooiod7
// @match        https://*/*
// @icon         https://raw.githubusercontent.com/pooiod/Penguin-Paint/refs/heads/main/icons/favicon.png
// @grant        none
// ==/UserScript==

(function() {
    'use strict';


    if (window.location.hostname === 'studio.penguinmod.com') {
        let checks = 0;
        let clicks = 0;
        let interval = setInterval(() => {
            if (checks >= 1000) {
                clearInterval(interval);
                return;
            }

            let targetElement = document.querySelector('p.url_url_3Y61f');
            if (targetElement && (targetElement.textContent.includes('https://raw.githubusercontent.com/pooiod/Penguin'))) {
                let button = document.querySelector('button.security-manager-modal_allow-button_3tcXk');
                if (button) {
                    if (button.disabled) button.disabled = false;
                    button.click();
                    clicks++;

                    if (!document.body.contains(targetElement) || clicks >= 10) {
                        clearInterval(interval);
                    }
                }
            }
            checks++;
        }, 100);
    } else {
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
    }
})();
