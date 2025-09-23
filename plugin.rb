# name: guias
# about: Página real /guias servida por Discourse + contenido cliente
# version: 0.1
# authors: Danmachi
# url: https://danmachigaiden.com

# Registra assets del cliente
register_asset "stylesheets/guias.scss"
register_asset "javascripts/discourse/initializers/guias.js", :client_side

after_initialize do
  # Sirve la app Ember en /guias (evita 404)
  Discourse::Application.routes.append do
    get "/guias" => "static#enter"
  end
end
