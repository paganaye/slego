import { createEffect, createSignal, For, onMount } from 'solid-js'
import { ZZFX, zzfx } from 'zzfx'
import {
    DefaultSounds,
    buildMergedSounds,
    loadSoundOverrides,
    saveSoundOverrides,
    soundNames,
    type SoundName,
    type SoundOverrides,
    type ZzfxParams,
    ZzfxParam,
} from './sounds'
import './SoundDesigner.css'


type ParamSpec = {
    key: string
    index: number
    group: string
    min: number
    max: number
    step: number
    valueScale?: number
    unit?: string
    color?: string
}

type ParamGroup = typeof paramSpecs[number]['group'];

const paramSpecs: ParamSpec[] = [
    { key: 'frequency', index: ZzfxParam.frequency, group: 'Frequency', min: 20, max: 4000, step: 10 },
    { key: 'randomness', index: ZzfxParam.randomness, group: 'Frequency', min: 0, max: 100, step: 1, valueScale: 100, unit: '%' },
    { key: 'slide', index: ZzfxParam.slide, group: 'Slide', min: -1, max: 1, step: 0.01 },
    { key: 'deltaSlide', index: ZzfxParam.deltaSlide, group: 'Slide', min: -1, max: 1, step: 0.01 },
    { key: 'pitchJump', index: ZzfxParam.pitchJump, group: 'Pitch', min: 0, max: 1, step: 0.01 },
    { key: 'pitchJumpTime', index: ZzfxParam.pitchJumpTime, group: 'Pitch', min: 0, max: 1, step: 0.01 },

    { key: 'volume', index: ZzfxParam.volume, group: 'Amplitude', min: 0, max: 1, step: 0.01, color: 'hsl(35, 85%, 55%)' },
    { key: 'sustainVolume', index: ZzfxParam.sustainVolume, group: 'Amplitude', min: 0, max: 1, step: 0.01, color: 'hsl(130, 75%, 50%)' },

    { key: 'delay', index: ZzfxParam.delay, group: 'Duration', min: 0, max: 0.5, step: 0.01, color: 'hsl(0, 80%, 55%)' },
    { key: 'attack', index: ZzfxParam.attack, group: 'Duration', min: 0, max: 1, step: 0.01, color: 'hsl(35, 85%, 55%)' },
    { key: 'decay', index: ZzfxParam.decay, group: 'Duration', min: 0, max: 1, step: 0.01, color: 'hsl(60, 90%, 55%)' },
    { key: 'sustain', index: ZzfxParam.sustain, group: 'Duration', min: 0, max: 1, step: 0.01, color: 'hsl(130, 75%, 50%)' },
    { key: 'release', index: ZzfxParam.release, group: 'Duration', min: 0, max: 0.5, step: 0.01, color: 'hsl(210, 80%, 55%)' },
    { key: 'repeatTime', index: ZzfxParam.repeatTime, group: 'Duration', min: 0, max: 1, step: 0.01, color: 'hsl(280, 80%, 55%)' },

    { key: 'shape', index: ZzfxParam.shape, group: 'Timbre', min: 0, max: 5, step: 1, color: 'hsl(295, 80%, 60%)' },
    { key: 'shapeCurve', index: ZzfxParam.shapeCurve, group: 'Timbre', min: 0, max: 2, step: 0.1, color: 'hsl(332, 80%, 60%)' },
    { key: 'modulation', index: ZzfxParam.modulation, group: 'Timbre', min: 0, max: 50, step: 0.1, color: 'hsl(165, 75%, 48%)' },

    { key: 'bitCrush', index: ZzfxParam.bitCrush, group: 'Post processing', min: 0, max: 1, step: 0.01, color: 'hsl(45, 80%, 58%)' },
    { key: 'noise', index: ZzfxParam.noise, group: 'Post processing', min: 0, max: 1, step: 0.01, color: 'hsl(18, 85%, 58%)' },
    { key: 'tremolo', index: ZzfxParam.tremolo, group: 'Post processing', min: 0, max: 1, step: 0.01, color: 'hsl(260, 80%, 58%)' },
    { key: 'filter', index: ZzfxParam.filter, group: 'Post processing', min: -1, max: 1, step: 0.01, color: 'hsl(205, 80%, 58%)' },
]

