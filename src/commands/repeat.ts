import {Command} from "@ubccpsc310/bot-base";
import {Client, Message} from "discord.js";

const repeat = (args: string[]): string => {
	if (!(args.length > 1)) {
		return usage;
	}

	const number = parseInt(args[0], 10);
	const repeatee = args[1];
	const rest = args.splice(2).join(` `);

	if (Number.isNaN(number) || number < 0) {
		return usage;
	}

	return `${`${repeatee} `.repeat(number).trim()} ${rest}`.trim();
};

const usage = "usage: !repeat <positive number> <repeated word> <message>";

const repeat_command: Command = {
	name: "repeat",
	description: "repeats second argument for first argument number of times concatenated with the rest of the message",
	usage: "repeat <number> <repeatee> <message>?",
	async procedure(client: Client, message: Message, args: string[]): Promise<Message> {
		return message.channel.send(repeat(args));
	},
};

export {repeat, usage};
export default repeat_command;
