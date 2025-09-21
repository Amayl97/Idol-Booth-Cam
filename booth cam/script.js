const canvas = document.getElementById("canvas");
const captureBtn = document.getElementById('capture-btn');
// const propBtn = document.getElementById('propBtn');
const colBtn = document.getElementById('colBtn');
const modeBtn = document.getElementById('modeBtn');
const propBtn = document.getElementById('propBtn');
const saveBtn = document.getElementById('save-btn');
const capturedImgs = document.querySelector('.capturedImgs');





let drop3 = false;
propBtn.addEventListener("click", (e) => {
    if(!drop3){
    document.querySelector(".dropDown1").style.display = "grid";
    drop3 = true;
    }
    else{
    document.querySelector(".dropDown1").style.display = "none";
     drop3 = false;
    }
})

let drop = false;
colBtn.addEventListener("click", (e) => {
    if(!drop){
    document.querySelector(".dropDown").style.display = "grid";
    drop = true;
    }
    else{
    document.querySelector(".dropDown").style.display = "none";
     drop = false;
    }
})




let video;
const ctx = canvas.getContext('2d');
navigator.mediaDevices.getUserMedia({video: true})
.then((stream) => {
    video = document.createElement('video');
    video.srcObject = stream;
    video.play();
    
    //Draw the video feed on the canvas
    function draw(){
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        requestAnimationFrame(draw);
    }
    draw();
    
})
.catch(error => {
    alert("Error accessing camera");
});


//Load the overlay image
const overlayImg = document.getElementById('overlay-image');
const overlayCont = document.querySelector('.overlay-container');

const idolImgs = document.querySelectorAll('.prop');
idolImgs.forEach((image) => {
    image.addEventListener('click', (e) => {
        if(image.id === "solo") overlayImg.src = "";
        else {
         overlayImg.src = image.src;
        }
    });
});

overlayCont.style.position = 'absolute';
overlayCont.style.top = `${document.getElementById('canvas').offsetTop}px`;
overlayCont.style.left = `${document.getElementById('canvas').offsetLeft}px`;


captureBtn.addEventListener("click", captureImage);

function captureImage(){

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(overlayImg, canvas.width - (overlayImg.width*(canvas.height/overlayImg.height)), 0,overlayImg.width*(canvas.height/overlayImg.height), canvas.height);

    const dataURL = canvas.toDataURL();
    const image = document.createElement('img');
    image.src = dataURL;
    
    const imgDiv = document.createElement('div');
    imgDiv.className = 'img';
    imgDiv.appendChild(image);

    capturedImgs.appendChild(imgDiv);

    if(capturedImgs.children.length === 1){
        capturedImgs.classList.remove('hidden');
    }
    if(capturedImgs.children.length === 4){
        captureBtn.classList.add('disabled');
        document.querySelector("#save-btn").classList.remove("hidden");
    }
    //Change frame colour
    const colors = document.querySelectorAll('.color-btn');
    colors.forEach((color) => {
    color.addEventListener('click', () => {
        capturedImgs.style.background = `${color.id}`;
    });
});

}



function saveImage(){
    html2canvas(capturedImgs,{
        width: capturedImgs.offsetWidth,
        height: capturedImgs.offsetHeight
    }).then(canvas => {
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = 'image.png';
        link.click();
    });

}

saveBtn.addEventListener("click", saveImage);