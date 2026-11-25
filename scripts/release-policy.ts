export type ReleaseIdentity = {
  version: string;
  fingerprint: string;
  sourceRevision: string;
};
export function releaseDecision(
  current: ReleaseIdentity,
  existing: ReleaseIdentity | null,
  draft = false,
): "create" | "resume" | "skip" {
  if (!existing) return "create";
  if (
    current.version !== existing.version ||
    current.fingerprint !== existing.fingerprint
  )
    throw Error(
      "Release inputs changed under an existing version. Bump distribution/config.json version and run pnpm distribution:sync.",
    );
  return draft ? "resume" : "skip";
}
