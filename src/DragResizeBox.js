const defaultOptions = {
  zoom: true,
  minWidth: 0,
  minHeight: 0,
  zIndex: 9999,
  dragSelector: null,
  left: 0,
  top: 0,
  cornerSize: 16,
  borderSize: 12,
  center: false
};

class DragResizeBox {
  constructor(domEl, options) {
    this.options = Object.assign({ ...defaultOptions }, options);
    this.domEl = domEl;
    this.dragDomEl = document.querySelector(this.options.dragSelector);
    if (this.options.dragSelector !== null && !this.dragDomEl) {
      throw new Error("Options Error: dragSelector is invalid.");
    }
    this.init();
  }

  init() {
    this.domEl.style.position = "fixed";
    if (this.options.center) {
      const { width, height } = this.domEl.getBoundingClientRect();
      this.domEl.style.left = `calc(50% - ${width / 2}px)`;
      this.domEl.style.top = `calc(50% - ${height / 2}px)`;
    } else {
      this.domEl.style.left = this.options.left + "px";
      this.domEl.style.top = this.options.top + "px";
    }
    this.domEl.style.zIndex = this.options.zIndex;
    this.domEl.style.cursor = this.options.dragSelector === null ? "move" : "auto";
    this.domEl.style.overflow = "hidden";
    // 阻止默认拖拽行为
    this.domEl.ondragstart = (event) => event.preventDefault();
    if (this.dragDomEl) {
      this.dragDomEl.style.cursor = "move";
    }
    if (this.options.zoom) {
      this.zoom();
    }
    this.drag();
  }

