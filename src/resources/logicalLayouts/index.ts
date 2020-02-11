import ABNT_2 from "./ABNT_2.azlgl.json";
import DE from "./DE.azlgl.json";
import Dubeolsik from "./Dubeolsik.azlgl.json";
import ES from "./ES.azlgl.json";
import FR from "./FR.azlgl.json";
import JIS_Kana from "./JIS_Kana.azlgl.json";
import JIS from "./JIS.azlgl.json";
import UK from "./UK.azlgl.json";
import US from "./US.azlgl.json";

export type LogicalLayout =
  | "ABNT_2"
  | "DE"
  | "Dubeolsik"
  | "ES"
  | "FR"
  | "JIS_Kana"
  | "JIS"
  | "UK"
  | "US";

const logicalLayouts = {
  ABNT_2: ABNT_2,
  DE: DE,
  Dubeolsik: Dubeolsik,
  ES: ES,
  FR: FR,
  JIS_Kana: JIS_Kana,
  JIS: JIS,
  UK: UK,
  US: US
};

const logicalLayoutsList = Object.keys(logicalLayouts);

export function getLogicalLayout(name: LogicalLayout) {
  return logicalLayouts[name];
}

export function getLogicalLayoutsList() {
  return logicalLayoutsList;
}
