import * as THREE from 'three';
import { CSG } from 'three-csg-ts';
import { RoundedBoxGeometry } from 'three/examples/jsm/Addons.js';
import type { IPiece, IPieceToken, TokenSymbol } from './Game';

// ── Token ───────────────────────────────────────────────────
export const TOKEN_COLOR = 0xf2f1eb
export const TOKEN_SIZE = { x: 0.7, y: 0.70, z: 0.35 }
export const TOKEN_RADIUS = 0.10

// Symbols
const USE_HOLLOW_SYMBOLS = true
const PEN_WIDTH = 0.2
const SYMBOL_SCALE = (TOKEN_SIZE.x - TOKEN_RADIUS * 2) * 0.8
export const SYMBOL_CUT_DEPTH = 0.038

// ─── Symbol shapes ────────────────────────────────────────────

export function buildSymbolShape(
    kind: TokenSymbol,
    options: { hollow?: boolean; penWidth?: number; scale?: number } = {}
) {
    const { hollow = USE_HOLLOW_SYMBOLS, penWidth = PEN_WIDTH, scale = SYMBOL_SCALE } = options

    const half = 0.5 * scale
    const pw = penWidth * scale

    function makeShape(points: [number, number][]) {
        const shape = new THREE.Shape()
        shape.moveTo(points[0][0], points[0][1])
        for (let i = 1; i < points.length; i++) shape.lineTo(points[i][0], points[i][1])
        shape.closePath()
        return shape
    }

    function buildTriangle() {
        const outer: [number, number][] = [[0, half], [-half, -half], [half, -half]]
        const shape = makeShape(outer)
        if (!hollow) return shape

        function signedArea(pts: [number, number][]) {
            let area = 0
            for (let i = 0; i < pts.length; i++) {
                const [x1, y1] = pts[i]
                const [x2, y2] = pts[(i + 1) % pts.length]
                area += x1 * y2 - x2 * y1
            }
            return area / 2
        }

        function intersectLines(
            p: [number, number], r: [number, number],
            q: [number, number], s: [number, number]
        ): [number, number] {
            const cross = r[0] * s[1] - r[1] * s[0]
            if (Math.abs(cross) < 1e-8) return p
            const qmp: [number, number] = [q[0] - p[0], q[1] - p[1]]
            const t = (qmp[0] * s[1] - qmp[1] * s[0]) / cross
            return [p[0] + r[0] * t, p[1] + r[1] * t]
        }

        const a = Math.hypot(outer[1][0] - outer[2][0], outer[1][1] - outer[2][1])
        const b = Math.hypot(outer[2][0] - outer[0][0], outer[2][1] - outer[0][1])
        const c = Math.hypot(outer[0][0] - outer[1][0], outer[0][1] - outer[1][1])
        const inradius = Math.abs(signedArea(outer)) / ((a + b + c) / 2)
        const offset = Math.min(pw, inradius * 0.95)
        const ccw = signedArea(outer) > 0

        const lines = outer.map((p1, i) => {
            const p2 = outer[(i + 1) % outer.length]
            const dx = p2[0] - p1[0], dy = p2[1] - p1[1]
            const len = Math.hypot(dx, dy)
            const ux = dx / len, uy = dy / len
            const nx = ccw ? -uy : uy, ny = ccw ? ux : -ux
            return {
                point: [p1[0] + nx * offset, p1[1] + ny * offset] as [number, number],
                dir: [ux, uy] as [number, number],
            }
        })

        const inner: [number, number][] = outer.map((_, i) => {
            const prev = lines[(i - 1 + lines.length) % lines.length]
            const curr = lines[i]
            return intersectLines(prev.point, prev.dir, curr.point, curr.dir)
        })

        shape.holes.push(makeShape([...inner].reverse()))
        return shape
    }

    function buildSquare() {
        const outer: [number, number][] = [[-half, -half], [half, -half], [half, half], [-half, half]]
        const shape = makeShape(outer)
        if (hollow) {
            const inset = half - pw
            shape.holes.push(makeShape([[-inset, -inset], [inset, -inset], [inset, inset], [-inset, inset]]))
        }
        return shape
    }

    function buildCircle() {
        const shape = new THREE.Shape()
        shape.absarc(0, 0, half, 0, Math.PI * 2)
        if (hollow) {
            const hole = new THREE.Path()
            hole.absarc(0, 0, half - pw, 0, Math.PI * 2)
            shape.holes.push(hole)
        }
        return shape
    }

    function buildCross() {
        const p = pw
        return makeShape([
            [-half, -half + p], [-half + p, -half], [0, -p],
            [half - p, -half], [half, -half + p], [p, 0],
            [half, half - p], [half - p, half], [0, p],
            [-half + p, half], [-half, half - p], [-p, 0],
        ])
    }

    switch (kind) {
        case 'TRIANGLE': return buildTriangle()
        case 'SQUARE': return buildSquare()
        case 'CIRCLE': return buildCircle()
        case 'CROSS': return buildCross()
        default: return new THREE.Shape()
    }
}

