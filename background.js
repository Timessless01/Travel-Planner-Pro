const extpay = ExtPay('tabsaver-pro-30');
extpay.startBackground();

// Keep service worker alive
setInterval(() => {
  console.log('Service worker is alive');
}, 1000 * 60); // Ping every 60 seconds

// Check payment status
async function checkPaymentStatus() {
  const user = await extpay.getUser();
  chrome.storage.local.set({ isPaid: !!user.paid });
}

// Listen for payments
extpay.onPaid.addListener(checkPaymentStatus);
checkPaymentStatus();