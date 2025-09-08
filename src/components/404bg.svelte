<script>
    import { onMount, onDestroy } from "svelte";
    import Matter from "matter-js";

    let width, height;

    let container;
    let engine;
    let world;
    let bodies = [];
    let wordElements = [];
    let runner;
    let mouseConstraint;

    onMount(async () => {
        let words = ["404", "Not found", window.location.pathname];
        let fontSize = 48;
        width =
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
        height =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;
        let wordCount = width < 640 ? 8 : 24;

        var Engine = Matter.Engine,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Body = Matter.Body,
            Runner = Matter.Runner,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        setupPhysics();

        onDestroy(() => {
            if (runner) Runner.stop(runner);
            if (engine) {
                World.clear(world);
                Engine.clear(engine);
            }
        });

        function setupPhysics() {
            engine = Engine.create();
            world = engine.world;
            const ground = Bodies.rectangle(width / 2, height - 10, width, 20, {
                isStatic: true,
            });
            const leftWall = Bodies.rectangle(10, height / 2, 20, height, {
                isStatic: true,
            });
            const rightWall = Bodies.rectangle(
                width - 10,
                height / 2,
                20,
                height,
                { isStatic: true },
            );
            const ceiling = Bodies.rectangle(width / 2, 10, width, 20, {
                isStatic: true,
            });
            World.add(world, [ground, leftWall, rightWall, ceiling]);
            createWords();
            const mouse = Mouse.create(container);
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    render: {
                        visible: false,
                    },
                },
            });
            World.add(world, mouseConstraint);
            runner = Runner.create();
            Runner.run(runner, engine);
            updateLoop();
        }

        function createWords() {
            for (let i = 0; i < wordCount; i++) {
                const word = words[Math.floor(Math.random() * words.length)];
                const el = document.createElement("div");
                el.textContent = word;
                el.className = "word";
                el.style.fontSize = fontSize + "px";
                container.appendChild(el);
                const wordWidth = word.length * fontSize * 0.6;
                const wordHeight = fontSize * 1.2;
                const x =
                    Math.random() * (width - wordWidth - 40) +
                    wordWidth / 2 +
                    20;
                const y =
                    Math.random() * (height - wordHeight - 100) +
                    wordHeight / 2 +
                    50;
                const body = Bodies.rectangle(x, y, wordWidth, wordHeight);
                body.word = word;
                body.element = el;
                World.add(world, body);
                bodies.push(body);
                wordElements.push(el);
            }
        }

        function updateLoop() {
            bodies.forEach((body) => {
                const el = body.element;
                if (el) {
                    const wordWidth = body.word.length * fontSize * 0.6;
                    const wordHeight = fontSize * 1.2;
                    el.style.transform = `translate(${body.position.x - wordWidth / 2}px, ${body.position.y - wordHeight / 2}px) rotate(${body.angle}rad)`;
                    if (mouseConstraint.body === body) {
                        el.style.transform += " scale(1.1)";
                    }
                }
            });
            requestAnimationFrame(updateLoop);
        }
    });
</script>

<div class="physics-container">
    <div
        bind:this={container}
        class="physics-world"
        style="width: {width}px; height: {height}px;"
    ></div>
</div>

<style>
    .physics-container {
        position: fixed;
        inset: 0;
        
    }

    :global(.word) {
        position: absolute;
        font-weight: bold;
        color: var(--text);
        pointer-events: none;
        user-select: none;
        font-family: var(--font);
        transform-origin: center center;
        background: transparent;
        transition: transform 0.1s ease;
    }
</style>
