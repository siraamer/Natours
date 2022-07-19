"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bookTour = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alerts = require("./alerts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var stripe = Stripe('pk_test_51LN39zCRZVXV9ebKTVNEOY9lUYxCfQS0xpp4fEBHxit58QnKe2SRta7RH5RjuPTtwmP2cSt7Vw5G7ttcQlpGqKUb00Aev0SnyH');

var bookTour = function bookTour(tourId) {
  var session;
  return regeneratorRuntime.async(function bookTour$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap((0, _axios["default"])("/api/v1/bookings/checkout-session/".concat(tourId)));

        case 2:
          session = _context.sent;
          console.log(session); //! 2) Create checkout form + charage credit card.

          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap(stripe.redirectToCheckout({
            sessionId: session.data.session.id
          }));

        case 7:
          _context.next = 12;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](4);
          (0, _alerts.showAlert)('error', _context.t0);

        case 12:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 9]]);
};

exports.bookTour = bookTour;