const defaultOptions = {
  drag: true,
  zoom: true,
  minWidth: 0,
  minHeight: 0,
  zIndex: 9999,
  dragSelector: null,
  left: 0,
  top: 0,
  cornerSize: 16,
  borderSize: 12,
  center: false,
  limitZoomArea: [],
  position: "fixed"
};

class DragResizeBox {
  constructor(domEl, options) {
    this.eventCenter = {};
    this.options = Object.assign({ ...defaultOptions }, options);
    this.domEl = domEl;
    this.dragDomEl = document.querySelector(this.options.dragSelector);
    if (this.options.dragSelector !== null && !this.dragDomEl) {
      throw new Error("Options Error: dragSelector is invalid.");
    }
    this._init();
  }

  _init() {
    this.domEl.style.position = this.options.position;
    if (this.options.center) {
      const { width, height } = this.domEl.getBoundingClientRect();
      this.domEl.style.left = `calc(50% - ${width / 2}px)`;
      this.domEl.style.top = `calc(50% - ${height / 2}px)`;
    } else {
      this.domEl.style.left = this.options.left + "px";
      this.domEl.style.top = this.options.top + "px";
    }
    this.domEl.style.zIndex = this.options.zIndex;
    this.domEl.style.cursor = this.options.dragSelector === null && this.options.drag ? "move" : "auto";
    this.domEl.style.overflow = "hidden";
    // 阻止默认拖拽行为
    this.domEl.ondragstart = (event) => event.preventDefault();
    if (this.dragDomEl) {
      this.dragDomEl.style.cursor = this.options.drag ? "move" : "auto";
    }
    if (this.options.zoom) {
      this._zoom();
    }
    if (this.options.drag) {
      this._drag();
    }
  }

  // 获取边框宽度
  _getDomElBorderWidth() {
    const computedStyle = window.getComputedStyle(this.domEl);
    const borderLeftWidth = parseInt(computedStyle.borderLeftWidth, 10);
    const borderTopWidth = parseInt(computedStyle.borderTopWidth, 10);
    const borderBottomWidth = parseInt(computedStyle.borderBottomWidth, 10);
    const borderRightWidth = parseInt(computedStyle.borderRightWidth, 10);
    return {
      borderLeftWidth,
      borderTopWidth,
      borderBottomWidth,
      borderRightWidth
    };
  }

