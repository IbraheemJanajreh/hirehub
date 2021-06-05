const it = document.getElementById('bell')
it.addEventListener('click', async() => {
   currentUser.lastNotifixationDate = notifications[notifications.length - 1].postDate;
   await currentUser.save();
   document.body.style.backgroundColor = 'red';
})

