import {repeat, usage} from "../../src/commands/repeat";

describe("repeat", () => {
	describe("repeat", () => {
		describe("incorrect usage", () => {
			it("0 args", () => expect(repeat([])).toEqual(usage));
			it("1 arg", () => expect(repeat(["4"])).toEqual(usage));
		});

		describe("at least 2 args", () => {
			it("negative number", () => expect(repeat([])).toEqual(usage));
			it("no rest message", () =>
				expect(repeat(["5", "repeatee"])).toEqual("repeatee repeatee repeatee repeatee repeatee"));
			it("rest message", () =>
				expect(repeat(["5", "!echo", "anyone", "else", "hear", "an", "echo?"])).toEqual(
					"!echo !echo !echo !echo !echo anyone else hear an echo?"
				));
		});
	});
});
