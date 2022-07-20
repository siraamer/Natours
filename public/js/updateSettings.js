import axios from 'axios';
import { showAlert } from './alerts.js';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://localhost:7000/api/v1/auth/updatepassword'
        : 'http://localhost:7000/api/v1/auth/updatemyinfo';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    console.log(data);
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Updated successfully!`);
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
