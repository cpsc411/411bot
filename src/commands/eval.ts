import {Command} from "@ubccpsc310/bot-base";
import {Client, Message} from "discord.js";

// modified from repeat

var parse = require("s-expression");

const bound_vars = (args: any): any => {
	if (typeof args === "string") {
		return [];
	} else if (args[0] === "lambda") {
		return bound_vars(args[2]).concat([args[1]]);
	} else {
		return bound_vars(args[2]).concat(bound_vars([args[1]]));
	}
};

// freshen all disallowed free variables in an expression
const freshen_against = (expr: any, disallowed: any, subst: any): any => {
	if (typeof expr === "string") {
		return subst(expr);
	} else if (expr[0] === "lambda") {
		if (disallowed.includes(expr[1])) {
			return "unimplemented"; //-----------------
		} else {
			return "unimplemented"; //-----------------
		}
	} else {
		return bound_vars(expr[2]).concat(bound_vars([expr[1]]));
	}
};

const reduce_step = (args: any): any => {
	// if at a redex, reduce it.
	// if (Array.isArray(args)
	//       && Array.length )
	//   {
	//       return args;
	//   }
	return args;
};

// rewrite (or check) input data is in the right format
// NO syntax checking is for the birds
// const to_ast = (args: any): any => {
//     if (typeof(args) === 'string' && (args !== "lambda")) {
//         return args;
//     } else if (Array.isArray(args) && (args.length == 1)) {
//         // one argument
//         // remove extra brackets around statements
//         return to_ast(args[0]);
//     } else if (Array.isArray(args) && (args.length == 2)) {
//         // two arguments
//         return [to_ast(args[0]), to_ast(args[1])];
//     } else if (Array.isArray(args) && (args.length >= 3) && (args[0] === "lambda") && (typeof(args[1]) === 'string') && (args[1] !== "lambda")) {
//         // 3 arguments, lambda expression
//         return ["lambda", args[1], to_ast(args.slice(2))];
//     }  else if (Array.isArray(args) && (args.length >= 3)) {
//         // >= 3 arguments, rewrite to be explicitly left-associative
//         return [to_ast(args.slice(0, args.length - 1)), to_ast(args[args.length - 1]),];
//     } else {
//         throw "bad syntax";
//     }
// }

const unparse = (args: any): string => {
	if (typeof args === "string") {
		return args;
	} else if (Array.isArray(args)) {
		return `(${args.map(unparse).join(" ")})`;
	} else {
		return "oh noes i dwopped my awway! pwease fowgive me ~~";
	}
};

const eval_lc = (args: string[]): string => {
	try {
		// documentation:
		// its basically just a galois connection
		//  * - reduce (lambda calculus) -> *
		//  |                               ^
		//  parse . to_ast                  |
		//  |                            unparse
		//  v                               |
		//  * -------- reduce_step -------> *
		//  and the rest of the implementation follows from that
		return unparse(reduce_step(to_ast(parse(`(${args.join(" ")})`))));
		// If there's no change, return a pretty printed result
		// If there's still work to do, return a command that will evaluate the next step
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
	usage: "!eval <L> where L ::= lambda <string> L | <string> | L L where strings have no spaces or brackets",
	async procedure(client: Client, message: Message, args: string[]): Promise<Message> {
		return message.channel.send(eval_lc(args));
	},
};

export {eval_lc, usage};
export default eval_command;
