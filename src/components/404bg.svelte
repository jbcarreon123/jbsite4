<script>
    import { onMount, onDestroy } from "svelte";
    import Matter from "matter-js";
    import btns from "/buttons.json?url";
    let width, height;

    let container;
    let engine;
    let world;
    let bodies = [];
    let wordElements = [];
    let runner;
    let diag;
    let mouseConstraint;
    let c = 0;
    let buttons = [];
    let resizeTimeout;
    let walls = {
        ground: null,
        leftWall: null,
        rightWall: null,
        ceiling: null,
        diagBody: null
    };

    /**
     * @type {HTMLAnchorElement | undefined}
     */
    let hoverlink;

    function updateDimensions() {
        width =
            window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
        height =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;
    }

    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function updateWalls() {
        if (!world) return;

        Matter.Body.setPosition(walls.ground, { x: width / 2, y: height + 15 });
        Matter.Body.setVertices(walls.ground, Matter.Bodies.rectangle(width / 2, height + 15, width, 50).vertices);

        Matter.Body.setPosition(walls.leftWall, { x: -15, y: height / 2 });
        Matter.Body.setVertices(walls.leftWall, Matter.Bodies.rectangle(-15, height / 2, 50, height + 600).vertices);

        Matter.Body.setPosition(walls.rightWall, { x: width + 15, y: height / 2 });
        Matter.Body.setVertices(walls.rightWall, Matter.Bodies.rectangle(width + 15, height / 2, 50, height + 600).vertices);

        Matter.Body.setPosition(walls.ceiling, { x: width / 2, y: -300 });
        Matter.Body.setVertices(walls.ceiling, Matter.Bodies.rectangle(width / 2, -300, width, 50).vertices);

        if (!matchMedia("(width <= 640px)").matches && diag) {
            if (walls.diagBody) {
                Matter.Body.setPosition(walls.diagBody, { x: width / 2, y: height / 2 });
                Matter.Body.setVertices(walls.diagBody, Matter.Bodies.rectangle(width / 2, height / 2, diag.clientWidth, diag.clientHeight).vertices);
            } else {
                walls.diagBody = Matter.Bodies.rectangle(
                    width / 2,
                    height / 2,
                    diag.clientWidth,
                    diag.clientHeight,
                    { isStatic: true }
                );
                Matter.World.add(world, walls.diagBody);
            }
        } else if (walls.diagBody) {
            Matter.World.remove(world, walls.diagBody);
            walls.diagBody = null;
        }

        bodies.forEach((body) => {
            const wordWidth = 88;
            const wordHeight = 31;
            let x = body.position.x;
            let y = body.position.y;
            
            if (x < wordWidth / 2) x = wordWidth / 2;
            if (x > width - wordWidth / 2) x = width - wordWidth / 2;
            if (y > height - wordHeight / 2) y = height - wordHeight / 2;
            
            Matter.Body.setPosition(body, { x, y });
        });
    }

    function handleResize() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateDimensions();
            updateWalls();
        }, 10);
    }

    function setupPhysics() {
        var Engine = Matter.Engine,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Runner = Matter.Runner,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint;

        engine = Engine.create();
        world = engine.world;
        
        walls.ground = Bodies.rectangle(width / 2, height + 15, width, 50, {
            isStatic: true,
        });
        walls.leftWall = Bodies.rectangle(
            -15,
            height / 2,
            50,
            height + 300 * 2,
            {
                isStatic: true,
            },
        );
        walls.rightWall = Bodies.rectangle(
            width + 15,
            height / 2,
            50,
            height + 300 * 2,
            { isStatic: true },
        );
        walls.ceiling = Bodies.rectangle(width / 2, -300, width, 50, {
            isStatic: true,
        });
        
        World.add(world, [walls.ground, walls.leftWall, walls.rightWall, walls.ceiling]);
        
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

        if (!matchMedia("(width <= 640px)").matches) {
            walls.diagBody = Bodies.rectangle(
                width / 2,
                height / 2,
                diag.clientWidth,
                diag.clientHeight,
                {
                    isStatic: true
                },
            );
            World.add(world, walls.diagBody);
        }
        
        createWords();
        updateLoop();

        container.addEventListener("mousedown", (event) => {
            if (event.button === 1) {
                event.preventDefault();
                const mousePosition = {
                    x: event.offsetX,
                    y: event.offsetY,
                };
                const bodies = Matter.Query.point(
                    engine.world.bodies,
                    mousePosition,
                );
                if (bodies.length > 0) {
                    const clickedBody = bodies[0];
                    document.open(
                        clickedBody.element.dataset.mainSite,
                        "",
                        "noopener=true",
                    );
                }
            }
        });
    }

    function createWords() {
        const wordCount = width < 640 ? getRndInteger(10, 30) : buttons.length;
        
        const currBtns = []
        for (let i = 0; i < wordCount; i++) {
            setTimeout(() => {
                const word =
                    buttons[
                        width < 640
                            ? Math.floor(Math.random() * buttons.length)
                            : i
                    ];
                if (!currBtns.includes(word)) {
                    currBtns.push(word);
                    const el = document.createElement("img");
                    el.transform = "translateY(-200px)";
                    el.src = word.slug + "?test=" + Math.random();
                    el.className = "word";
                    el.style.visibility = "hidden";
                    el.loading = "eager";
                    el.dataset.mainSite = word.url;
                    container.appendChild(el);
                    const wordWidth = 88;
                    const wordHeight = 31;
                    const x =
                        Math.random() * (width - wordWidth - 40) +
                        wordWidth / 2 +
                        20;
                    const y = -wordHeight - 200;
                    const body = Matter.Bodies.rectangle(x, y, wordWidth, wordHeight, {
                        density: 0.01
                    });
                    body.word = word;
                    body.element = el;
                    el.addEventListener("load", () => {
                        Matter.World.add(world, body);
                        bodies.push(body);
                        wordElements.push(el);
                        el.style.visibility = "";
                    });
                } else { i-- }
            }, i * 25);
        }
    }

    function updateLoop() {
        bodies.forEach((body) => {
            const el = body.element;
            if (el) {
                const wordWidth = 88;
                const wordHeight = 31;
                el.style.transform = `translate(${body.position.x - wordWidth / 2}px, ${body.position.y - wordHeight / 2}px) rotate(${body.angle}rad)`;
                if (mouseConstraint.body === body) {
                    el.style.transform += " scale(1.1)";
                }
            }
        });
        requestAnimationFrame(updateLoop);
    }

    onMount(async () => {
        let fr = await fetch(btns);
        let Buttons = await fr.json();

        let siteButtons = [
            "/imgs/buttons/jbtn.svg",
            "/sitebutton.png",
            "/sitebutton2.png",
            "/sitebutton3.png",
            "/sitebuttonv2.png",
        ].map((x) => ({
            url: "https://wf.jbc.lol/",
            title: "",
            alt: "wf.jbc.lol button",
            imgUrl: "",
            slug: x,
        }));

        let processedButtons = Buttons.filter(
            (btn) => !btn.imgUrl || !btn.imgUrl?.startsWith("/imgs"),
        ).map((btn) => {
            let dom = new URL(btn.url);
            let url = btn.imgUrl ? new URL(btn.imgUrl) : null;
            let spl = url
                ? url.pathname.split("/")
                : ["placeholder_button.svg"];
            let ext = spl[spl.length - 1];
            let fex = ext.split(".");

            return {
                ...btn,
                slug: `/imgs/site-buttons/${dom.hostname}.${fex[fex.length - 1]}`,
            };
        });

        let nonbtns = Buttons.filter((btn) =>
            btn.imgUrl?.startsWith("/imgs"),
        ).map((btn) => ({
            ...btn,
            slug: btn.imgUrl,
        }));

        buttons = processedButtons.concat(nonbtns).concat(siteButtons);
        console.log(buttons);

        updateDimensions();
        setupPhysics();

        window.addEventListener("resize", handleResize);
    });

    onDestroy(() => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(resizeTimeout);
        if (runner) Matter.Runner.stop(runner);
        if (engine) {
            Matter.World.clear(world);
            Matter.Engine.clear(engine);
        }
    });