  // 获取边框宽度
  getDomElBorderWidth() {
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

  drag() {
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
        this.domEl.style.left = distanceX + "px";
        this.domEl.style.top = distanceY + "px";
      };

      document.onmouseup = () => {
        document.onmousemove = null;
      };
    });
  }

  zoom() {
    this.addCorner();
    this.addBorder();
  }

  // 添加角
  addCorner() {
    const leftTop = document.createElement("div");
    const rightTop = document.createElement("div");
    const rightBottom = document.createElement("div");
    const leftBottom = document.createElement("div");
    const { borderLeftWidth, borderTopWidth, borderBottomWidth, borderRightWidth } = this.getDomElBorderWidth();

    // leftTop：左上角
    leftTop.style.width = this.options.cornerSize + "px";
    leftTop.style.height = this.options.cornerSize + "px";
    leftTop.style.position = "absolute";
    leftTop.style.left = -(this.options.cornerSize / 2 + borderLeftWidth) + "px";
    leftTop.style.top = -(this.options.cornerSize / 2 + borderTopWidth) + "px";
    leftTop.style.cursor = "nw-resize";
    // leftTop.style.backgroundColor = "green";

    // rightTop：右上角
    rightTop.style.width = this.options.cornerSize + "px";
    rightTop.style.height = this.options.cornerSize + "px";
    rightTop.style.position = "absolute";
    rightTop.style.right = -(this.options.cornerSize / 2 + borderRightWidth) + "px";
    rightTop.style.top = -(this.options.cornerSize / 2 + borderTopWidth) + "px";
    rightTop.style.cursor = "ne-resize";
    // rightTop.style.backgroundColor = "green";

    // rightBottom：右下角
    rightBottom.style.width = this.options.cornerSize + "px";
    rightBottom.style.height = this.options.cornerSize + "px";
    rightBottom.style.position = "absolute";
    rightBottom.style.right = -(this.options.cornerSize / 2 + borderRightWidth) + "px";
    rightBottom.style.bottom = -(this.options.cornerSize / 2 + borderBottomWidth) + "px";
    rightBottom.style.cursor = "se-resize";
    // rightBottom.style.backgroundColor = "green";

    // leftBottom：左下角
    leftBottom.style.width = this.options.cornerSize + "px";
    leftBottom.style.height = this.options.cornerSize + "px";
    leftBottom.style.position = "absolute";
    leftBottom.style.left = -(this.options.cornerSize / 2 + borderLeftWidth) + "px";
    leftBottom.style.bottom = -(this.options.cornerSize / 2 + borderBottomWidth) + "px";
    leftBottom.style.cursor = "sw-resize";
    // leftBottom.style.backgroundColor = "green";

    this.domEl.append(leftTop);
    this.domEl.append(rightTop);
    this.domEl.append(rightBottom);
    this.domEl.append(leftBottom);

    this.leftTopZoom(leftTop);
    this.rightTopZoom(rightTop);
    this.rightBottomZoom(rightBottom);
    this.leftBottomZoom(leftBottom);
  }

  // 添加边
  addBorder() {
    const left = document.createElement("div");
    const top = document.createElement("div");
    const right = document.createElement("div");
    const bottom = document.createElement("div");
    const { borderLeftWidth, borderTopWidth, borderBottomWidth, borderRightWidth } = this.getDomElBorderWidth();

    // left：左边
    left.style.width = this.options.borderSize + "px";
    left.style.height = `calc(100% + ${borderTopWidth + borderBottomWidth}px - ${this.options.cornerSize}px)`;
    left.style.position = "absolute";
    left.style.left = -(this.options.borderSize / 2 + borderLeftWidth) + "px";
    left.style.top = this.options.cornerSize / 2 - borderTopWidth + "px";
    left.style.cursor = "col-resize";
    // left.style.backgroundColor = "blue";

    // top：上边
    top.style.width = `calc(100% + ${borderLeftWidth + borderRightWidth}px - ${this.options.cornerSize}px)`;
    top.style.height = this.options.borderSize + "px";
    top.style.position = "absolute";
    top.style.left = this.options.cornerSize / 2 - borderLeftWidth + "px";
    top.style.top = -(this.options.borderSize / 2 + borderTopWidth) + "px";
    top.style.cursor = "row-resize";
    // top.style.backgroundColor = "blue";

    // right：右边
    right.style.width = this.options.borderSize + "px";
    right.style.height = `calc(100% + ${borderTopWidth + borderBottomWidth}px - ${this.options.cornerSize}px)`;
    right.style.position = "absolute";
    right.style.right = -(this.options.borderSize / 2 + borderRightWidth) + "px";
    right.style.top = this.options.cornerSize / 2 - borderTopWidth + "px";
    right.style.cursor = "col-resize";
    // right.style.backgroundColor = "blue";

    // bottom：下边
    bottom.style.width = `calc(100% + ${borderLeftWidth + borderRightWidth}px - ${this.options.cornerSize}px)`;
    bottom.style.height = this.options.borderSize + "px";
    bottom.style.position = "absolute";
    bottom.style.left = this.options.cornerSize / 2 - borderLeftWidth + "px";
    bottom.style.bottom = -(this.options.borderSize / 2 + borderBottomWidth) + "px";
    bottom.style.cursor = "row-resize";
    // bottom.style.backgroundColor = "blue";

    this.domEl.append(left);
    this.domEl.append(top);
    this.domEl.append(right);
    this.domEl.append(bottom);

    this.leftZoom(left);
    this.topZoom(top);
    this.rightZoom(right);
    this.bottomZoom(bottom);
  }

  // 缩放：border
  leftZoom(el) {
    el.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      const startX = event.clientX;
      const { width, left } = this.domEl.getBoundingClientRect();

      document.onmousemove = (event) => {
        const newWidth = Math.max(this.options.minWidth, Math.min(width + startX - event.clientX, width + left));
        const distanceX = Math.max(0, Math.min(left + event.clientX - startX, width + left - this.options.minWidth));
        // console.log("width:", newWidth);
        // console.log("left:", distanceX);
        this.domEl.style.width = newWidth + "px";
        this.domEl.style.left = distanceX + "px";
      };

      document.onmouseup = () => {
        document.onmousemove = null;
      };
    });
  }

  topZoom(el) {
    el.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      const startY = event.clientY;
      const { height, top } = this.domEl.getBoundingClientRect();

      document.onmousemove = (event) => {
        const newHeight = Math.max(this.options.minHeight, Math.min(height + startY - event.clientY, height + top));
        const distanceY = Math.max(0, Math.min(top + event.clientY - startY, height + top - this.options.minHeight));
        // console.log("height:", newHeight);
        // console.log("top:", distanceY);
        this.domEl.style.height = newHeight + "px";
        this.domEl.style.top = distanceY + "px";
      };

      document.onmouseup = () => {
        document.onmousemove = null;
      };
    });
  }

  rightZoom(el) {
    el.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      const startX = event.clientX;
      const { width, left } = this.domEl.getBoundingClientRect();

      document.onmousemove = (event) => {
        const newWidth = Math.max(
          this.options.minWidth,
          Math.min(width + event.clientX - startX, window.innerWidth - left)
        );
        const distanceX = left;
        // console.log("width:", newWidth);
        // console.log("left:", distanceX);
        this.domEl.style.width = newWidth + "px";
        this.domEl.style.left = distanceX + "px";
      };

      document.onmouseup = () => {
        document.onmousemove = null;
      };
    });
  }

  bottomZoom(el) {
    el.addEventListener("mousedown", (event) => {
      event.stopPropagation();
      const startY = event.clientY;
      const { height, top } = this.domEl.getBoundingClientRect();

      document.onmousemove = (event) => {
        const newHeight = Math.max(
          this.options.minHeight,
          Math.min(height + event.clientY - startY, window.innerHeight - top)
        );
        const distanceY = top;
        // console.log("height:", newHeight);
        // console.log("top:", distanceY);
        this.domEl.style.height = newHeight + "px";
        this.domEl.style.top = distanceY + "px";
      };

      document.onmouseup = () => {
        document.onmousemove = null;
      };
    });
  }

  // 缩放：corner
  leftTopZoom(el) {
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
        // console.log("width:", newWidth);
        // console.log("height:", newHeight);
        // console.log("left:", distanceX);
        // console.log("top:", distanceY);
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

  rightTopZoom(el) {
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
        // console.log("width:", newWidth);
        // console.log("height:", newHeight);
        // console.log("left:", distanceX);
        // console.log("top:", distanceY);
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

  rightBottomZoom(el) {
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
        // console.log("width:", newWidth);
        // console.log("height:", newHeight);
        // console.log("left:", distanceX);
        // console.log("top:", distanceY);
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

  leftBottomZoom(el) {
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
        // console.log("width:", newWidth);
        // console.log("height:", newHeight);
        // console.log("left:", distanceX);
        // console.log("top:", distanceY);
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
}

export default DragResizeBox;
