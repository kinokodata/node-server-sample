-- ユーザーテーブルの作成
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- ユーザーデータ
INSERT INTO users (name) VALUES
    ('山田太郎'),
    ('佐藤花子'),
    ('鈴木一郎');

-- 気象データテーブルの作成
CREATE TABLE daily_weather (
    date DATE PRIMARY KEY,
    weather_condition VARCHAR(20),
    max_temperature DECIMAL(4,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

-- 日次売上データの生成関数
CREATE OR REPLACE FUNCTION generate_daily_sales(start_date DATE, end_date DATE) RETURNS void AS $$
DECLARE
curr_date DATE;
    product RECORD;
    base_quantity INTEGER;
    temp_factor DECIMAL;
    weather TEXT;
    max_temp DECIMAL;
    year_offset DECIMAL;
BEGIN
    curr_date := start_date;
    
    WHILE curr_date <= end_date LOOP
        -- 年度による気温の微調整（年ごとの気候の違いを表現）
        year_offset :=
            CASE
                WHEN EXTRACT(YEAR FROM curr_date) = 2023 THEN 0.5  -- 2023年は少し暑め
                ELSE -0.5  -- 2024年は少し涼しめ
END;

        -- 気温の設定（4月から11月の一般的な気温曲線をシミュレート）
        max_temp :=
            CASE
                WHEN EXTRACT(MONTH FROM curr_date) = 4 THEN 15 + (RANDOM() * 10) + year_offset
                WHEN EXTRACT(MONTH FROM curr_date) = 5 THEN 20 + (RANDOM() * 8) + year_offset
                WHEN EXTRACT(MONTH FROM curr_date) = 6 THEN 23 + (RANDOM() * 7) + year_offset
                WHEN EXTRACT(MONTH FROM curr_date) = 7 THEN 28 + (RANDOM() * 8) + year_offset
                WHEN EXTRACT(MONTH FROM curr_date) = 8 THEN 30 + (RANDOM() * 8) + year_offset
                WHEN EXTRACT(MONTH FROM curr_date) = 9 THEN 25 + (RANDOM() * 7) + year_offset
                WHEN EXTRACT(MONTH FROM curr_date) = 10 THEN 20 + (RANDOM() * 7) + year_offset
                WHEN EXTRACT(MONTH FROM curr_date) = 11 THEN 15 + (RANDOM() * 7) + year_offset
                ELSE 10 + (RANDOM() * 5) + year_offset
END;

        -- 天候の設定（簡易的）
        weather :=
            CASE
                WHEN RANDOM() < 0.7 THEN '晴れ'
                WHEN RANDOM() < 0.9 THEN '曇り'
                ELSE '雨'
END;

        -- 気象データの挿入
INSERT INTO daily_weather (date, weather_condition, max_temperature)
VALUES (curr_date, weather, max_temp);

-- 各商品の売上データを生成
FOR product IN SELECT * FROM products LOOP
    -- 基本の販売数量（ランダム要素を含む）
    base_quantity := 10 + (RANDOM() * 20)::INTEGER;

-- 土日は基本数量を増やす
IF EXTRACT(DOW FROM curr_date) IN (0, 6) THEN
                base_quantity := base_quantity * 1.5;
END IF;

            -- カテゴリに応じた数量調整
CASE
                -- アイスクリーム・かき氷は気温の影響を強く受ける
                WHEN product.category_id = 1 THEN
                    IF max_temp >= 25 THEN
                        -- 気温が25度を超えると売上増加
                        temp_factor := 1 + ((max_temp - 25) * 0.2);
                        -- かき氷は32度以上でより人気
                        IF product.name LIKE '%かき氷%' AND max_temp >= 32 THEN
                            temp_factor := temp_factor * 1.5;
END IF;
                        base_quantity := (base_quantity * temp_factor)::INTEGER;
ELSE
                        -- 気温が低いと売上減少
                        base_quantity := (base_quantity * 0.5)::INTEGER;
END IF;

                -- コロッケは雨の日に売れる傾向
WHEN product.name = 'コロッケ' AND weather = '雨' THEN
                    base_quantity := (base_quantity * 1.5)::INTEGER;

                -- 飲料は気温が高いと売れる
WHEN product.category_id = 5 AND max_temp >= 25 THEN
                    temp_factor := 1 + ((max_temp - 25) * 0.1);
                    base_quantity := (base_quantity * temp_factor)::INTEGER;

ELSE
                    -- その他の商品は基本数量のまま
                    base_quantity := base_quantity;
END CASE;

            -- 売上データの挿入
            IF base_quantity > 0 THEN
                INSERT INTO daily_sales
                    (sale_date, product_id, quantity, total_amount)
                VALUES
                    (curr_date, product.id, base_quantity::INTEGER,
                     (base_quantity * product.base_price)::INTEGER);
END IF;
END LOOP;

        curr_date := curr_date + 1;
END LOOP;
END;
$$ LANGUAGE plpgsql;

-- 2023年4月1日から2024年11月30日までのサンプルデータを生成
SELECT generate_daily_sales('2023-04-01', '2024-11-30');