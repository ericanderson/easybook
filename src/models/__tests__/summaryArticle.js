import SummaryArticle from "../summaryArticle";
import File from "../file";

describe("SummaryArticle", () => {
    describe("createChildLevel", () => {
        it("must create the right level", () => {
            var article = SummaryArticle.create({}, "1.1");
            expect(article.createChildLevel()).toBe("1.1.1");
        });

        it("must create the right level when has articles", () => {
            var article = SummaryArticle.create(
                {
                    articles: [
                        {
                            title: "Test"
                        }
                    ]
                },
                "1.1"
            );
            expect(article.createChildLevel()).toBe("1.1.2");
        });
    });

    describe("isFile", () => {
        it("must return true when exactly the file", () => {
            var article = SummaryArticle.create(
                {
                    ref: "hello.md"
                },
                "1.1"
            );
            var file = File.createWithFilepath("hello.md");

            expect(article.isFile(file)).toBe(true);
        });

        it("must return true when path is not normalized", () => {
            var article = SummaryArticle.create(
                {
                    ref: "/hello.md"
                },
                "1.1"
            );
            var file = File.createWithFilepath("hello.md");

            expect(article.isFile(file)).toBe(true);
        });

        it("must return false when has anchor", () => {
            var article = SummaryArticle.create(
                {
                    ref: "hello.md#world"
                },
                "1.1"
            );
            var file = File.createWithFilepath("hello.md");

            expect(article.isFile(file)).toBe(false);
        });
    });
});