// Utility to check if a slider is neutral-centered
function isNeutralCentered(spec: ParamSpec) {
    return spec.min === -1 && spec.max === 1
}

// Custom CSS for center mark
const centerMarkStyle = {
    position: 'absolute',
    top: '25px',
    left: '50%',
    width: '2px',
    height: '20px',
    background: 'rgba(255,255,255,0.5)',
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    zIndex: 2,
} as const

const paramColorByKey = Object.fromEntries(
    paramSpecs
        .filter(spec => spec.color)
        .map(spec => [spec.key, spec.color]),
) as Record<string, string>


const columns: Array<{ id: string; groups: ParamGroup[] }> = [
    { id: 'col-1', groups: ['Frequency', 'Slide', 'Pitch'] },
    { id: 'col-2', groups: ['Amplitude', 'Duration'] },
    { id: 'col-4', groups: ['Timbre', 'Post processing'] },
]

// Build groupsByName from columns, ensuring only used groups are included and in the right order
const groupsByName = (() => {
    const allGroups = columns.flatMap(col => col.groups)
    const uniqueGroups = Array.from(new Set(allGroups))
    return Object.fromEntries(
        uniqueGroups.map(group => [
            group,
            {
                group,
                items: paramSpecs.filter(spec => spec.group === group),
            },
        ]),
    ) as Record<ParamGroup, { group: ParamGroup; items: ParamSpec[] }>
})()

const defaultParams: ZzfxParams = [0.3, 0.1, 500, 0.01, 0.05, 0.1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.15, 0, 0, 0];

const WAVE_SHAPES = ['sine', 'triangle', 'sawtooth', 'tan', 'noise', 'square duty'] as const
const PREVIEW_POINTS = 256

const cloneParams = (value: ReadonlyArray<number>): ZzfxParams => [...value] as ZzfxParams

const formatNumber = (value: number) => {
    if (Number.isInteger(value)) return value.toString()
    return value.toFixed(3).replace(/0+$/u, '').replace(/\.$/u, '')
}

const toDisplayValue = (spec: ParamSpec, params: ZzfxParams) => {
    const value = params[spec.index]
    if (spec.valueScale) return value * spec.valueScale
    return value
}

const toStoredValue = (spec: ParamSpec, displayedValue: number) => {
    if (spec.valueScale) return displayedValue / spec.valueScale
    return displayedValue
}

const formatParamValue = (spec: ParamSpec, params: ZzfxParams) => {
    const displayValue = toDisplayValue(spec, params)
    const formatted = formatNumber(displayValue)
    return spec.unit ? `${formatted}${spec.unit}` : formatted
}

const toSoundsObjectText = (overrides: SoundOverrides) => {
    const merged = buildMergedSounds(overrides)
    const lines = soundNames.map(name => {
        const entry = merged[name]
        const params = entry.zzfx.map(formatNumber).join(', ')
        return `    ${name}: { type: '${entry.type}', zzfx: [${params}] },`
    })
    return `export const DefaultSounds = {\n${lines.join('\n')}\n} as const\n`
}

