const presence = new Presence({
	clientId: "691491207356088320",
});

let currentTime: number, duration: number, paused: boolean;

interface iFrameData {
	currentTime: number;
	duration: number;
	paused: boolean;
}

presence.on("iFrameData", (data: iFrameData) => {
	if (data.duration) ({ currentTime, duration, paused } = data);
});

presence.on("UpdateData", () => {
	const [startTimestamps, endTimestamps] = presence.getTimestamps(
			Math.floor(currentTime),
			Math.floor(duration)
		),
		presenceData: PresenceData = {
			largeImageKey: "https://i.imgur.com/t7j0bcF.png",
		};

	if (document.URL === "https://www.threenow.co.nz/") {
		presenceData.details = "Browsing the main page";
		presenceData.startTimestamp = Math.floor(Date.now() / 1000);
	} else if (document.location.pathname.includes("/shows/")) {
		if (document.querySelectorAll(".EpisodeSynopsis-subtitle").length >= 1) {
			if (!isNaN(endTimestamps)) {
				presenceData.startTimestamp = startTimestamps;
				presenceData.endTimestamp = endTimestamps;
			}

			presenceData.state = document.querySelectorAll(
				".EpisodeSynopsis-title"
			)[0].textContent;

			if (paused) {
				presenceData.details = "Watching a show";
				delete presenceData.startTimestamp;
				delete presenceData.endTimestamp;
				presenceData.smallImageKey = "pause";
			} else {
				presenceData.details = "Watching a show";
				presenceData.smallImageKey = "play";
			}
		} else {
			presenceData.details = "Viewing a show";
			presenceData.state = document.querySelectorAll(
				".HeroSynopsis-title"
			)[0].textContent;
		}
	} else if (document.location.pathname.includes("/search")) {
		presenceData.details = "Searching shows";
		presenceData.state = (
			document.querySelectorAll(".SearchInput-input")[0] as HTMLInputElement
		).value;
		presenceData.startTimestamp = Math.floor(Date.now() / 1000);
	} else {
		switch (document.URL) {
			case "https://www.threenow.co.nz/live-tv-guide": {
				presenceData.details = "Viewing the Live TV guide";
				break;
			}
			case "https://www.threenow.co.nz/live-tv-guide/three": {
				presenceData.details = "Watching Three Live";
				presenceData.startTimestamp = Math.floor(Date.now() / 1000);

				break;
			}
			case "https://www.threenow.co.nz/live-tv-guide/three-life": {
				presenceData.details = "Watching ThreeLife Live";
				presenceData.startTimestamp = Math.floor(Date.now() / 1000);

				break;
			}
			case "https://www.threenow.co.nz/live-tv-guide/bravo": {
				presenceData.details = "Watching The Edge TV Live";
				presenceData.startTimestamp = Math.floor(Date.now() / 1000);

				break;
			}
			default:
				if (
					document.location.pathname.includes("/tv") &&
					document.location.pathname.includes(".html")
				) {
					presenceData.details = "ThreeFans";
					presenceData.state = "Checking out information for fans!";
				}
		}
	}

	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
