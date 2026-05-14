import { Sound } from "../core/Sound";
import { IPoint, Size, ISize, Rect, Point } from "../core/Types";
import { DURATIONS, IAnimation } from "../core/IAnimation";
import { Layer, LayerMouseEvent } from "./Layer";
import { IAnimationFrame, IApp, INavigateOptions } from "../core/IApp";
import { Setting } from "../core/Setting";
import { Plasma } from "../screens/Plasma";
import { FocusLayer } from "./FocusLayer";
import { MutableState, func } from "../core/MutableState";
import { UnknownScreen } from "../screens/UnknownScreen";
import { IScreen, IScreenConstructor } from "../core/IScreen";

export interface IAppOptions {
  LANDSCAPE_WIDTH: number
  LANDSCAPE_HEIGHT: number;
  debug: boolean
  aspect_ratio: number
}

export abstract class App extends Layer implements IApp {
  static instance: App;
  appUnscaledContainer?: HTMLDivElement;
  readonly tickNo = new MutableState<number>(0);
  pixelSize: number = 1;
  portrait_mode = false;
  containerRect!: DOMRect;
  activeScreen?: IScreen;
  landscape_mode = true;
  isMouseDown: boolean = false;
  LANDSCAPE_WIDTH: number = 0;
  LANDSCAPE_HEIGHT: number = 0;
  debug: boolean;
  aspect_ratio: number = 16 / 9;
  sound?: Sound;
  animations: IAnimation[] = [];
  isBusy = false;
  skipDelay = false;
  animation_multiplier = 1;
  animationSpeed = new Setting("animationSpeed", 3, (newSpeed) => {
    switch (newSpeed) {
      case 1:
        this.animation_multiplier = 4;
        break;
      case 2:
        this.animation_multiplier = 2;
        break;
      case 3:
        this.animation_multiplier = 1;
        break;
      case 4:
        this.animation_multiplier = 0.5;
        break;
      case 5:
        this.animation_multiplier = 0.2;
        break;
    }
  });
  musicVolume = new Setting("musicVolume", 20, (newVolume) => {
    this.sound?.setMusicVolume(newVolume);
  });
  soundVolume = new Setting("soundVolume", 40, (newVolume) => {
    this.sound?.setSoundVolume(newVolume);
  });
  achievementsDone = new Setting<Record<string, boolean>>("achievements", { opened_the_app: true }, () => {
    // 
  });

  userName = new Setting("userName", "");
  userId = new Setting("userId", 0);
  screenConstructors: Record<string, IScreenConstructor>;
  screenInstances: Map<IScreenConstructor, IScreen> = new Map();
  backgroundLayer?: Plasma
  focusLayer?: FocusLayer;
  readonly nowInt = new MutableState<number>(0);
  readonly nowDate = func("now", (ms) =>
    new Date(ms), this.nowInt)
  readonly rect = new MutableState(Rect.Zero);
  readonly animationFrame = new MutableState<IAnimationFrame>({ time: this.nowInt.getValue(), deltaT: 0 });
  mouseCapture?: Layer;

