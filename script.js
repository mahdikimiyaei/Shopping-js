
// ===============================
// LOGIN SYSTEM
// ===============================


const loginForm = document.querySelector("#loginForm");


if(loginForm){


loginForm.addEventListener("submit",(e)=>{


e.preventDefault();



const username =
document.querySelector("#username").value;



const password =
document.querySelector("#password").value;



const phoneRegex = /^09\d{9}$/;



if(phoneRegex.test(username) && password.length >= 4){



const user = {

id: username,

username: username,

login:true

};



// پاک کردن کاربر قبلی

localStorage.removeItem(
"currentUser"
);



// ذخیره کاربر جدید

localStorage.setItem(
"currentUser",
JSON.stringify(user)
);





const userData =
localStorage.getItem(
`userData_${username}`
);



if(!userData){


localStorage.setItem(

`userData_${username}`,

JSON.stringify({

cart:[],

orders:[]

})

);


}



window.location.replace(
"shop.html"
);



}

else{


document.querySelector("#loginError").innerText =
"شماره موبایل یا رمز عبور اشتباه است";


}



});


}

// ===============================
// REDIRECT IF ALREADY LOGIN
// ===============================

if(window.location.pathname.includes("index.html") || window.location.pathname === "/"){


const savedUser =
localStorage.getItem("currentUser");


if(savedUser){


const user =
JSON.parse(savedUser);



if(user && user.login === true){


window.location.replace(
"shop.html"
);


}


}


}


// ===============================
// CHECK LOGIN ALL PRIVATE PAGES
// ===============================


const savedUser =
localStorage.getItem("currentUser");


const privatePages = [
"shop.html",
"details.html"
];



const currentPage =
window.location.pathname.split("/").pop();



if(privatePages.includes(currentPage)){


if(!savedUser){


window.location.replace(
"index.html"
);


}



const user =
JSON.parse(savedUser);



if(!user || user.login !== true){


window.location.replace(
"index.html"
);


}


}



// ===============================
// CURRENT USER
// ===============================



let currentUser =
JSON.parse(
localStorage.getItem("currentUser") || "null"
);









// ===============================
// LOAD USER DATA
// ===============================


let cart=[];

let orders=[];



function loadUserData(){



currentUser =
JSON.parse(
localStorage.getItem("currentUser")
);



if(!currentUser){


cart=[];

orders=[];

return;


}



const data =

JSON.parse(

localStorage.getItem(

`userData_${currentUser.id}`

)

);



cart =
data?.cart || [];



orders =
data?.orders || [];



}



loadUserData();









// ===============================
// SAVE USER DATA
// ===============================


function saveUserData(){



if(!currentUser)
return;



localStorage.setItem(

`userData_${currentUser.id}`,

JSON.stringify({

cart,

orders

})

);


}

// ===============================
// LOGOUT
// ===============================


const logoutBtn =
document.querySelector("#logoutBtn");



if(logoutBtn){


logoutBtn.addEventListener("click",()=>{



saveUserData();



localStorage.removeItem(
"currentUser"
);



window.location.replace(
"index.html"
);



});


}









// ===============================
// CART
// ===============================



const cartItems =
document.querySelector("#cartItems");



const totalPrice =
document.querySelector("#totalPrice");







