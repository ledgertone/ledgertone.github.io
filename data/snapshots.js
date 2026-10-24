/*
  Ledgertone data. One object per snapshot. Do not invent numbers.
  Schema and update steps: docs/DATA.md
  Shape: { capturedAt: "YYYY-MM-DD", note: "optional", sample: true (optional), artists: [{ name, streams, profileUrl? }] }

  The three snapshots below are SAMPLE DATA with fictional artists, added at the owner's request
  to preview the design. Images are generated placeholders, profileUrl is a stand-in
  (the Pandora home page, fictional artists have no Pandora pages). Remove every snapshot that has sample: true before the real launch.
*/
window.LEDGERTONE = { snapshots: [
  {
    capturedAt: "2026-10-01",
    sample: true,
    note: "Sample data for design preview, not real.",
    artists: [
      { name: "Neon Quartz", streams: 2400000, image: "assets/artists/neon-quartz.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Vantablack Choir", streams: 2232037, image: "assets/artists/vantablack-choir.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Static Orchard", streams: 2075774, image: "assets/artists/static-orchard.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Glass Meridian", streams: 1930411, image: "assets/artists/glass-meridian.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Low Tide Parade", streams: 1795348, image: "assets/artists/low-tide-parade.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Cold Harbor Club", streams: 1669685, image: "assets/artists/cold-harbor-club.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Paper Lanterns Inc", streams: 1552722, image: "assets/artists/paper-lanterns-inc.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Mirror Season", streams: 1444059, image: "assets/artists/mirror-season.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Night Ledger", streams: 1342996, image: "assets/artists/night-ledger.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Rust and Rain", streams: 1248933, image: "assets/artists/rust-and-rain.svg", profileUrl: "https://www.pandora.com/" }
    ]
  },
  {
    capturedAt: "2026-10-12",
    sample: true,
    note: "Sample data for design preview, not real.",
    artists: [
      { name: "Neon Quartz", streams: 2480000, image: "assets/artists/neon-quartz.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Vantablack Choir", streams: 2343637, image: "assets/artists/vantablack-choir.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Static Orchard", streams: 2179574, image: "assets/artists/static-orchard.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Glass Meridian", streams: 2236911, image: "assets/artists/glass-meridian.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Low Tide Parade", streams: 1885048, image: "assets/artists/low-tide-parade.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Cold Harbor Club", streams: 1753185, image: "assets/artists/cold-harbor-club.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Paper Lanterns Inc", streams: 1630422, image: "assets/artists/paper-lanterns-inc.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Mirror Season", streams: 1516259, image: "assets/artists/mirror-season.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Night Ledger", streams: 1410196, image: "assets/artists/night-ledger.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Rust and Rain", streams: 1311433, image: "assets/artists/rust-and-rain.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Hollow Signal", streams: 1219670, image: "assets/artists/hollow-signal.svg", profileUrl: "https://www.pandora.com/" }
    ]
  },
  {
    capturedAt: "2026-10-24",
    sample: true,
    note: "Sample data for design preview, not real.",
    artists: [
      { name: "Neon Quartz", streams: 2610000, image: "assets/artists/neon-quartz.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Vantablack Choir", streams: 2547337, image: "assets/artists/vantablack-choir.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Static Orchard", streams: 2257374, image: "assets/artists/static-orchard.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Glass Meridian", streams: 2479311, image: "assets/artists/glass-meridian.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Low Tide Parade", streams: 1952448, image: "assets/artists/low-tide-parade.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Cold Harbor Club", streams: 1815785, image: "assets/artists/cold-harbor-club.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Paper Lanterns Inc", streams: 1688622, image: "assets/artists/paper-lanterns-inc.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Mirror Season", streams: 1570459, image: "assets/artists/mirror-season.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Night Ledger", streams: 1460596, image: "assets/artists/night-ledger.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Rust and Rain", streams: 1358233, image: "assets/artists/rust-and-rain.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Hollow Signal", streams: 1263170, image: "assets/artists/hollow-signal.svg", profileUrl: "https://www.pandora.com/" },
      { name: "Velvet Circuit", streams: 1174707, image: "assets/artists/velvet-circuit.svg", profileUrl: "https://www.pandora.com/" }
    ]
  }
]};
