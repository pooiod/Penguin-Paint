var newtitle = "Penguin Paint";
document.title = newtitle;

// Fun fact: you can load into penguinpaint on penguinmod by loading it as an unsandboxed extension (no addon support)

var sidebarcontext = [
    {
        label: "export all",
        action: function() {
            function loadScript(url) {
                return new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = url;
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
            }
            
            async function loadJSZip() {
                if (typeof JSZip === 'undefined') {
                    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
                }
                if (typeof saveAs === 'undefined') {
                    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js');
                }
            }
            
            async function exportSpritesToZip() {
                await loadJSZip();
            
                var spr = Scratch.vm.runtime.getEditingTarget();
                var images = spr.sprite.costumes_;
                var zip = new JSZip();
            
                for (let index = 0; index < images.length; index++) {
                    let costume = images[index];
                    console.log(costume);
                    let imgname = costume.name;
            
                    if (costume.asset.data) {
                        let imageData = costume.asset.data;
                        
                        let mimeType = '';
                        let fileExtension = '';
            
                        switch (costume.asset.dataFormat) {
                            case 'png':
                                mimeType = 'image/png';
                                fileExtension = 'png';
                                break;
                            case 'svg':
                                mimeType = 'image/svg+xml';
                                fileExtension = 'svg';
                                break;
                            case 'jpeg': case 'jpg':
                                mimeType = 'image/jpeg';
                                fileExtension = 'jpg';
                                break;
                            case 'gif':
                                mimeType = 'image/gif';
                                fileExtension = 'gif';
                                break;
                            default:
                                alert(`Unsupported image format: ${costume.asset.dataFormat}`);
                                continue;
                        }

                        let blob = new Blob([imageData], { type: mimeType });
            
                        let fileName = `${imgname || "img "+(index+1)}.${fileExtension}`;
            
                        zip.file(fileName, blob);
                    }
                }
            
                zip.generateAsync({ type: "blob" })
                    .then(function (content) {
                        saveAs(content, "export.zip");
                    });
            }
            
            exportSpritesToZip();
        }
    }
];

var corsdomains = [
    "penguinpaint.pages.dev",
    "yeetyourfiles.lol".
    "raw.githubusercontent.com",
    "api.allorigins.win"
];

function isCorsDomain(url) {
    var domain = new URL(url).hostname;
    return corsdomains.includes(domain);
}

// functions for addons
window.stageWidth = 480;
window.stageHeight = 360;

window.fatalError = function(err) {
    err = err || "Error: unknown error"
    var error = `<b>Penguin Paint had an unexpected fatal error, and could not recover</b>
    <br>${err}<br><br>
    <button style="color:black;" onclick="window.location.href = 'https://penguinpaint.pages.dev/addons'">Open Addons</button>`;
    document.body.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background-color:#fff;font-size:24px;color:#00a6d9;">${error}</div>`;
}

window.setSize = function(width, height) {
    runWithScratch(`Scratch.vm.setStageSize(${width/2}, ${height/2})`);
    window.stageWidth = width;
    window.stageHeight = height;
}

window.fitToCanvas = async function(url) {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    return new Promise((resolve) => {
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            if (img.width <= window.stageWidth && img.height <= window.stageHeight) {
                canvas.width = img.width;
                canvas.height = img.height;
            } else {
                const aspectRatio = img.width / img.height;

                if (window.stageWidth / window.stageHeight > aspectRatio) {
                    canvas.height = window.stageHeight;
                    canvas.width = window.stageHeight * aspectRatio;
                } else {
                    canvas.width = window.stageWidth;
                    canvas.height = window.stageWidth / aspectRatio;
                }
            }

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const resizedImage = canvas.toDataURL("image/png");
            resolve(resizedImage);
        };

        // img.onerror = () => {
        //     resolve(url);
        // };

        img.src = url;
    });
}

