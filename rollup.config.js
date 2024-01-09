import terser from "@rollup/plugin-terser";

export default [
  {
    input: "src/index.js",
    output: [
      {
        file: "dist/DragResizeBox.esm.js",
        format: "es"
      },
      {
        file: "dist/DragResizeBox.min.js",
        format: "iife",
        name: "DragResizeBox",
        plugins: [terser()]
      }
    ]
  }
];
