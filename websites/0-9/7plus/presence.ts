const presence = new Presence({
	clientId: "843060416208306196",
});

let showName: HTMLElement;

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "https://i.imgur.com/BamXC8h.png",
		},
		{ pathname, href } = document.location,
		[privacy, buttons, covers] = await Promise.all([
			presence.getSetting<boolean>("privacy"),
			presence.getSetting<boolean>("buttons"),
			presence.getSetting<boolean>("covers"),
		]),
		video = document.querySelector("video");

	if (privacy && !video) presenceData.details = "Browsing";
	else if (pathname.includes("/home/") || pathname === "/")
		presenceData.details = "Viewing 7plus home";
	else {
		switch (pathname) {
			case "/shows-a-z": {
				presenceData.details = "Browsing 7plus Shows";
				presenceData.buttons = [
					{
						label: "Browse Shows",
						url: href,
					},
				];
				break;
			}
			case "/sport": {
				presenceData.details = "Browsing 7plus Sports";

				presenceData.buttons = [
					{
						label: "Browse All Sports",
						url: href,
					},
				];
				break;
			}
			case "/search": {
				presenceData.details = "Searching for";
				presenceData.state =
					document.querySelector<HTMLInputElement>(
						'[placeholder="Search for shows"]'
					)?.value ?? "Nothing";
				break;
			}
			case "/live-tv" || "/watch-live-tv": {
				showName = document.querySelector(
					"h2.h3§3Lep4.fw700§1YAxq.truncate2§d57BK.truncateMobile§1Yywu"
				);
				presenceData.largeImageKey =
					document.querySelector<HTMLMetaElement>('[property="og:image"]')
						?.content ?? "https://i.imgur.com/BamXC8h.png";
				presenceData.smallImageKey = "live";
				presenceData.smallImageText = "Live";
				presenceData.details = document
					.querySelector('[class="swiper-slide swiper-slide-active"]')
					.querySelector('[class*="title"]').textContent;
				presenceData.state = `Watching: ${showName.textContent}`;
				presenceData.buttons = [
					{
						label: "Tune In Live",
						url: href,
					},
				];
				break;
			}
			case "/query": {
				presenceData.details = "Searching 7plus!";
				break;
			}
			default: {
				if (privacy && video && document.querySelector('[class*="showPlayer"]'))
					presenceData.details = "Watching";
				else if (privacy && video) presenceData.details = "Browsing";
				else if (video && document.querySelector('[class*="showPlayer"]')) {
					presenceData.buttons = [
						{
							label: "View The Video",
							url: href,
						},
					];
					if (video.paused) {
						delete presenceData.endTimestamp;
						presenceData.smallImageKey = "paused";
					}
					[, presenceData.endTimestamp] =
						presence.getTimestampsfromMedia(video);
					presenceData.details = document.querySelector(
						'[class="vjs-top-bar-title"]'
					).textContent;
					presenceData.smallImageKey = "play";
					presenceData.largeImageKey =
						video.getAttribute("poster") ?? "https://i.imgur.com/BamXC8h.png";
				} else {
					presenceData.buttons = [
						{
							label: "View Show",
							url: href,
						},
					];
					presenceData.largeImageKey =
						document
							.querySelector('[class="logoWrapper"]')
							?.getAttribute("src") ??
						document.querySelector<HTMLMetaElement>('[property="og:image"]')
							?.content ??
						"https://i.imgur.com/BamXC8h.png";

					presenceData.details = `Viewing "${
						document.querySelector('[class="vjs-top-bar-title"]')
							?.textContent ??
						document.querySelector('[class*="tintable"]')?.textContent
					}"`;
				}
			}
		}
	}
	if (!covers) presenceData.largeImageKey = "https://i.imgur.com/BamXC8h.png";
	if (!buttons) delete presenceData.buttons;
	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