window.importImage = function(name, url) {
    try {
        fetch(url)
        .then(response => response.text())
        .then(data => {
            const isSVG = data.trim().startsWith("<svg");
            if (isSVG) {
                window.addImage(name, url, true);
            } else {
                window.fitToCanvas(url).then((url) => {
                    window.addImage(name, url);
                });
            }
        });            
    } catch(err) {
        addImage("error1", "https://dummyimage.com/" + window.stageWidth + "x" + window.stageHeight + "/fff/000&text=Error generating image: " + err, false);
    }
}

window.addImage = function(name, url, editable) {
    runWithScratch(`
        function importPNG(TEXT, NAME) {
          fetch(TEXT)
            .then((r) => r.arrayBuffer())
            .then((arrayBuffer) => {
              const storage = vm.runtime.storage;
              vm.addCostume(NAME + ".PNG", {
                name: NAME,
                asset: new storage.Asset(
                  storage.AssetType.ImageBitmap,
                  null,
                  storage.DataFormat.PNG,
                  new Uint8Array(arrayBuffer),
                  true
                ),
              });
            });
        }
        function importSVG(TEXT, NAME) {
            fetch(TEXT)
            .then((r) => r.arrayBuffer())
            .then((arrayBuffer) => {
                const storage = vm.runtime.storage;
                const asset = new storage.Asset(
                storage.AssetType.ImageVector,
                null,
                storage.DataFormat.SVG,
                new Uint8Array(arrayBuffer),
                true
                );
                const newCostumeObject = {
                md5: asset.assetId + '.' + asset.dataFormat,
                asset: asset,
                name: NAME
                };
                vm.addCostume(newCostumeObject.md5, newCostumeObject);
            });
        }
        if (${editable?true:false}) {
            importSVG(decodeURI(\`${encodeURI(url)}\`), decodeURI(\`${encodeURI(name)}\`));
        } else {
            importPNG(decodeURI(\`${encodeURI(url)}\`), decodeURI(\`${encodeURI(name)}\`));
        }
    `);
}

window.runWithScratch = function(js) {
    document.querySelector('#react-tabs-1 > div.gui_extension-button-container_b4rCs.box_box_2jjDp > button').click();
    (document.querySelector('body > div.ReactModalPortal > div > div > div > div.library_library-content-wrapper_1FTPT > div.library_library-filter-bar_1xjYC > div:nth-child(3) > span') || document.querySelector("body > div.ReactModalPortal > div > div > div > div.library_library-scroll-grid_1jyXm.library_withFilterBar_26Opm > div:nth-child(14)")).click();
    document.querySelector('body > div.ReactModalPortal > div > div > div > div.custom-extension-modal_body_2iQF3.box_box_2jjDp > div.custom-extension-modal_type-selector-container_2Fag3 > div:nth-child(3)').click();

    let input = document.querySelector('body > div.ReactModalPortal > div > div > div > div.custom-extension-modal_body_2iQF3.box_box_2jjDp > textarea');

    let lastValue = input.value;

    var random = "internalextruncode" + Math.round(Math.random() * 999999);
    input.value = `(function (Scratch) { "use strict";
        ${js}
// super hacky fix
        class ${random} {
            getInfo() {
            return {
                id: '${random}',
                name: '${random}',
                blocks: []
            };
            }
        }
        Scratch.extensions.register(new ${random}());
    })(Scratch);`;

    let event = new Event('input', { bubbles: true });

    event.simulated = true;
    let tracker = input._valueTracker;

    if (tracker) {
        tracker.setValue(lastValue);
    }

    input.dispatchEvent(event);

    document.querySelector('body > div.ReactModalPortal > div > div > div > div.custom-extension-modal_body_2iQF3.box_box_2jjDp > label.custom-extension-modal_unsandboxed-container_8juVd > input').click();

    const clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true
    });
    document.querySelector('body > div.ReactModalPortal > div > div > div > div.custom-extension-modal_body_2iQF3.box_box_2jjDp > div.custom-extension-modal_button-row_3dv8g > button').dispatchEvent(clickEvent);
}

