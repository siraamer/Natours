import axios from 'axios';
import { showAlert } from './alerts';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/auth/updatepassword'
        : '/api/v1/auth/updatemyinfo';
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
