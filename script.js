// 🔥 Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "API_KEY_KAMU",
    authDomain: "ayam-saya.firebaseapp.com",
    databaseURL: "https://ayam-saya-default-rtdb.firebaseio.com",
    projectId: "ayam-saya",
    storageBucket: "ayam-saya.appspot.com",
    messagingSenderId: "317764448412",
    appId: "1:317764448412:web:15a79448aa7c7d8c4fbd59",
    measurementId: "G-NXWHB9YJ0T"
};

// 🔹 Inisialisasi Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 🟢 Tambah Event
function addEvent() {
    let name = document.getElementById('eventName').value;
    let price = document.getElementById('eventPrice').value;
    let image = document.getElementById('eventImage').files[0];

    if (!name || !price || !image) {
        alert("Semua kolom harus diisi!");
        return;
    }

    let reader = new FileReader();
    reader.onload = function(event) {
        let eventData = { name, price, image: event.target.result };
        db.ref('events').push(eventData);
    };
    reader.readAsDataURL(image);
}

// 🔹 Load Data Barang dari Firebase
function loadEvents() {
    db.ref('events').on('value', (snapshot) => {
        let container = document.getElementById('eventContainer');
        container.innerHTML = "";

        snapshot.forEach((childSnapshot) => {
            let data = childSnapshot.val();
            let id = childSnapshot.key;

            let eventDiv = document.createElement('div');
            eventDiv.innerHTML = `
                <img src="${data.image}" alt="${data.name}">
                <p>${data.name} - Rp ${data.price}</p>
                <button onclick="addToCart('${id}', '${data.name}', ${data.price}')">+</button>
                <button onclick="removeFromCart('${id}')">-</button>
                <button class="delete" onclick="deleteEvent('${id}')">Hapus</button>
            `;
            container.appendChild(eventDiv);
        });
    });
}

// 🔴 Hapus Event dengan Password
function deleteEvent(eventId) {
    let password = prompt("Masukkan password untuk menghapus:");
    if (password === "4718") {
        db.ref('events/' + eventId).remove();
    } else {
        alert("Password salah!");
    }
}

// 🛒 Keranjang Belanja
let cart = {};

function addToCart(id, name, price) {
    if (!cart[id]) {
        cart[id] = { name, price, quantity: 1 };
    } else {
        cart[id].quantity += 1;
    }
    updateCart();
}

function removeFromCart(id) {
    if (cart[id]) {
        cart[id].quantity -= 1;
        if (cart[id].quantity <= 0) delete cart[id];
    }
    updateCart();
}

// 🔄 Update Tampilan Keranjang
function updateCart() {
    let cartContainer = document.getElementById('cartContainer');
    cartContainer.innerHTML = "";
    let totalItems = 0;

    for (let id in cart) {
        let item = cart[id];
        let div = document.createElement('div');
        div.className = "cart";
        div.innerHTML = `<p>${item.name} (x${item.quantity}) - Rp ${item.price * item.quantity}</p>`;
        cartContainer.appendChild(div);
        totalItems += item.quantity;
    }

    document.getElementById('checkoutButton').disabled = totalItems === 0;
}

// 🛍️ Checkout ke WhatsApp
function checkout() {
    let message = "Pesanan saya:\n";
    for (let id in cart) {
        let item = cart[id];
        message += `${item.name} x${item.quantity} - Rp ${item.price * item.quantity}\n`;
    }

    let waNumber = "6285372736144";
    let waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
    window.location.href = waLink;
}

// 🔄 Muat Data Saat Halaman Dibuka
window.onload = function() {
    loadEvents();
};
