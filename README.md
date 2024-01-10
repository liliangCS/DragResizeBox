# drag-resize-box

一款无任何依赖库、且支持拖拽和缩放功能的原生组件。

支持 import 和浏览器 script 标签

### 使用方式一：

通过 script 标签引入 dist 目录下的 DragResizeBox.min.js 文件。

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>功能演示</title>
    <style>
      .box {
        width: 200px;
        height: 200px;
        background-color: red;
      }
    </style>
    <script src="./dist/DragResizeBox.min.js"></script>
  </head>
  <body>
    <div class="box"></div>

    <script>
      const boxEl = document.querySelector(".box");
      new DragResizeBox(boxEl, { left: 100, top: 100 });
    </script>
  </body>
</html>
```

### 使用方式二：

下载 npm 包，通过 import 导入到自己的项目中。

```cmd
npm install drag-resize-box
```

```javascript
import DragResizeBox from "drag-resize-box";

new DragResizeBox(domEl);
```

### DragResizeBox 类

#### 语法

```javascript
new DragResizeBox(domEl);

new DragResizeBox(domEl, options);
```

#### 参数

`domEl(必选)`：需要支持拖拽操作的 DOM 元素。

`options(可选)`：一个对象，用于提供相关配置选项。

- `zoom`：布尔类型，是否开启缩放模式，默认值为 false
- `minWidth`：数值类型，最小缩放宽度，默认值为 0（单位：px）
- `minHeight`：数值类型，最小缩放高度，默认值为 0（单位：px）
- `zIndex`：数值类型，拖拽元素层级，默认值为 9999
- `dragSelector`：字符串类型，设置拖拽部分，传入 CSS 选择器，默认值为 null
- `left`：数值类型，初始距离浏览器窗口左边的距离，默认值为 0（单位：px）
- `top`：数值类型，初始距离浏览器窗口上边的距离，默认值为 0（单位：px）
- `cornerSize`：数值类型，角缩放控制区域的尺寸，默认值为 16（单位：px）
- `borderSize`：数值类型，边缩放控制区域的尺寸，默认值为 12（单位：px）
- `borderSize`：数值类型，边缩放控制区域的尺寸，默认值为 12（单位：px）
- `center`：布尔类型，拖拽元素初始位置是否居中，默认值为 false
