const CFG = {
    telegramUsername: "yourusername",
    telegramBotToken: "YOUR_BOT_TOKEN",
    telegramChatId: "YOUR_CHAT_ID",
};

// Loader — fires on DOM ready, NOT window.load (which waits for external CSS/fonts)
// This means loader always dismisses even when offline or opening via file://
function dismissLoader() {
    const ldr = document.getElementById("loader");
    if (ldr && !ldr.classList.contains("out")) {
        ldr.classList.add("out");
        spawnParticles();
        countUp();
        typeLoop();
        initTimeline();
    }
}
// DOMContentLoaded fires as soon as HTML is parsed — no waiting for external resources
document.addEventListener("DOMContentLoaded", () => {
    setTimeout(dismissLoader, 1900); // match loader bar animation duration
});
// Absolute fallback: dismiss after 2.5s no matter what
setTimeout(dismissLoader, 2500);

function spawnParticles() {
    const w = document.getElementById("particles");
    for (let i = 0; i < 28; i++) {
        const el = document.createElement("div");
        el.className = "particle";
        const sz = Math.random() * 4.5 + 1.5,
            dur = Math.random() * 20 + 12,
            del = Math.random() * 18;
        const dx = (Math.random() - 0.5) * 220;
        const col =
            Math.random() > 0.5 ? "rgba(196,123,43," : "rgba(59,138,140,";
        el.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;background:${col}0.55);animation-duration:${dur}s;animation-delay:${del}s;--dx:${dx}px;`;
        w.appendChild(el);
    }
}

const phrases = [
    "Python & Pandas",
    "Telegram Bots",
    "React & Node.js",
    "SQL Analytics",
    "GPT APIs",
    "Data Pipelines",
];
let pi = 0,
    ci = 0,
    del = false;
function typeLoop() {
    const el = document.getElementById("typedEl");
    if (!el) return;
    const cur = phrases[pi];
    el.textContent = del ? cur.slice(0, ci--) : cur.slice(0, ci++);
    let wait = del ? 55 : 105;
    if (!del && ci > cur.length) {
        wait = 1900;
        del = true;
    }
    if (del && ci < 0) {
        del = false;
        ci = 0;
        pi = (pi + 1) % phrases.length;
        wait = 350;
    }
    setTimeout(typeLoop, wait);
}

const cg = document.getElementById("cg");
document.addEventListener("mousemove", (e) => {
    cg.style.left = e.clientX + "px";
    cg.style.top = e.clientY + "px";
});

const nav = document.getElementById("nav");
window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", scrollY > 50);
    document.getElementById("stb").classList.toggle("show", scrollY > 380);
});

document.getElementById("ham").onclick = () => {
    const h = document.getElementById("ham");
    const m = document.getElementById("mobNav");
    const isOpen = h.classList.contains("open");
    if (!isOpen) {
        h.classList.add("open");
        m.classList.add("open");
    } else {
        h.classList.remove("open");
        m.classList.remove("open");
    }
};
document.querySelectorAll(".mob-nav a").forEach(
    (a) =>
    (a.onclick = () => {
        document.getElementById("ham").classList.remove("open");
        document.getElementById("mobNav").classList.remove("open");
    }),
);

const ro = new IntersectionObserver(
    (entries) => {
        entries.forEach((en) => {
            if (!en.isIntersecting) return;
            en.target.classList.add("in");
            en.target
                .querySelectorAll(".sk-fill")
                .forEach((b) => (b.style.width = b.dataset.w || "0%"));
        });
    },
    { threshold: 0.08, rootMargin: "0px 0px -50px 0px" },
);
document.querySelectorAll(".reveal").forEach((el) => ro.observe(el));

function countUp() {
    document.querySelectorAll(".hstat-n[data-c]").forEach((el) => {
        const t = +el.dataset.c;
        let n = 0;
        const iv = setInterval(() => {
            n = Math.min(n + Math.ceil(t / 35), t);
            el.textContent = n + "+";
            if (n >= t) clearInterval(iv);
        }, 40);
    });
}

function filtSkill(cat, btn) {
    document
        .querySelectorAll(".stab")
        .forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    document.querySelectorAll(".skill-card").forEach((c) => {
        c.style.display =
            cat === "all" || c.dataset.cat === cat ? "" : "none";
    });
}

function filtProj(cat, btn) {
    document
        .querySelectorAll(".pfilt")
        .forEach((b) => b.classList.remove("on"));
    btn.classList.add("on");
    document.querySelectorAll(".proj-card").forEach((c) => {
        const catMatch = cat === "all" || c.dataset.pcat === cat;
        const isHidden =
            c.classList.contains("hidden-proj") &&
            !c.classList.contains("show");
        c.style.display = catMatch && !isHidden ? "" : "none";
    });
}

function initTimeline() {
    document
        .querySelectorAll("#tl-edu .tl-item")
        .forEach((it, i) =>
            setTimeout(() => it.classList.add("in"), i * 180 + 200),
        );
}
function switchTL(id, btn) {
    document
        .querySelectorAll(".tpill")
        .forEach((b) => b.classList.remove("on"));
    document
        .querySelectorAll(".timeline")
        .forEach((t) => t.classList.remove("on"));
    btn.classList.add("on");
    const tl = document.getElementById("tl-" + id);
    tl.classList.add("on");
    tl.querySelectorAll(".tl-item").forEach((it, i) => {
        it.classList.remove("in");
        setTimeout(() => it.classList.add("in"), i * 160 + 60);
    });
}

async function sendTG() {
    const name = document.getElementById("iName").value.trim();
    const email = document.getElementById("iEmail").value.trim();
    const topic = document.getElementById("iTopic").value;
    const msg = document.getElementById("iMsg").value.trim();
    const st = document.getElementById("fstatus");
    const btn = document.getElementById("sendBtn");
    if (!name || !email || !msg) {
        st.className = "err";
        st.textContent = "Please fill in name, email, and message.";
        return;
    }
    if (
        !CFG.telegramBotToken ||
        CFG.telegramBotToken === "YOUR_BOT_TOKEN"
    ) {
        st.className = "err";
        st.innerHTML = `Telegram bot not configured yet. <a href="https://t.me/${CFG.telegramUsername}" target="_blank" style="color:var(--accent)">Message me directly here &rarr;</a>`;
        return;
    }
    btn.disabled = true;
    btn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    const text = `🔔 *New Portfolio Message*\n\n👤 *Name:* ${name}\n📧 *Email:* ${email}\n📌 *Topic:* ${topic || "General"}\n\n💬 *Message:*\n${msg}\n\n─────────\n_Sent via Portfolio Website_`;
    try {
        const r = await fetch(
            `https://api.telegram.org/bot${CFG.telegramBotToken}/sendMessage`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: CFG.telegramChatId,
                    text,
                    parse_mode: "Markdown",
                }),
            },
        );
        const d = await r.json();
        if (d.ok) {
            st.className = "ok";
            st.innerHTML = "Sent! I'll reply to your email or Telegram soon.";
            ["iName", "iEmail", "iMsg"].forEach(
                (id) => (document.getElementById(id).value = ""),
            );
            document.getElementById("iTopic").value = "";
        } else throw new Error(d.description);
    } catch (e) {
        st.className = "err";
        st.innerHTML = `Sending failed. <a href="https://t.me/${CFG.telegramUsername}" target="_blank" style="color:var(--accent)">Try Telegram directly &rarr;</a>`;
    } finally {
        btn.disabled = false;
        btn.innerHTML =
            '<i class="fa-solid fa-paper-plane"></i> Send Message';
    }
}

