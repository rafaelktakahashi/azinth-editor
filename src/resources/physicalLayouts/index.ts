import ANSI from '../../resources/physicalLayouts/ANSI.azphl.json';
import ISO from '../../resources/physicalLayouts/ISO.azphl.json';
import ABNT from '../../resources/physicalLayouts/ABNT.azphl.json';
import JIS from '../../resources/physicalLayouts/JIS.azphl.json';
import Dubeolsik from '../../resources/physicalLayouts/Dubeolsik.azphl.json';

export type PhysicalLayout = 'ANSI' | 'ISO' | 'ABNT' | 'JIS' | 'Dubeolsik';

const physLayouts = {
  ANSI: ANSI,
  ISO: ISO,
  ABNT: ABNT,
  JIS: JIS,
  Dubeolsik: Dubeolsik,
};

const physLayoutsList = Object.keys(physLayouts);

export function getPhysicalLayout(layoutName: PhysicalLayout) {
  return physLayouts[layoutName];
}

export function getPhysicalLayoutsList() {
  return physLayoutsList;
}
