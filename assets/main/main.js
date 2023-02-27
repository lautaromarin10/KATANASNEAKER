  // Contenedor de productos a renderizar
  const products = document.getElementById("catalogo");
  // Contenedor de productos del carrito
  const cartCont = document.querySelector(".cart__conteiner");
  //El total en precio del carrito
  const totalPrice = document.getElementById("totalPrice__price")
  // El contenedor de las categorías
  const categories = document.querySelector(".categories");
  // todos los botones con la clase categoria
  const categoriesButtons = document.querySelectorAll(".category");
  // Botón de ver más
  const showMoreButton = document.querySelector(".btn-showmas");
  // Botón de comprar en las cards
  const buyButtonCard = document.getElementById("botoncompra");
  // Boton de compra en el carrito
  const buyCart = document.getElementById("comprar-cart");
  // Boton de borrar el pedido en el carrito
  const btnDeleteItems = document.getElementById("delete-item-cart");
  //modal que aparece al agregar/aumentar un producto en el  cart
  const successModal = document.querySelector(".overlay");
  // Botón para abrir y cerrar carrito
  const cartBtn = document.querySelector(".header__cart__icon");
  // Botón para abrir y cerrar menú
  const barsBtn = document.querySelector(".menu-label");
  // Carrito
  const cartMenu = document.querySelector(".cart");
  //  Menú 
  const barsMenu = document.querySelector(".navbar__list");
  // boton eliminar de cada card del carrito
  const botonEliminar = document.querySelector(".cart_btn");
  // card renderizada en el carrito
  const cartProduct = document.querySelector(".cart__item")
  
  
  



// se obtiene el contenido del cart desde el localStorage. Si no hay nada guardado, se inicia como un array vacío. 
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// guarda el contenido del cart en el localStorage. 
const saveLocalStorage = (cartList) => {
    localStorage.setItem("cart", JSON.stringify(cartList));
};

  // comprueba si es el ultimo indice 
  const isLastIndexOf = () => {
      return (
          productsController.nextProductsIndex === productsController.productsLimit
      );
  };
  
  //desestructuración del objeto
  const productData = (name,id,img,price) => {
      return {name,id,img,price}
  }



//   -------------------------------- FUNCIONES PARA LAS CATEGORIAS --------------------------------------

const changeShowMoreStatus = (category) => {
    if (!category) {
        showMoreButton.classList.remove("invisible");
        return;
    }
    showMoreButton.classList.add("invisible");
};



const changeFilterState = (e) => {
    const selectedCategory = e.target.dataset.category;
    changeShowMoreStatus(selectedCategory);
    changeCategoryStatus(selectedCategory);
};

const applyFilter = (e) => {
    if (!e.target.classList.contains("category")) {
        return;
    } else {
        changeFilterState(e);
    }
    if (!e.target.dataset.category) {
        products.innerHTML = "";
        renderProducts();
    } else {
        renderProducts(0, e.target.dataset.category);
        productsController.nextProductsIndex = 1;
    }
};

//   -------------------------------- FUNCIONES PARA LAS CATEGORIAS --------------------------------------

  
// ----------------------------------- FUNCIONES DEL CART --------------------------------

const emptyCart = () => {
    cart = [];
    checkCartStatus();
}

const  checkCartStatus = () => {
    saveLocalStorage(cart)
    renderCart();
    showtotalPriceValue();
    disableBtn(buyCart)
    disableBtn(btnDeleteItems)
}


  
const isExistingCartProduct = (product) => {
    return cart.find( (item) => {
        return item.id === product.id
    })
}

const createCartProduct = (product) => {
    cart = [
        ...cart,
        {
            ...product,
            quantity: 1,
        }
    ]
}


const addUnitToProduct = (product) => {
    cart = cart.map((cartProduct) => {
        return cartProduct.id === product.id
            ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
            : cartProduct;
    });

    checkCartStatus()
};

