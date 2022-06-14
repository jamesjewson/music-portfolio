/*
	Dimension by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	var	$window = $(window),
		$body = $('body'),
		$wrapper = $('#wrapper'),
		$header = $('#header'),
		$footer = $('#footer'),
		$main = $('#main'),
		$main_articles = $main.children('article');

	// Breakpoints.
		breakpoints({
			xlarge:   [ '1281px',  '1680px' ],
			large:    [ '981px',   '1280px' ],
			medium:   [ '737px',   '980px'  ],
			small:    [ '481px',   '736px'  ],
			xsmall:   [ '361px',   '480px'  ],
			xxsmall:  [ null,      '360px'  ]
		});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Fix: Flexbox min-height bug on IE.
		if (browser.name == 'ie') {

			var flexboxFixTimeoutId;

			$window.on('resize.flexbox-fix', function() {

				clearTimeout(flexboxFixTimeoutId);

				flexboxFixTimeoutId = setTimeout(function() {

					if ($wrapper.prop('scrollHeight') > $window.height())
						$wrapper.css('height', 'auto');
					else
						$wrapper.css('height', '100vh');

				}, 250);

			}).triggerHandler('resize.flexbox-fix');

		}

	// Nav.
		var $nav = $header.children('nav'),
			$nav_li = $nav.find('li');

		// Add "middle" alignment classes if we're dealing with an even number of items.
			if ($nav_li.length % 2 == 0) {

				$nav.addClass('use-middle');
				$nav_li.eq( ($nav_li.length / 2) ).addClass('is-middle');

			}

	// Main.
		var	delay = 325,
			locked = false;

		// Methods.
		
//This shows everything

			$main._show = function(id, initial) {

				var $article = $main_articles.filter('#' + id);

				// No such article? Bail.
					if ($article.length == 0)
						return;

				// Handle lock.

					// Already locked? Speed through "show" steps w/o delays.
						if (locked || (typeof initial != 'undefined' && initial === true)) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Mark as visible.
								$body.addClass('is-article-visible');

							// Deactivate all articles (just in case one's already active).
								$main_articles.removeClass('active');

							// Hide header, footer.
								$header.hide();
								$footer.hide();

							// Show main, article.
								$main.show();
								$article.show();

							// Activate article.
								$article.addClass('active');

							// Unlock.
								locked = false;

							// Unmark as switching.
								setTimeout(function() {
									$body.removeClass('is-switching');
								}, (initial ? 1000 : 0));

							return;

						}

					// Lock.
						locked = true;

				// Article already visible? Just swap articles.
					if ($body.hasClass('is-article-visible')) {

						// Deactivate current article.
							var $currentArticle = $main_articles.filter('.active');

							$currentArticle.removeClass('active');

						// Show article.
							setTimeout(function() {

								// Hide current article.
									$currentArticle.hide();

								// Show article.
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

				// Otherwise, handle as normal.
					else {

						// Mark as visible.
							$body
								.addClass('is-article-visible');

						// Show article.
							setTimeout(function() {

								// Hide header, footer.
									$header.hide();
									$footer.hide();

								// Show main, article.
									$main.show();
									$article.show();

								// Activate article.
									setTimeout(function() {

										$article.addClass('active');

										// Window stuff.
											$window
												.scrollTop(0)
												.triggerHandler('resize.flexbox-fix');

										// Unlock.
											setTimeout(function() {
												locked = false;
											}, delay);

									}, 25);

							}, delay);

					}

			};

			
			
//This closes everything
			$main._hide = function(addState) {

				var $article = $main_articles.filter('.active');

				// Article not visible? Bail.
					if (!$body.hasClass('is-article-visible'))
						return;

				// Add state?
					if (typeof addState != 'undefined'
					&&	addState === true)
						history.pushState(null, null, '#');

				// Handle lock.

					// Already locked? Speed through "hide" steps w/o delays.
						if (locked) {

							// Mark as switching.
								$body.addClass('is-switching');

							// Deactivate article.
								$article.removeClass('active');

							// Hide article, main.
								$article.hide();
								$main.hide();

							// Show footer, header.
								$footer.show();
								$header.show();

							// Unmark as visible.
								$body.removeClass('is-article-visible');

							// Unlock.
								locked = false;

							// Unmark as switching.
								$body.removeClass('is-switching');

							// Window stuff.
								$window
									.scrollTop(0)
									.triggerHandler('resize.flexbox-fix');

							return;

						}

					// Lock.
						locked = true;

				// Deactivate article.
					$article.removeClass('active');

				// Hide article.
					setTimeout(function() {

						// Hide article, main.
							$article.hide();
							$main.hide();

						// Show footer, header.
							$footer.show();
							$header.show();

						// Unmark as visible.
							setTimeout(function() {

								$body.removeClass('is-article-visible');

								// Window stuff.
									$window
										.scrollTop(0)
										.triggerHandler('resize.flexbox-fix');

								// Unlock.
									setTimeout(function() {
										locked = false;
									}, delay);

							}, 25);

					}, delay);


			};

		// Articles.
			$main_articles.each(function() {

				var $this = $(this);

				// Close.
					$('<div class="close">Close</div>')
						.appendTo($this)
						.on('click', function() {
							location.hash = '';
						});

				// Prevent clicks from inside article from bubbling.
					$this.on('click', function(event) {
						event.stopPropagation();
					});

			});

		// Events.
			$body.on('click', function(event) {

				//Set Scrolldown WIP
				//	totalScrollDown = 0;
				// Article visible? Hide.
				if( $(event.target).hasClass('keepArticle')){
					// do nothing
				}else{
					if ($body.hasClass('is-article-visible'))
					$main._hide(true);
				}
			});

			$window.on('keyup', function(event) {

				switch (event.keyCode) {

					case 27:

						// Article visible? Hide.
							if ($body.hasClass('is-article-visible'))
								$main._hide(true);

						break;

					default:
						break;

				}

			});
//This is the click even that makes everything show up
			$window.on('hashchange', function(event) {

				// Empty hash?
					if (location.hash == ''
					||	location.hash == '#') {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Hide.
							$main._hide();

					}
//This is where it finds the article and shows it
				// Otherwise, check for a matching article.
					else if ($main_articles.filter(location.hash).length > 0) {

						// Prevent default.
							event.preventDefault();
							event.stopPropagation();

						// Show article.
							$main._show(location.hash.substr(1));

					}

			});

		// Scroll restoration.
		// This prevents the page from scrolling back to the top on a hashchange.
			if ('scrollRestoration' in history)
				history.scrollRestoration = 'manual';
			else {

				var	oldScrollPos = 0,
					scrollPos = 0,
					$htmlbody = $('html,body');

				$window
					.on('scroll', function() {

						oldScrollPos = scrollPos;
						scrollPos = $htmlbody.scrollTop();

					})
					.on('hashchange', function() {
						$window.scrollTop(oldScrollPos);
					});

			}

			
//Show/Hide composition PDFs

$('#lauraSuite').click(function(){
		$("#suiteObject").toggleClass("seeHide")
});
$('#nocturne').click(function(){
		$("#nocturneObject").toggleClass("seeHide")
});
$('#prelude1').click(function(){
	$("#prelude1Object").toggleClass("seeHide")
});


/////////////////////////////////////
///////////Music Player Stuff////////
/////////////////////////////////////
//Use RSS feed?

const audioPlayer = document.querySelector(".audio-player");
let audio = new Audio("https://feeds.soundcloud.com/stream/1279938469-james-jewson-584932371-ourpresentationwillbeginshortl.mp3");
audioPlayer.querySelector(".name").textContent = "OurPresentationWillBeginShortly"
//Event Liseners
$('#OurPresentationWillBeginShortly').on('click', function(event) {
	audio.src="https://feeds.soundcloud.com/stream/1279938469-james-jewson-584932371-ourpresentationwillbeginshortl.mp3"
	audioPlayer.querySelector(".name").textContent = "OurPresentationWillBeginShortly"
	playBtn.classList.remove("play");
	playBtn.classList.add("pause");
	audioPlayer.classList.remove("hidden")
	audioPlayer.classList.add("audioRise")
	audio.play();
});
$('#persianVersion').on('click', function(event) {
	audio.src="https://feeds.soundcloud.com/stream/1284288073-james-jewson-584932371-persian-version.mp3"
	audioPlayer.querySelector(".name").textContent = "Persian Version"
	playBtn.classList.remove("play");
	playBtn.classList.add("pause");
	audioPlayer.classList.remove("hidden")
	audioPlayer.classList.add("audioRise")

	audio.play();
});
$('#lateNight').on('click', function(event) {
	audio.src="https://feeds.soundcloud.com/stream/1279938280-james-jewson-584932371-late-night.mp3"
	audioPlayer.querySelector(".name").textContent = "Late Night"
	playBtn.classList.remove("play");
	playBtn.classList.add("pause");
	audioPlayer.classList.remove("hidden")
	audioPlayer.classList.add("audioRise")

	audio.play();
});
$('#4-28_2').on('click', function(event) {
	audio.src="https://feeds.soundcloud.com/stream/1279938160-james-jewson-584932371-4-28-2.mp3"
	audioPlayer.querySelector(".name").textContent = "4-28_2"
	playBtn.classList.remove("play");
	playBtn.classList.add("pause");
	audioPlayer.classList.remove("hidden")
	audioPlayer.classList.add("audioRise")

	audio.play();
});
$('#psalm').on('click', function(event) {
	// audio.src=""
});
$('#interlude1').on('click', function(event) {
	audio.src="https://feeds.soundcloud.com/stream/1279938154-james-jewson-584932371-interlude-1.mp3"
	audioPlayer.querySelector(".name").textContent = "Interlude 1"
	playBtn.classList.remove("play");
	playBtn.classList.add("pause");
	audioPlayer.classList.remove("hidden")
	audioPlayer.classList.add("audioRise")

	audio.play();
});
$('#gumby').on('click', function(event) {
	audio.src="https://feeds.soundcloud.com/stream/1279938142-james-jewson-584932371-gumby-enjoys-the-rain.mp3"
	audioPlayer.querySelector(".name").textContent = "Gumby Enjoys the Rain"
	playBtn.classList.remove("play");
	playBtn.classList.add("pause");
	audioPlayer.classList.remove("hidden")	
	audioPlayer.classList.add("audioRise")


	audio.play();
});
$('#sunshine').on('click', function(event) {
	// audio.src=""
});
$('#interlude2').on('click', function(event) {
	audio.src="https://feeds.soundcloud.com/stream/1279938136-james-jewson-584932371-interlude-2.mp3"
	audioPlayer.querySelector(".name").textContent = "Interlude 2"
	playBtn.classList.remove("play");
	playBtn.classList.add("pause");
	audioPlayer.classList.remove("hidden")
	audioPlayer.classList.add("audioRise")

	audio.play();
});
$('#223TychoStreet').on('click', function(event) {
	audio.src="https://feeds.soundcloud.com/stream/1279938100-james-jewson-584932371-223-tycho-street.mp3"
	audioPlayer.querySelector(".name").textContent = "223 Tycho Street"
	playBtn.classList.remove("play");
	playBtn.classList.add("pause");
	audioPlayer.classList.remove("hidden")
	audioPlayer.classList.add("audioRise")

	audio.play();
});
$('#postlude').on('click', function(event) {
	// audio.src=""
});



// console.dir(audio);


audio.addEventListener(
  "loadeddata",
  () => {
    audioPlayer.querySelector(".time .length").textContent = getTimeCodeFromNum(
      audio.duration
    );
    audio.volume = .75;
  },
  false
);

//click on timeline to skip around
const timeline = audioPlayer.querySelector(".timeline");
timeline.addEventListener("click", e => {
  const timelineWidth = window.getComputedStyle(timeline).width;
  const timeToSeek = e.offsetX / parseInt(timelineWidth) * audio.duration;
  audio.currentTime = timeToSeek;
}, false);

//click volume slider to change volume
const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
volumeSlider.addEventListener('click', e => {
  const sliderWidth = window.getComputedStyle(volumeSlider).width;
  const newVolume = e.offsetX / parseInt(sliderWidth);
  audio.volume = newVolume;
  audioPlayer.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%';
}, false)

//check audio percentage and update time accordingly
setInterval(() => {
  const progressBar = audioPlayer.querySelector(".progress");
  progressBar.style.width = audio.currentTime / audio.duration * 100 + "%";
  audioPlayer.querySelector(".time .current").textContent = getTimeCodeFromNum(
    audio.currentTime
  );
}, 50);

//toggle between playing and pausing on button click
const playBtn = audioPlayer.querySelector(".controls .toggle-play");
playBtn.addEventListener(
  "click",
  () => {
    if (audio.paused) {
      playBtn.classList.remove("play");
      playBtn.classList.add("pause");
      audio.play();
    } else {
      playBtn.classList.remove("pause");
      playBtn.classList.add("play");
      audio.pause();
    }
  },
  false
);

audioPlayer.querySelector(".volume-button").addEventListener("click", () => {
  const volumeEl = audioPlayer.querySelector(".volume-container .volume");
  audio.muted = !audio.muted;
  if (audio.muted) {
    volumeEl.classList.remove("icono-volumeMedium");
    volumeEl.classList.add("icono-volumeMute");
  } else {
    volumeEl.classList.add("icono-volumeMedium");
    volumeEl.classList.remove("icono-volumeMute");
  }
});

//turn 128 seconds into 2:08
function getTimeCodeFromNum(num) {
  let seconds = parseInt(num);
  let minutes = parseInt(seconds / 60);
  seconds -= minutes * 60;
  const hours = parseInt(minutes / 60);
  minutes -= hours * 60;

  if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
  return `${String(hours).padStart(2, 0)}:${minutes}:${String(
    seconds % 60
  ).padStart(2, 0)}`;
}



$('.close-audio').on('click', function(event) {

	audioPlayer.classList.add("audioFall")
	setTimeout(()=>{
		audioPlayer.classList.add("hidden")	
		audioPlayer.classList.remove("audioFall")	
	}, 1000)
	playBtn.classList.remove("pause");
    playBtn.classList.add("play");
	audio.pause();
})

















		// Initialize.

			// Hide main, articles.
				$main.hide();
				$main_articles.hide();

			// Initial article.
				if (location.hash != ''
				&&	location.hash != '#')
					$window.on('load', function() {
						$main._show(location.hash.substr(1), true);
					});

})(jQuery);



// Audio Player
// Possible improvements:
// - Change timeline and volume slider into input sliders, reskinned
// - Change into Vue or React component
// - Be able to grab a custom title instead of "Music Song"
// - Hover over sliders to see preview of timestamp/volume change


//if hasClass "suite-1", const audio = X, if hasclass "nocturne", etc



