// ===============================
// LOGIN SYSTEM (COOKIE)
// ===============================

const loginForm = document.querySelector("#loginForm");

// ===============================
// COOKIE FUNCTIONS
// ===============================

function setCookie(name, value, days) {
  const date = new Date();

  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);

  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/`;
}

function getCookie(name) {
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split("=");

    if (key === name) {
      return decodeURIComponent(value);
    }
  }

  return null;
}

function removeCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}

// ===============================
// LOGIN
// ===============================

if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;

    const usernameRegex = /^[a-zA-Z\u0600-\u06FF0-9_]{3,30}$/;
    const phoneRegex = /^09\d{9}$/;


    if (!(phoneRegex.test(username) || usernameRegex.test(username))) {
      document.querySelector("#loginError").innerText =
        "نام کاربری یا شماره موبایل معتبر نیست";

      return;
    }


    if (password.length < 4) {
      document.querySelector("#loginError").innerText =
        "رمز عبور نمی‌تواند کمتر از ۴ کاراکتر باشد";

      return;
    }


    const savedAccount = localStorage.getItem(`account_${username}`);


    if (savedAccount) {

      const account = JSON.parse(savedAccount);


      if (account.password !== password) {

        document.querySelector("#loginError").innerText =
          "رمز عبور اشتباه است";

        return;
      }


    } else {

      localStorage.setItem(
        `account_${username}`,
        JSON.stringify({
          phone: username,
          password: password,
        })
      );

    }


    const user = {
      id: username,
      username: username,
      login: true,
    };


    setCookie(
      "currentUser",
      JSON.stringify(user),
      30
    );


    if (!localStorage.getItem(`userData_${username}`)) {

      localStorage.setItem(
        `userData_${username}`,
        JSON.stringify({
          cart: [],
          orders: [],
        })
      );

    }


    window.location.href = "shop.html";

  });
}

// ===============================
// REDIRECT LOGIN PAGE
// ===============================

const currentPath = window.location.pathname;

if (currentPath.includes("index.html") || currentPath === "/") {
  const savedUser = getCookie("currentUser");

  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);

      if (user.login === true) {
        window.location.href = "shop.html";
      }
    } catch (error) {
      removeCookie("currentUser");
    }
  }
}

// ===============================
// PRIVATE PAGE CHECK
// ===============================

const privatePages = ["shop.html", "details.html"];

const currentPage = window.location.pathname.split("/").pop();

if (privatePages.includes(currentPage)) {
  const savedUser = getCookie("currentUser");

  if (!savedUser) {
    window.location.href = "index.html";
  } else {
    try {
      const user = JSON.parse(savedUser);

      if (!user.login) {
        window.location.href = "index.html";
      }
    } catch (error) {
      removeCookie("currentUser");

      window.location.href = "index.html";
    }
  }
}

// ===============================
// CURRENT USER
// ===============================

let currentUser = null;

try {
  currentUser = JSON.parse(getCookie("currentUser") || "null");
} catch (error) {
  currentUser = null;
}

// ===============================
// USER DATA
// ===============================

let cart = [];

let orders = [];

function loadUserData() {
  if (!currentUser) {
    cart = [];
    orders = [];
    return;
  }

  const savedData = localStorage.getItem(`userData_${currentUser.id}`);

  if (savedData) {
    const data = JSON.parse(savedData);

    cart = data.cart || [];

    orders = data.orders || [];
  } else {
    cart = [];
    orders = [];
  }
}

// ===============================
// SAVE USER DATA
// ===============================

function saveUserData() {
  if (!currentUser) return;

  localStorage.setItem(
    `userData_${currentUser.id}`,

    JSON.stringify({
      cart,

      orders,
    }),
  );
}

// ===============================
// LOGOUT
// ===============================

const logoutBtn = document.querySelector("#logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    saveUserData();

    removeCookie("currentUser");

    window.location.href = "index.html";
  });
}

// ===============================
// CART
// ===============================

const cartItems = document.querySelector("#cartItems");

const totalPrice = document.querySelector("#totalPrice");

function renderCart() {
  if (!cartItems) return;

  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price;

    cartItems.innerHTML += `


