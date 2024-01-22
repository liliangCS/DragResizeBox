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

- `drag`：布尔类型，是否开启拖拽模式，默认值为 true
- `zoom`：布尔类型，是否开启缩放模式，默认值为 true
- `minWidth`：数值类型，最小缩放宽度，默认值为 0（单位：px）
- `minHeight`：数值类型，最小缩放高度，默认值为 0（单位：px）
- `zIndex`：数值类型，拖拽元素层级，默认值为 9999
- `dragSelector`：字符串类型，设置拖拽部分，传入 CSS 选择器，默认值为 null
- `left`：数值类型，初始距离浏览器窗口左边的距离，默认值为 0（单位：px）
- `top`：数值类型，初始距离浏览器窗口上边的距离，默认值为 0（单位：px）
- `cornerSize`：数值类型，角缩放控制区域的尺寸，默认值为 16（单位：px）
- `borderSize`：数值类型，边缩放控制区域的尺寸，默认值为 12（单位：px）
- `center`：布尔类型，拖拽元素初始位置是否居中，默认值为 false
- `limitZoomArea`：数组类型，限制缩放区域，默认值为 `[]`，可填值：`left, right, top, bottom, leftTop, leftBottom, rightTop, rightBottom`

### DragResizeBox 实例方法

#### setFullScreen()

`为DOM元素设置全屏。`

#### exitFullScreen()

`DOM元素退出全屏。`

#### setMinWidth()

`为DOM元素设置最小宽度，若当前宽度小于最小宽度，则立即设置DOM元素的宽度为最小宽度。`

#### setMinHeight()

`为DOM元素设置最小高度，若当前高度小于最小高度，则立即设置DOM元素的高度为最小高度。`

### DragResizeBox 事件

`通过添加事件监听函数，你可以获取到 DOM 元素的自身的宽高以及相对于浏览器窗口的`left`和`top`值。`

#### resize 事件

`在DOM元素被缩放时触发。`

```javascript
const dragResizeBox = new dragResizeBox(domEl);

// 添加resize事件监听
dragResizeBox.addEventListener("resize", (event) => {
  console.log("事件名：", event.name);
  console.log("事件数据：", event.data);
});

// 移除resize事件监听
dragResizeBox.removeEventListener("resize");
```

#### drag 事件

`在DOM元素被拖拽时触发。`

```javascript
const dragResizeBox = new dragResizeBox(domEl);

// 添加drag事件监听
dragResizeBox.addEventListener("drag", (event) => {
  console.log("事件名：", event.name);
  console.log("事件数据：", event.data);
});

// 移除drag事件监听
dragResizeBox.removeEventListener("drag");
```
