// Import TypeScript modules
import { LancerItem } from "../item/lancer-item";
import { FoundryDropData } from "./dragdrop";

export async function onDropCanvasData(_canvas: Canvas, data: FoundryDropData) {
  if (_canvas.tokens) {
    //@ts-expect-error v11 types
    const dropTarget = [..._canvas.tokens.placeables].find(t => t.bounds.contains(data.x, data.y));

    const actor = dropTarget?.actor;

    if (actor && data.type === "Item") {
      let document = await LancerItem.fromUuid(data.uuid);
      if (document.is_status() && actor.effects.filter(i => i.name === document.name).length === 0) {
        const effect = {
          changes: [],
          duration: {},
          name: document.name,
          icon: document.img,
          statuses: [document.system.lid],
        };
        await actor.createEmbeddedDocuments("ActiveEffect", [effect]);
      }
    }
  }
  return true;
}
