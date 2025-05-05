const menu = [
  { name: "Pizza Margherita", price: 10 },
  { name: "Burger", price: 8 },
  { name: "Salade César", price: 7 },
  { name: "Pâtes Carbonara", price: 9 },
  { name: "Tiramisu", price: 5 },
  { name: "Soupe du jour", price: 6 },
  { name: "Steak frites", price: 15 },
  { name: "Poisson grillé", price: 13 },
  { name: "Omelette", price: 7 },
  { name: "Crêpes", price: 6 },
];

// Initialisation des quantités à 0
let cart = menu.map((item) => ({ ...item, qty: 0 }));

function updateMenu() {
  const menuList = document.getElementById("menu-list");
  menuList.innerHTML = "";
  cart.forEach((item, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="item-name">${item.name}</span>
      <span class="item-price">${item.price.toFixed(2)} €</span>
      <input type="number" min="0" value="${
        item.qty
      }" onchange="updateQty(${idx}, this.value)" />
    `;
    menuList.appendChild(li);
  });
}

function updateQty(idx, value) {
  let qty = parseInt(value);
  if (isNaN(qty) || qty < 0) qty = 0;
  cart[idx].qty = qty;
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById("cart-list");
  const totalSpan = document.getElementById("total");
  cartList.innerHTML = "";
  let total = 0;
  cart.forEach((item) => {
    if (item.qty > 0) {
      total += item.price * item.qty;
      const li = document.createElement("li");
      li.textContent = `${item.name} x${item.qty} - ${(
        item.price * item.qty
      ).toFixed(2)} €`;
      cartList.appendChild(li);
    }
  });
  totalSpan.textContent = total.toFixed(2);
}

function getTicketHTML() {
  let html = `<h2>Ticket Restaurant</h2><hr><ul>`;
  let total = 0;
  cart.forEach((item) => {
    if (item.qty > 0) {
      html += `<li>${item.name} x${item.qty} - ${(
        item.price * item.qty
      ).toFixed(2)} €</li>`;
      total += item.price * item.qty;
    }
  });
  if (total === 0) {
    html += `<li>Aucun article sélectionné.</li>`;
  }
  html += `</ul><hr><p><strong>Total : ${total.toFixed(2)} €</strong></p>`;
  return html;
}

function printTicket() {
  const ticketDiv = document.getElementById("ticket");
  ticketDiv.innerHTML = getTicketHTML();
  ticketDiv.style.display = "block";
  setTimeout(() => {
    window.print();
    ticketDiv.style.display = "none";
  }, 150);
}

function saveTicketPDF() {
  const ticketDiv = document.getElementById("ticket");
  ticketDiv.innerHTML = getTicketHTML();
  ticketDiv.style.display = "block";
  setTimeout(() => {
    html2pdf()
      .set({
        margin: 0.3,
        filename: "ticket-restaurant.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 4, letterRendering: true, useCORS: true },
        jsPDF: { unit: "in", format: [3, 5], orientation: "portrait" },
      })
      .from(ticketDiv)
      .save()
      .then(() => {
        ticketDiv.style.display = "none";
      });
  }, 150);
}

// Initialisation
updateMenu();
updateCart();
