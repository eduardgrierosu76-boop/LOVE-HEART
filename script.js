const CANVAS_WIDTH = 840;
const CANVAS_HEIGHT = 680;
const CANVAS_CENTER_X = CANVAS_WIDTH / 2;
const CANVAS_CENTER_Y = CANVAS_HEIGHT / 2;
const IMAGE_ENLARGE = 11;
const HEART_COLOR = "#ff2b4a";

// Heart curve
function heartFunction(t) {
    const x = 17 * Math.pow(Math.sin(t), 3);
    const y = -(16 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

    return {
        x: (x * IMAGE_ENLARGE) + CANVAS_CENTER_X,
        y: (y * IMAGE_ENLARGE) + CANVAS_CENTER_Y
    };
}

// Scatter points inside heart
function scatterInside(x, y, beta = 0.15) {
    const ratioX = -beta * Math.log(Math.random());
    const ratioY = -beta * Math.log(Math.random());
    const dx = ratioX * (x - CANVAS_CENTER_X);
    const dy = ratioY * (y - CANVAS_CENTER_Y);

    return {
        x: x - dx,
        y: y - dy
    };
}

// Shrink effect
function calcPosition(x, y, ratio) {
    const force = 1 / Math.pow(
        (Math.pow((x - CANVAS_CENTER_X), 2) + Math.pow((y - CANVAS_CENTER_Y), 2)),
        0.420
    );

    const dx = ratio * force * (x - CANVAS_CENTER_X);
    const dy = ratio * force * (y - CANVAS_CENTER_Y);

    return {
        x: x - dx,
        y: y - dy
    };
}

// Curve function
function curve(p) {
    return (2 * (2 + Math.sin(4 * p))) / (2 * Math.PI);
}

// Heart class
class Heart {
    constructor(generateFrame = 20) {
        this.points = [];
        this.build(2000);
        this.generateFrame = generateFrame;
        this.frames = [];

        for (let frame = 0; frame < generateFrame; frame++) {
            this.frames.push(this.calc(frame));
        }
    }

    build(number) {
        for (let i = 0; i < number; i++) {
            const t = Math.random() * 2 * Math.PI;
            const { x, y } = heartFunction(t);
            this.points.push({ x, y });
        }
    }

    calc(frame) {
        const ratio = 15 * curve((frame / 10) * Math.PI);
        const newPoints = [];

        for (const { x, y } of this.points) {
            const { x: nx, y: ny } = calcPosition(x, y, ratio);
            newPoints.push({ x: nx, y: ny });
        }

        return newPoints;
    }

    render(ctx, frame) {
        const points = this.frames[frame % this.generateFrame];

        ctx.fillStyle = HEART_COLOR;
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.shadowColor = HEART_COLOR;
        ctx.shadowBlur = 10;

        for (const { x, y } of points) {
            ctx.fillText("i love you", x, y);
        }
    }
}

// Draw loop
function draw() {
    const canvas = document.getElementById('Canvas');
    const ctx = canvas.getContext('2d');
    const heart = new Heart();

    function renderFrame(frame) {
        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        heart.render(ctx, frame);
        requestAnimationFrame(() => renderFrame(frame + 1));
    }

    renderFrame(0);
}

draw();