window.addImageButton = function(image, callback) {
    const target = document.querySelector('#react-tabs-3 > div > div.selector_wrapper_8_BHs.box_box_2jjDp > div.selector_new-buttons_2qHDd.box_box_2jjDp > div > div.action-menu_more-buttons-outer_3J9yZ > div');
    
    const newDiv = document.createElement('div');
    const button = document.createElement('button');
    // button.setAttribute('aria-label', tooltip);
    button.className = 'action-menu_button_1qbot action-menu_more-button_1fMGZ';
    // button.setAttribute('data-tip', tooltip);
    button.innerHTML = `<img class="action-menu_more-icon_TJUQ7" draggable="false" src="${image}">`;

    // const tooltipDiv = document.createElement('div');
    // tooltipDiv.className = '__react_component_tooltip action-menu_tooltip_3Bkh5';
    // tooltipDiv.style.display = 'none'; // Start hidden
    // tooltipDiv.textContent = tooltip;

    // button.addEventListener('mouseenter', () => {
    //     tooltipDiv.style.display = 'block';
    //     tooltipDiv.style.left = '58px'; // Set left position
    //     tooltipDiv.style.top = `${button.getBoundingClientRect().bottom + window.scrollY}px`; // Set top position below the button
    // });

    // button.addEventListener('mouseleave', () => {
    //     tooltipDiv.style.display = 'none';
    // });

    button.addEventListener('click', callback);

    newDiv.appendChild(button);
    // newDiv.appendChild(tooltipDiv);
    target.appendChild(newDiv);
}


