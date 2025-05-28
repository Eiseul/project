import urllib.request
from bs4 import BeautifulSoup
import re
import cx_Oracle

# ─── Oracle 연결 설정 ───,
dsn = cx_Oracle.makedsn("localhost", 1521, service_name="xe")
conn = cx_Oracle.connect(user="bituser", password="bituser", dsn=dsn, encoding="UTF-8")
cursor = conn.cursor()

# ─── 한 페이지만 크롤링 ───,
url = "https://www.gilbut.co.kr/search/search_book_list"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read()
soup = BeautifulSoup(html, 'html.parser')

# ─── 책 리스트 선택 ───,
book_ul   = soup.find('div', {'id':'book_list'}).find('ul')
book_list = book_ul.find_all('li', {'class':'list_el'})

total_inserted = 0
for book in book_list:
    info  = book.find('div', {'class':'info'})
    title = info.find('span', {'class':'title'}).get_text(strip=True)

    # detail 태그 내부를 \n 구분자로 뽑아서
    detail_text = info.find('span', {'class':'detail'}) \
                      .get_text(separator="\n").strip()
    lines = [l.strip() for l in detail_text.split("\n") if l.strip()]

    if len(lines) < 4:
        print(f"❌ 스킵 (정보부족): {title} -> {lines}")
        continue

    # 4개 필드만 꺼내고 나머지는 무시
    book_price  = lines[0]   # e.g. '￦26,000'
    book_page   = lines[1]   # e.g. '492쪽'
    book_writer = lines[2]   # e.g. '라이언박(박용호)'
    book_date   = lines[3]   # e.g. '2025.07.01'

    # 숫자만 남기기
    price = int(re.sub(r"[^\d]", "", book_price))
    pages = int(re.sub(r"[^\d]", "", book_page))

    # DB에 저장
    cursor.execute("""
        INSERT INTO gilbut_books (title, author, price, pages, pub_date)
        VALUES (:1, :2, :3, :4, :5)
    """, (title, book_writer, price, pages, book_date))
    total_inserted += 1

    print(f"→ 저장: {title} / {book_writer} / {price}원 / {pages}쪽 / {book_date}")

conn.commit()
cursor.close()
conn.close()
print(f"\n✅ 총 {total_inserted}개 도서 저장 완료")
