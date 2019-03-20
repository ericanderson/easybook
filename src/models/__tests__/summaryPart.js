import SummaryPart from "../summaryPart";

describe("SummaryPart", () => {
    describe("createChildLevel", () => {
        it("must create the right level", () => {
            var article = SummaryPart.create({}, "1");
            expect(article.createChildLevel()).toBe("1.1");
        });

        it("must create the right level when has articles", () => {
            var article = SummaryPart.create(
                {
                    articles: [
                        {
                            title: "Test"
                        }
                    ]
                },
                "1"
            );
            expect(article.createChildLevel()).toBe("1.2");
        });
    });
});
