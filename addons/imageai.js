var gptimage = {
  api: "https://proxy.mubilop.tech/v1/images/generations",
  models: [
      "flux-pro",
      "pastel-mix-anime",
      "absolute-reality-v1.8.1",
      "anything-v5",
      "meinamix",
      "deliberate-v3",
      "rev-animated",
      "i-cant-believe-its-not-photography-seco",
      "lofi-v4",
      "analog-v1"
  ]
};

gptimage.generate = async function(prompt, model) {
  var requestedModel = gptimage.models[model] || model;
  if (!requestedModel) {
      requestedModel = "flux-pro";
  }
  
  console.log("making image");

  return fetch(gptimage.api, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          model: requestedModel,
          prompt: prompt
      }),
  })
  .then(response => {
      if (!response.ok) {
          throw new Error(`Image Gen network response was not ok: ${response.status} ${response.statusText}`);
      }
      return response.json();
  })
  .then(data => {
      let targetUrl = data.data[0].url;
      console.log(targetUrl);
      return targetUrl;
  })
  .catch(error => {
      console.error("Image Generator Error: ", error.message);
      return "https://dummyimage.com/" + 1000 + "x" + 1000 + "/fff/000&text=Error generating image: " + error.message;
  });
};

async function resizeImage(url, width, height) {
  const img = new Image();
  img.crossOrigin = "Anonymous";

  return new Promise((resolve, reject) => {
      img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = width;
          canvas.height = height;

          ctx.drawImage(img, 0, 0, width, height);
          const resizedImage = canvas.toDataURL();
          resolve(resizedImage);
      };

      img.onerror = () => {
          reject(new Error("Could not load image"));
      };

      img.src = url;
  });
}

addImageButton(
  '//yeetyourfiles.lol/download/15d98037-8f90-41cd-929f-8768b99aa786',
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
      modal.style.backgroundColor = 'var(--ui-primary, white)';
      modal.style.padding = '30px';
      modal.style.borderRadius = '10px';
      modal.style.width = '300px';
      modal.style.textAlign = 'center';

      wrapper.appendChild(modal);

      const title = document.createElement('h2');
      title.textContent = 'What do you want to see?';
      title.style.marginBottom = '20px';
      modal.appendChild(title);

      const promptInput = document.createElement('input');
      promptInput.type = 'text';
      promptInput.placeholder = 'Penguin in Space';
      promptInput.style.margin = '10px 0';
      promptInput.style.padding = '10px';
      promptInput.style.width = '100%';
      promptInput.style.border = '1px solid #ccc';
      promptInput.style.borderRadius = '5px';
      modal.appendChild(promptInput);
      setTimeout(() => promptInput.focus(), 100);

      const modelSelect = document.createElement('select');
      gptimage.models.forEach((model, index) => {
          const option = document.createElement('option');
          option.value = index;
          option.textContent = model;
          modelSelect.appendChild(option);
      });
      modal.appendChild(modelSelect);

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
      confirmButton.textContent = 'Generate';
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
          var prompt = promptInput.value || promptInput.placeholder;
          var selectedModelIndex = modelSelect.value;

          document.body.removeChild(overlay);

          gptimage.generate(prompt, selectedModelIndex).then(function(imageUrl) {
              const size = Math.min(1000, window.stageHeight, window.stageWidth);
              resizeImage(imageUrl, size, size)
                  .then(resizedImage => {
                      addImage(prompt, resizedImage);
                  })
                  .catch(error => {
                      if (window.confirm("Unable to resize image, add anyways? (1000x1000)")) setSize(1000, 1000);
                      addImage(prompt, imageUrl);
                  });                
          });
      });

      cancelButton.addEventListener('click', () => {
          document.body.removeChild(overlay);
      });
  }
);
