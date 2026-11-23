import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ClosingCta,
  Faq,
  Media,
  PageLoading,
  Sticker,
} from "../components/Shared";
import {
  isVideo,
  coverOf,
  getContent,
  getProjects,
  getServices,
  useData,
} from "../lib/data";
import "./Services.css";
import litmore from "../assets/litmore.svg";

gsap.registerPlugin(ScrollTrigger);

const CARD_TONES = [
  ["var(--cream)", "var(--burgundy)"],
  ["var(--burgundy)", "var(--cream)"],
  ["var(--olive)", "var(--cream)"],
  ["var(--mandarine)", "var(--cream)"],
];
const SERVICE_CATEGORY = {
  "ux-ui": "ux-ui-design",
  "brand-identity": "branding",
  branding: "graphic-design",
  "motion-graphics": "motion-graphics",
  "coding-development": "coding-development",
  "immersive-games": "game-ux-ui",
  "contextual-research": "contextual-research",
};
const PHASES = [
  {
    n: "01 PLAN",
    title: "Plan",
    bg: "var(--sky)",
    items: [
      "Discovery",
      "Research",
      "User flows",
      "Strategy",
      "Personas",
      "Sitemap",
    ],
  },
  {
    n: "02 Design",
    title: "Design",
    bg: "var(--blush)",
    items: [
      "Wireframes",
      "UI kit",
      "Prototype",
      "Visual style",
      "Interaction",
      "Design QA",
    ],
  },
  {
    n: "03 Develop",
    title: "Develop",
    bg: "var(--yellow)",
    items: ["Components", "Responsive", "Motion", "Data", "QA", "Launch"],
  },
];
const HOW = [
  [
    "01",
    "Say hello",
    "Tell me what you have in mind. Half-formed ideas are welcome.",
  ],
  [
    "02",
    "Find the focus",
    "We agree on the problem, the people and the possibilities.",
  ],
  [
    "03",
    "Make & explore",
    "I share directions early, so we can shape the good stuff together.",
  ],
  [
    "04",
    "Refine the details",
    "We test, talk and polish. Nothing gets lost in the handoff.",
  ],
  [
    "05",
    "Send it out",
    "A considered launch, organised files and a little aftercare.",
  ],
];

export default function Services() {
  const { data: services } = useData("services", getServices);
  const { data: content } = useData("content", getContent);
  const { data: projects } = useData("projects", getProjects);

  if (!services) return <PageLoading />;
  const covers = (projects ?? [])
    .map(coverOf)
    .filter((u) => u && !u.endsWith("/") && !isVideo(u));
  const packages = content?.services_packages ?? [];
  const faq = content?.services_faq ?? [];

  return (
    <div className="page services">
      <ServicesHero covers={covers.slice(0, 4)} />
      <StackedServices services={services} projects={projects ?? []} />
      <Phases />
      <HowIWork />
      <Packages packages={packages} />
      <Faq items={faq} />
      <ClosingCta />
    </div>
  );
}

