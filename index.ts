import { openInterractionManager } from "./src/presentation/interaction-manager.ts";
import { manageFreinds } from "./src/presentation/friends-manager.ts";

const run = async () => {
  const { ask, choose, close } = openInterractionManager();
  manageFreinds();
};

run();
