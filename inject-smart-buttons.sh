#!/data/data/com.termux/files/usr/bin/bash
CLIENT_ID="YOUR_ACTUAL_CLIENT_ID_HERE"
sed -i "s|#PAYPAL_FIXED|<div id=\"paypal-btn\"></div><script src=\"https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=CAD\"></script><script>paypal.Buttons({createOrder:(d,a)=>a.order.create({purchase_units:[{amount:{value:\"49.00\"}}]}),onApprove:(d,a)=>a.order.capture().then(d=>alert(\"Paid: \"+d.payer.name.given_name))}).render(\"#paypal-btn\")</script>|g" docs/weedlaw/index.html
echo "Smart Buttons injected"
