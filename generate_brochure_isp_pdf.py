import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

async def main():
    html_path = Path(__file__).parent / "brochure-isp.html"
    pdf_path = Path(__file__).parent / "ISP-Automation-Brochure-2026.pdf"

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 794, "height": 1123})
        await page.goto(f"file:///{html_path.as_posix()}", wait_until="networkidle")
        await page.wait_for_timeout(3000)
        await page.emulate_media(media="screen")

        # Remove any page-break rules and let content flow naturally
        await page.evaluate("""() => {
            const style = document.createElement('style');
            style.textContent = `
                .cover { page-break-after: auto !important; }
                .section-block { page-break-inside: avoid !important; }
                .brands-bar { page-break-inside: avoid !important; }
                .intro-wrap { page-break-inside: avoid !important; }
                .page-header { page-break-after: avoid !important; }
            `;
            document.head.appendChild(style);
        }""")

        await page.wait_for_timeout(500)
        total = await page.evaluate("document.querySelector('.page').scrollHeight")
        print(f"Height: {total}px ({total / 1123:.2f} pages)")

        await page.pdf(
            path=str(pdf_path),
            width="794px",
            height="1123px",
            print_background=True,
            display_header_footer=False,
            margin={
                "top": "0",
                "right": "0",
                "bottom": "0",
                "left": "0"
            },
        )

        await browser.close()
    print(f"PDF: {pdf_path} ({pdf_path.stat().st_size / 1024:.0f} KB)")

asyncio.run(main())
