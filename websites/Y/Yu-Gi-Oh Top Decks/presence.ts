const presence = new Presence({
	clientId: "630550023133724692",
});
let deck;

presence.on("UpdateData", async () => {
	const presenceData: PresenceData = {
		largeImageKey: "https://i.imgur.com/RPjfGtz.png",
		smallImageKey: "icon",
	};

	switch (document.location.pathname) {
		case "/": {
			presenceData.details = "Browsing Decks..";
			presenceData.state = "at Homepage";
			presenceData.smallImageText = "browsing";

			break;
		}
		case "/decklists": {
			presenceData.details = "Looking at Decklists";
			presenceData.state = `Page: ${
				document.querySelectorAll(".current")[0].firstElementChild.textContent
			} top: ${
				document.querySelector("#deck_lists").lastElementChild.firstElementChild
					.children[2].textContent
			} by ${
				document.querySelector("#deck_lists").lastElementChild.firstElementChild
					.children[1].ENTITY_NODE
			}`;
			presenceData.smallImageText = (
				document.querySelector("#deck_lists").lastElementChild.firstElementChild
					.children[2].firstElementChild as HTMLLinkElement
			).href;

			break;
		}
		case "/top_decks": {
			presenceData.details = "Looking at Top decks";
			presenceData.state = `Current Meta: ${document
				.querySelectorAll(".sortable")[0]
				.children[1].firstElementChild.children[1].textContent.replace(
					"Most Used Cards",
					""
				)}`;
			presenceData.largeImageKey = "banner";
			presenceData.smallImageKey = "icon";
			presenceData.smallImageText = "looking";

			break;
		}
		case "/top_cards": {
			presenceData.details = "Looking at Top Cards";
			(presenceData.state = `Top Card: ${
				document.querySelectorAll(".sortable")[0].children[1].firstElementChild
					.children[2].textContent
			} Price: ${
				document.querySelectorAll(".sortable")[0].children[1].firstElementChild
					.children[4].textContent
			}`),
				(presenceData.largeImageKey = "banner");
			presenceData.smallImageKey = "icon";
			presenceData.smallImageText = "looking";

			break;
		}
		case "/new_deck": {
			deck = (document.getElementsByName("deck_name")[0] as HTMLInputElement)
				.value;
			presenceData.details = "Building Deck";
			presenceData.state = `Editing: ${deck}`;
			presenceData.largeImageKey = "banner";
			presenceData.smallImageKey = "icon";
			presenceData.smallImageText = "creating deck";

			break;
		}
		default:
			if (
				document.location.pathname.includes("/deck") &&
				/\d/.test("/deck/8205")
			) {
				deck = document.querySelectorAll(".large-12.columns.panel")[0]
					.firstElementChild.textContent;
				presenceData.details = `Viewing deck: ${deck} (archetype: ${
					document.querySelectorAll(".large-12.columns.panel")[0].children[1]
						.children[10].textContent
				})`;
				presenceData.state = `by: ${
					document.querySelectorAll(".large-12.columns.panel")[0].children[1]
						.children[1].textContent
				}, price: ${
					document
						.querySelectorAll(".large-12.columns.panel")[1]
						.children[1].textContent.replace("\n", ":")
						.split(":")[1]
				}`;
				presenceData.largeImageKey = "banner";
				presenceData.smallImageKey = "icon";
				presenceData.smallImageText = document.location.href;
			}
	}
	presence.setActivity(presenceData);
});