  constructor(hostElement: HTMLElement, screens: Record<string, IScreenConstructor> = {}, options: Partial<IAppOptions> = {}) {
    super(null, { layerType: "App" });
    App.instance = this;

    let useSplashScreen = true;
    let useSizeListener = true;
    let useLayerContainer = true;
    let useMouseEvents = true;
    let useKeyEvents = true;
    let useSound = true;
    let useBackgroundLayer = true;
    let useFocusLayer = true;
    let useAnimationFrame = true;
    let useOnTick = true;
    let useRouter = true;


    let hash = document.location.hash;
    if (hash === "#test") {
      useSound = false;
      useBackgroundLayer = false;
      useFocusLayer = false;
      useSplashScreen = false;
    }

    this.screenConstructors = screens;
    this.debug = options.debug ?? false;

    if (useSizeListener) {
      window.addEventListener("resize", () => this.onWindowResized());
      setTimeout(() => this.onWindowResized())
    }

    if (useLayerContainer) {
      if (options.LANDSCAPE_WIDTH && options.LANDSCAPE_HEIGHT) {
        this.LANDSCAPE_WIDTH = options.LANDSCAPE_WIDTH;
        this.LANDSCAPE_HEIGHT = options.LANDSCAPE_HEIGHT;
        this.aspect_ratio = this.LANDSCAPE_WIDTH / this.LANDSCAPE_HEIGHT;
      } else {
        this.aspect_ratio = options.aspect_ratio ?? 16 / 9;
        if (options.LANDSCAPE_WIDTH) {
          this.LANDSCAPE_WIDTH = options.LANDSCAPE_WIDTH;
          this.LANDSCAPE_HEIGHT = this.LANDSCAPE_WIDTH / this.aspect_ratio;
        } else if (options.LANDSCAPE_HEIGHT) {
          this.LANDSCAPE_HEIGHT = options.LANDSCAPE_HEIGHT;
          this.LANDSCAPE_WIDTH = this.LANDSCAPE_HEIGHT * this.aspect_ratio;
        } else {
          this.LANDSCAPE_WIDTH = 320;
          this.LANDSCAPE_HEIGHT = this.LANDSCAPE_WIDTH / this.aspect_ratio;
        }
      }
      // css and flex doesn't play well with scaled elements so we create an unscaled container around everything.
      let appUnscaledContainer = this.appUnscaledContainer = document.createElement("div");
      appUnscaledContainer.classList.add("app-container", "unscaled")
      hostElement.appendChild(appUnscaledContainer);
      appUnscaledContainer.append(this._layerElement);
      this._layerElement.style.position = "relative";
      this._layerElement.style.overflow = "hidden";
      this._layerElement.style.touchAction = "none"; /* Prevent default touch behaviors like scrolling */

      if (useMouseEvents) {
        this._layerElement.addEventListener("pointerdown", (e: PointerEvent) => { this._onPointerEvent("down", e); });
        this._layerElement.addEventListener("pointerup", (e: PointerEvent) => { this._onPointerEvent("up", e); });
        this._layerElement.addEventListener("pointercancel", (e: PointerEvent) => { this._onPointerEvent("cancel", e); });
        this._layerElement.addEventListener("pointermove", (e: PointerEvent) => {
          if (e.buttons) this._onPointerEvent("drag", e);
        });
      }
    }

    if (useKeyEvents) {
      // Add a keyboard event listener for PCs
      document.addEventListener('keydown', (e) => this._onKeyDown(e));

      // Add a TV remote key event listener for Android TVs
      let webOS = (window as any)?.webOS;
      if (typeof webOS !== 'undefined') {
        // Assuming you're using webOS TV, you can adjust this condition for other TV platforms
        webOS.deviceInfo.addListener('keyup', (e: any) => this._onKeyDown(e));
      }
    }

    if (useSound) {
      this.sound = new Sound();
      document.addEventListener("mousedown", () => {
        if (!this.sound?.soundInitDone) this.sound?.init(this.musicVolume.getValue());
      }, { once: true })
    }

    if (useAnimationFrame) {
      requestAnimationFrame((timestamp) => this._appAnimationFrame(timestamp));
    }
    if (useOnTick) {
      setInterval(() => this._onTick(), 100);
    }

    if (useBackgroundLayer) {
      this.backgroundLayer = new Plasma(this);
    }

    if (useFocusLayer) {
      this.focusLayer = new FocusLayer(this);
    }

    if (useRouter) {
      window.addEventListener('hashchange', () => this.onHashChanged());
      setTimeout(() => {
        if (!useSplashScreen && window.location.hash !== "#test") {
          this.navigateTo("menu")
        } else this.onHashChanged();
      });
    }
  }

  abstract getTitle(): string;

  navigateTo(page: string = "", args: any[] = [], options: Partial<INavigateOptions> = {}) {
    if (page.startsWith("#")) page = page.substring(1);
    let newHash = [page, ...args].join("/")
    let currentHash = window.location.hash;
    if (currentHash.startsWith("#")) currentHash = currentHash.substring(1);

    if (newHash === currentHash) return;
    if (options.saveToHistory ?? true) {
      if (newHash) {
        window.history.pushState({}, '', "#" + newHash);
        this.onHashChanged();
      } else {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
      }
    }
    else {
      if (newHash) {
        window.location.hash = newHash;
      } else {
        window.history.replaceState("", document.title, window.location.pathname + window.location.search);
      }
    }
  }

  setFocus(newFocus: Layer | null): void {
    this.focusLayer?.setFocus(newFocus);
  }

  setContainerClasslist() {
    this._layerElement.classList.add("app", this.constructor.name);
  }

