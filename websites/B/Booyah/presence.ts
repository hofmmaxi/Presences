let elapsed = Math.floor(Date.now() / 1000),
	oldLang = "en",
	prevUrl = document.location.href;

const presence = new Presence({
		clientId: "943158612090568745",
	}),
	getStrings = async () => {
		return presence.getStrings(
			{
				play: "general.playing",
				pause: "general.paused",
				live: "general.live",
				viewHome: "general.viewHome",
				browse: "general.browsing",
				watchingLive: "general.watchingLive",
				watchingVid: "general.watchingVid",
				viewCategory: "general.viewCategory",
				viewTheir: "twitch.viewTheir",
				channelSettings: "twitch.channelSettings",
				dashboard: "twitch.dashboard",
				viewFollow: "twitch.viewFollow",
				searchingFor: "general.searchFor",
				searchingSomething: "general.searchSomething",
				search: "general.search",
				watchStream: "general.buttonWatchStream",
				watchVideo: "general.buttonWatchVideo",
			},
			oldLang
		);
	};

let strings: Awaited<ReturnType<typeof getStrings>>;

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "https://i.imgur.com/W9irPdk.png",
			startTimestamp: elapsed,
		},
		{ pathname, href } = document.location,
		[
			showTimestamps,
			newLang,
			privacy,
			streamDetail,
			streamState,
			profilePic,
			buttons,
		] = await Promise.all([
			presence.getSetting<boolean>("timestamp"),
			presence.getSetting<string>("lang").catch(() => "en"),
			presence.getSetting<boolean>("privacy"),
			presence.getSetting<string>("streamDetail"),
			presence.getSetting<string>("streamState"),
			presence.getSetting<boolean>("profilePic"),
			presence.getSetting<boolean>("buttons"),
		]),
		title = document.querySelector(
			"#layout-content > div > div > div.channel-top-bar > div > div.components-profile-card-center.only-center > div:nth-child(1) > div"
		)?.textContent,
		streamer = document.querySelector(
			"#layout-content > div > div > div.channel-top-bar > div > div.components-profile-card-center.only-center > div:nth-child(1) > a.user-name > span"
		)?.textContent,
		game = document.querySelector(
			"#layout-content > div > div > div.channel-top-bar > div > div.components-profile-card-center.only-center > div.channel-infos > div > span > a"
		)?.textContent,
		vidTimer = document.querySelector("div.time > div.duration")?.textContent;
	if (oldLang !== newLang || !strings) {
		oldLang = newLang;
		strings = await getStrings();
	}

	if (href !== prevUrl) {
		prevUrl = href;
		elapsed = Math.floor(Date.now() / 1000);
	}

	if (pathname === "/") presenceData.details = strings.viewHome;
	else if (pathname.startsWith("/games")) {
		presenceData.smallImageKey = "reading";
		presenceData.smallImageText = strings.browse;
		presenceData.details = strings.browse;
		if (!privacy) {
			presenceData.details = strings.viewCategory;
			if (
				document.querySelector(
					"#layout-content > div > div.views-game-info > div.game-info > div.game-name"
				)
			) {
				presenceData.state = document.querySelector(
					"#layout-content > div > div.views-game-info > div.game-info > div.game-name"
				).textContent;
			} else {
				presenceData.state = document.querySelector(
					"#layout-content > div > div > h2"
				).textContent;
			}
		}
	} else if (pathname.startsWith("/browse")) {
		presenceData.details = strings.searchingSomething;
		presenceData.smallImageKey = "search";
		presenceData.smallImageText = strings.search;
		if (!privacy) {
			presenceData.details = strings.searchingFor;
			presenceData.state = document.querySelector(".tab-current").textContent;
		}
	} else if (pathname.startsWith("/studio")) {
		presenceData.details = strings.searchingSomething;
		presenceData.smallImageKey = "search";
		presenceData.smallImageText = strings.search;
		if (!privacy) {
			presenceData.details = strings.searchingFor;
			presenceData.state = document.querySelector(".username").textContent;
		}
	} else if (pathname.startsWith("/following")) {
		presenceData.details = strings.viewFollow;
		presenceData.smallImageKey = "follow";
		presenceData.smallImageText = strings.viewFollow;
	} else if (pathname.startsWith("/settings")) {
		presenceData.smallImageKey = "reading";
		presenceData.smallImageText = strings.browse;
		presenceData.details = strings.browse;
		if (!privacy) {
			delete presenceData.smallImageKey;
			delete presenceData.smallImageText;
			presenceData.details = strings.viewTheir;
			presenceData.state = strings.channelSettings;
			if (pathname.includes("/dashboard"))
				presenceData.state = strings.dashboard;
		}
	} else if (pathname.startsWith("/vods") || (streamer && title)) {
		if (vidTimer) {
			let paused = !!document.querySelector(".playback-btn");

			const streamerVod = document.querySelector(
					"#layout-content > div > div.view-main-content > div.user-box > div.components-profile-card > div.components-profile-card-center > span.components-profile-card-center-top > a"
				).textContent,
				timeElapsed = presence.timestampFromFormat(
					document.querySelector("div.time > div.current-time")?.textContent
				),
				duration = presence.timestampFromFormat(vidTimer);
			if (!privacy) {
				presenceData.details = streamDetail
					.replace(
						"%title%",
						document.querySelector(".video-info > .video-title").textContent
					)
					.replace("%uploader%", streamerVod);
				presenceData.state = streamDetail
					.replace("%title%", streamerVod)
					.replace("%uploader%", streamerVod);

				delete presenceData.startTimestamp;

				if (Date.now() / 1000 >= Date.now() / 1000 + duration - timeElapsed)
					paused = true;
				if (!paused) {
					presenceData.endTimestamp =
						Date.now() / 1000 + duration - timeElapsed;
				}

				presenceData.buttons = [
					{ label: strings.watchVideo, url: document.URL },
				];
			} else presenceData.details = strings.watchingVid;
			presenceData.smallImageKey = paused ? "pause" : "play";
			presenceData.smallImageText = paused ? strings.pause : strings.play;
		} else {
			if (!privacy) {
				presenceData.details = streamDetail
					.replace("%title%", title)
					.replace("%streamer%", streamer)
					.replace("%game%", game);
				presenceData.state = streamState
					.replace("%title%", title)
					.replace("%streamer%", streamer)
					.replace("%game%", game);
				presenceData.buttons = [
					{ label: strings.watchStream, url: document.URL },
				];
			} else presenceData.details = strings.watchingLive;
			presenceData.smallImageKey = "live";
			presenceData.smallImageText = strings.live;
		}
		if (profilePic) {
			if (pathname.startsWith("/vods")) {
				presenceData.largeImageKey = document
					.querySelector<HTMLImageElement>(
						"#layout-content > div > div.view-main-content > div.user-box > div.components-profile-card > a > img"
					)
					.src.replace("w240", "w600");
			} else {
				presenceData.largeImageKey = document
					.querySelector<HTMLImageElement>(
						"#layout-content > div > div > div.channel-top-bar > div > div.components-profile-card-center.only-center > div:nth-child(1) > a.components-profile-card-image > div > div.components-avatar-image-container > img"
					)
					.src.replace("w240", "w600");
			}
		}
	}
	if (!showTimestamps) {
		delete presenceData.startTimestamp;
		delete presenceData.endTimestamp;
	}
	if (!buttons) delete presenceData.buttons;
	presence.setActivity(presenceData);
});