// internal mod code
function extrabuttons() { document.title = newtitle;
    var targetElement = document.querySelector('#react-tabs-3 > div > div.asset-panel_detail-area_2KQhH.box_box_2jjDp > div > div.paint-editor_top-align-row_25164 > div.paint-editor_controls-container_1Rqwy > div.paint-editor_canvas-controls_16wq3 > span');

    document.querySelector("#app > div").style.minWidth = "750px";

    const style = document.createElement('style');
    style.textContent = `
        * {
            scrollbar-color: #fff #d9e3f2;
        }
        *::-webkit-scrollbar-track {
            background: #d9e3f2;
        }
        *::-webkit-scrollbar-thumb {
            background-color: #fff;
        }
        *::-webkit-scrollbar-thumb:hover {
            background-color: #eaeaea;
        }
      .input_input-form_1Y0wX.tw-color-readout_readout_3RxI3 {
        width: 50px !important;
      }
    `;
    document.head.appendChild(style);    

    // const detailArea = document.querySelector('#react-tabs-3 > div > div.asset-panel_detail-area_2KQhH.box_box_2jjDp');
    // const selectorWrapper = document.querySelector('#react-tabs-3 > div > div.selector_wrapper_8_BHs.box_box_2jjDp');
    
    // detailArea.addEventListener('click', (event) => {
    //     if (event.clientX <= detailArea.getBoundingClientRect().left + 10) {
    //         selectorWrapper.style.display ? selectorWrapper.removeAttribute('style') : selectorWrapper.style.display = 'none';
    //     }
    // });    

    if (document.getElementById("addonsbutton")) return;
    window.postMessage("button reload", "*");

    var buttonHTML = '<button style="background: #00c3ff; color: #fff; border: none; border-radius: 5px; padding: 10px;" id="addonsbutton" class="settings_button_2ovv0"><b>Open addons</b></button>';

    if (targetElement) {
        targetElement.insertAdjacentHTML('afterend', buttonHTML);

        var button = document.querySelector('.settings_button_2ovv0');

        if (window.location.hostname === "studio.penguinmod.com") {
            document.getElementById("addonsbutton").innerHTML = "<b>Change addon settings</b>";
            button.addEventListener('click', function() {
                window.location.href = "https://penguinpaint.pages.dev?addons=true";
            });
        } else {
            button.addEventListener('click', function() {
                window.open("https://penguinpaint.pages.dev/addons", "_blank", "width=520,height=700,left=" + (screen.width / 2 - 250) + ",top=" + (screen.height / 2 - 350));
            });
        }

        buttonHTML = '<button class="settings_button_2ovv0 buttonsize" style="background: #00c3ff; color: #fff; border: none; border-radius: 5px; padding: 10px;"><b>Set canvas size</b></button>';
        targetElement.insertAdjacentHTML('afterend', buttonHTML);

        button = document.querySelector('.buttonsize');
        button.addEventListener('click', function() {
            // Create overlay
            const overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'rgba(0, 195, 255, 0.7)';
            overlay.style.zIndex = '999';
            
            // Create modal
            const wrapper = document.createElement('div');
            wrapper.style.position = 'absolute';
            wrapper.style.top = '50%';
            wrapper.style.left = '50%';
            wrapper.style.transform = 'translate(-50%, -50%)';
            wrapper.style.border = '4px solid rgba(255, 255, 255, 0.25)';
            wrapper.style.borderRadius = '13px';
            wrapper.style.padding = '0px';
            
            const modal = document.createElement('div');
            modal.style.backgroundColor = '#fff';
            modal.style.padding = '30px';
            modal.style.borderRadius = '10px';
            modal.style.width = '300px';
            modal.style.textAlign = 'center';
            
            wrapper.appendChild(modal);
            
            const title = document.createElement('h2');
            title.textContent = 'Select Canvas Size';
            title.style.marginBottom = '20px';
            title.style.color = '#333';
            modal.appendChild(title);

            const widthInput = document.createElement('input');
            widthInput.type = 'number';
            widthInput.placeholder = 'Width (px)';
            widthInput.style.margin = '10px 0';
            widthInput.style.padding = '10px';
            widthInput.style.width = '100%';
            widthInput.style.border = '1px solid #ccc';
            widthInput.style.borderRadius = '5px';
            modal.appendChild(widthInput);

            const heightInput = document.createElement('input');
            heightInput.type = 'number';
            heightInput.placeholder = 'Height (px)';
            heightInput.style.margin = '10px 0';
            heightInput.style.padding = '10px';
            heightInput.style.width = '100%';
            heightInput.style.border = '1px solid #ccc';
            heightInput.style.borderRadius = '5px';
            modal.appendChild(heightInput);

            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'space-between';
            buttonContainer.style.marginTop = '20px';

            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.padding = '10px 15px';
            cancelButton.style.backgroundColor = '#dc3545';
            cancelButton.style.color = '#fff';
            cancelButton.style.border = 'none';
            cancelButton.style.cursor = 'pointer';
            cancelButton.style.borderRadius = '5px';
            cancelButton.style.transition = 'background-color 0.3s';

            cancelButton.addEventListener('mouseenter', () => {
                cancelButton.style.backgroundColor = '#c82333';
            });
            cancelButton.addEventListener('mouseleave', () => {
                cancelButton.style.backgroundColor = '#dc3545';
            });
            buttonContainer.appendChild(cancelButton);

            const confirmButton = document.createElement('button');
            confirmButton.textContent = 'Confirm';
            confirmButton.style.padding = '10px 15px';
            confirmButton.style.backgroundColor = '#28a745';
            confirmButton.style.color = '#fff';
            confirmButton.style.border = 'none';
            confirmButton.style.cursor = 'pointer';
            confirmButton.style.borderRadius = '5px';
            confirmButton.style.transition = 'background-color 0.3s';
            
            confirmButton.addEventListener('mouseenter', () => {
                confirmButton.style.backgroundColor = '#218838';
            });
            confirmButton.addEventListener('mouseleave', () => {
                confirmButton.style.backgroundColor = '#28a745';
            });
            buttonContainer.appendChild(confirmButton);

            modal.appendChild(buttonContainer);
            overlay.appendChild(wrapper);
            document.body.appendChild(overlay);

            // Event listeners for buttons
            confirmButton.addEventListener('click', () => {
                const width = parseInt(widthInput.value, 10);
                const height = parseInt(heightInput.value, 10);
                if (!isNaN(width) && !isNaN(height) && width > 0 && height > 0) {
                    setSize(width, height);
                    document.body.removeChild(overlay);
                } else {
                    alert('Please enter valid dimensions!');
                }
            });

            cancelButton.addEventListener('click', () => {
                document.body.removeChild(overlay);
            });
        });
    }
}

