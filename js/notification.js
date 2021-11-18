Push.create("Game-Store", {
    body: "Nuevas noticias ve al apartado de noticias o haz click aqui",
    icon: './icons/icon32.png',
    timeout: 4000,
    onclick: function(){
        window.location="./pages/noticias.html";
        this.close();
    }
});