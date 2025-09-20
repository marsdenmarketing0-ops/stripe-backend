const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const sessionId = (event.queryStringParameters || {}).session_id;
    if (!sessionId) return { statusCode: 400, body: 'Missing session_id' };

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === 'paid';

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paid })
    };
  } catch (err) {
    return { statusCode: 500, body: `Error: ${err.message}` };
  }
};
