const presence = new Presence({
		clientId: "640980262750126080",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000);

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
		largeImageKey: "https://i.imgur.com/1CYkKgl.png",
		startTimestamp: browsingTimestamp,
	};

	if (document.location.hostname === "lectortmo.com") {
		if (document.location.pathname === "/")
			presenceData.details = "Browsing...";
		else if (document.location.pathname.includes("/library/manga/")) {
			presenceData.details = "Viewing manga:";
			presenceData.state = document.querySelector(
				"#app > section > header > section > div > div > div:nth-child(3) > h1"
			).textContent;
			presenceData.smallImageKey = "reading";
		} else if (document.location.pathname.includes("/library"))
			presenceData.details = "Viewing the library";
		else if (document.location.pathname.includes("/groups/")) {
			presenceData.details = "Viewing group:";
			presenceData.state = document.querySelector(
				"#app > section > header > section > div > div > div:nth-child(2) > h1"
			).textContent;
		} else if (document.location.pathname.includes("/groups"))
			presenceData.details = "Viewing groups";
		else if (document.location.pathname.includes("/lists/")) {
			presenceData.details = "Viewing group:";
			presenceData.state = document.querySelector(
				"#app > section > header > section > div > div > div:nth-child(2) > h1"
			).textContent;
		} else if (document.location.pathname.includes("/lists"))
			presenceData.details = "Viewing groups";
		else if (document.location.pathname.includes("/viewer/")) {
			presenceData.details = "Reading manga:";
			presenceData.smallImageKey = "reading";
			presenceData.state = document.querySelector(
				"#app > section:nth-child(2) > div > div > h1"
			).textContent;
		}
	} else if (document.location.hostname === "tmocommunity.com") {
		presenceData.startTimestamp = browsingTimestamp;
		presenceData.details = "Browsing the forums...";
		if (document.location.pathname.includes("/d/")) {
			presenceData.details = "Reading forum post:";
			presenceData.state = document.querySelector(
				"#content > div > div > header > div > ul > li.item-title > h2"
			).textContent;
		}
	}

	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
