
var system = require('system');
var args = system.args; 
var casper = require('casper').create({
    verbose: false,
    logLevel: 'info',
    pageSettings: {
      loadImages: false,
      loadPlugins: false
    }
  });


var numberOfPages = 0;
var currentLink = 0;
var links = [];
var parsedItems = '';
var buildPage, capture, selectLink, grabContent, writeContent;
var fs = require('fs');
var filename = 'data/'+system.args[4]+'/'+'test.csv';
var baseURL = 'http://auto.ru/cars/'+system.args[4]+'/used/?sort%5Bset_date%5D=desc';

var postContent;
var models = [];
var links = {}

casper.on('remote.message', function(message) {
    this.echo('remote console message: ' + message);
});

    casper.start(baseURL, function() {
        console.log(baseURL)
        pages = this.evaluate(function() {
            var l = [];

            //grab all model's urls from vendor page
            $(".showcase-modify-title-link").each(function(i, s) {
                //console.log(s+' '+i);
                l.push(s.href);
            })
            //this.echo(pages)
            return l;
        });

            models = pages;
    });


// Capture links
capture = function() {
    //links.push(baseURL);
    for (var i = 0; i <= models.length-1; i++) {
        //this.echo('Opening '+models[i])
        casper.open(models[i]).then(function() {
            pages = this.evaluate(function() {
                var totalItems = $('li.tabs-v4-i_active sup.tabs-v4-l_counter').text();
                var itemsOnPage = $('.sales-list tbody tr').length;
                var title = $('.seo-title').text();
                var c = $('.mmm-folder option:selected').text();
                return {
                    'items': totalItems,
                    'pages': Math.ceil(totalItems / itemsOnPage),
                    'title': title,
                    'car' : c
                };

            });
            //this.echo(pages['title']);
            //this.echo(pages['items'] + " items on " + pages['pages'] + " pages found");
            numberOfPages = pages['pages'];
            //links.push(baseURL);
            var l = []
            var n 
            n = pages['car']
            for (var i = 1; i <= numberOfPages; i++) {
                l.push(models[i]+'&p='+i );
            };
            //this.echo(n);
            models.n = l;


        })
    }

//this.echo(links);
this.then(selectLink);
};



selectLink = function() {
    this.log(models);
    if (currentLink < numberOfPages) {
        this.then(grabContent);
    } else {
        console.log('finish');
    }
};


grabContent = function() {
    casper.open(links[currentLink]).then(function() {

        
        

        postContent = this.evaluate(function() {
        	var clist = [];
        	var delimeter = " | ";
            var cars = 'sale_id' + delimeter
                     + 'preview' + delimeter
                     + 'mark_id' + delimeter
                     + 'color' + delimeter
                     + 'price' + delimeter
                     + 'year' + delimeter
                     + 'run' + delimeter
                     + 'engine' + delimeter
                     + 'region' + delimeter
                     + 'date' + '\n';

             $('.sales-list > tbody > tr').each(function(i, row) {
             		
                    var $row = $(row);
                    cars += $row.data("sale_id") 
                        + delimeter + $row.find('td.sales-list-cell_images img').attr('src') 
                        + delimeter + $row.find('td.sales-list-cell_mark_id').text() 
                        + delimeter + $row.find('td.sales-list-cell_images img').attr('style').replace('border-color:', '') 
                        + delimeter + $row.find('td.sales-list-cell_price').text().replace('Р', '').trim()
                        + delimeter + $row.find('td.sales-list-cell_year').text()
                        + delimeter + $row.find('td.sales-list-cell_run').text()
                        + delimeter + $row.find('td.sales-list-cell_engine').text() 
                        + delimeter + $row.find('td.sales-list-cell_poi_id').find('div.sales-list-region').text() 
                        + delimeter + $row.find('td.sales-list-cell_poi_id').find('span.sales-list-date').text() + '\n';
                });
             //console.log(cars)
             return cars
            //return typeof $('.sales-list > tbody > tr').data("sale_id");
            
           
        });
        
        this.echo( 'processing page ' + parseInt(currentLink+1) + ' out of ' + numberOfPages + ' : '+links[currentLink] );
        //this.echo(c + ' items parsed');
        
        //this.echo(postContent);

        //pageXML += postContent;
    });
    //console.log(links[currentLink]); 
    this.then(buildPage);
};
 
buildPage = function() {
    //this.echo('writing to ' + filename);
    fs.write(filename, postContent, 'a');
 
    currentLink++;
    this.then(selectLink);
};

casper.then(capture);

casper.run();