  delayHundredMilliseconds(): Promise<void> {
    return new Promise<void>((resolve) => setTimeout(resolve, 100));
  }

  async delay(sec: number): Promise<void> {
    let tenth = Math.round(sec * 10 * this.animation_multiplier);
    for (let i = 0; i < tenth; i++) {
      await this.delayHundredMilliseconds();
      if (this.skipDelay) {
        this.skipDelay = false;
        break;
      }
    }
  }

  _onKeyDown(e: KeyboardEvent): void {
    if (this.isBusy) {
      this.skipDelay = true;
      return;
    }

    const remoteKeys: Record<string, string> = {
      UP: 'ArrowUp',
      DOWN: 'ArrowDown',
      LEFT: 'ArrowLeft',
      RIGHT: 'ArrowRight',
      ENTER: 'Enter'
    };
    let key = remoteKeys[e.key] || e.key;

    if (!this.sound?.soundInitDone) {
      this.sound?.init(this.musicVolume.getValue());
    }
    //let handled =
    let handled = this.focusLayer?.onKeyPress(key);
    if (!handled) {
      this.activeScreen?.onKeyPress(key);
    }
  }

  animate(action: (p: number) => void, duration: number): Promise<void> {
    return new Promise((resolve) => {
      this.animations.push({
        action,
        start: Date.now(),
        duration,
        resolve
      });
    });

  }

  onHashChanged() {
    let currentHash = window.location.hash;
    if (currentHash.startsWith("#")) currentHash = currentHash.substring(1);
    let args = currentHash.split("/");
    let screenName = args.shift() ?? "";
    let screen = this.getScreen(screenName, args);
    let title = this.getTitle();
    let subTitle = screen.getTitle();
    title = (title && subTitle) ? title + " - " + subTitle
      : title ?? subTitle;
    document.title = title;
    screen.setSize(this.size);
    this.setActiveScreen(screen);
  }

  getScreen(screenName: string, args: string[]): IScreen {
    let layerConstructor = this.screenConstructors[screenName];
    let appScreen: IScreen | undefined = this.screenInstances.get(layerConstructor);
    if (!appScreen) {
      let layerConstructor = this.screenConstructors[screenName];
      if (!layerConstructor) layerConstructor = UnknownScreen as any;
      //TODO appScreen = new layerConstructor();
      appScreen = new layerConstructor(this)
    }
    appScreen!.init(screenName, args);
    this.screenInstances.set(layerConstructor, appScreen!);
    return appScreen!;
  }

  setActiveScreen(newScreen: IScreen) {
    let currentlyActiveScreen = this.activeScreen;
    if (newScreen == currentlyActiveScreen) return;
    this.activeScreen = newScreen;
    if (currentlyActiveScreen) {
      currentlyActiveScreen.setVisible(false, DURATIONS.ACTIVE_SCREEN_VISIBLE);
    }
    this.focusLayer?.init()

    newScreen.setSize(this.size);
    newScreen.setVisible(true, DURATIONS.ACTIVE_SCREEN_VISIBLE);
  }

  onWindowResized() {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const viewportAspectRatio = viewportWidth / viewportHeight;
    let newPixelSize = 0;
    let newSize: ISize;

    if (viewportAspectRatio > 1) {
      // 4:3
      newSize = new Size(this.LANDSCAPE_WIDTH, this.LANDSCAPE_HEIGHT);
      this.portrait_mode = false;
    } else {
      // 3:4
      newSize = new Size(this.LANDSCAPE_HEIGHT, this.LANDSCAPE_WIDTH);
      this.portrait_mode = true;
    }
    this.landscape_mode = !this.portrait_mode;

    let aspectRatio = newSize.w / newSize.h;

    if (viewportAspectRatio <= aspectRatio) {
      newPixelSize = viewportWidth / newSize.w;
    } else {
      // Otherwise, use the height and calculate the width
      newPixelSize = viewportHeight / newSize.h;
    }
    newPixelSize = Math.floor(newPixelSize);

    let sizeChanged = !Size.equals(newSize, this.size);
    let pixelSizeChanged = newPixelSize != this.pixelSize;

    if (pixelSizeChanged) {
      this._layerElement.style.transformOrigin = "top left";
      this._layerElement.style.transform = `scale(${newPixelSize})`;
      this.pixelSize = newPixelSize;
    }
    if (sizeChanged) {
      super.setSize(newSize);
      this.backgroundLayer?.setSize(this.size);
      this.activeScreen?.setSize(this.size);
      this.focusLayer?.setSize(this.size);
    }
    if ((pixelSizeChanged || sizeChanged) && this.appUnscaledContainer) {
      this.appUnscaledContainer.style.width = newPixelSize * newSize.w + "px"
      this.appUnscaledContainer.style.height = newPixelSize * newSize.h + "px"
    }
  }

