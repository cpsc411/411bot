import {eval_lc} from "../../src/commands/eval";
import {getPrefix} from "@ubccpsc310/bot-base";
import MockedFn = jest.MockedFn;

jest.mock("@ubccpsc310/bot-base");

describe("eval", () => {
	describe("eval", () => {
		const prefix: string = "!";
		beforeAll(async () => (getPrefix as MockedFn<typeof getPrefix>).mockImplementation(() => Promise.resolve("!")));
		describe("irreducible", () => {
			it("irreducible1", () => expect(eval_lc(["(hi", "there)"])).resolves.toEqual("hi there"));
			it("irreducible2", () => expect(eval_lc(["(hi)"])).resolves.toEqual("hi"));
			it("irreducible4", () => expect(eval_lc(["( ", "hi", "hello)"])).resolves.toEqual("hi hello"));
			it("irreducible5", () => expect(eval_lc(["( hi )"])).resolves.toEqual("hi"));
			it("irreducible6", () => expect(eval_lc(["(x y z)"])).resolves.toEqual("x y z"));
			it("irreducible7", () => expect(eval_lc(["(lambda x x)"])).resolves.toEqual("(lambda x x)"));
			it("irreducible8", () => expect(eval_lc(["(f (lambda x x))"])).resolves.toEqual("f (lambda x x)"));
			it("irreducible9", () => expect(eval_lc(["(f (x))"])).resolves.toEqual("f x"));
			it("irreducible10", () => expect(eval_lc(["f (x)"])).resolves.toEqual("f x"));
			it("irreducible11", () => expect(eval_lc(["!echo hello world"])).resolves.toEqual("!echo hello world"));
			it("irreducible12", () =>
				expect(eval_lc(["hello (lambda x x) there"])).resolves.toEqual("hello (lambda x x) there"));
			it("irreducible13", () => expect(eval_lc(["(lambda x (z))"])).resolves.toEqual("(lambda x z)"));
			it("irreducible13", () => expect(eval_lc(["sup ((my)) dude"])).resolves.toEqual("sup my dude"));
		});
		describe("has_redex", () => {
			it("reducible_0", () => expect(eval_lc(["(lambda x x) hello"])).resolves.toEqual(`${prefix}eval hello`));
			it("reducible_1", () =>
				expect(eval_lc(["(lambda x x) hello there"])).resolves.toEqual(`${prefix}eval hello there`));
			it("reducible_2", () =>
				expect(eval_lc(["(lambda x (lambda y y) z)"])).resolves.toEqual(`${prefix}eval (lambda x z)`));
			it("reducible_2", () =>
				expect(eval_lc(["sup ((lambda y y) my) dude"])).resolves.toEqual(`${prefix}eval sup my dude`));
			it("reducible_Y1", () =>
				expect(eval_lc(["(lambda f (lambda x f (x x)) (lambda x f (x x))) foo"])).resolves.toEqual(
					`${prefix}eval (lambda x (foo (x x))) (lambda x (foo (x x)))`
				));
			it("reducible_Y2", () =>
				expect(eval_lc(["(((lambda x (foo (x x))) (lambda x (foo (x x)))))"])).resolves.toEqual(
					`${prefix}eval foo ((lambda x (foo (x x))) (lambda x (foo (x x))))`
				));
			it("reducible_Y3", () =>
				expect(eval_lc(["foo ((lambda x (foo (x x))) (lambda x (foo (x x))))"])).resolves.toEqual(
					`${prefix}eval foo foo ((lambda x (foo (x x))) (lambda x (foo (x x))))`
				));
			it("reducible_Y4", () =>
				expect(eval_lc(["foo foo ((lambda x (foo (x x))) (lambda x (foo (x x))))"])).resolves.toEqual(
					`${prefix}eval foo foo foo ((lambda x (foo (x x))) (lambda x (foo (x x))))`
				));
			it("should reflect a changing prefix", async () => {
				(getPrefix as MockedFn<typeof getPrefix>).mockImplementation(() => Promise.resolve("%"));
				return expect(eval_lc(["foo foo ((lambda x (foo (x x))) (lambda x (foo (x x))))"])).resolves.toEqual(
					`%eval foo foo foo ((lambda x (foo (x x))) (lambda x (foo (x x))))`
				);
			});
		});
	});
});
