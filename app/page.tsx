"use client";

import { useMemo, useState } from "react";

type Ranking = {
  rank: number;
  name: string;
  category: string;
  votes: string;
  movement: string;
  tone: string;
  initials: string;
  featured?: boolean;
};

const rankings: Ranking[] = [
  { rank: 1, name: "Jungkook", category: "Solo artists · K-pop", votes: "128.4k", movement: "2", tone: "lavender", initials: "JK", featured: true },
  { rank: 2, name: "BLACKPINK", category: "Girl groups · K-pop", votes: "96.2k", movement: "1", tone: "rose", initials: "BP", featured: true },
  { rank: 3, name: "Stray Kids", category: "Boy groups · K-pop", votes: "84.7k", movement: "3", tone: "blue", initials: "SK", featured: true },
  { rank: 4, name: "NewJeans", category: "Girl groups · K-pop", votes: "72.1k", movement: "—", tone: "mint", initials: "NJ", featured: true },
  { rank: 5, name: "IVE", category: "Girl groups · K-pop", votes: "61.8k", movement: "2", tone: "peach", initials: "IV", featured: true },
  { rank: 6, name: "SEVENTEEN", category: "Boy groups · K-pop", votes: "58.3k", movement: "1", tone: "blue", initials: "SV", featured: true },
  { rank: 7, name: "aespa", category: "Girl groups · K-pop", votes: "49.6k", movement: "4", tone: "lavender", initials: "æ", featured: true },
];

const trending = [
  { title: "Best K-pop stage outfits", category: "Style & culture", votes: "18.2k votes", color: "trend-lilac", icon: "✳" },
  { title: "Most anticipated comebacks", category: "Music · 2025", votes: "12.8k votes", color: "trend-peach", icon: "↗" },
  { title: "K-drama leads we love", category: "Film & TV", votes: "9.4k votes", color: "trend-blue", icon: "✦" },
];

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  if (name === "search") return <svg {...common}><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4 4"/></svg>;
  if (name === "arrow") return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
  if (name === "spark") return <svg {...common}><path d="m12 3 1.5 6.5L20 12l-6.5 1.5L12 20l-1.5-6.5L4 12l6.5-2.5L12 3Z"/><path d="m19 3 .5 2.5L22 6l-2.5.5L19 9l-.5-2.5L16 6l2.5-.5L19 3Z"/></svg>;
  if (name === "globe") return <svg {...common}><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>;
  if (name === "menu") return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
  if (name === "chevron") return <svg {...common}><path d="m9 18 6-6-6-6"/></svg>;
  return <svg {...common}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>;
}

function Brand() {
  return <a className="brand" href="#top" aria-label="AstraAtlas Rankings home"><span className="brand-mark"><span /><span /><span /><span /></span><span className="brand-name">astraatlas<span>rankings</span></span></a>;
}

