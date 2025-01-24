(function(Scratch) {
    'use strict';

    class PenguinPaint {
        getInfo() {
            return {
                id: 'P7PenguinPaint',
                name: 'Penguin Paint',
                blocks: []
            };
        }
    }

    var newtitle = "Penguin Paint";
    document.title = newtitle;

    var loadimg = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAAXNSR0IArs4c6QAAAEpJREFUKFOdkFEKACAIQ+f9D20sUqZUUH45fajTUMObttCZACCkmkzWorGDYtjsEVTomHewnZjSv8Hr6uJu3cxaMfr8Hn2FGspBA/gaFwffFgUWAAAAAElFTkSuQmCC`;
    
    var HistoryReplaceState = history.replaceState;
    var HistoryPushState = history.pushState;

    function deleteFirstCostume() {
        if (Scratch.vm.runtime.getSpriteTargetByName("Sprite1").sprite.costumes_.length > 1) {
            Scratch.vm.runtime.getSpriteTargetByName("Sprite1").sprite.costumes_.shift();
        }
        document.querySelector(`.selector_list-area_1Xbj_ > div:nth-child(1) > div:nth-child(1)`)?.click();
    }

    function deleteAllCostumesButFirst() {
        while (Scratch.vm.runtime.getSpriteTargetByName("Sprite1").sprite.costumes_.length > 1) {
            Scratch.vm.runtime.getSpriteTargetByName("Sprite1").sprite.costumes_ = Scratch.vm.runtime.getSpriteTargetByName("Sprite1").sprite.costumes_.filter((_, index) => index !== 1);
        }
        document.querySelector(`.selector_list-area_1Xbj_ > div:nth-child(1) > div:nth-child(1)`)?.click();
    }

    window.importingimages = [];

    // https://penguinpaint.statichost.app

    function MakeWidget(pageTitle, width, height) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 195, 255, 0.7)';
        overlay.style.zIndex = '9999';
        overlay.id = "widgetoverlay";
        
        const wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.style.top = "50%";
        wrapper.style.left = "50%";
        wrapper.style.transform = 'translate(-50%, -50%)';
        wrapper.style.border = '4px solid rgba(255, 255, 255, 0.25)';
        wrapper.style.borderRadius = '13px';
        wrapper.style.padding = '0px';
        wrapper.style.width = width || '70vw';
        wrapper.style.height = height || '80vh';
        
        const modal = document.createElement('div');
        modal.style.padding = '0px';
        modal.style.borderRadius = '10px';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.textAlign = 'center';
        
        wrapper.appendChild(modal);
    
        const title = document.createElement('div');
        title.style.position = 'absolute';
        title.style.top = '0';
        title.style.left = '0';
        title.style.width = '100%';
        title.style.height = '50px';
        title.style.backgroundColor = 'rgb(0, 195, 255)';
        title.style.display = 'flex';
        title.style.justifyContent = 'center';
        title.style.alignItems = 'center';
        title.style.color = 'white';
        title.style.fontSize = '24px';
        title.style.borderTopLeftRadius = '10px';
        title.style.borderTopRightRadius = '10px';   
        title.id = "WidgetTitle";
        title.innerHTML = pageTitle || "Widget";
        
        const widgetframe = document.createElement('div');
        widgetframe.style.width = '100%';
        widgetframe.style.height = `calc(100% - 50px)`;
        widgetframe.style.marginTop = '50px';
        widgetframe.style.border = 'none'; 
        widgetframe.id = "Widgetframe";
        widgetframe.name = 'Widgetframe';
        widgetframe.style.borderBottomLeftRadius = '10px';
        widgetframe.style.borderBottomRightRadius = '10px';     
        widgetframe.style.backgroundColor = 'var(--ui-primary, white)';   
        modal.appendChild(widgetframe);
    
        const closeButton = document.createElement('div');
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.classList.add('close-button_close-button_lOp2G', 'close-button_large_2oadS');
        closeButton.setAttribute('role', 'button');
        closeButton.setAttribute('tabindex', '0');
        closeButton.innerHTML = '<img class="close-button_close-icon_HBCuO" src="data:image/svg+xml,%3Csvg%20data-name%3D%22Layer%201%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%207.48%207.48%22%3E%3Cpath%20d%3D%22M3.74%206.48V1M1%203.74h5.48%22%20style%3D%22fill%3Anone%3Bstroke%3A%23fff%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-width%3A2px%22%2F%3E%3C%2Fsvg%3E">';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '50%';
        closeButton.style.right = '10px';
        closeButton.id = "WidgetCloseButton"
        closeButton.style.transform = 'translateY(-50%)';
        closeButton.style.zIndex = '1000';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        title.appendChild(closeButton);
    
        modal.appendChild(title);
        overlay.appendChild(wrapper);
        document.body.appendChild(overlay);
    
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        return [overlay, widgetframe, title, closeButton, () => document.getElementById("widgetoverlay")];
    }

    function ShowIframe(url, pageTitle, width, height) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 195, 255, 0.7)';
        overlay.style.zIndex = '9999';
        overlay.id = "widgetoverlay";
        
        const wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.style.top = "50%";
        wrapper.style.left = "50%";
        wrapper.style.transform = 'translate(-50%, -50%)';
        wrapper.style.border = '4px solid rgba(255, 255, 255, 0.25)';
        wrapper.style.borderRadius = '13px';
        wrapper.style.padding = '0px';
        wrapper.style.width = width || '70vw';
        wrapper.style.height = height || '80vh';
        
        const modal = document.createElement('div');
        modal.style.backgroundColor = 'var(--ui-primary, white)';
        modal.style.padding = '0px';
        modal.style.borderRadius = '10px';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.textAlign = 'center';
        
        wrapper.appendChild(modal);
    
        const title = document.createElement('div');
        title.style.position = 'absolute';
        title.style.top = '0';
        title.style.left = '0';
        title.style.width = '100%';
        title.style.height = '50px';
        title.style.backgroundColor = 'rgb(0, 195, 255)';
        title.style.display = 'flex';
        title.style.justifyContent = 'center';
        title.style.alignItems = 'center';
        title.style.color = 'white';
        title.style.fontSize = '24px';
        title.style.borderTopLeftRadius = '10px';
        title.style.borderTopRightRadius = '10px';        
        title.innerHTML = pageTitle || url || "Iframe Widget";
        
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.width = '100%';
        iframe.style.height = `calc(100% - 50px)`;
        iframe.style.marginTop = '50px';
        iframe.style.border = 'none'; 
        iframe.id = "WidgetIframe";
        iframe.name = 'WidgetIframe';
        iframe.style.borderBottomLeftRadius = '10px';
        iframe.style.borderBottomRightRadius = '10px';        
        modal.appendChild(iframe);
    
        const closeButton = document.createElement('div');
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.classList.add('close-button_close-button_lOp2G', 'close-button_large_2oadS');
        closeButton.setAttribute('role', 'button');
        closeButton.setAttribute('tabindex', '0');
        closeButton.innerHTML = '<img class="close-button_close-icon_HBCuO" src="data:image/svg+xml,%3Csvg%20data-name%3D%22Layer%201%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%207.48%207.48%22%3E%3Cpath%20d%3D%22M3.74%206.48V1M1%203.74h5.48%22%20style%3D%22fill%3Anone%3Bstroke%3A%23fff%3Bstroke-linecap%3Around%3Bstroke-linejoin%3Around%3Bstroke-width%3A2px%22%2F%3E%3C%2Fsvg%3E">';
        closeButton.style.position = 'absolute';
        closeButton.style.top = '50%';
        closeButton.style.right = '10px';
        closeButton.style.transform = 'translateY(-50%)';
        closeButton.style.zIndex = '1000';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
        title.appendChild(closeButton);
    
        modal.appendChild(title);
        overlay.appendChild(wrapper);
        document.body.appendChild(overlay);
    
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });

        return [overlay, iframe, title, closeButton, () => document.getElementById("widgetoverlay")];
    }
    
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
                z-index: 999;
            }
            #loadingImage {
                width: 100px;
                height: 100px;
                background-color: #fff;
                mask: url('https://raw.githubusercontent.com/pooiod/Penguin-Paint/refs/heads/main/loader.gif') no-repeat center / contain;
                -webkit-mask: url('https://raw.githubusercontent.com/pooiod/Penguin-Paint/refs/heads/main/loader.gif') no-repeat center / contain;
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

    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function LoadPenguinPaintMod() {
        var newtitle = "Penguin Paint";
        document.title = newtitle;

        var paintLoadingScreen = document.getElementById("paintLoadingScreen");

        var sidebarcontext = [
            {
                label: "New workspace",
                action: function() {
                    deleteAllCostumesButFirst();
                    setTimeout(function() {
                        document.querySelector(`div.mode-tools_mod-dashed-border_T8CR_:nth-child(2) > span:nth-child(1)`)?.click();
                    }, 200);
                }
            },
            {
                label: "Save workspace",
                action: function() {
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
                    
                        var config = {
                            width: window.stageWidth,
                            height: window.stageHeight
                        };
                        zip.file('config.json', JSON.stringify(config));
                    
                        for (let index = 0; index < images.length; index++) {
                            let costume = images[index];
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

                                if (costume.asset.dataFormat == "svg") {
                                    blob = new Blob([blob], { type: 'image/svg+xml' }).text().then(svg => {
                                        return new Blob([svg + `<!--rotationCenter:${images[index].rotationCenterX}:${images[index].rotationCenterY}-->`], { type: 'image/svg+xml' });
                                    });
                                }
                    
                                let fileName = `${imgname || "img "+(index+1)}.${fileExtension}`;
                    
                                zip.file(fileName, blob);
                            }
                        }
                    
                        zip.generateAsync({ type: "blob" })
                            .then(function (content) {
                                saveAs(content, "workspace.ppw");
                            });
                    }
                    
                    exportSpritesToZip();
                }
            },
            {
                label: "Load workspace",
                action: function() {
                    async function loadJSZip() {
                        if (typeof JSZip === 'undefined') {
                            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
                        }
                        if (typeof saveAs === 'undefined') {
                            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js');
                        }
                    }

                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.ppw, .zip, .pmp, .sb3';
                    input.click();

                    input.onchange = async function() {
                        showLoader();
                        deleteAllCostumesButFirst();
                        await window.importImage(`${Math.random()*999999}`, loadimg);
                        deleteFirstCostume();

                        await loadJSZip();

                        function searchMD5ext(json, targetMD5ext) {
                            let found = false;
                                json.targets.forEach(target => {
                                target.costumes.forEach(costume => {
                                    if (costume.md5ext === targetMD5ext) {
                                        found = costume;
                                        if (!found.name.includes("//")) {
                                            found.name = `${target.name}//${costume.name}`;
                                        }
                                    }
                                });
                            });
                            return found;
                        }

                        const file = input.files[0];
                        if (file) {
                            const zip = await JSZip.loadAsync(file);
                            const configFile = zip.file('config.json');
                            var project = zip.file('project.json');
                            let config = null;
                
                            if (configFile) {
                                const configData = await configFile.async('text');
                                try {
                                    config = JSON.parse(configData);
                                    if (config.width && config.height) {
                                        window.setSize(config.width, config.height);
                                    }
                                } catch (e) {
                                    console.error("Invalid config.json:", e);
                                }
                            }

                            if (project) {
                                project = await project.async('text');
                                try {
                                    project = JSON.parse(project);
                                    window.setSize(480*2, 360*2);
                                } catch (e) {
                                    project = null;
                                }
                            }

                            for (let fileName in zip.files) {
                                const zipFile = zip.files[fileName];
                                if (!zipFile.dir) {
                                    const fileExtension = fileName.split('.').pop().toLowerCase();
                                    if (['png', 'jpeg', 'jpg', 'gif', 'svg'].includes(fileExtension)) {
                                        var dataUri = await zipFile.async('base64');
                                        if (project && fileExtension == "svg") {
                                            var costume = searchMD5ext(project, fileName);
                                            try {
                                                const response = await fetch('data:image/svg+xml;base64,' + dataUri);
                                                const svgText = await response.text();
                                                const modifiedSvg = svgText + `<!--rotationCenter:${costume.rotationCenterX}:${costume.rotationCenterY}-->`;
                                                dataUri = btoa(modifiedSvg);
                                            } catch(err) {
                                                console.warn(err);
                                            }
                                        }
                                        if (project) {
                                            var costume = searchMD5ext(project, fileName);
                                            window.importImage(costume.name, `data:image/${fileExtension};base64,${dataUri}`, true);
                                        } else {
                                            window.importImage(fileName.slice(0, fileName.lastIndexOf('.')), `data:image/${fileExtension};base64,${dataUri}`, true);
                                        }
                                    }
                                }
                            }

                            setTimeout(function() {
                                deleteFirstCostume();
                                document.getElementById("paintLoadingScreen")?.remove();
                            }, 100);
                        }
                    };
                }
            },
            {
                label: "Export animation",
                action: function() {
                    async function loadJSZip() {
                        if (typeof JSZip === 'undefined') {
                            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
                        }
                        if (typeof saveAs === 'undefined') {
                            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js');
                        }
                        if (typeof gifshot === 'undefined') {
                            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/gifshot/0.3.2/gifshot.min.js');
                        }
                    }
                    
                    async function exportSpritesToZip() {
                        await loadJSZip();
                    
                        var spr = Scratch.vm.runtime.getEditingTarget();
                        var images = spr.sprite.costumes_;
                        var zip = new JSZip();
                    
                        for (let index = 0; index < images.length; index++) {
                            let costume = images[index];
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

                                if (costume.asset.dataFormat == 'svg') {
                                    blob = new Blob([blob], { type: 'image/svg+xml' }).text().then(svg => {
                                        var blob2 = new Blob([svg + `<!--rotationCenter:${images[index].rotationCenterX}:${images[index].rotationCenterY}-->`], { type: 'image/svg+xml' });
                                        return blob = svgToPngBlob(blob2, -images[index].rotationCenterX, -images[index].rotationCenterY, true);
                                    });
                                }

                                function svgToPngBlob(svgBlob, offsetX, offsetY, nocenter) {
                                    return new Promise((resolve, reject) => {
                                        const reader = new FileReader();
                                        reader.onload = function () {
                                            const svgText = reader.result;
                                            const stageWidth = window.stageWidth/2;
                                            const stageHeight = window.stageHeight/2;
                                            const svg = new Blob([svgText], { type: 'image/svg+xml' });
                                            const img = new Image();
                                            img.onload = function () {
                                                const canvas = document.createElement('canvas');
                                                canvas.width = stageWidth;
                                                canvas.height = stageHeight;
                                                const ctx = canvas.getContext('2d');
                                                const centerX = (stageWidth - (img.width * nocenter?2:1)) / 2 + offsetX;
                                                const centerY = (stageHeight - (img.height * nocenter?2:1)) / 2 + offsetY;
                                                ctx.drawImage(img, centerX, centerY);
                                                canvas.toBlob(resolve, 'image/png');
                                            };
                                            img.onerror = reject;
                                            img.src = URL.createObjectURL(svg);
                                        };
                                        reader.onerror = reject;
                                        reader.readAsText(svgBlob);
                                    });
                                }
                                
                                let fileName = `${imgname || "img "+(index+1)}.${fileExtension}`;
                    
                                zip.file(fileName, blob);
                            }
                        }
                    
                        zip.generateAsync({ type: "blob" })
                            .then(function (content) {
                                function openEzgifWithBlob(blob) {
                                    const reader = new FileReader();
                                    reader.onloadend = function() {
                                        const dataUri = reader.result;
                                        const form = document.createElement('form');
                                        form.method = 'POST';
                                        form.action = 'https://ezgif.com/maker';
                                        if (window.self == window.top) {
                                            ShowIframe("https://ezgif.com", "GIF Exporter", "80vw", "90vh");
                                            form.target = 'WidgetIframe';
                                        } else {
                                            const newWindow = window.open('', 'ezgifAnimationExport', 'width=800,height=600');
                                            form.target = newWindow.name;
                                        }

                                        const input = document.createElement('input');
                                        input.type = 'hidden';
                                        input.name = 'new-image-url';
                                        input.value = dataUri;
                                    
                                        form.appendChild(input);
                                        document.body.appendChild(form);
                                        form.submit();
                                        document.body.removeChild(form);
                                    };
                                    reader.readAsDataURL(blob);
                                }
                                                            

                                openEzgifWithBlob(content);
                            });
                    }
                    
                    exportSpritesToZip();
                }
            }
        ];
        
        var corsdomains = [
            "penguinpaint.pages.dev",
            "yeetyourfiles.lol",
            "raw.githubusercontent.com",
            "api.allorigins.win",
            "studio.penguinmod.com",
            "penguinmod.com",
        ];
        
        window.isCorsDomain = function(url) {
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
            <button style="color:black;" onclick="window.location.href = 'https://penguinpaint.pages.dev/addons'" hidden>Open Addons</button>`;
            document.body.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;background-color:#fff;font-size:24px;color:#00a6d9;">${error}</div>`;
        }
        
        window.setSize = function(width, height) {
            Scratch.vm.setStageSize(width/2, height/2);
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
        
        window.importImage = function(name, url, nosize) {
            try {
                if (!window.importingimages.includes(url)) {
                    window.importingimages.push(url);
                }
                fetch(url)
                .then(response => response.text())
                .then(data => {
                    const isSVG = data.trim().includes("<svg");
                    if (isSVG) {
                        window.addImage(name, url, true);
                    } else {
                        if (nosize) {
                            window.addImage(name, url, false);
                        } else {
                            window.fitToCanvas(url).then((url2) => {
                                window.addImage(name, url2, false, url);
                            });
                        }
                    }
                });

                var attempts = 0;
                return new Promise(resolve => {
                    const interval = setInterval(() => {
                        attempts += 1;
                        if (!window.importingimages.includes(url) || attempts >= 40) {
                            clearInterval(interval);
                            resolve();
                        }
                    }, 500);
                  });
            } catch(err) {
                addImage("error1", "https://dummyimage.com/" + window.stageWidth + "x" + window.stageHeight + "/fff/000&text=Error generating image: " + err, false);
            }
        }
        
        window.addImage = function(name, url, editable, origin) {
            if (!window.importingimages.includes(url)) {
                window.importingimages.push(url);
            }
            function importPNG(TEXT, NAME, origin) {
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
                        console.log(origin || TEXT)
                        if (window.importingimages.includes(origin || TEXT)) {
                            window.importingimages.splice(window.importingimages.indexOf(origin || TEXT), 1);
                        }
                    });
            }
            function importSVG(TEXT, NAME, origin) {
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
                        if (window.importingimages.includes(origin || TEXT)) {
                            window.importingimages.splice(window.importingimages.indexOf(origin || TEXT), 1);
                        }
                    });
            }
            if (editable) {
                importSVG(url, name, origin);
            } else {
                importPNG(url, name, origin);
            }
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
                    scrollbar-color: #fff var(--ui-tertiary, #d9e3f2);
                }
                *::-webkit-scrollbar-track {
                    background: var(--ui-tertiary, #d9e3f2;
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
                    button.addEventListener('click', function() {
                        ShowIframe("/addons.html", "Addons", "60vw")
                        // window.open("/addons.html", "_blank", "width=520,height=700,left=" + (screen.width / 2 - 250) + ",top=" + (screen.height / 2 - 350));
                    });
                }
    
                buttonHTML = '<button class="settings_button_2ovv0 buttonsize" style="background: #00c3ff; color: #fff; border: none; border-radius: 5px; padding: 10px;"><b>Set canvas size</b></button>';
                targetElement.insertAdjacentHTML('afterend', buttonHTML);
        
                button = document.querySelector('.buttonsize');
                button.addEventListener('click', function() {
                    var [overlay, frame] = MakeWidget("Canvas size", "400px", "250px");

                    frame.style.textAlign = 'center';
        
                    const widthInput = document.createElement('input');
                    widthInput.type = 'number';
                    widthInput.placeholder = 'Width (px)';
                    widthInput.style.margin = '10px 0';
                    widthInput.style.padding = '10px';
                    widthInput.style.width = 'calc(100% - 60px)';
                    widthInput.style.border = '1px solid #ccc';
                    widthInput.style.borderRadius = '5px';
                    widthInput.value = window.stageWidth;
                    widthInput.style.marginTop = '20px';
                    frame.appendChild(widthInput);
        
                    const heightInput = document.createElement('input');
                    heightInput.type = 'number';
                    heightInput.placeholder = 'Height (px)';
                    heightInput.style.margin = '10px 0';
                    heightInput.style.padding = '10px';
                    heightInput.style.width = 'calc(100% - 60px)';
                    heightInput.style.border = '1px solid #ccc';
                    heightInput.style.borderRadius = '5px';
                    heightInput.value = window.stageHeight;
                    frame.appendChild(heightInput);
        
                    const confirmButton = document.createElement('button');
                    confirmButton.textContent = 'Confirm';
                    confirmButton.style.padding = '10px 15px';
                    confirmButton.style.backgroundColor = 'rgb(0, 195, 255)';
                    confirmButton.style.border = "1px solid rgb(0, 181, 236)";
                    confirmButton.style.color = '#fff';
                    confirmButton.style.cursor = 'pointer';
                    confirmButton.style.borderRadius = '5px';
                    confirmButton.style.marginTop = '10px';
                    confirmButton.style.float = "right";
                    confirmButton.style.marginRight = '18px';
                    confirmButton.style.transition = 'background-color 0.3s';
                    
                    confirmButton.addEventListener('mouseenter', () => {
                        confirmButton.style.backgroundColor = 'rgb(0, 159, 207)';
                    });
                    confirmButton.addEventListener('mouseleave', () => {
                        confirmButton.style.backgroundColor = 'rgb(0, 195, 255)';
                    });
                    frame.appendChild(confirmButton);
        
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
                });
            }
        }

        setInterval(extrabuttons, 9000);
        
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
        
                document.querySelector('div.menu-bar_menu-bar-item_oLDa-:nth-child(2) > img:nth-child(1)').src = 'https://raw.githubusercontent.com/pooiod/Penguin-Paint/refs/heads/main/icons/moon.svg';
                
                element = document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp > div.menu-bar_main-menu_3wjWH > div.menu-bar_file-group_1_CHX > div:nth-child(2)');
                element.style.display = 'block';
                element.style.position = 'fixed';
                element.style.top = '0';
                element.style.right = '0';
                element.style.zIndex = '9999999999999999999999999999999999999999999';
                // element.style.backgroundColor = 'var(--ui-secondary, lightgrey)';
                // element.style.backgroundColor = "transparent";
                element.style.borderBottomLeftRadius = '15px';
                element.style.width = "1px";
                element.style.paddingRight = "30px";
                element.style.paddingTop = "5px";
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
                // '#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_body-wrapper_-N0sA.box_box_2jjDp.sa-stage-hidden > div > div.gui_editor-wrapper_2DYcj.box_box_2jjDp > div.backpack_backpack-container_2_wGr',
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
        
        function insertAddons() {
            // const enabledLinks = document.cookie
            //     .split('; ')
            //     .filter(cookie => cookie.startsWith('card_') && cookie.endsWith('=on'))
            //     .map(cookie => decodeURIComponent(cookie.split('=')[0].slice(5)));
        
            // enabledLinks.forEach(link => {
            //     const script = document.createElement('script');
            //     script.src = link;
            //     document.body.appendChild(script);
            // });
        
            (()=>{
                // Backpack addon
                var targetBackpackElement = document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_body-wrapper_-N0sA.box_box_2jjDp.sa-stage-hidden > div > div.gui_editor-wrapper_2DYcj.box_box_2jjDp');
                if (targetBackpackElement) {
                    // targetBackpackElement.style.transform = 'scaleY(-1)';
                    // const children = targetBackpackElement.children;
                    // for (let child of children) {
                    //     child.style.transform = 'scaleY(-1)';
                    // }
                    if (document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp > div.menu-bar_main-menu_3wjWH > div.menu-bar_file-group_1_CHX > div:nth-child(2)')) {
                        setTimeout(function(){
                            document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp > div.menu-bar_main-menu_3wjWH > div.menu-bar_file-group_1_CHX > div:nth-child(2)').style.paddingBottom = "6px";
                            document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp > div.menu-bar_main-menu_3wjWH > div.menu-bar_file-group_1_CHX > div:nth-child(2)').style.height = "20px";
                            document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp > div.menu-bar_main-menu_3wjWH > div.menu-bar_file-group_1_CHX > div:nth-child(2)').style.paddingTop = "1px";
                        }, 3000);
                        setTimeout(function(){
                            document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp > div.menu-bar_main-menu_3wjWH > div.menu-bar_file-group_1_CHX > div:nth-child(2)').style.paddingBottom = "6px";
                            document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp > div.menu-bar_main-menu_3wjWH > div.menu-bar_file-group_1_CHX > div:nth-child(2)').style.height = "20px";
                            document.querySelector('#app > div > div > div.gui_page-wrapper_1cgy0.box_box_2jjDp > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp > div.menu-bar_main-menu_3wjWH > div.menu-bar_file-group_1_CHX > div:nth-child(2)').style.paddingTop = "1px";
                        }, 2100);
                    }
                } else {
                    window.fatalError("Unable to load editor backpack");
                }
        
                //SVG text addon
                window.addEventListener('message', (event) => {
                    const receivedMessage = event.data;
                  
                    if (receivedMessage && receivedMessage.startsWith("data:image/svg+xml;charset=utf-8,")) {
                        window.addImage("Text import", receivedMessage, true);
                        document.body.removeChild(document.getElementById("widgetoverlay"));
                    }
                });
                
                addImageButton(
                    '//yeetyourfiles.lol/download/1e49f163-14b0-4166-a98a-d47a5be84d7d',
                    async () => {
                        ShowIframe("//p7scratchextensions.pages.dev/extras/html/SVGtext", "SVG Text Importer")
                    }
                );

                // AI image addon
                addImageButton(
                    '//yeetyourfiles.lol/download/15d98037-8f90-41cd-929f-8768b99aa786',
                    async () => {
                        var [overlay, frame, title, closeButton] = MakeWidget("Image generator", "400px", "190px");

                        frame.style.textAlign = 'center';
                  
                        const promptInput = document.createElement('input');
                        promptInput.type = 'text';
                        promptInput.placeholder = 'What do you want to generate?';
                        promptInput.value = "{0000000000} A penguin in space";
                        promptInput.style.margin = '10px 0';
                        promptInput.style.padding = '10px';
                        promptInput.style.width = 'calc(100% - 60px)';
                        promptInput.style.border = '1px solid #ccc';
                        promptInput.style.borderRadius = '5px';
                        promptInput.style.marginTop = '20px';
                        frame.appendChild(promptInput);
                        setTimeout(() => promptInput.focus(), 100);

                        const confirmButton = document.createElement('button');
                        confirmButton.textContent = 'Import';
                        confirmButton.style.padding = '10px 15px';
                        confirmButton.style.float = "right";
                        confirmButton.style.marginRight = '18px';
                        confirmButton.style.backgroundColor = 'rgb(0, 195, 255)';
                        confirmButton.style.border = "1px solid rgb(0, 181, 236)";
                        confirmButton.style.color = '#fff';
                        confirmButton.style.cursor = 'pointer';
                        confirmButton.style.borderRadius = '5px';
                        confirmButton.style.marginTop = '10px';
                        confirmButton.style.transition = 'background-color 0.3s';
                        confirmButton.addEventListener('mouseenter', () => {
                            confirmButton.style.backgroundColor = 'rgb(0, 159, 207)';
                        });
                        confirmButton.addEventListener('mouseleave', () => {
                            confirmButton.style.backgroundColor = 'rgb(0, 195, 255)';
                        });
                        frame.appendChild(confirmButton);

                        async function startImageGen(PROMPT, KEY) {
                            try {
                                const response = await fetch(`https://stablehorde.net/api/v2/generate/async`, {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'apikey': KEY || "0000000000"
                                    },
                                    body: JSON.stringify({
                                        prompt: PROMPT,
                                        params: {
                                            n: 1,
                                            censor_nsfw: true,
                                            transparent: PROMPT.includes("transparent"),
                                            models: ["any"]
                                        },
                                        allow_downgrade: true
                                    })
                                });
                                const data = await response.json();
                                if (data.message) {
                                    document.body.removeChild(document.getElementById("widgetoverlay"));
                                    var [overlay, frame, title] = MakeWidget("Generation failed", "400px", "190px");
                                    frame.innerHTML = `<br>${data.message}`;
                                }
                                return data.id;
                            } catch (error) {
                                return error;
                            }
                        }
                        async function getImageGenStatus(ID) {
                            return fetch(`https://stablehorde.net/api/v2/generate/status/${ID}`)
                            .then((res) => res.json())
                            .catch((err) => err.message);
                        }
                        
                        function parseText(input) {
                            const match = input.match(/^\{([^}]+)\}\s*(.+)$/);
                            return match ? [match[1], match[2]] : ["", input];
                        }                    

                        async function finishAndImportImageFromURL() {
                            var prompt = promptInput.value || `A cartoon penguin in space`;
                            title.innerHTML = "Starting generation";

                            var key = parseText(prompt);
                            prompt = key[1];
                            key = key[0];

                            frame.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:100%;"><div style="border:8px solid rgba(130, 130, 130, 0.07);border-top:8px solid #3498db;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;"></div></div><style>@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}</style>`;

                            var GenID = await startImageGen(prompt, key);

                            if (document.getElementById("widgetoverlay")) {
                                title.innerHTML = "Genrating image";
                            }

                            if (!GenID) {
                                return;
                            }

                            var msgInterval = setInterval(async (frame) => {
                                if (!document.getElementById("widgetoverlay")) {
                                    clearInterval(msgInterval);
                                    var [overlay, frame, title] = MakeWidget("Generation canceled", "400px", "190px");
                                    frame.innerHTML = `<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
<div style="display:flex;justify-content:center;align-items:center;height:100%;"><i class="fa-solid fa-circle-xmark" style="font-size:50px;color:#555;"></i></div>`;
                                    GenID = null;
                                } else {
                                    var status = await getImageGenStatus(GenID);
                                    if (!status || (status && (status.faulted || status.message))) {
                                        document.getElementById("WidgetTitle").innerHTML = "Generation failed";
                                        clearInterval(msgInterval);
                                        document.getElementById("Widgetframe").innerHTML = `<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" rel="stylesheet">
    <div style="display:flex;justify-content:center;align-items:center;height:100%;"><i class="fas fa-frown" style="font-size:50px;color:#555;"></i></div>`;
                                        if (status && status.faulted) {
                                            document.getElementById("Widgetframe").innerHTML = `<br>${status.faulted}`;
                                        } else if (status && status.message) {
                                            document.getElementById("Widgetframe").innerHTML = `<br>${status.message}`;
                                        }
                                    } else if (status.done) {
                                        clearInterval(msgInterval);
                                        document.getElementById("WidgetTitle").innerHTML = "Importing image";

                                        await window.importImage("Generation", status.generations[0].img)

                                        document.body.removeChild(document.getElementById("widgetoverlay"));
                                    } else if (status.queue_position) {
                                        document.getElementById("WidgetTitle").innerHTML = `Waiting in queue (${status.queue_position})`;
                                    } else if (status.wait_time) {
                                        document.getElementById("WidgetTitle").innerHTML = `Genrating image (${status.wait_time}s)`;
                                    }
                                }
                            }, 5000);
                        }

                        promptInput.addEventListener('keydown', function(event) {
                            if (event.key === 'Enter') {
                                finishAndImportImageFromURL()
                            }
                        });                          

                        confirmButton.addEventListener('click', async () => {
                            finishAndImportImageFromURL()
                        });
                    }
                );

                // URL import addon
                addImageButton(
                    '//yeetyourfiles.lol/download/f6756e9b-4ab5-4388-9bbf-1682a9fc2199',
                    async () => {
                        var [overlay, frame, title] = MakeWidget("Image importer", "400px", "190px");

                        frame.style.textAlign = 'center';
                  
                        const promptInput = document.createElement('input');
                        promptInput.type = 'text';
                        promptInput.placeholder = 'https://example.com/randomimage.png';
                        promptInput.style.margin = '10px 0';
                        promptInput.style.padding = '10px';
                        promptInput.style.width = 'calc(100% - 60px)';
                        promptInput.style.border = '1px solid #ccc';
                        promptInput.style.borderRadius = '5px';
                        promptInput.style.marginTop = '20px';
                        frame.appendChild(promptInput);
                        setTimeout(() => promptInput.focus(), 100);

                        const confirmButton = document.createElement('button');
                        confirmButton.textContent = 'Import';
                        confirmButton.style.padding = '10px 15px';
                        confirmButton.style.float = "right";
                        confirmButton.style.marginRight = '18px';
                        confirmButton.style.backgroundColor = 'rgb(0, 195, 255)';
                        confirmButton.style.border = "1px solid rgb(0, 181, 236)";
                        confirmButton.style.color = '#fff';
                        confirmButton.style.cursor = 'pointer';
                        confirmButton.style.borderRadius = '5px';
                        confirmButton.style.marginTop = '10px';
                        confirmButton.style.transition = 'background-color 0.3s';
                        confirmButton.addEventListener('mouseenter', () => {
                            confirmButton.style.backgroundColor = 'rgb(0, 159, 207)';
                        });
                        confirmButton.addEventListener('mouseleave', () => {
                            confirmButton.style.backgroundColor = 'rgb(0, 195, 255)';
                        });
                        frame.appendChild(confirmButton);

                        async function finishAndImportImageFromURL() {
                            var url = promptInput.value || `https://picsum.photos/${window.stageWidth}/${window.stageHeight}?${Math.random()*100}`;
                            title.innerHTML = "Importing image";

                            if (!url.startsWith("data") && !url.startsWith("/") && !window.isCorsDomain(url)){
                                url = "https://api.allorigins.win/raw?url=" + url;
                            }

                            frame.innerHTML = `<div style="display:flex;justify-content:center;align-items:center;height:100%;"><div style="border:8px solid rgba(130, 130, 130, 0.07);border-top:8px solid #3498db;border-radius:50%;width:40px;height:40px;animation:spin 1s linear infinite;"></div></div><style>@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}</style>`;

                            await window.importImage("Import", url)

                            document.body.removeChild(overlay);
                        }

                        promptInput.addEventListener('keydown', function(event) {
                            if (event.key === 'Enter') {
                                finishAndImportImageFromURL()
                            }
                        });                          

                        confirmButton.addEventListener('click', async () => {
                            finishAndImportImageFromURL()
                        });
                    }
                );
            })()
        
            // let lastCookies = document.cookie.split('; ').filter(cookie => cookie.startsWith('card_')).join('; ');;
            // const alertId = 'cookie-alert';
        
            // function checkCookies() {
            //     const currentCookies = document.cookie.split('; ').filter(cookie => cookie.startsWith('card_')).join('; ');;
        
            //     if (currentCookies !== lastCookies) {
            //         lastCookies = currentCookies;
            //         showAlert();
            //     }
            // }
        
            let importurl = new URLSearchParams(window.location.search).get('import');
            if (importurl) {
                if (!importurl.startsWith("data") && !importurl.startsWith("/") && !isCorsDomain(importurl)){
                    importurl = "https://api.allorigins.win/raw?url=" + importurl;
                }
                setTimeout(async()=>{
                    await window.importImage("Import", importurl); // importurl.split('/').pop() (some names cause images to not import)
                    setTimeout(function() {
                        deleteFirstCostume();
                    }, 100);
                    if (document.getElementById("paintLoadingScreen")) {
                        loadingScreen.remove();
                    }
                }, 500);
            }
        
            function createContextMenu(event) {
                event.preventDefault();
        
                var existingMenu = document.querySelector('.custom-context-menu');
                if (existingMenu) {
                    document.body.removeChild(existingMenu);
                }
        
                const menu = document.createElement('div');
                menu.className = 'custom-context-menu';
                menu.style.position = 'absolute';
                menu.style.left = `${event.pageX}px`;
                menu.style.top = `${event.pageY}px`;
                menu.style.backgroundColor = 'var(--ui-primary, white)';
                menu.style.border = '1px solid var(--ui-secondary, #ccc)';
                menu.style.boxShadow = '2px 2px 10px rgba(0,0,0,0.1)';
                menu.style.zIndex = '1000';
                menu.style.borderRadius = "5px";
        
                sidebarcontext.forEach(item => {
                    const menuItem = document.createElement('div');
                    menuItem.textContent = item.label;
                    menuItem.style.padding = '8px';
                    menuItem.style.cursor = 'pointer';
                    menuItem.style.borderRadius = "5px";
        
                    menuItem.onclick = function() {
                        item.action();
                        document.body.removeChild(menu);
                    };
        
                    menuItem.onmouseover = function() {
                        menuItem.style.backgroundColor = 'rgba(125, 125, 125, 0.09)';
                    };
                    menuItem.onmouseout = function() {
                        menuItem.style.backgroundColor = 'transparent';
                    };
        
                    menu.appendChild(menuItem);
                });
        
                document.body.appendChild(menu);
        
                document.addEventListener('click', function removeMenu() {
                    var existingMenu = document.querySelector('.custom-context-menu');
                    if (existingMenu) {
                        document.body.removeChild(existingMenu);
                        document.removeEventListener('click', removeMenu);
                    }
                });
            }
        
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
                    alertDiv.style.background = 'var(--ui-secondary, #f0f4f5)';
        
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
                        setTimeout(() => loadingScreen.remove(), 9000);
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
        
            // setInterval(checkCookies, 1000);
        }
        
        const waitForElement = (selector) => {
            const checkExist = setInterval(() => {
                if (document.querySelector(selector)) {
                    clearInterval(checkExist);
                    setTimeout(() => {
                        document.querySelector("#app > div").style.minWidth = "750px";
                        try {
                            openPaint();
                        } catch(err) {
                            window.fatalError(err);
                        }
                        setTimeout(() => {
                            document.title = newtitle;
                            document.querySelector('#react-tabs-2').click();
                            if (!new URL(window.location.href).searchParams.get('import')) {
                                loadingScreen.remove();
                            }
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
                                faviconlink.href = 'https://raw.githubusercontent.com/pooiod/Penguin-Paint/refs/heads/main/icons/favicon.png';
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
                                        window.fatalError(err);
                                    }
                                }, 2000); 
                            }
                        }, 1000); 
                    }, 500); 
                }
            }, 900);
        };
        
        function fixhistory() {
            window.history.replaceState = function(state, title, url) {
                setTimeout(extrabuttons, 100);
                try {
                    var img = document.querySelector('#react-tabs-3 > div > div.selector_wrapper_8_BHs.box_box_2jjDp > div.selector_new-buttons_2qHDd.box_box_2jjDp > div > button > img');
                    img.src = "https://cdn-icons-png.flaticon.com/512/4211/4211763.png";
                    img.style.filter = "invert(1)";
                } catch(err) {
                    console.warn("unable to set image src for button");
                }
            };
            
            window.history.pushState = function(state, title, url) {
                setTimeout(extrabuttons, 100);
                try {
                    var img = document.querySelector('#react-tabs-3 > div > div.selector_wrapper_8_BHs.box_box_2jjDp > div.selector_new-buttons_2qHDd.box_box_2jjDp > div > button > img');
                    img.src = "https://cdn-icons-png.flaticon.com/512/4211/4211763.png";
                    img.style.filter = "invert(1)";
                } catch(err) {
                    console.warn("unable to set image src for button");
                }
            };
        }
        
        waitForElement('#react-tabs-2');
        setInterval(fixhistory, 100);
        fixhistory();
    }

    var skipload = false;
    const checkElement = setInterval(() => {
        document.title = newtitle;
        const element = document.querySelector('.scratchCategoryMenuItemLabel');
        if ((element && element.textContent === 'Penguin Paint') || skipload) {
            clearInterval(checkElement);
            LoadPenguinPaintMod();
        }
    }, 100);
    setTimeout(function() {
        skipload = true;
    }, 2000);
    
    Scratch.extensions.register(new PenguinPaint());
})(Scratch);
