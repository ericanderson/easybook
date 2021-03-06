import Immutable from "immutable";
import Summary from "../../../models/summary";
import File from "../../../models/file";

describe("mergeAtLevel", () => {
    const mergeAtLevel = require("../mergeAtLevel").default;
    const summary = Summary.createFromParts(File(), [
        {
            articles: [
                {
                    title: "1.1",
                    path: "1.1"
                },
                {
                    title: "1.2",
                    path: "1.2"
                }
            ]
        },
        {
            title: "Part I",
            articles: []
        }
    ]);

    it("should edit a part", () => {
        const beforeChildren = summary.getByLevel("1").getArticles();
        const newSummary = mergeAtLevel(summary, "1", { title: "Part O" });
        const edited = newSummary.getByLevel("1");

        expect(edited.getTitle()).toBe("Part O");
        // Same children
        expect(Immutable.is(beforeChildren, edited.getArticles())).toBe(true);
    });

    it("should edit a part", () => {
        const beforePath = summary.getByLevel("1.2").getPath();
        const newSummary = mergeAtLevel(summary, "1.2", {
            title: "Renamed article"
        });
        const edited = newSummary.getByLevel("1.2");

        expect(edited.getTitle()).toBe("Renamed article");
        // Same children
        expect(Immutable.is(beforePath, edited.getPath())).toBe(true);
    });
});
