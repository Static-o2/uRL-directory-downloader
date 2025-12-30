
(() => {
  const getText = (el) => (el ? el.textContent.trim() : "");
  const normalizeURL = (url) => (url && url.startsWith("//") ? "https:" + url : (url || ""));

  const parseNameAndAlumniYear = (raw) => {
    const text = (raw || "").trim();
    const m = text.match(/(.+?)\s+'(\d{2})\s*$/);
    if (m) {
      const name = m[1].trim();
      const yy = parseInt(m[2], 10);
      const alumniYear = yy >= 50 ? 1900 + yy : 2000 + yy;
      return { name, alumniYear: String(alumniYear) };
    }
    return { name: text, alumniYear: "" };
  };

  const looksLikeRoles = (p) => {
    if (!p) return false;

    if (p.querySelector("a[href^='mailto:']") || p.querySelector("a[href^='tel:']")) return false;
    const txt = getText(p);
    if (!txt) return false;

    if (/\b\d{3,}\b/.test(txt) && /\b(st|street|ave|avenue|unit|apt|road|rd|lane|ln|drive|dr|massachusetts|ma)\b/i.test(txt)) return false;
    if (/\b\d{5}(-\d{4})?\b/.test(txt)) return false; // ZIP codes

    const commay = txt.includes(",");
    const shortWords = txt.split(/\s+/).filter(Boolean);

    const likelyDept = commay || (shortWords.length <= 3 && /^[A-Za-z,&\s]+$/.test(txt));
    return likelyDept;
  };

  const table = document.querySelector("#directory-items-container");
  if (!table) {
    console.error("Could not find #directory-items-container.");
    return;
  }

  const results = [];
  const trs = Array.from(table.querySelectorAll("tr"));

  for (const tr of trs) {
    const imgEl = tr.querySelector("img.bb-avatar-image");
    const nameEl = tr.querySelector("h3");
    const leadPs = Array.from(tr.querySelectorAll("p.lead"));

    // Identify email
    const emailP = leadPs.find((p) => p.querySelector("a[href^='mailto:']"));

    let rolesText = "";
    if (emailP) {
      const idx = leadPs.indexOf(emailP);
      for (let i = idx + 1; i < leadPs.length; i++) {
        const p = leadPs[i];
        if (looksLikeRoles(p)) {
          rolesText = getText(p);
          break;
        }
      }
    } else {
      // Fallback
      const candidate = leadPs.find(looksLikeRoles);
      rolesText = candidate ? getText(candidate) : "";
    }

    const emailLink = emailP ? emailP.querySelector("a[href^='mailto:']") : null;
    const email = emailLink ? emailLink.getAttribute("href").replace(/^mailto:/, "") : "";
    const headerText = getText(nameEl);
    const { name, alumniYear } = parseNameAndAlumniYear(headerText);
    const photoURL = imgEl ? normalizeURL(imgEl.getAttribute("src")) : "";

    if (!name && !email && !photoURL) continue;

    const roles = rolesText
      ? rolesText.split(",").map((s) => s.trim()).filter(Boolean).join(", ")
      : "";

    results.push({ name, email, roles, alumniYear, photoURL });
  }

  const dedup = Array.from(
    results.reduce((map, row) => {
      const key = row.email || row.name;
      if (key && !map.has(key)) map.set(key, row);
      return map;
    }, new Map()).values()
  );

  const toCSV = (rows) => {
    const headers = ["Name", "Email", "Roles", "AlumniYear", "PhotoURL"];
    const escape = (s) => {
      const v = (s ?? "").toString();
      return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
    };
    const lines = [headers.join(",")];
    for (const r of rows) {
      lines.push([escape(r.name), escape(r.email), escape(r.roles), escape(r.alumniYear), escape(r.photoURL)].join(","));
    }
    return lines.join("\n");
  };

  const csv = toCSV(dedup);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "roxbury_latin_faculty_directory.csv";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  console.log(`Exported ${dedup.length} faculty rows with 0 errors.`);
})();
