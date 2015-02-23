var fs = require('fs');
var page = require('webpage').create();
//TODO use sitemap.xml to get info from all catalogs 

var p = 1;
var url = 'http://auto.ru/cars/mazda/3/used/?output_type=list&sort%5Bset_date%5D=desc';

// Список user-agent
var useragent = [];
useragent.push('Opera/9.80 (Windows NT 6.0) Presto/2.12.388 Version/12.14');
useragent.push('Opera/9.80 (X11; Linux x86_64; U; fr) Presto/2.9.168 Version/11.50');
useragent.push('Mozilla/5.0 (iPad; CPU OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5355d Safari/8536.25');
useragent.push('Opera/12.02 (Android 4.1; Linux; Opera Mobi/ADR-1111101157; U; en-US) Presto/2.9.201 Version/12.02');
useragent.push('Mozilla/5.0 (Windows NT 6.1; WOW64; rv:23.0) Gecko/20130406 Firefox/23.0');


// Route "console.log()" calls from within the Page context to the main Phantom context (i.e. current "this")
page.onConsoleMessage = function(msg) {
    console.log(msg);
};
page.onError = function(msg, trace) {
    console.log(msg);
    trace.forEach(function(item) {
        console.log('  ', item.file, ':', item.line);
    });
};

page.settings.userAgent = useragent[Math.floor(Math.random() * useragent.length)];

pageCount = 0;

function parsePage(p) {
    if (p == 1) {
        lurl = url;
    } else {
        lurl = url + '&p=' + p;
    }
    page.open(lurl, function(status) {
        console.log(lurl + ' : ' + status);
        //page.render('test.png');
        if (status !== 'success') {
            console.log('Unable to connect to server');
        } else {
            html = '';
            html = page.evaluate(function() {
                var cars = '';
                $('.sales-list > tbody > tr').each(function(i, row) {
                    //titles += $(this).html() + '\n';
                    var $row = $(row);
                    cars += $row.data("sale_id") + ' ' + $row.find('td.sales-list-cell_images img').attr('src') + ' ' + $row.find('td.sales-list-cell_mark_id').text() + ' ' + $row.find('td.sales-list-cell_images img').attr('style').replace('border-color:', '') + ' ' + $row.find('td.sales-list-cell_price').text().replace('Р', '').trim() + ' ' + $row.find('td.sales-list-cell_year').text() + ' ' + $row.find('td.sales-list-cell_run').text() + ' ' + $row.find('td.sales-list-cell_engine').text() + ' ' + $row.find('td.sales-list-cell_poi_id').find('div.sales-list-region').text() + ' ' + $row.find('td.sales-list-cell_poi_id').find('span.sales-list-date').text() + '\n';
                });
                //$('span.b-pager-ctrl_next').hasClass('b-pager-ctrl_inactive') we are on the last page, if true
                //end = $('span.b-pager-ctrl_next').hasClass('b-pager-ctrl_inactive');
                if (pageCount === 0) {
                    pageCount = $('div.b-pager-links > span').length;
                    console.log('Found ' + pageCount + ' pages...');
                }
                return cars;
                //return $('span.b-pager-ctrl_next').hasClass('b-pager-ctrl_active');
            });



        }
    });
};

//main
//console.log('hi');
do {
    console.log('parsing page ' + p);
    parsePage(p)
    p -= 1;
}
while (pageCount >= 1);

console.log('end');
phantom.exit();
