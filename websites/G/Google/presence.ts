const presence = new Presence({
		clientId: "612704158826496028",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000),
	pageInput: HTMLInputElement = document.querySelector("#lst-ib"),
	homepageInput: HTMLInputElement = document.querySelector('input[name="q"]'),
	homepageImage: HTMLElement = document.querySelector("#hplogo"),
	imgInput: HTMLInputElement = document.querySelector("#REsRA");

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "https://i.imgur.com/ZZvx6Dq.png",
			startTimestamp: browsingTimestamp,
		},
		privacy = await presence.getSetting<boolean>("privacy");

	if ((homepageInput && homepageImage) || !document.location.pathname)
		presenceData.details = "Home";
	else if (document.location.pathname.startsWith("/doodles/")) {
		const doodleResult = new URL(document.location.href).searchParams.get("q"),
			doodleTitle: HTMLElement = document.querySelector(
				"#title-card > div > h2"
			);

		if (document.location.pathname.includes("/about")) {
			presenceData.details = "Doodles";
			presenceData.state = "About";
		} else if (doodleTitle) {
			presenceData.details = "Viewing a doodle:";
			presenceData.state = doodleTitle.textContent;
		} else if (doodleResult && document.location.pathname === "/doodles/") {
			presenceData.details = "Searching for a doodle:";
			presenceData.state = doodleResult;
			presenceData.smallImageKey = "search";
		} else {
			presenceData.details = "Current page:";
			presenceData.state = "Doodles";
		}
	} else if (document.location.pathname.startsWith("/search")) {
		const searchTab = new URL(document.location.href).searchParams.get("tbm");
		presenceData.smallImageKey = "search";

		if (!searchTab) {
			presenceData.details = `Searching for ${homepageInput.value}`;
			presenceData.state = document.querySelector("#result-stats").textContent;
		} else {
			switch (searchTab) {
				case "isch": {
					presenceData.details = "Google Images";
					presenceData.state = `Searching for ${imgInput.value}`;

					break;
				}
				case "vid": {
					presenceData.details = "Google Videos";
					presenceData.state = `Searching for ${pageInput.value}`;

					break;
				}
				case "nws": {
					presenceData.details = "Google News";
					presenceData.state = `Searching for ${pageInput.value}`;

					break;
				}
				case "bks": {
					presenceData.details = "Google Books";
					presenceData.state = `Searching for ${pageInput.value}`;

					break;
				}
				case "fin": {
					presenceData.details = "Google Finance";
					presenceData.state = `Searching for ${pageInput.value}`;

					break;
				}
				case "pers": {
					presenceData.details = "Google Personal";
					presenceData.state = `Searching for ${pageInput.value}`;

					break;
				}
				// No default
			}
		}
		if (privacy) {
			delete presenceData.state;
			if (presenceData.details.includes("Searching for"))
				presenceData.details = "Searching";
		}
	}
	presence.setActivity(presenceData);
});
