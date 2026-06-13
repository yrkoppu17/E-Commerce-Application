#!/usr/bin/env python3
"""
build_new_pdfs.py
Generates the 12 shopEZ phase-wise documentation PDFs.
Provides extremely detailed, project-specific, and visually perfect layouts.
"""

import os
import sys
from xhtml2pdf import pisa

BASE_OUTPUT_DIR = r"d:\E-Commerce Application\MERN Phase Wise"

# ─────────────────────────────────────────────────────────────────────────────
# GLOBAL CSS
# ─────────────────────────────────────────────────────────────────────────────
BASE_CSS = """
@page {
    size: A4;
    margin: 54pt 54pt 60pt 54pt;
}
body {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 10pt;
    color: #1f2937;
    line-height: 1.5;
    margin: 0;
    padding: 0;
}
h1 {
    font-size: 20pt;
    font-weight: bold;
    color: #1e1b4b;
    margin: 0 0 10pt 0;
    padding-bottom: 6pt;
    border-bottom: 2.5pt solid #4f46e5;
}
h2 {
    font-size: 13pt;
    font-weight: bold;
    color: #312e81;
    margin: 16pt 0 6pt 0;
    padding-bottom: 3pt;
    border-bottom: 1pt solid #c7d2fe;
}
h3 {
    font-size: 11pt;
    font-weight: bold;
    color: #3730a3;
    margin: 10pt 0 4pt 0;
}
h4 {
    font-size: 10pt;
    font-weight: bold;
    color: #4338ca;
    margin: 8pt 0 3pt 0;
}
p { margin: 4pt 0 6pt 0; }
.list-item {
    margin: 2pt 0 4pt 15pt;
    text-indent: -10pt;
}
.bullet {
    color: #4f46e5;
    font-weight: bold;
}
strong { color: #1e1b4b; }
em { color: #4338ca; }
code {
    font-family: Courier, monospace;
    font-size: 9pt;
    background: #f1f5f9;
    color: #1e1b4b;
    padding: 1pt 3pt;
}
pre {
    font-family: Courier, monospace;
    font-size: 8.5pt;
    background: #0f172a;
    color: #e2e8f0;
    padding: 8pt;
    margin: 8pt 0;
    border-left: 3pt solid #4f46e5;
}
pre code {
    background: transparent;
    color: #e2e8f0;
    padding: 0;
}
.cover-block {
    background: #1e1b4b;
    color: #ffffff;
    padding: 30pt 30pt 24pt 30pt;
    margin-bottom: 18pt;
}
.cover-block h1 {
    color: #ffffff;
    border-bottom: 2pt solid #818cf8;
    font-size: 22pt;
    margin-bottom: 4pt;
    padding-bottom: 4pt;
}
.cover-block .subtitle {
    color: #c7d2fe;
    font-size: 12pt;
    margin: 0;
}
.cover-block .meta {
    color: #a5b4fc;
    font-size: 9pt;
    margin-top: 12pt;
}
.cover-block .phase-tag {
    font-size: 8.5pt;
    color: #a5b4fc;
    margin-bottom: 2pt;
    text-transform: uppercase;
    font-weight: bold;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin: 8pt 0 12pt 0;
    font-size: 9pt;
}
th {
    background: #4f46e5;
    color: #ffffff;
    font-weight: bold;
    padding: 6pt 8pt;
    text-align: left;
    border: 1pt solid #4f46e5;
}
td {
    padding: 5pt 8pt;
    border: 1pt solid #e2e8f0;
    vertical-align: top;
}
tr:nth-child(even) td { background: #f8fafc; }
.section-rule {
    border: none;
    border-top: 1pt solid #e2e8f0;
    margin: 12pt 0;
}
.note-box {
    background: #eff6ff;
    border-left: 3pt solid #3b82f6;
    padding: 6pt 10pt;
    margin: 8pt 0;
    font-size: 9pt;
    color: #1e3a5f;
}
.warn-box {
    background: #fffbeb;
    border-left: 3pt solid #f59e0b;
    padding: 6pt 10pt;
    margin: 8pt 0;
    font-size: 9pt;
    color: #78350f;
}
.arch-box {
    border: 1.5pt solid #4f46e5;
    border-radius: 4px;
    padding: 8px 12px;
    background: #eef2ff;
    color: #1e1b4b;
    font-weight: bold;
    text-align: center;
}
.pass-badge {
    color: #065f46;
    font-weight: bold;
}
"""

def html_doc(title, subtitle, phase_tag, content_html):
    """Wraps content in a standard styled HTML page."""
    return f"""<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<style>{BASE_CSS}</style>
</head>
<body>
<div class="cover-block">
  <div class="phase-tag">{phase_tag}</div>
  <h1>{title}</h1>
  <p class="subtitle">{subtitle}</p>
  <p class="meta">shopEZ E-commerce Marketplace &nbsp;|&nbsp; MERN Stack &nbsp;|&nbsp; June 2026</p>
</div>
{content_html}
</body>
</html>"""

def write_pdf(html_str, output_path):
    """Converts HTML string to a PDF file."""
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "wb") as f:
        result = pisa.CreatePDF(html_str, dest=f)
    if result.err:
        print(f"  [WARN] PDF conversion errors for: {output_path}")
    else:
        size = os.path.getsize(output_path)
        print(f"  [OK] {os.path.basename(output_path)} ({size:,} bytes)")
    return not result.err

# ─────────────────────────────────────────────────────────────────────────────
# DIAGRAMS HTML DEFINITIONS
# ─────────────────────────────────────────────────────────────────────────────
HTML_SOLUTION_ARCH_DIAGRAM = """
<table style="width: 100%; margin: 10pt 0; border: none;">
  <tr>
    <td colspan="3" style="border: none; text-align: center; padding: 0; background: transparent;">
      <div class="arch-box" style="width: 300pt; margin: 0 auto;">Client Browser (React SPA View)</div>
    </td>
  </tr>
  <tr>
    <td style="border: none; text-align: right; width: 45%; padding: 4pt 0; font-size: 8.5pt; color: #4b5563; background: transparent;">
      1. REST API Requests (Axios) &nbsp;
    </td>
    <td style="border: none; text-align: center; width: 10%; padding: 4pt 0; font-size: 11pt; font-weight: bold; color: #4f46e5; background: transparent;">
      | &nbsp; ^
    </td>
    <td style="border: none; text-align: left; width: 45%; padding: 4pt 0; font-size: 8.5pt; color: #4b5563; background: transparent;">
      &nbsp; 6. Payment Intents (Stripe Elements)
    </td>
  </tr>
  <tr>
    <td colspan="3" style="border: none; text-align: center; padding: 0; background: transparent;">
      <div class="arch-box" style="width: 300pt; margin: 0 auto; background: #e0e7ff; border-color: #6366f1;">
        Express Web Server (Node.js Controller & Middleware)
      </div>
    </td>
  </tr>
  <tr>
    <td style="border: none; text-align: right; width: 45%; padding: 4pt 0; font-size: 8.5pt; color: #4b5563; background: transparent;">
      2. Route Guarding (JWT Middleware) &nbsp;
    </td>
    <td style="border: none; text-align: center; width: 10%; padding: 4pt 0; font-size: 11pt; font-weight: bold; color: #4f46e5; background: transparent;">
      | &nbsp; ^
    </td>
    <td style="border: none; text-align: left; width: 45%; padding: 4pt 0; font-size: 8.5pt; color: #4b5563; background: transparent;">
      &nbsp; 3. Query & Body Validation
    </td>
  </tr>
  <tr>
    <td colspan="3" style="border: none; text-align: center; padding: 0; background: transparent;">
      <div class="arch-box" style="width: 300pt; margin: 0 auto; background: #faf5ff; border-color: #a855f7;">
        MongoDB Atlas / Mongoose Models / Local uploads (Multer)
      </div>
    </td>
  </tr>
</table>
"""

HTML_DFD_CONTEXT_DIAGRAM = """
<table style="width: 100%; margin: 10pt 0; border: none;">
  <tr>
    <td colspan="3" style="border: none; text-align: center; padding: 0; background: transparent;">
      <div class="arch-box" style="width: 280pt; margin: 0 auto;">Customer (End User)</div>
    </td>
  </tr>
  <tr>
    <td style="border: none; text-align: right; width: 45%; padding: 4pt 0; font-size: 8.5pt; color: #4b5563; background: transparent;">
      Inputs: Credentials, Cart Actions, Reviews &nbsp;
    </td>
    <td style="border: none; text-align: center; width: 10%; padding: 4pt 0; font-size: 11pt; font-weight: bold; color: #4f46e5; background: transparent;">
      | &nbsp; ^
    </td>
    <td style="border: none; text-align: left; width: 45%; padding: 4pt 0; font-size: 8.5pt; color: #4b5563; background: transparent;">
      &nbsp; Outputs: Catalog, Confirmations
    </td>
  </tr>
  <tr>
    <td colspan="3" style="border: none; text-align: center; padding: 0; background: transparent;">
      <div class="arch-box" style="width: 280pt; margin: 0 auto; background: #e0e7ff; border-color: #6366f1;">
        shopEZ E-Commerce System
      </div>
    </td>
  </tr>
  <tr>
    <td style="border: none; text-align: right; width: 45%; padding: 4pt 0; font-size: 8.5pt; color: #4b5563; background: transparent;">
      Inputs: Product CRUD, Coupon Rules &nbsp;
    </td>
    <td style="border: none; text-align: center; width: 10%; padding: 4pt 0; font-size: 11pt; font-weight: bold; color: #4f46e5; background: transparent;">
      | &nbsp; ^
    </td>
    <td style="border: none; text-align: left; width: 45%; padding: 4pt 0; font-size: 8.5pt; color: #4b5563; background: transparent;">
      &nbsp; Outputs: Sales Analytics, Order Logs
    </td>
  </tr>
  <tr>
    <td colspan="3" style="border: none; text-align: center; padding: 0; background: transparent;">
      <div class="arch-box" style="width: 280pt; margin: 0 auto; background: #faf5ff; border-color: #a855f7;">
        Admin / Seller (Operations Manager)
      </div>
    </td>
  </tr>
</table>
"""

