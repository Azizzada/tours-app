import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51NFkPuIjpXZiIuUTciSlYFfCyOaF8JfepqZxMhc02lwdkpblS7rr0DpBzH1S0M5M1sZH6TcJ3GnC6P0NbSENlsNH00ok49u7t0'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // 2)Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
