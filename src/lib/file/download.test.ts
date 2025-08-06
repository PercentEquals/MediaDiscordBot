import { describe, expect, mock, test } from "bun:test";
import { downloadFileStream } from "./download";

const mockFetch = mock();
global.fetch = mockFetch as any as typeof global.fetch;
mock.module("node-fetch", () => mockFetch);

describe("DownloadFileStream", () => {
    test("throws with invalid data", () => {
        expect(downloadFileStream("")).rejects.toThrowError();
        expect(downloadFileStream("lala")).rejects.toThrowError();
    });

    test("succeedes with valid data", () => {
        mockFetch.mockReturnValueOnce(Promise.resolve(new Response("hello world")));
        expect(downloadFileStream("http://abc.cbd")).resolves;
        expect(mockFetch).toHaveBeenCalledTimes(1);
    })
});

