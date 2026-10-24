/*
  Ledgertone data. One object per snapshot. Do not invent numbers.
  Schema and update steps: docs/DATA.md
  Shape: { capturedAt: "YYYY-MM-DD", note: "optional", artists: [{ name, streams, profileUrl? }] }
*/
window.LEDGERTONE = { snapshots: [] };