// ─── Token factory ────────────────────────────────────────────
export type TokenGeometryCache = Map<TokenSymbol, { carvedGeometry: THREE.BufferGeometry; inlayGeometry: THREE.BufferGeometry }>

export interface TokenOrigin {
    piece: IPiece
    tile: IPieceToken
}

export type TokenLocation = 'mat-unplayed' | 'board' | 'mat-played'

const symbolColorByKind: Record<TokenSymbol, number> = {
    TRIANGLE: 0xc9a227,
    CROSS: 0x4f9d3a,
    SQUARE: 0x3d74b7,
    CIRCLE: 0xcf4b39,
}

const tokenGeometryCache: TokenGeometryCache = new Map();

/**
 * Token - Persistent game object that represents a placed token on the board.
 * Created once and reused throughout the game, changing parents but not being destroyed.
 */
export class Token {
    readonly originSymbol: TokenSymbol
    readonly mesh: THREE.Mesh
    originPiece: IPiece | null
    originTile: IPieceToken | null
    location: TokenLocation

    constructor(
        readonly kind: TokenSymbol,
        disposables: Array<THREE.BufferGeometry | THREE.Material>,
        origin?: TokenOrigin
    ) {
        this.originSymbol = kind
        this.mesh = Token._createMesh(kind, disposables)
        this.originPiece = origin?.piece ?? null
        this.originTile = origin?.tile ?? null
        this.location = 'mat-unplayed'
    }

    bindOrigin(piece: IPiece, tile: IPieceToken) {
        this.originPiece = piece
        this.originTile = tile
    }

    setLocation(location: TokenLocation) {
        this.location = location
    }

    private static _createMesh(
        kind: TokenSymbol,
        disposables: Array<THREE.BufferGeometry | THREE.Material>
    ): THREE.Mesh {
        let symbolColor = symbolColorByKind[kind];
        let cached = tokenGeometryCache.get(kind);

        if (!cached) {
            const tokenGeometry = new RoundedBoxGeometry(TOKEN_SIZE.x, TOKEN_SIZE.y, TOKEN_SIZE.z, 8, TOKEN_RADIUS);
            const csgTokenMaterial = new THREE.MeshBasicMaterial();
            const shape = buildSymbolShape(kind);

            const cutterDepth = SYMBOL_CUT_DEPTH + 0.02
            const cutterGeometry = new THREE.ExtrudeGeometry(shape, { depth: cutterDepth, bevelEnabled: false });
            cutterGeometry.center();
            const cutterMaterial = new THREE.MeshBasicMaterial();
            const cutterMesh = new THREE.Mesh(cutterGeometry, cutterMaterial);
            const cutterTopZ = TOKEN_SIZE.z / 2 + 0.001
            cutterMesh.position.z = cutterTopZ - cutterDepth / 2

            const tokenMesh = new THREE.Mesh(tokenGeometry, csgTokenMaterial);
            tokenMesh.updateMatrix();
            cutterMesh.updateMatrix();
            const carvedMesh = CSG.subtract(tokenMesh, cutterMesh) as THREE.Mesh;

            const inlayGeometry = new THREE.ExtrudeGeometry(shape, { depth: 0.003, bevelEnabled: false });
            inlayGeometry.center();

            cached = { carvedGeometry: carvedMesh.geometry, inlayGeometry };
            tokenGeometryCache.set(kind, cached);
            disposables.push(tokenGeometry, csgTokenMaterial, cutterGeometry, cutterMaterial, cached.carvedGeometry, cached.inlayGeometry);
        }

        const tokenMaterial = new THREE.MeshPhysicalMaterial({
            color: TOKEN_COLOR, metalness: 0.08, roughness: 0.12,
            clearcoat: 1, clearcoatRoughness: 0.05,
            thickness: 0.75, ior: 1.45, reflectivity: 1, envMapIntensity: 1.35,
        });
        disposables.push(tokenMaterial);

        const mesh = new THREE.Mesh(cached.carvedGeometry, tokenMaterial);
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const inlayMaterial = new THREE.MeshPhysicalMaterial({
            color: symbolColor, metalness: 0.35, roughness: 0.18,
            clearcoat: 0.9, clearcoatRoughness: 0.1, envMapIntensity: 1.35,
        });
        disposables.push(inlayMaterial);

        const inlayMesh = new THREE.Mesh(cached.inlayGeometry, inlayMaterial);
        inlayMesh.position.z = TOKEN_SIZE.z / 2 - SYMBOL_CUT_DEPTH + 0.01;
        mesh.add(inlayMesh);

        return mesh;
    }

    /**
     * Attach this token to a parent (board, piece, zone, etc).
     */
    attachTo(parent: THREE.Object3D) {
        if (this.mesh.parent && this.mesh.parent !== parent) {
            this.mesh.parent.remove(this.mesh)
        }
        parent.add(this.mesh)
    }

    /**
     * Set local position relative to parent.
     */
    setLocalPosition(x: number, y: number, z: number) {
        this.mesh.position.set(x, y, z)
    }

    /**
     * Get reference to mesh for Three.js scene operations.
     */
    getMesh(): THREE.Mesh {
        return this.mesh
    }

    userData = { type: 'token' };
}

