import { describe, expect, test } from "vitest";
import {
  isAllowlistedPartner,
  isPartnerGoogleSignIn,
  normalizeEmail,
} from "./partners";

describe("isAllowlistedPartner", () => {
  test("accepts each of the four partner emails", () => {
    expect(isAllowlistedPartner("risad@aponvlab.io")).toBe(true);
    expect(isAllowlistedPartner("rashedun@aponvlab.io")).toBe(true);
    expect(isAllowlistedPartner("saif@aponvlab.io")).toBe(true);
    expect(isAllowlistedPartner("mufassal@aponvlab.io")).toBe(true);
  });

  test("is case-insensitive and trims whitespace", () => {
    expect(isAllowlistedPartner("  Risad@AponVlab.io  ")).toBe(true);
  });

  test("rejects another address on the same Workspace", () => {
    expect(isAllowlistedPartner("intern@aponvlab.io")).toBe(false);
  });

  test("rejects an empty string", () => {
    expect(isAllowlistedPartner("")).toBe(false);
    expect(isAllowlistedPartner("   ")).toBe(false);
  });
});

describe("isPartnerGoogleSignIn", () => {
  const ok = {
    email: "risad@aponvlab.io",
    emailVerified: true,
    hd: "aponvlab.io",
  };

  test("accepts an allowlisted verified Workspace account", () => {
    expect(isPartnerGoogleSignIn(ok)).toBe(true);
  });

  test("rejects when hd is missing even if the email is allowlisted", () => {
    expect(isPartnerGoogleSignIn({ ...ok, hd: undefined })).toBe(false);
    expect(isPartnerGoogleSignIn({ ...ok, hd: "gmail.com" })).toBe(false);
  });

  test("rejects an unverified Google email", () => {
    expect(isPartnerGoogleSignIn({ ...ok, emailVerified: false })).toBe(false);
  });

  test("rejects a Workspace account that is not on the allowlist", () => {
    expect(
      isPartnerGoogleSignIn({ ...ok, email: "someone@aponvlab.io" }),
    ).toBe(false);
  });
});

describe("normalizeEmail", () => {
  test("lowercases and trims", () => {
    expect(normalizeEmail("  A@B.C  ")).toBe("a@b.c");
  });
});
