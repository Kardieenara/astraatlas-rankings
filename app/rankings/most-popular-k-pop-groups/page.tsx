"use client";

import { useEffect, useMemo, useState } from "react";

const rankingPath = "/rankings/most-popular-k-pop-groups";
const voteStorageKey = "astraatlas:kpop-groups:votes:v1";

type Group = {
  name: string;
  fandom: string;
  votes: number;
  movement: number;
  tone: string;
  initials: string;
};

const demoGroups: Group[] = [
  { name: "BTS", fandom: "ARMY", votes: 28460, movement: 2, tone: "violet", initials: "BTS" },
  { name: "BLACKPINK", fandom: "BLINK", votes: 26120, movement: 1, tone: "rose", initials: "BP" },
  { name: "Stray Kids", fandom: "STAY", votes: 23880, movement: 4, tone: "blue", initials: "SKZ" },
  { name: "SEVENTEEN", fandom: "CARAT", votes: 19640, movement: 1, tone: "mint", initials: "SVT" },
  { name: "TWICE", fandom: "ONCE", votes: 18390, movement: 0, tone: "peach", initials: "TW" },
  { name: "NewJeans", fandom: "Bunnies", votes: 17120, movement: -2, tone: "sky", initials: "NJ" },
  { name: "aespa", fandom: "MY", votes: 15890, movement: 3, tone: "violet", initials: "æ" },
  { name: "IVE", fandom: "DIVE", votes: 14480, movement: 1, tone: "rose", initials: "IVE" },
  { name: "TXT", fandom: "MOA", votes: 13650, movement: 0, tone: "blue", initials: "TXT" },
  { name: "ENHYPEN", fandom: "ENGENE", votes: 12810, movement: 2, tone: "mint", initials: "EN-" },
  { name: "LE SSERAFIM", fandom: "FEARNOT", votes: 11760, movement: 5, tone: "peach", initials: "LS" },
  { name: "NCT 127", fandom: "NCTzen", votes: 10820, movement: -1, tone: "sky", initials: "127" },
  { name: "NCT DREAM", fandom: "NCTzen", votes: 10140, movement: 1, tone: "violet", initials: "DR" },
  { name: "EXO", fandom: "EXO-L", votes: 9540, movement: -1, tone: "rose", initials: "EXO" },
  { name: "Red Velvet", fandom: "ReVeluv", votes: 8910, movement: 0, tone: "blue", initials: "RV" },
  { name: "ITZY", fandom: "MIDZY", votes: 8270, movement: 2, tone: "mint", initials: "ITZ" },
  { name: "ATEEZ", fandom: "ATINY", votes: 7780, movement: 3, tone: "peach", initials: "ATZ" },
  { name: "i-dle", fandom: "NEVERLAND", votes: 7240, movement: 0, tone: "sky", initials: "i-d" },
  { name: "RIIZE", fandom: "BRIIZE", votes: 6810, movement: 4, tone: "violet", initials: "RZ" },
  { name: "ZEROBASEONE", fandom: "ZEROSE", votes: 6320, movement: 1, tone: "rose", initials: "ZB1" },
  { name: "BABYMONSTER", fandom: "MONSTIEZ", votes: 5840, movement: 5, tone: "blue", initials: "BM" },
  { name: "BOYNEXTDOOR", fandom: "ONEDOOR", votes: 5420, movement: 2, tone: "mint", initials: "BND" },
  { name: "TWS", fandom: "42", votes: 4970, movement: 3, tone: "peach", initials: "TWS" },
  { name: "SHINee", fandom: "샤월 · Shawol", votes: 4630, movement: -1, tone: "sky", initials: "SH" },
  { name: "MONSTA X", fandom: "MONBEBE", votes: 4260, movement: 0, tone: "violet", initials: "MX" },
  { name: "THE BOYZ", fandom: "THE B", votes: 3910, movement: 1, tone: "rose", initials: "TBZ" },
  { name: "NMIXX", fandom: "NSWER", votes: 3590, movement: 2, tone: "blue", initials: "NM" },
  { name: "KISS OF LIFE", fandom: "KISSY", votes: 3260, movement: 4, tone: "mint", initials: "KIOF" },
  { name: "TREASURE", fandom: "TREASURE MAKER", votes: 2980, movement: -2, tone: "peach", initials: "TR" },
  { name: "GOT7", fandom: "iGOT7", votes: 2710, movement: 1, tone: "sky", initials: "G7" },
];

const formatVotes = (votes: number) => new Intl.NumberFormat("en-US").format(votes);

function BrandMark() {
  return <a className="brand" href="/" aria-label="AstraAtlas Rankings home"><span className="brand-mark"><span /><span /><span /><span /></span><span className="brand-name">astraatlas<span>rankings</span></span></a>;
}

function SearchIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/></svg>;
}

function ArrowIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
}

