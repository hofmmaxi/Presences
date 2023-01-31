const presence = new Presence({
	clientId: "501842028569559061", // Official Wolfy Discord App Client ID, owned by Wolfy's Admin
});

let path,
	prev: string,
	elapsed: number,
	prevState: string,
	cp: number,
	currTime: string;

const waitingString = {
	en: "WAITING",
	fr: "EN ATTENTE",
};

function getTime(list: string[]): number {
	let ret = 0;
	for (let index = list.length - 1; index >= 0; index--)
		ret += (parseInt(list[index]) * 60) ** index;

	return ret;
}

function getTimestamps(audioTime: number, audioDuration: string): number[] {
	return [
		Date.now(),
		audioTime + getTime(audioDuration.split(":").reverse()) * 1000,
	];
}

function addButton(presenceData: PresenceData, label: string, url: string) {
	if (!presenceData.buttons) {
		presenceData.buttons = [
			{
				label,
				url,
			},
		];
	} else {
		presenceData.buttons[1] = {
			label,
			url,
		};
	}
}

function addConsultArticleButton(presenceData: PresenceData, url: string) {
	addButton(presenceData, "Consulter l'article", url);
}

function addConsultCategoryButton(presenceData: PresenceData, url: string) {
	addButton(presenceData, "Consulter la catégorie", url);
}

function addConsultEventButton(presenceData: PresenceData, href: string) {
	addButton(presenceData, "Consulter l'évènement", href);
}

async function addJoinGameButton(presenceData: PresenceData, gameId: string) {
	if (!(await presence.getSetting("joinGameButton"))) return;
	addButton(
		presenceData,
		`(${
			document.querySelector("div.Header_timeState__L9yx4")?.textContent
		}) Rejoindre la partie`,
		`https://wolfy.net/game/${gameId}`
	);
}

function addVisitHelpCenterButton(presenceData: PresenceData) {
	addButton(
		presenceData,
		"Consulter le centre d'aide",
		"https://help.wolfy.net"
	);
}

async function addVisitProfilButton(
	presenceData: PresenceData,
	username: string
) {
	if (!username) return;
	if (!(await presence.getSetting("visitProfileButton"))) return;

	let label = `Visiter le profil de ${username}`;
	if (label.length > 32) label = `${label.slice(0, 31)}…`;

	addButton(presenceData, label, `https://wolfy.net/leaderboard/${username}`);
}

function addVisitWolfyButton(presenceData: PresenceData) {
	addButton(presenceData, "Visiter le site de Wolfy", "https://wolfy.net");
}

async function handleCheckingLeaderboard(
	presenceData: PresenceData,
	username?: string
) {
	presenceData.smallImageKey = "leaderboard";
	presenceData.smallImageText = "Consulte le classement";

	if (!username) {
		const classementType =
			document.querySelector("div.Leaderboard_moonLeaderboard__7q9CE") !== null
				? "Lunaire"
				: document.querySelector("div.Leaderboard_lifeLeaderboard__itvcT") !==
				  null
				? "Éternel"
				: null;

		presenceData.details = `Regarde le classement ${classementType}`;
		presenceData.state = `Top ${parseInt(
			document.querySelector(
				"div.Leaderboard_playerLine__Qo9eG > div.Leaderboard_rank__n6Cz_"
			)?.textContent
		).toLocaleString()} ${classementType} (${parseInt(
			document.querySelector("div.Leaderboard_lifetimeXp__UpQAh > p")
				?.textContent
		).toLocaleString()} ${classementType === "Lunaire" ? "lauriers" : "xp"})`;
	} else {
		presenceData.details = `Regarde le profil de ${username}`;
		presenceData.state = `[${
			document.querySelector("div.ExperienceGroup_first__cLc5y > p")
				?.textContent
		}] ${parseInt(
			document
				.querySelector("div.ExperienceGroup_experienceBarFull__xUSsB > span")
				?.textContent.split(" / ")[0]
		).toLocaleString()} xp & ${parseInt(
			document.querySelector("p.PlayerCard_number__BC5Cv").textContent
		).toLocaleString()} lauriers`;
		await addVisitProfilButton(presenceData, username);
	}
}

function isWaitingGame(state: string, lang: string) {
	return state === waitingString[resolveLanguage(lang)];
}

