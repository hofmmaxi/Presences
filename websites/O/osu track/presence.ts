const presence = new Presence({
		clientId: "861180231909113866",
	}),
	timestampe = Math.floor(Date.now() / 1000);

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "https://i.imgur.com/oSw7qlV.png",
			startTimestamp: timestampe,
		},
		pathnames = location.pathname,
		urlSplit = document.URL.split("/")[5],
		decodeURL = decodeURIComponent(urlSplit);

	switch (pathnames) {
		case "/osutrack/": {
			presenceData.details = "Viewing homepage";
			break;
		}
		case "/osutrack/user/": {
			presenceData.details = "Viewing a user's statistics";
			presenceData.state = "User not found!";

			break;
		}
		case `/osutrack/user/${urlSplit}`:
		case `/osutrack/user/${urlSplit}/`: {
			presenceData.details = "Viewing a user's statistics";
			presenceData.state = decodeURL;
			presenceData.smallImageKey = "osu_std_logo";
			presenceData.smallImageText = "osu!standard";

			break;
		}
		default:
			if (pathnames.includes(`/osutrack/user/${urlSplit}/taiko`)) {
				presenceData.details = "Viewing a user's statistics";
				presenceData.state = `${decodeURL} in osu!taiko`;
				presenceData.smallImageKey = "taiko";
				presenceData.smallImageText = "Taiko";
			} else if (pathnames.includes(`/osutrack/user/${urlSplit}/ctb`)) {
				presenceData.details = "Viewing a user's statistics";
				presenceData.state = `${decodeURL} in osu!catch the beat`;
				presenceData.smallImageKey = "ctb";
				presenceData.smallImageText = "Catch The Beat (CTB)";
			} else if (pathnames.includes(`/osutrack/user/${urlSplit}/mania`)) {
				presenceData.details = "Viewing a user's statistics";
				presenceData.state = `${decodeURL} in osu!mania`;
				presenceData.smallImageKey = "mania";
				presenceData.smallImageText = "Mania";
			} else {
				switch (pathnames) {
					case "/osutrack/bestplays/": {
						presenceData.details = "Viewing at the Best Plays";
						presenceData.state = "osu!standard";
						presenceData.smallImageKey = "osu_std_logo";
						presenceData.smallImageText = "osu!standard";

						break;
					}
					case "/osutrack/bestplays/taiko/": {
						presenceData.details = "Viewing at the Best Plays";
						presenceData.state = "osu!taiko";
						presenceData.smallImageKey = "taiko";
						presenceData.smallImageText = "osu!taiko";

						break;
					}
					case "/osutrack/bestplays/ctb/": {
						presenceData.details = "ViewKing at the Best Plays";
						presenceData.state = "osu!catch the beat (cbt)";
						presenceData.smallImageKey = "ctb";
						presenceData.smallImageText = "osu!catch the beat";

						break;
					}
					case "/osutrack/bestplays/mania/": {
						presenceData.details = "Viewing at the Best Plays";
						presenceData.state = "osu!mania";
						presenceData.smallImageKey = "mania";
						presenceData.smallImageText = "osu!mania";

						break;
					}
					case "/osutrack/b/": {
						presenceData.details = `Viewing ${
							document.querySelector("body > h1").textContent
						}`;

						break;
					}
					case "/osutrack/b/ads/": {
						presenceData.details = "Viewing About Ads on osu!track";
						break;
					}
					case "/osutrack/b/discord/": {
						presenceData.details = "Viewing about osu!track's Discord Bot";
						break;
					}
					case "/osutrack/b/mailer/": {
						presenceData.details =
							"Viewing abotu osu!track's Mailerbot Refrence";
						break;
					}
					case "/osutrack/b/pp/": {
						presenceData.details = "Viewing at Top 10 PP Plays of osu!";
						presenceData.state = "As of 10/10/2014";

						break;
					}
					case "/osutrack/updater/":
					case "/osutrack/updater/index.php":
						{
							presenceData.details = "Viewing at the IRC Bot's Documentation";
							// No default
						}
						break;
				}
			}
	}

	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
