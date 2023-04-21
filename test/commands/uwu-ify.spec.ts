import {uwuify} from "../../src/commands/uwu-ify";

describe("uwu-ify", () => {
	describe("uwuify", () => {
		it("should return the default program if no arguments are given to compile", () =>
			expect(uwuify([])).toEqual('(let ([uwu "uwu"])\n  (format "~a" uwu))'));

		it("should compile arguments to a more human readable format", () =>
			expect(
				uwuify(["have", "no", "truck", "with", "the", "grubby", "promises", "of", "imperative", "programming"])
			).toEqual(
				'(let ([uwu0 "have"])\n' +
					'  (let ([uwu1 "no"])\n' +
					'    (let ([uwu2 "truck"])\n' +
					'      (let ([uwu3 "with"])\n' +
					'        (let ([uwu4 "the"])\n' +
					'          (let ([uwu5 "grubby"])\n' +
					'            (let ([uwu6 "promises"])\n' +
					'              (let ([uwu7 "of"])\n' +
					'                (let ([uwu8 "imperative"])\n' +
					'                  (let ([uwu9 "programming"])\n' +
					'                    (format "~a ~a ~a ~a ~a ~a ~a ~a ~a ~a" uwu0 uwu1 uwu2 uwu3 uwu4 uwu5 uwu6 uwu7 uwu8 uwu9)))))))))))'
			));
	});
});