const subtractProductQuantity = (existingProduct) => {
    cart = cart.map((product) => {
        return product.id === existingProduct.id
            ? { ...product, quantity: Number(product.quantity) - 1 }
            : product;
    });
};

const removeProductFromCart = (existingProduct) => {
    cart = cart.filter((product) => product.id !== existingProduct.id);
    checkCartStatus();
};

const handleDecrementEvent = (id) => {
    const existingCartProduct = cart.find((item) => {
        return item.id === id;
    });

    if (existingCartProduct.quantity === 1) {
        if (window.confirm("¿Desea eliminar el producto del carrito?")) {
            removeProductFromCart(existingCartProduct);
        }
        return;
    }

    subtractProductQuantity(existingCartProduct);
};

const handleMoreEvent = (id) => {
    const existingCartProduct = cart.find((item) => {
        return item.id === id;
    });

    addUnitToProduct(existingCartProduct);
};

const handleQuantity = (e) => {
    if (e.target.classList.contains("down")) {
        handleDecrementEvent(e.target.dataset.id);
    } else if (e.target.classList.contains("up")) {
        handleMoreEvent(e.target.dataset.id);
    }
    checkCartStatus();
};

  
const gettotalPriceValue = () => {
    return cart.reduce((acc, cur) => {
        return acc + Number(cur.price) * cur.quantity;
    }, 0);
};



// ----------------------------------- FUNCIONES DEL CART --------------------------------
  

// ------------------------------------   RENDERS Y VISUALIZACION -------------------------------------

const showOverlay = (msg) => {
    successModal.classList.add("active-overlay");
    successModal.textContent = msg;
    setTimeout(() => {
        successModal.classList.remove("active-overlay");
    }, 1500);
};

 
const completeBuy = () => {
    buyCartProducts("Avanzar con la compra?", "¡Muchas gracias, que lo disfrutes!")
};

const deleteCart = () => {
    buyCartProducts("Desea borrar el pedido?", "El pedido se borro correctamente")
};

  
const renderProduct = (product) => {
    const {id,name,price,img} = product;
    return `
    <div class="card ">
            <div class="card__conteiner__img">
                <img src="${img}" alt="${name}" class="card__img">
            </div>

            <div class="card__info">
                <h2 class="card__name">${name}</h2>

                <div class="card__conteiner__shop">
                <span class="card__price"> $ ${price}</span>
                 <span class="card__buttom">
               
                <button 
                 class="botoncompra-hover botoncompra"
                 id="botoncompra"
                 data-id="${id}"
                data-name="${name}"
                data-price="${price}"
                data-img="${img}"
                
                >
                 comprar
                </button>

               
                    </span>
                 </div>
                 </div>
            </div>  `
    ;
};

const disableBtn = (btn) => {
    if (!cart.length) {
        btn.classList.add("disable");
    } else {
        btn.classList.remove("disable");
    }
};

  
const buyCartProducts = (confirmMsg,sucessMsg) => {
    if(!cart.length) return;
    if(window.confirm(confirmMsg)){
        emptyCart();
        alert(sucessMsg);
    }

}

const addProductToCart = (e) => {
    if(!e.target.classList.contains("botoncompra")){
        return;
    }
    const {name,id,img,price} = e.target.dataset;

    const product = productData(name,id,img,price);

    if(isExistingCartProduct(product)){
        addUnitToProduct(product);
        showOverlay(`Se agrego otro par de ${name} al carrito`);
        return;
    } else {
        createCartProduct(product)
        showOverlay(`Tus ${name} se agrego al carrito `);
    }

    checkCartStatus()

};

