let elapsed = Math.floor(Date.now() / 1000),
	prevUrl = document.location.href;

const presence = new Presence({
		clientId: "853718947412967474",
	}),
	strings = presence.getStrings({
		play: "general.playing",
		pause: "general.paused",
		browsing: "general.browsing",
		browsingThrough: "discord.browseThrough",
		buttonWatchVideo: "general.buttonWatchVideo",
		buttonWatchStream: "general.buttonWatchStream",
	});

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "https://i.imgur.com/baUokNs.png",
		},
		path = location.pathname.replace(/\/?$/, "/");

	if (document.location.href !== prevUrl) {
		prevUrl = document.location.href;
		elapsed = Math.floor(Date.now() / 1000);
	}

	if (path.startsWith("/video/") || path.startsWith("/live/")) {
		// Streaming
		const videoTitle = document.querySelector(
				".H2-sc-1h18a06-3.fZOeKY"
			).textContent,
			video: HTMLVideoElement = document.querySelector(
				".ardplayer-mediacanvas"
			);

		if (path.startsWith("/live/")) {
			// Livestream
			const channelLinkA = document.querySelector(".LogoLink-pae2yt-13.eOVFv");
			if (channelLinkA) {
				presenceData.largeImageKey = channelLinkA
					.getAttribute("href")
					.replace(/\//g, "");
			} else {
				// 3sat or KiKa or DeutscheWelle (speciality due to inconsistency in website -.-)
				const channelLinkIMG = document
					.querySelector(".src__Box-sc-1sbtrzs-0.Column-wbrv0h-1.llCdnS.hkXjQv")
					.children[0].children[0].getAttribute("src");
				if (channelLinkIMG === "/images/KdbelgIm.svg")
					presenceData.largeImageKey = "3sat";
				else if (channelLinkIMG === "/images/siBNbNWW.svg")
					presenceData.largeImageKey = "deutschewelle";
				else presenceData.largeImageKey = "kika";
			}

			presenceData.smallImageKey = "live";
			presenceData.smallImageText = "Live";
			presenceData.details = `${document.title
				.replace(/Livestream \| ARD-Mediathek/, "")
				.replace(/ Livestream national \| ARD-Mediathek/g, "")} Live`;
			presenceData.state = videoTitle;
			presenceData.startTimestamp = elapsed;
			presenceData.buttons = [
				{ label: (await strings).buttonWatchStream, url: prevUrl },
			];
		} else if (path.startsWith("/video/")) {
			// Video-on-demand
			presenceData.largeImageKey = "ard_mediathek";
			presenceData.smallImageKey = "play";
			presenceData.smallImageText = (await strings).play;
			presenceData.details = videoTitle;

			const videoDateDIV = document.querySelector(".Line-epbftj-1.dgMIUj");
			presenceData.state = `${
				videoDateDIV.children[0].textContent
			} from ${videoDateDIV.textContent.substring(
				0,
				videoDateDIV.textContent.indexOf("∙") - 1
			)}`;

			[, presenceData.endTimestamp] = presence.getTimestamps(
				Math.floor(video.currentTime),
				Math.floor(video.duration)
			);
			presenceData.buttons = [
				{ label: (await strings).buttonWatchVideo, url: prevUrl },
			];
		}

		// Player paused ?
		if (video.paused) {
			presenceData.smallImageKey = "pause";
			presenceData.smallImageText = (await strings).pause;
			delete presenceData.startTimestamp;
			delete presenceData.endTimestamp;
		}
	} else {
		presenceData.smallImageKey = "reading";
		presenceData.smallImageText = (await strings).browsingThrough;
		presenceData.details = (await strings).browsing;
		presenceData.startTimestamp = elapsed;
	}

	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
