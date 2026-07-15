// ===============================
// LOGIN SYSTEM
// ===============================

const loginForm = document.querySelector("#loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.querySelector("#username").value;

    const password = document.querySelector("#password").value;

    if (username.length >= 3 && password.length >= 4) {
      const user = {
        username: username,

        login: true,
      };

      localStorage.setItem("user", JSON.stringify(user));

      window.location.href = "shop.html";
    } else {
      document.querySelector("#loginError").innerText =
        "نام کاربری یا رمز عبور صحیح نیست";
    }
  });
}

// ===============================
// PROTECT SHOP PAGE
// ===============================

if (window.location.pathname.includes("shop.html")) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.login) {
    window.location.href = "login.html";
  }
}

// ===============================
// LOGOUT
// ===============================

const logoutBtn = document.querySelector("#logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("user");

    localStorage.removeItem("cart");

    window.location.href = "index.html";
  });
}

// ===============================
// CART SYSTEM
// ===============================

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItems = document.querySelector("#cartItems");

const totalPrice = document.querySelector("#totalPrice");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  if (!cartItems) return;

  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    const div = document.createElement("div");

    div.className = "cart-item";

    div.innerHTML = `

        <span>
        ${item.name}
        </span>


        <span>
        ${item.price.toLocaleString()}
        تومان
        </span>


        <button onclick="removeCart(${index})">
        حذف
        </button>

        `;

    cartItems.appendChild(div);
  });

  totalPrice.innerText = total.toLocaleString();
}

function removeCart(index) {
  cart.splice(index, 1);

  saveCart();

  renderCart();
}

window.removeCart = removeCart;

// ===============================
// ADD PRODUCT
// ===============================

const addButtons = document.querySelectorAll(".add-cart");

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const product = {
      name: button.dataset.name,

      price: Number(button.dataset.price),
    };

    cart.push(product);

    saveCart();

    renderCart();

    showMessage("محصول به سبد خرید اضافه شد");
  });
});

// ===============================
// TOAST MESSAGE
// ===============================

function showMessage(text) {
  const toast = document.createElement("div");

  toast.innerText = text;

  toast.style.position = "fixed";

  toast.style.bottom = "30px";

  toast.style.left = "50%";

  toast.style.transform = "translateX(-50%)";

  toast.style.background = "#22c55e";

  toast.style.color = "white";

  toast.style.padding = "15px 25px";

  toast.style.borderRadius = "15px";

  toast.style.zIndex = "999";

  toast.style.animation = "fade .4s";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2500);
}

// ===============================
// CHECKOUT
// ===============================

const checkoutForm = document.querySelector("#checkoutForm");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert("سبد خرید خالی است");

      return;
    }

    const order = {
      name: document.querySelector("#fullname").value,

      email: document.querySelector("#email").value,

      address: document.querySelector("#address").value,

      postal: document.querySelector("#postal").value,

      products: cart,

      total: cart.reduce((sum, item) => sum + item.price, 0),
    };

    localStorage.setItem("order", JSON.stringify(order));

    showOrder(order);

    cart = [];

    saveCart();

    renderCart();

    checkoutForm.reset();
  });
}

// ===============================
// SHOW ORDER
// ===============================

function showOrder(order) {
  const result = document.querySelector("#orderResult");

  if (!result) return;

  result.innerHTML = `

<div class="success">

✔ سفارش با موفقیت ثبت شد

</div>


<br>


<strong>
نام:
</strong>

${order.name}


<br>


<strong>
ایمیل:
</strong>

${order.email}


<br>


<strong>
آدرس:
</strong>

${order.address}


<br>


<strong>
کدپستی:
</strong>

${order.postal}


<br>


<strong>
مبلغ نهایی:
</strong>

${order.total.toLocaleString()}
تومان


`;
}

renderCart();

// نمایش سفارش قبلی بعد از رفرش

const oldOrder = JSON.parse(localStorage.getItem("order"));

if (oldOrder) {
  showOrder(oldOrder);
}
