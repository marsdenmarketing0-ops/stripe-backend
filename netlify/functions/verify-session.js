const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { session_id } = event.queryStringParameters;

    if (!session_id) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing session_id" }),
      };
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    return {
      statusCode: 200,
      body: JSON.stringify({ paid: session.payment_status === "paid" }),
    };
  } catch (err) {
    console.error("Error verifying session:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
