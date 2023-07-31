
let fileUploaderInput;
let generateSpriteSheetButton;
let spritePreview;
let spriteSheetContainer;
let spriteSheetDownloadButton;
let loadedImages = [];
let generatedSpriteSheet;
let cssCode;

window.onload = () => {
    fileUploaderInput = document.getElementById('fileUploaderInput');
    generateSpriteSheetButton = document.getElementById('generateSpriteSheetButton');
    spritePreview = document.getElementById('sprite-preview');
    spriteSheetContainer = document.getElementById('sprite-sheet');
    spriteSheetDownloadButton = document.getElementById('spriteSheetDownloadButton');
    cssCode = document.getElementById('cssCode');
    generateSpriteSheetButton.addEventListener('click', (event) => createSpriteSheet(loadedImages))
    spriteSheetDownloadButton.addEventListener('click', (event) => downloadSprite())
    if (fileUploaderInput) {
        fileUploaderInput.addEventListener('change', fileUploaderOnchange);
    }
}


const fileUploaderOnchange = (event) => {
    const loadedFiles = Array.from(fileUploaderInput.files);


    loadedFiles.map((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            // Create new image element and give it the source of our file and alt 
            const image = new Image();
            image.src = event.target.result;
            // When the image is loaded, create a canvas element and draw the image on it
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                // Set the canvas width and height
                canvas.width = image.width * (100 / image.width);
                canvas.height = image.height * (100 / image.height);
                // Draw the image on the canvas
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                // Create a new image element and give it the source of our canvas
                const newImage = new Image();
                newImage.src = canvas.toDataURL();
                newImage.alt = file.name.replace(/\.(png|jfif|pjpeg|jpeg|pjp|jpg|webp|gif|ico|bmp|dib|tiff|tif)$/, "");
                spritePreview.appendChild(newImage);
                loadedImages.push(image);
            }
        }
        reader.readAsDataURL(file);
    })
}


// Function to create CSS sprite sheet
const createSpriteSheet = (images) => {
    // Determine Sprite Sheet Dimensions
    const totalImages = images.length;
    // Calculate the minimum required dimensions for the sprite sheet
    const cols = Math.ceil(Math.sqrt(totalImages));
    const spriteHeight = Math.ceil(totalImages / cols) * images[0].height;
    const spriteWidth = cols * images[0].width;

    // Create Canvas
    const canvas = document.createElement('canvas');
    canvas.width = spriteWidth;
    canvas.height = spriteHeight;
    const ctx = canvas.getContext('2d');

    // Arrange Images on Canvas
    let x = 0;
    let y = 0;
    for (const image of images) {
        ctx.drawImage(image, x, y);
        x += image.width;
        if (x >= spriteWidth) {
            x = 0;
            y += image.height;
        }
    }

    // Generate CSS Styles
    let cssStyles = '';
    x = 0;
    y = 0;
    for (let i = 0; i < totalImages; i++) {
        const image = images[i];
        const className = `sprite-image-${i}`;
        cssStyles += `
        .${className} {
          background-image: url('sprite-sheet.png')
          background-position: ${x * -1}px ${y * -1}px;
          width: ${image.width}px;
          height: ${image.height}px;
        }
        <br>
      `;
        x += image.width;
        if (x >= spriteWidth) {
            x = 0;
            y += image.height;
        }
    }

    const newImage = new Image();
    newImage.src = canvas.toDataURL();
    newImage.alt = 'sprite-sheet';
    spriteSheetContainer.appendChild(newImage);
    generatedSpriteSheet = newImage

    cssCode.innerHTML = cssStyles;
}

const downloadSprite = () => {
    const link = document.createElement('a');
    link.download = 'sprite-sheet.png';
    link.href = generatedSpriteSheet.src;
    link.click();
}

