const presence = new Presence({
		clientId: "1001288215388495953",
	}),
	browsingStamp = Date.now();

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = { largeImageKey: "crave_logo" };

	if (document.querySelector(".jw-video")) {
		// if contains video
		if (document.querySelector(".jw-icon-playback").ariaLabel !== "Play") {
			// video is playing

			const elapsed = presence.timestampFromFormat(
					document.querySelector(".jw-text-elapsed").textContent
				),
				duration = presence.timestampFromFormat(
					document.querySelector(".jw-text-duration").textContent
				);

			presenceData.startTimestamp = presence.getTimestamps(
				elapsed,
				duration
			)[0];
			presenceData.endTimestamp = presence.getTimestamps(elapsed, duration)[1];

			presenceData.smallImageKey = "play";
			presenceData.smallImageText = "Playing";
		} else {
			presenceData.smallImageKey = "pause";
			presenceData.smallImageText = "Paused";
		}

		presenceData.buttons = [
			{
				label: "Watch",
				url: document.location.href,
			},
		];

		if (document.querySelector(".bm-icon-episode-list")) {
			// if the video is an episode
			const details =
					document.querySelector(".jw-title-primary").textContent || "",
				// split episode details to achieve {showName, episodeNumber, episodeName}
				// regex finds the season + episode number then split the entire title with said regex
				epDetails = details.split(/(S([0-9]+):E([0-9]+))/g.exec(details)[0]);

			presenceData.state = `${
				/(S([0-9]+):E([0-9]+))/g.exec(details)[0]
			} - ${epDetails[1].trim()}`; // {episodeNumber} - {episodeName}
			presenceData.details = epDetails[0].trim(); // {showName}
		} else {
			// video is a movie
			presenceData.details =
				document.querySelector(".jw-title-primary").textContent; // movie title
		}
	} else {
		// default to browsing
		presenceData.details = "Browsing...";
		presenceData.startTimestamp = browsingStamp;
	}

	presence.setActivity(presenceData);
});