function RankRow({ item, index }: { item: Ranking; index: number }) {
  return <article className="rank-row" style={{ animationDelay: `${index * 55}ms` }}>
    <span className={`rank-number ${item.rank <= 3 ? "top-three" : ""}`}>{String(item.rank).padStart(2, "0")}</span>
    <div className={`rank-avatar ${item.tone}`} aria-label={`${item.name} demo image placeholder`}><span>{item.initials}</span><i>✦</i></div>
    <div className="rank-info"><h3>{item.name}</h3><p>{item.category}</p></div>
    <div className="rank-votes"><strong>{item.votes}</strong><span>votes</span></div>
    <div className={`movement ${item.movement === "—" ? "steady" : "up"}`} aria-label={item.movement === "—" ? "No change" : `Up ${item.movement} places`}>
      {item.movement === "—" ? <span className="steady-dot" /> : <span>↑</span>} {item.movement === "—" ? "steady" : item.movement}
    </div>
  </article>;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All rankings");
  const [menuOpen, setMenuOpen] = useState(false);
  const filters = ["All rankings", "Solo artists", "Girl groups", "Boy groups"];
  const filtered = useMemo(() => rankings.filter((item) => {
    const matchesQuery = `${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesFilter = activeFilter === "All rankings" || item.category.toLowerCase().includes(activeFilter.toLowerCase().replace(" groups", " groups"));
    return matchesQuery && matchesFilter;
  }), [query, activeFilter]);

  return <main id="top">
    <div className="announcement"><span className="live-dot" /> The rankings are moving. Make your voice count. <a href="#rankings">Explore the charts <span>↗</span></a></div>
    <header className="site-header"><div className="header-inner">
      <Brand />
      <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Main navigation"><a className="nav-active" href="#rankings">Rankings</a><a href="#trending">Discover</a><a href="#about">About</a></nav>
      <div className="header-actions"><a className="explore-link" href="#trending">Explore <Icon name="arrow" size={15}/></a><a className="join-button" href="#rankings">Join the community <span>↗</span></a><button className="menu-button" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? "chevron" : "menu"}/></button></div>
    </div></header>

    <section className="hero" id="about"><div className="hero-grid" />
      <div className="hero-content"><div className="eyebrow"><span className="eyebrow-icon"><Icon name="spark" size={13}/></span> A WORLD OF OPINIONS, IN ORBIT</div>
        <h1>Every voice<br/>shifts the <span>stars.</span></h1>
        <p className="hero-copy">The rankings that move with the people who care.<br className="desktop-break"/> Discover what’s rising, and make your voice count.</p>
        <div className="hero-controls"><label className="search-box"><Icon name="search" size={18}/><input aria-label="Search rankings" placeholder="Find a ranking, artist, or trend..." value={query} onChange={(event) => setQuery(event.target.value)}/><kbd>⌘ K</kbd></label><a className="hero-cta" href="/rankings/most-popular-k-pop-groups">Explore rankings <Icon name="arrow" size={17}/></a></div>
        <div className="hero-meta"><span className="avatar-stack"><i>✦</i><i>✷</i><i>✧</i><b>+</b></span><span>Made by fans, for fans</span><span className="meta-divider"/><span><Icon name="globe" size={14}/> A universe of perspectives</span></div>
      </div>
      <div className="orbit-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="orbit orbit-three"/><div className="orbit-core"><span>AA</span><i>✦</i></div><span className="orbit-star star-one">✧</span><span className="orbit-star star-two">✦</span><span className="orbit-star star-three">✳</span><span className="orbit-label">YOUR WORLD<br/>IN PERSPECTIVE</span><div className="orbit-pill"><span className="live-dot"/> 24,806 voices today</div></div>
      <div className="hero-bottom"><span>INDEPENDENT. COMMUNITY-LED. ALWAYS EVOLVING.</span><span>SCROLL TO EXPLORE <span className="scroll-arrow">↓</span></span></div>
    </section>

    <section className="rankings-section section-wrap" id="rankings"><div className="section-heading"><div><div className="section-kicker"><span className="kicker-line"/> THE PEOPLE HAVE SPOKEN</div><h2>Featured <span>rankings</span></h2><p>The names at the top of everyone’s list right now.</p></div><a className="text-link" href="/rankings/most-popular-k-pop-groups">View all rankings <Icon name="arrow" size={16}/></a></div>
      <div className="ranking-layout"><div className="ranking-main"><div className="ranking-toolbar"><div className="filter-tabs" role="tablist" aria-label="Filter rankings">{filters.map((filter) => <button key={filter} role="tab" aria-selected={activeFilter === filter} className={activeFilter === filter ? "filter-active" : ""} onClick={() => setActiveFilter(filter)}>{filter}</button>)}</div><span className="demo-tag"><span/> DEMO DATA</span></div>
        <div className="rank-list">{filtered.length ? filtered.map((item, index) => <RankRow key={item.name} item={item} index={index}/>) : <div className="empty-state"><span>✧</span><strong>No rankings found</strong><p>Try another search or category.</p></div>}</div>
        <a href="/rankings/most-popular-k-pop-groups" className="all-rankings">Explore all K-pop rankings <Icon name="arrow" size={16}/></a>
      </div>
      <aside className="ranking-aside"><div className="aside-topline"><span className="live-dot"/> RANKING LIVE</div><div className="aside-orbit"><div className="aside-ring ring-a"/><div className="aside-ring ring-b"/><div className="aside-star">✦</div><span className="aside-mini mini-a">+2</span><span className="aside-mini mini-b">+4</span></div><div className="aside-copy"><span className="aside-label">FANDOM POWER</span><h3>Every vote<br/>moves <em>the needle.</em></h3><p>Rankings update with every community vote. Come see where your favorites stand.</p><a href="#trending">See what’s moving <Icon name="arrow" size={15}/></a></div><div className="aside-stat"><div><strong>1.2<span>m</span></strong><span>community votes</span></div><div><strong>84</strong><span>live rankings</span></div></div></aside></div>
      <p className="demo-note"><span>ⓘ</span> This is a demo experience. Votes and rankings shown are sample data and don’t represent live results.</p>
    </section>

    <section className="trending-section" id="trending"><div className="section-wrap"><div className="section-heading trending-heading"><div><div className="section-kicker"><span className="kicker-line"/> WHAT’S IN ORBIT</div><h2>Trending <span>right now</span></h2><p>Conversations gathering momentum across the universe.</p></div><a className="text-link" href="#rankings">Discover more <Icon name="arrow" size={16}/></a></div>
      <div className="trending-grid">{trending.map((item, index) => <a className="trend-card" href="#rankings" key={item.title}><div className={`trend-art ${item.color}`}><span className="trend-number">0{index + 1}</span><span className="trend-symbol">{item.icon}</span><div className="trend-orb"/><span className="trend-arrow"><Icon name="arrow" size={16}/></span></div><div className="trend-card-copy"><span>{item.category}</span><h3>{item.title}</h3><p><span className="tiny-live"/>{item.votes} <span>·</span> trending today</p></div></a>)}</div>
    </div></section>

    <section className="community-banner"><div className="banner-stars">✦　✧　✦</div><div><span className="section-kicker">YOUR UNIVERSE, YOUR CALL</span><h2>The next move<br/>is <em>yours.</em></h2><p>Find your people. Champion your favorites.<br/>See what the world thinks.</p><a href="#rankings">Explore the rankings <Icon name="arrow" size={16}/></a></div><div className="banner-orbit" aria-hidden="true"><div/><span>✦</span><i>AA</i></div></section>
    <footer className="site-footer"><div className="footer-top"><Brand/><p>A universe of perspectives.<br/>Rankings made by people, for people.</p><div className="footer-links"><a href="#rankings">Rankings</a><a href="#trending">Discover</a><a href="#about">About us</a><a href="#about">Community</a></div><span className="footer-demo">DEMO EXPERIENCE</span></div><div className="footer-bottom"><span>© 2025 AstraAtlas. Made for the curious.</span><span>Independent opinions. Infinite perspectives. <span className="footer-spark">✦</span></span></div></footer>
  </main>;
}

