let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const erasertoggle = document.getElementById("eraser-toggle");
const erasersize = document.getElementById("eraser-size");
const brushbtn = document.getElementById("brush");
const colorpicker = document.getElementById("color-picker");
const sizeslider = document.getElementById("size-slider");
const circlebtn = document.getElementById("circle");
const rectanglebtn = document.getElementById("rectangle");
const clearboard = document.querySelector(".clear-board");
const tooloptionsbtns = document.querySelectorAll(".tool-options button");
const shapeFillToggle = document.getElementById("shape-fill");
const savebtn = document.querySelector(".save-btn");

let isDrawing = false;
let isErasing = false;
let isShapeFilled = false;
let brushSize = 5;
let eraserSizeValue = 5; 
let brushColor = "#000000";
let selectedShape = "brush";
let startX, startY;
let canvasState; 

canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;

canvas.addEventListener("mousedown", (e) => {
    if (isErasing) {
        isDrawing = true;
    } else if (selectedShape === "brush") {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    } else if (selectedShape === "circle" || selectedShape === "rectangle") {
        isDrawing = true;
        startX = e.offsetX;
        startY = e.offsetY;
        canvasState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
});

canvas.addEventListener("mouseup", (e) => {
    if (!isErasing) { 
        if (selectedShape === "circle") {
            let radius = Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2));
            ctx.beginPath();
            ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
            if (isShapeFilled) {
                ctx.fillStyle = brushColor;
                ctx.fill();
            } else {
                ctx.strokeStyle = brushColor;
                ctx.lineWidth = brushSize;
                ctx.stroke();
            }
        } 
        else if (selectedShape === "rectangle") {
            let width = e.offsetX - startX;
            let height = e.offsetY - startY;
            if (isShapeFilled) {
                ctx.fillStyle = brushColor;
                ctx.fillRect(startX, startY, width, height);
            } else {
                ctx.strokeStyle = brushColor;
                ctx.lineWidth = brushSize;
                ctx.strokeRect(startX, startY, width, height);
            }
        }
    }

    isDrawing = false;
});

canvas.addEventListener("mousemove", (e) => {
    if (!isDrawing) return;

    if (isErasing) {
        ctx.clearRect(e.offsetX - eraserSizeValue / 2, e.offsetY - eraserSizeValue / 2, 
                     eraserSizeValue, eraserSizeValue);
    } else if (selectedShape === "brush") {
        ctx.lineWidth = brushSize;
        ctx.lineCap = "round";
        ctx.strokeStyle = brushColor;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    } else if (selectedShape === "circle" && !isErasing) {
        ctx.putImageData(canvasState, 0, 0);
        let radius = Math.sqrt(Math.pow(e.offsetX - startX, 2) + Math.pow(e.offsetY - startY, 2));
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.stroke();
    }
    else if (selectedShape === "rectangle" && !isErasing) {
        ctx.putImageData(canvasState, 0, 0); 
        let width = e.offsetX - startX;
        let height = e.offsetY - startY;
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;
        ctx.strokeRect(startX, startY, width, height);
    }
});

erasertoggle.addEventListener("change", (e) => {
    isErasing = erasertoggle.checked;
    isDrawing = false;
});

shapeFillToggle.addEventListener("change", () => {
    isShapeFilled = shapeFillToggle.checked;
});

erasersize.addEventListener("input", () => {
    eraserSizeValue = parseInt(erasersize.value);
});

brushbtn.addEventListener("click", () => {
    selectedShape = "brush";
    isErasing = false;
    erasertoggle.checked = false;
});

circlebtn.addEventListener("click", () => {
    selectedShape = "circle";
    isErasing = false;
    erasertoggle.checked = false;
});

rectanglebtn.addEventListener("click", () => {
    selectedShape = "rectangle";
    isErasing = false;
    erasertoggle.checked = false;
});

colorpicker.addEventListener("input", () => {
    brushColor = colorpicker.value;
});

sizeslider.addEventListener("input", () => {
    brushSize = parseInt(sizeslider.value);
});

//Button selection logic
tooloptionsbtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        tooloptionsbtns.forEach((btn) => btn.classList.remove("active"));
        btn.classList.add("active");
    });
});

// Board Clear
clearboard.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    isDrawing = false;
    tooloptionsbtns.forEach((btn) => btn.classList.remove("active")); 
});

//Save Button 
savebtn.addEventListener("click", () => {
    const imageURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imageURL;
    link.download = "drawing.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});