const presence = new Presence({
		clientId: "701914032541794386",
	}),
	time = Math.floor(Date.now() / 1000);

presence.on("UpdateData", () => {
	const presenceData: PresenceData = {
		largeImageKey: "https://i.imgur.com/LyrRnRS.png",
		startTimestamp: time,
	};

	if (document.location.pathname.toLowerCase() === "/") {
		presenceData.details = "Initial page";
		presenceData.state = "Just waiting";
	} else {
		presenceData.smallImageKey = "vcall";
		presenceData.details = "In a meeting";
		presenceData.state = `${
			(document.querySelector(".wnPUne") ?? document.querySelector(".uGOf1d"))
				.textContent
		} users in the room`;
	}

	presence.setActivity(presenceData);
});
