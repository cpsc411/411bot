import {usage, eval_lc} from "../../src/commands/eval";

describe("eval", () => {
	describe("eval", () => {
		describe("irreducible", () => {
			it("irreducible1", () => expect(eval_lc(["(hi", "there)"])).toEqual("(hi there)"));
			it("irreducible2", () => expect(eval_lc(["(hi)"])).toEqual("hi"));
			it("irreducible4", () => expect(eval_lc(["( ", "hi", "hello)"])).toEqual("(hi hello)"));
			it("irreducible5", () => expect(eval_lc(["( hi )"])).toEqual("hi"));
			it("irreducible6", () => expect(eval_lc(["(x y z)"])).toEqual("((x y) z)"));
			it("irreducible7", () => expect(eval_lc(["(lambda x x)"])).toEqual("(lambda x x)"));
			it("irreducible8", () => expect(eval_lc(["(f (lambda x x))"])).toEqual("(f (lambda x x))"));
			it("irreducible9", () => expect(eval_lc(["(f (x))"])).toEqual("(f x)"));
			it("irreducible10", () => expect(eval_lc(["f (x)"])).toEqual("(f x)"));
			it("irreducible11", () => expect(eval_lc(["!echo hello world"])).toEqual("((!echo hello) world)"));
		});
		// describe("at least 2 args", () => {
		// 	it("negative number", () => expect(repeat(["-1", "bad"])).toEqual(usage));
		// 	it("no rest message", () =>
		// 		expect(repeat(["5", "repeatee"])).toEqual("repeatee repeatee repeatee repeatee repeatee"));
		// 	it("rest message", () =>
		// 		expect(repeat(["5", "!echo", "anyone", "else", "hear", "an", "echo?"])).toEqual(
		// 			"!echo !echo !echo !echo !echo anyone else hear an echo?"
		// 		));
		// });
	});
});
