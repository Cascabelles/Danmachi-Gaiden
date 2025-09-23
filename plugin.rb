# name: guias
# about: Página real /guias servida por Discourse + contenido cliente
# version: 0.1
# authors: Danmachi
# url: https://danmachigaiden.com

# Solo estilos; el initializer JS no se registra manualmente
register_asset "stylesheets/guias.scss"

after_initialize do
  # Sirve la app Ember en /guias (evita 404 y permite SPA)
  Discourse::Application.routes.append do
    get "/guias" => "static#enter"
  end
end
