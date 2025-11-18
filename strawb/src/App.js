import { useCallback, useMemo, useState } from "react";

const menuDishes = [
    {
        dishName: "Strawbeary Jam",
        description:
            "A delightful jammy dessert made from fresh strawberries and a hint of mint.",
        price: 5.99,
        imageURL: "images/cake.png",
    },
    {
        dishName: "Strawbeary Delight",
        description:
            "A layered dessert with strawberries, cream, and fluffy cake.",
        price: 6.49,
        imageURL: "images/cakeslice.webp",
    },
    {
        dishName: "Strawbeary Combo",
        description:
            "Get three flavors of our signature cupcakes in one combo!",
        price: 24.99,
        imageURL: "images/threecake.png",
    },
    {
        dishName: "Strawbeary Sparkle",
        description:
            "A refreshing blend of strawberries and sparkling water. Hints of refreshing mint.",
        price: 12.99,
        imageURL: "images/drink.png",
    },
    {
        dishName: "Strawbeary Juice",
        description:
            "An aromatic juice made from fresh strawberries and a hint of mint.",
        price: 6.99,
        imageURL: "images/drink2.webp",
    },
    {
        dishName: "Strawbeary Latte",
        description:
            "A creamy latte made with fresh strawberries, milk, and a touch of honey.",
        price: 7.49,
        imageURL: "images/latte.webp",
    },
];

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
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const updateCart = useCallback((updater) => {
        setCart((prevCart) => {
            const nextCart =
                typeof updater === "function" ? updater(prevCart) : updater;
            if (typeof window !== "undefined") {
                window.localStorage.setItem(CART_KEY, JSON.stringify(nextCart));
            }
            return nextCart;
        });
    }, []);

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
            const dish = menuDishes.find((item) => item.dishName === dishName);
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
                    { dishName, price: dish.price, quantity: 1 },
                ];
            });
        },
        [updateCart]
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

    const goToPrevSlide = () => {
        setCurrentSlide(
            (prev) => (prev - 1 + menuDishes.length) % menuDishes.length
        );
    };

    const goToNextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % menuDishes.length);
    };

    const handleNavClick = () => setIsMenuOpen(false);

    return (
        <>
            <section
                id="navBarSection"
                className="sticky top-0 z-50 bg-bg shadow-md"
            >
                <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
                    <div className="text-center">
                        <h1 className="font-secondary text-2xl uppercase tracking-wide">
                            STRAWBEARY
                        </h1>
                        <h2 className="-mt-1 font-cursive text-2xl text-accent">
                            cafe
                        </h2>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            className="relative flex h-11 w-11 flex-col items-center justify-center gap-2 rounded-full bg-secondary text-text-base transition hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:hidden"
                            aria-label="Toggle navigation"
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                        >
                            <span
                                className={`h-0.5 w-7 rounded-full bg-text-base transition ${
                                    isMenuOpen
                                        ? "translate-y-1.5 rotate-45"
                                        : ""
                                }`}
                            ></span>
                            <span
                                className={`h-0.5 w-7 rounded-full bg-text-base ${
                                    isMenuOpen ? "opacity-0" : ""
                                }`}
                            ></span>
                            <span
                                className={`h-0.5 w-7 rounded-full bg-text-base transition ${
                                    isMenuOpen
                                        ? "-translate-y-1.5 -rotate-45"
                                        : ""
                                }`}
                            ></span>
                        </button>

                        <button
                            id="open-cart"
                            type="button"
                            onClick={() => setIsCartOpen(true)}
                            className="relative inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 font-semibold uppercase tracking-wide text-white shadow-button transition hover:bg-[#ff1e4e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:px-6"
                        >
                            <span role="img" aria-label="cart">
                                🛒
                            </span>
                            <span className="hidden md:inline">
                                Cart ({cartCount})
                            </span>
                            <span className="text-sm md:hidden">
                                {cartCount}
                            </span>
                        </button>
                    </div>
                </nav>
                <ul
                    className={`mx-auto max-w-6xl flex-col items-center gap-6 px-4 pb-4 transition-all duration-300 md:flex md:flex-row md:justify-center md:pb-0 ${
                        isMenuOpen ? "flex" : "hidden md:flex"
                    }`}
                >
                    {navLinks.map((link) => (
                        <li key={link.href}>
                            <a
                                href={link.href}
                                onClick={handleNavClick}
                                className="text-lg font-semibold text-text-base transition hover:text-accent"
                            >
                                {link.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </section>

            <section
                id="header"
                className="relative min-h-[80vh] overflow-hidden bg-bg"
            >
                <div className="relative flex min-h-[70vh] w-full flex-col justify-between gap-8 overflow-hidden bg-pink-stripes px-6 py-16 md:flex-row md:px-12 lg:px-20">
                    <div className="z-10 max-w-xl space-y-4 text-left md:w-1/2">
                        <h2 className="font-cursive text-3xl text-accent md:text-4xl">
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
                            src="images/threecake.png"
                            alt="cupcake trio"
                            className="h-full w-full max-w-lg rounded-[3rem] object-cover shadow-card"
                        />
                    </div>
                </div>
            </section>
        </>
    );
}

export default App;
