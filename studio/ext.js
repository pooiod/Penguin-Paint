(function(Scratch) {
    'use strict';

    class PenguinPaintExtension {
        getInfo() {
            return {
                id: 'penguinpaintdemo',
                name: 'Penguin Paint',
                blocks: [
                    {
                        opcode: 'loadPenguinPaint',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Load Penguin Paint demo'
                    }
                ]
            };
        }

        loadPenguinPaint() {
            var loadingScreen;
            var style = document.createElement('style');
            style.textContent = `
                #paintLoadingScreen {
                    position: absolute;
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

            document.querySelector("canvas").parentNode.appendChild(loadingScreen);

            const script = document.createElement('script');
            script.src = 'https://raw.githubusercontent.com/pooiod/Penguin-Paint/refs/heads/main/studio/main.js';
            script.onload = () => {
                console.log('Penguin Paint demo loaded');
            };
            document.body.appendChild(script);
        }
    }

    Scratch.extensions.register(new PenguinPaintExtension());
})(Scratch);
