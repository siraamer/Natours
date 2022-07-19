require('@babel/polyfill');
var e = require('axios');
function t(e) {
  return e && e.__esModule ? e.default : e;
}
const a = () => {
    const e = document.querySelector('.alert');
    e && e.parentElement.removeChild(e);
  },
  o = (e, t) => {
    a();
    const o = `<div class="alert alert--${e}">${t}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', o),
      window.setTimeout(a, 5e3);
  },
  s = async (a, s) => {
    try {
      const n =
          'password' === s
            ? '/api/v1/auth/updatepassword'
            : '/api/v1/auth/updatemyinfo',
        r = await t(e)({ method: 'PATCH', url: n, data: a });
      console.log(a),
        'success' === r.data.status &&
          o('success', `${s.toUpperCase()} Updated successfully!`);
    } catch (e) {
      console.log(e), o('error', e.response.data.message);
    }
  },
  n = Stripe(
    'pk_test_51LN39zCRZVXV9ebKTVNEOY9lUYxCfQS0xpp4fEBHxit58QnKe2SRta7RH5RjuPTtwmP2cSt7Vw5G7ttcQlpGqKUb00Aev0SnyH'
  ),
  r = document.getElementById('map'),
  d = document.querySelector('.form--signup'),
  c = document.querySelector('.form--login'),
  l = document.querySelector('.nav__el--logout'),
  u = document.querySelector('.form-user-data'),
  m = document.querySelector('.form-user-password'),
  i = document.getElementById('book-tour');
if (r) {
  ((e) => {
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
  })(JSON.parse(r.dataset.locations));
}
d &&
  d.addEventListener('submit', (a) => {
    a.preventDefault();
    (async (a, s, n, r) => {
      try {
        'success' ===
          (
            await t(e)({
              method: 'POST',
              url: '/api/v1/auth/signup',
              data: { name: a, email: s, password: n, passwordConfirm: r },
            })
          ).data.status &&
          (o('success', 'Signed up successfully'),
          window.setImmediate(() => {
            location.assign('/');
          }, 1500));
      } catch (e) {
        o('error', e.response.data.message);
      }
    })(
      document.getElementById('name').value,
      document.getElementById('email').value,
      document.getElementById('password').value,
      document.getElementById('passwordConfirm').value
    );
  }),
  c &&
    c.addEventListener('submit', (a) => {
      a.preventDefault();
      (async (a, s) => {
        try {
          'success' ===
            (
              await t(e)({
                method: 'POST',
                url: 'http://localhost:7000/api/v1/auth/login',
                data: { email: a, password: s },
              })
            ).data.status &&
            (o('success', 'Logged in successfully!'),
            window.setTimeout(() => {
              location.assign('/');
            }, 1500));
        } catch (e) {
          o('error', e.response.data.message);
        }
      })(
        document.getElementById('email').value,
        document.getElementById('password').value
      );
    }),
  l &&
    l.addEventListener('click', async () => {
      try {
        ((
          await t(e)({ method: 'GET', url: '/api/v1/auth/logout' })
        ).data.status = 'success'),
          location.assign('/login');
      } catch (e) {
        console.log(e.response), o('error', 'Error logging out! Try again.');
      }
    }),
  u &&
    u.addEventListener('submit', (e) => {
      e.preventDefault();
      const t = new FormData();
      t.append('name', document.getElementById('name').value),
        t.append('email', document.getElementById('email').value),
        t.append('photo', document.getElementById('photo').files[0]),
        s(t, 'data');
    }),
  m &&
    m.addEventListener('submit', async (e) => {
      e.preventDefault(),
        (document.querySelector('.btn--save-password').textContent =
          'Updating...');
      const t = document.getElementById('password-current').value,
        a = document.getElementById('password').value,
        o = document.getElementById('password-confirm').value;
      await s(
        { passwordCurrent: t, password: a, passwordConfirm: o },
        'password'
      ),
        (document.querySelector('.btn--save-password').textContent =
          'Save password'),
        (document.getElementById('password-current').value = ''),
        (document.getElementById('password').value = ''),
        (document.getElementById('password-confirm').value = '');
    }),
  i &&
    i.addEventListener('click', (a) => {
      a.target.textContent = 'Processing...';
      const { tourId: s } = a.target.dataset;
      (async (a) => {
        //! 1) Get checkout session from API.
        const s = await t(e)(`/api/v1/bookings/checkout-session/${a}`);
        console.log(s);
        //! 2) Create checkout form + charage credit card.
        try {
          await n.redirectToCheckout({ sessionId: s.data.session.id });
        } catch (e) {
          o('error', e);
        }
      })(s);
    });
//# sourceMappingURL=index.js.map
