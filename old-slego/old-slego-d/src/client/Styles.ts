let styleSheet: HTMLStyleElement | undefined;

addStyle("body", {
  width: "100%",
  height: "100%",
  overflow: "hidden"
});

addStyle("*", {
  boxSizing: "border-box",
  margin: 0,
  padding: 0,
});

addStyle("body", {
  color: "rgb(var(--text-color))",
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
});

export function addStyle(selector: string, styles: Record<string, string | number>) {
  if (!styleSheet) {
    styleSheet = document.getElementById('GlobalStyles') as HTMLStyleElement | undefined
    if (!styleSheet) {
      styleSheet = document.createElement('style');
      styleSheet.id = 'GlobalStyles';
      document.head.appendChild(styleSheet);
    }
  }

  const newCssText = Object.entries(styles)
    .map(([prop, value]) => `${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
    .join('; ');

  styleSheet.insertAdjacentText('beforeend', `${selector} {
${newCssText}
}\n`);

}

export function addKeyframes(name: string, frames: Record<string, Record<string, string | number>>) {
  if (!styleSheet) {
    styleSheet = document.createElement('style');
    document.head.appendChild(styleSheet);
  }

  let framesCss = [];
  for (const percentage in frames) {
    const styleProps = Object.entries(frames[percentage]!)
      .map(([prop, value]) => `${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`)
      .join(';\n');
    framesCss.push(`${percentage} { ${styleProps} } `);
  }

  styleSheet.insertAdjacentText('beforeend', `@keyframes ${name} { ${framesCss.join('\n')} }\n`);
}