import GlossaryEntry from "../glossaryEntry";

describe("GlossaryEntry", () => {
    describe("getID", () => {
        it("must return a normalized ID", () => {
            var entry = new GlossaryEntry({
                name: "Hello World"
            });

            expect(entry.getID()).toBe("hello-world");
        });
    });
});
