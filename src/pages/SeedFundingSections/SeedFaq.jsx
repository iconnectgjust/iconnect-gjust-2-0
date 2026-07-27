import { useState } from "react";
import "./SeedFaq.css";
import data from "../../data/faqs.json";

function SeedFaq() {
  const [open, setOpen] = useState(0);

  // FAQPage structured data → Google can show these Q&As directly in search results
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faqs.map((f) => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };

  return (
    <section className="seedfaq" id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <h2 className="seedfaq-heading">Frequently Asked Questions</h2>
      <div className="seedfaq-list">
        {data.faqs.map((f, idx) => (
          <div className={`seedfaq-item ${open === idx ? "seedfaq-open" : ""}`} key={idx}>
            <button
              className="seedfaq-q"
              onClick={() => setOpen(open === idx ? null : idx)}
              aria-expanded={open === idx}
            >
              <span>{f.q}</span>
              <i className={`bx ${open === idx ? "bx-minus" : "bx-plus"}`}></i>
            </button>
            <div className="seedfaq-a">
              <p>{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SeedFaq;