HTML_FSD_ARCH_DIAGRAM = """
<table style="width: 100%; margin: 10pt 0; border: none;">
  <tr>
    <td style="border: none; text-align: center; padding: 0; background: transparent;">
      <div class="arch-box" style="width: 320pt; margin: 0 auto;">
        Client (Browser)<br/>
        <span style="font-size: 8.5pt; font-weight: normal; color: #4b5563;">React.js SPA &nbsp;&bull;&nbsp; Vite &nbsp;&bull;&nbsp; Tailwind CSS</span>
      </div>
    </td>
  </tr>
  <tr>
    <td style="border: none; text-align: center; padding: 4pt 0; font-size: 9pt; color: #4f46e5; background: transparent;">
      | &nbsp; ^<br/>
      <span style="font-size: 8pt; color: #4b5563;">HTTP / REST (Axios)</span>
    </td>
  </tr>
  <tr>
    <td style="border: none; text-align: center; padding: 0; background: transparent;">
      <div class="arch-box" style="width: 320pt; margin: 0 auto; background: #e0e7ff; border-color: #6366f1;">
        Backend (Node.js + Express.js)<br/>
        <span style="font-size: 8.5pt; font-weight: normal; color: #4b5563;">Routes -> Middleware (JWT) -> Controllers -> Models</span>
      </div>
    </td>
  </tr>
  <tr>
    <td style="border: none; text-align: center; padding: 4pt 0; font-size: 9pt; color: #4f46e5; background: transparent;">
      | &nbsp; ^<br/>
      <span style="font-size: 8pt; color: #4b5563;">Mongoose ODM / File Operations</span>
    </td>
  </tr>
  <tr>
    <td style="border: none; text-align: center; padding: 0; background: transparent;">
      <div class="arch-box" style="width: 320pt; margin: 0 auto; background: #faf5ff; border-color: #a855f7;">
        MongoDB Database / Local Disk Storage
      </div>
    </td>
  </tr>
</table>
"""

# ─────────────────────────────────────────────────────────────────────────────
# 1. BRAINSTORMING & IDEATION PHASE
# ─────────────────────────────────────────────────────────────────────────────

def doc_brainstorming_idea_generation():
    content = """
    <h2>1. Problem Statement Identification</h2>
    <p>Small and medium-sized retail businesses struggle to set up and manage an online storefront efficiently due to complex setups, high subscription fees, and lack of customization. Customers demand a fast, frictionless, and secure online shopping experience with persistent carts, advanced filters, transparent pricing, and trustable payments.</p>
    
    <h3>PS-1: The Online Shopper (Convenience & Trust)</h3>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>User Profile:</strong> A busy online consumer seeking smooth retail experience across mobile and desktop.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Objective:</strong> Find and purchase items quickly with minimal friction.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Obstacles:</strong> Cart items disappearing on session reload, slow page loads, complex checkout pipelines, and lack of real-time inventory checks.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Negative Consequences:</strong> Friction triggers frustration, resulting in high cart abandonment rates.</p>
    
    <h3>PS-2: The Store Admin / Seller (Operations & Control)</h3>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>User Profile:</strong> Business owner or manager handling catalog and orders.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Objective:</strong> Manage product stocks, process orders, review customer feedback, and verify sales growth metrics.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Obstacles:</strong> Clunky database updates, difficulty uploading assets, and manual order status tracking.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Negative Consequences:</strong> Inventory desyncs and delayed fulfillments.</p>
    
    <hr class="section-rule"/>
    <h2>2. Brainstorming and Idea Listing</h2>
    <p>The development team collaborated to list potential solutions and architectural requirements:</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Custom-built MERN Stack Application:</strong> Build a fully decoupled stack (React, Node, Express, MongoDB) for absolute control over UI, performance, and backend logic.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>JWT-based Stateless Authentication:</strong> Implement JSON Web Tokens stored in HTTP-Only cookies to protect against XSS and maintain secure sessions.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Role-Based Access Control (RBAC):</strong> Build distinct user hierarchies (Customer vs. Seller/Admin) into API and UI routers.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Persistent Shopping Cart:</strong> Store cart states in React state (synced to localized context) and associate order logs in MongoDB.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Interactive Admin Ledger:</strong> Create visual charts (Chart.js) to display monthly sales, revenue progress, and real-time low-stock alarms.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Local Multer Image Storage:</strong> Multer disk storage for product image uploads with static file serving.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Mock Stripe Payment Intents:</strong> Simulated payment endpoint returning client secrets to model industry-standard gateway checkout.</p>
    
    <hr class="section-rule"/>
    <h2>3. Categorization and Grouping of Ideas</h2>
    <table>
      <tr><th>Category</th><th>Ideas</th></tr>
      <tr><td><strong>Core Architecture and Security</strong></td><td>Full-stack MERN decoupling; JWT token-based authentication; Middleware enforcing access levels (user, seller, admin)</td></tr>
      <tr><td><strong>Customer Experience (CX)</strong></td><td>Auto-saving persistent shopping cart; Catalog search with autocomplete suggestions; Multi-step checkout with coupon deductions; Verified purchase review badge and upvoting</td></tr>
      <tr><td><strong>Administrative Operations</strong></td><td>Centralized dashboard with sales stats; Instant product CRUD operations; Customer status controllers (block/unblock); Active coupon rules compiler</td></tr>
    </table>
    
    <hr class="section-rule"/>
    <h2>4. Priority Matrix (MoSCoW Method)</h2>
    <table>
      <tr>
        <th>Must Have (High Priority)</th>
        <th>Should Have (Medium Priority)</th>
        <th>Could Have (Low Priority)</th>
        <th>Won't Have (Deferred)</th>
      </tr>
      <tr>
        <td>JWT Authentication and RBAC</td>
        <td>Admin Dashboard Sales Charts</td>
        <td>Related Product Suggestions</td>
        <td>Multi-vendor commission splits</td>
      </tr>
      <tr>
        <td>Product Catalog Listing</td>
        <td>Coupon Code Validation Engine</td>
        <td>Wishlist One-Tap Move to Cart</td>
        <td>Advanced AI recommendations</td>
      </tr>
      <tr>
        <td>Persistent Shopping Cart</td>
        <td>Customer Review Upvotes</td>
        <td>Shipping Speed Selectors</td>
        <td>Multi-currency conversions</td>
      </tr>
      <tr>
        <td>Multi-Step Checkout Flow</td>
        <td>Low Stock Notification Alerts</td>
        <td>Address Book Managers</td>
        <td>Native mobile applications</td>
      </tr>
      <tr>
        <td>Mock Stripe Payments</td>
        <td>Verified Buyer Review Badge</td>
        <td>Account Info Editor</td>
        <td>Live chat customer support</td>
      </tr>
    </table>
    """
    return html_doc("Brainstorming & Ideation Phase", "Brainstorming - Idea Generation - Prioritization", "Brainstorming and Ideation Phase", content)

def doc_define_problem_statements():
    content = """
    <h2>1. Define Problem Statements</h2>
    <p>The following structured problem statements were derived from interviews, observational research, and competitive analysis of existing e-commerce platforms.</p>
    
    <hr class="section-rule"/>
    <h2>2. Persona A: The Convenience-Seeking Shopper (End-User)</h2>
    <table>
      <tr><th>Field</th><th>Details</th></tr>
      <tr><td><strong>Profile</strong></td><td>A busy professional, age 28, who frequently shops online for electronics, clothing, and home goods.</td></tr>
      <tr><td><strong>Objective</strong></td><td>Quick, friction-free purchasing. Finding products matching price/rating thresholds. Secure tokenized checkouts.</td></tr>
      <tr><td><strong>Current Behavior</strong></td><td>Uses Amazon and ASOS. Abandons checkouts if more than 3 shipping forms appear or no coupon inputs are visible.</td></tr>
      <tr><td><strong>Pain Points</strong></td>
        <td>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Cart items disappearing on browser session expiry.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Slow-loading image assets causing frustration.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Login sessions expiring too quickly, wiping active shopping carts.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Hidden shipping fees revealed only at payment stage.</p>
        </td>
      </tr>
      <tr><td><strong>Gains Expected</strong></td>
        <td>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Immediate autocomplete suggestions on keyword searches.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Instant checkout totals with exact breakdown (price, coupon discount, shipping, taxes).</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Persistent, cross-session shopping cart retention.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Trustable verified buyer review badges.</p>
        </td>
      </tr>
    </table>
    
    <hr class="section-rule"/>
    <h2>3. Persona B: The Operations and Control Manager (Admin/Seller)</h2>
    <table>
      <tr><th>Field</th><th>Details</th></tr>
      <tr><td><strong>Profile</strong></td><td>A retail entrepreneur, age 35, running a direct-to-consumer brand.</td></tr>
      <tr><td><strong>Objective</strong></td><td>Real-time visibility into inventory stocks, order status updates, and overall sales trends.</td></tr>
      <tr><td><strong>Current Behavior</strong></td><td>Uses Shopify or spreadsheets. Manually checks stock, updates product listings via CMS admin forms.</td></tr>
      <tr><td><strong>Pain Points</strong></td>
        <td>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Clunky dashboard portals requiring multiple steps to add items.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Slow inventory updates leading to oversells.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;No central overview linking sales, inventory, and customer management.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;No automated low-stock alert system.</p>
        </td>
      </tr>
      <tr><td><strong>Gains Expected</strong></td>
        <td>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Single-dashboard overview with sales graphs, low-stock alarms, and customer tables.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Direct image upload integration (Multer) for product photos.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Instant coupon code management (create, toggle, delete).</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;One-click order delivery milestone progression.</p>
        </td>
      </tr>
    </table>
    
    <hr class="section-rule"/>
    <h2>4. Problem Statement Summary</h2>
    <div class="note-box">
      <strong>Core Problem:</strong> shopEZ addresses the fundamental gap between the increasing demand for seamless, transparent, and feature-rich e-commerce experiences and the inability of SMBs to implement such platforms affordably and quickly. The platform simultaneously bridges administrative inefficiency by unifying inventory, order, customer, and analytics management into a single modern interface.
    </div>
    """
    return html_doc("Define Problem Statements", "Brainstorming & Ideation Phase", "Brainstorming and Ideation Phase", content)

