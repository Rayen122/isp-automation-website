with open(r'C:\isp\isp-automation-website\brochure-isp.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Inject at end of <style>:
# 1) Blue theme override (replace orange with blue/cyan)
# 2) Contact section redesign
override = """
/* ===== PRINT-READY: edge-to-edge, no borders ===== */
html, body {
  background: white !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
}
.page {
  box-shadow: none !important;
  margin: 0 !important;
  width: 100% !important;
  max-width: none !important;
}

/* ===== BLUE THEME: replace ALL red/orange accents with blue ===== */
:root {
  --orange: #1565c0 !important;
  --brand: #1565c0 !important;
  --brand-dk: #0d47a1 !important;
}
.cover-swoosh {
  background: #1565c0 !important;
}
.cover-swoosh2 {
  background: #0d47a1 !important;
}
.cover-eyebrow { color: #1565c0 !important; }
.cover-eyebrow::before { background: #1565c0 !important; }
.cover-h1 span {
  background: linear-gradient(180deg, #42a5f5 0%, #1565c0 50%, #0d47a1 100%) !important;
  -webkit-background-clip: text !important; background-clip: text !important; color: transparent !important;
}
.cover-badge {
  background: #1565c0 !important;
}
.cover-stats > div { border-top: 2px solid rgba(21,101,192,.45) !important; }
.stat-n { color: #1565c0 !important; }
.cover-desc { border-left: 3px solid #1565c0 !important; }
.items-list li::before { color: #1565c0 !important; }
.intro-wrap {
  border-left: 10px solid #1565c0 !important;
}
.intro-wrap h2 em { color: #1565c0 !important; }
.intro-wrap h2 em::after { background: rgba(21,101,192,.18) !important; }
.page-header { border-bottom: 5px solid #1565c0 !important; }
.page-header::after { background: #1565c0 !important; }
.section-title-bar { border-left: 4px solid #1565c0 !important; }
.section-dot { background: #1565c0 !important; }
.section-title-bar::before { background: #1565c0 !important; }
.section-title-bar::after { background: #1565c0 !important; }
.cta-btn { background: #1565c0 !important; }
.cinfo-icon { background: #1565c0 !important; }
.cinfo-cta { color: #1565c0 !important; }
.page-4-red {
  background: linear-gradient(170deg, #1565c0 0%, #0d47a1 100%) !important;
}
.p4r-eyebrow { color: #1565c0 !important; }
.p4r-eyebrow::before { background: #1565c0 !important; }
.p4r-cta { background: #1565c0 !important; }

/* ===== CONTACT SECTION — FULL REDESIGN ===== */
.contact-new {
  margin: 0 64px !important;
  flex: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
  background: transparent !important;
}
.contact-new-banner {
  padding: 0 !important;
  display: flex !important;
  align-items: stretch !important;
  gap: 0 !important;
  overflow: hidden !important;
  position: relative !important;
  background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%) !important;
  border-radius: 10px 10px 0 0 !important;
}
.contact-new-banner::after { display: none !important; }
.contact-new-logo { display: none !important; }
.contact-new-banner-text {
  background: transparent !important;
  padding: 16px 28px !important;
  flex: 1 !important;
  position: relative !important;
  z-index: 1 !important;
  display: flex !important;
  flex-direction: column !important;
  justify-content: center !important;
}
.contact-new-banner-text::after { display: none !important; }
.contact-new-banner-text h2 {
  font-size: 20px !important;
  color: #ffffff !important;
  margin: 0 0 2px !important;
  font-family: 'Rajdhani', sans-serif !important;
  font-weight: 700 !important;
  letter-spacing: .5px !important;
}
.contact-new-banner-text p {
  color: rgba(255,255,255,.65) !important;
  font-size: 10px !important;
  margin: 0 !important;
  font-family: 'Inter', sans-serif !important;
}
.contact-new-cta {
  background: rgba(255,255,255,.15) !important;
  color: #ffffff !important;
  padding: 0 28px !important;
  display: flex !important;
  align-items: center !important;
  font-family: 'Barlow Condensed', sans-serif !important;
  font-size: 10px !important;
  font-weight: 700 !important;
  letter-spacing: 3px !important;
  text-transform: uppercase !important;
  text-decoration: none !important;
  clip-path: none !important;
  white-space: nowrap !important;
  flex-shrink: 0 !important;
  border: none !important;
  border-left: 1px solid rgba(255,255,255,.2) !important;
}
.contact-new-grid {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 0 !important;
  border: none !important;
  border-top: none !important;
  border-radius: 0 0 10px 10px !important;
  overflow: hidden !important;
  background: #ffffff !important;
}
.contact-new-card {
  padding: 20px 14px 18px !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  text-align: center !important;
  border: none !important;
  border-right: 1px solid #e2e8f0 !important;
  background: #ffffff !important;
}
.contact-new-card:last-child { border-right: none !important; }
.contact-new-icon {
  width: 40px !important;
  height: 40px !important;
  border-radius: 50% !important;
  background: #eef3ff !important;
  color: #1565c0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 16px !important;
  clip-path: none !important;
  margin: 0 auto 8px !important;
  flex-shrink: 0 !important;
  border: 2px solid #d4e2f7 !important;
}
.contact-new-label {
  font-family: 'Barlow Condensed', sans-serif !important;
  font-size: 8px !important;
  letter-spacing: 3px !important;
  font-weight: 700 !important;
  text-transform: uppercase !important;
  color: #1565c0 !important;
  margin-bottom: 5px !important;
  border-bottom: none !important;
  padding-bottom: 0 !important;
  width: 100% !important;
  text-align: center !important;
}
.contact-new-val {
  font-size: 10.5px !important;
  color: #334155 !important;
  font-weight: 500 !important;
  line-height: 1.55 !important;
  font-family: 'Inter', sans-serif !important;
  text-align: center !important;
}
"""

html = html.replace('</style>', override + '\n</style>', 1)
html = html.replace('#e63946', '#1565c0')
html = html.replace('#ff4b56', '#42a5f5')
html = html.replace('rgba(200,32,45,', 'rgba(21,101,192,')

out = r'C:\isp\isp-automation-website\brochure-isp-blue-contact-v2.html'
with open(out, 'w', encoding='utf-8') as f:
    f.write(html)
print(f'Saved: {out}')
