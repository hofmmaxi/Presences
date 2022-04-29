const presence = new Presence({
		clientId: "758234121574678588"
	}),
	strings = presence.getStrings({
		play: "presence.playback.playing",
		pause: "presence.playback.paused",
		browsing: "presence.activity.browsing"
	});

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "cp"
		},
		buttons = await presence.getSetting<boolean>("buttons");

	if (document.location.pathname.includes("/watch")) {
		const video: HTMLVideoElement = document.querySelector(".player-box video");
		if (buttons) {
			presenceData.buttons = [
				{
					label: "Watch",
					url: document.URL
				}
			];
		}
		if (video && !isNaN(video.duration)) {
			if (document.querySelector(".CPplayer-header-subtitle")) {
				presenceData.state = ` ${
					document.querySelector(".CPplayer-header-subtitle").textContent
				}`;
			} else presenceData.state = "Movie";

			[presenceData.startTimestamp, presenceData.endTimestamp] =
				presence.getTimestamps(
					Math.floor(video.currentTime),
					Math.floor(video.duration)
				);
			presenceData.details = ` ${
				document.querySelector(".CPplayer-header-title span").textContent
			}`;
			(presenceData.smallImageKey = video.paused ? "pause" : "play"),
				(presenceData.smallImageText = video.paused
					? (await strings).pause
					: (await strings).play);
			if (video.paused) {
				delete presenceData.startTimestamp;
				delete presenceData.endTimestamp;
			}
			presence.setActivity(presenceData, !video.paused);
		}
	} else {
		presenceData.details = (await strings).browsing;
		presence.setActivity(presenceData);
	}
});