function renderCart(){



if(!cartItems)
return;



cartItems.innerHTML="";



let total=0;



cart.forEach((item,index)=>{



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



if(totalPrice){

totalPrice.innerText =
total.toLocaleString();

}



}







function removeCart(index){



cart.splice(index,1);



saveUserData();



renderCart();



}



window.removeCart =
removeCart;









// ===============================
// ADD PRODUCT
// ===============================



const addButtons =
document.querySelectorAll(".add-cart");



addButtons.forEach(button=>{


button.addEventListener("click",()=>{



const product = {


id:Date.now(),



name:
button.dataset.name,



price:
Number(
button.dataset.price
)



};




cart.push(product);



saveUserData();



renderCart();



showMessage(
"محصول به سبد خرید اضافه شد"
);



});


});












// ===============================
// MESSAGE
// ===============================



function showMessage(text){



const toast =
document.createElement("div");



toast.innerText=text;



toast.style.position="fixed";

toast.style.bottom="30px";

toast.style.left="50%";

toast.style.transform=
"translateX(-50%)";

toast.style.background="#22c55e";

toast.style.color="white";

toast.style.padding="15px 25px";

toast.style.borderRadius="15px";

toast.style.zIndex="999";



document.body.appendChild(toast);



setTimeout(()=>{


toast.remove();


},2000);



}









// ===============================
// DELIVERY OPTIONS
// ===============================


const deliveryTime =
document.querySelector("#deliveryTime");



function createDeliveryOptions(){



if(!deliveryTime)
return;



deliveryTime.innerHTML = `

<option value="">

انتخاب زمان ارسال

</option>

`;



const now =
new Date();



const timeSlots = [


"10:00 تا 12:00",

"12:00 تا 14:00",

"14:00 تا 16:00",

"16:00 تا 18:00",

"18:00 تا 20:00",

"20:00 تا 22:00"


];



for(let day = 3; day <= 7; day++){



const date =
new Date();



date.setDate(
now.getDate() + day
);




const dateText =
date.toLocaleDateString("fa-IR");




timeSlots.forEach(time=>{



const option =
document.createElement("option");



option.value =
`${dateText} - ${time}`;



option.innerText =
`${dateText} - ${time}`;



deliveryTime.appendChild(option);



});


}


}



createDeliveryOptions();
// ===============================
// CHECKOUT
// ===============================


const checkoutForm =
document.querySelector("#checkoutForm");



if(checkoutForm){


checkoutForm.addEventListener("submit",(e)=>{


e.preventDefault();




if(cart.length===0){


alert(
"سبد خرید خالی است"
);


return;


}







const order={



id:Date.now(),



userId:
currentUser.id,



name:
document.querySelector("#fullname").value,



email:
document.querySelector("#email").value,



address:
document.querySelector("#address").value,



postal:
document.querySelector("#postal").value,



products:
[...cart],




total:

cart.reduce(

(sum,item)=>

sum + item.price,

0

),



date:

new Date()
.toLocaleString("fa-IR"),



deliveryTime:

document.querySelector("#deliveryTime").value



};







orders.push(order);



// خالی کردن سبد

cart=[];



saveUserData();



renderCart();



showOrders();



checkoutForm.reset();



showMessage(
"سفارش ثبت شد"
);



});


}









// ===============================
// SHOW ORDERS
// ===============================


function showOrders(){



const result =
document.querySelector("#orderResult");



if(!result)
return;



result.innerHTML="";



if(orders.length===0){



result.innerHTML =
"هنوز سفارشی ثبت نشده است";

return;


}







orders.forEach(order=>{


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



${

order.products.map(item=>`


${item.name}

-

${item.price.toLocaleString()}

تومان

<br>


`).join("")

}





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





</div>


<hr>


`;



});


}


// ===============================
// PRODUCT DETAILS
// ===============================


const detailsButtons = document.querySelectorAll(".details-btn");


detailsButtons.forEach(button => {


button.addEventListener("click",()=>{


const product = {


name: button.dataset.name,


price: Number(button.dataset.price),


image: button.dataset.image,


description: button.dataset.description,


specs: JSON.parse(button.dataset.specs)



};



localStorage.setItem(

"selectedProduct",

JSON.stringify(product)

);



window.location.href="details.html";


});


});


// ===============================
// SHOW DETAILS PAGE
// ===============================


const selectedProduct = JSON.parse(

localStorage.getItem("selectedProduct")

);



const detailsImage =
document.querySelector("#detailsImage");


const detailsName =
document.querySelector("#detailsName");


const detailsPrice =
document.querySelector("#detailsPrice");


const detailsDescription =
document.querySelector("#detailsDescription");


const detailsSpecs =
document.querySelector("#detailsSpecs");





if(selectedProduct && detailsImage){



detailsImage.src =
selectedProduct.image;



detailsName.innerText =
selectedProduct.name;



detailsPrice.innerText =
selectedProduct.price.toLocaleString()
+
" تومان";



detailsDescription.innerText =
selectedProduct.description;





if(detailsSpecs && selectedProduct.specs){



detailsSpecs.innerHTML = "";



Object.entries(selectedProduct.specs).forEach(([key,value])=>{



detailsSpecs.innerHTML += `


<tr>

<td>
${key}
</td>


<td>
${value}
</td>


</tr>


`;



});



}



}

// ===============================
// BACK TO SHOP
// ===============================


const backShop =
document.querySelector("#backShop");


if(backShop){


backShop.addEventListener("click",()=>{


window.location.href="shop.html";


});


}



// ===============================
// DETAILS ADD CART
// ===============================


const detailsAddCart =

document.querySelector("#detailsAddCart");



if(detailsAddCart){



detailsAddCart.addEventListener("click",()=>{



if(!selectedProduct)
return;



const product = {


id:Date.now(),


name:selectedProduct.name,


price:selectedProduct.price



};



cart.push(product);



saveUserData();



renderCart();



showMessage(

"محصول به سبد خرید اضافه شد"

);



});



}




// ===============================
// START
// ===============================



renderCart();


showOrders();