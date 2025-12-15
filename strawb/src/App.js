import { useCallback, useEffect, useMemo, useState } from "react";
import threecake from "./images/threecake.png";

const CART_KEY = "strawbeary_cart";

const navLinks = [
    { href: "#header", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#body", label: "Menu" },
    { href: "#contact", label: "Contact" },
];

const getStoredCart = () => {
    if (typeof window === "undefined") return [];
    try {
        const raw = window.localStorage.getItem(CART_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
};

const primaryButtonClasses =
    "mt-4 inline-flex w-40 items-center justify-center rounded-xl bg-accent px-6 py-3 font-semibold uppercase tracking-wide text-white shadow-button transition hover:bg-[#ff1e4e] active:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function App() {
    const [cart, setCart] = useState(getStoredCart);
    const [menuItems, setMenuItems] = useState([]);
    const [menuLoading, setMenuLoading] = useState(true);
    const [menuError, setMenuError] = useState("");
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    // Simple client-side session id for cart/order persistence
    const [sessionId] = useState(() => {
        if (typeof window === "undefined") return "";
        const existing = window.localStorage.getItem("STRAWBEARY_SESSION_ID");
        if (existing) return existing;
        const id = `sess_${Math.random()
            .toString(36)
            .slice(2)}${Date.now().toString(36)}`;
        window.localStorage.setItem("STRAWBEARY_SESSION_ID", id);
        return id;
    });

    useEffect(() => {
        async function fetchMenu() {
            try {
                setMenuLoading(true);
                setMenuError("");
                const response = await fetch("/api/menu");
                if (!response.ok) {
                    throw new Error("Failed to load menu");
                }
                const data = await response.json();
                setMenuItems(data);
            } catch (error) {
                console.error(error);
                setMenuError(
                    "Unable to load menu right now. Please try again later."
                );
            } finally {
                setMenuLoading(false);
            }
        }
        fetchMenu();
    }, []);

    const updateCart = useCallback(
        (updater) => {
            setCart((prevCart) => {
                const nextCart =
                    typeof updater === "function" ? updater(prevCart) : updater;
                if (typeof window !== "undefined") {
                    window.localStorage.setItem(
                        CART_KEY,
                        JSON.stringify(nextCart)
                    );
                    // Persist cart in backend as well
                    fetch("/api/cart", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ sessionId, items: nextCart }),
                    }).catch((error) =>
                        console.warn("Failed to sync cart with server", error)
                    );
                }
                return nextCart;
            });
        },
        [sessionId]
    );

    const cartCount = useMemo(
        () => cart.reduce((total, item) => total + item.quantity, 0),
        [cart]
    );

    const cartTotal = useMemo(
        () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cart]
    );

    const addToCart = useCallback(
        (dishName) => {
            const dish = menuItems.find((item) => item.name === dishName);
            if (!dish) return;
            updateCart((prevCart) => {
                const existing = prevCart.find(
                    (item) => item.dishName === dishName
                );
                if (existing) {
                    return prevCart.map((item) =>
                        item.dishName === dishName
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }
                return [
                    ...prevCart,
                    { dishName: dish.name, price: dish.price, quantity: 1 },
                ];
            });
        },
        [menuItems, updateCart]
    );

    const removeFromCart = useCallback(
        (dishName) => {
            updateCart((prevCart) =>
                prevCart.filter((item) => item.dishName !== dishName)
            );
        },
        [updateCart]
    );

    const setQuantity = useCallback(
        (dishName, quantity) => {
            const safeQuantity = Math.max(1, Number(quantity) || 1);
            updateCart((prevCart) =>
                prevCart.map((item) =>
                    item.dishName === dishName
                        ? { ...item, quantity: safeQuantity }
                        : item
                )
            );
        },
        [updateCart]
    );

    const clearCart = useCallback(() => {
        updateCart([]);
    }, [updateCart]);

    const handleCheckout = useCallback(async () => {
        if (!cart.length) return;
        try {
            await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sessionId,
                    items: cart,
                    total: cartTotal,
                }),
            });
            clearCart();
            alert("Thank you! Your order has been placed.");
            setIsCartOpen(false);
        } catch (error) {
            console.error("Failed to place order", error);
            alert("Sorry, we could not place your order. Please try again.");
        }
    }, [cart, cartTotal, clearCart, sessionId]);

    const goToPrevSlide = () => {
        setCurrentSlide(
            (prev) =>
                (prev - 1 + (menuItems.length || 1)) / (menuItems.length || 1)
        );
    };

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % (menuItems.length || 1));
    };

    const handleNavClick = () => setIsMenuOpen(false);

    return (
        <>
            <section
                id="navBarSection"
                className="sticky top-0 z-50 bg-bg shadow-md"
            >
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
                    <div className="text-center">
                        <h1 className="font-secondary text-xl uppercase tracking-wide md:text-2xl">
                            STRAWBEARY
                        </h1>
                        <h2 className="-mt-1 font-cursive text-xl text-accent md:text-2xl font-semibold">
                            cafe
                        </h2>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            type="button"
                            className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-text-base transition hover:bg-secondary/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
                            aria-label="Toggle navigation"
                            aria-expanded={isMenuOpen}
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                        >
                            <span
                                className={`absolute h-0.5 w-6 rounded-full bg-text-base transition-all duration-300 ${
                                    isMenuOpen
                                        ? "rotate-45 translate-y-0"
                                        : "-translate-y-2"
                                }`}
                            ></span>
                            <span
                                className={`h-0.5 w-6 rounded-full bg-text-base transition-all duration-300 ${
                                    isMenuOpen ? "opacity-0" : "opacity-100"
                                }`}
                            ></span>
                            <span
                                className={`absolute h-0.5 w-6 rounded-full bg-text-base transition-all duration-300 ${
                                    isMenuOpen
                                        ? "-rotate-45 translate-y-0"
                                        : "translate-y-2"
                                }`}
                            ></span>
                        </button>

                        <button
                            id="open-cart"
                            type="button"
                            onClick={() => setIsCartOpen(true)}
                            className="relative inline-flex items-center gap-2 rounded-full bg-accent px-3 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-button transition hover:bg-[#ff1e4e] active:translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:px-6 md:text-base"
                        >
                            <span
                                className="hidden md:inline"
                                role="img"
                                aria-label="cart"
                            >
                                🛒
                            </span>
                            <span className="hidden md:inline">
                                Cart ({cartCount})
                            </span>
                            <span className="md:hidden">
                                🛒{" "}
                                {cartCount > 0 && (
                                    <span className="ml-1">{cartCount}</span>
                                )}
                            </span>
                        </button>
                    </div>
                </nav>
                <div
                    className={`overflow-hidden transition-all duration-300 ${
                        isMenuOpen
                            ? "max-h-64 opacity-100"
                            : "max-h-0 opacity-0 md:max-h-none md:opacity-100"
                    }`}
                >
                    <ul className="mx-auto flex max-w-6xl flex-col items-center gap-4 border-t border-secondary/30 bg-bg px-4 py-4 md:flex-row md:justify-center md:border-t-0 md:py-0">
                        {navLinks.map((link) => (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    onClick={handleNavClick}
                                    className="block text-base font-semibold text-text-base transition hover:text-accent md:text-lg"
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section
                id="header"
                className="relative min-h-[80vh] overflow-hidden bg-bg"
            >
                <div className="relative flex min-h-[70vh] w-full flex-col justify-between gap-8 overflow-hidden bg-pink-stripes px-6 py-16 md:flex-row md:px-12 lg:px-20">
                    <div className="z-10 max-w-xl space-y-4 text-left md:w-1/2">
                        <h2 className="font-cursive text-3xl text-accent md:text-4xl font-semibold">
                            strawbeary cafe
                        </h2>
                        <h1 className="font-secondary text-4xl uppercase leading-tight md:text-5xl">
                            Love at first bite
                        </h1>
                        <p className="text-lg text-text-base/80">
                            Cozy vibes, handcrafted treats, and a whole lot of
                            berry love. Dive into our signature bites and sip
                            something sweet.
                        </p>
                        <a href="#body">
                            <button
                                type="button"
                                className={primaryButtonClasses}
                            >
                                Menu
                            </button>
                        </a>
                    </div>

                    <div className="relative flex h-72 w-full items-center justify-center md:h-auto md:w-1/2">
                        <img
                            src={threecake}
                            alt="cupcake trio"
                            className="h-full w-full max-w-lg rounded-[3rem] object-cover shadow-card"
                        />
                    </div>
                </div>
            </section>

            <section id="body" className="bg-bg px-4 py-16 md:px-12 lg:px-20">
                <div
                    id="about"
                    className="mx-auto flex max-w-6xl flex-col items-center gap-8 rounded-3xl bg-white/80 p-8 shadow-card md:flex-row"
                >
                    <div className="flex w-full flex-col items-center text-center md:w-1/3">
                        <h1 className="font-secondary text-3xl text-accent">
                            Made for you
                        </h1>
                        <h2 className="font-cursive text-2xl text-text-base font-semibold">
                            {"{ With love }"}
                        </h2>
                    </div>
                    <p className="w-full text-lg leading-relaxed text-text-base/80 md:w-2/3">
                        Welcome to Strawbeary Cafe, where every bite is a
                        delight! Our cafe is a cozy haven for food lovers,
                        offering a delightful menu filled with fresh, locally
                        sourced ingredients. From our signature strawberry
                        desserts to savory dishes, we pride ourselves on
                        creating meals that bring joy and satisfaction. Whether
                        you&apos;re stopping by for a quick coffee or settling
                        in for a hearty meal, Strawbeary Cafe promises an
                        unforgettable dining experience. Join us and taste the
                        love in every bite!
                    </p>
                </div>

                <div className="mx-auto mt-16 max-w-6xl text-center">
                    <h1 className="font-secondary text-3xl text-accent">
                        Our Menu
                    </h1>
                    {menuLoading ? (
                        <p className="mt-6 text-text-base/80">
                            Loading menu...
                        </p>
                    ) : menuError ? (
                        <p className="mt-6 text-red-600">{menuError}</p>
                    ) : (
                        <div className="mt-8 overflow-x-auto rounded-3xl bg-white shadow-card">
                            <table className="min-w-full divide-y divide-secondary/60 text-left">
                                <thead className="bg-primary/60 text-sm font-semibold uppercase text-text-base">
                                    <tr>
                                        <th className="px-4 py-3">Image</th>
                                        <th className="px-4 py-3">Dish Name</th>
                                        <th className="px-4 py-3 hidden md:table-cell">
                                            Description
                                        </th>
                                        <th className="px-4 py-3">Price</th>
                                        <th className="px-4 py-3 text-center">
                                            Action
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-secondary/30 text-base">
                                    {menuItems.map((dish) => (
                                        <tr
                                            key={dish._id}
                                            className="hover:bg-tertiary/50"
                                        >
                                            <td className="px-4 py-4">
                                                {dish.imageURL && (
                                                    <img
                                                        src={dish.imageURL}
                                                        alt={dish.name}
                                                        className="h-32 w-32 rounded-2xl object-cover shadow-card"
                                                    />
                                                )}
                                            </td>
                                            <td className="px-4 py-4 font-semibold">
                                                {dish.name}
                                            </td>
                                            <td className="hidden px-4 py-4 text-sm text-text-base/80 md:table-cell">
                                                {dish.description}
                                            </td>
                                            <td className="px-4 py-4 font-semibold">
                                                ${dish.price.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-4 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        addToCart(dish.name)
                                                    }
                                                    className="inline-flex items-center justify-center rounded-xl bg-accent px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white shadow-button transition hover:bg-[#ff1e4e]"
                                                >
                                                    Add to Cart
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="mx-auto mt-16 flex max-w-5xl flex-col items-center gap-4">
                    <div className="relative w-full overflow-hidden rounded-3xl bg-white shadow-card">
                        <div
                            className="flex w-full transition-transform duration-500 ease-in-out"
                            style={{
                                transform: `translateX(-${
                                    currentSlide * 100
                                }%)`,
                            }}
                        >
                            {menuItems.map((dish) => (
                                <div
                                    key={dish._id}
                                    className="flex w-full flex-shrink-0 items-center justify-center bg-tertiary/60 p-6"
                                >
                                    <img
                                        src={dish.imageURL}
                                        alt={dish.name}
                                        className="h-80 w-full max-w-3xl rounded-2xl object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={goToPrevSlide}
                            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-text-base/70 p-3 text-white shadow-card transition hover:bg-text-base"
                            aria-label="Previous slide"
                        >
                            &#8592;
                        </button>
                        <button
                            type="button"
                            onClick={goToNextSlide}
                            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-text-base/70 p-3 text-white shadow-card transition hover:bg-text-base"
                            aria-label="Next slide"
                        >
                            &#8594;
                        </button>
                    </div>
                    <div className="flex gap-2">
                        {menuItems.map((dish, index) => (
                            <button
                                key={dish._id}
                                type="button"
                                aria-label={`Go to slide ${index + 1}`}
                                onClick={() => setCurrentSlide(index)}
                                className={`h-3 w-3 rounded-full transition ${
                                    currentSlide === index
                                        ? "bg-accent"
                                        : "bg-secondary"
                                }`}
                            ></button>
                        ))}
                    </div>
                </div>
            </section>

            {isCartOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setIsCartOpen(false)}
                    ></div>
                    <div className="relative w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="font-secondary text-2xl text-accent">
                                Your Cart
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsCartOpen(false)}
                                className="text-3xl text-text-base transition hover:text-accent"
                                aria-label="Close Cart"
                            >
                                &times;
                            </button>
                        </div>

                        <div id="cart-list">
                            {cart.length === 0 ? (
                                <p className="text-center font-primary text-lg text-text-base/70">
                                    Your cart is empty.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-secondary/40">
                                        <thead>
                                            <tr className="bg-secondary/60 text-left text-sm font-semibold uppercase">
                                                <th className="px-4 py-3">
                                                    Item
                                                </th>
                                                <th className="px-4 py-3">
                                                    Price
                                                </th>
                                                <th className="px-4 py-3">
                                                    Qty
                                                </th>
                                                <th className="px-4 py-3">
                                                    Subtotal
                                                </th>
                                                <th className="px-4 py-3"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-secondary/30">
                                            {cart.map((item) => (
                                                <tr key={item.dishName}>
                                                    <td className="px-4 py-3 font-semibold">
                                                        {item.dishName}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        ${item.price.toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setQuantity(
                                                                        item.dishName,
                                                                        item.quantity -
                                                                            1
                                                                    )
                                                                }
                                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary font-bold"
                                                            >
                                                                -
                                                            </button>
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={
                                                                    item.quantity
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    setQuantity(
                                                                        item.dishName,
                                                                        event
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                                className="w-16 rounded-lg border border-secondary/60 px-2 py-1 text-center"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setQuantity(
                                                                        item.dishName,
                                                                        item.quantity +
                                                                            1
                                                                    )
                                                                }
                                                                className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary font-bold"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 font-semibold">
                                                        $
                                                        {(
                                                            item.price *
                                                            item.quantity
                                                        ).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeFromCart(
                                                                    item.dishName
                                                                )
                                                            }
                                                            className="text-sm font-semibold text-accent transition hover:underline"
                                                        >
                                                            Remove
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div
                                id="cart-summary"
                                className="text-xl font-bold"
                            >
                                Total: ${cartTotal.toFixed(2)}
                            </div>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={clearCart}
                                    className="rounded-xl border-2 border-accent px-6 py-2 font-semibold text-accent transition hover:bg-accent hover:text-white"
                                >
                                    Clear Cart
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCheckout}
                                    className="rounded-xl bg-accent px-6 py-2 font-semibold text-white transition hover:bg-[#ff1e4e]"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <section
                id="contact"
                className="bg-bg px-4 py-16 md:px-12 lg:px-20"
            >
                <div className="mx-auto flex max-w-6xl flex-col gap-12 rounded-3xl bg-white/80 p-8 shadow-card lg:flex-row">
                    <div className="w-full rounded-3xl bg-primary/80 p-8 text-text-base lg:w-1/2">
                        <h1 className="font-secondary text-3xl text-accent">
                            Contact Us ౨ৎ
                        </h1>
                        <form className="mt-6 flex flex-col gap-4">
                            <label
                                className="font-semibold uppercase tracking-wide"
                                htmlFor="name"
                            >
                                Name
                            </label>
                            <input
                                className="rounded-xl border border-secondary/60 px-4 py-3 focus:border-accent focus:outline-none"
                                type="text"
                                id="name"
                                name="name"
                                required
                            />

                            <label
                                className="font-semibold uppercase tracking-wide"
                                htmlFor="email"
                            >
                                Email
                            </label>
                            <input
                                className="rounded-xl border border-secondary/60 px-4 py-3 focus:border-accent focus:outline-none"
                                type="email"
                                id="email"
                                name="email"
                                required
                            />

                            <label
                                className="font-semibold uppercase tracking-wide"
                                htmlFor="message"
                            >
                                Message
                            </label>
                            <textarea
                                className="rounded-xl border border-secondary/60 px-4 py-3 focus:border-accent focus:outline-none"
                                id="message"
                                name="message"
                                rows="5"
                                required
                            ></textarea>

                            <button
                                type="submit"
                                className={primaryButtonClasses}
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    <div className="w-full rounded-3xl bg-secondary/50 p-2 lg:w-1/2">
                        <iframe
                            title="Strawbeary Cafe map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.685701330998!2d-73.98601769999999!3d40.7469409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259e9eb0c8785%3A0x5148f2b276a151cd!2sSeoul%20Sweets!5e0!3m2!1sen!2sus!4v1759650616290!5m2!1sen!2sus"
                            className="h-[450px] w-full rounded-2xl border-0"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </section>

            <section
                id="footer"
                className="bg-pink-stripes px-4 py-10 text-center text-text-base shadow-inner"
            >
                <footer className="mx-auto flex max-w-5xl flex-col items-center gap-4 rounded-3xl bg-white/75 p-6">
                    <p className="font-primary text-sm text-text-base/90">
                        &copy; 2024 Strawbeary Cafe. All rights reserved.
                    </p>
                    <div className="flex items-center gap-4">
                        <a
                            href="https://facebook.com/strawbearycafe"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="text-accent transition hover:text-text-base"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                            </svg>
                        </a>
                        <span className="text-text-base/30">|</span>
                        <a
                            href="https://instagram.com/strawbearycafe"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="text-accent transition hover:text-text-base"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <rect
                                    width="20"
                                    height="20"
                                    x="2"
                                    y="2"
                                    rx="5"
                                    ry="5"
                                />
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                            </svg>
                        </a>
                        <span className="text-text-base/30">|</span>
                        <a
                            href="https://twitter.com/strawbearycafe"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                            className="text-accent transition hover:text-text-base"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                <path d="M9 18c-4.51 2-5-2-7-2" />
                            </svg>
                        </a>
                    </div>

                    <div className="space-y-1 text-sm">
                        <p>
                            Email:{" "}
                            <a
                                className="text-accent underline"
                                href="mailto:info@strawbearycafe.com"
                            >
                                info@strawbearycafe.com
                            </a>
                        </p>
                        <p>
                            Phone:{" "}
                            <a
                                className="text-accent underline"
                                href="tel:+1234567890"
                            >
                                (123) 456-7890
                            </a>
                        </p>
                        <p>
                            Business Hours: Mon - Fri 8am - 8pm, Sat - Sun 9am -
                            5pm
                        </p>
                    </div>
                </footer>
            </section>
        </>
    );
}

export default App;
