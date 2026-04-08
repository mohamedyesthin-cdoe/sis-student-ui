export const handlePaymentRedirect = (
  paymentLink: string
) => {
  if (!paymentLink) {
    alert("Payment link not available");
    return;
  }

  try {
    window.open(
      paymentLink,
      "_blank",
      "noopener,noreferrer"
    );
  } catch (error) {
    console.error("Payment redirect failed", error);

    alert(
      "Unable to open payment page. Please try again."
    );
  }
};