// declaration.d.ts
declare module '*.scss' {
    const content: {[className: string]: string};
    export = content;
}

declare module 'draft-js-richbuttons-plugin' {
  const createRichButtonsPlugin: Function;
  export = createRichButtonsPlugin;
}