function openPaint() {
    // if (document.title.split(" - ")[1]) {
    //     document.title = document.title.split(" - ")[0] + newtitle;
    // }
    document.title = newtitle;

    document.querySelector('#react-tabs-2').click();
    setTimeout(() => {
        document.querySelector('#react-tabs-2').click();
        document.title = newtitle;

        var element = document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp');
        element.style.position = 'fixed';
        element.style.display = 'block';
        element.style.top = '-100px';
        
        element = document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp > div.menu-bar_main-menu_3wjWH > div.menu-bar_file-group_1_CHX > div:nth-child(2)');
        element.style.display = 'block';
        element.style.position = 'fixed';
        element.style.top = '0';
        element.style.right = '0';
        element.style.zIndex = '9999999999999999999999999999999999999999999';
        // element.style.backgroundColor = 'black';
        element.style.borderBottomLeftRadius = '15px';
        element.style.width = "30px";
        element.style.height = "30px";
    }, 3000); 

    var styleElement = document.createElement('style');
    styleElement.type = 'text/css';
    styleElement.appendChild(document.createTextNode('.sa-stage-hidden-outer .scratchEyedropper{display:none}.sa-stage-hidden [class*="blocks_blocks_"] .injectionDiv,.sa-stage-hidden [class*="asset-panel_wrapper_"],.sa-stage-hidden [class*="backpack_backpack-header_"]{border-radius:0}.sa-stage-hidden [class*="gui_flex-wrapper_"] [class*="gui_stage-and-target-wrapper_"],.sa-stage-hidden [class*="stage-wrapper_stage-wrapper_"]:not([class*="stage-wrapper_full-screen_"]),.sa-stage-hidden [class*="gui_target-wrapper_"]{padding:0}.sa-stage-hidden [class*="stage-wrapper_stage-wrapper_"]:not([class*="stage-wrapper_full-screen_"]) [class*="controls_controls-container_"],.sa-stage-hidden [class*="gui_target-wrapper_"]{display:none}.sa-stage-hidden [class*="stage-wrapper_stage-wrapper_"]:not([class*="stage-wrapper_full-screen_"]) [class*="stage-wrapper_stage-canvas-wrapper_"]{visibility:hidden;position:absolute;z-index:-9999;right:0;bottom:100%}[dir="rtl"] .sa-stage-hidden [class*="stage-wrapper_stage-wrapper_"]:not([class*="stage-wrapper_full-screen_"]) [class*="stage-wrapper_stage-canvas-wrapper_"]{right:initial;left:0}.sa-stage-hidden [class*="stage-header_stage-size-row"]{position:absolute;top:0;right:.5rem;height:2.75rem;align-items:center}[dir="rtl"] .sa-stage-hidden [class*="stage-header_stage-size-row"]{right:auto;left:.5rem}'));
    document.head.appendChild(styleElement);
    var s = document.querySelector("[class*='gui_body-wrapper_']");
    document.body.classList.add("sa-stage-hidden-outer");
    s.classList.add("sa-stage-hidden");
    window.dispatchEvent(new Event("resize"));
    
    var elementsToHide = [
        '#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp',
        '#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_alerts-container_15BWp.box_box_2jjDp',
        '#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_body-wrapper_-N0sA.box_box_2jjDp.sa-stage-hidden > div > div.gui_editor-wrapper_2DYcj.box_box_2jjDp > div.backpack_backpack-container_2_wGr',
        '#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_body-wrapper_-N0sA.box_box_2jjDp.sa-stage-hidden > div > div.gui_editor-wrapper_2DYcj.box_box_2jjDp > div.gui_tabs_AgmuP > ul'
    ];
    
    elementsToHide.forEach(selector => {
        document.querySelector(selector).style.display = 'none';
    });

    // document.querySelector("#react-tabs-3 > div > div.selector_wrapper_8_BHs.box_box_2jjDp > div.selector_new-buttons_2qHDd.box_box_2jjDp > div").style.bottom = "30px";

    document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_body-wrapper_-N0sA.box_box_2jjDp.sa-stage-hidden').style.height = '100%';
    
    document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_body-wrapper_-N0sA.box_box_2jjDp.sa-stage-hidden > div > div.gui_stage-and-target-wrapper_69KBf.box_box_2jjDp > div.stage-wrapper_stage-wrapper_2bejr.box_box_2jjDp > div:nth-child(1) > div > div > div.stage-header_stage-size-row_14N65').style.display = 'none';
    
    setInterval(() => { // if the editor is unloaded, this code can't recover.
        if (document.querySelector('#app > div > div.interface_menu_3K-Q2 > div > div.menu-bar_main-menu_3wjWH > div:nth-child(4) > span > div')) {
            fatalError('Error: unable to perform action on element "#app > div > div.interface_3K-Q2 > div.menu-bar_main-menu_3wjWH > div:child(4)"');
        } if (document.querySelector('.blocklyFlyout')) {
            if (document.querySelector('.blocklyFlyout').style.display == "block") {
                document.querySelector('#react-tabs-2').click();
                extrabuttons();
            }
        }
    }, 1000);
    
    try {
        var img = document.querySelector('#react-tabs-3 > div > div.selector_wrapper_8_BHs.box_box_2jjDp > div.selector_new-buttons_2qHDd.box_box_2jjDp > div > button > img');
        img.src = "https://cdn-icons-png.flaticon.com/512/4211/4211763.png";
        img.style.filter = "invert(1)";
    } catch(err) {
        setTimeout(() => {
            try {
                var img = document.querySelector('#react-tabs-3 > div > div.selector_wrapper_8_BHs.box_box_2jjDp > div.selector_new-buttons_2qHDd.box_box_2jjDp > div > button > img');
                img.src = "https://cdn-icons-png.flaticon.com/512/4211/4211763.png";
                img.style.filter = "invert(1)";
            } catch(err) {
                console.warn("unable to set image src for button");
            }
        }, 1000); 
    }
}

