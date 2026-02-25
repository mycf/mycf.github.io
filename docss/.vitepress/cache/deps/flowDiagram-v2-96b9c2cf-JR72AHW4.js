import {
  flowRendererV2,
  flowStyles
} from "./chunk-R7U74UEL.js";
import "./chunk-Y6HZFPGC.js";
import {
  flowDb,
  parser$1
} from "./chunk-EEAYTFED.js";
import "./chunk-YPOEZ7OF.js";
import "./chunk-76NO6BEQ.js";
import "./chunk-TGAJ26LR.js";
import "./chunk-JRAKSK6F.js";
import {
  require_dayjs_min,
  require_dist,
  setConfig
} from "./chunk-IEHWG5OC.js";
import {
  __toESM
} from "./chunk-PR4QN5HX.js";

// node_modules/mermaid/dist/flowDiagram-v2-96b9c2cf.js
var import_dayjs = __toESM(require_dayjs_min(), 1);
var import_sanitize_url = __toESM(require_dist(), 1);
var diagram = {
  parser: parser$1,
  db: flowDb,
  renderer: flowRendererV2,
  styles: flowStyles,
  init: (cnf) => {
    if (!cnf.flowchart) {
      cnf.flowchart = {};
    }
    cnf.flowchart.arrowMarkerAbsolute = cnf.arrowMarkerAbsolute;
    setConfig({ flowchart: { arrowMarkerAbsolute: cnf.arrowMarkerAbsolute } });
    flowRendererV2.setConf(cnf.flowchart);
    flowDb.clear();
    flowDb.setGen("gen-2");
  }
};
export {
  diagram
};
//# sourceMappingURL=flowDiagram-v2-96b9c2cf-JR72AHW4.js.map
