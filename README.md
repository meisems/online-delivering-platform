# 🍣 MakiYa — Sushi Maki Delivery Website

A full-stack delivery website built with **Python Flask** + **SQLite** + **HTML/CSS/JS**.

---

## 📁 Project Structure

```
makiya/
│
├── app.py               ← Flask backend (API + serves index.html)
├── requirements.txt     ← Python dependencies
├── orders.db            ← SQLite database (auto-created on first run)
│
└── templates/
    └── index.html       ← Frontend delivery website
```

---

## ⚙️ Setup & Run

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure your business info
Open `templates/index.html` and update the `CFG` block near the bottom:

```js
const CFG = {
  businessName:  "MakiYa",                 // Your business name
  messengerUser: "YOUR_PAGE_USERNAME",     // Facebook Page username (from page URL)
  whatsappNo:    "639XXXXXXXXX",           // Your WhatsApp number (with country code, no +)
  deliveryFee:   50,                       // Delivery fee in PHP
  apiBase:       "",                       // Leave empty — Flask serves everything
};
```

### 3. Run the server
```bash
python app.py
```

Open your browser at → **http://127.0.0.1:5000**

---

## 🌐 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| `GET`  | `/` | Serves the delivery website |
| `POST` | `/api/order` | Save a new order to the database |
| `GET`  | `/api/orders` | List all orders (newest first) |
| `GET`  | `/api/orders?status=Pending` | Filter by status |
| `GET`  | `/api/order/<id>` | Get a single order by ID |
| `PATCH`| `/api/order/<id>/status` | Update order status |

### Order Status Values
`Pending` → `Confirmed` → `Preparing` → `Out for Delivery` → `Delivered` / `Cancelled`

### Example: Submit an order (POST /api/order)
```json
{
  "name":    "Juan dela Cruz",
  "phone":   "09171234567",
  "address": "123 Mabini St, Calamba, Laguna",
  "payment": "GCash",
  "notes":   "Near the blue gate",
  "items": [
    { "name": "Dragon Roll", "qty": 2, "price": 229 },
    { "name": "California Maki", "qty": 1, "price": 149 }
  ],
  "subtotal": 607,
  "delivery": 50,
  "total":    657
}
```

### Response
```json
{
  "ok": true,
  "order_id": 1,
  "ref": "MKY-20250501-0001",
  "message": "Order MKY-20250501-0001 saved successfully!"
}
```

---

## 🔄 How It Works (Order Flow)

```
Customer fills checkout form
        ↓
Frontend POSTs order to /api/order
        ↓
Flask saves to orders.db (SQLite)
        ↓
Returns order reference (e.g. MKY-20250501-0001)
        ↓
Frontend shows "Order saved!" banner
        ↓
Customer clicks Messenger or WhatsApp
        ↓
Pre-filled message with order + ref sent to owner
        ↓
Owner confirms & updates status via /api/order/<id>/status
```

---

## 🚀 Deploying Online (Optional)

To make the site accessible publicly, you can deploy to:

- **Railway** (free tier): `railway up`
- **Render** (free tier): Connect GitHub repo
- **PythonAnywhere**: Upload files and run Flask app

For production, replace SQLite with PostgreSQL and set `debug=False`.

---

## ✏️ Customizing the Menu

Edit the `MENU` array in `templates/index.html`:

```js
{ id:14, cat:"classic", emoji:"🍤", name:"Prawn Tempura Roll",
  price:179, desc:"Crispy tempura, avocado, spicy mayo", badge:"New" },
```

Categories: `"classic"` | `"premium"` | `"baked"` | `"party"`

---

Built with ❤️ for MakiYa · Calamba, Laguna, Philippines
