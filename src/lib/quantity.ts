/**
 * Allowed order quantities: 1, then 10–100 in steps of 10, then 150–500 in steps of 50.
 * Used by every quantity control (cart, product cards, Buy Now) and by the cart store.
 */
export const QTY_STEPS: readonly number[] = [
    1,
    ...Array.from({ length: 10 }, (_, i) => (i + 1) * 10), // 10, 20, … 100
    ...Array.from({ length: 8 }, (_, i) => 150 + i * 50),  // 150, 200, … 500
];

export const MIN_QTY = QTY_STEPS[0];
export const MAX_QTY = QTY_STEPS[QTY_STEPS.length - 1];

/** The allowed quantity closest to n (ties go up); anything invalid becomes the minimum. */
export function snapQty(n: number): number {
    if (!Number.isFinite(n) || n <= MIN_QTY) return MIN_QTY;
    if (n >= MAX_QTY) return MAX_QTY;
    let best = MIN_QTY;
    for (const step of QTY_STEPS) {
        if (Math.abs(step - n) <= Math.abs(best - n)) best = step;
    }
    return best;
}

/** The smallest allowed quantity that is at least n (capped at the maximum). */
export function snapQtyUp(n: number): number {
    return QTY_STEPS.find((step) => step >= n) ?? MAX_QTY;
}

/** Next allowed quantity above the current one (stays at the maximum). */
export function nextQty(current: number): number {
    return QTY_STEPS.find((step) => step > current) ?? MAX_QTY;
}

/** Previous allowed quantity below the current one (stays at the minimum). */
export function prevQty(current: number): number {
    for (let i = QTY_STEPS.length - 1; i >= 0; i--) {
        if (QTY_STEPS[i] < current) return QTY_STEPS[i];
    }
    return MIN_QTY;
}
