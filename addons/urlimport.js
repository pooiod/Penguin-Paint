
  addImageButton(
    '//yeetyourfiles.lol/download/ae02e5d9-a901-4391-a013-a165034ae3d6',
    async () => {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 195, 255, 0.7)';
        overlay.style.zIndex = '999';
  
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
        title.textContent = 'Provide an image url';
        title.style.marginBottom = '20px';
        title.style.color = '#333';
        modal.appendChild(title);
  
        const promptInput = document.createElement('input');
        promptInput.type = 'text';
        promptInput.placeholder = 'https://example.com/image.png';
        promptInput.style.margin = '10px 0';
        promptInput.style.padding = '10px';
        promptInput.style.width = '100%';
        promptInput.style.border = '1px solid #ccc';
        promptInput.style.borderRadius = '5px';
        modal.appendChild(promptInput);
  
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
        confirmButton.textContent = 'Import';
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
  
        confirmButton.addEventListener('click', () => {
            var url = promptInput.value || `https://picsum.photos/${window.stageWidth}/${window.stageHeight}`;
  
            document.body.removeChild(overlay);

            url = "https://api.allorigins.win/raw?url=" + url;
            window.fitToCanvas(url).then((url) => {
                window.addImage("Imported 1", url);
            });
        });
  
        cancelButton.addEventListener('click', () => {
            document.body.removeChild(overlay);
        });
    }
);
  