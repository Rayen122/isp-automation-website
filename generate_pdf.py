import asyncio
from pathlib import Path
from playwright.async_api import async_playwright

async def main():
    html_path = Path(__file__).parent / "brochure.html"
    pdf_path = Path(__file__).parent / "brochure.pdf"

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(f"file:///{html_path.as_posix()}", wait_until="networkidle")
        await page.wait_for_timeout(2000)
        await page.pdf(
            path=str(pdf_path),
            format="A4",
            print_background=True,
            margin={"top": "0", "right": "0", "bottom": "0", "left": "0"},
        )
        await browser.close()
    print(f"PDF généré : {pdf_path}")

asyncio.run(main())
