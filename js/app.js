if (navigator.serviceWorker){
    //console.log('Uso de SW ejecutando')
    navigator.serviceWorker.register('/sw.js')
        .then(registration=>console.log('Service worker registrado con alcance: ',registration.scope))
        .catch(err=>console.log("Falla en el registro del service worker"));

}