import ParcelBundler from 'parcel-bundler';

export default {
  input: './public/js/index.js',
  output: [
    {
      file: 'dist',
      format: 'es',
    },
    {},
  ],
};
