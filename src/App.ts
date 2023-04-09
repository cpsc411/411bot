import {ConfigKey, getConfig} from "./util/Config"; // Unfortunately must be the first import
import {startDiscord} from "@ubccpsc310/bot-base";

startDiscord({
	commandDirectory: `${__dirname}/commands`,
	listenerDirectory: `${__dirname}/listeners`,
	intents: ["Guilds", "GuildMessages", "MessageContent"],
	token: getConfig(ConfigKey.botToken),
});
