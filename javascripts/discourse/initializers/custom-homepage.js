//Creación de ruta de página completa /home
import { withPluginApi } from "discourse/lib/plugin-api";

export default {
    name: "custom-homepage-route",
    initialize() {
        withPluginApi("1.8.0", (api) => {
            api.addFullPageRoute("home", "custom-home");
        });
    },
};