def doc_empathy_map():
    content = """
    <h2>1. Empathy Map Canvas - The Convenience-Seeking Shopper</h2>
    <p>This empathy map captures the emotional and behavioral dimensions of our primary customer persona to guide design decisions.</p>
    <table>
      <tr>
        <th colspan="2">Empathy Map - Convenience-Seeking Shopper</th>
      </tr>
      <tr>
        <td style="width:50%;vertical-align:top;">
          <strong>THINKS and FEELS</strong><br/>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;"Is my billing address and card information secure?"</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;"I hope my shopping cart remains saved even if I switch devices."</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Relieved when site shows active stock alerts and free shipping triggers.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Frustrated when checkout steps feel long and confusing.</p>
        </td>
        <td style="width:50%;vertical-align:top;">
          <strong>HEARS</strong><br/>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Friends: "I only buy from stores that deliver in under 3-5 days."</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Online forums: "Read customer reviews before placing orders."</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Social media recommendations for products.</p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:top;">
          <strong>SEES</strong><br/>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Modern, minimal layouts on platforms like Amazon or ASOS.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Confusing checkouts on smaller retail sites with hidden fees.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Product comparison grids and review ratings.</p>
        </td>
        <td style="vertical-align:top;">
          <strong>SAYS and DOES</strong><br/>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Says: "I will add this to my wishlist and decide later."</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Says: "I can't find a way to filter shirts by price."</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Does: Abandons checkout if more than 3 forms appear.</p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:top;">
          <strong>PAIN POINTS</strong><br/>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Slow-loading image assets causing impatience.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Login sessions expiring, wiping out active carts.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Hidden fees revealed only at the final payment step.</p>
        </td>
        <td style="vertical-align:top;">
          <strong>GAINS EXPECTED</strong><br/>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Immediate autocomplete suggestions on searches.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Instant checkout total with price breakdown.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Persistent cart surviving browser refreshes.</p>
        </td>
      </tr>
    </table>
    
    <hr class="section-rule"/>
    <h2>2. Empathy Map Canvas - The Efficiency-Focused Admin/Seller</h2>
    <table>
      <tr>
        <th colspan="2">Empathy Map - Operations and Control Manager</th>
      </tr>
      <tr>
        <td style="width:50%;vertical-align:top;">
          <strong>THINKS and FEELS</strong><br/>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;"I need to know which products are running low to reorder stock."</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;"I want an easy way to upload product images and create discount codes."</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Satisfied when sales metrics are trending upward in clear visual graphs.</p>
        </td>
        <td style="width:50%;vertical-align:top;">
          <strong>HEARS</strong><br/>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Customers asking: "Where is my order? Is it shipped yet?"</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;System alerts: "Warning: Product X is out of stock!"</p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:top;">
          <strong>SEES</strong><br/>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Sales trends and category distribution graphs.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Inventory tables showing items, prices, and stock numbers.</p>
        </td>
        <td style="vertical-align:top;">
          <strong>SAYS and DOES</strong><br/>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Says: "I need to update this product description immediately."</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Does: Manually shifts order statuses from Processing to Shipped.</p>
        </td>
      </tr>
      <tr>
        <td style="vertical-align:top;">
          <strong>PAIN POINTS</strong><br/>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Clunky dashboards requiring multiple steps to add items.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Slow inventory updates leading to oversells.</p>
        </td>
        <td style="vertical-align:top;">
          <strong>GAINS EXPECTED</strong><br/>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Single dashboard with sales graphs, stock alarms, and user tables.</p>
          <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Direct image upload via Multer for product photos.</p>
        </td>
      </tr>
    </table>
    """
    return html_doc("Empathy Map Canvas", "Brainstorming & Ideation Phase", "Brainstorming and Ideation Phase", content)

# ─────────────────────────────────────────────────────────────────────────────
# 2. PROJECT DESIGN PHASE
# ─────────────────────────────────────────────────────────────────────────────

def doc_problem_solution_fit():
    content = """
    <h2>1. Problem - Solution Fit Matrix</h2>
    <p>This matrix maps each identified Customer Pain Point against the limitations of existing alternatives, and demonstrates how shopEZ's specific implementation resolves each problem.</p>
    <table>
      <tr>
        <th>Customer Pain Points</th>
        <th>Existing Alternatives (Shopify, Monoliths)</th>
        <th>shopEZ Solution Fit</th>
      </tr>
      <tr>
        <td><strong>Cart desync and item loss</strong></td>
        <td>Session-only cookies or basic local storage which clears on session timeout.</td>
        <td><strong>Persistent MERN Lifecycle:</strong> State is bound to React Context, syncing with local storage and database endpoints on login.</td>
      </tr>
      <tr>
        <td><strong>Poor catalog search and filtering</strong></td>
        <td>Simple string matches ignoring variants; return heavy, unfiltered datasets.</td>
        <td><strong>Dynamic Backend Filters:</strong> Mongoose queries support autocomplete suggestions, regex search, pricing boundaries, and rating filters.</td>
      </tr>
      <tr>
        <td><strong>Unoptimized media loading</strong></td>
        <td>Local server hosting bottlenecking bandwidth; high-resolution files served uncompressed.</td>
        <td><strong>Local Multer Storage + Static Serving:</strong> Uploaded images stored in /uploads with Express static serving for fast local access.</td>
      </tr>
      <tr>
        <td><strong>Complex administrative controls</strong></td>
        <td>Split admin pages or generic CMS dashboards with no real-time inventory alerts.</td>
        <td><strong>Unified Admin Ledger:</strong> Live analytics display monthly earnings graphs, user toggles, and low-stock indicators.</td>
      </tr>
      <tr>
        <td><strong>Checkout friction and hidden fees</strong></td>
        <td>Single-page checkout forms with no step guidance; totals revealed at last step.</td>
        <td><strong>Multi-Step Checkout Wizard:</strong> Address, Shipping, Coupon, Payment steps with itemized live totals (subtotal, discount, shipping, tax).</td>
      </tr>
      <tr>
        <td><strong>Payment trust and security</strong></td>
        <td>Redirect-based payment flows that break user trust and session state.</td>
        <td><strong>Mock Stripe Payment Intent:</strong> Client-side Stripe inputs via a simulated endpoint returning signed client secrets for secure transactions.</td>
      </tr>
      <tr>
        <td><strong>No order fulfillment visibility</strong></td>
        <td>Customers receive only a single "Shipped" email notification; no granular tracking.</td>
        <td><strong>6-Step Fulfillment Timeline:</strong> Visual stepper (Placed, Confirmed, Packed, Shipped, Out for Delivery, Delivered) updating in real-time from Admin panel.</td>
      </tr>
      <tr>
        <td><strong>Unverified product reviews</strong></td>
        <td>Any registered user can post reviews regardless of purchase history.</td>
        <td><strong>Verified Purchase Badge System:</strong> Review submission restricted to confirmed order holders; helpful upvote tallies maintain community trust.</td>
      </tr>
    </table>
    <hr class="section-rule"/>
    <h2>2. Validation Summary</h2>
    <div class="note-box">
      <strong>Key Finding:</strong> shopEZ's MERN stack implementation addresses all 8 primary pain points through native architectural advantages of the decoupled React + Express + MongoDB system, eliminating reliance on external CMS platforms or plugin ecosystems.
    </div>
    """
    return html_doc("Problem - Solution Fit Template v1", "Project Design Phase", "Project Design Phase", content)

def doc_proposed_solution():
    content = """
    <h2>1. The Proposed Solution</h2>
    <p>shopEZ is a fully functional, secure, and scalable full-stack e-commerce marketplace built on the MERN stack (MongoDB, Express.js, React.js, Node.js). It delivers a seamless online shopping experience for customers and a powerful administrative control center for store managers and sellers.</p>
    <hr class="section-rule"/>
    <h2>2. Uniqueness and Innovation</h2>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Fully Decoupled Architecture:</strong> The React client-side application is completely independent from the Node.js API server, enabling instant page switching, localized micro-animations, and background computations without full-page reloads.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Real-Time Admin Intelligence:</strong> The Admin panel compiles inventory status, user access flags, and revenue graphs in real-time, removing the heavy reload cycles typical of monolithic CMS installations.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>In-Memory Fallback Database:</strong> If MongoDB Atlas is unreachable, the system automatically starts a local mongodb-memory-server instance and seeds it with sample data, guaranteeing development continuity.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Role-Based Access Security:</strong> Three distinct user tiers (Customer, Seller, Admin) with backend middleware enforcement and frontend route protection ensure data integrity at every layer.</p>
    
    <hr class="section-rule"/>
    <h2>3. Customer Satisfaction Factors</h2>
    <table>
      <tr><th>Satisfaction Factor</th><th>Implementation in shopEZ</th></tr>
      <tr><td><strong>Trust</strong></td><td>Transparent, itemized billing at checkout (base price, coupon discount, shipping cost, tax) with Stripe mock payment integration builds high customer confidence.</td></tr>
      <tr><td><strong>Discovery</strong></td><td>Live autocomplete search suggestions, multi-parameter filters (price, category, rating, stock), and sort options (newest, price low-high, rating) maximize product discoverability.</td></tr>
      <tr><td><strong>Convenience</strong></td><td>Persistent cross-session cart, one-click wishlist-to-cart move, and saved address book minimize repetitive user effort at checkout.</td></tr>
      <tr><td><strong>Review Quality</strong></td><td>Verified purchase badge system restricts reviews to confirmed buyers; helpful upvote tallies surface the most useful feedback to future shoppers.</td></tr>
      <tr><td><strong>Order Clarity</strong></td><td>6-step visual fulfillment timeline (Placed to Delivered) gives customers precise, real-time visibility into their order progress.</td></tr>
    </table>
    
    <hr class="section-rule"/>
    <h2>4. Business Model</h2>
    <table>
      <tr><th>Revenue Stream</th><th>Description</th></tr>
      <tr><td><strong>Product Margins</strong></td><td>Direct sales margin from customer purchases processed through the platform.</td></tr>
      <tr><td><strong>Seller Product Slots</strong></td><td>Seller accounts can list products on the marketplace after admin approval. Monetized through premium listing slots or commission models.</td></tr>
      <tr><td><strong>Flash Sale Campaigns</strong></td><td>Admin-controlled coupon engine drives promotional campaigns and clearance events, boosting conversion rates and average order values.</td></tr>
    </table>
    """
    return html_doc("Proposed Solution Template", "Project Design Phase", "Project Design Phase", content)

