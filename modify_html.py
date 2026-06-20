import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove products that do not have an image
# Find all product cards
pattern_card = re.compile(r'(<article class="product-card"[\s\S]*?</article>)')
cards = pattern_card.findall(html)

for card in cards:
    if '<img src=' not in card:
        html = html.replace(card, '')

# 2. Add the new products
new_products = [
    {"filename": "1.jpeg", "name": "Caramel Custard", "category": "dessert", "cat_display": "Dessert", "price": "120"},
    {"filename": "2.jpeg", "name": "Amul Fresh Paneer", "category": "paneer", "cat_display": "Paneer", "price": "85"},
    {"filename": "21.jpeg", "name": "Mango Lassi", "category": "lassi", "cat_display": "Lassi", "price": "60"},
    {"filename": "4.jpeg", "name": "Madhusudan Dahi Magic", "category": "dahi", "cat_display": "Dahi", "price": "30"},
    {"filename": "b3074d6f-ac69-483e-b9d6-aee7554a5874.jpeg", "name": "Assorted Cookies", "category": "dessert", "cat_display": "Bakery", "price": "200"},
    {"filename": "download (6).jpeg", "name": "Rasmalai Cake", "category": "dessert", "cat_display": "Cake", "price": "450"},
    {"filename": "milk.jpeg", "name": "Amul Gold Milk", "category": "milk", "cat_display": "Milk", "price": "33"}
]

new_html = ""
for p in new_products:
    new_html += f"""
                    <article class="product-card" data-category="{p['category']}">
                        <div class="product-card__media">
                            <img src="assets/images/{p['filename']}" alt="{p['name']}" class="product-card__img">
                        </div>
                        <div class="product-card__body">
                            <span class="product-card__cat">{p['cat_display']}</span>
                            <h3 class="product-card__name">{p['name']}</h3>
                            <div class="product-card__rating">
                                <span class="stars">★★★★★</span>
                                <span class="rating-count">(100)</span>
                            </div>
                            <div class="product-card__footer">
                                <span class="product-card__price">₹{p['price']}</span>
                            </div>
                        </div>
                    </article>
"""

target = '<div class="products__grid" id="productsGrid">'
idx = html.find(target)
if idx != -1:
    idx += len(target)
    html = html[:idx] + new_html + html[idx:]

# 3. Remove Get in Touch section
# Look for <section id="contact"> ... </section>
html = re.sub(r'<section\s+[^>]*id="contact"[^>]*>[\s\S]*?</section>', '', html)

# 4. Remove social icons
# Look for <ul class="footer__socials"> or similar
html = re.sub(r'<ul\s+class="[^"]*social[^"]*"[\s\S]*?</ul>', '', html)
html = re.sub(r'<div\s+class="[^"]*social[^"]*"[\s\S]*?</div>', '', html)
html = re.sub(r'<a\s+href="[^"]*instagram[^"]*"[\s\S]*?</a>', '', html)
html = re.sub(r'<a\s+href="[^"]*youtube[^"]*"[\s\S]*?</a>', '', html)
html = re.sub(r'<a\s+href="[^"]*facebook[^"]*"[\s\S]*?</a>', '', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("HTML modified successfully.")
