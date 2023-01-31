const presence = new Presence({
		clientId: "761889098490183691",
	}),
	strings = presence.getStrings({
		play: "general.playing",
		pause: "general.paused",
	});

let songName: HTMLElement,
	songArtist: HTMLElement,
	songNameS: string,
	songArtistS: string;

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
		largeImageKey: "https://i.imgur.com/o4Ea2f9.png",
	};

	songName = document.querySelector(
		"header.MuiAppBar-root > div.music-dataview-container > span.App-Player-Song-Title-Text"
	);
	if (!songName) {
		(songNameS = document.querySelector("#marquee1").textContent),
			(songNameS = songNameS.replace("<span>", "")),
			(songNameS = songNameS.replace("</span>", ""));
		if (songNameS === "") songNameS = "None";
	} else if (songName) songNameS = songName.textContent;

	songArtist = document.querySelector(
		"header.MuiAppBar-root > div.music-dataview-container > span.App-Player-Song-Artist-Text"
	);
	if (!songArtist) {
		(songArtistS = document.querySelector("#marquee2").textContent),
			(songArtistS = songArtistS.replaceAll("&amp;", "&")),
			(songArtistS = songArtistS.replace('<span class="artist">', "")),
			(songArtistS = songArtistS.replace("</span>", ""));
		if (songNameS === "") songArtistS = "None";
	} else if (songArtist) {
		(songArtistS = songArtist.textContent),
			(songArtistS = songArtistS.replace("&amp;", "&"));
	}

	if ((songNameS === "None" && songArtistS === "None") || songArtistS === "") {
		presenceData.smallImageKey = "paused";
		presenceData.smallImageText = "PauseChamp";

		presenceData.details = (await strings).pause;
	} else {
		presenceData.smallImageKey = "play";
		presenceData.smallImageText = "Playing...";

		presenceData.details = songNameS;
		presenceData.state = songArtistS;
	}

	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
