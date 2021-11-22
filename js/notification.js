//await Notification.requestPermission();

async function showNotification() {
	const result = await Notification.requestPermission();
	if (result === 'granted') {
		const noti = new Notification('Noticias Nuevas', {
			body: 'Nuevas noticias ve al apartado de noticias o haz click aqui',
			icon: './icons/icon32.png'
		});
		noti.onclick = () => window.location="./pages/noticias.html";
	}
}
showNotification();
