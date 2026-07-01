import asyncio
from pathlib import Path
import fitz
from playwright.async_api import async_playwright

async def main():
    html_path = Path(r'C:\isp\isp-automation-website\brochure-isp-blue-contact-v2.html')
    tmp_pdf = r'C:\isp\isp-automation-website\_tmp_letter.pdf'
    out_pdf = r'C:\isp\isp-automation-website\Isp-automatio blue A4.pdf'

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 794, 'height': 1123})
        await page.goto(f'file:///{html_path.as_posix()}', wait_until='networkidle')
        await page.wait_for_timeout(3000)
        await page.emulate_media(media='screen')
        await page.pdf(
            path=tmp_pdf,
            width='794px',
            height='1123px',
            print_background=True,
            display_header_footer=False,
            margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'},
        )
        await browser.close()

    src = fitz.open(tmp_pdf)
    dst = fitz.open()
    A4_W, A4_H = 595.28, 841.89
    for pg in src:
        new_pg = dst.new_page(width=A4_W, height=A4_H)
        new_pg.show_pdf_page(fitz.Rect(0, 0, A4_W, A4_H), src, pg.number)
    dst.save(out_pdf)
    dst.close()
    src.close()

    import os
    os.remove(tmp_pdf)

    doc = fitz.open(out_pdf)
    print(f'Pages: {len(doc)}, Size: {doc[0].rect.width:.1f}x{doc[0].rect.height:.1f} pts')
    doc[-1].get_pixmap(dpi=180, clip=fitz.Rect(0, doc[-1].rect.height * 0.55, doc[-1].rect.width, doc[-1].rect.height)).save(r'C:\isp\isp-automation-website\preview-blue-contact-final.png')
    doc.close()
    print(f'Done: {out_pdf}')

asyncio.run(main())