/* ── SEE MORE PROJECTS ── */
let projExpanded = false;
function toggleMoreProjects() {
    projExpanded = !projExpanded;
    const btn = document.getElementById("seeMoreBtn");
    const txt = document.getElementById("seeMoreTxt");
    btn.classList.toggle("expanded", projExpanded);
    document.querySelectorAll(".proj-card.hidden-proj").forEach((c, i) => {
        if (projExpanded) {
            c.style.display = "";
            c.classList.remove("hide");
            setTimeout(() => c.classList.add("show"), i * 80);
        } else {
            c.classList.remove("show");
            c.classList.add("hide");
            setTimeout(
                () => {
                    if (!projExpanded) {
                        c.classList.remove("hide");
                        c.style.display = "none";
                    }
                },
                350 + i * 50,
            );
        }
    });
    txt.textContent = projExpanded ? "Show Less" : "See All Projects";
}

/* ── SEE MORE CERTS ── */
let certExpanded = false;
function toggleMoreCerts() {
    certExpanded = !certExpanded;
    const btn = document.getElementById("certSeeMoreBtn");
    const txt = document.getElementById("certSeeMoreTxt");
    btn.classList.toggle("expanded", certExpanded);
    document.querySelectorAll(".cert-card.hidden-cert").forEach((c, i) => {
        if (certExpanded) {
            c.style.display = "";
            c.classList.remove("hide");
            setTimeout(() => c.classList.add("show"), i * 80);
        } else {
            c.classList.remove("show");
            c.classList.add("hide");
            setTimeout(
                () => {
                    if (!certExpanded) {
                        c.classList.remove("hide");
                        c.style.display = "none";
                    }
                },
                350 + i * 50,
            );
        }
    });
    txt.textContent = certExpanded ? "Show Less" : "Show All Certificates";
}

/* ── CERT LIGHTBOX ── */
function openCert(card) {
    const name = card.dataset.name || "";
    const issuer = card.dataset.issuer || "";
    const year = card.dataset.year || "";
    const img = card.dataset.img || "";
    const inner = document.getElementById("certLbInner");
    const imgTag = img
        ? `<img class="cert-lb-img" src="${img}" alt="${name}" loading="lazy"/>`
        : `<div class="cert-lb-ph"><i class="fa-solid fa-file-certificate"></i><span>Add your certificate image path to data-img attribute</span></div>`;
    inner.innerHTML = `
    ${imgTag}
    <div class="cert-lb-body">
      <div class="cert-lb-name">${name}</div>
      <div class="cert-lb-sub">${issuer} &nbsp;·&nbsp; ${year}</div>
      ${img ? `<a href="${img}" target="_blank" class="btn btn-out" style="margin-top:.8rem;font-size:.82rem;padding:9px 18px;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Open Full Image</a>` : ""}
    </div>`;
    document.getElementById("certLightbox").classList.add("open");
    document.body.style.overflow = "hidden";
}
function closeCert() {
    document.getElementById("certLightbox").classList.remove("open");
    document.body.style.overflow = "";
}
function closeCertIfBg(e) {
    if (e.target === document.getElementById("certLightbox")) closeCert();
}
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCert();
});

document.querySelectorAll(".proj-card").forEach((c) => {
    c.addEventListener("mousemove", (e) => {
        const r = c.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 8,
            y = ((e.clientY - r.top) / r.height - 0.5) * 8;
        c.style.transform = `translateY(-7px) rotateX(${-y}deg) rotateY(${x}deg)`;
    });
    c.addEventListener("mouseleave", () => {
        c.style.transform = "";
    });
});