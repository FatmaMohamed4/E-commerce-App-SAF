const payBtn = document.getElementById("payBtn");
const message = document.getElementById("message");

payBtn.addEventListener("click", async () => {

    try {

        const orderId = "6abed99d2c46605a57b2453c";

        const token = localStorage.getItem("token");

        message.textContent = "Creating payment...";

        const response = await fetch(
            `http://localhost:3500/payment/${orderId}`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token
                }
            }
        );

        const data = await response.json();

        console.log(data);

        if (!response.ok) {
            message.textContent =
                data.message || "Payment failed";

            return;
        }

        message.textContent =
            "Payment initialized successfully!";

        console.log("Client Secret:", data.clientSecret);

    } catch (error) {

        console.error(error);

        message.textContent =
            "Something went wrong";

    }

});