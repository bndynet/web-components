function appendNav(navText) {
  var eleMainNavs = $('#main-navs');
  var eleNav = $('<li class="nav-item"></li>');
  var eleA = $('<a class="nav-link" href="#' + navText + '">' + navText + '</a>');
  eleNav.append(eleA);
  eleMainNavs.append(eleNav);

  eleA.on('click', function() {
    var eleSubNavs = $('#sub-navs');
    eleSubNavs.children().remove();
    $('#' + navText + ' + section > h3').each(function() {
      var subtitle = $(this).text();
      $(this).attr('id', subtitle);
      var eleSubNav = $('<a class="list-group-item list-group-item-action" href="#' + subtitle + '">' + subtitle + '</a>');
      eleSubNavs.append(eleSubNav);
    });
  });
}

$(function() {
  var navs = {
    Components: ['Buttons', 'Loading', 'Indicators', 'Input'],
  };

  setTimeout(function() {
    $('#pageLoading').remove();
  }, 1000);

  var eleMain = $('main');
  Object.keys(navs).forEach(function(key) {
    appendNav(key);
    var values = navs[key];
    var eleH2 = $('<h2 id="' + key + '">' + key + '</h2>');
    eleMain.append(eleH2);
    var eleH2Section = $('<section></section>');
    eleMain.append(eleH2Section);
    values.forEach(function(value) {
      axios.get(key + '/' + value + '.html').then(function(response) {
        var h3 = $('<h3 id="' + value + '">' + value + '</h3>');
        eleH2Section.append(h3);
        var eleContent = $('<section></section>');
        eleContent.html(response.data);
        eleH2Section.append(eleContent);

        var eleCode = $('<pre><code></code></pre>');
        var code = response.data.replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
        eleCode.html(code);
        eleH2Section.append(eleCode);
      });
    });
  });
});
