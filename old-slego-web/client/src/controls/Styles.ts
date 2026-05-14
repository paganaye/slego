
export class Styles {
  private static globalStyles: HTMLStyleElement[] = [];
  
  static addStyle(selector: string, ...declarations: string[]) {
    const newStyle = document.createElement('style');
    newStyle.innerHTML = `${selector} {\n ${declarations.join(";\n")}\n}`;
    document.head.appendChild(newStyle);
    this.globalStyles.push(newStyle)
  }

}