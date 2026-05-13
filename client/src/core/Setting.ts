import { MutableState } from "./MutableState";


export class Setting<T> extends MutableState<T> {
  static allSettings: Setting<any>[] = [];

  static {
    setTimeout(() => {
      // first we read all
      this.allSettings.forEach((setting) => {
        setting._readFromStorage();
      })
      // then we raise all
      this.allSettings.forEach((setting) => {
        if (setting.onSettingChanged) setting.onSettingChanged(setting.getValue());
      })
    });
  }

  constructor(readonly name: string, initialValue: T, private readonly onSettingChanged?: (newValue: T) => void) {
    super(initialValue);
    super.setValue(initialValue);
    Setting.allSettings.push(this);
    this.observe(newValue => {
      if (onSettingChanged) onSettingChanged(newValue);
      this._saveToStorage(newValue)
    })
  }

  protected _readFromStorage() {
    let valueString = localStorage.getItem(this.name)
    if (valueString) {
      try {
        let newValue = JSON.parse(valueString);
        this._initValue(newValue); // init won't raise a value changed
      } catch (e) {
        console.warn(`Value of ${this.name} is invalid: ${valueString}`, e)
      }
    }
  }

  protected _saveToStorage(newValue: T) {
    try {
      let valueString = JSON.stringify(newValue)
      localStorage.setItem(this.name, valueString)
    } catch (e) {
      console.warn(`Could not save ${this.name}`, e)
    }
  }
}
