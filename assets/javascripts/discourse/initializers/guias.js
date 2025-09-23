import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "dm-route-guias",
  initialize() {
    const ID = "dm-guias-root";

    function ensureRootOnBody() {
      let root = document.getElementById(ID);
      if (!root) {
        root = document.createElement("div");
        root.id = ID;
        root.hidden = true;
        document.body.appendChild(root);
      }
      // si est� dentro de un contenedor oculto, s�belo al body
      let el = root.parentElement;
      let hiddenAncestor = false;
      while (el && el !== document.body) {
        if (getComputedStyle(el).display === "none") {
          hiddenAncestor = true;
          break;
        }
        el = el.parentElement;
      }
      if (hiddenAncestor || root.parentElement !== document.body) {
        document.body.appendChild(root);
      }
      // estilos m�nimos
      root.style.display = "block";
      root.style.position = "relative";
      root.style.zIndex = "1";
      root.style.marginTop = "var(--header-offset, 4rem)";
      return root;
    }

    function render() {
      const root = ensureRootOnBody();
      root.innerHTML = `
        <section class="dm-guias container">
          <h1>Gu�as</h1>
          <p>Aqu� va el contenido de tus gu�as. Puedes maquetar lo que quieras.</p>
          <hr class="dm-separator">
          <div class="dm-guias-grid">
            <a class="dm-card" href="/c/guias">�ndice de gu�as</a>
            <a class="dm-card" href="/tags/guia">Todas las gu�as por tag</a>
            <a class="dm-card" href="/t/como-empezar">C�mo empezar</a>
          </div>
        </section>
      `;
    }

    function show() {
      const root = ensureRootOnBody();
      root.hidden = false;
      document.body.classList.add("dm-guias-mode");
      render();
    }

    function hide() {
      const root = document.getElementById(ID);
      if (root) {
        root.hidden = true;
        root.innerHTML = "";
      }
      document.body.classList.remove("dm-guias-mode");
    }

    function atGuias() {
      return location.pathname === "/guias";
    }

    function onRoute() {
      atGuias() ? show() : hide();
    }

    // arranque
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", onRoute, { once: true });
    } else {
      onRoute();
    }

    // SPA
    withPluginApi("1.8.0", (api) => {
      api.onPageChange(() => onRoute());
    });
  },
};
