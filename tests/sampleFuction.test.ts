import { add } from '../src/sampleFunction';

describe('add関数のテスト', () => {
    test('正の数の足し算', () => {
        expect(add(2, 3)).toBe(5);
    });

    test('負の数の足し算', () => {
        expect(add(-1, -2)).toBe(-3);
    });

    test('正と負の数の足し算', () => {
        expect(add(-1, 1)).toBe(0);
    });

    test('0を含む足し算', () => {
        expect(add(0, 1)).toBe(1);
        expect(add(1, 0)).toBe(1);
        expect(add(0, 0)).toBe(0);
    });
});