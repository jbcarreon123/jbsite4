// track list
let t = []
let e = document.querySelector('.tracklist-and-credits tbody'); 
let els = e.querySelectorAll('.even, .odd'); 
els.forEach((el) => {
	t.push({
		title: el.querySelector('.title a bdi').textContent,
		artists: [...[...el.querySelectorAll('.wrap-anywhere bdi a')].map((a) => a.textContent)],
		songNumber: Number.parseInt(el.querySelector('.pos a').textContent),
    length: el.querySelector('.treleases').textContent
	})
})

// links
let l = []
let links = document.querySelector('.external_links');
links.querySelectorAll('li a').forEach(a => {
	l.push({
		name: a.textContent,
		url: a.href
	})
})

let link = document.querySelector('a.artwork-image').href;
link = link.replace('.png', '-250.png');
link = link.replace('.jpg', '-250.jpg');

// release info
let rh = document.querySelector('.releaseheader');
let r = {
	name: rh.querySelector('h1 a bdi').textContent,
	artist: rh.querySelector('.subheader bdi a').textContent,
	tracks: t,
	links: l,
	image: link
}

const regex = /"(\w+)":/gm;
const subst = `$1:`;
const str = JSON.stringify(r, null, 4);
const result = str.replace(regex, subst);

console.log(result);
navigator.clipboard.writeText(result);