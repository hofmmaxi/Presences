const presence = new Presence({
		clientId: "622375113702113281",
	}),
	strings = presence.getStrings({
		play: "general.playing",
		pause: "general.paused",
	});

let playback = true,
	currentTime: number,
	duration: number,
	paused: boolean;

presence.on(
	"iFrameData",
	(data: {
		dur: number;
		currTime: number;
		paused: boolean;
		iFrameVideo: boolean;
	}) => {
		playback = data.dur !== null ? true : false;

		if (playback) {
			currentTime = data.currTime;
			duration = data.dur;
			({ paused } = data);
		}
	}
);

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
		largeImageKey: "https://i.imgur.com/LXjbZoN.png",
	};
	if (document.location.pathname.includes("/videos")) {
		if (playback === true && !isNaN(duration)) {
			const videoTitle = document.querySelector(
				"div > div.title-views.flex.column > h1"
			);
			presenceData.details =
				videoTitle !== null ? videoTitle.textContent : "Title not found";
			presenceData.state = document.querySelector(
				"div.hvpi-main.flex.column > div > div > div:nth-child(1) > a"
			).textContent;
			presenceData.smallImageKey = paused ? "pause" : "play";
			presenceData.smallImageText = paused
				? (await strings).pause
				: (await strings).play;
			[presenceData.startTimestamp, presenceData.endTimestamp] =
				presence.getTimestamps(Math.floor(currentTime), Math.floor(duration));

			if (paused) {
				delete presenceData.startTimestamp;
				delete presenceData.endTimestamp;
			}
		} else {
			const videoTitle = document.querySelector(
				"div > div.title-views.flex.column > h1"
			);
			presenceData.details =
				videoTitle !== null ? videoTitle.textContent : "Title not found";
			presenceData.state = document.querySelector(
				"div.hvpi-main.flex.column > div > div > div:nth-child(1) > a"
			).textContent;
		}
	} else presenceData.details = "Browsing..";

	presence.setActivity(presenceData);
});
