<template>
    <div ref="containerRef" class="absolute inset-0 z-0">
        <canvas ref="canvasRef" class="w-full h-full"></canvas>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from 'vue';

const props = defineProps({
    particleCount: {
        type: Number,
        default: 50
    },
    connectionDistance: {
        type: Number,
        default: 200.0
    },
    interactionRadius: {
        type: Number,
        default: 200.0
    },
    particleColor: {
        type: String,
        default: '#ffffff'
    },
    lineColor: {
        type: String,
        default: '#ffffff'
    }
});

const canvasRef = ref(null);
const containerRef = ref(null); // Reference to the parent div
let particles = [];
let animationFrameId = null;
let mousePosition = { x: 0, y: 0 };
let canvas = null;
let ctx = null;
let connectionDistanceSq = props.connectionDistance * props.connectionDistance;
let interactionRadiusSq = props.interactionRadius * props.interactionRadius;
let resizeObserver = null;

class Particle {
    constructor(x, y, vx, vy, color, size) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.size = size;
    }
}

const generateParticles = () => {
    particles = Array.from({ length: props.particleCount }, () => {
        return new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            Math.random() * 4 - 2,
            Math.random() * 4 - 2,
            props.particleColor,
            Math.random() * 4
        );
    });
};

const updateParticles = () => {
    const interactingParticles = [];

    particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        const dx = p.x - mousePosition.x;
        const dy = p.y - mousePosition.y;
        const sqDistanceToMouse = dx * dx + dy * dy;

        if (sqDistanceToMouse < interactionRadiusSq && sqDistanceToMouse > 0) {
            interactingParticles.push(p);
        }

        if (p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
            p.x = Math.random() * canvas.width;
            p.y = Math.random() * canvas.height;
        }
    });

    interactingParticles.forEach(p => {
        const dx = p.x - mousePosition.x;
        const dy = p.y - mousePosition.y;
        const distanceToMouse = Math.sqrt(dx * dx + dy * dy);
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);

        p.vx = (dx / distanceToMouse) * speed;
        p.vy = (dy / distanceToMouse) * speed;

        p.x += p.vx * 10;
        p.y += p.vy * 10;
    });
};

const hexToRgb = (hex) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const drawParticles = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gridSize = props.connectionDistance;
    const grid = new Map();

    particles.forEach(p => {
        const gridKey = `${Math.floor(p.x / gridSize)}_${Math.floor(p.y / gridSize)}`;
        if (!grid.has(gridKey)) {
            grid.set(gridKey, []);
        }
        grid.get(gridKey).push(p);
    });

    const lineRgb = hexToRgb(props.lineColor);

    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 2 * Math.PI);
        ctx.fillStyle = props.particleColor;
        ctx.fill();

        const gridX = Math.floor(p.x / gridSize);
        const gridY = Math.floor(p.y / gridSize);

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const neighborKey = `${gridX + i}_${gridY + j}`;
                if (grid.has(neighborKey)) {
                    grid.get(neighborKey).forEach(other => {
                        if (p !== other) {
                            const dx = p.x - other.x;
                            const dy = p.y - other.y;
                            const distanceSq = dx * dx + dy * dy;

                            if (distanceSq < connectionDistanceSq) {
                                const distance = Math.sqrt(distanceSq);
                                const factor = 1.0 - (distance / props.connectionDistance);
                                const alpha = Math.floor(factor * 150);

                                ctx.beginPath();
                                ctx.moveTo(p.x, p.y);
                                ctx.lineTo(other.x, other.y);
                                ctx.strokeStyle = `rgba(${lineRgb.r}, ${lineRgb.g}, ${lineRgb.b}, ${alpha / 255})`;
                                ctx.lineWidth = 0.2;
                                ctx.stroke();
                            }
                        }
                    });
                }
            }
        }
    });
};

const animate = () => {
    updateParticles();
    drawParticles();
    animationFrameId = requestAnimationFrame(animate);
};

const handleMouseMove = (event) => {
    mousePosition.x = event.offsetX;
    mousePosition.y = event.offsetY;
};

const resizeCanvas = () => {
    // Check if both canvas and its container exist
    if (canvas && containerRef.value) {
        // Set canvas dimensions to match the container's dimensions
        canvas.width = containerRef.value.offsetWidth;
        canvas.height = containerRef.value.offsetHeight;
        generateParticles();
    }
};

onMounted(() => {
    canvas = canvasRef.value;
    ctx = canvas.getContext('2d');

    // Use a ResizeObserver to watch for changes in the container's size
    resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target === containerRef.value) {
                resizeCanvas();
            }
        }
    });

    // Start observing the container
    if (containerRef.value) {
        resizeObserver.observe(containerRef.value);
    }

    // Initial size setup
    resizeCanvas();

    canvas.addEventListener('mousemove', handleMouseMove);
    animate();
});

onUnmounted(() => {
    cancelAnimationFrame(animationFrameId);

    // Disconnect the ResizeObserver
    if (resizeObserver && containerRef.value) {
        resizeObserver.unobserve(containerRef.value);
    }

    if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
    }
});

watch([() => props.particleColor, () => props.lineColor], () => {
    generateParticles();
});
</script>