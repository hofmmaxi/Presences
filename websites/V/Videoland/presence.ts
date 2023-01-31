const presence = new Presence({
		clientId: "941627291304329226",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "https://i.imgur.com/pDpvS9l.gif",
			startTimestamp: browsingTimestamp,
		},
		{ href } = document.location,
		[privacy, buttons, covers] = await Promise.all([
			presence.getSetting<boolean>("privacy"),
			presence.getSetting<boolean>("buttons"),
			presence.getSetting<boolean>("covers"),
		]);

	if (!privacy) {
		const video = document.querySelector("video"),
			getInfo = JSON.parse(
				document.querySelectorAll('[type="application/ld+json"]')[1].innerHTML
			);
		if (video) {
			delete presenceData.startTimestamp;
			presenceData.details = getInfo.name;
			presenceData.state = `S${getInfo.partOfSeason.seasonNumber}:A${getInfo.episodeNumber}`;
			presenceData.largeImageKey = document
				.querySelector<HTMLMetaElement>('[property="og:image"]')
				.content.split("?")[0];
			presenceData.smallImageKey = video.paused ? "pause" : "play";
			presenceData.smallImageText = video.paused
				? "Gepauzeerd"
				: "Aan het afspelen";
			if (!video.paused)
				presenceData.endTimestamp = presence.getTimestampsfromMedia(video)[1];
			presenceData.buttons = [
				{
					label: "Bekijk Video",
					url: href,
				},
			];
		} else if (document.querySelector('[class*="is-active"]')) {
			presenceData.details = `Bekijkt ${
				document.querySelector("[class='sc-1veuio6-0 doNfay']")?.textContent
			} ${document
				.querySelector('[class*="is-active"]')
				.getAttribute("title")}`;
		} else if (document.querySelector("article")) {
			presenceData.details = `Bekijkt: ${
				document
					.querySelector<HTMLMetaElement>("meta[property='og:title']")
					?.content.toLowerCase()
					.split("op videoland")[0]
			}`;
			presenceData.largeImageKey = document
				.querySelector("article")
				.querySelector("source")
				.getAttribute("srcset")
				.split("?")[0];
		} else presenceData.details = "Aan het browsen";
	} else presenceData.details = "Aan het browsen";

	if (!buttons) delete presenceData.buttons;
	if (!covers) presenceData.largeImageKey = "https://i.imgur.com/pDpvS9l.gif";

	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
