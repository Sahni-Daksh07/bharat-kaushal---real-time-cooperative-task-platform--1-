const fs = require('fs');

let indexHtml = fs.readFileSync('index.html', 'utf8');

const translateScript = `
    <!-- Google Translate Script -->
    <div id="google_translate_element" style="display:none;"></div>
    <script type="text/javascript">
      function googleTranslateElementInit() {
        new google.translate.TranslateElement({
          pageLanguage: 'en',
          autoDisplay: false
        }, 'google_translate_element');
      }
    </script>
    <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
`;

if (!indexHtml.includes('google_translate_element')) {
  indexHtml = indexHtml.replace('</body>', translateScript + '\n  </body>');
  fs.writeFileSync('index.html', indexHtml);
}
console.log('Done!');