def doc_solution_architecture():
    content = """
    <h2>1. Architecture Pattern: Model-View-Controller (MVC)</h2>
    <p>shopEZ enforces strict decoupling of client-server application flows using the Model-View-Controller (MVC) design pattern mapped across the full MERN codebase.</p>
    <hr class="section-rule"/>
    <h2>2. System Architecture Diagram</h2>
    """ + HTML_SOLUTION_ARCH_DIAGRAM + """
    <hr class="section-rule"/>
    <h2>3. MVC Layer Breakdown</h2>
    <h3>View Layer - Frontend (React.js + Vite)</h3>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Technology:</strong> React.js 19.x + Vite 8.x + Tailwind CSS 3.x</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Role:</strong> Serves the dynamic Single Page Application (SPA) to the browser.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Context State Providers:</strong> AuthContext (user session), CartContext (persistent cart items), ToastContext (global notifications).</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Product Views:</strong> Grid search lists with sliders, related product lists, and review feeds.</p>
    
    <h3>Controller Layer - Backend (Node.js + Express.js)</h3>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Technology:</strong> Node.js 18+ + Express.js 4.x</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Role:</strong> Processes incoming RESTful API routes, validates payload bodies, and serves structured JSON responses.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>authController.js:</strong> Coordinates registrations, hashes passwords via Bcrypt, and compiles addresses/wishlists.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>productController.js:</strong> Formulates catalog search queries, aggregates ratings, and manages review logs.</p>
    
    <h3>Model Layer - Database (MongoDB + Mongoose)</h3>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Technology:</strong> MongoDB 8.x + Mongoose ODM</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Role:</strong> Houses collections representing application state with schema validation.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>User.js:</strong> User profiles (name, email, role, wishlist array, saved shipping addresses array).</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Product.js:</strong> Inventory listings (title, description, price, stock, brand, category, rating, reviews list).</p>
    
    <hr class="section-rule"/>
    <h2>4. Third-Party Integrations</h2>
    <table>
      <tr><th>Service</th><th>Purpose</th><th>Integration Method</th></tr>
      <tr><td><strong>Multer</strong></td><td>Product image upload and local disk storage</td><td>Express middleware on POST /api/upload route; files saved to /backend/uploads/</td></tr>
      <tr><td><strong>Mock Stripe</strong></td><td>Payment intent simulation for checkout flow</td><td>POST /api/payment/create-intent returns mock client_secret for Stripe Elements UI</td></tr>
      <tr><td><strong>JWT (jsonwebtoken)</strong></td><td>Stateless user session authentication</td><td>Token signed on login; verified via authMiddleware.js on every protected route</td></tr>
      <tr><td><strong>Bcrypt.js</strong></td><td>Password hashing before MongoDB persistence</td><td>bcryptjs.hash() with salt round factor of 10 on registration</td></tr>
      <tr><td><strong>mongodb-memory-server</strong></td><td>In-memory MongoDB fallback for development</td><td>Auto-started by db.js if MONGO_URI connection fails</td></tr>
      <tr><td><strong>Chart.js</strong></td><td>Admin analytics visualizations</td><td>react-chartjs-2 wrapper rendering bar/doughnut/line charts on AdminDashboard.jsx</td></tr>
    </table>
    
    <hr class="section-rule"/>
    <h2>5. API Request Flow</h2>
    <table>
      <tr><th>Step</th><th>From</th><th>Action</th><th>To</th></tr>
      <tr><td>1</td><td>Client Browser</td><td>REST API Requests (Axios)</td><td>Express Server</td></tr>
      <tr><td>2</td><td>Express Server</td><td>Route Guarding</td><td>JWT Auth Middleware</td></tr>
      <tr><td>3</td><td>Auth Middleware</td><td>Query Validation</td><td>Express Server</td></tr>
      <tr><td>4</td><td>Express Server</td><td>Read/Write Models</td><td>MongoDB Atlas (Mongoose)</td></tr>
      <tr><td>5</td><td>Express Server</td><td>Upload Media</td><td>Local Multer /uploads</td></tr>
      <tr><td>6</td><td>Client Browser</td><td>Payment Intents</td><td>Mock Stripe Endpoint</td></tr>
    </table>
    """
    return html_doc("Solution Architecture", "Project Design Phase", "Project Design Phase", content)

# ─────────────────────────────────────────────────────────────────────────────
# 3. PROJECT DEVELOPMENT & PLANNING PHASE
# ─────────────────────────────────────────────────────────────────────────────

def doc_uat_testing():
    content = """
    <h2>1. UAT Overview</h2>
    <p>This document contains the functional verification test scenarios conducted on the shopEZ platform to confirm that all operations comply with system requirements and product user stories. All test cases were executed on the development environment running Node.js 18.x + MongoDB local instance.</p>
    <hr class="section-rule"/>
    <h2>2. User Acceptance Testing Ledger</h2>
    <table>
      <tr>
        <th>Test ID</th>
        <th>Feature Scope</th>
        <th>Steps to Execute</th>
        <th>Expected Result</th>
        <th>Actual Outcome</th>
        <th>Status</th>
      </tr>
      <tr>
        <td><strong>UAT-001</strong></td>
        <td>User Registration</td>
        <td>1. Navigate to Registration page.<br/>2. Fill in Name, email, and password.<br/>3. Submit.</td>
        <td>System creates a profile in MongoDB, hashes password, signs session cookie, and loads dashboard.</td>
        <td>Profile added to MongoDB with Bcrypt hashed password; user session loads immediately.</td>
        <td><span class="pass-badge">PASS</span></td>
      </tr>
      <tr>
        <td><strong>UAT-002</strong></td>
        <td>User Login and RBAC</td>
        <td>1. Navigate to Sign In page.<br/>2. Input credentials.<br/>3. Submit.<br/>4. Access /admin directly as user.</td>
        <td>Server grants JWT token. User profile loads. Direct navigation to /admin blocks and redirects standard users to homepage.</td>
        <td>Credentials verified; JWT cookie set; direct admin URL access blocked for standard customers.</td>
        <td><span class="pass-badge">PASS</span></td>
      </tr>
      <tr>
        <td><strong>UAT-003</strong></td>
        <td>Product Search and Filter</td>
        <td>1. Navigate to Catalog search.<br/>2. Type query "Shirt".<br/>3. Toggle price slider under $50.<br/>4. Select rating filter 4 Stars and Up.</td>
        <td>Catalog displays autocomplete suggestions. Search outputs matching items under $50 with ratings >= 4 stars.</td>
        <td>Live suggestions filter correctly. Price range and rating sort listings instantly.</td>
        <td><span class="pass-badge">PASS</span></td>
      </tr>
      <tr>
        <td><strong>UAT-004</strong></td>
        <td>Cart Persistence and Wishlist Move</td>
        <td>1. Open Product detail page.<br/>2. Click Add to Cart.<br/>3. Go to Wishlist page.<br/>4. Click Move to Cart for a favorited item.<br/>5. Reload browser page.</td>
        <td>Cart counter increments on nav bar. Wishlist item transfers to cart and clears from wishlist. Reloading preserves cart items.</td>
        <td>Cart state saved to React context, synced to localStorage. Wishlist move transfers item correctly.</td>
        <td><span class="pass-badge">PASS</span></td>
      </tr>
      <tr>
        <td><strong>UAT-005</strong></td>
        <td>Checkout, Coupons and Stripe Payment</td>
        <td>1. Click Checkout in Cart.<br/>2. Pick a saved address.<br/>3. Input active coupon code.<br/>4. Pick shipping speed.<br/>5. Fill mock card inputs.<br/>6. Click Place Order.</td>
        <td>Coupon applies discount. Taxes (15% VAT) and shipping fees calculated. Client sends intent request. Order saves and product stock decrements. Receipt renders.</td>
        <td>Discounts compile. Intent returns client_secret. Stocks decrement in database. Order confirmation loads.</td>
        <td><span class="pass-badge">PASS</span></td>
      </tr>
      <tr>
        <td><strong>UAT-006</strong></td>
        <td>Admin Catalog CRUD</td>
        <td>1. Log in as Admin.<br/>2. Access Admin Dashboard.<br/>3. Click Create Product and fill details.<br/>4. Select local image file to upload.</td>
        <td>Image file sent via Multer to /uploads, served as static file. Form submits and inserts product. Item displays in public store catalog.</td>
        <td>Image uploads to /backend/uploads; new product saved to MongoDB and displays on public pages.</td>
        <td><span class="pass-badge">PASS</span></td>
      </tr>
      <tr>
        <td><strong>UAT-007</strong></td>
        <td>Admin Order Status Overrides</td>
        <td>1. Log in as Admin.<br/>2. Open Orders list panel.<br/>3. Change status to "Shipped" for a customer order.<br/>4. Log in as customer.<br/>5. Review order receipt page.</td>
        <td>Admin dashboard updates state. Visual timeline on customer receipt updates stepper from Placed to Shipped.</td>
        <td>Stepper track advances color. Database updates order tracking timeline array dynamically.</td>
        <td><span class="pass-badge">PASS</span></td>
      </tr>
      <tr>
        <td><strong>UAT-008</strong></td>
        <td>Customer Product Reviews</td>
        <td>1. Log in as verified buyer.<br/>2. Open product detail page.<br/>3. Rate 5 stars and submit review text.<br/>4. Attempt to write a second review.<br/>5. Click Helpful upvote on another review.</td>
        <td>System accepts rating, marks badge as Verified Purchase, recalculates average. Block subsequent review submissions. Upvote counter increments by 1.</td>
        <td>Database checks verify purchase. Average score recalculates. Second submission fails validation. Upvote tally increments.</td>
        <td><span class="pass-badge">PASS</span></td>
      </tr>
      <tr>
        <td><strong>UAT-009</strong></td>
        <td>Admin Customer Account Controls</td>
        <td>1. Log in as Admin.<br/>2. Open Customer accounts panel.<br/>3. Locate target user and toggle to Blocked.<br/>4. In a separate tab, attempt to log in as that blocked user.</td>
        <td>Account status updates to active=false. User is barred from logging in. System displays "Your account is deactivated" warning toast.</td>
        <td>User is blocked. Login endpoint rejects request and throws error. Toast notification displays correctly.</td>
        <td><span class="pass-badge">PASS</span></td>
      </tr>
    </table>
    <hr class="section-rule"/>
    <h2>3. UAT Summary</h2>
    <table>
      <tr><th>Metric</th><th>Value</th></tr>
      <tr><td>Total Test Cases</td><td>9</td></tr>
      <tr><td>Passed</td><td>9</td></tr>
      <tr><td>Failed</td><td>0</td></tr>
      <tr><td>Pass Rate</td><td>100%</td></tr>
      <tr><td>Test Environment</td><td>Node.js 18.x, MongoDB local, React 19.x</td></tr>
    </table>
    <div class="note-box">
      <strong>Conclusion:</strong> All 9 User Acceptance Test cases have been verified and passed successfully. The shopEZ platform meets all functional requirements specified in the Requirement Analysis phase.
    </div>
    """
    return html_doc("User Acceptance Testing (UAT) FSD", "Phase 5: Project Development and Testing", "Project Development Phase", content)

