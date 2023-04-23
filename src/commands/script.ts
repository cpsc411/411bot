import {marked} from "marked";
import {Element, load} from "cheerio";
import {transpile} from "typescript";
import {Command} from "@ubccpsc310/bot-base";
import {Client, Message} from "discord.js";

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
				} catch {}
			}
		});
	} catch {}
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
	(script: string): unknown => {
		try {
			const result = eval(script);
			if (result instanceof Promise) {
				return result.catch(() => undefined);
			} else {
				return result;
			}
		} catch {
			return undefined;
		}
	};

const script: Command = {
	name: "script",
	description: "",
	usage: "script (<message>|<script>)*",
	procedure(client, message, args): void {
		const scripts = getScripts(message.content);
		if (scripts.length === 0) {
			message.channel.send("No script found");
		} else {
			const results = scripts.map(caughtEval(client, message, args));
			message.channel.send(results.map((value) => JSON.stringify(value)).join("\n"));
		}
	},
};

export default script;