function GroupImage({ group, rank }: { group: Group; rank: number }) {
  return <div className={`group-image group-${group.tone} ${rank <= 3 ? `podium-image podium-${rank}` : ""}`} aria-label={`${group.name} demo image placeholder`}>
    <span className="image-orbit image-orbit-one"/><span className="image-orbit image-orbit-two"/><strong>{group.initials}</strong><i>✦</i>
  </div>;
}

export default function MostPopularKpopGroupsPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [votedGroups, setVotedGroups] = useState<Set<string>>(() => new Set());
  const [votesLoaded, setVotesLoaded] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(voteStorageKey);
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      if (Array.isArray(parsed)) {
        const validVotes = parsed.filter((name): name is string =>
          typeof name === "string" && demoGroups.some((group) => group.name === name),
        );
        setVotedGroups(new Set(validVotes));
      }
    } catch {
      // If storage is unavailable or malformed, keep this session usable with demo votes.
    } finally {
      setVotesLoaded(true);
    }
  }, []);

  const rankedGroups = useMemo(() => demoGroups
    .map((group, originalIndex) => ({
      ...group,
      votes: group.votes + (votedGroups.has(group.name) ? 1 : 0),
      originalIndex,
    }))
    .sort((a, b) => b.votes - a.votes || a.originalIndex - b.originalIndex)
    .map(({ originalIndex: _originalIndex, ...group }, index) => ({ ...group, rank: index + 1 })), [votedGroups]);

  const totalVotes = rankedGroups.reduce((sum, group) => sum + group.votes, 0);
  const visibleGroups = useMemo(() => rankedGroups
    .filter((group) => group.name.toLowerCase().includes(query.trim().toLowerCase()) || group.fandom.toLowerCase().includes(query.trim().toLowerCase()))
    .filter((group) => filter === "all" || (filter === "top10" ? group.rank <= 10 : group.movement > 0)), [filter, query, rankedGroups]);

  function castVote(name: string) {
    if (!votesLoaded || votedGroups.has(name)) return;

    let currentVotes = new Set(votedGroups);
    try {
      const saved = window.localStorage.getItem(voteStorageKey);
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      if (Array.isArray(parsed)) {
        currentVotes = new Set(parsed.filter((candidate): candidate is string =>
          typeof candidate === "string" && demoGroups.some((group) => group.name === candidate),
        ));
      }
      if (currentVotes.has(name)) {
        setVotedGroups(currentVotes);
        return;
      }
      currentVotes.add(name);
      window.localStorage.setItem(voteStorageKey, JSON.stringify([...currentVotes]));
    } catch {
      currentVotes.add(name);
    }
    setVotedGroups(currentVotes);
  }

  async function shareRanking() {
    const url = `${window.location.origin}${rankingPath}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Most Popular K-pop Groups — AstraAtlas Rankings", text: "See where your favorite K-pop groups rank.", url });
        setShareMessage("Ranking shared");
        return;
      } catch {
        // A dismissed native share sheet is not an error; offer the copy fallback.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setShareMessage("Link copied to clipboard");
    } catch {
      setShareMessage(url);
    }
  }

  return <main className="ranking-page">
    <div className="ranking-announcement"><span className="live-dot"/> COMMUNITY RANKING <span className="announcement-divider"/> OCTOBER 2026 <span className="announcement-demo">DEMO EXPERIENCE</span></div>
    <header className="ranking-header"><div className="ranking-header-inner"><BrandMark/><nav aria-label="Main navigation"><a href="/">Home</a><a className="ranking-nav-current" href={rankingPath}>Rankings</a><a href={`${rankingPath}#how-it-works`}>How it works</a></nav><a className="header-home-link" href="/">AstraAtlas home <ArrowIcon/></a></div></header>

    <section className="ranking-hero"><div className="ranking-hero-grid"/><div className="ranking-hero-inner"><div className="breadcrumb"><a href="/">Home</a><span>/</span><span>K-pop</span><span>/</span><span>Group rankings</span></div><div className="ranking-title-row"><div className="ranking-title-copy"><div className="ranking-eyebrow"><span className="sparkle-dot">✦</span> THE FAN-POWERED CHART</div><h1>Most Popular<br/><span>K-pop Groups</span></h1><p>Thirty groups. One community-powered chart. Show the world<br className="title-desktop-break"/> who has your heart right now.</p><div className="ranking-hero-tags"><span className="demo-pill"><i/> DEMO DATA</span><span className="period-pill">VOTING PERIOD <strong>OCT 1 — OCT 31, 2026</strong></span></div></div><div className="ranking-hero-art" aria-hidden="true"><div className="hero-orbit hero-orbit-a"/><div className="hero-orbit hero-orbit-b"/><div className="hero-orbit hero-orbit-c"/><div className="hero-planet"><span>AA</span><i>✦</i></div><div className="planet-tag tag-top">TOP 30</div><div className="planet-tag tag-live"><span className="live-dot"/> LIVE DEMO</div><span className="hero-spark spark-a">✧</span><span className="hero-spark spark-b">✦</span></div></div>
      <div className="ranking-summary"><div><strong>{demoGroups.length}</strong><span>groups in the ranking</span></div><span className="summary-rule"/><div><strong>{formatVotes(totalVotes)}</strong><span>demo votes so far</span></div><span className="summary-rule"/><div><strong>29 <small>days</small></strong><span>left in this demo period</span></div><button className="share-button" onClick={shareRanking}><span>↗</span> Share ranking</button>{shareMessage && <span role="status" className="share-status">{shareMessage}</span>}</div>
    </div></section>

    <section className="leaderboard-section"><div className="leaderboard-wrap"><div className="leaderboard-heading"><div><div className="ranking-eyebrow"><span className="heading-line"/> WHERE THE FANDOM STANDS</div><h2>The leaderboard</h2><p>Every vote moves the conversation. Where will your favorite land?</p></div><span className="list-demo-label"><i/> DEMO DATA</span></div>
      <div className="leaderboard-tools"><label className="ranking-search"><SearchIcon/><input aria-label="Search K-pop groups" placeholder="Search groups or fandoms..." value={query} onChange={(event) => setQuery(event.target.value)}/>{query && <button aria-label="Clear search" onClick={() => setQuery("")}>×</button>}</label><div className="ranking-filter" role="group" aria-label="Filter groups"><button className={filter === "all" ? "selected" : ""} onClick={() => setFilter("all")}>All groups <span>30</span></button><button className={filter === "rising" ? "selected" : ""} onClick={() => setFilter("rising")}>Rising <span>↑</span></button><button className={filter === "top10" ? "selected" : ""} onClick={() => setFilter("top10")}>Top 10</button></div></div>
      <div className="leaderboard-card"><div className="leaderboard-column-head"><span>RANK</span><span>GROUP</span><span>MOVEMENT</span><span>COMMUNITY VOTES</span><span>YOUR VOTE</span></div>
        {visibleGroups.length ? visibleGroups.map((group) => {
          const percentage = totalVotes ? (group.votes / totalVotes) * 100 : 0;
          return <article key={group.name} className={`leaderboard-row ${group.rank <= 3 ? `leader-top leader-top-${group.rank}` : ""}`}>
            <div className="leader-rank"><span className="rank-medal">{group.rank <= 3 ? ["✦", "✧", "✧"][group.rank - 1] : String(group.rank).padStart(2, "0")}</span>{group.rank <= 3 && <small>TOP {group.rank}</small>}</div>
            <div className="leader-group"><GroupImage group={group} rank={group.rank}/><div><h3>{group.name}</h3><span>{group.fandom}</span></div></div>
            <div className={`leader-movement ${group.movement > 0 ? "movement-up" : group.movement < 0 ? "movement-down" : "movement-steady"}`}>{group.movement > 0 ? <><b>↑</b> {group.movement}</> : group.movement < 0 ? <><b>↓</b> {Math.abs(group.movement)}</> : <><i/> —</>}</div>
            <div className="leader-vote-stats"><div><strong>{formatVotes(group.votes)}</strong><span>{percentage.toFixed(4)}%</span></div><div className="vote-track"><i style={{ width: `${Math.max(percentage, 1.2)}%` }}/></div></div>
            <div className="leader-vote-action"><button className={votedGroups.has(group.name) ? "voted" : ""} aria-pressed={votedGroups.has(group.name)} disabled={!votesLoaded || votedGroups.has(group.name)} onClick={() => castVote(group.name)}>{votedGroups.has(group.name) ? <><span>✓</span> Voted</> : <>Vote <span>+</span></>}</button></div>
          </article>;
        }) : <div className="ranking-empty"><span>✧</span><strong>No groups match that search</strong><p>Try another group or fandom name.</p></div>}
      </div>
      <p className="ranking-demo-note"><span>ⓘ</span> Demo only: votes are stored in this browser and persist after refresh. No real voting takes place.</p>

      <section className="how-ranking-works" id="how-it-works"><div className="how-icon">✦</div><div><div className="ranking-eyebrow"><span className="heading-line"/> SIMPLE, OPEN, FAN-POWERED</div><h2>How this ranking works</h2><p>Fans cast one demo vote per group in this browser. Votes are saved in localStorage, and the count, percentage, and rank update instantly on this page; the ranking order and movement indicators are sample data for this preview. The demo voting period runs from October 1 to October 31, 2026.</p></div><span className="how-demo-stamp">A COMMUNITY<br/>DEMO</span></section>
    </div></section>

    <footer className="ranking-footer"><div><BrandMark/><span>Independent opinions. Infinite perspectives. <b>✦</b></span></div><a href="/">Back to AstraAtlas <ArrowIcon/></a></footer>
  </main>;
}




