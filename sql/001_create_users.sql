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