function resolveLanguage(lang: string): keyof typeof waitingString {
	if (Object.keys(waitingString).includes(lang))
		return lang as keyof typeof waitingString;
	return "en";
}

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
		largeImageKey: "https://i.imgur.com/TFduNvD.png",
	};

	path = document.location.pathname.split("/");

	if (path[1] === document.querySelector("html")?.lang) path = path.slice(2);
	else path = path.slice(1);

	if (window.location.href !== prev && !path.includes("game")) {
		delete presenceData.startTimestamp;
		delete presenceData.endTimestamp;
		prev = window.location.href;
		elapsed = Math.floor(Date.now() / 1000);
	}

	presenceData.startTimestamp = elapsed;

	if (document.location.hostname.includes("help.wolfy")) {
		if (path.includes("article") && path[2]) {
			presenceData.details = "Lit l'article ⤵️";
			presenceData.state = document.querySelector(
				"h1.csh-navigation-title-item-inner"
			)?.textContent;
			addConsultArticleButton(presenceData, document.location.href);
			addVisitHelpCenterButton(presenceData);
		} else if (path.includes("category") && path[2]) {
			presenceData.details = "Consulte la catégorie ⤵️";
			presenceData.state = document.querySelector(
				"span.csh-category-badge"
			)?.textContent;
			addConsultCategoryButton(presenceData, document.location.href);
		} else {
			presenceData.details = "Consulte le centre d'aide";
			presenceData.state = "Page d'accueil";
			addVisitHelpCenterButton(presenceData);
		}
	} else if (path.includes("articles") && path[1]) {
		presenceData.details = "Lis l'article ⤵️";
		presenceData.smallImageKey = "reading";
		presenceData.smallImageText = "Lis un article";
		presenceData.state = document.querySelector("body h1").textContent;
	} else if (path.includes("game") && path[1]) {
		presenceData.state = document
			.querySelector("div.Header_nameState__arW6y")
			.textContent.toUpperCase();

		if (presenceData.state !== prevState) {
			delete presenceData.startTimestamp;
			delete presenceData.endTimestamp;
			prevState = presenceData.state;
			cp = Date.now();
			currTime = document.querySelector("div.Header_timer__xtmy2").textContent;
		}

		await addVisitProfilButton(
			presenceData,
			document.querySelector("span.ChatMain_username__0G_cN")?.textContent // Will be the anonymous username if used
		);

		if (
			isWaitingGame(presenceData.state, document.querySelector("html")?.lang)
		) {
			presenceData.state += ` (${
				document.querySelector("div.Header_timeState__L9yx4")?.textContent
			})`;
			await addJoinGameButton(presenceData, path[1]);
		}

		presenceData.details = "En jeu";

		presenceData.smallImageKey = "live";
		if (currTime?.includes(":")) {
			[presenceData.startTimestamp, presenceData.endTimestamp] = getTimestamps(
				cp,
				currTime
			);
		} else presenceData.startTimestamp = cp;
	} else if (path.includes("leaderboard")) {
		await addVisitProfilButton(
			presenceData,
			document.querySelector("p.Social_username__qpX4D")?.textContent
		);

		await handleCheckingLeaderboard(presenceData, path[1]);
	} else if (path.includes("event") && path[1]) {
		if (document.querySelector("div.Event_eventIntroduction__tumD2")) {
			presenceData.details = "Participe à un évènement";
			presenceData.state = `Top ${parseInt(
				document.querySelector(
					"div.Event_lineLeaderboard__FMbXh.Event_me__5c0fl > div.Event_rank__lrB8C"
				).textContent
			).toLocaleString()} - ${parseInt(
				document.querySelector(
					"div.Event_lineLeaderboard__FMbXh.Event_me__5c0fl > div.Event_points__6cXnJ"
				).textContent
			).toLocaleString()} points`;
		} else {
			presenceData.details = "Consulte un évènement à venir ⤵️";
			presenceData.state = document.querySelector(
				"div.Event_title__YeebM"
			)?.textContent;
		}
		addConsultEventButton(presenceData, document.location.href);
	} else {
		await addVisitProfilButton(
			presenceData,
			document.querySelector("p.Social_username__qpX4D")?.textContent
		);

		presenceData.details = "Dans un menu";

		switch (path[0]) {
			case "skin":
				presenceData.smallImageKey = "skin";
				presenceData.smallImageText = "Choisis ton skin";
				presenceData.state = "Consulte ses Skins";
				break;
			case "settings":
				presenceData.state = "Change ses paramètres";
				break;
			case "shop":
				presenceData.smallImageKey = "shop";
				presenceData.smallImageText = "Achète des skins";
				presenceData.state = "Consulte la Boutique";
				break;
			case "articles":
				presenceData.state = "Consulte les dernières actualités";
				presenceData.smallImageKey = "reading";
				presenceData.smallImageText = "En train de lire";
				break;
			default:
				presenceData.state = "Page d'accueil";
		}
	}

	if (!presenceData.buttons || !presenceData.buttons[1])
		addVisitWolfyButton(presenceData);

	presence.setActivity(presenceData);
});
