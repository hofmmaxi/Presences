const presence = new Presence({
	clientId: "924791712944099389",
});

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
			largeImageKey: "https://i.imgur.com/EwyBmHJ.png",
		},
		{ pathname, href } = document.location,
		[showThumb, showMessaging] = await Promise.all([
			presence.getSetting<boolean>("showthumb"),
			presence.getSetting<boolean>("showmessaging"),
		]),
		paths: string[] = pathname.split("/");
	if (!paths[0]) paths.shift();

	if (pathname === "/") presenceData.details = "Viewing the home page";
	else if (pathname.startsWith("/messages")) {
		if (!paths[1]) presenceData.details = "Viewing messages";
		else if (paths[1].startsWith("pm-") && showMessaging) {
			const body = document.querySelector<HTMLDivElement>(
				"body > main.animated > div.wrapper > div.dialogPadding"
			);
			presenceData.smallImageKey = parseAvatarFromAttr(
				body.querySelector("a.avatar").getAttribute("style")
			);

			presenceData.details = `Messaging ${
				body.querySelector<HTMLSpanElement>("span.username").textContent
			}`;
		} else if (paths[1].startsWith("pm-") && showMessaging === false)
			presenceData.details = "Viewing messages";
	} else if (pathname === "/chat")
		presenceData.details = "Chatting in the chat";
	else if (pathname.startsWith("/otakus")) {
		if (!paths[1] || paths[1].startsWith("page-")) {
			presenceData.details = "Viewing otakus";
			if (paths[1])
				presenceData.state = `Page ${paths[1].replace("page-", "")}`;
		} else if (paths[1]) {
			const body = document.querySelector<HTMLDivElement>(
					"body > main.animated > section.wrapper > div.header"
				),
				username = body.querySelector<HTMLSpanElement>(
					"div.content > div.holder > span.heading"
				).textContent;

			presenceData.largeImageKey = parseAvatarFromAttr(
				body.querySelector<HTMLAnchorElement>("a.avatar").getAttribute("style")
			);

			presenceData.details = `Viewing otaku ${username}`;
			presenceData.smallImageKey = "logo";
		}
	} else if (pathname.startsWith("/animes")) {
		if (paths[1] === "search" && paths[2]) {
			const query: string = paths[2].replaceAll("-", " ");
			let str = "Searching for";
			if (query.length <= 10) str = str += ` ${query}`;
			else presenceData.state = query;

			presenceData.details = str;
		} else if (paths[1])
			presenceData.details = `Viewing animes starting with ${paths[1].toUpperCase()}`;
		else presenceData.details = "Viewing animes";
	} else if (pathname.startsWith("/anime/")) {
		const [, uid, eid] = paths;

		if (uid && !eid) {
			const name = document.querySelector<HTMLHeadingElement>(
					"body > main.animated > div.wrapper > article.rowView > header.rowView-head > h1.heading"
				).textContent,
				image = document.querySelector<HTMLImageElement>(
					"body > main.animated > div.wrapper > article.rowView > aside.aside > div.cover-holder > img.abs"
				).src;

			if (image) presenceData.smallImageKey = "logo";

			presenceData.details = `Viewing ${name}`;
			presenceData.largeImageKey = image ?? "logo";
			presenceData.buttons = [
				{
					label: "View anime",
					url: href,
				},
			];
		} else if (uid && eid) {
			const { name, episode, part } = getInfo(),
				player = document.querySelector<HTMLDivElement>(
					"body > main.animated > div.wrapper > section.holder > div.player > div.holder > div.vplayer"
				),
				thumb = parseAvatarFromAttr(player.getAttribute("style"), "logo");

			if (!player.classList.contains("playing")) {
				presenceData.details = `Watching ${name}`;
				presenceData.state = `Episode ${episode}`;
				presenceData.buttons = [
					{
						label: "Watch anime",
						url: href,
					},
				];

				if (part) presenceData.state = presenceData.state += ` (part ${part})`;

				if (thumb !== "logo" && showThumb) {
					presenceData.largeImageKey = thumb;
					presenceData.smallImageKey = "logo";
				}
			}
		}
	} else if (pathname.startsWith("/movies")) {
		if (paths[1] === "search" && paths[2]) {
			const query: string = paths[2].replaceAll("-", " ");
			let str = "Searching for";
			if (query.length <= 10) str = str += ` ${query}`;
			else presenceData.state = query;

			presenceData.details = str;
		} else if (paths[1])
			presenceData.details = `Viewing movies starting with ${paths[1].toUpperCase()}`;
		else presenceData.details = "Viewing movies";
	} else if (pathname.startsWith("/movie/")) {
		const name = document.querySelector<HTMLHeadingElement>(
				"body > main.animated > div.wrapper > article.rowView > header.rowView-head > h1.heading"
			).textContent,
			image = document.querySelector<HTMLImageElement>(
				"body > main.animated > div.wrapper > article.rowView > aside.aside > div.cover-holder > img.abs"
			).src;

		if (image) presenceData.smallImageKey = "logo";

		presenceData.details = "Viewing movie";
		presenceData.state = name;
		presenceData.largeImageKey = image ?? "logo";
	} else if (pathname.startsWith("/manga")) {
		if (paths[1] === "search" && paths[2]) {
			const query: string = paths[2].replaceAll("-", " ");
			let str = "Searching for";
			if (query.length <= 10) str = str += ` ${query}`;
			else presenceData.state = query;

			presenceData.details = str;
		} else if (paths[1] && paths[2]?.startsWith("vol-")) {
			const tom: string | number = paths[2].replace("vol-", "");

			if (paths[3]?.startsWith("chapter-")) {
				const list = document.querySelectorAll<HTMLSpanElement>(
						"body > main.animated > ul#path > li > a > span"
					),
					page = document.querySelector<HTMLParagraphElement>(
						"body > main.animated > div.wrapper > div.heading > b#num"
					).textContent;

				presenceData.details = `Reading manga ${list[1].textContent}`;
				presenceData.state = `Volume: ${tom}, Chapter: ${between(
					list[3].textContent,
					"Глава ",
					" -"
				)}, Page: ${page}`;
				presenceData.buttons = [
					{
						label: "Read manga",
						url: href,
					},
				];
			} else {
				const name = document.querySelector<HTMLAnchorElement>(
					"body > main.animated > div.wrapper > article.rowView > header.rowView-head > h2 > a.sub"
				).textContent;

				if (name) presenceData.details = `Reading manga ${name}`;

				presenceData.state = `Volume ${tom}`;
				presenceData.buttons = [
					{
						label: "Read manga",
						url: href,
					},
				];
			}
		} else if (hasNumber(paths[1])) {
			const name = document.querySelector<HTMLHeadingElement>(
					"body > main.animated > div.wrapper > article.rowView > header.rowView-head > h1.heading"
				).textContent,
				image = document.querySelector<HTMLImageElement>(
					"body > main.animated > div.wrapper > article.rowView > aside.aside > div.cover-holder > img.abs"
				).src;

			if (name) presenceData.details = `Viewing manga ${name}`;

			presenceData.largeImageKey = image ?? "logo";

			if (image) presenceData.smallImageKey = "logo";

			presenceData.buttons = [
				{
					label: "View manga",
					url: href,
				},
			];
		} else if (paths[1])
			presenceData.details = `Viewing manga starting with ${paths[1].toUpperCase()}`;
		else if (!paths[1]) presenceData.details = "Viewing manga";
	}

	if (presenceData.details) presence.setActivity(presenceData);
});