def doc_project_planning():
    content = """
    <h2>1. Agile Development Methodology</h2>
    <p>Development followed the Scrum framework, with 2-week sprint iterations and a planned team velocity of 10 Story Points per sprint. All user stories are traced from the Requirement Analysis phase.</p>
    <hr class="section-rule"/>
    <h2>2. Product Backlog and Sprint Schedule</h2>
    <table>
      <tr>
        <th>Sprint</th>
        <th>Epic</th>
        <th>USN ID</th>
        <th>User Story / Task</th>
        <th>Story Points</th>
        <th>Priority</th>
        <th>Status</th>
      </tr>
      <tr>
        <td><strong>Sprint 1</strong></td><td>Foundation and Auth</td><td>USN-001</td>
        <td>Project setup: Express API server, React frontend structure, MongoDB initial model bindings.</td>
        <td>3</td><td>High</td><td>Completed</td>
      </tr>
      <tr>
        <td><strong>Sprint 1</strong></td><td>Foundation and Auth</td><td>USN-002</td>
        <td>Secure user registration with Bcrypt hashing and validation checks.</td>
        <td>2</td><td>High</td><td>Completed</td>
      </tr>
      <tr>
        <td><strong>Sprint 1</strong></td><td>Foundation and Auth</td><td>USN-003</td>
        <td>User login session initialization returning signed JWT tokens in HTTP-Only cookies.</td>
        <td>2</td><td>High</td><td>Completed</td>
      </tr>
      <tr>
        <td><strong>Sprint 2</strong></td><td>Discovery and Cart</td><td>USN-004</td>
        <td>Product catalog search with live autocomplete suggestions and category filters.</td>
        <td>3</td><td>High</td><td>Completed</td>
      </tr>
      <tr>
        <td><strong>Sprint 2</strong></td><td>Discovery and Cart</td><td>USN-005</td>
        <td>Persistent shopping cart context preserving products, totals, and quantities on page reload.</td>
        <td>3</td><td>High</td><td>Completed</td>
      </tr>
      <tr>
        <td><strong>Sprint 2</strong></td><td>Discovery and Cart</td><td>USN-006</td>
        <td>Product wishlist management: saving favorites and supporting One-Click Move to Cart.</td>
        <td>2</td><td>Medium</td><td>Completed</td>
      </tr>
      <tr>
        <td><strong>Sprint 2</strong></td><td>Checkout and Fulfill</td><td>USN-007</td>
        <td>Multi-step checkout wizard integrating active coupon rules validation and tax estimations.</td>
        <td>3</td><td>High</td><td>Completed</td>
      </tr>
      <tr>
        <td><strong>Sprint 3</strong></td><td>Checkout and Fulfill</td><td>USN-008</td>
        <td>Stripe mock integration to generate payment intents and verify checkouts.</td>
        <td>3</td><td>High</td><td>Completed</td>
      </tr>
      <tr>
        <td><strong>Sprint 3</strong></td><td>Feedback and Logs</td><td>USN-009</td>
        <td>Order history lookup and visual timeline fulfillment tracking.</td>
        <td>2</td><td>Medium</td><td>Completed</td>
      </tr>
      <tr>
        <td><strong>Sprint 3</strong></td><td>Feedback and Logs</td><td>USN-010</td>
        <td>Verified buyer reviews and helpful feedback upvote system.</td>
        <td>2</td><td>Medium</td><td>Completed</td>
      </tr>
      <tr>
        <td><strong>Sprint 3</strong></td><td>Administration</td><td>USN-011</td>
        <td>Unified Admin Dashboard panel with sales charts, inventory tables, and coupon controls.</td>
        <td>5</td><td>High</td><td>Completed</td>
      </tr>
    </table>
    
    <hr class="section-rule"/>
    <h2>3. Detailed User Stories and Acceptance Criteria</h2>
    <h3>USN-002: User Registration</h3>
    <p><em>As a new customer, I can register a profile by entering my name, email, and password, so that I can shop and track orders.</em></p>
    <p><strong>Acceptance Criteria:</strong></p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Must block submissions with duplicate emails or weak passwords (less than 6 characters).</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Password must be securely encrypted using Bcrypt before saving to MongoDB.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Successful registration redirects the user directly to the home screen with an active session.</p>
    
    <h3>USN-004: Autocomplete Product Search</h3>
    <p><em>As a shopper, I can input search words and select categories, so that I can find matching products immediately.</em></p>
    <p><strong>Acceptance Criteria:</strong></p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Submitting text queries instantly queries the /api/products/suggestions API.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Results must respect category selections, price ranges, and minimum rating star filters.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Sorting options (price, rating, date) must re-order results immediately on-screen.</p>
    
    <h3>USN-007: Coupon Code Validation</h3>
    <p><em>As a customer, I can apply coupon codes during checkout, so that I receive active promotional discounts on my orders.</em></p>
    <p><strong>Acceptance Criteria:</strong></p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Coupon validation endpoint /api/coupons/validate checks active flags and expiry dates.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Applied discounts must be itemized (fixed vs percentage) and deducted from the subtotal.</p>
    
    <h3>USN-011: Unified Admin Dashboard</h3>
    <p><em>As a store admin, I can view visual monthly sales graphs and inventory tables, so that I can manage my shop operations.</em></p>
    <p><strong>Acceptance Criteria:</strong></p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Metrics charts must compile monthly revenue, category shares, and new user enrollments.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;Product inventory tables must render alerts for items below stock thresholds.</p>
    
    <hr class="section-rule"/>
    <h2>4. Sprint Metrics and Velocity Tracker</h2>
    <table>
      <tr>
        <th>Sprint</th>
        <th>Duration</th>
        <th>Planned SP</th>
        <th>Completed SP</th>
        <th>Focus Areas</th>
      </tr>
      <tr>
        <td><strong>Sprint 1</strong></td>
        <td>Weeks 1-2</td>
        <td>7</td>
        <td>7</td>
        <td>Base Express structure, database models, user registry, JWT sessions</td>
      </tr>
      <tr>
        <td><strong>Sprint 2</strong></td>
        <td>Weeks 3-4</td>
        <td>11</td>
        <td>11</td>
        <td>Product catalogs, search suggestions, persistent cart, address books, coupon validation</td>
      </tr>
      <tr>
        <td><strong>Sprint 3</strong></td>
        <td>Weeks 5-6</td>
        <td>12</td>
        <td>12</td>
        <td>Stripe mock payments, visual order tracking, buyer reviews, Admin analytics dashboard</td>
      </tr>
    </table>
    <div class="note-box">
      <strong>Average Velocity Achieved:</strong> 10 Story Points per Sprint. Development Methodology: Scrum framework with 2-week sprint iterations.
    </div>
    """
    return html_doc("Project Planning Template", "Phase 3: Project Planning Phase", "Project Planning Phase", content)

def doc_data_flow_diagrams():
    content = """
    <h2>1. Data Flow Diagrams (DFD) Overview</h2>
    <p>Data Flow Diagrams document how information moves through the shopEZ system across its three primary external entities: Customers, Administrators/Sellers, and integrated third-party services.</p>
    <hr class="section-rule"/>
    <h2>2. Level 0 DFD: Context Diagram</h2>
    """ + HTML_DFD_CONTEXT_DIAGRAM + """
    <hr class="section-rule"/>
    <h2>3. Level 1 DFD: Process Breakdown</h2>
    <h3>Process 1: User Authentication Flow</h3>
    <table>
      <tr><th>Step</th><th>Action</th></tr>
      <tr><td>1</td><td>Customer inputs email and password into React Login form.</td></tr>
      <tr><td>2</td><td>Axios POST request sent to /api/users/login on Express server.</td></tr>
      <tr><td>3</td><td>authMiddleware.js validates credentials against User model in MongoDB.</td></tr>
      <tr><td>4</td><td>Server signs and returns JWT token containing user._id and user.role.</td></tr>
      <tr><td>5</td><td>Frontend stores token in HTTP-Only cookie; user state updated in AuthContext.</td></tr>
    </table>
    
    <h3>Process 2: Product Browsing Flow</h3>
    <table>
      <tr><th>Step</th><th>Action</th></tr>
      <tr><td>1</td><td>React catalog triggers GET /api/products?search=... request.</td></tr>
      <tr><td>2</td><td>productController.js constructs a Mongoose query with $regex, $gte, and $lte filters.</td></tr>
      <tr><td>3</td><td>Database executes the filtered text search and returns matching product documents.</td></tr>
      <tr><td>4</td><td>Server serializes and returns filtered product list as JSON response.</td></tr>
      <tr><td>5</td><td>React renders product grid cards with real-time filter and sort options applied.</td></tr>
    </table>
    
    <h3>Process 3: Cart Checkout Flow</h3>
    <table>
      <tr><th>Step</th><th>Action</th></tr>
      <tr><td>1</td><td>Customer clicks Place Order; React sends POST /api/payment/create-intent with cart total.</td></tr>
      <tr><td>2</td><td>Mock payment endpoint returns simulated client_secret string.</td></tr>
      <tr><td>3</td><td>React confirms payment, then sends POST /api/orders with full cart, address, and coupon data.</td></tr>
      <tr><td>4</td><td>orderController.js saves the Order document to MongoDB and decrements Product stock counts atomically.</td></tr>
      <tr><td>5</td><td>Order confirmation page loads with itemized receipt and fulfillment tracking timeline.</td></tr>
    </table>
    
    <h3>Process 4: Admin Order Fulfillment</h3>
    <table>
      <tr><th>Step</th><th>Action</th></tr>
      <tr><td>1</td><td>Admin logs in and accesses the Orders panel in AdminDashboard.jsx.</td></tr>
      <tr><td>2</td><td>Admin selects an order and clicks the Advance Status button.</td></tr>
      <tr><td>3</td><td>Axios PUT /api/orders/:id/deliver sends the new status milestone to the backend.</td></tr>
      <tr><td>4</td><td>orderController.js updates the Order document's tracking timeline array in MongoDB.</td></tr>
      <tr><td>5</td><td>Customer's MyOrders.jsx page reflects the updated stepper position on next load.</td></tr>
    </table>
    
    <hr class="section-rule"/>
    <h2>4. User Story Mapping</h2>
    <table>
      <tr><th>User Goal</th><th>Activity</th><th>Mapped USN</th></tr>
      <tr><td>Register and Log In</td><td>Account creation, authentication, session management</td><td>USN-001, USN-002, USN-003</td></tr>
      <tr><td>Browse and Discover</td><td>Catalog search, filter, sort, product detail view</td><td>USN-004</td></tr>
      <tr><td>Save and Cart Items</td><td>Add to cart, manage wishlist, move to cart</td><td>USN-005, USN-006</td></tr>
      <tr><td>Purchase</td><td>Checkout wizard, coupon apply, mock Stripe payment</td><td>USN-007, USN-008</td></tr>
      <tr><td>Track and Review</td><td>Order history, fulfillment timeline, submit review, helpful vote</td><td>USN-009, USN-010</td></tr>
      <tr><td>Administer</td><td>Product CRUD, user management, coupon management, analytics</td><td>USN-011</td></tr>
    </table>
    """
    return html_doc("Data Flow Diagrams and User Stories", "Phase 2: Requirement Analysis", "Requirement Analysis Phase", content)

