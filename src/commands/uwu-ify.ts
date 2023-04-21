import {Command} from "@ubccpsc310/bot-base";
import {Client, Message} from "discord.js";

const uwuify = (args: string[]): string => {
	if (!args.length) {
		return `(let ([uwu "uwu"])\n` + `  (format "~a" uwu))`;
	}

	const binding_map = args.reduce((acc, curr) => {
		return {...acc, [curr]: `uwu${Object.keys(acc).length}`};
	}, {});

	const binding_info = Object.keys(binding_map).reduce(
		(acc, curr) => {
			return {
				str:
					acc.str +
					`${acc.newline ? `\n` : ``}` +
					`  `.repeat(acc.line_number) +
					`(let ([${binding_map[curr]} "${curr}"])`,
				newline: true,
				line_number: ++acc.line_number,
			};
		},
		{str: ``, newline: false, line_number: 0} satisfies {str: string; newline: boolean; line_number: number}
	);

	return (
		binding_info.str +
		`\n` +
		`  `.repeat(binding_info.line_number) +
		`(format "${"~a ".repeat(binding_info.line_number).trim()}" ` +
		Object.values(binding_map).join(" ") +
		`)` +
		`)`.repeat(binding_info.line_number)
	);
};

const uwuify_command: Command = {
	name: "uwu-ify",
	description: "let binds all words to uwus and (format)s them back together",
	usage: "uwu-ify <message>?",
	async procedure(client: Client, message: Message, args: string[]): Promise<Message> {
		return message.channel.send(`\`\`\`lisp\n` + uwuify(args) + `\n\`\`\``);
	},
};

export {uwuify};
export default uwuify_command;
