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
    private scoreCanvas: HTMLCanvasElement
    private scoreCtx: CanvasRenderingContext2D
    private scoreTexture: THREE.CanvasTexture
    private scoreSprite: THREE.Sprite
    private deltaCanvas: HTMLCanvasElement
    private deltaCtx: CanvasRenderingContext2D
    private deltaTexture: THREE.CanvasTexture
    private deltaSprite: THREE.Sprite
    private deltaLifeRemaining = 0

    constructor(scene: Scene3D) {
        super(scene)
        const scoreHud = this.createHudSprite(512, 128, 2.2, 0.5)
        this.scoreCanvas = scoreHud.canvas
        this.scoreCtx = scoreHud.ctx
        this.scoreTexture = scoreHud.texture
        this.scoreSprite = scoreHud.sprite

        const deltaHud = this.createHudSprite(512, 128, 1.6, 0.42)
        this.deltaCanvas = deltaHud.canvas
        this.deltaCtx = deltaHud.ctx
        this.deltaTexture = deltaHud.texture
        this.deltaSprite = deltaHud.sprite

        this.addToScene()
        this.snapTo({ x: -2.8, y: 3.25, z: 0.9 })
    }

    protected override _onPositionChanged() {
        this.group.position.set(this.position.x, this.position.y, this.position.z)
    }

    updateScore(total: number, previousTotal: number) {
        this.drawHudText(this.scoreCtx, this.scoreCanvas, this.scoreTexture, `SCORE ${total}`, '#f8fafc')
        const delta = total - previousTotal
        if (delta === 0) {
            this.deltaLifeRemaining = 0
            this.deltaSprite.visible = false
            return
        }

        const deltaText = delta > 0 ? `+${delta}` : `${delta}`
        const color = delta > 0 ? '#34d399' : '#fb7185'
        this.drawHudText(this.deltaCtx, this.deltaCanvas, this.deltaTexture, deltaText, color)
        this.deltaLifeRemaining = HUD_DELTA_LIFETIME
        this.deltaSprite.visible = true
        this.deltaSprite.position.set(HUD_DELTA_POS.x, HUD_DELTA_POS.y, HUD_DELTA_POS.z)
        const material = this.deltaSprite.material as THREE.SpriteMaterial
        material.opacity = 1
    }

    setScoreEmphasisProgress(progress: number | null) {
        if (progress === null) {
            this.scoreSprite.scale.set(SCORE_BASE_SIZE.w, SCORE_BASE_SIZE.h, 1)
            return
        }
        const t = Math.min(1, Math.max(0, progress))
        const pulse = Math.sin(Math.PI * t)
        const scale = 1 + (SCORE_EMPHASIS_SCALE - 1) * pulse
        this.scoreSprite.scale.set(SCORE_BASE_SIZE.w * scale, SCORE_BASE_SIZE.h * scale, 1)
    }

    tick(dt: number) {
        if (this.deltaLifeRemaining <= 0) return
        this.deltaLifeRemaining = Math.max(0, this.deltaLifeRemaining - dt)
        const t = 1 - this.deltaLifeRemaining / HUD_DELTA_LIFETIME
        this.deltaSprite.position.y = HUD_DELTA_POS.y + t * 0.28
        const material = this.deltaSprite.material as THREE.SpriteMaterial
        material.opacity = 1 - t
        if (this.deltaLifeRemaining <= 0) {
            this.deltaSprite.visible = false
        }
    }

    dispose() {
        this.scene.threeScene.remove(this.group)
            ; (this.scoreSprite.material as THREE.SpriteMaterial).dispose()
            ; (this.deltaSprite.material as THREE.SpriteMaterial).dispose()
        this.scoreTexture.dispose()
        this.deltaTexture.dispose()
    }

    setOrigin(x: number, y: number, z: number) {
        this.snapTo({ x, y, z })
    }

    private createHudSprite(width: number, height: number, worldWidth: number, worldHeight: number) {
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('Failed to create 2D context for HUD sprite')
        const texture = new THREE.CanvasTexture(canvas)
        texture.colorSpace = THREE.SRGBColorSpace
        texture.needsUpdate = true
        const material = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            depthTest: false,
            depthWrite: false,
        })
        const sprite = new THREE.Sprite(material)
        sprite.scale.set(worldWidth, worldHeight, 1)
        return { canvas, ctx, texture, sprite }
    }

    private drawHudText(
        ctx: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement,
        texture: THREE.CanvasTexture,
        text: string,
        color: string
    ) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        if (!text) {
            texture.needsUpdate = true
            return
        }
        ctx.fillStyle = 'rgba(8, 18, 32, 0.55)'
        ctx.beginPath()
        const radius = 24
        const x = 12
        const y = 12
        const w = canvas.width - 24
        const h = canvas.height - 24
        ctx.moveTo(x + radius, y)
        ctx.arcTo(x + w, y, x + w, y + h, radius)
        ctx.arcTo(x + w, y + h, x, y + h, radius)
        ctx.arcTo(x, y + h, x, y, radius)
        ctx.arcTo(x, y, x + w, y, radius)
        ctx.closePath()
        ctx.fill()
        ctx.fillStyle = color
        ctx.font = '700 56px "Edu TAS Beginner", sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(text, canvas.width / 2, canvas.height / 2)
        texture.needsUpdate = true
    }

    private addToScene() {
        this.scoreSprite.position.set(HUD_SCORE_POS.x, HUD_SCORE_POS.y, HUD_SCORE_POS.z)
        this.deltaSprite.position.set(HUD_DELTA_POS.x, HUD_DELTA_POS.y, HUD_DELTA_POS.z)
        this.deltaSprite.visible = false
        this.group.add(this.scoreSprite)
        this.group.add(this.deltaSprite)
        this.scene.threeScene.add(this.group)
    }
}
