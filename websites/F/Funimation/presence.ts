const presence = new Presence({
		clientId: "640161890059812865",
	}),
	getStrings = presence.getStrings({
		play: "general.playing",
		pause: "general.paused",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

let prevTitle: string, prevEpisode: string, strings: Awaited<typeof getStrings>;

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "https://i.imgur.com/WYKbg0v.png",
			startTimestamp: browsingTimestamp,
		},
		showPoster = await presence.getSetting("poster"),
		video = document.querySelector<HTMLVideoElement>("video.vjs-tech");

	strings ??= await getStrings;

	if (location.pathname.includes("/v/") && video) {
		const poster = document.querySelector<HTMLElement>(".vjs-poster"),
			title = document.querySelector(
				".meta-overlay > div > div > ul > li > h1"
			)?.textContent,
			episode = document
				.querySelector(".meta-overlay > div > div > ul > li > p")
				?.textContent?.replace(/\s+/g, " ");

		if (title) prevTitle = title;
		if (episode) prevEpisode = episode;

		if (showPoster && poster?.style?.backgroundImage) {
			presenceData.largeImageKey =
				poster.style.backgroundImage.match(/"(.*)"/)[1];
		}

		presenceData.smallImageKey = video.paused ? "pause" : "play";
		presenceData.smallImageText = video.paused ? strings.pause : strings.play;
		[presenceData.startTimestamp, presenceData.endTimestamp] =
			presence.getTimestampsfromMedia(video);

		presenceData.details = prevTitle;
		presenceData.state = prevEpisode;

		if (video.paused) {
			delete presenceData.startTimestamp;
			delete presenceData.endTimestamp;
		}
	} else if (document.location.pathname.includes("/shows/")) {
		if (
			document.querySelector('h1[data-test="content-hero__title"]') !== null
		) {
			const poster = document.querySelector<HTMLElement>(
				".v-image__image.v-image__image--contain"
			);

			if (showPoster && poster?.style?.backgroundImage) {
				presenceData.largeImageKey =
					poster.style.backgroundImage.match(/"(.*)"/)[1];
			}

			presenceData.details = "Viewing show:";
			presenceData.state = document.querySelector(
				'h1[data-test="content-hero__title"]'
			).textContent;
		} else {
			presenceData.smallImageKey = "reading";
			presenceData.details = "Browsing shows...";
		}
	} else if (document.location.pathname.includes("/whats-new")) {
		presenceData.details = "Viewing what's new";
		presenceData.smallImageKey = "reading";
	} else if (document.location.pathname.includes("/new-releases")) {
		presenceData.details = "Viewing new shows";
		presenceData.smallImageKey = "reading";
	} else if (document.location.pathname.includes("/schedule")) {
		presenceData.details = "Viewing the schedule";
		presenceData.smallImageKey = "reading";
	} else if (document.location.pathname.includes("/shop"))
		presenceData.details = "Viewing the shop";
	else if (document.location.pathname.includes("/events")) {
		presenceData.details = "Viewing the";
		presenceData.state = "upcoming events";
		presenceData.smallImageKey = "reading";
	} else if (document.location.pathname.includes("/discover"))
		presenceData.details = "Discovering new anime";
	else if (document.location.pathname.includes("/recommended-for-you")) {
		presenceData.details = "Viewing their recommended";
		presenceData.smallImageKey = "reading";
	} else if (document.location.pathname.includes("/trendingbuzz")) {
		presenceData.details = "Viewing what's trending";
		presenceData.smallImageKey = "reading";
	} else if (document.location.pathname.includes("/guides")) {
		presenceData.details = "Reading the guides";
		presenceData.smallImageKey = "reading";
	} else if (document.location.pathname.includes("/moods"))
		presenceData.details = "Finding out their mood";
	else if (document.location.pathname.includes("/games")) {
		presenceData.details = "Looking at the games";
		presenceData.smallImageKey = "reading";
	} else if (document.location.pathname.includes("/blog")) {
		if (
			document.querySelector(
				"body > div.site-container > div.site-inner > div > main > article > h2"
			) !== null
		) {
			presenceData.details = "Reading article:";
			presenceData.state = document.querySelector(
				"body > div.site-container > div.site-inner > div > main > article > h2"
			).textContent;
			presenceData.smallImageKey = "reading";
		} else presenceData.details = "Browsing through articles";
	} else if (document.location.pathname.includes("/forum")) {
		if (document.location.pathname.includes("/topic/")) {
			presenceData.details = "Forums - Reading topic:";
			presenceData.state = document.querySelector(
				"#content > div.row > div > h1 > span"
			).textContent;
			presenceData.smallImageKey = "reading";
		} else if (document.location.pathname.includes("/user/")) {
			presenceData.details = "Forums - Viewing user:";
			presenceData.state = document.querySelector(
				"#content > div > div.profile.row > h2"
			).textContent;
		} else if (document.location.pathname.includes("/category/")) {
			presenceData.details = "Forums - Viewing category:";
			presenceData.state = document
				.querySelector("head > title")
				.textContent.replace(" | Funimation Forum", "");
		} else {
			presenceData.details = "Browsing through";
			presenceData.state = "the forums";
		}
	} else if (document.location.pathname === "/")
		presenceData.details = "Browsing...";

	if (!presenceData.details) presence.setActivity();
	else presence.setActivity(presenceData);
});
