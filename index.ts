import { openInterractionManager } from "./src/presentation/interaction-manager.js";
import { manageFreinds } from "./src/presentation/friends-manager.js";



const run = async () => {
  const { ask, choose, close } = openInterractionManager();

  manageFreinds();
};
