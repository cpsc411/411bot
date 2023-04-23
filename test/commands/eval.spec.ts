import {eval_lc} from "../../src/commands/eval";

describe("eval", () => {
	describe("eval", () => {
		describe("irreducible", () => {
			it("irreducible1", () => expect(eval_lc(["(hi", "there)"])).toEqual("hi there"));
			it("irreducible2", () => expect(eval_lc(["(hi)"])).toEqual("hi"));
			it("irreducible4", () => expect(eval_lc(["( ", "hi", "hello)"])).toEqual("hi hello"));
			it("irreducible5", () => expect(eval_lc(["( hi )"])).toEqual("hi"));
			it("irreducible6", () => expect(eval_lc(["(x y z)"])).toEqual("x y z"));
			it("irreducible7", () => expect(eval_lc(["(lambda x x)"])).toEqual("(lambda x x)"));
			it("irreducible8", () => expect(eval_lc(["(f (lambda x x))"])).toEqual("f (lambda x x)"));
			it("irreducible9", () => expect(eval_lc(["(f (x))"])).toEqual("f x"));
			it("irreducible10", () => expect(eval_lc(["f (x)"])).toEqual("f x"));
			it("irreducible11", () => expect(eval_lc(["!echo hello world"])).toEqual("!echo hello world"));
			it("irreducible12", () =>
				expect(eval_lc(["hello (lambda x x) there"])).toEqual("hello (lambda x x) there"));
			it("irreducible13", () => expect(eval_lc(["(lambda x (z))"])).toEqual("(lambda x z)"));
			it("irreducible13", () => expect(eval_lc(["sup ((my)) dude"])).toEqual("sup my dude"));
		});
		describe("has_redex", () => {
			it("reducible_0", () => expect(eval_lc(["(lambda x x) hello"])).toEqual("!eval hello"));
			it("reducible_1", () => expect(eval_lc(["(lambda x x) hello there"])).toEqual("!eval hello there"));
			it("reducible_2", () => expect(eval_lc(["(lambda x (lambda y y) z)"])).toEqual("!eval (lambda x z)"));
			it("reducible_2", () => expect(eval_lc(["sup ((lambda y y) my) dude"])).toEqual("!eval sup my dude"));
			it("reducible_Y1", () =>
				expect(eval_lc(["(lambda f (lambda x f (x x)) (lambda x f (x x))) foo"])).toEqual(
					"!eval (lambda x (foo (x x))) (lambda x (foo (x x)))"
				));
			it("reducible_Y2", () =>
				expect(eval_lc(["(((lambda x (foo (x x))) (lambda x (foo (x x)))))"])).toEqual(
					"!eval foo ((lambda x (foo (x x))) (lambda x (foo (x x))))"
				));
			it("reducible_Y3", () =>
				expect(eval_lc(["foo ((lambda x (foo (x x))) (lambda x (foo (x x))))"])).toEqual(
					"!eval foo foo ((lambda x (foo (x x))) (lambda x (foo (x x))))"
				));
			it("reducible_Y4", () =>
				expect(eval_lc(["foo foo ((lambda x (foo (x x))) (lambda x (foo (x x))))"])).toEqual(
					"!eval foo foo foo ((lambda x (foo (x x))) (lambda x (foo (x x))))"
				));
		});
	});
});
