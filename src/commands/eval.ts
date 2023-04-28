import {Command, getPrefix} from "@ubccpsc310/bot-base";
import {Client, Message} from "discord.js";

// modified from repeat

// 411-values-lang-v420
// bug bounty program:
// if you see a bug throw your entire computer in the dumpster

import parse = require("s-expression");

// fixme: do capture avoiding substitution dumbass

const do_subst = (args: any, x: string, a1: any): any => {
	if (typeof args === "string") {
		if (args == x) {
			return a1;
		} else {
			return args;
		}
	} else if (args[0] == "lambda") {
		if (args[1] == x) {
			return args;
		} else {
			return ["lambda", args[1], do_subst(args[2], x, a1)];
		}
	} else if (Array.isArray(args)) {
		return args.map((ei) => do_subst(ei, x, a1));
	} else {
		throw "shid";
	}
};

const reduce_step = (args: any): [boolean, any] => {
	// if at a redex, reduce it.
	if (Array.isArray(args) && args[0] !== "lambda" && Array.isArray(args[0]) && args[0][0] === "lambda") {
		return [true, [do_subst(args[0].slice(2), args[0][1], args[1])].concat(args.slice(2))];
	}

	// Otherwise look for a redex.
	if (typeof args === "string") {
		return [false, args];
	} else if (args[0] == "lambda") {
		for (let i = 2; i < args.length; i++) {
			const res = reduce_step(args[i]);
			if (res[0]) {
				return [
					true,
					args
						.slice(0, i)
						.concat([res[1]])
						.concat(args.slice(i + 1)),
				];
			}
		}
		return [false, args];
	} else if (Array.isArray(args)) {
		// applications are left associative
		// so any redexes are only a subterm of a app term
		for (let i = 0; i < args.length; i++) {
			const res = reduce_step(args[i]);
			if (res[0]) {
				return [
					true,
					args
						.slice(0, i)
						.concat([res[1]])
						.concat(args.slice(i + 1)),
				];
			}
		}
	}
	return [false, args];
};

// rewrite (or check) input data is in the right format
const to_ast = (args: any): any => {
	if (typeof args === "string" && args !== "lambda") {
		return args;
	} else if (Array.isArray(args) && args.length == 1) {
		// one argument
		// remove extra brackets around statements
		return to_ast(args[0]);
	} else if (Array.isArray(args) && args.length == 2) {
		// two arguments
		return [to_ast(args[0]), to_ast(args[1])];
	} else if (
		Array.isArray(args) &&
		args.length >= 3 &&
		args[0] === "lambda" &&
		typeof args[1] === "string" &&
		args[1] !== "lambda"
	) {
		// at least 3 arguments, lambda expression
		return ["lambda", args[1], to_ast(args.slice(2))];
	} else if (Array.isArray(args) && args.length >= 3) {
		// An implicitly left-associative application
		return args.map(to_ast);
	} else {
		throw "bad syntax";
	}
};

const unparse = (args: any): string => {
	const error_str = "oh noes i dwopped my awway! pwease fowgive me ~~";
	const unparse_body = (args: any): string => {
		if (typeof args === "string") {
			return args;
		} else if (Array.isArray(args) && args.length == 1) {
			return unparse(args[0]);
		} else if (Array.isArray(args)) {
			return `(${args.map(unparse_body).join(" ")})`;
		} else {
			return error_str;
		}
	};

	if (typeof args === "string") {
		return args;
	} else if (args[0] == "lambda") {
		return `(${args.map(unparse_body).join(" ")})`;
	} else if (Array.isArray(args) && args.length == 1) {
		return unparse(args[0]);
	} else if (Array.isArray(args)) {
		return `${args.map(unparse_body).join(" ")}`;
	} else {
		return error_str;
	}
};

const eval_lc = async (args: string[]): Promise<string> => {
	try {
		// documentation:
		// its basically just a galois connection
		//  * - reduce (lambda calculus) -> *
		//  |                               ^
		//  parse                           |
		//  |                            unparse
		//  v                               |
		//  * -------- reduce_step -------> *
		//  and the rest of the implementation follows from that
		const rv = reduce_step(to_ast(parse(`(${args.join(" ")})`)));
		if (rv[0]) {
			// If there's still work to do, return a command that will evaluate the next step
			const prefix = await getPrefix();
			return `${prefix}eval ${unparse(rv[1])}`;
		}
		// If there's no change, return a pretty printed result
		else {
			return unparse(rv[1]);
		}
	} catch (err) {
		// literally just catch whatever other errors happen and give no feedback
		// (autograder moment xd)
		return usage;
	}
};

const usage = "u did a fucky wucky uwu 😳😳😳😳 pwease gib be a wegal wambda cawucwus s-expwession 🥺🥺🥺😭😭 ";

const eval_command: Command = {
	name: "eval",
	description: "evaluates a lambda expression and eagerly prints intermediate steps",
	usage: "eval <L> where L ::= lambda <string> L | <string> | L L where strings have no spaces or brackets",
	async procedure(client: Client, message: Message, args: string[]): Promise<Message> {
		return message.channel.send(await eval_lc(args));
	},
};

export {eval_lc, usage};
export default eval_command;
