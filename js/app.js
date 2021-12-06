window.addEventListener('load', e => {
    if (!('serviceWorker' in navigator)) {
        console.log('Service worker not supported');
        return;
    }
    navigator.serviceWorker.register('/sw.js')
    .then(function() {
         console.log('Service Worker Registered');
    })
    .catch(function(error) {
        console.log('Service Worker Registration failed:', error);
    });
});


function updatePushNotificationStatus(status){
    pushElement.dataset.checked=status;
    if(status){
        pushImage.src='/images/NA.jpg';
    }else{
        pushImage.src='/images/ND.jpg';
    }
}

function checkIfPushIsEnabled(){
    if(Notification.permission==='denied'){
        alert('Se han Bloqueado las Notificaciones');
        return;
    }

    if(!('PushManaget' in window)){
        alert('Lo sentimos, Las notificaciones no son soportadas por este navegador')
    }

    navigator.serviceWorker.ready
        .then(function(registration){
            registration.pushManager.getSubscription()
                .then(function(subscription){
                    if(subscription){
                        updatePushNotificationStatus(true);
                    }else{
                        updatePushNotificationStatus(false);
                    }
                })
                .catch(function(error){
                    console.error('Error al encender las notificaciones',error);
                });
        });
}

function sendSubscriptionIDToServer(subscription) {
    var subscriptionid = subscription.endpoint.split('wpush/v1/')[1];
    console.log("Subscription ID", subscriptionid);
    fetch('http://localhost:8080/subscribers/', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(
            { subscriptionid : subscriptionid })
    });
}

function removeSubscriptionIDFromServer(subscription) {
    var subscriptionid = subscription.endpoint.split('wpush/v1/')[1];
    console.log("Subscription ID", subscriptionid);
    fetch('http://localhost:8080/subscribers/' + subscriptionid, {
        method: 'delete',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });
}

function subscibeToPushNotification(){
    navigator.serviceWorker.ready
        .then(function(registration){
            if(!registration.pushManager){
                alert('Lo sentimos, Las notificaciones no son soportadas por este navegador');
                return false;
            }

            registration.pushManager.subscribe(
                {userVisibleOnly:true}
            )
            .then(function(subscription){
                console.log('push notification subscribed');
                console.log(subscription);
                sendSubscriptionIDToServer(subscription);
                updatePushNotificationStatus(true);
            })
            .catch(function(error){
                updatePushNotificationStatus(false);
                console.error('error de subscripcion de notificaciones',error);
            });
        })
}

function unsubscribeFromPushNotification(){
    navigator.serviceWorker.ready
        .then(function(registration){
            registration.pushManager.getSubscription()
                .then(function(subscription){
                    if(!subscription){
                        alert('desabilitando notificaciones');
                        return;
                    }
                    subscription.unsubscribe()
                    .then(function(){
                        console.log('notificacione canceladas');
                        console.log(subscription);
                        removeSubscriptionIDFromServer(subscription);
                        updatePushNotificationStatus(false);
                    })
                    .catch(function(error){
                        console.error(error);
                    });
                })
                .catch(function(error){
                    console.error('error al cancelar notificaciones');
                });
        })
}

var pushElement=document.querySelector('.push');
var pushImage=document.querySelector('.image');

pushElement.addEventListener('click',function(){
    if(pushElement.dataset.checked=='true'){
        unsubscribeFromPushNotification();
    }else{
        subscibeToPushNotification();
    }
});

checkIfPushIsEnabled();