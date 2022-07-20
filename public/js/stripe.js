import axios from 'axios';
import { showAlert } from './alerts.js';
const stripe = Stripe(
  'pk_test_51LN39zCRZVXV9ebKTVNEOY9lUYxCfQS0xpp4fEBHxit58QnKe2SRta7RH5RjuPTtwmP2cSt7Vw5G7ttcQlpGqKUb00Aev0SnyH'
);

const bookTour = async (tourId) => {
  //! 1) Get checkout session from API.
  const session = await axios(
    `http://localhost:7000/api/v1/bookings/checkout-session/${tourId}`
  );
  console.log(session);
  //! 2) Create checkout form + charage credit card.
  try {
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};

export { bookTour };