def doc_solution_requirements():
    content = """
    <h2>1. Functional Requirements (FR)</h2>
    <p>The system must deliver the following capabilities, structured by user access level via Role-Based Access Control (RBAC).</p>
    
    <h3>FR-1: User and Authentication Services</h3>
    <table>
      <tr><th>ID</th><th>Requirement</th></tr>
      <tr><td>FR-1.1</td><td>Standard users must be able to register an account with a unique email, name, and hashed password.</td></tr>
      <tr><td>FR-1.2</td><td>Users must be able to log in securely to retrieve a signed JSON Web Token (JWT) session.</td></tr>
      <tr><td>FR-1.3</td><td>The system must restrict administrative dashboard routes to users holding the admin or seller roles.</td></tr>
      <tr><td>FR-1.4</td><td>Standard users must be able to manage an address book containing multiple shipping locations, selecting a default for checkouts.</td></tr>
    </table>
    
    <h3>FR-2: Product Catalog and Discovery</h3>
    <table>
      <tr><th>ID</th><th>Requirement</th></tr>
      <tr><td>FR-2.1</td><td>The database must list products displaying name, description, price, stock inventory, categories, and images.</td></tr>
      <tr><td>FR-2.2</td><td>The frontend must provide full-text search with live autocomplete suggestions.</td></tr>
      <tr><td>FR-2.3</td><td>The interface must support dynamic filters based on Category, Price Range, Minimum Ratings, and Stock Availability.</td></tr>
      <tr><td>FR-2.4</td><td>The frontend must support sorting: Price (Low to High, High to Low), Ratings, and Release Date (Newest).</td></tr>
    </table>
    
    <h3>FR-3: Shopping Cart and Wishlist Lifecycle</h3>
    <table>
      <tr><th>ID</th><th>Requirement</th></tr>
      <tr><td>FR-3.1</td><td>The system must offer a persistent shopping cart linked to the user context.</td></tr>
      <tr><td>FR-3.2</td><td>Users must be able to modify item quantities in the cart, subject to real-time stock limits.</td></tr>
      <tr><td>FR-3.3</td><td>The system must maintain a saved Wishlist, permitting users to move favorites to cart in a single click.</td></tr>
    </table>
    
    <h3>FR-4: Checkout, Coupons and Payments</h3>
    <table>
      <tr><th>ID</th><th>Requirement</th></tr>
      <tr><td>FR-4.1</td><td>The system must guide the customer through a multi-step checkout wizard (Shipping Address, Shipping Speed, Coupon Apply, Mock Payment, Order Confirmation).</td></tr>
      <tr><td>FR-4.2</td><td>The coupon engine must validate active coupon codes, applying percentage or fixed discounts and recalculating itemized taxes and shipping fees.</td></tr>
      <tr><td>FR-4.3</td><td>The checkout must communicate with a mock payment intent endpoint to securely complete transactions.</td></tr>
    </table>
    
    <h3>FR-5: Administrative Operations</h3>
    <table>
      <tr><th>ID</th><th>Requirement</th></tr>
      <tr><td>FR-5.1</td><td>Admins and sellers must hold complete CRUD privileges over products.</td></tr>
      <tr><td>FR-5.2</td><td>Sellers and admins must be able to upload product images, stored locally via Multer.</td></tr>
      <tr><td>FR-5.3</td><td>Admins must be able to modify order fulfillment milestones (Placed, Confirmed, Packed, Shipped, Out for Delivery, Delivered).</td></tr>
      <tr><td>FR-5.4</td><td>Admins must be able to block/unblock customer accounts, instantly revoking active sessions.</td></tr>
      <tr><td>FR-5.5</td><td>Admins must be able to manage coupon campaigns (create, toggle active state, delete).</td></tr>
    </table>
    
    <hr class="section-rule"/>
    <h2>2. Non-Functional Requirements (NFR)</h2>
    
    <h3>NFR-1: Security and Protection</h3>
    <table>
      <tr><th>ID</th><th>Requirement</th></tr>
      <tr><td>NFR-1.1</td><td>Passwords must be hashed using the Bcrypt algorithm (salt round factor 10) before database commits.</td></tr>
      <tr><td>NFR-1.2</td><td>Session JSON Web Tokens must be transmitted via HTTP-Only, Secure cookies to prevent XSS-based token extraction.</td></tr>
      <tr><td>NFR-1.3</td><td>Enforce strict API middleware validation to deny unauthenticated access to protected routes.</td></tr>
    </table>
    
    <h3>NFR-2: Performance and Optimization</h3>
    <table>
      <tr><th>ID</th><th>Requirement</th></tr>
      <tr><td>NFR-2.1</td><td>The UI must maintain high responsiveness utilizing React's virtual DOM to update components without full-page reloads.</td></tr>
      <tr><td>NFR-2.2</td><td>Product images must be served via Express static file serving from /backend/uploads for quick local access.</td></tr>
      <tr><td>NFR-2.3</td><td>API responses for the catalog must complete within 200ms under standard loads.</td></tr>
    </table>
    
    <h3>NFR-3: Reliability and Integrity</h3>
    <table>
      <tr><th>ID</th><th>Requirement</th></tr>
      <tr><td>NFR-3.1</td><td>Database commits during checkout must ensure atomic stock deductions to prevent oversells.</td></tr>
      <tr><td>NFR-3.2</td><td>If the primary MongoDB cluster is unavailable, the backend seeder must automatically instantiate a local In-Memory MongoDB fallback.</td></tr>
    </table>
    
    <h3>NFR-4: Usability and Accessibility</h3>
    <table>
      <tr><th>ID</th><th>Requirement</th></tr>
      <tr><td>NFR-4.1</td><td>The user interface must utilize a fully responsive layout that fits mobile, tablet, and desktop viewports.</td></tr>
      <tr><td>NFR-4.2</td><td>Design styling must utilize Outfit or Inter fonts with clear typography hierarchies.</td></tr>
    </table>
    """
    return html_doc("Solution Requirements", "Phase 2: Requirement Analysis", "Requirement Analysis Phase", content)

def doc_technology_stack():
    content = """
    <h2>1. Technology Stack Overview</h2>
    <p>The shopEZ platform is built on the MERN stack (MongoDB, Express.js, React.js, Node.js), supplemented by carefully selected supporting libraries to ensure security, performance, and developer productivity.</p>
    <hr class="section-rule"/>
    <h2>2. Layer-by-Layer Technology Table</h2>
    <table>
      <tr>
        <th>Layer</th>
        <th>Technology</th>
        <th>Version</th>
        <th>Justification</th>
      </tr>
      <tr>
        <td><strong>Frontend Framework</strong></td>
        <td>React.js</td>
        <td>19.x</td>
        <td>Component-driven SPA with virtual DOM for blazing-fast UI updates without full page reloads.</td>
      </tr>
      <tr>
        <td><strong>Build Tooling</strong></td>
        <td>Vite</td>
        <td>8.x</td>
        <td>Lightning-fast HMR development server with optimized production builds and native ES module support.</td>
      </tr>
      <tr>
        <td><strong>Styling</strong></td>
        <td>Tailwind CSS</td>
        <td>3.x</td>
        <td>Utility-first responsive design with custom HSL color palettes, eliminating unused CSS at build.</td>
      </tr>
      <tr>
        <td><strong>Client-Side Routing</strong></td>
        <td>React Router DOM</td>
        <td>6.x</td>
        <td>Declarative route hierarchy with protected route guards and nested layout support.</td>
      </tr>
      <tr>
        <td><strong>HTTP Client</strong></td>
        <td>Axios</td>
        <td>1.7.x</td>
        <td>Promise-based HTTP client with request/response interceptors for automatic auth header injection.</td>
      </tr>
      <tr>
        <td><strong>Analytics Charts</strong></td>
        <td>Chart.js + react-chartjs-2</td>
        <td>4.x</td>
        <td>Canvas-rendered bar, doughnut, and line charts for Admin Dashboard analytics visualizations.</td>
      </tr>
      <tr>
        <td><strong>Icon Library</strong></td>
        <td>Lucide React</td>
        <td>0.395.x</td>
        <td>Consistent, accessible SVG icon library with tree-shaking for optimized bundle sizes.</td>
      </tr>
      <tr>
        <td><strong>Backend Runtime</strong></td>
        <td>Node.js</td>
        <td>18+</td>
        <td>Server-side JavaScript enabling full-stack JS development with non-blocking event-driven I/O.</td>
      </tr>
      <tr>
        <td><strong>Web Framework</strong></td>
        <td>Express.js</td>
        <td>4.x</td>
        <td>Minimal, unopinionated RESTful API framework with rich middleware ecosystem.</td>
      </tr>
      <tr>
        <td><strong>Database</strong></td>
        <td>MongoDB + Mongoose</td>
        <td>8.x</td>
        <td>NoSQL document store with schema validation via Mongoose ODM, ideal for flexible product catalogs.</td>
      </tr>
      <tr>
        <td><strong>Authentication</strong></td>
        <td>JWT + Bcrypt.js</td>
        <td>Latest</td>
        <td>Stateless token sessions with 30-day expiry + secure password hashing with salt rounds of 10.</td>
      </tr>
      <tr>
        <td><strong>Image Storage</strong></td>
        <td>Multer (Local Disk)</td>
        <td>1.4.x</td>
        <td>Disk-based image persistence with Express static file serving from /backend/uploads directory.</td>
      </tr>
      <tr>
        <td><strong>Dev Fallback DB</strong></td>
        <td>mongodb-memory-server</td>
        <td>11.x</td>
        <td>In-memory MongoDB for development without external DB configuration or cloud dependency.</td>
      </tr>
      <tr>
        <td><strong>Dev Server Utility</strong></td>
        <td>Nodemon</td>
        <td>3.x</td>
        <td>Auto-restart server on file changes, eliminating manual restart cycles during development.</td>
      </tr>
    </table>
    <hr class="section-rule"/>
    <h2>3. Technology Selection Rationale</h2>
    <div class="note-box">
      <strong>Why MERN?</strong> The MERN stack enables full JavaScript across the entire application - from database schemas (Mongoose) to API logic (Express) to UI components (React) - dramatically reducing context-switching overhead and enabling shared validation logic between frontend and backend.
    </div>
    <div class="note-box">
      <strong>Why Vite over Create-React-App?</strong> Vite uses native ES modules in development, delivering sub-second HMR even in large codebases. CRA's Webpack-based setup becomes prohibitively slow at scale. Vite's Rollup production bundler also generates significantly smaller output bundles.
    </div>
    <div class="note-box">
      <strong>Why Local Multer over Cloudinary?</strong> For a development and demonstration project, local Multer disk storage eliminates the need for external API credentials and CDN configuration. The architecture is designed for simple migration to Cloudinary or AWS S3 by swapping the Multer storage engine.
    </div>
    """
    return html_doc("Technology Stack Template", "Phase 2: Requirement Analysis", "Requirement Analysis Phase", content)

