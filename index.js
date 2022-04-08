const myPoints = [];
const lines = [];
const listColor = [];
const colorNumber = 10;

for (let i=0; i < colorNumber; i++) {
    const color = {
        name: `${i}`,
        rgb: [(i+1)*50 + 80, 0, (i+1)*20]
    }
    listColor.push(color);
}
const colors = document.querySelector('.colors');
for (const color of listColor) {
    const btn = document.createElement('button');
    btn.style.backgroundColor = toRGB(color.rgb[0], color.rgb[1], color.rgb[2]);
    btn.setAttribute('id', color.name);
    colors.appendChild(btn);
}

class Point {
    constructor(x, y, color, size, selected) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.selected = selected;
    }
    draw() {
        if (this.selected) {
            ctx.beginPath();
            ctx.fillStyle = 'blue';
            ctx.arc(this.x, this.y, 7, 0, 2*Math.PI);
            ctx.fill();

        }
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
        ctx.fill();
    }
}

class Line {
    constructor(start, end, color, lineWidth, selected) {
        this.start = start;
        this.end = end;
        this.color = color;
        this.lineWidth = lineWidth;
        this.selected = selected;
    }
    draw() {
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.lineWidth = this.lineWidth;
        ctx.stroke();
    }
}


let lastButton = colors.firstElementChild;
lastButton.setAttribute('class', 'clicked')
let selectedColor = toRGB(listColor[0].rgb[0], listColor[0].rgb[1], listColor[0].rgb[2]);
const container = document.querySelector('.container');

const undo = document.querySelector('.undo');

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = '470';

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, width, height);


function loop() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
 
    for (const point of myPoints) {
      point.draw();
    }
    for (const line of lines) {
        line.draw();
    }
 
    requestAnimationFrame(loop);
 }


container.addEventListener('click', (e) => {
    const xCoor = e.offsetX;
    const yCoor = e.offsetY;
    const  selected = collisionDetect(xCoor, yCoor, myPoints);
    if (selected === true) {
        myPoints.push(new Point(xCoor, yCoor, selectedColor, 6, true));
    } else {
        myPoints[selected].selected =  true;
    }
    /*if (myPoints.length > 0 && myPoints.length % 2 === 0) {
        const n = myPoints.length - 1;
        lines.push(new Line(myPoints[n-1], myPoints[n], selectedColor, 3));

    }*/
});



colors.addEventListener('click', (e) => {
    const id = e.target.getAttribute('id');
    if (id !== null) {
        const n = listColor[parseInt(id)];
        lastButton.setAttribute('class', 'notClicked')
        lastButton = e.target;
        selectedColor = toRGB(n.rgb[0], n.rgb[1], n.rgb[2]);
        e.target.setAttribute('class', 'clicked');
    }
});


function drawLine(start, end, color, lineWidth) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

function collisionDetect(u, v, myList) {
    let a = -1;
    for (let i = 0; i < myList.length; i++) {
        const dx = u - myList[i].x;
        const dy = v - myList[i].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        myList[i].selected = false;
        if (distance < 9) {
            a = i;
        }
        
    }

    if (a > -1) {
        return a;
    }
    return true;
}

undo.addEventListener('click', () => {
    if (lines.length > 0 && myPoints.length % 2 === 0) {
        lines.pop();
    }
    if (myPoints.length > 0) {
        myPoints.pop();
    }  
});

function toRGB (x, y, z) {
    return `rgb(${x}, ${y}, ${z})`;
}
loop();
