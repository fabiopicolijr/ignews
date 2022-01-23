import { NextApiRequest, NextApiResponse } from 'next';
import { query as q } from 'faunaDb';
import { getSession } from 'next-auth/react';
import { stripe } from '../../services/stripe';
import { faunaService } from '../../services/fauna';

type User = {
  ref: {
    id: string;
  };
  data: {
    stripe_customer_id: string;
  };
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const session = await getSession({ req });

    const user = await faunaService.query<User>(
      q.Get(q.Match(q.Index('user_by_email'), q.Casefold(session.user.email)))
    );

    let customerId = user.data.stripe_customer_id;

    if (!customerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email,
        //metadata
      });

      customerId = stripeCustomer.id;

      await faunaService.query(
        q.Update(q.Ref(q.Collection('users'), user.ref.id), {
          data: {
            stripe_customer_id: customerId,
          },
        })
      );
    }

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      cancel_url: process.env.STRIPE_SUCCESS_URL,
      success_url: process.env.STRIPE_CANCEL_URL,
      billing_address_collection: 'required',
      line_items: [{ price: 'price_1KGirQBFhbtG2h2FGI0Q6O1O', quantity: 1 }],
      mode: 'subscription',
      allow_promotion_codes: true,
    });

    return res.status(200).json({ sessionId: stripeCheckoutSession });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method not allowed');
  }

  // payment_method_types: ['card'],
  //     billing_address_collection: 'required',
};
