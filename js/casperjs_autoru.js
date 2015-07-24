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
var baseURL = 'http://auto.ru/cars/'+system.args[4]+'/used/?sort%5Bset_date%5D=desc&output_type=list';

var postContent;
var models = [];
var links = []

casper.on('remote.message', function(message) {
    this.echo('remote console message: ' + message);
});


// Capture links
capture_links = function() {
    //links.push(baseURL);
    casper.each(models, function(self, link){
        self.thenOpen(link, function(){
            pages = this.evaluate(function() {
                var totalItems = $('li.tabs-v4-i_active sup.tabs-v4-l_counter').text();
                var itemsOnPage = $('.sales-list tbody tr').length;
                var title = $('.seo-title').text();
                var c = $('#sale-data-attributes').data('model');
                return {
                    'items': totalItems,
                    'pages': Math.ceil(totalItems / itemsOnPage),
                    'title': title,
                    'car' : c
                };
            });
            this.echo(pages['car']);
            this.echo(pages['items'] + " items on " + pages['pages'] + " pages found");
            var l = []
            numberOfPages = pages['pages']
            for (var k = 1; k <= numberOfPages; k++) {
                l.push(link+'&p='+k );
            };
            this.echo(l)
            links.concat(l)
        })

    
    })

this.echo(links);
//this.then(selectLink);
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
    this.echo('writing to ' + filename);
    fs.write(filename, postContent, 'a');
 
    currentLink++;
    this.then(selectLink);
};


casper.start(baseURL, function() {
    this.echo('Start URL ' + baseURL)
    pages = this.evaluate(function() {
        var l = [];
        //grab all model's urls from vendor page with active ads
        $(".fast-mmm-list .fast-mmm-item").filter(function(index) {
                return $("sup", this).length === 1;
            }).find("a").each(function(i, s) {
                this.echo(s.href)
                l.push(s.href);
            })
            //this.echo(pages)
        return l;
    });

    models = pages;
});

//casper.then(capture_links);

casper.run();


