import Summary from "../../../models/summary";
import File from "../../../models/file";

describe("removeArticle", () => {
    var removeArticle = require("../removeArticle").default;
    var summary = Summary.createFromParts(File(), [
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
            articles: [
                {
                    title: "2.1",
                    path: "2.1",
                    articles: [
                        {
                            title: "2.1.1",
                            path: "2.1.1"
                        },
                        {
                            title: "2.1.2",
                            path: "2.1.2"
                        }
                    ]
                },
                {
                    title: "2.2",
                    path: "2.2"
                }
            ]
        }
    ]);

    it("should remove an article at a given level", () => {
        var newSummary = removeArticle(summary, "2.1.1");

        var removed = newSummary.getByLevel("2.1.1");
        var nextOne = newSummary.getByLevel("2.1.2");

        expect(removed.getTitle()).toBe("2.1.2");
        expect(nextOne).toBe(null);
    });
});
