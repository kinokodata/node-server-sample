-- カテゴリテーブルの作成
CREATE TABLE product_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT
);

-- 商品テーブルの作成
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category_id INTEGER REFERENCES product_categories(id),
    base_price INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 日次売上テーブルの作成
CREATE TABLE daily_sales (
    id SERIAL PRIMARY KEY,
    sale_date DATE NOT NULL,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    total_amount INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- カテゴリのサンプルデータ
INSERT INTO product_categories (name, description) VALUES
    ('アイスクリーム・氷菓', '冷たいデザート類'),
    ('惣菜', '調理済み食品'),
    ('野菜', '生鮮野菜'),
    ('精肉', '生鮮肉類'),
    ('飲料', '清涼飲料水'),
    ('インスタント食品', 'すぐに食べられる加工食品');

-- 商品のサンプルデータ
INSERT INTO products (name, category_id, base_price) VALUES
    ('バニラアイス', 1, 280),
    ('チョコアイス', 1, 280),
    ('かき氷（いちご）', 1, 320),
    ('かき氷（抹茶）', 1, 320),
    ('コロッケ', 2, 120),
    ('唐揚げ', 2, 380),
    ('ポテトサラダ', 2, 250),
    ('キャベツ', 3, 180),
    ('トマト', 3, 280),
    ('きゅうり', 3, 150),
    ('豚肉細切れ', 4, 380),
    ('鶏むね肉', 4, 280),
    ('牛バラ肉', 4, 580),
    ('炭酸飲料500ml', 5, 150),
    ('スポーツドリンク500ml', 5, 180),
    ('カップラーメン', 6, 180);