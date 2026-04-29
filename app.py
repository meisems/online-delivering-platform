"""
MakiYa — Flask Backend
Handles order submission and saves to SQLite database.

Run:
    pip install flask flask-cors
    python app.py
"""

from flask import Flask, request, jsonify, render_template, abort
from flask_cors import CORS
import sqlite3, os, json
from datetime import datetime

app = Flask(__name__)
CORS(app)  # allow requests from the frontend

# ─── Database path ────────────────────────────────────────────────────────────
DB_PATH = os.path.join(os.path.dirname(__file__), "orders.db")


# ─── Init DB ──────────────────────────────────────────────────────────────────
def init_db():
    """Create tables if they don't exist yet."""
    with sqlite3.connect(DB_PATH) as con:
        con.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                order_ref   TEXT    NOT NULL,
                created_at  TEXT    NOT NULL,
                name        TEXT    NOT NULL,
                phone       TEXT    NOT NULL,
                address     TEXT    NOT NULL,
                payment     TEXT    NOT NULL,
                notes       TEXT,
                items       TEXT    NOT NULL,   -- JSON string
                subtotal    REAL    NOT NULL,
                delivery    REAL    NOT NULL,
                total       REAL    NOT NULL,
                status      TEXT    NOT NULL DEFAULT 'Pending'
            )
        """)
        con.commit()


def get_db():
    """Return a dict-cursor connection."""
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con


def gen_ref():
    """Generate a short human-readable order reference, e.g. MKY-20250501-0042."""
    now = datetime.now()
    with get_db() as con:
        count = con.execute("SELECT COUNT(*) FROM orders").fetchone()[0] + 1
    return f"MKY-{now.strftime('%Y%m%d')}-{count:04d}"


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.route("/")
def index():
    """Serve the delivery website."""
    return render_template("index.html")


@app.route("/api/order", methods=["POST"])
def place_order():
    """
    Accepts a JSON order from the frontend.

    Expected body:
    {
        "name":    "Juan dela Cruz",
        "phone":   "09171234567",
        "address": "123 Mabini St, Calamba",
        "payment": "Cash on Delivery",
        "notes":   "Near the blue gate",
        "items": [
            { "name": "California Maki", "qty": 2, "price": 149 }
        ],
        "subtotal": 298,
        "delivery": 50,
        "total":    348
    }
    """
    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({"ok": False, "error": "Invalid JSON body"}), 400

    # ── Validate required fields ──────────────────────────────────────────────
    required = ["name", "phone", "address", "payment", "items", "subtotal", "delivery", "total"]
    missing  = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"ok": False, "error": f"Missing fields: {', '.join(missing)}"}), 422

    items = data["items"]
    if not isinstance(items, list) or len(items) == 0:
        return jsonify({"ok": False, "error": "Order must have at least one item"}), 422

    ref        = gen_ref()
    created_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with get_db() as con:
        con.execute("""
            INSERT INTO orders
                (order_ref, created_at, name, phone, address, payment, notes,
                 items, subtotal, delivery, total, status)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
        """, (
            ref,
            created_at,
            data["name"],
            data["phone"],
            data["address"],
            data["payment"],
            data.get("notes", ""),
            json.dumps(items),
            data["subtotal"],
            data["delivery"],
            data["total"],
            "Pending",
        ))
        con.commit()
        order_id = con.execute("SELECT last_insert_rowid()").fetchone()[0]

    return jsonify({
        "ok":       True,
        "order_id": order_id,
        "ref":      ref,
        "message":  f"Order {ref} saved successfully!",
    }), 201


@app.route("/api/orders", methods=["GET"])
def list_orders():
    """
    Return all orders (newest first).
    Optional query params:
        ?status=Pending   — filter by status
        ?limit=50         — max rows (default 100)
    """
    status = request.args.get("status")
    limit  = min(int(request.args.get("limit", 100)), 500)

    with get_db() as con:
        if status:
            rows = con.execute(
                "SELECT * FROM orders WHERE status=? ORDER BY id DESC LIMIT ?",
                (status, limit)
            ).fetchall()
        else:
            rows = con.execute(
                "SELECT * FROM orders ORDER BY id DESC LIMIT ?",
                (limit,)
            ).fetchall()

    def row_to_dict(r):
        d = dict(r)
        d["items"] = json.loads(d["items"])
        return d

    return jsonify([row_to_dict(r) for r in rows])


@app.route("/api/order/<int:order_id>", methods=["GET"])
def get_order(order_id):
    """Return a single order by ID."""
    with get_db() as con:
        row = con.execute("SELECT * FROM orders WHERE id=?", (order_id,)).fetchone()
    if not row:
        abort(404)
    d = dict(row)
    d["items"] = json.loads(d["items"])
    return jsonify(d)


@app.route("/api/order/<int:order_id>/status", methods=["PATCH"])
def update_status(order_id):
    """
    Update order status.
    Body: { "status": "Confirmed" | "Preparing" | "Out for Delivery" | "Delivered" | "Cancelled" }
    """
    data   = request.get_json(force=True, silent=True) or {}
    status = data.get("status", "").strip()
    allowed = {"Pending", "Confirmed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"}
    if status not in allowed:
        return jsonify({"ok": False, "error": f"status must be one of: {', '.join(sorted(allowed))}"}), 422

    with get_db() as con:
        changed = con.execute(
            "UPDATE orders SET status=? WHERE id=?", (status, order_id)
        ).rowcount
        con.commit()

    if not changed:
        abort(404)
    return jsonify({"ok": True, "order_id": order_id, "status": status})


# ─── Run ──────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    init_db()
    print("✅  MakiYa backend running → http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