</script>

<div class="main">
    <div class="inst">
        <h2>drag buttons by pressing and holding them then drag them</h2>
        <h2>open buttons to their main site by middle clicking</h2>
    </div>

    <div class="physics-container">
        <div
            bind:this={container}
            class="physics-world"
            style="width: {width}px; height: {height}px;"
        ></div>
    </div>
    <div class="diag" bind:this={diag}>
        <h1>Huh, seems like we can't find the page, unfortunately.</h1>
        <p>
            <a href="/home/">Back home?</a>
            <span class="found-on-v3">
                We can't find it here, but we found it on jbsite3. <a
                    href="/"
                    target="_blank"
                    >Wanna go there? <span
                        aria-hidden="true"
                        class="ms"
                        data-icon="open_in_new"
                    ></span></a
                >
            </span>
        </p>
    </div>
</div>

<style>
    .physics-container {
        position: fixed;
        inset: 0;
    }

    .inst {
        position: fixed;
        top: 24px;
        left: 24px;

        h2 {
            font-weight: normal;
            font-style: italic;
            opacity: 0.25;
        }
    }

    img {
        transition: all 100ms ease-in-out;
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
        background-image: var(--img);
        width: 88px;
        height: 31px;
    }

    @media (width < 640px) {
        .inst h2:last-child {
            display: none;
        }
    }
</style>