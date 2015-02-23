var page, doSearch, displayResults, saveResults;
page = require('webpage').create();
fs = require('fs');


lastPage = false;
parseResults = function() {
    console.log('Parsing results...');
    page.evaluate(function() {
        var cars = '';
                $('.sales-list > tbody > tr').each(function(i, row) {
                    var $row = $(row);
                    cars += $row.data("sale_id") + ' ' + $row.find('td.sales-list-cell_images img').attr('src') + ' ' + $row.find('td.sales-list-cell_mark_id').text() + ' ' + $row.find('td.sales-list-cell_images img').attr('style').replace('border-color:', '') + ' ' + $row.find('td.sales-list-cell_price').text().replace('Р', '').trim() + ' ' + $row.find('td.sales-list-cell_year').text() + ' ' + $row.find('td.sales-list-cell_run').text() + ' ' + $row.find('td.sales-list-cell_engine').text() + ' ' + $row.find('td.sales-list-cell_poi_id').find('div.sales-list-region').text() + ' ' + $row.find('td.sales-list-cell_poi_id').find('span.sales-list-date').text() + '\n';
                });
        console.log(cars);
        return true;
    });
    //page.render('phantomjs-results.png');
};
saveResults = function() {
    console.log('Saving results to csv...');
    page.evaluate(function() {
            var cars = '';
                $('.sales-list > tbody > tr').each(function(i, row) {
                    var $row = $(row);
                    cars += $row.data("sale_id") + ' ' + $row.find('td.sales-list-cell_images img').attr('src') + ' ' + $row.find('td.sales-list-cell_mark_id').text() + ' ' + $row.find('td.sales-list-cell_images img').attr('style').replace('border-color:', '') + ' ' + $row.find('td.sales-list-cell_price').text().replace('Р', '').trim() + ' ' + $row.find('td.sales-list-cell_year').text() + ' ' + $row.find('td.sales-list-cell_run').text() + ' ' + $row.find('td.sales-list-cell_engine').text() + ' ' + $row.find('td.sales-list-cell_poi_id').find('div.sales-list-region').text() + ' ' + $row.find('td.sales-list-cell_poi_id').find('span.sales-list-date').text() + '\n';
                });
            // Пишем в файл
            var file = fs.open('used_mazda_3.txt', "a+");
            file.write(cars + '\n');
            file.close();
        return true;
    });
    //page.render('phantomjs-results.png');
};

goNextPage = function() {
    
    page.evaluate(function() {
       var nextPageLink = $('span.b-pager-ctrl_next a')[0];
       var currentPage = $('span.b-pager-link_active').text();
       console.log('page '+currentPage+': '+$('span.b-pager-ctrl_next').hasClass('b-pager-ctrl_inactive'));
       if ($('span.b-pager-ctrl_next').hasClass('b-pager-ctrl_inactive')){
            console.log('One more page '+nextPageLink);
            $("span.b-pager-ctrl_next a")[0].click();
       } else {
        console.log('On the last page...');
        //phantom.state='stop';
        lastPage = true;
       }
       //console.log('Going to page '+currentPage+1+'...');
        return true;
    });
    //page.render('phantomjs-searching.png');
};
/*
page.onLoadFinished = function(status) {
    if (status === 'success') {
        //page.includeJs('http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js', function() {
            if (!phantom.state) {
                //parseResults()
                goNextPage();
                phantom.state = 'results';
            } else {
                //displayResults();
                //parseResults();
                //saveResults();
                console.log('Done!');
                phantom.exit();
            }
        //});
    } else {
        console.log('Connection failed.');
        phantom.exit();
    }
};
*/

page.onUrlChanged = function(targetUrl) {
  console.log('New URL: ' + targetUrl);
  /*
  if (phantom.state !== 'stop' ) {
    goNextPage();
  } else {
    phantom.exit();
    console.log('finished');
  }
  */
};


var useragent = [];
useragent.push('Opera/9.80 (Windows NT 6.0) Presto/2.12.388 Version/12.14');
useragent.push('Opera/9.80 (X11; Linux x86_64; U; fr) Presto/2.9.168 Version/11.50');
useragent.push('Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25');
//useragent.push('Opera/12.02 (Android 4.1; Linux; Opera Mobi/ADR-1111101157; U; en-US) Presto/2.9.201 Version/12.02');
useragent.push('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:23.0) Gecko/20130406 Firefox/23.0');


// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};

/*
page.onError = function(msg, trace) {
    console.log(msg);
    trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
    });
};
*/
/*
page.onNavigationRequested = function(url, type, willNavigate, main) {
  console.log('Trying to navigate to: ' + url);
  console.log('Caused by: ' + type);
  console.log('Will actually navigate: ' + willNavigate);
  console.log('Sent from the page\'s main frame: ' + main);
};
*/
page.onLoadStarted = function() {
  var currentUrl = page.evaluate(function() {
    return window.location.href;
  });
  console.log('Current page ' + currentUrl + ' will gone...');
  console.log('Now loading a new page...');
};
page.settings.userAgent = useragent[Math.floor(Math.random() * useragent.length)];

page.open('http://auto.ru/cars/mazda/cx-7/group-offroad_5d/all/?search%5Bsection_id%5D=0&search%5Bmark%5D%5B0%5D=166&search%5Bmark-folder%5D%5B0%5D=166-4445&search%5Bprice%5D%5Bmin%5D=&search%5Bprice%5D%5Bmax%5D=&search%5Byear%5D%5Bmin%5D=&search%5Byear%5D%5Bmax%5D=&search%5Bseller%5D=0&search%5Bavailability%5D=&search%5Brun%5D%5Bmin%5D=&search%5Brun%5D%5Bmax%5D=&search%5Bstate%5D=1&search%5Bperiod%5D=0&search%5Bengine_volume%5D%5Bmin%5D=&search%5Bengine_volume%5D%5Bmax%5D=&search%5Bengine_power%5D%5Bmin%5D=&search%5Bengine_power%5D%5Bmax%5D=&search%5Bgeo_region%5D=&search%5Bgeo_city%5D=&search%5Bgeo_country%5D=&search%5Bgeo_similar_cities%5D=&search%5Bacceleration%5D%5Bmin%5D=&search%5Bacceleration%5D%5Bmax%5D=&search%5Bwheel%5D=&search%5Bowners_number%5D=&search%5Bcustom%5D=1&search%5Bexchange%5D=0&search%5Bsalon_id%5D=&search%5Bextras%5D%5B33%5D=&search%5Bextras%5D%5B23%5D=&search%5Bextras%5D%5B39%5D=&search%5Bextras%5D%5B43%5D=&search%5Bextras%5D%5B46%5D=&search%5Bextras%5D%5B300%5D=&search%5Bextras%5D%5B49%5D=&search%5Bseats%5D=&sort%5Bset_date%5D=desc&show_sales=1#sales-list',function(status){
    if (status === 'success') {
        if (!lastPage) {
                //parseResults()
                console.log('parsing first page');
                goNextPage();
                phantom.state = 'results';
            } else if (lastPage){
                //displayResults();
                //parseResults();
                //saveResults();
                console.log('Done!');
                phantom.exit();
            }cp

            //console.log(phantom.state);

    } else {
        console.log('Connection failed.');
        phantom.exit();
    }
});


