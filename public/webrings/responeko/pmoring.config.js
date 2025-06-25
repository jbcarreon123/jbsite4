let members = await fetch('https://jbcarreon123.github.io/webrings/responeko/members.json');

export default {
    match: 'host',
    value: location.host,
    altMatch: 'altHosts',

    list: await members.json(),

    defaultWidget: `
    <div class="phone-container" style="--width: 350px">
            <div class="phone not">
              <div id="responeko-phone" class="items">
                <p>This page isn't on the Responeko Ring yet! If you are, hard reload the page!</p>
              </div>
            </div>
    </div>
  `,

    localhostWiget: `
    <div class="phone-container" style="--width: 350px">
            <div class="phone not">
              <div id="responeko-phone" class="items">
                <p>The Responeko widget doesn't work with localhost, sadly :(</p>
              </div>
            </div>
    </div>
    `,

    widget: `
    <div class="phone-container">
            <div class="phone">
                <div class="btn-container top">
                    <a href="//jbcarreon123.nekoweb.org/webrings/responeko">Responeko Ring</a>
                </div>
                <div id="responeko-phone" class="items">
                    <div class="divider"></div>
                    <a href="//{prev.host}">
                    <div class="item">
                        <div class="title">
                            <p id="prev-title">{prev.title}</p>
                        </div>
                        <div class="fallback-img">
                            <div class="img" style="--img:url({prev.expression})"></div>
                        </div>
                    </div>
                    </a>
                    <div class="item">
                        <div class="title">
                            <p id="title">{item.title}</p>
                        </div>
                        <div class="fallback-img">
                            <div class="img" style="--img:url({item.expression})"></div>
                        </div>
                    </div>
                    <a href="//{next.host}">
                        <div class="item">
                            
                            <div class="title">
                                <p>{next.title}</p>
                            </div>
                            <div class="fallback-img">
                                <div class="img" style="--img:url({next.expression})"></div>
                            </div>
                        </div>
                    </a>
                    <div class="divider"></div>
                </div>
                <div class="btn-container btm">
                    <a href="//{random.host}">Random site</a>
                </div>
            </div>
        </div>
  `,

    style: `
    :webring {
      .btn-container {
        position:relative;
        width: fit-content;
        margin: 0 auto;
        text-align: center;
        z-index:999;
    }

    .btn-container.btm {
        bottom: 40px;
    }

    .btn-container.top {
        top: 15px;
    }

    .btn-container a {
        color: #fff;
        padding: 6px;
        border-radius: 5px;
        background-color: rgba(32, 32, 32, 128);
    }

    p {
        padding: 0;
        margin: 0;
        text-shadow: #fff 1px 1px 2px;
        font-weight: 600;
        color:rgb(75, 56, 62);
    }

    .not p {
        text-align: center;
        background-color: rgba(32, 32, 32, 128);
        padding: 6px;
        text-shadow: none;
        color: white;
    }

    .phone-container {
        height: calc(var(--width) + 24px);
        width: calc(calc(var(--width) + 24px) * 0.5);

        border: 12px solid black;
        border-radius: 10px;

        margin: 0 auto;

        --width: 350px;
    }

    .phone {
        background-image: url(//nekoweb.org/assets/nekopattern.png);
        height: var(--width);
        background-position: center;
        background-repeat: repeat;
    }

    .phone:not(.not) .items {
      margin-top: -25px;
    }

    .phone.not {
        margin-top: 0px;
    }

    .items {
        align-items: center;

        display: flex;
        flex-direction: row;
        gap: 12px;

        width: inherit;
        height: 100%;

        overflow-x: auto;
        overflow-y: hidden;

        z-index: 2;
        position: relative;
        
    }

    .item {
        display: flex;
        flex-direction: column;
        gap: 6px;
    }

    .item .title {
        align-self: flex-start;
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 6px;
        font-size: 12px;
    }

    .item .title img {
        width: 14px;
        height: 14px;
    }

    .item .img {
        background-image: var(--img, url(https://jbcarreon123.nekoweb.org/imgs/responeko/placeholder.png));
        background-position: center;
        background-size: cover;
        width: calc(var(--width) * 0.30);
        height: calc(var(--width) * 0.5);

        border-radius: 7px;

        overflow: hidden;
    }

    .fallback-img {
        background-image: url(https://jbcarreon123.nekoweb.org/imgs/responeko/placeholder.png);
    }

    .divider {
        min-width: 2px !important;
        height: inherit;
    }

    button {
        font: 11pt "MS PGothic", Tahoma, Verdana;
    }

    font: 11pt "MS PGothic", Tahoma, Verdana;
    * {
        box-sizing: border-box;
    }
    }
  `
}