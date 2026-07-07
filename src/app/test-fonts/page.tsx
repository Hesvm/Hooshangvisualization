const weights = [
  { label: "Regular 400", weight: 400 },
  { label: "Medium 500", weight: 500 },
  { label: "SemiBold 600", weight: 600 },
  { label: "Bold 700", weight: 700 },
];

export default function TestFontsPage() {
  return (
    <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 24 }}>
      <h1 style={{ fontWeight: 700, fontSize: 24 }}>تست فونت راوی</h1>

      {weights.map((w) => (
        <div key={w.weight} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={{ fontSize: 12, color: "#78716c" }}>{w.label}</span>
          <p style={{ fontWeight: w.weight, fontSize: 29, lineHeight: "36px", margin: 0 }}>
            صبح بخیر حسام! چطوری میتونم کمکت کنم؟
          </p>
          <p style={{ fontWeight: w.weight, fontSize: 18, lineHeight: "28px", margin: 0 }}>
            قیمت <bdi className="ltr-isolate">128,000</bdi> تومان — سطح{" "}
            <bdi className="ltr-isolate">HbA1c</bdi> برابر <bdi className="ltr-isolate">5.4%</bdi>{" "}
            و ضربان <bdi className="ltr-isolate">72 bpm</bdi> — مدل{" "}
            <bdi className="ltr-isolate">iPhone 15 Pro</bdi>
          </p>
        </div>
      ))}
    </div>
  );
}
