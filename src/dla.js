// Diffusion Limited Aggregation (DLA) simulation

export class DLASimulation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.radius = 100; // Decreased radius
        this.center = { x: this.radius+190, y: this.height / 2 }; // Center shifted right

        // Tree structure - set of occupied points
        this.tree = new Set();

        // Seed position at center of canvas
        this.seedPosition = { x: this.center.x, y: this.center.y };

        // Track particle count for color intervals
        this.particleCount = 0;
        this.maxParticles = 1250; // Estimate for full tree (reduced for faster transitions)

        // Add seed at position
        this.addPoint(this.seedPosition.x, this.seedPosition.y);

        // Maximum distance from center that tree has reached
        this.maxRadius = 0;

        // Animation state
        this.running = false;
        this.animationId = null;
    }

    // Convert point to string key for Set
    pointKey(x, y) {
        return `${Math.floor(x)},${Math.floor(y)}`;
    }

    // Add point to tree with time-based color
    addPoint(x, y) {
        const key = this.pointKey(x, y);
        this.tree.add(key);

        // Update max radius
        const dist = Math.sqrt((x - this.center.x) ** 2 + (y - this.center.y) ** 2);
        this.maxRadius = Math.max(this.maxRadius, dist);

        // Increment particle count
        this.particleCount++;

        // Calculate color based on time interval (3 intervals: dark to light gold)
        const progress = this.particleCount / this.maxParticles;
        let color;
        if (progress < 0.33) {
            // First third: website gold (darkest)
            color = '#F5C842';
        } else if (progress < 0.67) {
            // Second third: lighter gold
            color = '#f8d86a';
        } else {
            // Final third: very light gold
            color = '#fbe998';
        }

        // Draw the point with time-based color
        this.ctx.fillStyle = color;
        this.ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
    }

    // Check if point is adjacent to tree
    isAdjacentToTree(x, y) {
        // Check 8 neighbors
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const key = this.pointKey(x + dx, y + dy);
                if (this.tree.has(key)) {
                    return true;
                }
            }
        }
        return false;
    }

    // Check if point is inside the circle
    isInsideCircle(x, y) {
        const dist = Math.sqrt((x - this.center.x) ** 2 + (y - this.center.y) ** 2);
        return dist <= this.radius;
    }

    // Check if a full circle has formed around the border
    hasFormedFullCircle() {
        // Sample points around the circle at the radius
        const numSamples = 36; // Check every 10 degrees
        const checkRadius = this.radius - 2; // Check slightly inside the radius

        for (let i = 0; i < numSamples; i++) {
            const angle = (i / numSamples) * Math.PI * 2;
            const x = this.center.x + checkRadius * Math.cos(angle);
            const y = this.center.y + checkRadius * Math.sin(angle);

            // Check if there's a particle near this point
            let foundNearby = false;
            for (let dx = -3; dx <= 3; dx++) {
                for (let dy = -3; dy <= 3; dy++) {
                    const key = this.pointKey(x + dx, y + dy);
                    if (this.tree.has(key)) {
                        foundNearby = true;
                        break;
                    }
                }
                if (foundNearby) break;
            }

            // If any sample point doesn't have a particle nearby, circle is not complete
            if (!foundNearby) {
                return false;
            }
        }

        return true;
    }

    // Perform one iteration of DLA
    iterate() {
        // Spawn particle at random angle on circle boundary around the seed
        const spawnRadius = Math.min(this.maxRadius + 20, this.radius - 2);
        const angle = Math.random() * Math.PI * 2;

        let x = this.seedPosition.x + spawnRadius * Math.cos(angle);
        let y = this.seedPosition.y + spawnRadius * Math.sin(angle);

        // Random walk until particle sticks or leaves bounds
        let steps = 0;
        const maxSteps = 10000;

        while (steps < maxSteps) {
            // Check if adjacent to tree
            if (this.isAdjacentToTree(x, y)) {
                this.addPoint(x, y);
                return true;
            }

            // Random walk step
            const dx = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            const dy = Math.floor(Math.random() * 3) - 1;

            x += dx;
            y += dy;

            // Check if outside circle boundary (particle escaped)
            const dist = Math.sqrt((x - this.center.x) ** 2 + (y - this.center.y) ** 2);
            if (dist > this.radius - 2) {
                return false; // Particle escaped circle
            }

            steps++;
        }

        return false; // Max steps reached
    }

    // Start animation
    start() {
        if (this.running) return;

        this.running = true;

        const animate = () => {
            if (!this.running) return;

            // Run multiple iterations per frame for speed
            for (let i = 0; i < 5; i++) {
                this.iterate();

                // Stop if tree reaches circle radius
                if (this.maxRadius >= this.radius - 2) {
                    this.stop();
                    return;
                }
            }

            this.animationId = requestAnimationFrame(animate);
        };

        animate();
    }

    // Stop animation
    stop() {
        this.running = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    // Draw the circle boundary
    drawCircle() {
        this.ctx.strokeStyle = '#F5C842';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    // Clear and reset
    reset() {
        this.stop();
        this.tree.clear();
        this.maxRadius = 0;
        this.particleCount = 0;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.addPoint(this.seedPosition.x, this.seedPosition.y);
    }
}