interface IFrameData {
	currentTime: number;
	duration: number;
	paused: boolean;
}

presence.on("iFrameData", async (data: IFrameData) => {
	if (!data.currentTime || !data.duration) return;
	const presenceData: PresenceData = {
			largeImageKey: "https://i.imgur.com/EwyBmHJ.png",
		},
		showThumb = await presence.getSetting<boolean>("showthumb"),
		epInfo = getInfo(),
		player = document.querySelector<HTMLDivElement>(
			"body > main.animated > div.wrapper > section.holder > div.player > div.holder > div.vplayer"
		),
		thumb = parseAvatarFromAttr(player.getAttribute("style"), "logo");

	if (!data.paused) {
		[presenceData.startTimestamp, presenceData.endTimestamp] =
			presence.getTimestamps(
				Math.floor(data.currentTime),
				Math.floor(data.duration)
			);
	} else {
		presenceData.smallImageKey = "start";
		presenceData.smallImageText = "Paused";
	}

	presenceData.details = `Watching ${epInfo.name}`;
	presenceData.state = `Episode ${epInfo.episode}`;
	presenceData.buttons = [
		{
			label: "Watch anime",
			url: document.location.href,
		},
	];

	if (epInfo.part)
		presenceData.state = presenceData.state += ` (part ${epInfo.part})`;

	if (thumb !== "logo" && showThumb) {
		presenceData.largeImageKey = thumb;
		presenceData.smallImageKey = data.paused ? "start" : "logo";
	}

	if (presenceData.details) presence.setActivity(presenceData);
});

function getInfo(): {
	name: string;
	episode: number;
	part: number;
} {
	const ep = document.querySelector(
			"body > main.animated > div.wrapper > section.holder > h1.heading > b#num"
		).innerHTML,
		name = document.querySelector(
			"body > main.animated > div.wrapper > section.holder > h2.heading > a"
		).innerHTML;
	let part = between(ep, "(", ")"),
		rep = ep;

	if (ep.includes("(") && ep.includes(")")) {
		rep = ep.replace(` (${part})`, "");
		part = part.replace(/\D/g, "");
	} else part = null;

	return {
		name,
		episode: parseInt(rep, 10),
		part: parseInt(part, 10),
	};
}

function parseAvatarFromAttr(attr: string, def?: string): string {
	let avatar;
	if (attr.includes("background-image: url('"))
		avatar = between(attr, "background-image: url('", "')");
	else if (attr.includes("background-image: url("))
		avatar = between(attr, "background-image: url(", ")");

	if (
		avatar === "https://static.animes-portal.info/assets/images/avatar.svg" ||
		!avatar
	)
		avatar = def || "defaultav";

	return avatar;
}

function hasNumber(str: string): boolean {
	return /\d/.test(str);
}

function between(st: string, b1: string, b2: string): string {
	return st.split(b1).pop().split(b2)[0];
}