const showtotalPriceValue = () => {
    // anda bien
   totalPrice.innerHTML = ` $ ${gettotalPriceValue()} USD`;
}

  
const renderCartProduct = (cartProduct) => {
      
    const {id,name,price,img,quantity} = cartProduct
    return `
    <div class="cart__item" id="${id}">
    <img src="${img}" alt="${name}"  class="cart__img">

    <div class="cart__info">

        <div class="cart__name">
            <h2 class="sneaker__name">${name}</h2>
        </div>

        <div class="cart__utilities"> 
        <span class="cart__price">$ ${price} USD</span>
        <div class="item-handler">
        <span class="quantity-handler down" data-id=${id}>-</span>
        <span class="item-quantity">${quantity}</span>
        <span class="quantity-handler up" data-id=${id}>+</span>
        </div>
        </div>
    </div>

</div>
    `;
};

const renderCart = () => {
    // anda bien
    if (!cart.length){
        cartCont.innerHTML = `<span class="cart__empty">Tu carrito esta vacio</span>`;
        return
    } 
    cartCont.innerHTML = cart.map(renderCartProduct).join("")
}

const changeCategoryStatus = (selectedCategory) => {
    const categories = [...categoriesButtons];
    categories.forEach((categoryBtn) => {
        if (categoryBtn.dataset.category !== selectedCategory) {
            categoryBtn.classList.remove("selected");
            return;
        }
        categoryBtn.classList.add("selected");
    });
};

const renderCutProducts = (index = 0) => {
    products.innerHTML += productsController.dividedProducts[index]
        .map(renderProduct)
        .join("");
};

const renderFilteredProducts = (category) => {
    const productsList = sneakerData.filter((product) => {
        return product.category === category;
    });
    products.innerHTML = productsList.map(renderProduct).join("");
};

const renderProducts = (index = 0, category = undefined) => {
    if (!category) {
        renderCutProducts(index);
        return;
    }
    renderFilteredProducts(category);
};

  
const openMenu = () => {  
    barsMenu.classList.toggle("open-menu");
    if (cartMenu.classList.contains("open-cart")) {
        cartMenu.classList.remove("open-cart");
        return;
    }
};

const openCart = () => {
    cartMenu.classList.toggle("open-cart");
    if (barsMenu.classList.contains("open-menu")) {
        barsMenu.classList.remove("open-menu");
        return;
    }

};

const closeOnClick = (e) => {
    if (!e.target.classList.contains("navbar-link")) {
        return;
    }
    barsMenu.classList.remove("open-menu");
    overlay.classList.remove("show-overlay");
};

const closeOnScroll = () => {
    if (
        !barsMenu.classList.contains("open-menu") &&
        !cartMenu.classList.contains("open-cart")
    ) {
        return;
    }
    barsMenu.classList.remove("open-menu");
    cartMenu.classList.remove("open-cart");
};

const closeOnOverlayClick = () => {
    barsMenu.classList.remove("open-menu");
    cartMenu.classList.remove("open-cart");
    overlay.classList.remove("show-overlay");
};


const showMoreProducts = () => {
    renderProducts(productsController.nextProductsIndex);
    productsController.nextProductsIndex++;
    if (isLastIndexOf()) {
        showMoreButton.classList.add("invisible");
    }
};

// ------------------------------------   RENDERS Y VISUALIZACION -------------------------------------




//   -------------------------------- INIT --------------------------------
  
  const init = () => {
    document.addEventListener("DOMContentLoaded", renderProducts());
    document.addEventListener("DOMContentLoaded", renderCart);
    document.addEventListener("DOMContentLoaded", showtotalPriceValue);

    categories.addEventListener("click", applyFilter);
    showMoreButton.addEventListener("click", showMoreProducts);
    barsBtn.addEventListener("click", openMenu);
    cartBtn.addEventListener("click", openCart);

    barsMenu.addEventListener("click", closeOnClick);
    window.addEventListener("scroll", closeOnScroll);

    products.addEventListener("click", addProductToCart);
    buyCart.addEventListener("click", completeBuy);
    btnDeleteItems.addEventListener("click", deleteCart);
    cartCont.addEventListener("click", handleQuantity);

    disableBtn(buyCart)
    disableBtn(btnDeleteItems)  
};
  
  init();
  //   -------------------------------- INIT --------------------------------