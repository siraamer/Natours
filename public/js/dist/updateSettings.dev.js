"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSettings = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _alerts = require("./alerts");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var updateSettings = function updateSettings(data, type) {
  var url, res;
  return regeneratorRuntime.async(function updateSettings$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          url = type === 'password' ? '/api/v1/auth/updatepassword' : '/api/v1/auth/updatemyinfo';
          _context.next = 4;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'PATCH',
            url: url,
            data: data
          }));

        case 4:
          res = _context.sent;
          console.log(data);

          if (res.data.status === 'success') {
            (0, _alerts.showAlert)('success', "".concat(type.toUpperCase(), " Updated successfully!"));
          }

          _context.next = 13;
          break;

        case 9:
          _context.prev = 9;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);
          (0, _alerts.showAlert)('error', _context.t0.response.data.message);

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

exports.updateSettings = updateSettings;