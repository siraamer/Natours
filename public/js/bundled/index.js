require('@babel/polyfill');
var e = require('axios');
function t(e) {
  return e && e.__esModule ? e.default : e;
}
const a = (e) => {
    mapboxgl.accessToken =
      'pk.eyJ1Ijoic2lyYWFtZXIiLCJhIjoiY2w1bjlsZGR1MDk5ZTNpcDgzZHUxdWYwNCJ9.N9_mHqYXW79IGo7zklWbYA';
    var t = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/siraamer/cl0pxdae200hp15qlaqgf37ex',
      scrollZoom: !1,
    });
    const a = new mapboxgl.LngLatBounds();
    e.forEach((e) => {
      const o = document.createElement('div');
      (o.className = 'marker'),
        new mapboxgl.Marker({ element: o, anchor: 'bottom' })
          .setLngLat(e.coordinates)
          .addTo(t),
        new mapboxgl.Popup({ offset: 30 })
          .setLngLat(e.coordinates)
          .setHTML(`<p>Day ${e.day}: ${e.description}</p>`)
          .addTo(t),
        a.extend(e.coordinates);
    }),
      t.fitBounds(a, {
        padding: { top: 200, bottom: 150, left: 100, right: 100 },
      });
  },
  o = () => {
    const e = document.querySelector('.alert');
    e && e.parentElement.removeChild(e);
  },
  s = (e, t) => {
    o();
    const a = `<div class="alert alert--${e}">${t}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', a),
      window.setTimeout(o, 5e3);
  },
  n = async (a, o) => {
    try {
      'success' ===
        (
          await t(e)({
            method: 'POST',
            url: 'http://localhost:7000/api/v1/auth/login',
            data: { email: a, password: o },
          })
        ).data.status &&
        (s('success', 'Logged in successfully!'),
        window.setTimeout(() => {
          location.assign('/');
        }, 1500));
    } catch (e) {
      s('error', e.response.data.message);
    }
  },
  r = async (a, o, n, r) => {
    try {
      'success' ===
        (
          await t(e)({
            method: 'POST',
            url: '/api/v1/auth/signup',
            data: { name: a, email: o, password: n, passwordConfirm: r },
          })
        ).data.status &&
        (s('success', 'Signed up successfully'),
        window.setImmediate(() => {
          location.assign('/');
        }, 1500));
    } catch (e) {
      s('error', e.response.data.message);
    }
  },
  d = async (a, o) => {
    try {
      const n =
          'password' === o
            ? 'http://localhost:7000/api/v1/auth/updatepassword'
            : 'http://localhost:7000/api/v1/auth/updatemyinfo',
        r = await t(e)({ method: 'PATCH', url: n, data: a });
      console.log(a),
        'success' === r.data.status &&
          s('success', `${o.toUpperCase()} Updated successfully!`);
    } catch (e) {
      console.log(e), s('error', e.response.data.message);
    }
  },
  c = Stripe(
    'pk_test_51LN39zCRZVXV9ebKTVNEOY9lUYxCfQS0xpp4fEBHxit58QnKe2SRta7RH5RjuPTtwmP2cSt7Vw5G7ttcQlpGqKUb00Aev0SnyH'
  ),
  l = async (a) => {
    //! 1) Get checkout session from API.
    const o = await t(e)(
      `http://localhost:7000/api/v1/bookings/checkout-session/${a}`
    );
    console.log(o);
    //! 2) Create checkout form + charage credit card.
    try {
      await c.redirectToCheckout({ sessionId: o.data.session.id });
    } catch (e) {
      s('error', e);
    }
  },
  u = document.getElementById('map'),
  m = document.querySelector('.form--signup'),
  i = document.querySelector('.form--login'),
  p = document.querySelector('.nav__el--logout'),
  g = document.querySelector('.form-user-data'),
  y = document.querySelector('.form-user-password'),
  w = document.getElementById('book-tour');
if (u) {
  a(JSON.parse(u.dataset.locations));
}
m &&
  m.addEventListener('submit', (e) => {
    e.preventDefault();
    const t = document.getElementById('name').value,
      a = document.getElementById('email').value,
      o = document.getElementById('password').value,
      s = document.getElementById('passwordConfirm').value;
    r(t, a, o, s);
  }),
  i &&
    i.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = document.getElementById('email').value,
        a = document.getElementById('password').value;
      n(t, a);
    }),
  p &&
    p.addEventListener('click', async () => {
      try {
        ((
          await t(e)({
            method: 'GET',
            url: 'http://localhost:7000/api/v1/auth/logout',
          })
        ).data.status = 'success'),
          location.assign('/login');
      } catch (e) {
        console.log(e.response), s('error', 'Error logging out! Try again.');
      }
    }),
  g &&
    g.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = new FormData();
      t.append('name', document.getElementById('name').value),
        t.append('email', document.getElementById('email').value),
        t.append('photo', document.getElementById('photo').files[0]),
        d(t, 'data');
    }),
  //!
  y &&
    y.addEventListener('submit', async (e) => {
      e.preventDefault(),
        (document.querySelector('.btn--save-password').textContent =
          'Updating...');
      const t = document.getElementById('password-current').value,
        a = document.getElementById('password').value,
        o = document.getElementById('password-confirm').value;
      await d(
        { passwordCurrent: t, password: a, passwordConfirm: o },
        'password'
      ),
        (document.querySelector('.btn--save-password').textContent =
          'Save password'),
        (document.getElementById('password-current').value = ''),
        (document.getElementById('password').value = ''),
        (document.getElementById('password-confirm').value = '');
    }),
  w &&
    w.addEventListener('click', (e) => {
      e.target.textContent = 'Processing...';
      const { tourId: t } = e.target.dataset;
      l(t);
    });
//# sourceMappingURL=index.js.map
