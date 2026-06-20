# SEO: карта ключевиков для редизайна index.html

Цель: чтобы сайт находили **чайные эстеты / любители gongfu cha и китайско-японской чайной культуры**, **коллекционеры кукол** и **любители (тёмного) фэнтези**.

Принцип: поисковик (и Google Images / Pinterest) ранжирует по **словам, которые физически есть в тексте, заголовках и `alt`**. Атмосферная проза хороша, но рядом с ней должны стоять буквальные поисковые термины. Тексты — на английском (язык сайта).

> Что НЕ нарушаем: без цен/размеров/материалов/доставки/наличия (это на Etsy). «art doll», «tea pet» — это **категории**, а не метаданные магазина → можно.

---

## 1. Tea Pets (полное погружение в чайную тему)

Главные термины (вплетать в заголовок секции + вступительную прозу + alt):
- `tea pet`, `handmade ceramic tea pet`, `tea pet figurine`
- `gongfu tea` / `gongfu cha`, `tea ceremony`, `chaxi` (эстетика чайного стола)
- `tea tray companion`, `tea table figurine`
- `yixing tea pet` (как авторская керамическая альтернатива)
- `Chinese tea ceremony`, `Japanese tea aesthetic`, `wabi-sabi`, `tea lover gift`

Пример вступления к секции:
> *Handmade ceramic tea pets (茶宠) for the gongfu tea ceremony — small clay companions that live on your tea tray and grow richer as you pour tea over them.*

## 2. Art Dolls — mixed-media, НЕ BJD / НЕ Barbie

Это важно: НЕ позиционировать как ball-jointed (BJD) или fashion-кукол — другая аудитория. Наши термины:
- `mixed-media art doll`, `OOAK art doll` (one-of-a-kind), `handmade art doll`
- `poseable` / `soft-body` (мягкое тело на бусинах-шарнирах)
- `animal-headed doll`, `anthropomorphic creature doll` (звериные головы — фирменный признак, часто, но не всегда)
- `collectible art figure`, `figurative sculpture`

Пример вступления:
> *One-of-a-kind mixed-media art dolls — poseable, soft-bodied, often with hand-sculpted animal faces. No molds, no copies.*

## 3. Фэнтези / странное-коллекционное (поверх Art Dolls)

- `dark fantasy art doll`, `fantasy creature sculpture`
- `goblincore`, `folklore creatures`, `fae`, `forest spirit`, `mythical creature`
- `oddities`, `curiosities`
- названия серий как термины: `Bastards of the Fall`, `Urban Misfits`, `Spores`

---

## Чек-лист по элементам страницы (для редизайна)

- [ ] **`<title>`** содержит и «tea pet», и «art doll» (сейчас ок).
- [ ] **H1 / H2 секций** = человеческие термины: «Ceramic Tea Pets», «One-of-a-Kind Art Dolls» (а не только арт-названия).
- [ ] **1–2 строки обычной прозы** во вступлении каждой секции (см. примеры выше).
- [ ] **`alt` у КАЖДОЙ картинки** = имя персонажа + категория. Шаблоны:
  - Tea pet: `"<Name> — handmade ceramic tea pet for gongfu tea ceremony"`
  - Art doll: `"<Name> — one-of-a-kind mixed-media art doll with a hand-sculpted animal face"`
- [ ] **og:image / Pinterest** — чайная и кукольная публика живёт в Pinterest; следить, чтобы og-теги и картинки оставались валидными после редизайна.
- [ ] Не сломать уже добавленные в `<head>` на main: `canonical`, `meta robots`, JSON-LD `keywords`/`knowsAbout`, расширенные description/og/twitter. **При мёрдже редизайна сохранить эти строки.**

## Что уже сделано (на main, в проде)
robots.txt · sitemap.xml · canonical · meta robots · расширенные description/og/twitter · JSON-LD (Organization+Brand, keywords, knowsAbout).

## Хвост вне кода
Google Search Console: верификация домена darksaga.art + отправка sitemap.xml — действие владельца сайта.
