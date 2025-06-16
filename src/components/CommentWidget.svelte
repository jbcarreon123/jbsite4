<script lang="ts">
	// Import stuff, do not remove or touch this!
	import { onMount } from 'svelte';
	const { disabled, pagePath, hideTitle = false } = $props();

	import MarkdownIt from 'markdown-it';
	import sanitizeHtml from 'sanitize-html';
	const parser = new MarkdownIt({
		html: true,
		linkify: true
	});

	var defaultRender = parser.renderer.rules.link_open || function (tokens, idx, options, env, self) {
		return self.renderToken(tokens, idx, options);
	};

	parser.renderer.rules.link_close = function (tokens, idx, options, env, self) {
		return ' <span aria-hidden="true" class="ms" data-icon="open_in_new"></span>' + self.renderToken(tokens, idx, options);
	};

	parser.renderer.rules.link_open = function (tokens, idx, options, env, self) {
		// Add a new `target` attribute, or replace the value of the existing one.
		tokens[idx].attrSet('target', '_blank');
		console.log(tokens[idx])

		// Pass the token to the default renderer.
		return defaultRender(tokens, idx, options, env, self);
	};

	/*
        (PLEASE DO NOT DELETE THIS HEADER OR CREDIT!)

        Svelte Comment Widget:
		Ayano's Comment Widget port to Svelte component by jbcarreon123
        Original script is from Ayano (https://virtualobserver.moe/).

        User customizable settings below!
        If you're confused, refer to the guides at:
         - https://virtualobserver.moe/ayano/comment-widget for configuring the widget, and
         - https://jbcarreon123.nekoweb.org/utils/svelte-comment-widget for more complex stuff.
        The IDs below are a requirement but everything else is optional!
        Do not delete any settings even if you aren't using them! Vite will throw an error and
        it will result for your site to not build correctly.

        After filling out your options, just paste this anywhere you want a comment section

            In your <script> tag:
                - import CommentWidget from 'where/is/CommentWidget.svelte'
            And this:
                - <CommentWidget />

        Have fun! Bug reports are encouraged if you happen to run into any issues.

        IMPORTANT NOTES:
         - This widget will be minified by Svelte (or Astro) on compile time.
           You can't edit it when it's compiled (not with more headaches).
         - Adding addons (like Layercake's Admin addon) is done differently.
           See https://jbcarreon123.nekoweb.org/utils/svelte-comment-widget#addons
           for more info.
         - If you're using Astro, make sure that the Svelte integration is installed.
           If not, just run `npx astro add svelte` and you are good to go.
		 - This also opens more possibilities to style your comments! You can now
		   use npm packages and such for it!
    */

	// Change comment-widget.css with your CSS filename. Must be on the
	// same directory as this file to work!
	// If you are on Astro, import this file seperately, probably in your
	// layout.astro file, and comment this out.
	// import './comment-widget-dark.css';

	// The values in this section are REQUIRED for the widget to work! Keep them in quotes!
	let s_formId = '1FAIpQLSfDoGhnkYuiIsJ70RRFKUYVPskh_IvDJ3Ui0zPTIWQiofO2Cw';
	let s_nameId = '1438018472';
	let s_websiteId = '1977262085';
	let s_textId = '1023604070';
	let s_pageId = '1264996779';
	let s_replyId = '1483089937';
	let s_adminId = '87020257';
	let s_sheetId = '1G0WA49Y7kBWbltxIxz9VGECiH58fvBbI4hje0rGvdc8';

	// The values below are necessary for accurate timestamps, I've filled it in with EST as an example
	let s_timezone = +8; // Your personal timezone (Example: UTC-5:00 is -5 here, UTC+10:30 would be 10.5)
	let s_daylightSavings = false; // If your personal timezone uses DST, set this to true
	// For the dates DST start and end where you live: [Month, Weekday, which number of that weekday, hour (24 hour time)]
	let s_dstStart = ['March', 'Sunday', 2, 2]; // Example shown is the second Sunday of March at 2:00 am
	let s_dstEnd = ['November', 'Sunday', 1, 2]; // Example shown is the first Sunday of November at 2:00 am

	// Misc - Other random settings
	let s_commentsPerPage = 5; // The max amount of comments that can be displayed on one page, any number >= 1 (Replies not counted)
	let s_maxLength = 1024; // The max character length of a comment
	let s_maxLengthName = 24; // The max character length of a name
	let s_commentsOpen = !(false || disabled); // Change to false if you'd like to close your comment section site-wide (Turn it off on Google Forms too!)
	let s_collapsedReplies = false; // True for collapsed replies with a button, false for replies to display automatically
	let s_longTimestamp = false; // True for a date + time, false for just the date
	let s_includeUrlParameters = false; // Makes new comment sections on pages with URL parameters when set to true (If you don't know what this does, leave it disabled)
	let s_fixRarebitIndexPage = false; // If using Rarebit, change to true to make the index page and page 1 of your webcomic have the same comment section

	// Word filter - Censor profanity, etc
	let s_wordFilterOn = false; // True for on, false for off
	let s_filterReplacement = '****'; // Change what filtered words are censored with (**** is the default)
	let s_filteredWords = [
		// Add words to filter by putting them in quotes and separating with commas (ie. 'heck', 'dang')
		'heck',
		'dang'
	];

	// Text - Change what messages/text appear on the form and in the comments section (Mostly self explanatory)
	let s_widgetTitle = $state('What do you think?');
	let s_nameFieldLabel = 'Name';
	let s_websiteFieldLabel = 'Website (Optional)';
	let s_textFieldLabel = '';
	let s_submitButtonLabel = 'Submit';
	let s_loadingText = 'Loading comments...';
	let s_noCommentsText = 'No comments yet!';
	let s_closedCommentsText = 'Comments are disabled on this post.';
	let s_websiteText = ' <span aria-hidden="true" class="ms" data-icon="open_in_new"></span> '; // The links to websites left by users on their comments
	let s_replyButtonText = '<span aria-hidden="true" class="ms" data-icon="reply"></span> Reply'; // The button for replying to someone
	let s_replyLockedText = '<span aria-hidden="true" class="ms" data-icon="lock"></span> Locked';
	let s_replyingText = '<span aria-hidden="true" class="ms" data-icon="reply"></span> Replying to'; // The text that displays while the user is typing a reply
	let s_pinnedText = '<span aria-hidden="true" class="ms c-admin" data-icon="keep"></span>';
	let s_expandRepliesText = 'Show Replies';
	let s_leftButtonText = '<span aria-hidden="true" class="ms" data-icon="arrow_back_ios_new"></span> Prev';
	let s_rightButtonText = 'Next <span aria-hidden="true" class="ms" data-icon="arrow_forward_ios"></span>';

	/*
        DO NOT edit below this point unless you are confident you know what you're doing!
        Everything else is automatic, you don't have to change anything else. ^^
        However, feel free to edit this code as much as you like! Just please don't remove my credit if possible <3
    */

	if (s_fixRarebitIndexPage) {
		s_includeUrlParameters = true;
	}

	let a_commentDivs = [];

	// Initialize misc things.
	// The elements is binded to the variables instead of using getElementById.
	let c_container: HTMLDivElement = $state();
	let c_submitButton: HTMLButtonElement = $state();
	let c_replyingText: HTMLSpanElement = $state();
	let c_replyInput: HTMLInputElement = $state();
	let c_replyReset: HTMLButtonElement = $state();
	let c_nameInput: HTMLInputElement = $state();
	let c_siteInput: HTMLInputElement = $state();
	let c_textInput: HTMLTextAreaElement = $state();
    let link: HTMLAnchorElement;
	let v_pagePath = $state('');
	let v_submitted = false;
	let v_pageNum = 1;
	let v_amountOfPages = 1;
	let v_commentMax = 1;
	let v_commentMin = 1;

	// Set up the word filter if applicable
	let v_filteredWords;
	if (s_wordFilterOn) {
		v_filteredWords = s_filteredWords.join('|');
		v_filteredWords = new RegExp(String.raw`\b(${v_filteredWords})\b`, 'ig');
	}

	// Fix the invisible iFrame so it doesn't keep trying to load stuff
	function fixFrame() {
		v_submitted = false;
		// c_hiddenIframe.srcdoc = '';
		getComments(); // Reload comments after submission
	}

	function getComments() {
		console.log('loading comments...')

		if (s_commentsOpen) {
			// Disable the submit button while comments are reloaded
			c_submitButton.disabled = true;

			// Reset reply stuff to default
			c_replyingText.style.display = 'block';
			c_replyingText.innerText = '';
			c_replyInput.value = '';

			// Clear input fields too
			c_nameInput.value = '';
			c_siteInput.value = '';
			c_textInput.value = '';
		}

		// Get the data
		let url = `https://docs.google.com/spreadsheets/d/${s_sheetId}/gviz/tq?`;
		let retrievedSheet = getSheet(url);

		// Do stuff with the data here
		retrievedSheet.then((result) => {
			// The data comes with extra stuff at the beginning, get rid of it
			let json = JSON.parse(
				result.split('\n')[1].replace(/google.visualization.Query.setResponse\(|\);/g, '')
			);

			// Need index of page column for checking if comments are for the right page
			let isPage = (col) => col.label == 'Page';
			let pageIdx = json.table.cols.findIndex(isPage);

			// Turn that data into usable comment data
			// All of the messy val checks are because Google Sheets can be weird sometimes with comment deletion
			let comments = [];
			if (json.table.parsedNumHeaders > 0) {
				// Check if any comments exist in the sheet at all before continuing
				for (let r = 0; r < json.table.rows.length; r++) {
					// Check for null rows
					let val1;
					if (!json.table.rows[r].c[pageIdx]) {
						val1 = '';
					} else {
						val1 = json.table.rows[r].c[pageIdx].v;
					}

					// Check if the page name matches before adding to comment array
					if (val1 == v_pagePath) {
						let comment = {};
						for (let c = 0; c < json.table.cols.length; c++) {
							// Check for null values
							let val2;
							if (!json.table.rows[r].c[c]) {
								val2 = '';
							} else {
								val2 = json.table.rows[r].c[c].v;
							}

							comment[json.table.cols[c].label] = val2;
						}
						comment.Timestamp2 = json.table.rows[r].c[0].f;
						comments.push(comment);
					}
				}
			}

			// Check for empty comments before displaying to page
			if (comments.length == 0 || Object.keys(comments[0]).length < 2) {
				// Once again, Google Sheets can be weird
				c_container.innerHTML = s_noCommentsText;
			} else {
				displayComments(comments);
			}

			c_submitButton.disabled = false; // Now that everything is done, re-enable the submit button
		});
	}

	// Fetches the Google Sheet resource from the provided URL
	function getSheet(url: string) {
		return new Promise(function (resolve, reject) {
			fetch(url).then((response) => {
				if (!response.ok) {
					reject('Could not find Google Sheet with that URL');
				} // Checking for a 404
				else {
					response.text().then((data) => {
						if (!data) {
							reject('Invalid data pulled from sheet');
						}
						resolve(data);
					});
				}
			});
		});
	}

	let v_commentCount = 0;

	function displayComments(comments) {
		// Clear for re-display
		a_commentDivs = [];
		c_container.innerHTML = '';

		// Get all reply comments by taking them out of the comment array
		let replies = [];
		for (let i = 0; i < comments.length; i++) {
			if (comments[i].Reply) {
				replies.push(comments[i]);
				comments.splice(i, 1);
				i--;
			}
		}

		

		// Values for pagination
		v_amountOfPages = Math.ceil(comments.length / s_commentsPerPage);
		v_commentMax = s_commentsPerPage * v_pageNum;
		v_commentMin = v_commentMax - s_commentsPerPage;

		// Main comments (not replies)
		comments.reverse(); // Newest comments go to top
		v_commentCount = comments.length;
		for (let i = 0; i < comments.length; i++) {
			let comment = createComment(comments[i]);

			// Reply button
			if (s_commentsOpen) {
				let button = document.createElement('button');
				button.disabled = Boolean(comments[i].Locked);
				button.innerHTML = button.disabled == true ? s_replyLockedText : s_replyButtonText;
				if (!button.disabled) {
					button.value = comment.id;
					button.addEventListener('click', () => openReply(comment.id));
					button.className = 'c-replyButton';
				}
				comment.appendChild(button);
			}

			// Choose whether to display or not based on page number
			comment.style.display = 'none';
			if (i >= v_commentMin && i < v_commentMax) {
				comment.style.display = 'block';
			}

			comment.className = 'c-comment';
			if (comments[i].Pinned == true) {
				c_container.insertBefore(comment, c_container.firstChild);
				a_commentDivs.unshift(document.getElementById(comment.id));
				if (!(i >= v_commentMin && i < v_commentMax)) {
					comment.style.display = 'block';
					let elm: Element;
					document.querySelectorAll('.c-comment').forEach((e) => {
						if (e.style.display == 'block') {
							elm = e;
						}
					});
					elm.style.display = 'none';
				}
			} else {
				c_container.appendChild(comment);
				a_commentDivs.push(document.getElementById(comment.id));
			}
		}

		// Replies
		
		for (let i = 0; i < replies.length; i++) {
			let reply = createComment(replies[i]);
			let parentId = replies[i].Reply;
			let parentDiv = document.getElementById(parentId);

			// Check if a container doesn't already exist for this comment, if not, make one
			let container;
			if (!document.getElementById(parentId + '-replies')) {
				container = document.createElement('div');
				container.id = parentId + '-replies';
				if (s_collapsedReplies) {
					container.style.display = 'none';
				} // Default to hidden if collapsed
				container.className = 'c-replyContainer';
				parentDiv.appendChild(container);
			} else {
				container = document.getElementById(parentId + '-replies');
			}
			if (container?.querySelector(`[data-id='${reply.dataset.id}']`)) continue;
			reply.className = 'c-reply';
			if (replies[i].Pinned == true) {
				container.insertBefore(reply, container.firstChild);
			} else {
				container.appendChild(reply);
			}
		}

		// Handle adding the buttons to show or hide replies if collapsed replies are enabled
		if (s_collapsedReplies) {
			let containers = document.getElementsByClassName('c-replyContainer');
			for (let i = 0; i < containers.length; i++) {
				let num = containers[i].childNodes.length;
				let parentDiv = containers[i].parentElement;

				// The button to expand replies
				let button = document.createElement('button');
				button.innerHTML = s_expandRepliesText + ` (${num})`;
				button.addEventListener('click', () => expandReplies(parentDiv.id))
				button.className = 'c-expandButton';
				parentDiv.insertBefore(button, parentDiv.lastChild);
			}
		}

		// Handle pagination if there's more than one page
		if (v_amountOfPages > 1) {
			let pagination = document.createElement('div');

			let leftButton = document.createElement('button');
			leftButton.innerHTML = s_leftButtonText;
			leftButton.id = 'c_leftButton';
			leftButton.name = 'left';
			leftButton.addEventListener('click', () => changePage('left'));
			if (v_pageNum == 1) {
				leftButton.disabled = true;
			} // Can't go before page 1
			leftButton.className = 'c-paginationButton';
			pagination.appendChild(leftButton);

			let pageCount = document.createElement('span');
			pageCount.id = 'c_pageCount';
			pageCount.textContent = `Page 1 of ${v_amountOfPages} (${v_commentCount} items)`;
			pagination.appendChild(pageCount);

			let rightButton = document.createElement('button');
			rightButton.innerHTML = s_rightButtonText;
			rightButton.id = 'c_rightButton';
			rightButton.name = 'right';
			rightButton.addEventListener('click', () => changePage('right'));
			if (v_pageNum == v_amountOfPages) {
				rightButton.disabled = true;
			} // Can't go after the last page
			rightButton.className = 'c-paginationButton';
			pagination.appendChild(rightButton);

			pagination.id = 'c_pagination';
			c_container.appendChild(pagination);
		}
	}

	// Create basic HTML comment, reply or not
	function createComment(data) {
		var comment = document.createElement('div');

		// Get the right timestamps
		var timestamps = convertTimestamp(data.Timestamp);
		var timestamp;
		if (s_longTimestamp) {
			timestamp = timestamps[0];
		} else {
			timestamp = timestamps[1];
		}

		// Set the ID (uses Name + Full Timestamp format)
		var id = data.Name + '|--|' + data.Timestamp2;
		comment.dataset.id = `comment-${data.Name}-${timestamp.replaceAll('/', '-').replaceAll('.', '-')}`;
		comment.id = id;

		// Name of user
		var name = document.createElement('h2');
		var filteredName = data.Name;
		if (s_wordFilterOn) {
			filteredName = filteredName.replace(v_filteredWords, s_filterReplacement);
		}
		name.innerText = filteredName;
		name.className = 'c-name';
		if (data.Admin == true) {
			name.insertAdjacentHTML('beforeend', " <span aria-hidden='true' class='ms c-admin' data-icon='shield_person'></span> ");
		}
		if (data.Pinned == true) {
			name.insertAdjacentHTML('beforeend', s_pinnedText);
		}
		comment.appendChild(name);

		// Timestamp
		var time = document.createElement('span');
		time.innerText = timestamp;
		time.className = 'c-timestamp';
		comment.appendChild(time);

		// Website URL, if one was provided
		if (data.Website) {
			var site = document.createElement('a');
			site.innerHTML = (new URL(data.Website)).host + s_websiteText;
			site.href = data.Website;
			site.target = '_blank';
			site.className = 'c-site';
			comment.appendChild(site);
		}

		// Text content
		var text = document.createElement('p');
		var filteredText = data.Text;
		if (s_wordFilterOn) {
			filteredText = filteredText.replace(v_filteredWords, s_filterReplacement);
		}
		text.innerHTML = sanitizeHtml(parser.render(filteredText), {
			allowedTags: [
				...sanitizeHtml.defaults.allowedTags,
				'img', 'iframe', 'video'
			],
			allowedClasses: {
				'span': ['ms'],
			},
			allowedAttributes: {
				'iframe': ['src', 'width', 'height'],
				'img': ['src', 'alt'],
				'video': ['src', 'alt', 'controls'],
				'a': ['href', 'target'],
				'span': ['class', 'data-icon'],
			}
		});
		text.className = 'c-text';
		comment.appendChild(text);

		return comment;
	}

	// Makes the Google Sheet timestamp usable
	function convertTimestamp(timestamp) {
		var vals = timestamp.split('(')[1].split(')')[0].split(',');
		var date = new Date(vals[0], vals[1], vals[2], vals[3], vals[4], vals[5]);
		var timezoneDiff = (s_timezone * 60 + date.getTimezoneOffset()) * -1;
		var offsetDate = new Date(date.getTime() + timezoneDiff * 60 * 1000);
		if (s_daylightSavings) {
			offsetDate = isDST(offsetDate);
		}
		return [offsetDate.toLocaleString(), offsetDate.toLocaleDateString()];
	}
	// DST checker
	function isDST(date) {
		var dstStart = [
			getMonthNum(s_dstStart[0]),
			getDayNum(s_dstStart[1]),
			s_dstStart[2],
			s_dstStart[3]
		];
		var dstEnd = [getMonthNum(s_dstEnd[0]), getDayNum(s_dstEnd[1]), s_dstEnd[2], s_dstEnd[3]];

		var year = date.getFullYear();
		var startDate = new Date(year, dstStart[0], 1);
		startDate = nthDayOfMonth(dstStart[1], dstStart[2], startDate, dstStart[3]).getTime();
		var endDate = new Date(year, dstEnd[0], 1);
		endDate = nthDayOfMonth(dstEnd[1], dstEnd[2], endDate, dstEnd[3]).getTime();
		time = date.getTime();

		if (time >= startDate && time < endDate) {
			date.setHours(date.getHours() - 1);
		}
		return date;
	}
	// Thank you to https://stackoverflow.com/questions/32192982/get-a-given-weekday-in-a-given-month-with-javascript for the below function
	function nthDayOfMonth(day, n, date, hour) {
		var count = 0;
		var idate = new Date(date);
		idate.setDate(1);
		while (count < n) {
			idate.setDate(idate.getDate() + 1);
			if (idate.getDay() == day) {
				count++;
			}
		}
		idate.setHours(hour);
		return idate;
	}
	// Convert weekday and month names into numbers
	function getDayNum(day) {
		var num;
		switch (day.toLowerCase()) {
			case 'sunday':
				num = 0;
				break;
			case 'monday':
				num = 1;
				break;
			case 'tuesday':
				num = 2;
				break;
			case 'wednesday':
				num = 3;
				break;
			case 'thursday':
				num = 4;
				break;
			case 'friday':
				num = 5;
				break;
			case 'saturday':
				num = 6;
				break;
			default:
				num = 0;
				break;
		}
		return num;
	}
	function getMonthNum(month) {
		var num;
		switch (month.toLowerCase()) {
			case 'january':
				num = 0;
				break;
			case 'february':
				num = 1;
				break;
			case 'march':
				num = 2;
				break;
			case 'april':
				num = 3;
				break;
			case 'may':
				num = 4;
				break;
			case 'june':
				num = 5;
				break;
			case 'july':
				num = 6;
				break;
			case 'august':
				num = 7;
				break;
			case 'september':
				num = 8;
				break;
			case 'october':
				num = 9;
				break;
			case 'november':
				num = 10;
				break;
			case 'december':
				num = 11;
				break;
		}
		return num;
	}

	function openReply(id) {
		if (c_replyingText.innerText == '') {
			c_replyingText.innerHTML = s_replyingText + ` ${id.split('|--|')[0]}...`;
			c_replyInput.value = id;
			c_replyReset.style.display = 'block';
		} else {
			c_replyingText.innerHTML = '';
			c_replyInput.value = '';
			c_replyReset.style.display = 'none';
		}
		link.click(); // Jump to the space to type
	}

	// Handle expanding replies (should only be accessible with collapsed replies enabled)
	function expandReplies(id) {
		var targetDiv = document.getElementById(`${id}-replies`);
		if (targetDiv.style.display == 'none') {
			targetDiv.style.display = 'block';
		} else {
			targetDiv.style.display = 'none';
		}
	}

	function changePage(dir) {
		var leftButton = document.getElementById('c_leftButton');
		var rightButton = document.getElementById('c_rightButton');
		var pageCount = document.getElementById('c_pageCount');

		// Find directional number
		var num;
		switch (dir) {
			case 'left':
				num = -1;
				break;
			case 'right':
				num = 1;
				break;
			default:
				num = 0;
				break;
		}
		var targetPage = v_pageNum + num;

		// Cancel if impossible direction for safety, should never happen though
		if (targetPage > v_amountOfPages || targetPage < 1) {
			return;
		}

		// Enable/disable buttons if needed
		leftButton.disabled = false;
		rightButton.disabled = false;
		if (targetPage == 1) {
			leftButton.disabled = true;
		} // Can't go before page 1
		if (targetPage == v_amountOfPages) {
			rightButton.disabled = true;
		} // Can't go past the last page

		// Hide all comments and then display the correct ones
		v_pageNum = targetPage;
		v_commentMax = s_commentsPerPage * v_pageNum;
		v_commentMin = v_commentMax - s_commentsPerPage;
		for (let i = 0; i < a_commentDivs.length; i++) {
			a_commentDivs[i].style.display = 'none';
			if (i >= v_commentMin && i < v_commentMax) {
				a_commentDivs[i].style.display = 'block';
			}
		}

		pageCount.textContent = `Page ${targetPage} of ${v_amountOfPages} (${v_commentCount} items)`;
	}

	onMount(() => {
		v_pagePath = pagePath ?? window.location.pathname;
        
        link = document.createElement('a');
	    link.href = '#c_inputDiv';
		getComments();
	});
