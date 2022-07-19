"use strict";

require('@babel/polyfill');

var e = require('axios');

function t(e) {
  return e && e.__esModule ? e["default"] : e;
}

var a = function a() {
  var e = document.querySelector('.alert');
  e && e.parentElement.removeChild(e);
},
    o = function o(e, t) {
  a();
  var o = "<div class=\"alert alert--".concat(e, "\">").concat(t, "</div>");
  document.querySelector('body').insertAdjacentHTML('afterbegin', o), window.setTimeout(a, 5e3);
},
    s = function s(a, _s) {
  var _n, _r;

  return regeneratorRuntime.async(function s$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _n = 'password' === _s ? '/api/v1/auth/updatepassword' : '/api/v1/auth/updatemyinfo';
          _context.next = 4;
          return regeneratorRuntime.awrap(t(e)({
            method: 'PATCH',
            url: _n,
            data: a
          }));

        case 4:
          _r = _context.sent;
          console.log(a), 'success' === _r.data.status && o('success', "".concat(_s.toUpperCase(), " Updated successfully!"));
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0), o('error', _context.t0.response.data.message);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
},
    n = Stripe('pk_test_51LN39zCRZVXV9ebKTVNEOY9lUYxCfQS0xpp4fEBHxit58QnKe2SRta7RH5RjuPTtwmP2cSt7Vw5G7ttcQlpGqKUb00Aev0SnyH'),
    r = document.getElementById('map'),
    d = document.querySelector('.form--signup'),
    c = document.querySelector('.form--login'),
    l = document.querySelector('.nav__el--logout'),
    u = document.querySelector('.form-user-data'),
    m = document.querySelector('.form-user-password'),
    i = document.getElementById('book-tour');

if (r) {
  (function (e) {
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2lyYWFtZXIiLCJhIjoiY2w1bjlsZGR1MDk5ZTNpcDgzZHUxdWYwNCJ9.N9_mHqYXW79IGo7zklWbYA';
    var t = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/siraamer/cl0pxdae200hp15qlaqgf37ex',
      scrollZoom: !1
    });
    var a = new mapboxgl.LngLatBounds();
    e.forEach(function (e) {
      var o = document.createElement('div');
      o.className = 'marker', new mapboxgl.Marker({
        element: o,
        anchor: 'bottom'
      }).setLngLat(e.coordinates).addTo(t), new mapboxgl.Popup({
        offset: 30
      }).setLngLat(e.coordinates).setHTML("<p>Day ".concat(e.day, ": ").concat(e.description, "</p>")).addTo(t), a.extend(e.coordinates);
    }), t.fitBounds(a, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
      }
    });
  })(JSON.parse(r.dataset.locations));
}

d && d.addEventListener('submit', function (a) {
  a.preventDefault();

  (function _callee(a, s, n, r) {
    return regeneratorRuntime.async(function _callee$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(t(e)({
              method: 'POST',
              url: '/api/v1/auth/signup',
              data: {
                name: a,
                email: s,
                password: n,
                passwordConfirm: r
              }
            }));

          case 3:
            _context2.t0 = _context2.sent.data.status;
            _context2.t1 = 'success' === _context2.t0;

            if (!_context2.t1) {
              _context2.next = 7;
              break;
            }

            o('success', 'Signed up successfully'), window.setImmediate(function () {
              location.assign('/');
            }, 1500);

          case 7:
            _context2.next = 12;
            break;

          case 9:
            _context2.prev = 9;
            _context2.t2 = _context2["catch"](0);
            o('error', _context2.t2.response.data.message);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 9]]);
  })(document.getElementById('name').value, document.getElementById('email').value, document.getElementById('password').value, document.getElementById('passwordConfirm').value);
}), c && c.addEventListener('submit', function (a) {
  a.preventDefault();

  (function _callee2(a, s) {
    return regeneratorRuntime.async(function _callee2$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return regeneratorRuntime.awrap(t(e)({
              method: 'POST',
              url: 'http://localhost:7000/api/v1/auth/login',
              data: {
                email: a,
                password: s
              }
            }));

          case 3:
            _context3.t0 = _context3.sent.data.status;
            _context3.t1 = 'success' === _context3.t0;

            if (!_context3.t1) {
              _context3.next = 7;
              break;
            }

            o('success', 'Logged in successfully!'), window.setTimeout(function () {
              location.assign('/');
            }, 1500);

          case 7:
            _context3.next = 12;
            break;

          case 9:
            _context3.prev = 9;
            _context3.t2 = _context3["catch"](0);
            o('error', _context3.t2.response.data.message);

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[0, 9]]);
  })(document.getElementById('email').value, document.getElementById('password').value);
}), l && l.addEventListener('click', function _callee3() {
  return regeneratorRuntime.async(function _callee3$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(t(e)({
            method: 'GET',
            url: '/api/v1/auth/logout'
          }));

        case 3:
          _context4.sent.data.status = 'success';
          location.assign('/login');
          _context4.next = 10;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          console.log(_context4.t0.response), o('error', 'Error logging out! Try again.');

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
}), u && u.addEventListener('submit', function (e) {
  e.preventDefault();
  var t = new FormData();
  t.append('name', document.getElementById('name').value), t.append('email', document.getElementById('email').value), t.append('photo', document.getElementById('photo').files[0]), s(t, 'data');
}), m && m.addEventListener('submit', function _callee4(e) {
  var t, a, o;
  return regeneratorRuntime.async(function _callee4$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          e.preventDefault(), document.querySelector('.btn--save-password').textContent = 'Updating...';
          t = document.getElementById('password-current').value, a = document.getElementById('password').value, o = document.getElementById('password-confirm').value;
          _context5.next = 4;
          return regeneratorRuntime.awrap(s({
            passwordCurrent: t,
            password: a,
            passwordConfirm: o
          }, 'password'));

        case 4:
          document.querySelector('.btn--save-password').textContent = 'Save password';
          document.getElementById('password-current').value = '';
          document.getElementById('password').value = '';
          document.getElementById('password-confirm').value = '';

        case 8:
        case "end":
          return _context5.stop();
      }
    }
  });
}), i && i.addEventListener('click', function (a) {
  a.target.textContent = 'Processing...';
  var s = a.target.dataset.tourId;

  (function _callee5(a) {
    var s;
    return regeneratorRuntime.async(function _callee5$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return regeneratorRuntime.awrap(t(e)("/api/v1/bookings/checkout-session/".concat(a)));

          case 2:
            s = _context6.sent;
            console.log(s); //! 2) Create checkout form + charage credit card.

            _context6.prev = 4;
            _context6.next = 7;
            return regeneratorRuntime.awrap(n.redirectToCheckout({
              sessionId: s.data.session.id
            }));

          case 7:
            _context6.next = 12;
            break;

          case 9:
            _context6.prev = 9;
            _context6.t0 = _context6["catch"](4);
            o('error', _context6.t0);

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, null, null, [[4, 9]]);
  })(s);
});