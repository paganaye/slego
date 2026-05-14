import { JSX } from 'solid-js'
import { useSettings } from './SettingsContext'

interface SettingsModalProps {
  isOpen: () => boolean
  onClose: () => void
}

export function SettingsModal(props: SettingsModalProps): JSX.Element {
  const { settings, updateSetting } = useSettings()

  return (
    <>
      {props.isOpen() && (
        <div class="modal-overlay" onClick={props.onClose}>
          <div class="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Settings</h2>

            <div class="setting-group">
              <label>Style</label>
              <select
                value={settings().style}
                onChange={(e) => updateSetting('style', e.target.value as 'light' | 'dark')}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>

            <div class="setting-group">
              <label>Speed</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={settings().animationsSpeed}
                onChange={(e) => updateSetting('animationsSpeed', parseFloat(e.target.value))}
              />
              <span class="speed-value">{settings().animationsSpeed.toFixed(1)}x</span>
            </div>

            <div class="setting-group">
              <label>Orientation</label>
              <select
                value={settings().screenOrientationMode}
                onChange={(e) => updateSetting('screenOrientationMode', e.target.value as any)}
              >
                <option value="auto">Auto</option>
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>
            </div>

            <div class="setting-group">
              <label>Cross (Landscape)</label>
              <select
                value={settings().crossLandscapeSide}
                onChange={(e) => updateSetting('crossLandscapeSide', e.target.value as any)}
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div class="setting-group">
              <label>Cross (Portrait)</label>
              <select
                value={settings().crossPortraitSide}
                onChange={(e) => updateSetting('crossPortraitSide', e.target.value as any)}
              >
                <option value="top">Top</option>
                <option value="bottom">Bottom</option>
              </select>
            </div>

            <div class="setting-group checkbox">
              <input
                type="checkbox"
                id="showHelps"
                checked={settings().showHelps}
                onChange={(e) => updateSetting('showHelps', e.target.checked)}
              />
              <label for="showHelps">Show Help Tips</label>
            </div>

            <div class="setting-group checkbox">
              <input
                type="checkbox"
                id="timerOn"
                checked={settings().timerOn}
                onChange={(e) => updateSetting('timerOn', e.target.checked)}
              />
              <label for="timerOn">Show Timer</label>
            </div>

            <button class="modal-button" onClick={props.onClose}>
              Done
            </button>
          </div>
        </div>
      )}
    </>
  )
}
