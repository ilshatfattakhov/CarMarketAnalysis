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
var filename = 'volkswagen_polo.csv'
var baseURL = 'http://auto.ru/cars/volkswagen/polo/used/?sort%5Bset_date%5D=desc';
var postContent;

/*
casper.on('remote.message', function(message) {
    this.echo('remote console message: ' + message);
});
*/
casper.start(baseURL, function() {
    pages= this.evaluate(function() {
        var totalItems = $('li.tabs-v4-i_active sup.tabs-v4-l_counter').text();
    	var itemsOnPage = $('.sales-list tbody tr').length;
        var title = $('.seo-title').text();
    	return {'items': totalItems, 'pages' : Math.ceil(totalItems / itemsOnPage), 'title':title};
         
    });
    this.echo(pages['title']);
    this.echo(pages['items']+" items on "+ pages['pages'] + " pages found");
    numberOfPages = pages['pages'];
    // cause jquery makes it easier
    //casper.page.injectJs('/PATH/TO/jquery.js');
});

 
// Capture links
capture = function() {

        //links.push(baseURL);
        for (var i = 1; i <= numberOfPages; i++) {
        	links.push(baseURL+'&p='+i );
        };

    //this.echo(links);
    this.then(selectLink);
};


selectLink = function() {
    if (currentLink < numberOfPages) {
        this.then(grabContent);
    } else {
        console.log('finish');
    }
};


grabContent = function() {
    casper.open(links[currentLink]).then(function() {

        
        

        postContent = this.evaluate(function() {
        	var cars = '';
        	var clist = [];
        	var delimeter = " | ";
             $('.sales-list > tbody > tr').each(function(i, row) {
             		
                    var $row = $(row);
                    cars += $row.data("sale_id") + delimeter + $row.find('td.sales-list-cell_images img').attr('src') + delimeter + $row.find('td.sales-list-cell_mark_id').text() + delimeter + $row.find('td.sales-list-cell_images img').attr('style').replace('border-color:', '') + delimeter + $row.find('td.sales-list-cell_price').text().replace('Р', '').trim() + delimeter + $row.find('td.sales-list-cell_year').text() + delimeter + $row.find('td.sales-list-cell_run').text() + delimeter + $row.find('td.sales-list-cell_engine').text() + delimeter + $row.find('td.sales-list-cell_poi_id').find('div.sales-list-region').text() + delimeter + $row.find('td.sales-list-cell_poi_id').find('span.sales-list-date').text() + '\n';
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