let members = await fetch('https://jbcarreon123.github.io/webrings/ssgring/members.json');

export default {
  match: 'host',
  value: location.host,

  list: await members.json(),

  defaultWidget: `
      <div class="ssgring">
        <a href="https://jbcarreon123.nekoweb.org/webrings/ssgring">This site is not on SSGRing yet.<a>
      </div>
    `,

  widget: `
      <div class="ssgring">
        <a href="https://{prev.host}">&lt; ({prev.username})</a>
        <p><a href="https://jbcarreon123.nekoweb.org/webrings/ssgring">SSGRing</a></p>
        <a href="https://{next.host}">({next.username}) &gt;</a>
      </div>
    `,

  style: `
      :webring {
        padding:10px;
        position:relative;  

        div {
          display: flex;
          gap: 6px;
          justify-content: space-around;
        }

        p {
          text-align: center;
        }

        div a:last-child {
          text-align: right;
        }

        &.afterdark {
          font-family: Arial, sans-serif;
          background: #141414;
          color: #cbcbcd;
  
          a { color: #52eea3 }
        }

        &.brat {
          background:#8ACE00;
          font-family:Arial Narrow;
          color:black;

          & > * {
            filter:blur(0.5px)
          }
        }
      }
    `
}