<div class="cart-item">


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



</div>


`;
  });

  if (totalPrice) {
    totalPrice.innerText = total.toLocaleString();
  }
}

function removeCart(index) {
  cart.splice(index, 1);

  saveUserData();

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
      id: Date.now(),

      name: button.dataset.name,

      price: Number(button.dataset.price),
    };

    cart.push(product);

    saveUserData();

    renderCart();

    showMessage("محصول به سبد خرید اضافه شد");
  });
});

// ===============================
// MESSAGE
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

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 2000);
}

// ===============================
// DELIVERY OPTIONS
// ===============================

const deliveryTime = document.querySelector("#deliveryTime");

function createDeliveryOptions() {
  if (!deliveryTime) return;

  deliveryTime.innerHTML = `

<option value="">

انتخاب زمان ارسال

</option>

`;

  const now = new Date();

  const timeSlots = [
    "10:00 تا 12:00",

    "12:00 تا 14:00",

    "14:00 تا 16:00",

    "16:00 تا 18:00",

    "18:00 تا 20:00",

    "20:00 تا 22:00",
  ];

  for (let day = 3; day <= 7; day++) {
    const date = new Date();

    date.setDate(now.getDate() + day);

    const dateText = date.toLocaleDateString("fa-IR");

    timeSlots.forEach((time) => {
      const option = document.createElement("option");

      option.value = `${dateText} - ${time}`;

      option.innerText = `${dateText} - ${time}`;

      deliveryTime.appendChild(option);
    });
  }
}

createDeliveryOptions();
// ===============================
// CHECKOUT
// ===============================

const checkoutForm = document.querySelector("#checkoutForm");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", (e) => {
    e.preventDefault();


    const fullname = document.querySelector("#fullname").value.trim();
    const email = document.querySelector("#email").value.trim();
    const address = document.querySelector("#address").value.trim();
    const postal = document.querySelector("#postal").value.trim();
    const delivery = document.querySelector("#deliveryTime").value;


    // Regex ها

    const nameRegex = /^[a-zA-Z\u0600-\u06FF\s]{3,40}$/;

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const postalRegex =
      /^\d{10}$/;



    // نام و نام خانوادگی

    if (!nameRegex.test(fullname)) {

      showMessage("نام و نام خانوادگی معتبر نیست");

      return;
    }



    // ایمیل

    if (!emailRegex.test(email)) {

      showMessage("ایمیل معتبر نیست");

      return;
    }



    // آدرس

    if (address.length < 10) {

      showMessage("آدرس باید حداقل ۱۰ کاراکتر باشد");

      return;
    }



    // کد پستی

    if (!postalRegex.test(postal)) {

      showMessage("کد پستی باید دقیقا ۱۰ رقم باشد");

      return;
    }



    // زمان ارسال

    if (!delivery) {

      showMessage("زمان ارسال را انتخاب کنید");

      return;
    }



    // سبد خرید

    if (cart.length === 0) {

      showMessage("سبد خرید خالی است");

      return;
    }



    const order = {

      id: Date.now(),

      userId: currentUser.id,

      name: fullname,

      email: email,

      address: address,

      postal: postal,

      products: [...cart],

      total: cart.reduce(
        (sum, item) => sum + item.price,
        0
      ),

      date: new Date().toLocaleString("fa-IR"),

      deliveryTime: delivery,

    };



    orders.push(order);


    cart = [];


    saveUserData();

    renderCart();

    showOrders();


    checkoutForm.reset();


    showMessage("سفارش با موفقیت ثبت شد");

  });
}

// ===============================
// SHOW ORDERS
// ===============================

function showOrders() {
  const result = document.querySelector("#orderResult");

  if (!result) return;

  result.innerHTML = "";

  if (orders.length === 0) {
    result.innerHTML = "هنوز سفارشی ثبت نشده است";

    return;
  }

  orders.forEach((order) => {
    result.innerHTML += `