# ─────────────────────────────────────────────────────────────────────────────
# 4. PROJECT DOCUMENTATION
# ─────────────────────────────────────────────────────────────────────────────

def doc_fsd_documentation():
    content = """
    <h2>1. Project Overview</h2>
    <p>shopEZ is a fully functional, secure, and scalable full-stack e-commerce marketplace platform that delivers a seamless online shopping experience for customers and a powerful administrative control center for store managers and sellers. Built on the MERN stack (MongoDB, Express.js, React.js, Node.js).</p>
    <table>
      <tr><th>Feature Area</th><th>Highlights</th></tr>
      <tr><td><strong>Authentication</strong></td><td>JWT-based sessions, Bcrypt password hashing, Role-Based Access Control (Customer / Seller / Admin)</td></tr>
      <tr><td><strong>Product Catalog</strong></td><td>Live autocomplete search, multi-parameter filters (price, category, rating, stock), sort options</td></tr>
      <tr><td><strong>Shopping Cart</strong></td><td>Persistent cross-session cart, stock validation, real-time totals</td></tr>
      <tr><td><strong>Wishlist</strong></td><td>Save favorites, one-click Move to Cart with auto-clear</td></tr>
      <tr><td><strong>Checkout</strong></td><td>Multi-step wizard (Address, Shipping, Coupon, Payment), itemized billing</td></tr>
      <tr><td><strong>Payments</strong></td><td>Mock Stripe Payment Intent endpoint simulating production-grade integration</td></tr>
      <tr><td><strong>Reviews</strong></td><td>Verified purchase badge, star ratings, helpful upvote tallies</td></tr>
      <tr><td><strong>Order Tracking</strong></td><td>6-step fulfillment timeline (Placed, Confirmed, Packed, Shipped, Out for Delivery, Delivered)</td></tr>
      <tr><td><strong>Admin Dashboard</strong></td><td>Chart.js analytics, product/user/order/coupon CRUD, low-stock alerts</td></tr>
    </table>
    
    <hr class="section-rule"/>
    <h2>2. Architecture Overview</h2>
    <p>shopEZ implements the Model-View-Controller (MVC) pattern across a fully decoupled MERN stack:</p>
    """ + HTML_FSD_ARCH_DIAGRAM + """
    
    <hr class="section-rule"/>
    <h2>3. Technology Stack</h2>
    <table>
      <tr><th>Layer</th><th>Technology</th><th>Version</th><th>Justification</th></tr>
      <tr><td>Frontend Framework</td><td>React.js</td><td>19.x</td><td>Component-driven SPA with virtual DOM</td></tr>
      <tr><td>Build Tooling</td><td>Vite</td><td>8.x</td><td>Lightning-fast HMR with optimized builds</td></tr>
      <tr><td>Styling</td><td>Tailwind CSS</td><td>3.x</td><td>Utility-first responsive design</td></tr>
      <tr><td>Routing (FE)</td><td>React Router DOM</td><td>6.x</td><td>Declarative route hierarchy with protected guards</td></tr>
      <tr><td>HTTP Client</td><td>Axios</td><td>1.7.x</td><td>Promise-based HTTP with interceptors</td></tr>
      <tr><td>Charts</td><td>Chart.js + react-chartjs-2</td><td>4.x</td><td>Canvas-rendered analytics charts</td></tr>
      <tr><td>Icons</td><td>Lucide React</td><td>0.395.x</td><td>Accessible SVG icon library</td></tr>
      <tr><td>Backend Runtime</td><td>Node.js</td><td>18+</td><td>Server-side JavaScript</td></tr>
      <tr><td>Web Framework</td><td>Express.js</td><td>4.x</td><td>Minimal RESTful API framework</td></tr>
      <tr><td>Database</td><td>MongoDB + Mongoose</td><td>8.x</td><td>NoSQL document store with schema validation</td></tr>
      <tr><td>Authentication</td><td>JWT + Bcrypt.js</td><td>Latest</td><td>Stateless token sessions + password hashing</td></tr>
      <tr><td>Image Storage</td><td>Local Multer</td><td>1.4.x</td><td>Disk-based image persistence</td></tr>
      <tr><td>Dev Fallback DB</td><td>mongodb-memory-server</td><td>11.x</td><td>In-memory MongoDB for development</td></tr>
    </table>
    
    <hr class="section-rule"/>
    <h2>4. Prerequisites</h2>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Node.js</strong> v18 or above - nodejs.org</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>npm</strong> v8+ (bundled with Node.js)</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>MongoDB</strong> (Local Instance OR MongoDB Atlas cloud cluster)</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Git</strong> for version control</p>
    
    <hr class="section-rule"/>
    <h2>5. Installation and Setup Guide</h2>
    <h3>Step 1: Clone the Repository</h3>
    <pre>git clone https://github.com/yrkoppu17/E-Commerce-Application.git
cd "E-Commerce Application"</pre>
    
    <h3>Step 2: Configure Backend Environment Variables</h3>
    <p>Navigate to the backend/ directory and create a .env file from the template:</p>
    <pre>cd backend
copy .env.example .env</pre>
    <p>Open .env and fill in your values:</p>
    <table>
      <tr><th>Variable</th><th>Example Value</th><th>Description</th></tr>
      <tr><td>PORT</td><td>5000</td><td>Backend server port</td></tr>
      <tr><td>MONGO_URI</td><td>mongodb://127.0.0.1:27017/shopez</td><td>MongoDB connection string</td></tr>
      <tr><td>JWT_SECRET</td><td>your_super_secret_key</td><td>JWT signing secret</td></tr>
      <tr><td>STRIPE_API_KEY</td><td>your_stripe_key</td><td>Stripe API key (mock)</td></tr>
    </table>
    <div class="note-box">
      <strong>Note:</strong> If MONGO_URI is unreachable, the seeder automatically starts a local mongodb-memory-server in-memory fallback and seeds it with sample customers, products, reviews, and active coupons.
    </div>
    
    <h3>Step 3: Install Backend Dependencies</h3>
    <pre>cd backend && npm install</pre>
    
    <h3>Step 4: Install Frontend Dependencies</h3>
    <pre>cd ../frontend && npm install</pre>
    
    <h3>Step 5 (Optional): Seed the Database</h3>
    <pre>cd ../backend && npm run seed</pre>
    
    <hr class="section-rule"/>
    <h2>6. Running the Application</h2>
    <h3>Terminal 1: Backend API Server</h3>
    <pre>cd backend && npm run dev</pre>
    <p>Server starts on http://localhost:5000</p>
    
    <h3>Terminal 2: Frontend Dev Server</h3>
    <pre>cd frontend && npm run dev</pre>
    <p>App starts on http://localhost:5173</p>
    
    <hr class="section-rule"/>
    <h2>7. Folder Structure</h2>
    <h3>Backend (/backend)</h3>
    <table>
      <tr><th>Path</th><th>Description</th></tr>
      <tr><td>config/db.js</td><td>MongoDB connection with in-memory fallback</td></tr>
      <tr><td>controllers/authController.js</td><td>User register, login, profile, wishlist, addresses</td></tr>
      <tr><td>controllers/productController.js</td><td>Catalog search, reviews, helpful votes</td></tr>
      <tr><td>controllers/orderController.js</td><td>Order creation, payment update, delivery milestones</td></tr>
      <tr><td>controllers/couponController.js</td><td>Coupon CRUD, active validation</td></tr>
      <tr><td>middleware/authMiddleware.js</td><td>JWT protect(), admin(), seller() guards</td></tr>
      <tr><td>middleware/errorMiddleware.js</td><td>Centralized notFound and errorHandler</td></tr>
      <tr><td>models/User.js</td><td>User schema (addresses[], wishlist[], role)</td></tr>
      <tr><td>models/Product.js</td><td>Product schema (reviews[], stock, rating)</td></tr>
      <tr><td>models/Order.js</td><td>Order schema (items, payment, delivery timeline)</td></tr>
      <tr><td>models/Coupon.js</td><td>Coupon schema (code, type, value, expiry)</td></tr>
      <tr><td>routes/authRoutes.js</td><td>/api/users endpoints</td></tr>
      <tr><td>routes/productRoutes.js</td><td>/api/products endpoints</td></tr>
      <tr><td>routes/orderRoutes.js</td><td>/api/orders endpoints</td></tr>
      <tr><td>routes/couponRoutes.js</td><td>/api/coupons endpoints</td></tr>
      <tr><td>routes/uploadRoutes.js</td><td>/api/upload (Multer file upload)</td></tr>
      <tr><td>utils/seeder.js</td><td>Database seed script</td></tr>
      <tr><td>uploads/</td><td>Local product image storage</td></tr>
      <tr><td>server.js</td><td>Express app entry point</td></tr>
      <tr><td>.env.example</td><td>Environment variable template</td></tr>
    </table>
    
    <h3>Frontend (/frontend)</h3>
    <table>
      <tr><th>Path</th><th>Description</th></tr>
      <tr><td>src/assets/</td><td>Static assets (logos, icons)</td></tr>
      <tr><td>src/components/Navbar.jsx</td><td>Top navigation with cart badge, auth links</td></tr>
      <tr><td>src/components/ProductCard.jsx</td><td>Reusable product listing card</td></tr>
      <tr><td>src/components/ProtectedRoute.jsx</td><td>Route guard (auth + role verification)</td></tr>
      <tr><td>src/context/AuthContext.jsx</td><td>User session state and dispatch</td></tr>
      <tr><td>src/context/CartContext.jsx</td><td>Shopping cart state (items, totals)</td></tr>
      <tr><td>src/context/ToastContext.jsx</td><td>Global toast notification system</td></tr>
      <tr><td>src/pages/Home.jsx</td><td>Catalog browse with search and filters</td></tr>
      <tr><td>src/pages/ProductDetails.jsx</td><td>Single product, reviews, related carousel</td></tr>
      <tr><td>src/pages/Cart.jsx</td><td>Cart summary with quantity controls</td></tr>
      <tr><td>src/pages/Wishlist.jsx</td><td>Saved wishlist with move-to-cart</td></tr>
      <tr><td>src/pages/Checkout.jsx</td><td>Multi-step wizard with coupon and mock payment</td></tr>
      <tr><td>src/pages/MyOrders.jsx</td><td>Order history with fulfillment tracker</td></tr>
      <tr><td>src/pages/ProfileDashboard.jsx</td><td>Edit profile, manage addresses</td></tr>
      <tr><td>src/pages/AdminDashboard.jsx</td><td>Admin panel (analytics, CRUD, coupons)</td></tr>
      <tr><td>src/pages/SellerDashboard.jsx</td><td>Seller panel (products, orders)</td></tr>
      <tr><td>src/pages/Login.jsx</td><td>Sign-in form</td></tr>
      <tr><td>src/pages/Register.jsx</td><td>Registration form</td></tr>
      <tr><td>index.html</td><td>Vite HTML template</td></tr>
      <tr><td>vite.config.js</td><td>Vite configuration</td></tr>
    </table>
    
    <hr class="section-rule"/>
    <h2>8. RESTful API Documentation</h2>
    <p>All API routes served from http://localhost:5000. Protected routes require: <code>Authorization: Bearer &lt;jwt_token&gt;</code></p>
    
    <h3>8.1 Authentication Routes: /api/users</h3>
    <table>
      <tr><th>Method</th><th>Endpoint</th><th>Auth</th><th>Description</th></tr>
      <tr><td>POST</td><td>/api/users</td><td>Public</td><td>Register a new user account</td></tr>
      <tr><td>POST</td><td>/api/users/login</td><td>Public</td><td>Log in and retrieve JWT token</td></tr>
      <tr><td>GET</td><td>/api/users/profile</td><td>User</td><td>Get current user profile</td></tr>
      <tr><td>PUT</td><td>/api/users/profile</td><td>User</td><td>Update name, email, or password</td></tr>
      <tr><td>GET</td><td>/api/users/wishlist</td><td>User</td><td>Retrieve user wishlist products</td></tr>
      <tr><td>POST</td><td>/api/users/wishlist/:productId</td><td>User</td><td>Toggle product in/out of wishlist</td></tr>
      <tr><td>POST</td><td>/api/users/addresses</td><td>User</td><td>Add a new shipping address</td></tr>
      <tr><td>PUT</td><td>/api/users/addresses/:addressId</td><td>User</td><td>Edit an existing shipping address</td></tr>
      <tr><td>DELETE</td><td>/api/users/addresses/:addressId</td><td>User</td><td>Remove a shipping address</td></tr>
      <tr><td>GET</td><td>/api/users</td><td>Admin</td><td>Get all registered users</td></tr>
      <tr><td>PUT</td><td>/api/users/:id/block</td><td>Admin</td><td>Block or unblock a user account</td></tr>
    </table>
    
    <h3>8.2 Product Routes: /api/products</h3>
    <table>
      <tr><th>Method</th><th>Endpoint</th><th>Auth</th><th>Description</th></tr>
      <tr><td>GET</td><td>/api/products</td><td>Public</td><td>List all products with optional search/filter/sort</td></tr>
      <tr><td>GET</td><td>/api/products/suggestions</td><td>Public</td><td>Get autocomplete name suggestions</td></tr>
      <tr><td>GET</td><td>/api/products/:id</td><td>Public</td><td>Get single product detail</td></tr>
      <tr><td>GET</td><td>/api/products/:id/related</td><td>Public</td><td>Get related product recommendations</td></tr>
      <tr><td>POST</td><td>/api/products</td><td>Seller/Admin</td><td>Create a new product listing</td></tr>
      <tr><td>PUT</td><td>/api/products/:id</td><td>Seller/Admin</td><td>Update product information</td></tr>
      <tr><td>DELETE</td><td>/api/products/:id</td><td>Seller/Admin</td><td>Delete a product listing</td></tr>
      <tr><td>POST</td><td>/api/products/:id/reviews</td><td>User</td><td>Submit a product review with star rating</td></tr>
      <tr><td>POST</td><td>/api/products/:id/reviews/:reviewId/vote</td><td>User</td><td>Toggle helpful vote on a review</td></tr>
    </table>
    
    <h3>8.3 Order Routes: /api/orders</h3>
    <table>
      <tr><th>Method</th><th>Endpoint</th><th>Auth</th><th>Description</th></tr>
      <tr><td>POST</td><td>/api/orders</td><td>User</td><td>Place a new order (deducts stock)</td></tr>
      <tr><td>GET</td><td>/api/orders/myorders</td><td>User</td><td>Retrieve current user order history</td></tr>
      <tr><td>GET</td><td>/api/orders/:id</td><td>User</td><td>Get single order details</td></tr>
      <tr><td>PUT</td><td>/api/orders/:id/pay</td><td>User</td><td>Update order payment status to paid</td></tr>
      <tr><td>GET</td><td>/api/orders</td><td>Admin</td><td>List all platform orders</td></tr>
      <tr><td>PUT</td><td>/api/orders/:id/deliver</td><td>Admin</td><td>Update order delivery status milestone</td></tr>
    </table>
    
    <h3>8.4 Coupon Routes: /api/coupons</h3>
    <table>
      <tr><th>Method</th><th>Endpoint</th><th>Auth</th><th>Description</th></tr>
      <tr><td>GET</td><td>/api/coupons</td><td>Admin</td><td>List all coupon codes</td></tr>
      <tr><td>POST</td><td>/api/coupons</td><td>Admin</td><td>Create a new coupon rule</td></tr>
      <tr><td>PUT</td><td>/api/coupons/:id</td><td>Admin</td><td>Edit coupon details or toggle active status</td></tr>
      <tr><td>DELETE</td><td>/api/coupons/:id</td><td>Admin</td><td>Delete a coupon permanently</td></tr>
      <tr><td>POST</td><td>/api/coupons/validate</td><td>User</td><td>Validate coupon code and retrieve discount</td></tr>
    </table>
    
    <h3>8.5 Payment Route: /api/payment</h3>
    <table>
      <tr><th>Method</th><th>Endpoint</th><th>Auth</th><th>Description</th></tr>
      <tr><td>POST</td><td>/api/payment/create-intent</td><td>User</td><td>Create a mock Stripe payment intent returning a client secret</td></tr>
    </table>
    
    <h3>8.6 Upload Route: /api/upload</h3>
    <table>
      <tr><th>Method</th><th>Endpoint</th><th>Auth</th><th>Description</th></tr>
      <tr><td>POST</td><td>/api/upload</td><td>Seller/Admin</td><td>Upload a product image via Multer (stored in /uploads)</td></tr>
    </table>
    
    <hr class="section-rule"/>
    <h2>9. Authentication and Security Model</h2>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Password Hashing:</strong> All user passwords are hashed via bcryptjs with a salt round factor of 10 before being persisted to MongoDB.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Session Tokens:</strong> Upon successful login, the server signs a JWT containing user._id and user.role. Tokens carry a 30-day expiry.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Protected Routes (Backend):</strong> The protect middleware in authMiddleware.js verifies the Authorization header on every protected endpoint. The admin() and seller() middleware further restrict access based on the decoded role field.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Protected Routes (Frontend):</strong> The ProtectedRoute.jsx component wraps sensitive React pages, redirecting unauthenticated users to the Login page.</p>
    
    <hr class="section-rule"/>
    <h2>10. Known Constraints</h2>
    <div class="warn-box">
      <strong>Payment Integration:</strong> The current Stripe integration uses a simulated mock endpoint. A real Stripe publishable key and configured webhook listener are required for live transaction processing.
    </div>
    <div class="warn-box">
      <strong>Image Storage:</strong> Product images are stored locally in backend/uploads/. For production deployments, replacing Multer's disk storage with Cloudinary or AWS S3 is recommended.
    </div>
    
    <hr class="section-rule"/>
    <h2>11. Future Enhancements</h2>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Real Payment Gateway Integration:</strong> Wire actual Stripe webhook handling to confirm payment events asynchronously.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Cloud Image CDN:</strong> Integrate Cloudinary SDK to replace local Multer disk storage.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>AI Product Recommendations:</strong> Implement ML-driven collaborative filtering to personalize related-product suggestions.</p>
    <p class="list-item"><span class="bullet">&bull;</span> &nbsp;<strong>Multi-Vendor Marketplace:</strong> Expand seller onboarding to support independent vendor profiles and commission tracking.</p>
    """
    return html_doc("FSD Documentation Format", "Phase FSD Documentation", "Project Documentation", content)

