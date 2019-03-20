import path from "path";
import TemplateEngine from "../../models/templateEngine";
import renderTemplate from "../render";
import ConrefsLoader from "../conrefsLoader";

describe("ConrefsLoader", () => {
    var dirName = __dirname + "/";
    var fileName = path.join(dirName, "test.md");

    describe("Git", () => {
        var engine = TemplateEngine({
            loader: new ConrefsLoader(dirName)
        });

        it("should include content from git", () => {
            return renderTemplate(
                engine,
                fileName,
                '{% include "git+https://gist.github.com/69ea4542e4c8967d2fa7.git/test.md" %}'
            ).then(out => {
                expect(out.getContent()).toBe("Hello from git");
            });
        });

        it("should handle deep inclusion (1)", () => {
            return renderTemplate(
                engine,
                fileName,
                '{% include "git+https://gist.github.com/69ea4542e4c8967d2fa7.git/test2.md" %}'
            ).then(out => {
                expect(out.getContent()).toBe("First Hello. Hello from git");
            });
        });

        it("should handle deep inclusion (2)", () => {
            return renderTemplate(
                engine,
                fileName,
                '{% include "git+https://gist.github.com/69ea4542e4c8967d2fa7.git/test3.md" %}'
            ).then(out => {
                expect(out.getContent()).toBe("First Hello. Hello from git");
            });
        });
    });

    describe("Local", () => {
        var engine = TemplateEngine({
            loader: new ConrefsLoader(dirName)
        });

        /*describe("Relative", function() {
            // FIXME
            it("should resolve basic relative filepath", function() {
                return renderTemplate(
                    engine,
                    fileName,
                    '{% include "include.md" %}'
                ).then(function(out) {
                    expect(out.getContent()).toBe("Hello World");
                });
            });

            it("should resolve basic parent filepath", function() {
                return renderTemplate(
                    engine,
                    path.join(dirName, "hello/test.md"),
                    '{% include "../include.md" %}'
                ).then(function(out) {
                    expect(out.getContent()).toBe("Hello World");
                });
            });
        });

        describe("Absolute", function() {
            it("should resolve absolute filepath", function() {
                return renderTemplate(
                    engine,
                    fileName,
                    '{% include "/include.md" %}'
                ).then(function(out) {
                    expect(out.getContent()).toBe("Hello World");
                });
            });

            it("should resolve absolute filepath when in a directory", function() {
                return renderTemplate(
                    engine,
                    path.join(dirName, "hello/test.md"),
                    '{% include "/include.md" %}'
                ).then(function(out) {
                    expect(out.getContent()).toBe("Hello World");
                });
            });
        });*/
    });
    /*
    describe("transform", function() {
        function transform(filePath, source) {
            expect(filePath).toBeA("string");
            expect(source).toBeA("string");

            expect(filePath).toBe(path.resolve(__dirname, "include.md"));
            expect(source).toBe("Hello World");

            return "test-" + source + "-endtest";
        }
        var engine = TemplateEngine({
            loader: new ConrefsLoader(dirName, transform)
        });

        it("should transform included content", function() {
            return renderTemplate(
                engine,
                fileName,
                '{% include "include.md" %}'
            ).then(function(out) {
                expect(out.getContent()).toBe("test-Hello World-endtest");
            });
        });
    });*/
});
