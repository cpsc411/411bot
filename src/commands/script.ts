import {marked} from "marked";
import {Element, load} from "cheerio";
import {transpile} from "typescript";
import {Command} from "@ubccpsc310/bot-base";
import {Client, Message} from "discord.js";
import {VM} from "vm2";

const LANGUAGE_PREFIX = "language-";
const VALID_LANGUAGES = ["js", "ts", "javascript", "typescript"];

const compileScript = (script: string): string | false => {
	try {
		return transpile(script);
	} catch {
		return false;
	}
};

const getLanguage = (element: Element): string =>
	(element.attribs.class?.startsWith(LANGUAGE_PREFIX) && element.attribs.class.replace(LANGUAGE_PREFIX, "")) || "";

const forEachCodeBlock = (message: string, callback: (codeBlock: string) => unknown) => {
	try {
		const html = marked.parse(message);
		const $ = load(html);
		$("pre > code").each((_, element) => {
			const language = getLanguage(element);
			if (VALID_LANGUAGES.includes(language.toLowerCase())) {
				try {
					callback($(element).text());
				} catch {
					// Suppress
				}
			}
		});
	} catch {
		// Suppress
	}
};

const collectScripts = (message: string): string[] => {
	const scripts: string[] = [];
	forEachCodeBlock(message, (codeBlock) => scripts.push(codeBlock));
	return scripts;
};

const getScripts = (message: string): string[] =>
	collectScripts(message)
		.map(compileScript)
		.filter((script): script is string => !!script);

const caughtEval =
	(client: Client, message: Message, args: string[]) =>
	async (script: string): Promise<unknown> => {
		try {
			return await new VM({
				timeout: 50,
				sandbox: {client, message, args},
			}).run(script);
		} catch {
			return undefined;
		}
	};

const script: Command = {
	name: "script",
	description: "Executes js or ts codeblocks in a vm and pipes it back to discord",
	usage: "script (<message>|<script>)*",
	async procedure(client, message, args) {
		const scripts = getScripts(message.content);
		if (scripts.length === 0) {
			message.channel.send("No script found");
		} else {
			const futureResults = scripts.map(caughtEval(client, message, args));
			const results = await Promise.all(futureResults);
			message.channel.send("```\n" + results.map((value) => JSON.stringify(value)).join("\n") + "\n```");
		}
	},
};

export default script;