<div class="order-card">


<h3>
✔ سفارش ثبت شده
</h3>



نام:

${order.name}

<br>



ایمیل:

${order.email}

<br>



آدرس:

${order.address}

<br>



کد پستی:

${order.postal}



<br><br>



محصولات:


<br>



${order.products
  .map(
    (item) => `


${item.name}

-

${item.price.toLocaleString()}

تومان

<br>


`,
  )
  .join("")}





<br>



مبلغ:

${order.total.toLocaleString()}

تومان





<br>



تاریخ ثبت:

${order.date}






<br>



زمان ارسال:

${order.deliveryTime}


<br><br>


<button 
class="cancel-order-btn"
onclick="removeOrder(${order.id})">

<i class="fa-solid fa-trash"></i>

لغو سفارش

</button>

❌ لغو سفارش

</button>



</div>


<hr>


`;
  });
}

function removeOrder(orderId) {
  const confirmDelete = confirm("آیا از لغو این سفارش مطمئن هستید؟");

  if (!confirmDelete) return;

  orders = orders.filter((order) => order.id !== orderId);

  saveUserData();

  showOrders();

  showMessage("سفارش لغو شد");
}

window.removeOrder = removeOrder;

// ===============================
// BACK TO SHOP
// ===============================

const backShop = document.querySelector("#backShop");

if (backShop) {
  backShop.addEventListener("click", () => {
    window.location.href = "shop.html";
  });
}

// ===============================
// DETAILS ADD CART
// ===============================

const detailsButtons = document.querySelectorAll(".details-btn");

detailsButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const product = {
      name: button.dataset.name,

      price: Number(button.dataset.price),

      image: button.dataset.image,

      description: button.dataset.description,

      specs: JSON.parse(button.dataset.specs),
    };

    localStorage.setItem("selectedProduct", JSON.stringify(product));

    window.location.href = "details.html";
  });
});

const selectedProduct = JSON.parse(localStorage.getItem("selectedProduct"));

const detailsImage = document.querySelector("#detailsImage");
const detailsName = document.querySelector("#detailsName");
const detailsPrice = document.querySelector("#detailsPrice");
const detailsDescription = document.querySelector("#detailsDescription");
const detailsSpecs = document.querySelector("#detailsSpecs");

if (selectedProduct && detailsImage) {
  detailsImage.src = selectedProduct.image;

  detailsName.innerText = selectedProduct.name;

  detailsPrice.innerText = selectedProduct.price.toLocaleString() + " تومان";

  detailsDescription.innerText = selectedProduct.description;

  if (detailsSpecs && selectedProduct.specs) {
    detailsSpecs.innerHTML = "";

    Object.entries(selectedProduct.specs).forEach(([key, value]) => {
      detailsSpecs.innerHTML += `

<tr>

<td>${key}</td>

<td>${value}</td>

</tr>

`;
    });
  }
}

// ===============================
// DETAILS PAGE BUTTONS
// ===============================

const detailsAddCart = document.querySelector("#detailsAddCart");

if (detailsAddCart) {
  detailsAddCart.addEventListener("click", () => {
    if (!selectedProduct) return;

    if (!currentUser) {
      window.location.href = "index.html";
      return;
    }

    cart.push({
      id: Date.now(),
      name: selectedProduct.name,
      price: selectedProduct.price,
    });

    saveUserData();

    showMessage("محصول به سبد خرید اضافه شد");

    setTimeout(() => {
      window.location.href = "shop.html#cartSection";
    }, 300);
  });
}

// ===============================
// START
// ===============================

loadUserData();

renderCart();

showOrders();
