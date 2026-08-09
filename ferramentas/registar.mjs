/* Regista o resolvedor de `@/`. Ver ferramentas/resolver-alias.mjs. */
import { register } from "node:module";

register("./resolver-alias.mjs", import.meta.url);
