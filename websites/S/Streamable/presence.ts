const presence = new Presence({
		clientId: "630847999106482176",
	}),
	strings = presence.getStrings({
		play: "general.playing",
		pause: "general.paused",
	});

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "https://i.imgur.com/D38h5SR.png",
		},
		player = document.querySelector<HTMLVideoElement>(".video-player-tag");

	if (player) {
		[presenceData.startTimestamp, presenceData.endTimestamp] =
			presence.getTimestamps(
				Math.floor(player.currentTime),
				Math.floor(player.duration)
			);

		presenceData.details =
			document.querySelector(".metadata #title").textContent;
		presenceData.state =
			document.querySelector(".metadata #visits").textContent;
		presenceData.smallImageKey = player.paused ? "pause" : "play";
		presenceData.smallImageText = player.paused
			? (await strings).pause
			: (await strings).play;

		if (player.paused) {
			delete presenceData.startTimestamp;
			delete presenceData.endTimestamp;
		}
	} else {
		presenceData.details = "Browsing...";
		presenceData.startTimestamp = Date.now();
	}
	presence.setActivity(presenceData);
});
