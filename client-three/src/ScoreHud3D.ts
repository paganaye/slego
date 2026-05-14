import * as THREE from 'three'
import { MotionObject } from './MotionObject'
import type { Scene3D } from './Scene3D'

const HUD_SCORE_POS = { x: 0, y: 0, z: 0 }
const HUD_DELTA_POS = { x: 0, y: -0.5, z: 0 }
const HUD_DELTA_LIFETIME = 1.1
const SCORE_EMPHASIS_SCALE = 1.35
const SCORE_BASE_SIZE = { w: 2.2, h: 0.5 }


export class ScoreHud3D extends MotionObject {
    private group = new THREE.Group()
    private deltaCanvas: HTMLCanvasElement
    private deltaCtx: CanvasRenderingContext2D
    private deltaTexture: THREE.CanvasTexture
    private deltaSprite: THREE.Sprite
    private deltaLifeRemaining = 0

    constructor(scene: Scene3D) {
        super(scene)
        const deltaHud = this.createHudSprite(512, 128, 1.6, 0.42)
        this.deltaCanvas = deltaHud.canvas
        this.deltaCtx = deltaHud.ctx
        this.deltaTexture = deltaHud.texture
        this.deltaSprite = deltaHud.sprite

        this.addToScene()
        // No fixed snapTo here; position will be set dynamically for each delta
    }


    protected override _onPositionChanged() {
        this.group.position.set(this.position.x, this.position.y, this.position.z)
    }


    /**
     * Show a score delta (e.g. +10) at a given 3D position.
     * @param delta The score delta to display
     * @param pos 3D position {x, y, z} where the delta should appear (e.g. above the formed line)
     */
    showDelta(delta: number, pos: { x: number, y: number, z: number }) {
        if (delta === 0) {
            this.deltaLifeRemaining = 0;
            this.deltaSprite.visible = false;
            return;
        }
        const deltaText = delta > 0 ? `+${delta}` : `${delta}`;
        const color = delta > 0 ? '#34d399' : '#fb7185';
        this.drawHudText(this.deltaCtx, this.deltaCanvas, this.deltaTexture, deltaText, color);
        this.deltaLifeRemaining = HUD_DELTA_LIFETIME;
        this.deltaSprite.visible = true;
        this.group.position.set(pos.x, pos.y, pos.z);
        this.deltaSprite.position.set(0, 0, 0); // relative to group
        const material = this.deltaSprite.material as THREE.SpriteMaterial;
        material.opacity = 1;
    }


    // setScoreEmphasisProgress removed (no more score sprite)

    tick(dt: number) {
        if (this.deltaLifeRemaining <= 0) return;
        this.deltaLifeRemaining = Math.max(0, this.deltaLifeRemaining - dt);
        const t = 1 - this.deltaLifeRemaining / HUD_DELTA_LIFETIME;
        this.deltaSprite.position.y = t * 0.28; // animate upward from 0
        const material = this.deltaSprite.material as THREE.SpriteMaterial;
        material.opacity = 1 - t;
        if (this.deltaLifeRemaining <= 0) {
            this.deltaSprite.visible = false;
        }
    }

    dispose() {
        this.scene.threeScene.remove(this.group);
        (this.deltaSprite.material as THREE.SpriteMaterial).dispose();
        this.deltaTexture.dispose();
    }

    setOrigin(x: number, y: number, z: number) {
        this.snapTo({ x, y, z });
    }

    private createHudSprite(width: number, height: number, worldWidth: number, worldHeight: number) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to create 2D context for HUD sprite');
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.needsUpdate = true;
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false,
            depthWrite: false,
        });
        const sprite = new THREE.Sprite(material);
        sprite.scale.set(worldWidth, worldHeight, 1);
        return { canvas, ctx, texture, sprite };
    }

    private drawHudText(
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        texture: THREE.CanvasTexture,
        text: string,
        color: string
    ) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!text) {
            texture.needsUpdate = true;
            return;
        }
        ctx.fillStyle = 'rgba(8, 18, 32, 0.55)';
        ctx.beginPath();
        const radius = 24;
        const x = 12;
        const y = 12;
        const w = canvas.width - 24;
        const h = canvas.height - 24;
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + w, y, x + w, y + h, radius);
        ctx.arcTo(x + w, y + h, x, y + h, radius);
        ctx.arcTo(x, y + h, x, y, radius);
        ctx.arcTo(x, y, x + w, y, radius);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = color;
        ctx.font = '700 56px "Edu TAS Beginner", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);
        texture.needsUpdate = true;
    }

    private addToScene() {
        this.deltaSprite.position.set(0, 0, 0);
        this.deltaSprite.visible = false;
        this.group.add(this.deltaSprite);
        this.scene.threeScene.add(this.group);
    }
}
