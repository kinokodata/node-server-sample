-- 気象データテーブルの作成
CREATE TABLE daily_weather (
    date DATE PRIMARY KEY,
    weather_condition VARCHAR(20),
    max_temperature DECIMAL(4,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);