# ─────────────────────────────────────────────────────────────────────────────
# MAIN BUILD
# ─────────────────────────────────────────────────────────────────────────────

def main():
    PDFS = [
        (doc_brainstorming_idea_generation(),
         os.path.join(BASE_OUTPUT_DIR, "Phase Wise Templets", "Brainstorming & Ideation Phase", "Brainstorming- Idea Generation- Prioritizaation Template.pdf")),
        (doc_define_problem_statements(),
         os.path.join(BASE_OUTPUT_DIR, "Phase Wise Templets", "Brainstorming & Ideation Phase", "Define Problem Statements Template.pdf")),
        (doc_empathy_map(),
         os.path.join(BASE_OUTPUT_DIR, "Phase Wise Templets", "Brainstorming & Ideation Phase", "Empathy Map Canvas.pdf")),
        (doc_problem_solution_fit(),
         os.path.join(BASE_OUTPUT_DIR, "Phase Wise Templets", "Project Design Phase", "Problem - Solution Fit Template", "Problem - Solution Fit Template v1.pdf")),
        (doc_proposed_solution(),
         os.path.join(BASE_OUTPUT_DIR, "Phase Wise Templets", "Project Design Phase", "Proposed Solution", "Proposed Solution Template.pdf")),
        (doc_solution_architecture(),
         os.path.join(BASE_OUTPUT_DIR, "Phase Wise Templets", "Project Design Phase", "Solution Architecture", "Solution Architecture.pdf")),
        (doc_uat_testing(),
         os.path.join(BASE_OUTPUT_DIR, "Phase Wise Templets", "Project Developement", "User Acceptance Testing FSD.pdf")),
        (doc_project_planning(),
         os.path.join(BASE_OUTPUT_DIR, "Phase Wise Templets", "Project Planning Phase", "Project Planning Template.pdf")),
        (doc_data_flow_diagrams(),
         os.path.join(BASE_OUTPUT_DIR, "Phase Wise Templets", "Requirement Analysis", "Data Flow Diagrams and User Stories.pdf")),
        (doc_solution_requirements(),
         os.path.join(BASE_OUTPUT_DIR, "Phase Wise Templets", "Requirement Analysis", "Solution Requirements.pdf")),
        (doc_technology_stack(),
         os.path.join(BASE_OUTPUT_DIR, "Phase Wise Templets", "Requirement Analysis", "Technology Stack - Template.pdf")),
        (doc_fsd_documentation(),
         os.path.join(BASE_OUTPUT_DIR, "Project Documentation", "FSD Documentation Format.pdf")),
    ]

    print("\nGenerating all PDFs...")
    success = 0
    failed = 0
    for html_str, path in PDFS:
        ok = write_pdf(html_str, path)
        if ok:
            success += 1
        else:
            failed += 1

    print(f"\nCompleted: {success} generated successfully, {failed} failed.")

if __name__ == "__main__":
    main()