</script>

<!-- 
    Customize the widget below!
    Just make sure that you don't remove any classes as that might break something.
-->

<div id="c_widget">
	<div id="c_inputDiv">
		<form
			id="c_form"
			onsubmit={() => {
				c_submitButton.disabled = true;
				v_submitted = true;
			}}
			method="post"
			target="c_hiddenIframe"
			action="https://docs.google.com/forms/d/e/{s_formId}/formResponse"
		>
			{#if s_commentsOpen}
				<h1 id="c_widgetTitle" hidden={v_pagePath.includes('guestbook') || hideTitle}>{s_widgetTitle}</h1>

				<div id="c_commentInput">
					<div id="c_nameWrapper" class="c-inputWrapper name">
						<input
							class="c-input c-nameInput"
							bind:this={c_nameInput}
							aria-label="Your name"
							placeholder="name *"
							name="entry.{s_nameId}"
							id="entry.{s_nameId}"
							type="text"
							maxlength={s_maxLengthName}
							required
						/>
					</div>

					<div id="c_websiteWrapper" class="c-inputWrapper website">
						<input
							class="c-input c-websiteInput"
							bind:this={c_siteInput}
							aria-label="Your website (optional)"
							placeholder="website"
							name="entry.{s_websiteId}"
							id="entry.{s_websiteId}"
							type="url"
							pattern="https?://.*"
						/>
					</div>
				</div>

				<div id="c_textWrapper" class="c-inputWrapper comment">
					<textarea
						class="c-input c-textInput"
						bind:this={c_textInput}
						aria-label="Your comment (please be nice, and markdown is supported!)"
						placeholder="your comment (pls be nice, markdown is supported!) *"
						name="entry.{s_textId}"
						id="entry.{s_textId}"
						rows="4"
						cols="50"
						maxlength={s_maxLength}
						required
					></textarea>
				</div>

				<input aria-hidden="true" aria-label="comment path" type="text" id="entry.{s_pageId}" name="entry.{s_pageId}" bind:value={v_pagePath} style="display: none !important;" />

				<input
					aria-hidden="true"
					aria-label="reply"
					type="text"
					bind:this={c_replyInput}
					id="entry.{s_replyId}"
					name="entry.{s_replyId}"
					style="display: none !important;"
				/>

				<iframe
					id="c_hiddenIframe"
					name="c_hiddenIframe"
					style="display: none !important"
					onload={() => {
						if (v_submitted) {
							fixFrame();
						}
					}}
					title="comment widget form"
				></iframe>

				<div id="c_submit">
					<span id="c_replyingText" bind:this={c_replyingText}></span>

					<div id="c_btns">
						<button
							id="c_replyReset"
							bind:this={c_replyReset}
							onclick={openReply(null)}
							style="display: none;"
						><span aria-hidden="true" class="ms" data-icon="cancel"></span> Cancel Reply</button>
						<button
							id="c_submitButton"
							bind:this={c_submitButton}
							name="c_submitButton"
							type="submit"
							value={s_submitButtonLabel}
							disabled={s_commentsOpen}
						><span aria-hidden="true" class="ms" data-icon="send"></span> Send!</button>
					</div>
				</div>
			{:else}
				<p>{s_closedCommentsText}</p>
			{/if}
		</form>
	</div>
	<div id="c_container" bind:this={c_container}>{s_loadingText}</div>
</div>
