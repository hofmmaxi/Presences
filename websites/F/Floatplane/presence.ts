const presence = new Presence({
		clientId: "889918462477095012",
	}),
	browsingTimestamp = Date.now();

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "https://i.imgur.com/tXncd0U.png",
			startTimestamp: browsingTimestamp,
		},
		[, page, pageType, pageTypeType] = location.pathname.split("/");

	if (!page) {
		//Uploads
		const subCount =
				document.querySelector(".simplebar-content")?.children.length,
			showCount = await presence.getSetting<boolean>("subscriptions");

		presenceData.details = "Vieweing uploads";

		if (showCount && subCount > 0) {
			presenceData.state = `${subCount - 1} ${
				subCount > 2 ? "Subscriptions" : "Subscription"
			}`;
		}
	} else {
		switch (page) {
			case "discover": {
				//Homepage
				presenceData.details = "Viewing Homepage";
				presenceData.state = "Say Hello To Floatplane";

				break;
			}
			case "browse": {
				//Browsing
				const searchTerm = (
						document.querySelector(".search-bar") as HTMLInputElement
					)?.value,
					channelCount =
						document.querySelector(".creator-cards")?.children.length;

				presenceData.details = "Browsing";
				presenceData.state = `${channelCount} Channels`;
				presenceData.smallImageKey = "reading";
				presenceData.smallImageText = "Browsing";

				if (searchTerm) {
					let stringFormated;

					switch (channelCount) {
						case 1:
							if (document.querySelector(".search-not-found")) {
								stringFormated = "No Results";
								break;
							}
							stringFormated = "1 Channel";
							break;

						default:
							stringFormated = `${channelCount} Channels`;
					}

					presenceData.details = `Searching: ${searchTerm}`;
					presenceData.state = stringFormated;
					presenceData.smallImageKey = "search";
					presenceData.smallImageText = "Searching";
				}

				break;
			}
			case "channel": {
				//Viewing a channel
				const channelTitle =
					document.querySelector(".channel-title")?.textContent;

				//Wait for page to load
				if (!channelTitle) return;

				presenceData.details = "Viewing channel:";
				presenceData.state = channelTitle;
				presenceData.largeImageKey = pageType.toLowerCase();
				presenceData.smallImageKey = "logo";
				presenceData.smallImageText = document.title;
				presenceData.buttons = [{ label: "View Channel", url: location.href }];

				if (pageTypeType === "live") {
					//Stream
					const title = document.querySelector(".title-text")?.textContent;
					if (!title || !document.querySelector("video")) return;

					delete presenceData.startTimestamp;

					presenceData.details = title;
					presenceData.smallImageKey = "live";
					presenceData.smallImageText = "Live";
					presenceData.buttons = [
						{
							label: "View Stream",
							url: location.href,
						},
						{
							label: "View Channel",
							url: (document.querySelector(".channel-title") as HTMLLinkElement)
								?.href,
						},
					];
				}

				break;
			}
			default:
				switch (pageType) {
					case "profile": {
						//User
						const channelTitle =
							document.querySelector(".channel-title").textContent;

						//Wait for page to load
						if (!channelTitle) return;

						presenceData.details = "Viewing user:";
						presenceData.state = channelTitle;
						presenceData.buttons = [{ label: "View User", url: location.href }];

						break;
					}
					case "settings": {
						//Settings
						presenceData.details = "Viewing thier";
						presenceData.state = "Settings";

						break;
					}
					case "help": {
						//Help pages
						presenceData.details = "Viewing:";
						presenceData.state = "Support pages";

						break;
					}
					default:
						switch (page) {
							case "support": {
								//Support Pages
								const searchTerm = (
										document.querySelector("#search") as HTMLInputElement
									).textContent,
									faqCount =
										document.querySelectorAll(".question-answer").length;

								presenceData.details = "Viewing FAQ";
								presenceData.state = `${faqCount} topics`;

								if (searchTerm) {
									let stringFormated;

									switch (faqCount) {
										case 1:
											stringFormated = "1 Topic";
											break;
										case 0:
											stringFormated = "No Results";
											break;
										default:
											stringFormated = `${faqCount} Topics`;
									}

									presenceData.details = `Searching FAQ: ${searchTerm}`;
									presenceData.state = stringFormated;
									presenceData.smallImageKey = "search";
									presenceData.smallImageText = "Searching";
								}

								break;
							}
							case "legal": {
								//Support Pages
								presenceData.details = "Legal Stuff";
								presenceData.buttons = [
									{
										label: "Terms of Service",
										url: "https://www.floatplane.com/legal/terms",
									},
									{
										label: "Privacy Policy",
										url: "https://www.floatplane.com/legal/privacy",
									},
								];

								break;
							}
							case "post": {
								//Video
								const video = document.querySelector(
									"video"
								) as HTMLVideoElement;

								//Wait for page to load
								if (!video) return;
								delete presenceData.startTimestamp;

								presenceData.details =
									document.querySelector(".title-text")?.textContent;
								presenceData.state =
									document.querySelector(".channel-title")?.textContent;
								presenceData.largeImageKey = (
									document.querySelector(".channel-title") as HTMLLinkElement
								)?.href
									.toLowerCase()
									?.split("/")
									.slice(-1)[0];
								[, presenceData.endTimestamp] =
									presence.getTimestampsfromMedia(video);
								presenceData.smallImageKey = video.paused ? "pause" : "play";
								presenceData.smallImageText = video.paused
									? "Paused"
									: "Playing";
								presenceData.buttons = [
									{
										label: "View Video",
										url: location.href,
									},
									{
										label: "View Channel",
										url: (
											document.querySelector(
												".channel-title"
											) as HTMLLinkElement
										).href,
									},
								];

								if (video.paused) {
									delete presenceData.startTimestamp;
									delete presenceData.endTimestamp;
								}

								break;
							}
							// No default
						}
				}
		}
	}

	const showButtons = await presence.getSetting<boolean>("buttons");

	if (!showButtons) delete presenceData.buttons;

	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
