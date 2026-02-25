import "./chunk-PR4QN5HX.js";

// node_modules/roughjs/bundled/rough.esm.js
function t(t2, e2, s2) {
  if (t2 && t2.length) {
    const [n2, a2] = e2, o2 = Math.PI / 180 * s2, h2 = Math.cos(o2), r2 = Math.sin(o2);
    for (const e3 of t2) {
      const [t3, s3] = e3;
      e3[0] = (t3 - n2) * h2 - (s3 - a2) * r2 + n2, e3[1] = (t3 - n2) * r2 + (s3 - a2) * h2 + a2;
    }
  }
}
function e(t2, e2) {
  return t2[0] === e2[0] && t2[1] === e2[1];
}
function s(s2, n2, a2, o2 = 1) {
  const h2 = a2, r2 = Math.max(n2, 0.1), i2 = s2[0] && s2[0][0] && "number" == typeof s2[0][0] ? [s2] : s2, c2 = [0, 0];
  if (h2) for (const e2 of i2) t(e2, c2, h2);
  const l2 = function(t2, s3, n3) {
    const a3 = [];
    for (const s4 of t2) {
      const t3 = [...s4];
      e(t3[0], t3[t3.length - 1]) || t3.push([t3[0][0], t3[0][1]]), t3.length > 2 && a3.push(t3);
    }
    const o3 = [];
    s3 = Math.max(s3, 0.1);
    const h3 = [];
    for (const t3 of a3) for (let e2 = 0; e2 < t3.length - 1; e2++) {
      const s4 = t3[e2], n4 = t3[e2 + 1];
      if (s4[1] !== n4[1]) {
        const t4 = Math.min(s4[1], n4[1]);
        h3.push({ ymin: t4, ymax: Math.max(s4[1], n4[1]), x: t4 === s4[1] ? s4[0] : n4[0], islope: (n4[0] - s4[0]) / (n4[1] - s4[1]) });
      }
    }
    if (h3.sort((t3, e2) => t3.ymin < e2.ymin ? -1 : t3.ymin > e2.ymin ? 1 : t3.x < e2.x ? -1 : t3.x > e2.x ? 1 : t3.ymax === e2.ymax ? 0 : (t3.ymax - e2.ymax) / Math.abs(t3.ymax - e2.ymax)), !h3.length) return o3;
    let r3 = [], i3 = h3[0].ymin, c3 = 0;
    for (; r3.length || h3.length; ) {
      if (h3.length) {
        let t3 = -1;
        for (let e2 = 0; e2 < h3.length && !(h3[e2].ymin > i3); e2++) t3 = e2;
        h3.splice(0, t3 + 1).forEach((t4) => {
          r3.push({ s: i3, edge: t4 });
        });
      }
      if (r3 = r3.filter((t3) => !(t3.edge.ymax <= i3)), r3.sort((t3, e2) => t3.edge.x === e2.edge.x ? 0 : (t3.edge.x - e2.edge.x) / Math.abs(t3.edge.x - e2.edge.x)), (1 !== n3 || c3 % s3 == 0) && r3.length > 1) for (let t3 = 0; t3 < r3.length; t3 += 2) {
        const e2 = t3 + 1;
        if (e2 >= r3.length) break;
        const s4 = r3[t3].edge, n4 = r3[e2].edge;
        o3.push([[Math.round(s4.x), i3], [Math.round(n4.x), i3]]);
      }
      i3 += n3, r3.forEach((t3) => {
        t3.edge.x = t3.edge.x + n3 * t3.edge.islope;
      }), c3++;
    }
    return o3;
  }(i2, r2, o2);
  if (h2) {
    for (const e2 of i2) t(e2, c2, -h2);
    !function(e2, s3, n3) {
      const a3 = [];
      e2.forEach((t2) => a3.push(...t2)), t(a3, s3, n3);
    }(l2, c2, -h2);
  }
  return l2;
}
function n(t2, e2) {
  var n2;
  const a2 = e2.hachureAngle + 90;
  let o2 = e2.hachureGap;
  o2 < 0 && (o2 = 4 * e2.strokeWidth), o2 = Math.max(o2, 0.1);
  let h2 = 1;
  return e2.roughness >= 1 && ((null === (n2 = e2.randomizer) || void 0 === n2 ? void 0 : n2.next()) || Math.random()) > 0.7 && (h2 = o2), s(t2, o2, a2, h2 || 1);
}
var a = class {
  constructor(t2) {
    this.helper = t2;
  }
  fillPolygons(t2, e2) {
    return this._fillPolygons(t2, e2);
  }
  _fillPolygons(t2, e2) {
    const s2 = n(t2, e2);
    return { type: "fillSketch", ops: this.renderLines(s2, e2) };
  }
  renderLines(t2, e2) {
    const s2 = [];
    for (const n2 of t2) s2.push(...this.helper.doubleLineOps(n2[0][0], n2[0][1], n2[1][0], n2[1][1], e2));
    return s2;
  }
};
function o(t2) {
  const e2 = t2[0], s2 = t2[1];
  return Math.sqrt(Math.pow(e2[0] - s2[0], 2) + Math.pow(e2[1] - s2[1], 2));
}
var h = class extends a {
  fillPolygons(t2, e2) {
    let s2 = e2.hachureGap;
    s2 < 0 && (s2 = 4 * e2.strokeWidth), s2 = Math.max(s2, 0.1);
    const a2 = n(t2, Object.assign({}, e2, { hachureGap: s2 })), h2 = Math.PI / 180 * e2.hachureAngle, r2 = [], i2 = 0.5 * s2 * Math.cos(h2), c2 = 0.5 * s2 * Math.sin(h2);
    for (const [t3, e3] of a2) o([t3, e3]) && r2.push([[t3[0] - i2, t3[1] + c2], [...e3]], [[t3[0] + i2, t3[1] - c2], [...e3]]);
    return { type: "fillSketch", ops: this.renderLines(r2, e2) };
  }
};
var r = class extends a {
  fillPolygons(t2, e2) {
    const s2 = this._fillPolygons(t2, e2), n2 = Object.assign({}, e2, { hachureAngle: e2.hachureAngle + 90 }), a2 = this._fillPolygons(t2, n2);
    return s2.ops = s2.ops.concat(a2.ops), s2;
  }
};
var i = class {
  constructor(t2) {
    this.helper = t2;
  }
  fillPolygons(t2, e2) {
    const s2 = n(t2, e2 = Object.assign({}, e2, { hachureAngle: 0 }));
    return this.dotsOnLines(s2, e2);
  }
  dotsOnLines(t2, e2) {
    const s2 = [];
    let n2 = e2.hachureGap;
    n2 < 0 && (n2 = 4 * e2.strokeWidth), n2 = Math.max(n2, 0.1);
    let a2 = e2.fillWeight;
    a2 < 0 && (a2 = e2.strokeWidth / 2);
    const h2 = n2 / 4;
    for (const r2 of t2) {
      const t3 = o(r2), i2 = t3 / n2, c2 = Math.ceil(i2) - 1, l2 = t3 - c2 * n2, u2 = (r2[0][0] + r2[1][0]) / 2 - n2 / 4, p2 = Math.min(r2[0][1], r2[1][1]);
      for (let t4 = 0; t4 < c2; t4++) {
        const o2 = p2 + l2 + t4 * n2, r3 = u2 - h2 + 2 * Math.random() * h2, i3 = o2 - h2 + 2 * Math.random() * h2, c3 = this.helper.ellipse(r3, i3, a2, a2, e2);
        s2.push(...c3.ops);
      }
    }
    return { type: "fillSketch", ops: s2 };
  }
};
var c = class {
  constructor(t2) {
    this.helper = t2;
  }
  fillPolygons(t2, e2) {
    const s2 = n(t2, e2);
    return { type: "fillSketch", ops: this.dashedLine(s2, e2) };
  }
  dashedLine(t2, e2) {
    const s2 = e2.dashOffset < 0 ? e2.hachureGap < 0 ? 4 * e2.strokeWidth : e2.hachureGap : e2.dashOffset, n2 = e2.dashGap < 0 ? e2.hachureGap < 0 ? 4 * e2.strokeWidth : e2.hachureGap : e2.dashGap, a2 = [];
    return t2.forEach((t3) => {
      const h2 = o(t3), r2 = Math.floor(h2 / (s2 + n2)), i2 = (h2 + n2 - r2 * (s2 + n2)) / 2;
      let c2 = t3[0], l2 = t3[1];
      c2[0] > l2[0] && (c2 = t3[1], l2 = t3[0]);
      const u2 = Math.atan((l2[1] - c2[1]) / (l2[0] - c2[0]));
      for (let t4 = 0; t4 < r2; t4++) {
        const o2 = t4 * (s2 + n2), h3 = o2 + s2, r3 = [c2[0] + o2 * Math.cos(u2) + i2 * Math.cos(u2), c2[1] + o2 * Math.sin(u2) + i2 * Math.sin(u2)], l3 = [c2[0] + h3 * Math.cos(u2) + i2 * Math.cos(u2), c2[1] + h3 * Math.sin(u2) + i2 * Math.sin(u2)];
        a2.push(...this.helper.doubleLineOps(r3[0], r3[1], l3[0], l3[1], e2));
      }
    }), a2;
  }
};
var l = class {
  constructor(t2) {
    this.helper = t2;
  }
  fillPolygons(t2, e2) {
    const s2 = e2.hachureGap < 0 ? 4 * e2.strokeWidth : e2.hachureGap, a2 = e2.zigzagOffset < 0 ? s2 : e2.zigzagOffset, o2 = n(t2, e2 = Object.assign({}, e2, { hachureGap: s2 + a2 }));
    return { type: "fillSketch", ops: this.zigzagLines(o2, a2, e2) };
  }
  zigzagLines(t2, e2, s2) {
    const n2 = [];
    return t2.forEach((t3) => {
      const a2 = o(t3), h2 = Math.round(a2 / (2 * e2));
      let r2 = t3[0], i2 = t3[1];
      r2[0] > i2[0] && (r2 = t3[1], i2 = t3[0]);
      const c2 = Math.atan((i2[1] - r2[1]) / (i2[0] - r2[0]));
      for (let t4 = 0; t4 < h2; t4++) {
        const a3 = 2 * t4 * e2, o2 = 2 * (t4 + 1) * e2, h3 = Math.sqrt(2 * Math.pow(e2, 2)), i3 = [r2[0] + a3 * Math.cos(c2), r2[1] + a3 * Math.sin(c2)], l2 = [r2[0] + o2 * Math.cos(c2), r2[1] + o2 * Math.sin(c2)], u2 = [i3[0] + h3 * Math.cos(c2 + Math.PI / 4), i3[1] + h3 * Math.sin(c2 + Math.PI / 4)];
        n2.push(...this.helper.doubleLineOps(i3[0], i3[1], u2[0], u2[1], s2), ...this.helper.doubleLineOps(u2[0], u2[1], l2[0], l2[1], s2));
      }
    }), n2;
  }
};
var u = {};
var p = class {
  constructor(t2) {
    this.seed = t2;
  }
  next() {
    return this.seed ? (2 ** 31 - 1 & (this.seed = Math.imul(48271, this.seed))) / 2 ** 31 : Math.random();
  }
};
var f = 0;
var d = 1;
var g = 2;
var M = { A: 7, a: 7, C: 6, c: 6, H: 1, h: 1, L: 2, l: 2, M: 2, m: 2, Q: 4, q: 4, S: 4, s: 4, T: 2, t: 2, V: 1, v: 1, Z: 0, z: 0 };
function k(t2, e2) {
  return t2.type === e2;
}
function b(t2) {
  const e2 = [], s2 = function(t3) {
    const e3 = new Array();
    for (; "" !== t3; ) if (t3.match(/^([ \t\r\n,]+)/)) t3 = t3.substr(RegExp.$1.length);
    else if (t3.match(/^([aAcChHlLmMqQsStTvVzZ])/)) e3[e3.length] = { type: f, text: RegExp.$1 }, t3 = t3.substr(RegExp.$1.length);
    else {
      if (!t3.match(/^(([-+]?[0-9]+(\.[0-9]*)?|[-+]?\.[0-9]+)([eE][-+]?[0-9]+)?)/)) return [];
      e3[e3.length] = { type: d, text: `${parseFloat(RegExp.$1)}` }, t3 = t3.substr(RegExp.$1.length);
    }
    return e3[e3.length] = { type: g, text: "" }, e3;
  }(t2);
  let n2 = "BOD", a2 = 0, o2 = s2[a2];
  for (; !k(o2, g); ) {
    let h2 = 0;
    const r2 = [];
    if ("BOD" === n2) {
      if ("M" !== o2.text && "m" !== o2.text) return b("M0,0" + t2);
      a2++, h2 = M[o2.text], n2 = o2.text;
    } else k(o2, d) ? h2 = M[n2] : (a2++, h2 = M[o2.text], n2 = o2.text);
    if (!(a2 + h2 < s2.length)) throw new Error("Path data ended short");
    for (let t3 = a2; t3 < a2 + h2; t3++) {
      const e3 = s2[t3];
      if (!k(e3, d)) throw new Error("Param not a number: " + n2 + "," + e3.text);
      r2[r2.length] = +e3.text;
    }
    if ("number" != typeof M[n2]) throw new Error("Bad segment: " + n2);
    {
      const t3 = { key: n2, data: r2 };
      e2.push(t3), a2 += h2, o2 = s2[a2], "M" === n2 && (n2 = "L"), "m" === n2 && (n2 = "l");
    }
  }
  return e2;
}
function y(t2) {
  let e2 = 0, s2 = 0, n2 = 0, a2 = 0;
  const o2 = [];
  for (const { key: h2, data: r2 } of t2) switch (h2) {
    case "M":
      o2.push({ key: "M", data: [...r2] }), [e2, s2] = r2, [n2, a2] = r2;
      break;
    case "m":
      e2 += r2[0], s2 += r2[1], o2.push({ key: "M", data: [e2, s2] }), n2 = e2, a2 = s2;
      break;
    case "L":
      o2.push({ key: "L", data: [...r2] }), [e2, s2] = r2;
      break;
    case "l":
      e2 += r2[0], s2 += r2[1], o2.push({ key: "L", data: [e2, s2] });
      break;
    case "C":
      o2.push({ key: "C", data: [...r2] }), e2 = r2[4], s2 = r2[5];
      break;
    case "c": {
      const t3 = r2.map((t4, n3) => n3 % 2 ? t4 + s2 : t4 + e2);
      o2.push({ key: "C", data: t3 }), e2 = t3[4], s2 = t3[5];
      break;
    }
    case "Q":
      o2.push({ key: "Q", data: [...r2] }), e2 = r2[2], s2 = r2[3];
      break;
    case "q": {
      const t3 = r2.map((t4, n3) => n3 % 2 ? t4 + s2 : t4 + e2);
      o2.push({ key: "Q", data: t3 }), e2 = t3[2], s2 = t3[3];
      break;
    }
    case "A":
      o2.push({ key: "A", data: [...r2] }), e2 = r2[5], s2 = r2[6];
      break;
    case "a":
      e2 += r2[5], s2 += r2[6], o2.push({ key: "A", data: [r2[0], r2[1], r2[2], r2[3], r2[4], e2, s2] });
      break;
    case "H":
      o2.push({ key: "H", data: [...r2] }), e2 = r2[0];
      break;
    case "h":
      e2 += r2[0], o2.push({ key: "H", data: [e2] });
      break;
    case "V":
      o2.push({ key: "V", data: [...r2] }), s2 = r2[0];
      break;
    case "v":
      s2 += r2[0], o2.push({ key: "V", data: [s2] });
      break;
    case "S":
      o2.push({ key: "S", data: [...r2] }), e2 = r2[2], s2 = r2[3];
      break;
    case "s": {
      const t3 = r2.map((t4, n3) => n3 % 2 ? t4 + s2 : t4 + e2);
      o2.push({ key: "S", data: t3 }), e2 = t3[2], s2 = t3[3];
      break;
    }
    case "T":
      o2.push({ key: "T", data: [...r2] }), e2 = r2[0], s2 = r2[1];
      break;
    case "t":
      e2 += r2[0], s2 += r2[1], o2.push({ key: "T", data: [e2, s2] });
      break;
    case "Z":
    case "z":
      o2.push({ key: "Z", data: [] }), e2 = n2, s2 = a2;
  }
  return o2;
}
function m(t2) {
  const e2 = [];
  let s2 = "", n2 = 0, a2 = 0, o2 = 0, h2 = 0, r2 = 0, i2 = 0;
  for (const { key: c2, data: l2 } of t2) {
    switch (c2) {
      case "M":
        e2.push({ key: "M", data: [...l2] }), [n2, a2] = l2, [o2, h2] = l2;
        break;
      case "C":
        e2.push({ key: "C", data: [...l2] }), n2 = l2[4], a2 = l2[5], r2 = l2[2], i2 = l2[3];
        break;
      case "L":
        e2.push({ key: "L", data: [...l2] }), [n2, a2] = l2;
        break;
      case "H":
        n2 = l2[0], e2.push({ key: "L", data: [n2, a2] });
        break;
      case "V":
        a2 = l2[0], e2.push({ key: "L", data: [n2, a2] });
        break;
      case "S": {
        let t3 = 0, o3 = 0;
        "C" === s2 || "S" === s2 ? (t3 = n2 + (n2 - r2), o3 = a2 + (a2 - i2)) : (t3 = n2, o3 = a2), e2.push({ key: "C", data: [t3, o3, ...l2] }), r2 = l2[0], i2 = l2[1], n2 = l2[2], a2 = l2[3];
        break;
      }
      case "T": {
        const [t3, o3] = l2;
        let h3 = 0, c3 = 0;
        "Q" === s2 || "T" === s2 ? (h3 = n2 + (n2 - r2), c3 = a2 + (a2 - i2)) : (h3 = n2, c3 = a2);
        const u2 = n2 + 2 * (h3 - n2) / 3, p2 = a2 + 2 * (c3 - a2) / 3, f2 = t3 + 2 * (h3 - t3) / 3, d2 = o3 + 2 * (c3 - o3) / 3;
        e2.push({ key: "C", data: [u2, p2, f2, d2, t3, o3] }), r2 = h3, i2 = c3, n2 = t3, a2 = o3;
        break;
      }
      case "Q": {
        const [t3, s3, o3, h3] = l2, c3 = n2 + 2 * (t3 - n2) / 3, u2 = a2 + 2 * (s3 - a2) / 3, p2 = o3 + 2 * (t3 - o3) / 3, f2 = h3 + 2 * (s3 - h3) / 3;
        e2.push({ key: "C", data: [c3, u2, p2, f2, o3, h3] }), r2 = t3, i2 = s3, n2 = o3, a2 = h3;
        break;
      }
      case "A": {
        const t3 = Math.abs(l2[0]), s3 = Math.abs(l2[1]), o3 = l2[2], h3 = l2[3], r3 = l2[4], i3 = l2[5], c3 = l2[6];
        if (0 === t3 || 0 === s3) e2.push({ key: "C", data: [n2, a2, i3, c3, i3, c3] }), n2 = i3, a2 = c3;
        else if (n2 !== i3 || a2 !== c3) {
          x(n2, a2, i3, c3, t3, s3, o3, h3, r3).forEach(function(t4) {
            e2.push({ key: "C", data: t4 });
          }), n2 = i3, a2 = c3;
        }
        break;
      }
      case "Z":
        e2.push({ key: "Z", data: [] }), n2 = o2, a2 = h2;
    }
    s2 = c2;
  }
  return e2;
}
function w(t2, e2, s2) {
  return [t2 * Math.cos(s2) - e2 * Math.sin(s2), t2 * Math.sin(s2) + e2 * Math.cos(s2)];
}
function x(t2, e2, s2, n2, a2, o2, h2, r2, i2, c2) {
  const l2 = (u2 = h2, Math.PI * u2 / 180);
  var u2;
  let p2 = [], f2 = 0, d2 = 0, g2 = 0, M2 = 0;
  if (c2) [f2, d2, g2, M2] = c2;
  else {
    [t2, e2] = w(t2, e2, -l2), [s2, n2] = w(s2, n2, -l2);
    const h3 = (t2 - s2) / 2, c3 = (e2 - n2) / 2;
    let u3 = h3 * h3 / (a2 * a2) + c3 * c3 / (o2 * o2);
    u3 > 1 && (u3 = Math.sqrt(u3), a2 *= u3, o2 *= u3);
    const p3 = a2 * a2, k3 = o2 * o2, b3 = p3 * k3 - p3 * c3 * c3 - k3 * h3 * h3, y3 = p3 * c3 * c3 + k3 * h3 * h3, m3 = (r2 === i2 ? -1 : 1) * Math.sqrt(Math.abs(b3 / y3));
    g2 = m3 * a2 * c3 / o2 + (t2 + s2) / 2, M2 = m3 * -o2 * h3 / a2 + (e2 + n2) / 2, f2 = Math.asin(parseFloat(((e2 - M2) / o2).toFixed(9))), d2 = Math.asin(parseFloat(((n2 - M2) / o2).toFixed(9))), t2 < g2 && (f2 = Math.PI - f2), s2 < g2 && (d2 = Math.PI - d2), f2 < 0 && (f2 = 2 * Math.PI + f2), d2 < 0 && (d2 = 2 * Math.PI + d2), i2 && f2 > d2 && (f2 -= 2 * Math.PI), !i2 && d2 > f2 && (d2 -= 2 * Math.PI);
  }
  let k2 = d2 - f2;
  if (Math.abs(k2) > 120 * Math.PI / 180) {
    const t3 = d2, e3 = s2, r3 = n2;
    d2 = i2 && d2 > f2 ? f2 + 120 * Math.PI / 180 * 1 : f2 + 120 * Math.PI / 180 * -1, p2 = x(s2 = g2 + a2 * Math.cos(d2), n2 = M2 + o2 * Math.sin(d2), e3, r3, a2, o2, h2, 0, i2, [d2, t3, g2, M2]);
  }
  k2 = d2 - f2;
  const b2 = Math.cos(f2), y2 = Math.sin(f2), m2 = Math.cos(d2), P2 = Math.sin(d2), v2 = Math.tan(k2 / 4), S2 = 4 / 3 * a2 * v2, O2 = 4 / 3 * o2 * v2, L2 = [t2, e2], T2 = [t2 + S2 * y2, e2 - O2 * b2], D2 = [s2 + S2 * P2, n2 - O2 * m2], A2 = [s2, n2];
  if (T2[0] = 2 * L2[0] - T2[0], T2[1] = 2 * L2[1] - T2[1], c2) return [T2, D2, A2].concat(p2);
  {
    p2 = [T2, D2, A2].concat(p2);
    const t3 = [];
    for (let e3 = 0; e3 < p2.length; e3 += 3) {
      const s3 = w(p2[e3][0], p2[e3][1], l2), n3 = w(p2[e3 + 1][0], p2[e3 + 1][1], l2), a3 = w(p2[e3 + 2][0], p2[e3 + 2][1], l2);
      t3.push([s3[0], s3[1], n3[0], n3[1], a3[0], a3[1]]);
    }
    return t3;
  }
}
var P = { randOffset: function(t2, e2) {
  return E(t2, e2);
}, randOffsetWithRange: function(t2, e2, s2) {
  return W(t2, e2, s2);
}, ellipse: function(t2, e2, s2, n2, a2) {
  const o2 = T(s2, n2, a2);
  return D(t2, e2, a2, o2).opset;
}, doubleLineOps: function(t2, e2, s2, n2, a2) {
  return G(t2, e2, s2, n2, a2, true);
} };
function v(t2, e2, s2, n2, a2) {
  return { type: "path", ops: G(t2, e2, s2, n2, a2) };
}
function S(t2, e2, s2) {
  const n2 = (t2 || []).length;
  if (n2 > 2) {
    const a2 = [];
    for (let e3 = 0; e3 < n2 - 1; e3++) a2.push(...G(t2[e3][0], t2[e3][1], t2[e3 + 1][0], t2[e3 + 1][1], s2));
    return e2 && a2.push(...G(t2[n2 - 1][0], t2[n2 - 1][1], t2[0][0], t2[0][1], s2)), { type: "path", ops: a2 };
  }
  return 2 === n2 ? v(t2[0][0], t2[0][1], t2[1][0], t2[1][1], s2) : { type: "path", ops: [] };
}
function O(t2, e2, s2, n2, a2) {
  return function(t3, e3) {
    return S(t3, true, e3);
  }([[t2, e2], [t2 + s2, e2], [t2 + s2, e2 + n2], [t2, e2 + n2]], a2);
}
function L(t2, e2) {
  let s2 = R(t2, 1 * (1 + 0.2 * e2.roughness), e2);
  if (!e2.disableMultiStroke) {
    const n2 = R(t2, 1.5 * (1 + 0.22 * e2.roughness), function(t3) {
      const e3 = Object.assign({}, t3);
      e3.randomizer = void 0, t3.seed && (e3.seed = t3.seed + 1);
      return e3;
    }(e2));
    s2 = s2.concat(n2);
  }
  return { type: "path", ops: s2 };
}
function T(t2, e2, s2) {
  const n2 = Math.sqrt(2 * Math.PI * Math.sqrt((Math.pow(t2 / 2, 2) + Math.pow(e2 / 2, 2)) / 2)), a2 = Math.ceil(Math.max(s2.curveStepCount, s2.curveStepCount / Math.sqrt(200) * n2)), o2 = 2 * Math.PI / a2;
  let h2 = Math.abs(t2 / 2), r2 = Math.abs(e2 / 2);
  const i2 = 1 - s2.curveFitting;
  return h2 += E(h2 * i2, s2), r2 += E(r2 * i2, s2), { increment: o2, rx: h2, ry: r2 };
}
function D(t2, e2, s2, n2) {
  const [a2, o2] = q(n2.increment, t2, e2, n2.rx, n2.ry, 1, n2.increment * W(0.1, W(0.4, 1, s2), s2), s2);
  let h2 = j(a2, null, s2);
  if (!s2.disableMultiStroke && 0 !== s2.roughness) {
    const [a3] = q(n2.increment, t2, e2, n2.rx, n2.ry, 1.5, 0, s2), o3 = j(a3, null, s2);
    h2 = h2.concat(o3);
  }
  return { estimatedPoints: o2, opset: { type: "path", ops: h2 } };
}
function A(t2, e2, s2, n2, a2, o2, h2, r2, i2) {
  const c2 = t2, l2 = e2;
  let u2 = Math.abs(s2 / 2), p2 = Math.abs(n2 / 2);
  u2 += E(0.01 * u2, i2), p2 += E(0.01 * p2, i2);
  let f2 = a2, d2 = o2;
  for (; f2 < 0; ) f2 += 2 * Math.PI, d2 += 2 * Math.PI;
  d2 - f2 > 2 * Math.PI && (f2 = 0, d2 = 2 * Math.PI);
  const g2 = 2 * Math.PI / i2.curveStepCount, M2 = Math.min(g2 / 2, (d2 - f2) / 2), k2 = F(M2, c2, l2, u2, p2, f2, d2, 1, i2);
  if (!i2.disableMultiStroke) {
    const t3 = F(M2, c2, l2, u2, p2, f2, d2, 1.5, i2);
    k2.push(...t3);
  }
  return h2 && (r2 ? k2.push(...G(c2, l2, c2 + u2 * Math.cos(f2), l2 + p2 * Math.sin(f2), i2), ...G(c2, l2, c2 + u2 * Math.cos(d2), l2 + p2 * Math.sin(d2), i2)) : k2.push({ op: "lineTo", data: [c2, l2] }, { op: "lineTo", data: [c2 + u2 * Math.cos(f2), l2 + p2 * Math.sin(f2)] })), { type: "path", ops: k2 };
}
function _(t2, e2) {
  const s2 = m(y(b(t2))), n2 = [];
  let a2 = [0, 0], o2 = [0, 0];
  for (const { key: t3, data: h2 } of s2) switch (t3) {
    case "M":
      o2 = [h2[0], h2[1]], a2 = [h2[0], h2[1]];
      break;
    case "L":
      n2.push(...G(o2[0], o2[1], h2[0], h2[1], e2)), o2 = [h2[0], h2[1]];
      break;
    case "C": {
      const [t4, s3, a3, r2, i2, c2] = h2;
      n2.push(...V(t4, s3, a3, r2, i2, c2, o2, e2)), o2 = [i2, c2];
      break;
    }
    case "Z":
      n2.push(...G(o2[0], o2[1], a2[0], a2[1], e2)), o2 = [a2[0], a2[1]];
  }
  return { type: "path", ops: n2 };
}
function I(t2, e2) {
  const s2 = [];
  for (const n2 of t2) if (n2.length) {
    const t3 = e2.maxRandomnessOffset || 0, a2 = n2.length;
    if (a2 > 2) {
      s2.push({ op: "move", data: [n2[0][0] + E(t3, e2), n2[0][1] + E(t3, e2)] });
      for (let o2 = 1; o2 < a2; o2++) s2.push({ op: "lineTo", data: [n2[o2][0] + E(t3, e2), n2[o2][1] + E(t3, e2)] });
    }
  }
  return { type: "fillPath", ops: s2 };
}
function C(t2, e2) {
  return function(t3, e3) {
    let s2 = t3.fillStyle || "hachure";
    if (!u[s2]) switch (s2) {
      case "zigzag":
        u[s2] || (u[s2] = new h(e3));
        break;
      case "cross-hatch":
        u[s2] || (u[s2] = new r(e3));
        break;
      case "dots":
        u[s2] || (u[s2] = new i(e3));
        break;
      case "dashed":
        u[s2] || (u[s2] = new c(e3));
        break;
      case "zigzag-line":
        u[s2] || (u[s2] = new l(e3));
        break;
      default:
        s2 = "hachure", u[s2] || (u[s2] = new a(e3));
    }
    return u[s2];
  }(e2, P).fillPolygons(t2, e2);
}
function z(t2) {
  return t2.randomizer || (t2.randomizer = new p(t2.seed || 0)), t2.randomizer.next();
}
function W(t2, e2, s2, n2 = 1) {
  return s2.roughness * n2 * (z(s2) * (e2 - t2) + t2);
}
function E(t2, e2, s2 = 1) {
  return W(-t2, t2, e2, s2);
}
function G(t2, e2, s2, n2, a2, o2 = false) {
  const h2 = o2 ? a2.disableMultiStrokeFill : a2.disableMultiStroke, r2 = $(t2, e2, s2, n2, a2, true, false);
  if (h2) return r2;
  const i2 = $(t2, e2, s2, n2, a2, true, true);
  return r2.concat(i2);
}
function $(t2, e2, s2, n2, a2, o2, h2) {
  const r2 = Math.pow(t2 - s2, 2) + Math.pow(e2 - n2, 2), i2 = Math.sqrt(r2);
  let c2 = 1;
  c2 = i2 < 200 ? 1 : i2 > 500 ? 0.4 : -16668e-7 * i2 + 1.233334;
  let l2 = a2.maxRandomnessOffset || 0;
  l2 * l2 * 100 > r2 && (l2 = i2 / 10);
  const u2 = l2 / 2, p2 = 0.2 + 0.2 * z(a2);
  let f2 = a2.bowing * a2.maxRandomnessOffset * (n2 - e2) / 200, d2 = a2.bowing * a2.maxRandomnessOffset * (t2 - s2) / 200;
  f2 = E(f2, a2, c2), d2 = E(d2, a2, c2);
  const g2 = [], M2 = () => E(u2, a2, c2), k2 = () => E(l2, a2, c2), b2 = a2.preserveVertices;
  return o2 && (h2 ? g2.push({ op: "move", data: [t2 + (b2 ? 0 : M2()), e2 + (b2 ? 0 : M2())] }) : g2.push({ op: "move", data: [t2 + (b2 ? 0 : E(l2, a2, c2)), e2 + (b2 ? 0 : E(l2, a2, c2))] })), h2 ? g2.push({ op: "bcurveTo", data: [f2 + t2 + (s2 - t2) * p2 + M2(), d2 + e2 + (n2 - e2) * p2 + M2(), f2 + t2 + 2 * (s2 - t2) * p2 + M2(), d2 + e2 + 2 * (n2 - e2) * p2 + M2(), s2 + (b2 ? 0 : M2()), n2 + (b2 ? 0 : M2())] }) : g2.push({ op: "bcurveTo", data: [f2 + t2 + (s2 - t2) * p2 + k2(), d2 + e2 + (n2 - e2) * p2 + k2(), f2 + t2 + 2 * (s2 - t2) * p2 + k2(), d2 + e2 + 2 * (n2 - e2) * p2 + k2(), s2 + (b2 ? 0 : k2()), n2 + (b2 ? 0 : k2())] }), g2;
}
function R(t2, e2, s2) {
  const n2 = [];
  n2.push([t2[0][0] + E(e2, s2), t2[0][1] + E(e2, s2)]), n2.push([t2[0][0] + E(e2, s2), t2[0][1] + E(e2, s2)]);
  for (let a2 = 1; a2 < t2.length; a2++) n2.push([t2[a2][0] + E(e2, s2), t2[a2][1] + E(e2, s2)]), a2 === t2.length - 1 && n2.push([t2[a2][0] + E(e2, s2), t2[a2][1] + E(e2, s2)]);
  return j(n2, null, s2);
}
function j(t2, e2, s2) {
  const n2 = t2.length, a2 = [];
  if (n2 > 3) {
    const o2 = [], h2 = 1 - s2.curveTightness;
    a2.push({ op: "move", data: [t2[1][0], t2[1][1]] });
    for (let e3 = 1; e3 + 2 < n2; e3++) {
      const s3 = t2[e3];
      o2[0] = [s3[0], s3[1]], o2[1] = [s3[0] + (h2 * t2[e3 + 1][0] - h2 * t2[e3 - 1][0]) / 6, s3[1] + (h2 * t2[e3 + 1][1] - h2 * t2[e3 - 1][1]) / 6], o2[2] = [t2[e3 + 1][0] + (h2 * t2[e3][0] - h2 * t2[e3 + 2][0]) / 6, t2[e3 + 1][1] + (h2 * t2[e3][1] - h2 * t2[e3 + 2][1]) / 6], o2[3] = [t2[e3 + 1][0], t2[e3 + 1][1]], a2.push({ op: "bcurveTo", data: [o2[1][0], o2[1][1], o2[2][0], o2[2][1], o2[3][0], o2[3][1]] });
    }
    if (e2 && 2 === e2.length) {
      const t3 = s2.maxRandomnessOffset;
      a2.push({ op: "lineTo", data: [e2[0] + E(t3, s2), e2[1] + E(t3, s2)] });
    }
  } else 3 === n2 ? (a2.push({ op: "move", data: [t2[1][0], t2[1][1]] }), a2.push({ op: "bcurveTo", data: [t2[1][0], t2[1][1], t2[2][0], t2[2][1], t2[2][0], t2[2][1]] })) : 2 === n2 && a2.push(...G(t2[0][0], t2[0][1], t2[1][0], t2[1][1], s2));
  return a2;
}
function q(t2, e2, s2, n2, a2, o2, h2, r2) {
  const i2 = [], c2 = [];
  if (0 === r2.roughness) {
    t2 /= 4, c2.push([e2 + n2 * Math.cos(-t2), s2 + a2 * Math.sin(-t2)]);
    for (let o3 = 0; o3 <= 2 * Math.PI; o3 += t2) {
      const t3 = [e2 + n2 * Math.cos(o3), s2 + a2 * Math.sin(o3)];
      i2.push(t3), c2.push(t3);
    }
    c2.push([e2 + n2 * Math.cos(0), s2 + a2 * Math.sin(0)]), c2.push([e2 + n2 * Math.cos(t2), s2 + a2 * Math.sin(t2)]);
  } else {
    const l2 = E(0.5, r2) - Math.PI / 2;
    c2.push([E(o2, r2) + e2 + 0.9 * n2 * Math.cos(l2 - t2), E(o2, r2) + s2 + 0.9 * a2 * Math.sin(l2 - t2)]);
    const u2 = 2 * Math.PI + l2 - 0.01;
    for (let h3 = l2; h3 < u2; h3 += t2) {
      const t3 = [E(o2, r2) + e2 + n2 * Math.cos(h3), E(o2, r2) + s2 + a2 * Math.sin(h3)];
      i2.push(t3), c2.push(t3);
    }
    c2.push([E(o2, r2) + e2 + n2 * Math.cos(l2 + 2 * Math.PI + 0.5 * h2), E(o2, r2) + s2 + a2 * Math.sin(l2 + 2 * Math.PI + 0.5 * h2)]), c2.push([E(o2, r2) + e2 + 0.98 * n2 * Math.cos(l2 + h2), E(o2, r2) + s2 + 0.98 * a2 * Math.sin(l2 + h2)]), c2.push([E(o2, r2) + e2 + 0.9 * n2 * Math.cos(l2 + 0.5 * h2), E(o2, r2) + s2 + 0.9 * a2 * Math.sin(l2 + 0.5 * h2)]);
  }
  return [c2, i2];
}
function F(t2, e2, s2, n2, a2, o2, h2, r2, i2) {
  const c2 = o2 + E(0.1, i2), l2 = [];
  l2.push([E(r2, i2) + e2 + 0.9 * n2 * Math.cos(c2 - t2), E(r2, i2) + s2 + 0.9 * a2 * Math.sin(c2 - t2)]);
  for (let o3 = c2; o3 <= h2; o3 += t2) l2.push([E(r2, i2) + e2 + n2 * Math.cos(o3), E(r2, i2) + s2 + a2 * Math.sin(o3)]);
  return l2.push([e2 + n2 * Math.cos(h2), s2 + a2 * Math.sin(h2)]), l2.push([e2 + n2 * Math.cos(h2), s2 + a2 * Math.sin(h2)]), j(l2, null, i2);
}
function V(t2, e2, s2, n2, a2, o2, h2, r2) {
  const i2 = [], c2 = [r2.maxRandomnessOffset || 1, (r2.maxRandomnessOffset || 1) + 0.3];
  let l2 = [0, 0];
  const u2 = r2.disableMultiStroke ? 1 : 2, p2 = r2.preserveVertices;
  for (let f2 = 0; f2 < u2; f2++) 0 === f2 ? i2.push({ op: "move", data: [h2[0], h2[1]] }) : i2.push({ op: "move", data: [h2[0] + (p2 ? 0 : E(c2[0], r2)), h2[1] + (p2 ? 0 : E(c2[0], r2))] }), l2 = p2 ? [a2, o2] : [a2 + E(c2[f2], r2), o2 + E(c2[f2], r2)], i2.push({ op: "bcurveTo", data: [t2 + E(c2[f2], r2), e2 + E(c2[f2], r2), s2 + E(c2[f2], r2), n2 + E(c2[f2], r2), l2[0], l2[1]] });
  return i2;
}
function Z(t2) {
  return [...t2];
}
function Q(t2, e2) {
  return Math.pow(t2[0] - e2[0], 2) + Math.pow(t2[1] - e2[1], 2);
}
function H(t2, e2, s2) {
  const n2 = Q(e2, s2);
  if (0 === n2) return Q(t2, e2);
  let a2 = ((t2[0] - e2[0]) * (s2[0] - e2[0]) + (t2[1] - e2[1]) * (s2[1] - e2[1])) / n2;
  return a2 = Math.max(0, Math.min(1, a2)), Q(t2, N(e2, s2, a2));
}
function N(t2, e2, s2) {
  return [t2[0] + (e2[0] - t2[0]) * s2, t2[1] + (e2[1] - t2[1]) * s2];
}
function B(t2, e2, s2, n2) {
  const a2 = n2 || [];
  if (function(t3, e3) {
    const s3 = t3[e3 + 0], n3 = t3[e3 + 1], a3 = t3[e3 + 2], o3 = t3[e3 + 3];
    let h3 = 3 * n3[0] - 2 * s3[0] - o3[0];
    h3 *= h3;
    let r2 = 3 * n3[1] - 2 * s3[1] - o3[1];
    r2 *= r2;
    let i2 = 3 * a3[0] - 2 * o3[0] - s3[0];
    i2 *= i2;
    let c2 = 3 * a3[1] - 2 * o3[1] - s3[1];
    return c2 *= c2, h3 < i2 && (h3 = i2), r2 < c2 && (r2 = c2), h3 + r2;
  }(t2, e2) < s2) {
    const s3 = t2[e2 + 0];
    if (a2.length) {
      (o2 = a2[a2.length - 1], h2 = s3, Math.sqrt(Q(o2, h2))) > 1 && a2.push(s3);
    } else a2.push(s3);
    a2.push(t2[e2 + 3]);
  } else {
    const n3 = 0.5, o3 = t2[e2 + 0], h3 = t2[e2 + 1], r2 = t2[e2 + 2], i2 = t2[e2 + 3], c2 = N(o3, h3, n3), l2 = N(h3, r2, n3), u2 = N(r2, i2, n3), p2 = N(c2, l2, n3), f2 = N(l2, u2, n3), d2 = N(p2, f2, n3);
    B([o3, c2, p2, d2], 0, s2, a2), B([d2, f2, u2, i2], 0, s2, a2);
  }
  var o2, h2;
  return a2;
}
function J(t2, e2) {
  return K(t2, 0, t2.length, e2);
}
function K(t2, e2, s2, n2, a2) {
  const o2 = a2 || [], h2 = t2[e2], r2 = t2[s2 - 1];
  let i2 = 0, c2 = 1;
  for (let n3 = e2 + 1; n3 < s2 - 1; ++n3) {
    const e3 = H(t2[n3], h2, r2);
    e3 > i2 && (i2 = e3, c2 = n3);
  }
  return Math.sqrt(i2) > n2 ? (K(t2, e2, c2 + 1, n2, o2), K(t2, c2, s2, n2, o2)) : (o2.length || o2.push(h2), o2.push(r2)), o2;
}
function U(t2, e2 = 0.15, s2) {
  const n2 = [], a2 = (t2.length - 1) / 3;
  for (let s3 = 0; s3 < a2; s3++) {
    B(t2, 3 * s3, e2, n2);
  }
  return s2 && s2 > 0 ? K(n2, 0, n2.length, s2) : n2;
}
var X = "none";
var Y = class {
  constructor(t2) {
    this.defaultOptions = { maxRandomnessOffset: 2, roughness: 1, bowing: 1, stroke: "#000", strokeWidth: 1, curveTightness: 0, curveFitting: 0.95, curveStepCount: 9, fillStyle: "hachure", fillWeight: -1, hachureAngle: -41, hachureGap: -1, dashOffset: -1, dashGap: -1, zigzagOffset: -1, seed: 0, disableMultiStroke: false, disableMultiStrokeFill: false, preserveVertices: false, fillShapeRoughnessGain: 0.8 }, this.config = t2 || {}, this.config.options && (this.defaultOptions = this._o(this.config.options));
  }
  static newSeed() {
    return Math.floor(Math.random() * 2 ** 31);
  }
  _o(t2) {
    return t2 ? Object.assign({}, this.defaultOptions, t2) : this.defaultOptions;
  }
  _d(t2, e2, s2) {
    return { shape: t2, sets: e2 || [], options: s2 || this.defaultOptions };
  }
  line(t2, e2, s2, n2, a2) {
    const o2 = this._o(a2);
    return this._d("line", [v(t2, e2, s2, n2, o2)], o2);
  }
  rectangle(t2, e2, s2, n2, a2) {
    const o2 = this._o(a2), h2 = [], r2 = O(t2, e2, s2, n2, o2);
    if (o2.fill) {
      const a3 = [[t2, e2], [t2 + s2, e2], [t2 + s2, e2 + n2], [t2, e2 + n2]];
      "solid" === o2.fillStyle ? h2.push(I([a3], o2)) : h2.push(C([a3], o2));
    }
    return o2.stroke !== X && h2.push(r2), this._d("rectangle", h2, o2);
  }
  ellipse(t2, e2, s2, n2, a2) {
    const o2 = this._o(a2), h2 = [], r2 = T(s2, n2, o2), i2 = D(t2, e2, o2, r2);
    if (o2.fill) if ("solid" === o2.fillStyle) {
      const s3 = D(t2, e2, o2, r2).opset;
      s3.type = "fillPath", h2.push(s3);
    } else h2.push(C([i2.estimatedPoints], o2));
    return o2.stroke !== X && h2.push(i2.opset), this._d("ellipse", h2, o2);
  }
  circle(t2, e2, s2, n2) {
    const a2 = this.ellipse(t2, e2, s2, s2, n2);
    return a2.shape = "circle", a2;
  }
  linearPath(t2, e2) {
    const s2 = this._o(e2);
    return this._d("linearPath", [S(t2, false, s2)], s2);
  }
  arc(t2, e2, s2, n2, a2, o2, h2 = false, r2) {
    const i2 = this._o(r2), c2 = [], l2 = A(t2, e2, s2, n2, a2, o2, h2, true, i2);
    if (h2 && i2.fill) if ("solid" === i2.fillStyle) {
      const h3 = Object.assign({}, i2);
      h3.disableMultiStroke = true;
      const r3 = A(t2, e2, s2, n2, a2, o2, true, false, h3);
      r3.type = "fillPath", c2.push(r3);
    } else c2.push(function(t3, e3, s3, n3, a3, o3, h3) {
      const r3 = t3, i3 = e3;
      let c3 = Math.abs(s3 / 2), l3 = Math.abs(n3 / 2);
      c3 += E(0.01 * c3, h3), l3 += E(0.01 * l3, h3);
      let u2 = a3, p2 = o3;
      for (; u2 < 0; ) u2 += 2 * Math.PI, p2 += 2 * Math.PI;
      p2 - u2 > 2 * Math.PI && (u2 = 0, p2 = 2 * Math.PI);
      const f2 = (p2 - u2) / h3.curveStepCount, d2 = [];
      for (let t4 = u2; t4 <= p2; t4 += f2) d2.push([r3 + c3 * Math.cos(t4), i3 + l3 * Math.sin(t4)]);
      return d2.push([r3 + c3 * Math.cos(p2), i3 + l3 * Math.sin(p2)]), d2.push([r3, i3]), C([d2], h3);
    }(t2, e2, s2, n2, a2, o2, i2));
    return i2.stroke !== X && c2.push(l2), this._d("arc", c2, i2);
  }
  curve(t2, e2) {
    const s2 = this._o(e2), n2 = [], a2 = L(t2, s2);
    if (s2.fill && s2.fill !== X && t2.length >= 3) if ("solid" === s2.fillStyle) {
      const e3 = L(t2, Object.assign(Object.assign({}, s2), { disableMultiStroke: true, roughness: s2.roughness ? s2.roughness + s2.fillShapeRoughnessGain : 0 }));
      n2.push({ type: "fillPath", ops: this._mergedShape(e3.ops) });
    } else {
      const e3 = function(t3, e4 = 0) {
        const s3 = t3.length;
        if (s3 < 3) throw new Error("A curve must have at least three points.");
        const n3 = [];
        if (3 === s3) n3.push(Z(t3[0]), Z(t3[1]), Z(t3[2]), Z(t3[2]));
        else {
          const s4 = [];
          s4.push(t3[0], t3[0]);
          for (let e5 = 1; e5 < t3.length; e5++) s4.push(t3[e5]), e5 === t3.length - 1 && s4.push(t3[e5]);
          const a4 = [], o2 = 1 - e4;
          n3.push(Z(s4[0]));
          for (let t4 = 1; t4 + 2 < s4.length; t4++) {
            const e5 = s4[t4];
            a4[0] = [e5[0], e5[1]], a4[1] = [e5[0] + (o2 * s4[t4 + 1][0] - o2 * s4[t4 - 1][0]) / 6, e5[1] + (o2 * s4[t4 + 1][1] - o2 * s4[t4 - 1][1]) / 6], a4[2] = [s4[t4 + 1][0] + (o2 * s4[t4][0] - o2 * s4[t4 + 2][0]) / 6, s4[t4 + 1][1] + (o2 * s4[t4][1] - o2 * s4[t4 + 2][1]) / 6], a4[3] = [s4[t4 + 1][0], s4[t4 + 1][1]], n3.push(a4[1], a4[2], a4[3]);
          }
        }
        return n3;
      }(t2), a3 = U(e3, 10, (1 + s2.roughness) / 2);
      n2.push(C([a3], s2));
    }
    return s2.stroke !== X && n2.push(a2), this._d("curve", n2, s2);
  }
  polygon(t2, e2) {
    const s2 = this._o(e2), n2 = [], a2 = S(t2, true, s2);
    return s2.fill && ("solid" === s2.fillStyle ? n2.push(I([t2], s2)) : n2.push(C([t2], s2))), s2.stroke !== X && n2.push(a2), this._d("polygon", n2, s2);
  }
  path(t2, e2) {
    const s2 = this._o(e2), n2 = [];
    if (!t2) return this._d("path", n2, s2);
    t2 = (t2 || "").replace(/\n/g, " ").replace(/(-\s)/g, "-").replace("/(ss)/g", " ");
    const a2 = s2.fill && "transparent" !== s2.fill && s2.fill !== X, o2 = s2.stroke !== X, h2 = !!(s2.simplification && s2.simplification < 1), r2 = function(t3, e3, s3) {
      const n3 = m(y(b(t3))), a3 = [];
      let o3 = [], h3 = [0, 0], r3 = [];
      const i3 = () => {
        r3.length >= 4 && o3.push(...U(r3, e3)), r3 = [];
      }, c2 = () => {
        i3(), o3.length && (a3.push(o3), o3 = []);
      };
      for (const { key: t4, data: e4 } of n3) switch (t4) {
        case "M":
          c2(), h3 = [e4[0], e4[1]], o3.push(h3);
          break;
        case "L":
          i3(), o3.push([e4[0], e4[1]]);
          break;
        case "C":
          if (!r3.length) {
            const t5 = o3.length ? o3[o3.length - 1] : h3;
            r3.push([t5[0], t5[1]]);
          }
          r3.push([e4[0], e4[1]]), r3.push([e4[2], e4[3]]), r3.push([e4[4], e4[5]]);
          break;
        case "Z":
          i3(), o3.push([h3[0], h3[1]]);
      }
      if (c2(), !s3) return a3;
      const l2 = [];
      for (const t4 of a3) {
        const e4 = J(t4, s3);
        e4.length && l2.push(e4);
      }
      return l2;
    }(t2, 1, h2 ? 4 - 4 * (s2.simplification || 1) : (1 + s2.roughness) / 2), i2 = _(t2, s2);
    if (a2) if ("solid" === s2.fillStyle) if (1 === r2.length) {
      const e3 = _(t2, Object.assign(Object.assign({}, s2), { disableMultiStroke: true, roughness: s2.roughness ? s2.roughness + s2.fillShapeRoughnessGain : 0 }));
      n2.push({ type: "fillPath", ops: this._mergedShape(e3.ops) });
    } else n2.push(I(r2, s2));
    else n2.push(C(r2, s2));
    return o2 && (h2 ? r2.forEach((t3) => {
      n2.push(S(t3, false, s2));
    }) : n2.push(i2)), this._d("path", n2, s2);
  }
  opsToPath(t2, e2) {
    let s2 = "";
    for (const n2 of t2.ops) {
      const t3 = "number" == typeof e2 && e2 >= 0 ? n2.data.map((t4) => +t4.toFixed(e2)) : n2.data;
      switch (n2.op) {
        case "move":
          s2 += `M${t3[0]} ${t3[1]} `;
          break;
        case "bcurveTo":
          s2 += `C${t3[0]} ${t3[1]}, ${t3[2]} ${t3[3]}, ${t3[4]} ${t3[5]} `;
          break;
        case "lineTo":
          s2 += `L${t3[0]} ${t3[1]} `;
      }
    }
    return s2.trim();
  }
  toPaths(t2) {
    const e2 = t2.sets || [], s2 = t2.options || this.defaultOptions, n2 = [];
    for (const t3 of e2) {
      let e3 = null;
      switch (t3.type) {
        case "path":
          e3 = { d: this.opsToPath(t3), stroke: s2.stroke, strokeWidth: s2.strokeWidth, fill: X };
          break;
        case "fillPath":
          e3 = { d: this.opsToPath(t3), stroke: X, strokeWidth: 0, fill: s2.fill || X };
          break;
        case "fillSketch":
          e3 = this.fillSketch(t3, s2);
      }
      e3 && n2.push(e3);
    }
    return n2;
  }
  fillSketch(t2, e2) {
    let s2 = e2.fillWeight;
    return s2 < 0 && (s2 = e2.strokeWidth / 2), { d: this.opsToPath(t2), stroke: e2.fill || X, strokeWidth: s2, fill: X };
  }
  _mergedShape(t2) {
    return t2.filter((t3, e2) => 0 === e2 || "move" !== t3.op);
  }
};
var tt = class {
  constructor(t2, e2) {
    this.canvas = t2, this.ctx = this.canvas.getContext("2d"), this.gen = new Y(e2);
  }
  draw(t2) {
    const e2 = t2.sets || [], s2 = t2.options || this.getDefaultOptions(), n2 = this.ctx, a2 = t2.options.fixedDecimalPlaceDigits;
    for (const o2 of e2) switch (o2.type) {
      case "path":
        n2.save(), n2.strokeStyle = "none" === s2.stroke ? "transparent" : s2.stroke, n2.lineWidth = s2.strokeWidth, s2.strokeLineDash && n2.setLineDash(s2.strokeLineDash), s2.strokeLineDashOffset && (n2.lineDashOffset = s2.strokeLineDashOffset), this._drawToContext(n2, o2, a2), n2.restore();
        break;
      case "fillPath": {
        n2.save(), n2.fillStyle = s2.fill || "";
        const e3 = "curve" === t2.shape || "polygon" === t2.shape || "path" === t2.shape ? "evenodd" : "nonzero";
        this._drawToContext(n2, o2, a2, e3), n2.restore();
        break;
      }
      case "fillSketch":
        this.fillSketch(n2, o2, s2);
    }
  }
  fillSketch(t2, e2, s2) {
    let n2 = s2.fillWeight;
    n2 < 0 && (n2 = s2.strokeWidth / 2), t2.save(), s2.fillLineDash && t2.setLineDash(s2.fillLineDash), s2.fillLineDashOffset && (t2.lineDashOffset = s2.fillLineDashOffset), t2.strokeStyle = s2.fill || "", t2.lineWidth = n2, this._drawToContext(t2, e2, s2.fixedDecimalPlaceDigits), t2.restore();
  }
  _drawToContext(t2, e2, s2, n2 = "nonzero") {
    t2.beginPath();
    for (const n3 of e2.ops) {
      const e3 = "number" == typeof s2 && s2 >= 0 ? n3.data.map((t3) => +t3.toFixed(s2)) : n3.data;
      switch (n3.op) {
        case "move":
          t2.moveTo(e3[0], e3[1]);
          break;
        case "bcurveTo":
          t2.bezierCurveTo(e3[0], e3[1], e3[2], e3[3], e3[4], e3[5]);
          break;
        case "lineTo":
          t2.lineTo(e3[0], e3[1]);
      }
    }
    "fillPath" === e2.type ? t2.fill(n2) : t2.stroke();
  }
  get generator() {
    return this.gen;
  }
  getDefaultOptions() {
    return this.gen.defaultOptions;
  }
  line(t2, e2, s2, n2, a2) {
    const o2 = this.gen.line(t2, e2, s2, n2, a2);
    return this.draw(o2), o2;
  }
  rectangle(t2, e2, s2, n2, a2) {
    const o2 = this.gen.rectangle(t2, e2, s2, n2, a2);
    return this.draw(o2), o2;
  }
  ellipse(t2, e2, s2, n2, a2) {
    const o2 = this.gen.ellipse(t2, e2, s2, n2, a2);
    return this.draw(o2), o2;
  }
  circle(t2, e2, s2, n2) {
    const a2 = this.gen.circle(t2, e2, s2, n2);
    return this.draw(a2), a2;
  }
  linearPath(t2, e2) {
    const s2 = this.gen.linearPath(t2, e2);
    return this.draw(s2), s2;
  }
  polygon(t2, e2) {
    const s2 = this.gen.polygon(t2, e2);
    return this.draw(s2), s2;
  }
  arc(t2, e2, s2, n2, a2, o2, h2 = false, r2) {
    const i2 = this.gen.arc(t2, e2, s2, n2, a2, o2, h2, r2);
    return this.draw(i2), i2;
  }
  curve(t2, e2) {
    const s2 = this.gen.curve(t2, e2);
    return this.draw(s2), s2;
  }
  path(t2, e2) {
    const s2 = this.gen.path(t2, e2);
    return this.draw(s2), s2;
  }
};
var et = "http://www.w3.org/2000/svg";
var st = class {
  constructor(t2, e2) {
    this.svg = t2, this.gen = new Y(e2);
  }
  draw(t2) {
    const e2 = t2.sets || [], s2 = t2.options || this.getDefaultOptions(), n2 = this.svg.ownerDocument || window.document, a2 = n2.createElementNS(et, "g"), o2 = t2.options.fixedDecimalPlaceDigits;
    for (const h2 of e2) {
      let e3 = null;
      switch (h2.type) {
        case "path":
          e3 = n2.createElementNS(et, "path"), e3.setAttribute("d", this.opsToPath(h2, o2)), e3.setAttribute("stroke", s2.stroke), e3.setAttribute("stroke-width", s2.strokeWidth + ""), e3.setAttribute("fill", "none"), s2.strokeLineDash && e3.setAttribute("stroke-dasharray", s2.strokeLineDash.join(" ").trim()), s2.strokeLineDashOffset && e3.setAttribute("stroke-dashoffset", `${s2.strokeLineDashOffset}`);
          break;
        case "fillPath":
          e3 = n2.createElementNS(et, "path"), e3.setAttribute("d", this.opsToPath(h2, o2)), e3.setAttribute("stroke", "none"), e3.setAttribute("stroke-width", "0"), e3.setAttribute("fill", s2.fill || ""), "curve" !== t2.shape && "polygon" !== t2.shape || e3.setAttribute("fill-rule", "evenodd");
          break;
        case "fillSketch":
          e3 = this.fillSketch(n2, h2, s2);
      }
      e3 && a2.appendChild(e3);
    }
    return a2;
  }
  fillSketch(t2, e2, s2) {
    let n2 = s2.fillWeight;
    n2 < 0 && (n2 = s2.strokeWidth / 2);
    const a2 = t2.createElementNS(et, "path");
    return a2.setAttribute("d", this.opsToPath(e2, s2.fixedDecimalPlaceDigits)), a2.setAttribute("stroke", s2.fill || ""), a2.setAttribute("stroke-width", n2 + ""), a2.setAttribute("fill", "none"), s2.fillLineDash && a2.setAttribute("stroke-dasharray", s2.fillLineDash.join(" ").trim()), s2.fillLineDashOffset && a2.setAttribute("stroke-dashoffset", `${s2.fillLineDashOffset}`), a2;
  }
  get generator() {
    return this.gen;
  }
  getDefaultOptions() {
    return this.gen.defaultOptions;
  }
  opsToPath(t2, e2) {
    return this.gen.opsToPath(t2, e2);
  }
  line(t2, e2, s2, n2, a2) {
    const o2 = this.gen.line(t2, e2, s2, n2, a2);
    return this.draw(o2);
  }
  rectangle(t2, e2, s2, n2, a2) {
    const o2 = this.gen.rectangle(t2, e2, s2, n2, a2);
    return this.draw(o2);
  }
  ellipse(t2, e2, s2, n2, a2) {
    const o2 = this.gen.ellipse(t2, e2, s2, n2, a2);
    return this.draw(o2);
  }
  circle(t2, e2, s2, n2) {
    const a2 = this.gen.circle(t2, e2, s2, n2);
    return this.draw(a2);
  }
  linearPath(t2, e2) {
    const s2 = this.gen.linearPath(t2, e2);
    return this.draw(s2);
  }
  polygon(t2, e2) {
    const s2 = this.gen.polygon(t2, e2);
    return this.draw(s2);
  }
  arc(t2, e2, s2, n2, a2, o2, h2 = false, r2) {
    const i2 = this.gen.arc(t2, e2, s2, n2, a2, o2, h2, r2);
    return this.draw(i2);
  }
  curve(t2, e2) {
    const s2 = this.gen.curve(t2, e2);
    return this.draw(s2);
  }
  path(t2, e2) {
    const s2 = this.gen.path(t2, e2);
    return this.draw(s2);
  }
};
var nt = { canvas: (t2, e2) => new tt(t2, e2), svg: (t2, e2) => new st(t2, e2), generator: (t2) => new Y(t2), newSeed: () => Y.newSeed() };
export {
  nt as default
};
//# sourceMappingURL=roughjs.js.map
