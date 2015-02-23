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
        console.log('page ' + currentPage + ': ' + $('span.b-pager-ctrl_next').hasClass('b-pager-ctrl_inactive'));
        if ($('span.b-pager-ctrl_next').hasClass('b-pager-ctrl_inactive')) {
            console.log('One more page ' + nextPageLink);
            $("span.b-pager-ctrl_next a")[0].click();
        } else {
            console.log('On the last page...');
            //phantom.state='stop';
            lastPage = true;
        }
        //console.log('Going to page '+currentPage+1+'...');
        //return true;
        //parseResults();
    });
    //page.render('phantomjs-searching.png');
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

//page.settings.userAgent = useragent[Math.floor(Math.random() * useragent.length)];


parseResultsRec = function() {
    console.log('Parsing results...');
    if (!lastPage) {
        page.evaluate(function() {
            var cars = '';
            $('.sales-list > tbody > tr').each(function(i, row) {
                var $row = $(row);
                cars += $row.data("sale_id") + ' ' + $row.find('td.sales-list-cell_images img').attr('src') + ' ' + $row.find('td.sales-list-cell_mark_id').text() + ' ' + $row.find('td.sales-list-cell_images img').attr('style').replace('border-color:', '') + ' ' + $row.find('td.sales-list-cell_price').text().replace('Р', '').trim() + ' ' + $row.find('td.sales-list-cell_year').text() + ' ' + $row.find('td.sales-list-cell_run').text() + ' ' + $row.find('td.sales-list-cell_engine').text() + ' ' + $row.find('td.sales-list-cell_poi_id').find('div.sales-list-region').text() + ' ' + $row.find('td.sales-list-cell_poi_id').find('span.sales-list-date').text() + '\n';
            });
            console.log(cars);
            //return true;
        });
        goNextPage();
    } else {
        //goNextPage;
        //parseResultsRec();
        console.log('parsing finished');
    }

    //page.render('phantomjs-results.png');
};

fillQuery = function() {
  console.log(Date()+"STEP 2: Type text");
    page.evaluate(function() {
        $('input#text').val('angularjs');
    })
}

clickButton = function() {
  console.log(Date()+"STEP 3: click on button");
  
        page.evaluate(function() {
          /*
        var ev = document.createEvent("MouseEvents");
        ev.initEvent("click", true, true);
        document.querySelector("button").dispatchEvent(ev);
        */
        $("button").click(0);
        console.log(page.frameUrl);
    });

}

setTimeout(function() {
   console.log(Date()+"STEP 1: Open page");
    page.open('http://ya.ru', function(status) {
        if (status === 'success') {
            page.render('1st_page.png');
        } else {
            console.log('Connection failed.');
            phantom.exit();
        }
        //phantom.exit(1);
    })
}, 0);

setTimeout(function() {
    fillQuery();
    page.render('filled_text.png');
}, 2000);

setTimeout(function() {
    clickButton();
    page.render('yandex_results.png');
}, 4000);
