const presence = new Presence({
	clientId: "921861694190407730",
});

async function getStrings() {
	return presence.getStrings(
		{
			play: "general.playing",
			pause: "general.paused",
			viewAlbum: "general.buttonViewAlbum",
			viewPlaylist: "general.buttonViewPlaylist",
		},
		await presence.getSetting<string>("lang").catch(() => "en")
	);
}

let strings: Awaited<ReturnType<typeof getStrings>> = null,
	oldLang: string = null;

presence.on("UpdateData", async () => {
	if (!document.querySelector("#root"))
		return presence.setActivity({ largeImageKey: "logo" });

	const [newLang, timestamps, cover] = await Promise.all([
		presence.getSetting<string>("lang").catch(() => "en"),
		presence.getSetting<boolean>("timestamps"),
		presence.getSetting<boolean>("cover"),
	]);

	if (oldLang !== newLang) {
		oldLang = newLang;
		strings = await getStrings();
	}

	const presenceData: PresenceData = {
			largeImageKey: cover
				? document
						.querySelector<HTMLImageElement>(
							'div[class="player__track-cover"] img'
						)
						.src.replaceAll("230", "600")
				: "logo",
		},
		songTitle = document.querySelector<HTMLAnchorElement>(
			'a[class="player__track-name"]'
		),
		fromPlaylist = !!document.querySelectorAll(
			'div[class="player__track-album"] a'
		)[2],
		currentTimeSec =
			presence.timestampFromFormat(
				document.querySelector<HTMLElement>(
					'span[class="player__track-time-text"]'
				).textContent
			) * 1000,
		endTimeSec =
			presence.timestampFromFormat(
				document.querySelectorAll<HTMLElement>(
					'span[class="player__track-time-text"]'
				)[1].textContent
			) * 1000,
		paused = !!document.querySelector(
			'span[class="player__action-play pct pct-player-play "] '
		),
		elm = document.querySelector(".player__action-repeat.pct"),
		obj = {
			repeatType: elm.classList.contains("pct-repeat-once")
				? "loopTrack"
				: elm.classList.contains("player__action-repeat--active")
				? "loopQueue"
				: "deactivated",
			songPlaylist: document.querySelectorAll<HTMLAnchorElement>(
				'div[class="player__track-album"] a'
			)[2],
		};

	let playliststring = "";
	if (fromPlaylist) playliststring = ` | From: ${obj.songPlaylist.textContent}`;

	presenceData.details = songTitle.textContent;
	presenceData.state =
		document.querySelector('div[class="player__track-album"] > a').textContent +
		playliststring;

	if (currentTimeSec > 0 || !paused) {
		presenceData.endTimestamp = Date.now() + (endTimeSec - currentTimeSec);
		presenceData.smallImageKey = paused ? "pause" : "play";
		presenceData.smallImageText = paused ? strings.pause : strings.play;
	}

	if (paused || !timestamps) {
		delete presenceData.startTimestamp;
		delete presenceData.endTimestamp;
	}

	if (obj.repeatType !== "deactivated" && !paused) {
		presenceData.smallImageKey =
			obj.repeatType === "loopQueue" ? "repeat" : "repeat-one";
		presenceData.smallImageText =
			obj.repeatType === "loopQueue" ? "Repeat" : "Repeat Once";
	}

	presenceData.buttons = [
		{
			label: strings.viewAlbum,
			url: songTitle.href,
		},
	];
	if (fromPlaylist) {
		presenceData.buttons.push({
			label: strings.viewPlaylist,
			url: obj.songPlaylist.href,
		});
	}
	presence.setActivity(presenceData);
});
