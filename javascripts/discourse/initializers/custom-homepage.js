import { withPluginApi } from "discourse/lib/plugin-api";

export default {
  name: "custom-home-latest",
  initialize() {
    withPluginApi("1.8.0", (api) => {
      api.onPageChange((url) => {
        if (url === "/home") {
          const list = document.querySelector("#latest-list");
          if (!list) return;

          fetch("/latest.json?per_page=5")
            .then((r) => r.json())
            .then((data) => {
              const topics = (data?.topic_list?.topics || []).slice(0, 5);

              // Construir elementos de forma segura (sin HTML crudo)
              list.innerHTML = "";
              topics.forEach((t) => {
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = `/t/${t.slug}/${t.id}`;
                a.textContent = t.fancy_title || t.title || "(sin título)";
                li.appendChild(a);
                list.appendChild(li);
              });

              if (!topics.length) {
                const li = document.createElement("li");
                li.textContent = "No hay temas aún.";
                list.appendChild(li);
              }
            })
            .catch(() => {
              list.innerHTML = "<li>Error cargando temas.</li>";
            });
        }
      });
    });
  },
};
