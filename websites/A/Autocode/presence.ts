const presence = new Presence({ clientId: "858292108195921920" }),
	startedAt = Date.now(),
	supportedLanguages: string[] = [
		"js",
		"md",
		"json",
		"gitignore",
		"txt",
		"html",
		"css",
	];

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "https://i.imgur.com/KNLjAwu.jpg",
			startTimestamp: startedAt,
		},
		{ pathname, hostname } = window.location,
		path = pathname.split("/").slice(1),
		[details, state, timestamp] = await Promise.all([
			presence.getSetting<string>("editingDetails"),
			presence.getSetting<string>("editingState"),
			presence.getSetting<boolean>("timestamp"),
		]);

	if (pathname.includes("/snippet")) {
		if (path.length >= 3) {
			presenceData.details = document
				.querySelector("h1.snippet-title.h3")
				.textContent.trim();
		} else presenceData.details = "Looking for Snippets";
		presenceData.state = `${hostname}/${path[0]}`;
		presenceData.smallImageKey = "snippet";
	} else if (pathname.includes("/app")) {
		if (path.length >= 3) {
			presenceData.details = document
				.querySelector("h1.jumbo")
				.textContent.trim();
		} else presenceData.details = "Looking for Apps";
		presenceData.state = `${hostname}/${path[0]}`;
		presenceData.smallImageKey = "apps";
	} else if (pathname.includes("/lib")) {
		if (path.length >= 3) presenceData.details = `Reading ${path[1]} docs`;
		else presenceData.details = "Looking for Docs";
		presenceData.state = `${hostname}/${path[0]}`;
		presenceData.smallImageKey = "lib";
	} else if (pathname.includes("/mp/")) {
		const filename = document
			.querySelector("div.filename > [data-filename]")
			?.textContent?.split("/")
			?.pop();

		if (filename) {
			const extension = filename.match(/\.\w+/g)?.[0]?.replace(".", ""),
				[line, column] = document
					.querySelector("div.filename > [data-cursor]")
					.textContent.split(":"),
				replaceTemplate = (str: string) => {
					if (str === "{0}") return;
					else {
						return str
							.replace("%project%", path[2])
							.replace("%file%", filename)
							.replace("%line%", line)
							.replace("%column%", column);
					}
				};

			presenceData.details = replaceTemplate(details);
			presenceData.state = replaceTemplate(state);
			presenceData.smallImageKey = "autocode";

			if (extension && supportedLanguages.includes(extension))
				presenceData.largeImageKey = `lang-${extension}`;
			else presenceData.largeImageKey = "autocode";
		}
	}

	if (!timestamp) delete presenceData.startTimestamp;

	if (presenceData.details || presenceData.state)
		presence.setActivity(presenceData);
	else presence.setActivity();
});
