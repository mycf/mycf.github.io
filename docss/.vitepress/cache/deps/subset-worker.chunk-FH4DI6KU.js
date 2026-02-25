import {
  Commands,
  subsetToBinary
} from "./chunk-VEZPHWC4.js";
import "./chunk-5FKOH4H2.js";
import "./chunk-KD7LNW25.js";
import "./chunk-PR4QN5HX.js";

// node_modules/@excalidraw/excalidraw/dist/dev/subset-worker.chunk.js
var WorkerUrl = import.meta.url ? new URL(import.meta.url) : void 0;
if (typeof window === "undefined" && typeof self !== "undefined") {
  self.onmessage = async (e) => {
    switch (e.data.command) {
      case Commands.Subset:
        const buffer = await subsetToBinary(
          e.data.arrayBuffer,
          e.data.codePoints
        );
        self.postMessage(buffer, { transfer: [buffer] });
        break;
    }
  };
}
export {
  WorkerUrl
};
//# sourceMappingURL=subset-worker.chunk-FH4DI6KU.js.map