// Helper: generate minimal timbre params from zero, only timbre/post-processing columns
const getTimbreShortParams = (current: ZzfxParams): ZzfxParams => {
    const short: ZzfxParams = [0, 0, 0, 0, 0.05, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
    short[ZzfxParam.frequency] = 50;
    short[ZzfxParam.volume] = 0.4;
    short[ZzfxParam.sustainVolume] = current[ZzfxParam.sustainVolume]
    // Timbre column: shape, shapeCurve, modulation, noise, filter, bitCrush, tremolo
    short[ZzfxParam.shape] = current[ZzfxParam.shape]
    short[ZzfxParam.shapeCurve] = current[ZzfxParam.shapeCurve]
    short[ZzfxParam.noise] = current[ZzfxParam.noise]
    short[ZzfxParam.modulation] = current[ZzfxParam.modulation]
    short[ZzfxParam.bitCrush] = current[ZzfxParam.bitCrush]
    short[ZzfxParam.tremolo] = current[ZzfxParam.tremolo]
    short[ZzfxParam.filter] = current[ZzfxParam.filter]
    return short
}

// Helper: draw samples to canvas (reusable drawing logic)
const drawSamplesToCanvas = (canvas: HTMLCanvasElement | undefined, samples: number[]) => {
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const width = canvas.width
    const height = canvas.height
    context.fillStyle = '#111723'
    context.fillRect(0, 0, width, height)

    context.strokeStyle = '#4aef9b'
    context.lineWidth = 1.25
    context.beginPath()

    if (!samples.length) {
        context.moveTo(0, height / 2)
        context.lineTo(width, height / 2)
        context.stroke()
        return
    }

    let peak = 0
    for (let i = 0; i < samples.length; i += 1) {
        const abs = Math.abs(samples[i] ?? 0)
        if (abs > peak) peak = abs
    }
    const normalize = peak > 0 ? 1 / peak : 1

    let samplesPerPixel = samples.length / PREVIEW_POINTS
    if (samplesPerPixel > 8) samplesPerPixel = 8
    let step = 1 / samplesPerPixel
    for (let i = 0; i < PREVIEW_POINTS; i += step) {
        const samplePosition = (i / (PREVIEW_POINTS - 1)) * (samples.length - 1)
        const leftIndex = Math.floor(samplePosition)
        const rightIndex = Math.min(leftIndex + 1, samples.length - 1)
        const blend = samplePosition - leftIndex
        const leftSample = samples[leftIndex] ?? 0
        const rightSample = samples[rightIndex] ?? 0
        const sample = (leftSample * (1 - blend) + rightSample * blend) * normalize
        const x = (i / (PREVIEW_POINTS - 1)) * width
        const y = height / 2 - sample * (height * 0.46)
        if (i === 0) context.moveTo(x, y)
        else context.lineTo(x, y)
    }
    context.stroke()
}

export function SoundDesigner() {
    const [selectedSound, setSelectedSound] = createSignal<SoundName>(soundNames[0])
    const [params, setParams] = createSignal<ZzfxParams>([...defaultParams])
    const [savedOverrides, setSavedOverrides] = createSignal<SoundOverrides>(loadSoundOverrides())
    const [history, setHistory] = createSignal<ZzfxParams[]>([])
    const [historyIndex, setHistoryIndex] = createSignal(-1)
    const [status, setStatus] = createSignal('')
    let previewCanvas: HTMLCanvasElement | undefined
    let amplitudeCanvas: HTMLCanvasElement | undefined
    let timbreCanvas: HTMLCanvasElement | undefined


    const setStatusTemporarily = (text: string) => {
        setStatus(text)
        window.setTimeout(() => setStatus(''), 1600)
    }

    const getCurrentParamsFor = (name: SoundName, overrides = savedOverrides()): ZzfxParams => {
        const stored = overrides[name]
        if (stored) return cloneParams(stored)
        return cloneParams(DefaultSounds[name].zzfx)
    }

    const resetHistory = (nextParams: ZzfxParams) => {
        setHistory([cloneParams(nextParams)])
        setHistoryIndex(0)
    }

    const pushHistory = (nextParams: ZzfxParams) => {
        const currentHistory = history().slice(0, historyIndex() + 1)
        currentHistory.push(cloneParams(nextParams))
        const cappedHistory = currentHistory.slice(-80)
        setHistory(cappedHistory)
        setHistoryIndex(cappedHistory.length - 1)
    }

    const drawPreview = (current: ZzfxParams) => {
        if (!previewCanvas) return
        const context = previewCanvas.getContext('2d')
        if (!context) return

        const width = previewCanvas.width
        const height = previewCanvas.height
        context.fillStyle = '#111723'
        context.fillRect(0, 0, width, height)

        let samples: number[] = []
        try {
            samples = ZZFX.buildSamples(...current)
        } catch {
            samples = []
        }

        context.strokeStyle = '#4aef9b'
        context.lineWidth = 1.25
        context.beginPath()

        if (!samples.length) {
            context.moveTo(0, height / 2)
            context.lineTo(width, height / 2)
            context.stroke()
            return
        }

        // Normalize to fill canvas regardless of ZZFX master volume
        let peak = 0
        for (let i = 0; i < samples.length; i += 1) {
            const abs = Math.abs(samples[i] ?? 0)
            if (abs > peak) peak = abs
        }
        const normalize = peak > 0 ? 1 / peak : 1

        let samplesPerPixel = samples.length / PREVIEW_POINTS;
        if (samplesPerPixel > 8) samplesPerPixel = 8;
        let step = 1 / samplesPerPixel;
        for (let i = 0; i < PREVIEW_POINTS; i += step) {
            const samplePosition = (i / (PREVIEW_POINTS - 1)) * (samples.length - 1)
            const leftIndex = Math.floor(samplePosition)
            const rightIndex = Math.min(leftIndex + 1, samples.length - 1)
            const blend = samplePosition - leftIndex
            const leftSample = samples[leftIndex] ?? 0
            const rightSample = samples[rightIndex] ?? 0
            const sample = (leftSample * (1 - blend) + rightSample * blend) * normalize
            const x = (i / (PREVIEW_POINTS - 1)) * width
            const y = height / 2 - sample * (height * 0.46)
            if (i === 0) context.moveTo(x, y)
            else context.lineTo(x, y)
        }
        context.stroke()
    }

    const drawAmplitudeEnvelope = (current: ZzfxParams) => {
        if (!amplitudeCanvas) return
        const context = amplitudeCanvas.getContext('2d')
        if (!context) return

        const width = amplitudeCanvas.width
        const height = amplitudeCanvas.height
        const pad = 10
        const drawWidth = width - pad * 2
        const drawHeight = height - pad * 2

        context.fillStyle = '#0f1420'
        context.fillRect(0, 0, width, height)

        // Grid and baseline for quick envelope readability.
        context.strokeStyle = '#2a3344'
        context.lineWidth = 1
        context.beginPath()
        context.moveTo(pad, pad)
        context.lineTo(pad, height - pad)
        context.lineTo(width - pad, height - pad)
        context.stroke()

        const volume = Math.max(0, Math.min(1, current[ZzfxParam.volume]))
        const attack = Math.max(0, current[ZzfxParam.attack])
        const sustain = Math.max(0, current[ZzfxParam.sustain])
        const release = Math.max(0, current[ZzfxParam.release])
        const decay = Math.max(0, current[ZzfxParam.decay])
        const delay = Math.max(0, current[ZzfxParam.delay])
        const sustainVolume = Math.max(0, Math.min(1, current[ZzfxParam.sustainVolume]))
        const repeatTime = Math.max(0, current[ZzfxParam.repeatTime])

        const total = attack + decay + sustain + release
        const totalWithDelay = delay + total
        const displayDuration = Math.max(3, totalWithDelay)

        const toX = (time: number) => pad + (time / displayDuration) * drawWidth
        const toY = (amp: number) => pad + (1 - amp) * drawHeight

        const yBase = toY(0)
        const yPeak = toY(volume)
        const ySustain = toY(sustainVolume)

        // Positions for envelope phases
        const xDelayEnd = toX(delay)
        const xAttackEnd = toX(delay + attack)
        const xDecayEnd = toX(delay + attack + decay)
        const xSustainEnd = toX(delay + attack + decay + sustain)
        const xReleaseEnd = toX(delay + attack + decay + sustain + release)

        const colors = {
            delay: paramColorByKey.delay,
            attack: paramColorByKey.attack,
            decay: paramColorByKey.decay,
            sustain: paramColorByKey.sustain,
            release: paramColorByKey.release,
            repeatTime: paramColorByKey.repeatTime,
        }

        const drawSegment = (startX: number, endX: number, startY: number, endY: number, color: string) => {
            context.strokeStyle = color
            context.lineWidth = 3
            context.beginPath()
            context.moveTo(startX, startY)
            context.lineTo(endX, endY)
            context.stroke()
        }

        const drawPoint = (x: number, y: number, color: string, radius: number = 4) => {
            context.fillStyle = color
            context.beginPath()
            context.arc(x, y, radius, 0, Math.PI * 2)
            context.fill()
        }

        // Draw each phase with its color
        if (delay > 0) {
            drawSegment(toX(0), xDelayEnd, yBase, yBase, colors.delay)
            drawPoint(xDelayEnd, yBase, colors.delay)
        }

        drawSegment(delay > 0 ? xDelayEnd : pad, xAttackEnd, yBase, yPeak, colors.attack)
        drawPoint(xAttackEnd, yPeak, colors.attack)

        drawSegment(xAttackEnd, xDecayEnd, yPeak, ySustain, colors.decay)
        drawPoint(xDecayEnd, ySustain, colors.decay)

        drawSegment(xDecayEnd, xSustainEnd, ySustain, ySustain, colors.sustain)
        drawPoint(xSustainEnd, ySustain, colors.sustain)

        drawSegment(xSustainEnd, xReleaseEnd, ySustain, yBase, colors.release)
        drawPoint(xReleaseEnd, yBase, colors.release)

        if (repeatTime > 0) {
            const repeatRatio = Math.max(0, Math.min(1, repeatTime / displayDuration))
            const xRepeat = pad + repeatRatio * drawWidth
            context.strokeStyle = colors.repeatTime
            context.lineWidth = 2
            context.setLineDash([4, 4])
            context.beginPath()
            context.moveTo(xRepeat, pad)
            context.lineTo(xRepeat, height - pad)
            context.stroke()
            context.setLineDash([])
            drawPoint(xRepeat, pad + drawHeight / 2, colors.repeatTime, 3)
        }
    }

    const drawTimbrePreview = (current: ZzfxParams) => {
        try {
            const shortParams = getTimbreShortParams(current)
            const samples = ZZFX.buildSamples(...shortParams)
            drawSamplesToCanvas(timbreCanvas, samples)
        } catch (error) {
            console.error('Error drawing timbre preview:', error)
        }
    }

    const playSound = (value = params()) => {
        try {
            zzfx(...value)
        } catch (error) {
            console.error('Error playing sound:', error)
        }
    }

    const playCurrentSound = () => playSound(params())

    const updateParam = (index: number, value: number) => {
        const newParams = cloneParams(params())
        newParams[index] = value
        setParams(newParams)
        pushHistory(newParams)
        playSound(newParams)
    }

    const undo = () => {
        const nextIndex = historyIndex() - 1
        if (nextIndex < 0) return
        const snapshot = history()[nextIndex]
        if (!snapshot) return
        const nextParams = cloneParams(snapshot)
        setHistoryIndex(nextIndex)
        setParams(nextParams)
        playSound(nextParams)
    }

    const redo = () => {
        const nextIndex = historyIndex() + 1
        const snapshot = history()[nextIndex]
        if (!snapshot) return
        const nextParams = cloneParams(snapshot)
        setHistoryIndex(nextIndex)
        setParams(nextParams)
        playSound(nextParams)
    }

    const selectHistory = (index: number) => {
        const snapshot = history()[index]
        if (!snapshot) return
        const nextParams = cloneParams(snapshot)
        setHistoryIndex(index)
        setParams(nextParams)
        playSound(nextParams)
    }

    const saveCurrentToLocalStorage = () => {
        const name = selectedSound()
        const nextOverrides = { ...savedOverrides(), [name]: cloneParams(params()) }
        setSavedOverrides(nextOverrides)
        saveSoundOverrides(nextOverrides)
        setStatusTemporarily('Saved in localStorage')
    }

    const copyAllSoundsToClipboard = async () => {
        try {
            const currentOverrides = { ...savedOverrides(), [selectedSound()]: cloneParams(params()) }
            const text = toSoundsObjectText(currentOverrides)
            await navigator.clipboard.writeText(text)
            setStatusTemporarily('Full sounds object copied')
        } catch {
            setStatusTemporarily('Clipboard copy failed')
        }
    }

    const onSoundChanged = (nextName: SoundName) => {
        setSelectedSound(nextName)
        const nextParams = getCurrentParamsFor(nextName)
        setParams(nextParams)
        resetHistory(nextParams)
        playSound(nextParams)
    }

    onMount(() => {
        const initial = getCurrentParamsFor(selectedSound())
        setParams(initial)
        resetHistory(initial)
        drawPreview(initial)
        drawAmplitudeEnvelope(initial)
        drawTimbrePreview(initial)
    })

    createEffect(() => {
        const current = params()
        drawPreview(current)
        drawAmplitudeEnvelope(current)
        drawTimbrePreview(current)
    })

    return (
        <div class="sound-designer">
            <h2>Zzfx Sound Designer</h2>

            <div class="designer-header">
                <label class="sound-select-label" for="sound-select">Sound</label>
                <select
                    id="sound-select"
                    class="sound-name-input"
                    value={selectedSound()}
                    onChange={event => onSoundChanged(event.currentTarget.value as SoundName)}
                >
                    <For each={soundNames}>
                        {name => <option value={name}>{name}</option>}
                    </For>
                </select>
                <button onClick={playCurrentSound} class="btn btn-play">
                    ▶ Play
                </button>
                <button onClick={saveCurrentToLocalStorage} class="btn btn-save">
                    Save
                </button>
            </div>

            <div class="preview-panel">
                <canvas ref={previewCanvas} width="860" height="120" class="preview-canvas" />
            </div>

            <div class="history-toolbar">
                <button onClick={undo} class="btn btn-copy" disabled={historyIndex() <= 0}>Undo</button>
                <button onClick={redo} class="btn btn-copy" disabled={historyIndex() >= history().length - 1}>Redo</button>
                <span class="status-text">{status()}</span>
            </div>

            <div class="history-list">
                <For each={history()}>
                    {(snapshot, index) => (
                        <button
                            class={`history-item ${index() === historyIndex() ? 'active' : ''}`}
                            onClick={() => selectHistory(index())}
                        >
                            {`#${index() + 1} ${snapshot.map(formatNumber).join(', ')}`}
                        </button>
                    )}
                </For>
            </div>

            <div class="grouped-params-grid">
                <For each={columns}>
                    {column => (
                        <div class="params-column">
                            <For each={column.groups}>
                                {groupName => {
                                    const group = groupsByName[groupName]
                                    return (
                                        <section class="param-group-card">
                                            <h3>{group.group}</h3>
                                            <div class="params-grid">
                                                <For each={group.items}>
                                                    {spec => (
                                                        <div class="param-control" style={{ position: isNeutralCentered(spec) ? 'relative' : undefined }}>
                                                            <label>{spec.key}</label>
                                                            {spec.key === 'shape' ? (
                                                                <select
                                                                    class="shape-select"
                                                                    value={String(params()[spec.index])}
                                                                    onChange={event => updateParam(spec.index, Number(event.currentTarget.value))}
                                                                >
                                                                    <For each={WAVE_SHAPES}>
                                                                        {(shapeName, waveIndex) => (
                                                                            <option value={waveIndex()}>{`${waveIndex()} - ${shapeName}`}</option>
                                                                        )}
                                                                    </For>
                                                                </select>
                                                            ) : (
                                                                <>
                                                                    <input
                                                                        type="range"
                                                                        min={spec.min}
                                                                        max={spec.max}
                                                                        step={spec.step}
                                                                        value={toDisplayValue(spec, params())}
                                                                        onInput={event => updateParam(spec.index, toStoredValue(spec, parseFloat(event.currentTarget.value)))}
                                                                        class="slider"
                                                                        style={{ '--slider-color': spec.color ?? '#4a9eff' }}
                                                                    />
                                                                    {isNeutralCentered(spec) && <div style={centerMarkStyle} />}
                                                                </>
                                                            )}
                                                            <span class="param-value">{formatParamValue(spec, params())}</span>
                                                        </div>
                                                    )}
                                                </For>
                                            </div>
                                            {group.group === 'Duration' ? (
                                                <div class="amplitude-preview-panel">
                                                    <canvas ref={amplitudeCanvas} width="520" height="110" class="amplitude-canvas" />
                                                </div>
                                            ) : null}
                                            {group.group === 'Timbre' ? (
                                                <div class="amplitude-preview-panel">
                                                    <canvas ref={timbreCanvas} width="500" height="100" class="preview-canvas" />
                                                </div>
                                            ) : null}
                                        </section>
                                    )
                                }}
                            </For>
                        </div>
                    )}
                </For>
            </div>

            <div class="button-group">
                <button onClick={copyAllSoundsToClipboard} class="btn btn-export">
                    Copy Full Sounds Object
                </button>
            </div>

            <div class="info">
                <p><strong>Wave shape:</strong> 0=sine, 1=triangle, 2=sawtooth, 3=tan, 4=noise, 5=square duty</p>
            </div>
        </div>
    )
}