const originalReplaceState = history.replaceState;
history.replaceState = function(state, title, url) {
    setTimeout(extrabuttons, 100);
    try {
        var img = document.querySelector('#react-tabs-3 > div > div.selector_wrapper_8_BHs.box_box_2jjDp > div.selector_new-buttons_2qHDd.box_box_2jjDp > div > button > img');
        img.src = "https://cdn-icons-png.flaticon.com/512/4211/4211763.png";
        img.style.filter = "invert(1)";
    } catch(err) {
        console.warn("unable to set image src for button");
    }
};

var loadingScreen;
function showLoader() {
    var style = document.createElement('style');
    style.textContent = `
        #paintLoadingScreen {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            background-color: #00c3ff;
            z-index: 99999999999999999999999999999;
        }
        #loadingImage {
            width: 100px;
            height: 100px;
            background-color: #fff;
            mask: url('https://penguinpaint.pages.dev/loader.gif') no-repeat center / contain;
            -webkit-mask: url('https://penguinpaint.pages.dev/loader.gif') no-repeat center / contain;
            animation: skewAnimation 2s ease-in-out infinite;
        }
        @keyframes skewAnimation {
            0% { transform: skew(-2deg); }
            50% { transform: skew(2deg); }
            100% { transform: skew(-2deg); }
        }
        h1 {
            margin-top: 20px;
            color: #fff;
            animation: titleAnimation 1.5s ease-in-out infinite;
        }
        @keyframes titleAnimation {
            0% { transform: translateY(0); }
            50% { transform: translateY(-2px); }
            100% { transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
    
    loadingScreen = document.createElement('div');
    loadingScreen.id = 'paintLoadingScreen';
    loadingScreen.innerHTML = `
        <div id="loadingImage"></div>
        <h1>Loading Paint</h1>
    `;
    
    document.body.appendChild(loadingScreen);
}
setTimeout(showLoader, 100);

function insertAddons() {
    const enabledLinks = document.cookie
        .split('; ')
        .filter(cookie => cookie.startsWith('card_') && cookie.endsWith('=on'))
        .map(cookie => decodeURIComponent(cookie.split('=')[0].slice(5)));

    enabledLinks.forEach(link => {
        const script = document.createElement('script');
        script.src = link;
        document.body.appendChild(script);
    });

    let lastCookies = document.cookie;
    const alertId = 'cookie-alert';

    function checkCookies() {
        const currentCookies = document.cookie;

        if (currentCookies !== lastCookies) {
            lastCookies = currentCookies;
            showAlert();
        }
    }

    let importurl = new URLSearchParams(window.location.search).get('import');
    if (importurl) {
        if (!importurl.startsWith("data") && !importurl.startsWith("/") && !isCorsDomain(importurl)){
            importurl = "https://api.allorigins.win/raw?url=" + importurl;
        }
        setTimeout(()=>{
            window.importImage("Import", importurl);
        }, 500);
    }

    // Function to create and display the context menu
    function createContextMenu(event) {
        // Prevent default context menu
        event.preventDefault();

        // Remove existing context menu if it exists
        var existingMenu = document.querySelector('.custom-context-menu');
        if (existingMenu) {
            document.body.removeChild(existingMenu);
        }

        // Create new context menu
        const menu = document.createElement('div');
        menu.className = 'custom-context-menu';
        menu.style.position = 'absolute';
        menu.style.left = `${event.pageX}px`;
        menu.style.top = `${event.pageY}px`;
        menu.style.backgroundColor = 'white';
        menu.style.border = '1px solid #ccc';
        menu.style.boxShadow = '2px 2px 10px rgba(0,0,0,0.1)';
        menu.style.zIndex = '1000';
        menu.style.borderRadius = "5px";

        // Populate menu with items from sidebarcontext
        sidebarcontext.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.textContent = item.label;
            menuItem.style.padding = '8px';
            menuItem.style.cursor = 'pointer';
            menuItem.style.borderRadius = "5px";

            // Add click event to each item
            menuItem.onclick = function() {
                item.action(); // Call the action associated with the item
                document.body.removeChild(menu); // Remove menu after selection
            };

            // Add hover effect
            menuItem.onmouseover = function() {
                menuItem.style.backgroundColor = '#f0f0f0';
            };
            menuItem.onmouseout = function() {
                menuItem.style.backgroundColor = 'white';
            };

            menu.appendChild(menuItem);
        });

        document.body.appendChild(menu);

        // Remove the menu when clicking anywhere else
        document.addEventListener('click', function removeMenu() {
            var existingMenu = document.querySelector('.custom-context-menu');
            if (existingMenu) {
                document.body.removeChild(existingMenu);
                document.removeEventListener('click', removeMenu);
            }
        });
    }

    // Attach the context menu to the specified element
    const sidebarElement = document.querySelector('#react-tabs-3 > div > div.selector_wrapper_8_BHs.box_box_2jjDp > div.selector_list-area_1Xbj_.box_box_2jjDp');

    if (sidebarElement) {
        sidebarElement.addEventListener('contextmenu', function(event) {
            if (event.target === sidebarElement || event.target.parentNode === sidebarElement) {
                createContextMenu(event);
            }
        });
    }    

    function showAlert() {
        if (!document.getElementById(alertId)) {
            const alertDiv = document.createElement('div');
            alertDiv.id = alertId;
            alertDiv.style.position = 'fixed';
            alertDiv.style.top = '20px';
            alertDiv.style.right = '20px';
            alertDiv.style.padding = '15px';
            alertDiv.style.borderRadius = '5px';
            alertDiv.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.3)';
            alertDiv.style.zIndex = '999';
            alertDiv.style.fontFamily = 'Arial, sans-serif';
            alertDiv.style.display = 'flex';
            alertDiv.style.alignItems = 'center';
            alertDiv.style.justifyContent = 'space-between';
            alertDiv.style.background = 'rgba(255, 255, 255, 1)';

            const message = document.createElement('span');
            message.innerText = 'Addon settings have changed, do you want to reload and apply?';

            const reloadButton = document.createElement('button');
            reloadButton.innerText = 'Reload';
            reloadButton.style.marginLeft = '10px';
            reloadButton.style.padding = '10px 20px';
            reloadButton.style.border = '1px solid #ccc';
            reloadButton.style.borderRadius = '3px';
            reloadButton.style.cursor = 'pointer';

            reloadButton.onclick = function() {
                showLoader();
                location.reload();
            };

            const cancelButton = document.createElement('button');
            cancelButton.innerText = 'Cancel';
            cancelButton.style.marginLeft = '10px';
            cancelButton.style.padding = '10px 20px';
            cancelButton.style.border = '1px solid #ccc';
            cancelButton.style.borderRadius = '3px';
            cancelButton.style.cursor = 'pointer';

            cancelButton.onclick = function() {
                document.body.removeChild(alertDiv);
            };

            alertDiv.appendChild(message);
            alertDiv.appendChild(reloadButton);
            alertDiv.appendChild(cancelButton);

            document.body.appendChild(alertDiv);
        }
    }

    setInterval(checkCookies, 1000);
}

const waitForElement = (selector) => {
    const checkExist = setInterval(() => {
        if (document.querySelector(selector)) {
            clearInterval(checkExist);
            setTimeout(() => {
                document.querySelector("#app > div").style.minWidth = "750px";
                openPaint();
                var addonurlParams = new URLSearchParams(window.location.search);
                if (addonurlParams.get("addons") === "true") {
                    window.open("https://penguinpaint.pages.dev/addons", "_blank", "width=520,height=700,left=" + (screen.width / 2 - 250) + ",top=" + (screen.height / 2 - 350));
                    addonurlParams.delete("addons");
                    const newUrl = window.location.pathname + "?" + addonurlParams.toString();
                    window.location.href = "https://penguinpaint.pages.dev"
                }
                setTimeout(() => {
                    document.title = newtitle;
                    document.querySelector('#react-tabs-2').click();
                    loadingScreen.remove();
                    try {
                        document.querySelector('#react-tabs-2').click();
                        extrabuttons();
                        if (!new URL(window.location.href).searchParams.get('size')) {
                            setSize(640, 360);
                        }
                        document.querySelector("head > link:nth-child(9)").remove();
                        const faviconlink = document.createElement('link');
                        faviconlink.rel = 'icon';
                        faviconlink.type = 'image/x-icon';
                        faviconlink.href = 'https://penguinpaint.pages.dev/icons/favicon.png';
                        document.head.appendChild(faviconlink);
                        insertAddons();
                    } catch(err) {
                        setTimeout(() => {
                            try {
                                document.querySelector('#react-tabs-2').click();
                                insertAddons();
                                extrabuttons();
                                if (!new URL(window.location.href).searchParams.get('size')) {
                                    setSize(640, 360);
                                } else {
                                    let size = new URL(window.location.href).searchParams.get('size').split('x');
                                    window.stageWidth = size[0]*2;
                                    window.stageHeight = size[1]*2;                                    
                                }
                            } catch(err) {
                                console.warn(err);
                                document.querySelector('#react-tabs-2').click();
                                alert("Unable to load extra ui");
                            }
                        }, 2000); 
                    }
                }, 1000); 
            }, 500); 
        }
    }, 900);
};

waitForElement('#react-tabs-2');
