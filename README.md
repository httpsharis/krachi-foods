# Karachi Foods — Digital Ordering Platform

A highly optimized, mobile-responsive web application designed to streamline food ordering for Karachi Foods in Johar Town, Lahore. The platform features a dynamic 3D brutalist aesthetic that captures the raw charm of a hand-painted food stand, while providing a seamless, app-like ordering experience.

## Features

- **Brutalist 3D Aesthetics**: Unique visual design featuring solid offset shadows, dotted ticket borders, and interactive 3D parallax effects on menu cards.
- **Flawless Mobile Responsiveness**: Fluid typography and grid systems (`clamp()`, `min()`) ensure the layout adapts beautifully from massive desktop screens down to the narrowest smartphones.
- **Native-like Cart Overlay**: An intuitive order ticket sidebar that slides in and takes up the full width of mobile screens for a focused checkout process.
- **WhatsApp Integration**: A sophisticated URL payload builder that compiles cart items, totals, delivery ranges, and user notes into a single, perfectly formatted WhatsApp message sent directly to the kitchen.
- **Dynamic Menu Configuration**: A centralized `config.js` architecture allowing easy updates to categories, items, pricing, and business hours without touching core UI logic.
- **Geolocation Delivery Range Check**: Calculates distance from the shop using the Haversine formula and user's GPS coordinates to determine if they are within the delivery range.

## Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with extensive use of CSS Variables and CSS Math Functions (`clamp`, `min`) for fluidity.
- **Architecture**: Separated concerns via `index.html` (DOM), `style.css` (Presentation), `app.js` (Logic & State), and `config.js` (Data).

## Local Development

1. Clone the repository.
2. Serve the directory using any local web server. For example, with Python:
   ```bash
   python3 -m http.server 8080
   ```
3. Open `http://localhost:8080` in your web browser.

## Customization

To update the menu or shop configuration, modify `config.js`:
- **`waNumber`**: Update the international format WhatsApp number for orders.
- **`menu`**: Add or remove objects from the array to update the digital menu.
- **`shop`**: Adjust the GPS coordinates of the shop for accurate delivery range tracking.

## License
Proprietary - All rights reserved by Karachi Foods.
