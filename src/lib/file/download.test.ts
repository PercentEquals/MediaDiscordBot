import { describe, expect, mock, test } from "bun:test";
import { downloadBlob } from "./download";

const mockFetch = mock();
global.fetch = mockFetch as any as typeof global.fetch;
mock.module("node-fetch", () => mockFetch);

describe("DownloadBlob", () => {
    test("throws with invalid data", () => {
        expect(downloadBlob("")).rejects.toThrowError();
        expect(downloadBlob("lala")).rejects.toThrowError();
    });

    test("succeedes with valid data", () => {
        mockFetch.mockReturnValueOnce(Promise.resolve(new Response("hello world")));
        expect(downloadBlob("http://abc.cbd")).resolves;
        expect(mockFetch).toHaveBeenCalledTimes(1);
    })
});

