const presence = new Presence({
		clientId: "930914836773224498",
	}),
	browsingStamp = Math.floor(Date.now() / 1000);
let remaining = 0,
	leftTimestamp = 0,
	player = {
		total: "",
		elapsed: "",
		isPlaying: false,
	},
	video = {
		currentTime: 0,
		duration: 0,
		paused: true,
	};

presence.on(
	"iFrameData",
	(data: {
		elapsed: string;
		total: string;
		isPlaying: boolean;
		currentTime: number;
		duration: number;
		paused: boolean;
	}) => {
		(player = {
			total: data.total,
			elapsed: data.elapsed,
			isPlaying: data.isPlaying,
		}),
			(video = {
				currentTime: data.currentTime,
				duration: data.duration,
				paused: data.paused,
			});
	}
);

presence.on("UpdateData", async () => {
	const [elapsed, buttons, images, timeLeft] = await Promise.all([
			presence.getSetting<boolean>("elapsed"),
			presence.getSetting<boolean>("buttons"),
			presence.getSetting<boolean>("images"),
			presence.getSetting<boolean>("timeLeft"),
		]),
		presenceData: PresenceData = {
			largeImageKey: "https://i.imgur.com/Vks89dr.png",
			startTimestamp: browsingStamp,
		};

	switch (document.location.hostname.split(".")[0]) {
		case "www":
			switch (document.location.pathname.split("/")[1]) {
				case "data":
					switch (document.location.pathname.split("/")[2]) {
						case "airports":
							if (document.location.pathname === "/data/airports")
								presenceData.details = "Browsing Airports";
							else if (document.querySelector("[id='cnt-subpage-title']")) {
								presenceData.details = `Browsing ${
									document.querySelector("[id='cnt-subpage-title']")
										.firstElementChild.firstChild.textContent
								}`;
								presenceData.state = `${
									document.querySelector("small").textContent.split(" ")[1]
								} ${document
									.querySelector("small")
									.textContent.split(" ")[2][0]
									.toUpperCase()}${document
									.querySelector("small")
									.textContent.split(" ")[2]
									.slice(1)}`;
							} else if (document.querySelector(".airport-name")) {
								presenceData.details = `Viewing ${
									document.querySelector(".airport-name").textContent
								}`;
								presenceData.state = document.querySelector<HTMLAnchorElement>(
									".btn.active"
								).childNodes[2]
									? document.querySelector<HTMLAnchorElement>(".btn.active")
											.childNodes[2].textContent
									: document.querySelector<HTMLAnchorElement>(".btn.active")
											.textContent;
								presenceData.buttons = [
									{
										label: "View Airport",
										url: document.location.href,
									},
								];
							} else presenceData.details = "Browsing Airports";
							break;
						case "airlines":
							if (document.querySelector(".airline-name")) {
								presenceData.details = `Viewing ${
									document.querySelector(".airline-name").textContent
								}`;
								presenceData.state = document.querySelector<HTMLAnchorElement>(
									".btn.active"
								).childNodes[2]
									? document.querySelector<HTMLAnchorElement>(".btn.active")
											.childNodes[2].textContent
									: document.querySelector<HTMLAnchorElement>(".btn.active")
											.textContent;
								presenceData.buttons = [
									{
										label: "View Airline",
										url: document.location.href,
									},
								];
							} else presenceData.details = "Browsing Airlines";
							break;
						case "aircraft":
							if (document.querySelector("[id='cnt-subpage-title'] > h1")) {
								presenceData.details = `Viewing ${document
									.querySelector("[id='cnt-subpage-title'] > h1 ")
									.textContent.replace("Production lists - ", "")}`;
								presenceData.buttons = [
									{
										label: "View Page",
										url: document.location.href,
									},
								];
							} else if (
								document.querySelector("[id='cnt-subpage-info'] > h1")
							) {
								presenceData.details = `Viewing ${document
									.querySelector("[id='cnt-subpage-info'] > h1 ")
									.textContent.replace(
										"Flight history for aircraft -",
										"Aircraft"
									)}`;
								if (
									images &&
									document.querySelector(".img-responsive") &&
									document.querySelector<HTMLImageElement>(".img-responsive")
										.src !== ""
								) {
									presenceData.largeImageKey =
										document.querySelector<HTMLImageElement>(
											".img-responsive"
										).src;
								}
								presenceData.buttons = [
									{
										label: "View Aircraft",
										url: document.location.href,
									},
								];
							} else presenceData.details = "Browsing Aircraft";
							break;
						case "flights":
							if (document.querySelector("[id='cnt-subpage-info'] > h1")) {
								presenceData.details = `Viewing ${document
									.querySelector("[id='cnt-subpage-info'] > h1 ")
									.textContent.match(/(flight .+$)/g)}`;
								presenceData.state = `${document
									.querySelector("[id='cnt-subpage-info'] > h1 ")
									.textContent.replace(/(flight .+$)/g, "")
									.replace("Flight history for ", "")}`;
								presenceData.buttons = [
									{
										label: "View Page",
										url: document.location.href,
									},
								];
							} else presenceData.details = "Browsing Flights";
							break;
						case "pinned":
							if (document.querySelector("[id='cnt-subpage-info'] > h1")) {
								presenceData.details = `Viewing ${document
									.querySelector("[id='cnt-subpage-info'] > h1 ")
									.textContent.replace(
										"Flight history for aircraft -",
										"Aircraft"
									)}`;
								if (
									images &&
									document.querySelector(".img-responsive") &&
									document.querySelector<HTMLImageElement>(".img-responsive")
										.src !== ""
								) {
									presenceData.largeImageKey =
										document.querySelector<HTMLImageElement>(
											".img-responsive"
										).src;
								}
								presenceData.buttons = [
									{
										label: "View Aircraft",
										url: document.location.href,
									},
								];
							} else presenceData.details = "Browsing Pinned Flights";
							break;
						case "statistics":
							presenceData.details = "Viewing Statistics";
							break;
						case null:
							presenceData.details = "Searching Data";
							break;
						default:
							presenceData.details = "Searching Data";
							break;
					}
					break;
				case "apps":
					presenceData.details = "Viewing Mobile Apps";
					presenceData.state = document.querySelector("a.active").textContent;
					break;
				case "add-coverage":
					presenceData.details = "Viewing Add Coverage";
					break;
				case "apply-for-receiver":
					presenceData.details = "Viewing Apply For Receiver";
					break;
				case "share-your-data":
					presenceData.details = "Viewing Share Data";
					presenceData.state = document.querySelector("li.active").textContent;
					break;
				case "build-your-own":
					presenceData.details = "Viewing Build Your Own";
					presenceData.state = document.querySelector("li.active").textContent;
					break;
				case "share-statistics":
					presenceData.details = "Viewing Data Statistics";
					presenceData.state = `${
						document.querySelector("a.active").textContent.split(" ")[0]
					} ${document
						.querySelector("a.active")
						.textContent.split(" ")[1][0]
						.toUpperCase()}${document
						.querySelector("a.active")
						.textContent.split(" ")[1]
						.slice(1)}`;
					break;
				case "premium":
					presenceData.details = "Viewing Subscription Plans";
					break;
				case "about":
					presenceData.details = "Viewing About Flightradar24";
					break;
				case "how-it-works":
					presenceData.details = "Viewing How It Works";
					break;
				case "glossary":
					presenceData.details = "Viewing Glossary";
					break;
				case "faq":
					presenceData.details = "Viewing FAQ";
					break;
				case "contact-us":
					presenceData.details = "Viewing Contact Us";
					break;
				case "privacy-policy":
					presenceData.details = "Viewing Privacy Policy";
					break;
				case "terms-and-conditions":
					presenceData.details = "Viewing Terms of Service";
					break;
				case "commercial-services":
					if (
						document.location.pathname === "/commercial-services/data-services"
					)
						presenceData.details = "Viewing Data Services";
					else if (
						document.location.pathname ===
						"/commercial-services/app-integration"
					)
						presenceData.details = "Viewing App Integration";
					break;
				case "blog":
					switch (document.location.pathname) {
						case "/blog/": {
							presenceData.details = "Browsing Blog Posts";
							break;
						}
						case "/blog/newsletter/": {
							presenceData.details = "Viewing Newsletter";
							break;
						}
						case "/blog/avtalk-podcast/": {
							presenceData.details = "Viewing Podcast";
							break;
						}
						default:
							if (document.querySelector("iframe.blubrryplayer")) {
								[presenceData.details, presenceData.state] = document
									.querySelector(
										".elementor-heading-title.elementor-size-default"
									)
									.textContent.split(":");
								if (player.isPlaying) {
									presenceData.smallImageKey = "playing";
									presenceData.smallImageText = "Playing";
									presenceData.endTimestamp =
										Math.floor(Date.now() / 1000) +
										(presence.timestampFromFormat(player.total) -
											presence.timestampFromFormat(player.elapsed));
								} else {
									presenceData.smallImageKey = "paused";
									presenceData.smallImageText = "Paused";
								}
							} else if (
								document.querySelector(
									"h1.elementor-heading-title.elementor-size-default > i.fas.fa-video"
								)
							) {
								let timestamps: number[];
								if (video.duration !== 0) {
									timestamps = presence.getTimestamps(
										video.currentTime,
										video.duration
									);
								} else if (document.querySelector("video")) {
									timestamps = presence.getTimestampsfromMedia(
										document.querySelector<HTMLMediaElement>("video")
									);
								} else {
									presenceData.details = "Viewing Blog Post";
									presenceData.state = document.querySelector(
										"h1.elementor-heading-title.elementor-size-default"
									).textContent;
									presenceData.buttons = [
										{
											label: "View Page",
											url: document.location.href,
										},
									];
								}
								presenceData.details = "Watching Video";
								presenceData.state = document
									.querySelector(
										"h1.elementor-heading-title.elementor-size-default"
									)
									.textContent.replace("Video: ", "");
								if (video.duration !== 0) {
									presenceData.buttons = [
										{
											label: "View Page",
											url: document.location.href,
										},
										{
											label: "Watch Video",
											url: `https://www.youtube.com/watch?v=${
												document
													.querySelector<HTMLVideoElement>(
														"iframe.elementor-video"
													)
													.src.split("/")[4]
													.split("?")[0]
											}`,
										},
									];
								} else if (document.querySelector("video")) {
									presenceData.buttons = [
										{
											label: "View Page",
											url: document.location.href,
										},
										{
											label: "Watch Video",
											url: document.querySelector<HTMLMetaElement>(
												"meta[itemprop='url']"
											).content,
										},
									];
								}
								if (video.duration !== 0) {
									if (video.paused) {
										presenceData.smallImageKey = "paused";
										presenceData.smallImageText = "Paused";
									} else {
										presenceData.smallImageKey = "playing";
										presenceData.smallImageText = "Playing";
										presenceData.startTimestamp = timestamps[0];
										presenceData.endTimestamp = timestamps[1];
									}
								} else if (document.querySelector("video")) {
									if (
										document.querySelector<HTMLMediaElement>("video").paused
									) {
										presenceData.smallImageKey = "paused";
										presenceData.smallImageText = "Paused";
									} else {
										presenceData.smallImageKey = "playing";
										presenceData.smallImageText = "Playing";
										presenceData.startTimestamp = timestamps[0];
										presenceData.endTimestamp = timestamps[1];
									}
								}
							} else {
								presenceData.details = "Viewing Blog Post";
								presenceData.state = document.querySelector(
									"h1.elementor-heading-title.elementor-size-default"
								).textContent;
								presenceData.buttons = [
									{
										label: "View Page",
										url: document.location.href,
									},
								];
							}
					}
					break;

				default:
					if (document.querySelector("body[class*='multiView']")) {
						presenceData.details = `Viewing ${
							document.querySelector("button > span.selected").textContent
						} Mode`;
						if (document.querySelector(".layout.flex")) {
							presenceData.buttons = [
								{
									label: "View Page",
									url: document.location.href,
								},
							];
							if (
								document.querySelector(".layout.flex").childElementCount === 1
							) {
								presenceData.state = `Tracking ${document
									.querySelector(".layout.flex")
									.childElementCount.toString()} Flight`;
							} else if (
								document.querySelector(".layout.flex").childElementCount >= 2
							) {
								presenceData.state = `Tracking ${document
									.querySelector(".layout.flex")
									.childElementCount.toString()} Flights`;
							}
						}
					} else if (document.querySelector("body[id='map']")) {
						presenceData.details = `Viewing ${
							document.querySelector("button > span.selected").textContent
						} Mode`;
						if (document.querySelector("[class*='show-left-overlay']")) {
							if (
								document.querySelector("[class*='airline-info__callsign']")
									.textContent === "NO CALLSIGN"
							) {
								presenceData.details = `Tracking ${
									document.querySelector(
										"div[title='Aircraft Registration Number']"
									).childNodes[3].textContent
								}`;
							} else {
								presenceData.details = `Tracking ${
									document.querySelector(".airline-info__head > h2 ")
										.textContent
								} ${
									document.querySelector(".airline-info__head > h3 ")
										.textContent
								}`;
							}
							if (
								document.querySelector(
									".pnl-component.flight-info.appear > div > div > div > h3 > span "
								).innerHTML !== "&nbsp;"
							) {
								presenceData.state = `${
									document.querySelector(
										".pnl-component.flight-info.appear > div > div > div > h3 > span "
									).textContent
								} to ${
									document.querySelector(
										".pnl-component.flight-info.appear > div > div > div:nth-of-type(2) > h3 > span "
									).textContent
								}`;
							}
							presenceData.smallImageKey = document.querySelector(
								"svg[class^='active']"
							).id;
							presenceData.smallImageText =
								document.querySelector<HTMLOrSVGImageElement>(
									"svg[class^='active']"
								).dataset.tooltipValue;
							if (
								document.querySelector(".flight-progress.appear") &&
								document.querySelector(
									".time-distance > div:nth-of-type(2) > span:nth-of-type(2)"
								).className !== "hidden"
							) {
								if (
									remaining !==
									parseInt(
										document
											.querySelector(
												".time-distance > div:nth-of-type(2) > span:nth-of-type(2)"
											)
											.textContent.slice(5)
											.split(":")[0]
									) *
										3600 +
										parseInt(
											document
												.querySelector(
													".time-distance > div:nth-of-type(2) > span:nth-of-type(2)"
												)
												.textContent.slice(5)
												.split(":")[1]
										) *
											60
								) {
									remaining =
										parseInt(
											document
												.querySelector(
													".time-distance > div:nth-of-type(2) > span:nth-of-type(2)"
												)
												.textContent.slice(5)
												.split(":")[0]
										) *
											3600 +
										parseInt(
											document
												.querySelector(
													".time-distance > div:nth-of-type(2) > span:nth-of-type(2)"
												)
												.textContent.slice(5)
												.split(":")[1]
										) *
											60;
									leftTimestamp = Math.floor(Date.now() / 1000) + remaining;
									presenceData.endTimestamp = leftTimestamp;
								} else presenceData.endTimestamp = leftTimestamp;
							}
							if (
								images &&
								document.querySelector<HTMLImageElement>(
									".pnl-component.aircraft-image > a > img"
								).src !==
									"https://www.flightradar24.com/static/images/jp-promo.jpg"
							) {
								presenceData.largeImageKey =
									document.querySelector<HTMLImageElement>(
										".pnl-component.aircraft-image > a > img"
									).src;
							}
							presenceData.buttons = [
								{
									label: "View Page",
									url: document.location.href,
								},
							];
						} else if (
							document.querySelector("[class*='airport-panel-open']")
						) {
							presenceData.details = `Tracking ${
								document.querySelector(
									".pnl-component.airport-info > .title > span"
								).textContent
							}`;
							if (document.querySelector("span[class='AM']")) {
								presenceData.state = `${
									document.querySelector("span[class='AM']").textContent
								}am | ${
									document
										.querySelector(".pnl-component.airport-info > .time > span")
										.textContent.split("|")[1]
								} | ${
									document
										.querySelector(".pnl-component.airport-info > .time > span")
										.textContent.split("|")[2]
								}`;
							} else if (document.querySelector("span[class='PM']")) {
								presenceData.state = `${
									document.querySelector("span[class='PM']").textContent
								}pm | ${
									document
										.querySelector(".pnl-component.airport-info > .time > span")
										.textContent.split("|")[1]
								} | ${
									document
										.querySelector(".pnl-component.airport-info > .time > span")
										.textContent.split("|")[2]
								}`;
							}
							if (images) {
								presenceData.largeImageKey =
									document.querySelector<HTMLImageElement>(
										".pnl-component.airport-image > a > img"
									).src;
							}
							presenceData.buttons = [
								{
									label: "View Page",
									url: document.location.href,
								},
							];
						}
					} else {
						presenceData.details = "Unsupported Page";
						presenceData.state = document.location.pathname;
					}
					break;
			}

			if (document.querySelector("[class='session-timeout-modal visible']"))
				presenceData.details = "Session Timed Out";

			break;
		case "forum":
			if (document.location.pathname === "/") {
				presenceData.details = `Viewing ${
					document.querySelector(".ui-state-active").textContent
				}`;
			} else if (document.location.pathname.split("/")[1] === "member") {
				presenceData.details = `Viewing ${
					document.querySelector(".ui-state-active").textContent
				} Of User`;
				presenceData.state = document.querySelector(".username").textContent;
				presenceData.buttons = [
					{
						label: "View Profile",
						url: document.location.href,
					},
				];
			} else if (
				document.querySelector(".widget-tabs-nav > ul > .ui-state-active") &&
				document.querySelector("h1.main-title")
			) {
				presenceData.details = `Viewing ${
					document.querySelector(".widget-tabs-nav > ul > .ui-state-active")
						.textContent
				} Of`;
				presenceData.state =
					document.querySelectorAll("h1.main-title")[1].textContent;
				presenceData.buttons = [
					{
						label: "View Page",
						url: document.location.href,
					},
				];
			} else if (document.querySelector("h1.main-title")) {
				presenceData.details = `Viewing ${
					document.querySelectorAll("h1.main-title")[1].textContent
				}`;
				presenceData.buttons = [
					{
						label: "View Page",
						url: document.location.href,
					},
				];
			} else {
				presenceData.details = "Unsupported Page";
				presenceData.state = document.location.pathname;
			}
			if (
				document.location.pathname.split("/")[1] === "search" &&
				document.querySelector(".search-controls-keywords")
			) {
				presenceData.state = document.querySelector(
					".search-controls-keywords"
				).lastChild.textContent;
			}
			break;
		case "my":
			if (document.location.pathname.split("/")[1] === "settings") {
				presenceData.details = "Viewing Settings";
				presenceData.state = document.querySelector("li.active").textContent;
			} else if (document.location.pathname.split("/")[1] === "friends")
				presenceData.details = "Viewing Friends";
			else if (document.location.pathname.split("/")[1] === "add-flight")
				presenceData.details = "Adding Flight To Log";
			else if (document.location.pathname !== "/") {
				presenceData.details = `Viewing Profile Of ${
					document.querySelector("h3").textContent
				}`;
				presenceData.state = document.querySelector("h2").textContent;
				presenceData.buttons = [
					{
						label: "View Page",
						url: document.location.href,
					},
				];
				if (images) {
					presenceData.largeImageKey = document
						.querySelector<HTMLImageElement>("img.avatar")
						.src.replace("=64", "=1024")
						.replace("=64", "=1024");
				}
			} else presenceData.details = "Viewing Logbook Homepage";
			break;
		case "careers":
			presenceData.details = "Careers at Flightradar24";
			if (document.location.pathname === "/jobs")
				presenceData.state = "Browsing Jobs";
			else if (document.querySelector("span.textFitted")) {
				presenceData.state =
					document.querySelector("span.textFitted").textContent;
			} else
				presenceData.state = document.querySelectorAll("h2")[1].textContent;
			break;
		default:
			presenceData.details = "Unsupported Subdomain";
			presenceData.state = document.location.hostname;
			break;
	}

	if (!elapsed) delete presenceData.startTimestamp;
	if (!timeLeft) delete presenceData.endTimestamp;
	if (!buttons && presenceData.buttons) delete presenceData.buttons;

	presence.setActivity(presenceData);
});
