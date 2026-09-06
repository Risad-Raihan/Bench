import { describe, expect, test } from "vitest";
import {
  canAcceptMagicLink,
  magicLinkEmail,
} from "./magic-link";

describe("canAcceptMagicLink", () => {
  test("rejects a missing user — no open sign-up", () => {
    expect(canAcceptMagicLink(null)).toBe(false);
  });

  test("rejects a user with no venture membership", () => {
    expect(
      canAcceptMagicLink({
        disabledAt: null,
        hasMembership: false,
        ventureName: null,
        lastSignInAt: null,
      }),
    ).toBe(false);
  });

  test("rejects a disabled member even if they have signed in before", () => {
    expect(
      canAcceptMagicLink({
        disabledAt: new Date("2026-09-01T00:00:00.000Z"),
        hasMembership: true,
        ventureName: "ImmiClaw",
        lastSignInAt: new Date("2026-09-01T00:00:00.000Z"),
      }),
    ).toBe(false);
  });

  test("accepts a provisioned founder or collaborator who is not disabled", () => {
    expect(
      canAcceptMagicLink({
        disabledAt: null,
        hasMembership: true,
        ventureName: "ImmiClaw",
        lastSignInAt: null,
      }),
    ).toBe(true);
  });
});

describe("magicLinkEmail", () => {
  const url = "https://bench.aponvlab.io/api/auth/callback/resend?token=abc";

  test("welcome copy when they have never signed in", () => {
    const mail = magicLinkEmail({
      lastSignInAt: null,
      ventureName: "ImmiClaw",
      url,
    });
    expect(mail.subject).toBe("Welcome to Bench");
    expect(mail.text).toContain("ImmiClaw is set up");
    expect(mail.text).toContain(url);
    expect(mail.html).toContain("ImmiClaw");
    expect(mail.html).toContain(url);
  });

  test("plain sign-in copy once they have signed in before", () => {
    const mail = magicLinkEmail({
      lastSignInAt: new Date("2026-09-01T00:00:00.000Z"),
      ventureName: "ImmiClaw",
      url,
    });
    expect(mail.subject).toBe("Sign in to Bench");
    expect(mail.text).not.toContain("is set up");
    expect(mail.text).toContain(url);
    expect(mail.html).toContain(url);
  });

  test("welcome copy still names the venture when the name is missing", () => {
    const mail = magicLinkEmail({
      lastSignInAt: null,
      ventureName: null,
      url,
    });
    expect(mail.text).toContain("your venture is set up");
  });
});
