import test from 'node:test';
import assert from 'node:assert/strict';
import { layOutHomelandMulti } from '../web/layout.js';

const cells = [
    { x: 0, y: 0, w: 8, h: 8 },
    { x: 8, y: 0, w: 8, h: 8 },
    { x: 16, y: 0, w: 8, h: 8 },
    { x: 24, y: 0, w: 8, h: 8 },
];

const pieces = Array.from({ length: 8 }, (_, i) => ({
    members: [{ facility: `Facility ${i + 1}`, x: 0, y: 0, w: 2, h: 2, weight: i + 1 }],
}));

test('multi-storage layout places one real storage in each zone', () => {
    const layout = layOutHomelandMulti(pieces, cells, 2);
    assert.equal(layout.storages.length, 2);
    assert.equal(layout.storageAts.length, 2);
    assert.equal(layout.pieces.length, pieces.length);
    assert.deepEqual(layout.unplaced, []);
    assert.ok(layout.pieces.every(piece => piece.members.length === 1));
    assert.ok(layout.storageAts[0].x < layout.storageAts[1].x);
});

test('storage count is capped by open plot count', () => {
    const layout = layOutHomelandMulti(pieces.slice(0, 2), cells.slice(0, 1), 9);
    assert.equal(layout.storages.length, 1);
});

test('master plan keeps equal-purpose facilities in the same district zone', () => {
    const zoned = [
        ...Array.from({ length: 3 }, (_, i) => ({ district: 'crops', members: [{ facility: `Field ${i}`, x: 0, y: 0, w: 2, h: 2, weight: 1 }] })),
        ...Array.from({ length: 3 }, (_, i) => ({ district: 'production', members: [{ facility: `Factory ${i}`, x: 0, y: 0, w: 2, h: 2, weight: 1 }] })),
    ];
    const layout = layOutHomelandMulti(zoned, cells, 2);
    const side = piece => piece.members[0].x < 16 ? 'left' : 'right';
    assert.equal(new Set(layout.pieces.slice(0, 3).map(side)).size, 1);
    assert.equal(new Set(layout.pieces.slice(3).map(side)).size, 1);
    assert.notEqual(side(layout.pieces[0]), side(layout.pieces[3]));
});