  _drag() {
    const targetDragEl = this.dragDomEl ?? this.domEl;
    targetDragEl.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      // 记录鼠标按下时的坐标
      const startX = event.clientX;
      const startY = event.clientY;
      // 记录元素相对于浏览器窗口的坐标以及宽度和高度
      const { width, height, left, top } = this.domEl.getBoundingClientRect();

      document.onmousemove = (event) => {
        const distanceX = Math.max(0, Math.min(left + event.clientX - startX, window.innerWidth - width));
        const distanceY = Math.max(0, Math.min(top + event.clientY - startY, window.innerHeight - height));
        if (this.eventCenter.drag) {
          const eventObj = this._createEventObj("drag", {
            width,
            height,
            left: distanceX,
            top: distanceY
          });
          this.eventCenter.drag(eventObj);
        }
        this.domEl.style.left = distanceX + "px";
        this.domEl.style.top = distanceY + "px";
      };

      document.onmouseup = () => {
        document.onmousemove = null;
      };
    });
  }

  _zoom() {
    this._addCorner();
    this._addBorder();
  }

  // 添加角
  _addCorner() {
    const { borderLeftWidth, borderTopWidth, borderBottomWidth, borderRightWidth } = this._getDomElBorderWidth();

    // leftTop：左上角
    if (!this.options.limitZoomArea.includes("leftTop")) {
      const leftTop = document.createElement("div");
      leftTop.style.width = this.options.cornerSize + "px";
      leftTop.style.height = this.options.cornerSize + "px";
      leftTop.style.position = "absolute";
      leftTop.style.left = -(this.options.cornerSize / 2 + borderLeftWidth) + "px";
      leftTop.style.top = -(this.options.cornerSize / 2 + borderTopWidth) + "px";
      leftTop.style.cursor = "nw-resize";
      this.domEl.append(leftTop);
      this._leftTopZoom(leftTop);
    }

    // rightTop：右上角
    if (!this.options.limitZoomArea.includes("rightTop")) {
      const rightTop = document.createElement("div");
      rightTop.style.width = this.options.cornerSize + "px";
      rightTop.style.height = this.options.cornerSize + "px";
      rightTop.style.position = "absolute";
      rightTop.style.right = -(this.options.cornerSize / 2 + borderRightWidth) + "px";
      rightTop.style.top = -(this.options.cornerSize / 2 + borderTopWidth) + "px";
      rightTop.style.cursor = "ne-resize";
      this.domEl.append(rightTop);
      this._rightTopZoom(rightTop);
    }

    // rightBottom：右下角
    if (!this.options.limitZoomArea.includes("rightBottom")) {
      const rightBottom = document.createElement("div");
      rightBottom.style.width = this.options.cornerSize + "px";
      rightBottom.style.height = this.options.cornerSize + "px";
      rightBottom.style.position = "absolute";
      rightBottom.style.right = -(this.options.cornerSize / 2 + borderRightWidth) + "px";
      rightBottom.style.bottom = -(this.options.cornerSize / 2 + borderBottomWidth) + "px";
      rightBottom.style.cursor = "se-resize";
      this.domEl.append(rightBottom);
      this._rightBottomZoom(rightBottom);
    }

    // leftBottom：左下角
    if (!this.options.limitZoomArea.includes("leftBottom")) {
      const leftBottom = document.createElement("div");
      leftBottom.style.width = this.options.cornerSize + "px";
      leftBottom.style.height = this.options.cornerSize + "px";
      leftBottom.style.position = "absolute";
      leftBottom.style.left = -(this.options.cornerSize / 2 + borderLeftWidth) + "px";
      leftBottom.style.bottom = -(this.options.cornerSize / 2 + borderBottomWidth) + "px";
      leftBottom.style.cursor = "sw-resize";
      this.domEl.append(leftBottom);
      this._leftBottomZoom(leftBottom);
    }
  }

  // 添加边
  _addBorder() {
    const { borderLeftWidth, borderTopWidth, borderBottomWidth, borderRightWidth } = this._getDomElBorderWidth();

    // left：左边
    if (!this.options.limitZoomArea.includes("left")) {
      const left = document.createElement("div");
      left.style.width = this.options.borderSize + "px";
      left.style.height = `calc(100% + ${borderTopWidth + borderBottomWidth}px - ${this.options.cornerSize}px)`;
      left.style.position = "absolute";
      left.style.left = -(this.options.borderSize / 2 + borderLeftWidth) + "px";
      left.style.top = this.options.cornerSize / 2 - borderTopWidth + "px";
      left.style.cursor = "col-resize";
      this.domEl.append(left);
      this._leftZoom(left);
    }

    // top：上边
    if (!this.options.limitZoomArea.includes("top")) {
      const top = document.createElement("div");
      top.style.width = `calc(100% + ${borderLeftWidth + borderRightWidth}px - ${this.options.cornerSize}px)`;
      top.style.height = this.options.borderSize + "px";
      top.style.position = "absolute";
      top.style.left = this.options.cornerSize / 2 - borderLeftWidth + "px";
      top.style.top = -(this.options.borderSize / 2 + borderTopWidth) + "px";
      top.style.cursor = "row-resize";
      this.domEl.append(top);
      this._topZoom(top);
    }

    // right：右边
    if (!this.options.limitZoomArea.includes("right")) {
      const right = document.createElement("div");
      right.style.width = this.options.borderSize + "px";
      right.style.height = `calc(100% + ${borderTopWidth + borderBottomWidth}px - ${this.options.cornerSize}px)`;
      right.style.position = "absolute";
      right.style.right = -(this.options.borderSize / 2 + borderRightWidth) + "px";
      right.style.top = this.options.cornerSize / 2 - borderTopWidth + "px";
      right.style.cursor = "col-resize";
      this.domEl.append(right);
      this._rightZoom(right);
    }

    // bottom：下边
    if (!this.options.limitZoomArea.includes("bottom")) {
      const bottom = document.createElement("div");
      bottom.style.width = `calc(100% + ${borderLeftWidth + borderRightWidth}px - ${this.options.cornerSize}px)`;
      bottom.style.height = this.options.borderSize + "px";
      bottom.style.position = "absolute";
      bottom.style.left = this.options.cornerSize / 2 - borderLeftWidth + "px";
      bottom.style.bottom = -(this.options.borderSize / 2 + borderBottomWidth) + "px";
      bottom.style.cursor = "row-resize";
      this.domEl.append(bottom);
      this._bottomZoom(bottom);
    }
  }

  // 缩放：border
  _leftZoom(el) {
    el.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      const startX = event.clientX;
      const { width, height, left, top } = this.domEl.getBoundingClientRect();

      document.onmousemove = (event) => {
        const newWidth = Math.max(this.options.minWidth, Math.min(width + startX - event.clientX, width + left));
        const newHeight = height;
        const distanceX = Math.max(0, Math.min(left + event.clientX - startX, width + left - this.options.minWidth));
        const distanceY = top;
        if (this.eventCenter.resize) {
          const eventObj = this._createEventObj("resize_border", {
            width: newWidth,
            height: newHeight,
            left: distanceX,
            top: distanceY
          });
          this.eventCenter.resize(eventObj);
        }
        this.domEl.style.width = newWidth + "px";
        this.domEl.style.left = distanceX + "px";
      };

      document.onmouseup = () => {
        document.onmousemove = null;
      };
    });
  }

  _topZoom(el) {
    el.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      const startY = event.clientY;
      const { width, height, left, top } = this.domEl.getBoundingClientRect();

      document.onmousemove = (event) => {
        const newWidth = width;
        const newHeight = Math.max(this.options.minHeight, Math.min(height + startY - event.clientY, height + top));
        const distanceX = left;
        const distanceY = Math.max(0, Math.min(top + event.clientY - startY, height + top - this.options.minHeight));
        if (this.eventCenter.resize) {
          const eventObj = this._createEventObj("resize_border", {
            width: newWidth,
            height: newHeight,
            left: distanceX,
            top: distanceY
          });
          this.eventCenter.resize(eventObj);
        }
        this.domEl.style.height = newHeight + "px";
        this.domEl.style.top = distanceY + "px";
      };

      document.onmouseup = () => {
        document.onmousemove = null;
      };
    });
  }

  _rightZoom(el) {
    el.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      const startX = event.clientX;
      const { width, height, left, top } = this.domEl.getBoundingClientRect();

      document.onmousemove = (event) => {
        const newWidth = Math.max(
          this.options.minWidth,
          Math.min(width + event.clientX - startX, window.innerWidth - left)
        );
        const newHeight = height;
        const distanceX = left;
        const distanceY = top;
        if (this.eventCenter.resize) {
          const eventObj = this._createEventObj("resize_border", {
            width: newWidth,
            height: newHeight,
            left: distanceX,
            top: distanceY
          });
          this.eventCenter.resize(eventObj);
        }
        this.domEl.style.width = newWidth + "px";
        this.domEl.style.left = distanceX + "px";
      };

      document.onmouseup = () => {
        document.onmousemove = null;
      };
    });
  }

  _bottomZoom(el) {
    el.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      const startY = event.clientY;
      const { width, height, left, top } = this.domEl.getBoundingClientRect();

      document.onmousemove = (event) => {
        const newWidth = width;
        const newHeight = Math.max(
          this.options.minHeight,
          Math.min(height + event.clientY - startY, window.innerHeight - top)
        );
        const distanceX = left;
        const distanceY = top;
        if (this.eventCenter.resize) {
          const eventObj = this._createEventObj("resize_border", {
            width: newWidth,
            height: newHeight,
            left: distanceX,
            top: distanceY
          });
          this.eventCenter.resize(eventObj);
        }
        this.domEl.style.height = newHeight + "px";
        this.domEl.style.top = distanceY + "px";
      };

      document.onmouseup = () => {
        document.onmousemove = null;
      };
    });
  }

  // 缩放：corner
  _leftTopZoom(el) {
    el.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      // 记录鼠标按下时的坐标
      const startX = event.clientX;
      const startY = event.clientY;
      // 记录元素相对于浏览器窗口的坐标以及宽度和高度
      const { width, height, left, top } = this.domEl.getBoundingClientRect();

      document.onmousemove = (event) => {
        const newWidth = Math.max(this.options.minWidth, Math.min(width + startX - event.clientX, width + left));
        const newHeight = Math.max(this.options.minHeight, Math.min(height + startY - event.clientY, height + top));
        const distanceX = Math.max(0, Math.min(left + event.clientX - startX, width + left - this.options.minWidth));
        const distanceY = Math.max(0, Math.min(top + event.clientY - startY, height + top - this.options.minHeight));
        if (this.eventCenter.resize) {
          const eventObj = this._createEventObj("resize_corner", {
            width: newWidth,
            height: newHeight,
            left: distanceX,
            top: distanceY
          });
          this.eventCenter.resize(eventObj);
        }
        this.domEl.style.width = newWidth + "px";
        this.domEl.style.height = newHeight + "px";
        this.domEl.style.left = distanceX + "px";
        this.domEl.style.top = distanceY + "px";
      };

      document.onmouseup = () => {
        document.onmousemove = null;
      };
    });
  }

  _rightTopZoom(el) {
    el.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      // 记录鼠标按下时的坐标
      const startX = event.clientX;
      const startY = event.clientY;
      // 记录元素相对于浏览器窗口的坐标以及宽度和高度
      const { width, height, left, top } = this.domEl.getBoundingClientRect();

      document.onmousemove = (event) => {
        const newWidth = Math.max(
          this.options.minWidth,
          Math.min(width + event.clientX - startX, window.innerWidth - left)
        );
        const newHeight = Math.max(this.options.minHeight, Math.min(height + startY - event.clientY, height + top));
        const distanceX = left;
        const distanceY = Math.max(0, Math.min(top + event.clientY - startY, height + top - this.options.minHeight));
        if (this.eventCenter.resize) {
          const eventObj = this._createEventObj("resize_corner", {
            width: newWidth,
            height: newHeight,
            left: distanceX,
            top: distanceY
          });
          this.eventCenter.resize(eventObj);
        }
        this.domEl.style.width = newWidth + "px";
        this.domEl.style.height = newHeight + "px";
        this.domEl.style.left = distanceX + "px";
        this.domEl.style.top = distanceY + "px";
      };

      document.onmouseup = () => {
        document.onmousemove = null;
      };
    });
  }

  _rightBottomZoom(el) {
    el.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      // 记录鼠标按下时的坐标
      const startX = event.clientX;
      const startY = event.clientY;
      // 记录元素相对于浏览器窗口的坐标以及宽度和高度
      const { width, height, left, top } = this.domEl.getBoundingClientRect();

      document.onmousemove = (event) => {
        const newWidth = Math.max(
          this.options.minWidth,
          Math.min(width + event.clientX - startX, window.innerWidth - left)
        );
        const newHeight = Math.max(
          this.options.minHeight,
          Math.min(height + event.clientY - startY, window.innerHeight - top)
        );
        const distanceX = left;
        const distanceY = top;
        if (this.eventCenter.resize) {
          const eventObj = this._createEventObj("resize_corner", {
            width: newWidth,
            height: newHeight,
            left: distanceX,
            top: distanceY
          });
          this.eventCenter.resize(eventObj);
        }
        this.domEl.style.width = newWidth + "px";
        this.domEl.style.height = newHeight + "px";
        this.domEl.style.left = distanceX + "px";
        this.domEl.style.top = distanceY + "px";
      };

      document.onmouseup = () => {
        document.onmousemove = null;
      };
    });
  }

  _leftBottomZoom(el) {
    el.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      // 记录鼠标按下时的坐标
      const startX = event.clientX;
      const startY = event.clientY;
      // 记录元素相对于浏览器窗口的坐标以及宽度和高度
      const { width, height, left, top } = this.domEl.getBoundingClientRect();

      document.onmousemove = (event) => {
        const newWidth = Math.max(this.options.minWidth, Math.min(width + startX - event.clientX, width + left));
        const newHeight = Math.max(
          this.options.minHeight,
          Math.min(height + event.clientY - startY, window.innerHeight - top)
        );
        const distanceX = Math.max(0, Math.min(left + event.clientX - startX, width + left - this.options.minWidth));
        const distanceY = top;
        if (this.eventCenter.resize) {
          const eventObj = this._createEventObj("resize_corner", {
            width: newWidth,
            height: newHeight,
            left: distanceX,
            top: distanceY
          });
          this.eventCenter.resize(eventObj);
        }
        this.domEl.style.width = newWidth + "px";
        this.domEl.style.height = newHeight + "px";
        this.domEl.style.left = distanceX + "px";
        this.domEl.style.top = distanceY + "px";
      };

      document.onmouseup = () => {
        document.onmousemove = null;
      };
    });
  }

  _createEventObj(name, data) {
    return { name, data };
  }

  // 设置全屏
  setFullScreen() {
    // 记录设置全屏时的状态
    this.record = {
      left: this.domEl.style.left,
      top: this.domEl.style.top,
      width: this.domEl.style.width,
      height: this.domEl.style.height
    };

    this.domEl.style.left = 0;
    this.domEl.style.top = 0;
    this.domEl.style.width = window.innerWidth + "px";
    this.domEl.style.height = window.innerHeight + "px";
  }

  // 退出全屏
  exitFullScreen() {
    if (this.record) {
      const { left, top, width, height } = this.record;
      this.domEl.style.left = left;
      this.domEl.style.top = top;
      this.domEl.style.width = width;
      this.domEl.style.height = height;
    }
  }

  // 设置最小宽度
  setMinWidth(value) {
    const { width } = this.domEl.getBoundingClientRect();
    if (width < value) {
      this.domEl.style.width = value + "px";
    }
    this.options.minWidth = value;
  }

  // 设置最小高度
  setMinHeight(value) {
    const { height } = this.domEl.getBoundingClientRect();
    if (height < value) {
      this.domEl.style.height = value + "px";
    }
    this.options.minHeight = value;
  }

  // 添加事件监听
  addEventListener(eventName, listener) {
    this.eventCenter[eventName] = listener;
  }
  // 移除事件监听
  removeEventListener(eventName) {
    this.eventCenter[eventName] = null;
    delete this.eventCenter[eventName];
  }
}

export { DragResizeBox as default };
