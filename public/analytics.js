var host = window.location.hostname;
if(host != "localhost") {
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'UA-73536834-3');
}