  _onPointerEvent(type: "down" | "up" | "drag" | "cancel", e: PointerEvent) {
    // e.preventDefault();
    

    if (this.isBusy) {
      if (type === "down") this.skipDelay = true;
      //TODO failure sound
      return;
    }
    this.containerRect = this._layerElement.getBoundingClientRect();
    if (this.sound?.soundInitDone !== true && type == "down") {
      this.sound?.init(this.musicVolume.getValue());
    }

    let pt: IPoint = { x: (e.clientX - this.containerRect.x) / this.pixelSize, y: (e.clientY - this.containerRect.y) / this.pixelSize };
    let ev: LayerMouseEvent = { type }

    switch (type) {
      case "down":
        break;
      case "up":
        break;
      case "cancel":
        break;
      case "drag":
        break;
    }


    if (this.mouseCapture) {
      this._layerElement.releasePointerCapture(e.pointerId);
      let offset = this.mouseCapture.getAbsolutePos(Point.Zero)
      this.mouseCapture.onMouseEvent(ev, { x: pt.x - offset.x, y: pt.y - offset.y })
      if (type == "up" || type == "cancel") this.mouseCapture = undefined;
    } else {
      let onMouseEventRecursive = (parent: Layer, pt: IPoint) => {
        if (parent.onMouseEvent(ev, pt)) return true;

        for (let layerNo = parent.children.length - 1; layerNo >= 0; layerNo--) {
          let control = parent.children[layerNo];
          if (control.isOpaque()) {
            let { x, y } = control.position;
            x = pt.x - x;
            y = pt.y - y;
            let { w, h } = control.size;
            if (x >= 0 && x < w
              && y >= 0 && y < h) {
              if (control.onMouseEvent(ev, { x, y })) return true;
              if (onMouseEventRecursive(control, { x, y })) return true;
            }
          }
        }
        return false;
      }
      let handled = false;
      if (this.activeScreen) {
        handled = onMouseEventRecursive(this.activeScreen, pt);
        if (ev.capture) {
          this.mouseCapture = ev.capture;
          this._layerElement.setPointerCapture(e.pointerId);
        }
      }
      if (!handled && type === "down") {
        this.setFocus(null);
      }
    }
  }

  _onTick() {
    // tick fires every 0.1 seconds
    // this is ideal for slow '8 bits' animations
    this.tickNo.setValue(this.tickNo.getValue() + 1);
    this.backgroundLayer?.onTick();
    this.activeScreen?.onTick();
    this.focusLayer?.onTick();
  }

  _appAnimationFrame(_timestamp: number) {
    let time = Date.now();
    this.nowInt.setValue(time);
    let deltaT = time = this.animationFrame.getValue().time;
    this.animationFrame.setValue({ time, deltaT })

    this.animations.forEach(a => {
      let now = Date.now();
      let p = (now - a.start) / (a.duration * 1000 * this.animation_multiplier || 1);
      let finish = false;
      if (p > 1) {
        p = 1;
        finish = true;
      }

      try {
        a.action(p);
      } catch (e) {
        console.error("IAnimation::action", e);
        finish = true;
      }
      if (finish) {
        this.animations = this.animations.filter(e => e != a);
        try {
          a.resolve();
        } catch (e) {
          console.error("IAnimation::resolve", e);
        }
      }
    });

    for (let ch of this.recurseChildren(l => l.opacity > 0)) {
      ch.onAnimationFrame();
    }
    // this.backgroundLayer?._onAnimationFrame()
    // this.activeScreen?.onAnimationFrame();
    // this.focusLayer?._onAnimationFrame()
    requestAnimationFrame((timestamp) => this._appAnimationFrame(timestamp));
  }

  async runBlocking<T>(action: () => Promise<T>): Promise<T | undefined> {
    if (this.isBusy) {
      action();
    } else {
      try {
        this.isBusy = true;
        this.skipDelay = false;
        return await action();
      } finally {
        this.isBusy = false;
      }
    }
  }

}
