import re

products_data = [
    {"filename": "WhatsApp Image 2026-06-19 at 7.27.21 PM.jpeg", "name": "Sudha Healthy Milk", "category": "milk", "cat_display": "Milk", "price": 50},
    {"filename": "download (1).jpeg", "name": "Tangy Moo Strawberry Kefir", "category": "ice-cream", "cat_display": "Ice Cream", "price": 250},
    {"filename": "download (2).jpeg", "name": "Zyrus Vanilla Ice Cream", "category": "ice-cream", "cat_display": "Ice Cream", "price": 150},
    {"filename": "download (3).jpeg", "name": "India Dairy Ice Cream Cones", "category": "ice-cream", "cat_display": "Ice Cream", "price": 80},
    {"filename": "download (4).jpeg", "name": "Konery Artisan Waffle Cones", "category": "ice-cream", "cat_display": "Ice Cream", "price": 300},
    {"filename": "download (5).jpeg", "name": "Assorted Ice Cream Cups", "category": "ice-cream", "cat_display": "Ice Cream", "price": 120},
    {"filename": "download.jpeg", "name": "Vadilal Strawberry Ice Cream", "category": "ice-cream", "cat_display": "Ice Cream", "price": 180},
    {"filename": "ice-cream-packaging-box.jpg", "name": "Ajanta's Creamito Butterscotch", "category": "ice-cream", "cat_display": "Ice Cream", "price": 220},
    {"filename": "images.jpeg", "name": "Glacé Dulce de Leche Ice Cream", "category": "ice-cream", "cat_display": "Ice Cream", "price": 350}
]

html_products = ""
for p in products_data:
    html_products += f"""
                    <!-- New Product -->
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

with open('index.html', 'r') as f:
    content = f.read()

# find <div class="products__grid" id="productsGrid">
target = '<div class="products__grid" id="productsGrid">'
idx = content.find(target)
if idx != -1:
    idx += len(target)
    content = content[:idx] + html_products + content[idx:]
    with open('index.html', 'w') as f:
        f.write(content)
    print("Products added.")
else:
    print("Target not found.")

