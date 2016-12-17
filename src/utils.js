/**
 * Creates a new `<script>` element for the passed `src`, and invokes the
 * passed callback once done.
 * @param {string} src The src attribute for the script.
 * @param {Function<?Error>} done A callback to be invoked once the script has
 *     loaded, if an error occurs loading the script the function is invoked
 *     with the error object.
 */
export const loadScript = (src, done) => {
  const js = document.createElement('script');
  js.src = src;
  js.onload = () => done();
  js.onerror = () => done(new Error('Failed to load script ' + src));
  document.head.appendChild(js);
};
