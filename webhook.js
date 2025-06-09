export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const rawBody = Buffer.concat(chunks).toString('utf8');
    const event = JSON.parse(rawBody);

    switch (event.type) {
      case 'membership.went_valid':
        console.log('✅ Membership Activated:', event.data);
        break;
      case 'membership.went_invalid':
        console.log('❌ Membership Expired:', event.data);
        break;
      case 'payment.succeeded':
        console.log('💵 Payment Successful:', event.data);
        break;
      case 'refund.created':
        console.log('🔁 Refund Issued:', event.data);
        break;
      case 'dispute.updated':
        console.log('⚠️ Dispute Updated:', event.data);
        break;
      default:
        console.log('🔔 Unhandled Event:', event.type);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(400).send('Webhook Error');
  }
}
