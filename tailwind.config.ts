export default {
  // ...
  theme: {
    extend: {},
    // ❌ INCORRECT: 'layers' should be a top-level property
    layers: {
      theme: {},
      base: {},
      components: {},
      utilities: {},
    },
    // ❌ INCORRECT: 'plugins' should be a top-level property
    plugins: [],
  }, // <-- Also a double semicolon here
};