function ServicesHero({ covers }) {
  return (
    <section className="s-hero">
      <img
        className="s-hero__squiggle"
        src="/assets/services-squiggle.png"
        alt=""
        aria-hidden="true"
      />
      <h1 className="s-hero__title" data-reveal>
        <span>Good ideas deserve a</span>
        <span className="s-hero__more">
          <img src={litmore} alt="" />
        </span>
      </h1>
      <div className="s-hero__pocket" aria-hidden="true">
        <span className="s-hero__back" />
        {covers.map((src, i) => (
          <div
            key={src}
            className="s-hero__card"
            style={{ "--i": i, "--rot": i % 2 ? "-4deg" : "6deg" }}
          >
            <img src={src} alt="" />
          </div>
        ))}
        <span className="s-hero__front" />
      </div>
      <a href="#services-list" className="s-hero__scroll">
        Scroll to explore <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}

function StackedServices({ services, projects }) {
  return (
    <section className="stacked" id="services-list">
      {services.map((s, i) => {
        const [bg, fg] = CARD_TONES[i % CARD_TONES.length];
        const cat = SERVICE_CATEGORY[s.slug];
        const previews = (s.preview_images ?? []).filter(Boolean);
        const fallback = projects
          .filter((p) => p.categories.some((c) => c.slug === cat))
          .map(coverOf)
          .filter(Boolean);
        const imgs = (previews.length ? previews : fallback).slice(0, 3);
        return (
          <article
            key={s.id}
            className="svc"
            style={{
              "--bg": bg,
              "--fg": fg,
              "--i": i,
              top: `calc(var(--stack-top) + ${i} * var(--stack-step))`,
            }}
          >
            <header className="svc__head">
              <h2 className="svc__title">{s.name}</h2>
              <p className="svc__desc">{s.description}</p>
            </header>
            <div className="svc__body">
              <div className="svc__get">
                <p className="script">What you get</p>
                <ul>
                  {(s.what_you_get ?? []).map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </div>
              <div className="svc__imgs">
                {[0, 1, 2].map((k) => (
                  <div
                    key={k}
                    className="svc__img"
                    style={{ "--rot": `${[-3, 2, -1][k]}deg` }}
                  >
                    <Media src={imgs[k]} alt="" />
                  </div>
                ))}
              </div>
            </div>
            <footer className="svc__foot">
              <Link
                to={
                  s.see_all_link || (cat ? `/works?category=${cat}` : "/works")
                }
                className="svc__all"
              >
                <span className="hand-outline" aria-hidden="true" />
                See all work ↗
              </Link>
            </footer>
          </article>
        );
      })}
    </section>
  );
}

const smooth = (t) => t * t * (3 - 2 * t);

function Phases() {
  const root = useRef(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    const cards = gsap.utils.toArray(".phase", root.current);
    const inners = cards.map((c) => c.querySelector(".phase__inner"));
    const title = root.current.querySelector(".phases__title");

    mm.add(
      "(min-width: 861px) and (prefers-reduced-motion: no-preference)",
      () => {
        const lerp = gsap.utils.interpolate;
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 3}`,
          pin: true,
          scrub: 1,
          onUpdate: ({ progress: t }) => {
            gsap.set(title, {
              yPercent: lerp(60, 0, smooth(Math.min(1, t / 0.35))),
            });
            cards.forEach((card, s) => {
              const delay = s * 0.05;
              const o = gsap.utils.clamp(0, 1, (t - delay) / (0.9 - delay));
              const y =
                o < 0.4
                  ? lerp(140, -8, smooth(o / 0.4))
                  : o < 0.6
                    ? lerp(-8, 0, smooth((o - 0.4) / 0.2))
                    : 0;
              const scale =
                o < 0.4
                  ? lerp(0.3, 0.8, smooth(o / 0.4))
                  : o < 0.6
                    ? lerp(0.8, 1, smooth((o - 0.4) / 0.2))
                    : 1;
              const opacity = o < 0.2 ? smooth(o / 0.2) : 1;
              const startX = s === 0 ? 100 : s === 1 ? 0 : -100;
              const startR = s === 0 ? -5 : s === 1 ? 0 : 5;
              const spread = o < 0.6 ? 0 : smooth((o - 0.6) / 0.4);
              gsap.set(card, {
                yPercent: y,
                xPercent: lerp(startX, 0, spread),
                rotate: lerp(startR, 0, spread),
                scale,
                opacity,
              });
              gsap.set(inners[s], { rotationY: spread * 180 });
            });
          },
        });
        return () => st.kill();
      },
    );

    mm.add(
      "(max-width: 860px) and (prefers-reduced-motion: no-preference)",
      () => {
        const tweens = inners.map((inner, i) =>
          gsap.fromTo(
            inner,
            { rotationY: 0 },
            {
              rotationY: 180,
              ease: "none",
              scrollTrigger: {
                trigger: cards[i],
                start: "top 85%",
                end: "top 35%",
                scrub: 0.6,
              },
            },
          ),
        );
        return () => tweens.forEach((t) => t.scrollTrigger?.kill());
      },
    );

    mm.add("(prefers-reduced-motion: reduce)", () =>
      gsap.set(inners, { rotationY: 180 }),
    );

    return () => mm.revert();
  }, []);

  return (
    <section className="phases" ref={root}>
      <h2 className="phases__title">
        <span className="script">three phases</span>
        <span className="phases__big">ONE FLOW</span>
      </h2>
      <div className="phases__row">
        {PHASES.map((p, i) => (
          <article
            key={p.title}
            className="phase"
            style={{ "--bg": p.bg, "--i": i }}
          >
            <div className="phase__inner">
              <div className="phase__face phase__front" aria-hidden="true">
                <div className="phase__corner">
                  <span>{p.title}</span>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <span className="phase__front-title script">
                  {p.title.toLowerCase()}
                </span>
                <div className="phase__corner phase__corner--bottom">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>{p.title}</span>
                </div>
              </div>
              <div className="phase__face phase__back">
                <header>
                  <span>{p.n}</span>
                  <span aria-hidden="true">↗</span>
                </header>
                <h3>{p.title}</h3>
                <ol>
                  {p.items.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ol>
              </div>
            </div>
          </article>
        ))}
      </div>
      <Sticker name="laptop" className="phases__sticker" />
    </section>
  );
}

const HOW_PATH =
  "M2.65625 10.1592C145.736 2.15919 204.536 19.7592 341.736 9.35919C478.936 -1.04081 547.536 1.35919 684.736 11.7592C821.936 22.1592 929.736 2.95919 1170.82 10.1592";

function HowIWork() {
  const root = useRef(null);

  useEffect(() => {
    const el = root.current;
    const path = el.querySelector(".how__path");
    const rail = el.querySelector(".how__rail");
    const steps = [...el.querySelectorAll(".how__line li")];
    const mm = gsap.matchMedia();

    const mark = (progress, at) =>
      steps.forEach((li, i) =>
        li.toggleAttribute("data-reached", progress >= at(li, i)),
      );

    mm.add(
      "(min-width: 861px) and (prefers-reduced-motion: no-preference)",
      () => {
        const len = path.getTotalLength();
        const line = el.querySelector(".how__track");
      gsap.set(path, { strokeDasharray: `${len} ${len + 20}`, strokeDashoffset: len + 10 });
        const tw = gsap.to(path, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: line,
            start: "top 85%",
            end: "top 30%",
            scrub: 0.6,
            onUpdate: ({ progress }) => {
              const w = line.offsetWidth;
              mark(progress, (li) => (li.offsetLeft + 5) / w);
            },
          },
        });
        return () => tw.scrollTrigger?.kill();
      },
    );

    mm.add(
      "(max-width: 860px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.set(rail, { scaleY: 0 });
        const tw = gsap.to(rail, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: el.querySelector(".how__track"),
            start: "top 75%",
            end: "bottom 60%",
            scrub: 0.6,
            onUpdate: ({ progress }) => {
              const h = rail.offsetHeight;
              mark(progress, (li) => (li.offsetTop + 15) / h);
            },
          },
        });
        return () => tw.scrollTrigger?.kill();
      },
    );

    mm.add("(prefers-reduced-motion: reduce)", () =>
      steps.forEach((li) => li.setAttribute("data-reached", "")),
    );
    return () => mm.revert();
  }, []);

  return (
    <section className="how" ref={root}>
      <div className="how__inner">
        <h2 className="how__title" data-reveal>
          How I <span className="script">work.</span>
        </h2>
        <p className="how__sub" data-reveal>
          Clear steps. Shared ideas. A little room for the unexpected.
        </p>
        <div className="how__track">
          <svg
            className="how__svg"
            viewBox="0 0 1174 18"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path className="how__path" d={HOW_PATH} />
          </svg>
          <span className="how__rail" aria-hidden="true" />
          <ol className="how__line">
            {HOW.map(([n, t, b], i) => (
              <li key={n} data-reveal style={{ "--delay": `${i * 0.08}s` }}>
                <span className="script how__n">{n}</span>
                <h3>{t}</h3>
                <p>{b}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <Sticker name="cups" className="how__sticker" />
    </section>
  );
}

function Packages({ packages }) {
  const services = [...new Set(packages.map((p) => p.service).filter(Boolean))];
  const [svc, setSvc] = useState(services[0] ?? "");
  const list = packages.filter((p) => !svc || p.service === svc);
  if (!packages.length) return null;
  return (
    <section className="packages section">
      <div className="packages__inner">
        <div className="packages__head" data-reveal>
          <h2>
            A few ways <span className="script">in.</span>
          </h2>
          {services.length > 0 && (
            <label className="packages__select">
              <span className="visually-hidden">Service</span>
              <select value={svc} onChange={(e) => setSvc(e.target.value)}>
                {services.map((s) => (
                  <option key={s} value={s}>
                    {s.replace("-", "/").toUpperCase()}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <p className="packages__sub" data-reveal>
          Every proposal is personal. Think of these as starting points.
        </p>
        <div className="packages__grid">
          {list.map((p, i) => (
            <article
              key={p.title}
              className={`pkg ${p.is_featured ? "pkg--featured" : ""}`}
              data-reveal
              style={{ "--delay": `${i * 0.08}s` }}
            >
              {p.badge && <span className="pkg__badge">{p.badge}</span>}
              <p className="script pkg__script">{p.script_label}</p>
              <h3 className="pkg__title">{p.title}</h3>
              <p className="pkg__desc">{p.description}</p>
              <p className="pkg__scope">{p.scope}</p>
              <ul className="pkg__list">
                {(p.includes ?? []).map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
              <Link to="/contact" className="pkg__cta">
                Let's talk <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
