(function () {
    
	// myConnector: constructor that predefines some methods for our connector object.
    var myConnector = tableau.makeConnector();

    

    // getSchema: function for getting the table schema
    myConnector.getSchema = function (schemaCallback) {

    	var cols = [
	        { id : "mag", alias : "magnitude", dataType : tableau.dataTypeEnum.float },
	        { id : "title", alias : "title", dataType : tableau.dataTypeEnum.string },
	        { id : "url", alias : "url", dataType : tableau.dataTypeEnum.string },
	        { id : "lat", alias : "latitude", columnRole: "dimension", dataType : tableau.dataTypeEnum.float },
	        { id : "lon", alias : "longitude",columnRole: "dimension", dataType : tableau.dataTypeEnum.float }
	    ];

	    var tableInfo = {
	        id : "earthquakeFeed",
	        alias : "Earthquakes with magnitude greater than 4.5 in the last seven days",
	        columns : cols
	    };

	    schemaCallback([tableInfo]);

    };

    // getData: function for downloading the data
    myConnector.getData = function (table, doneCallback) {

    	$.getJSON("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson", function(resp) {
    		var feat = resp.features,
    			tableData = [];

        // Iterate over the JSON object
        for (var i = 0, len = feat.length; i < len; i++) {
            tableData.push({
                "id": feat[i].id,
                "mag": feat[i].properties.mag,
                "title": feat[i].properties.title,
                "lon": feat[i].geometry.coordinates[0],
                "lat": feat[i].geometry.coordinates[1]
            });
        }

        table.appendRows(tableData);
        doneCallback();
    	});
    };

    // Function validates the connector object before initialization
    tableau.registerConnector(myConnector);

    // jquery function runs some code when the page loads
    $(document).ready(function () {

    // Add a click event listener to the button element identified by the submitButton id
    $("#submitButton").click(function () {

    	// Assign variable that defines name of the connector data source when it is displayed in Tableau
        tableau.connectionName = "USGS Earthquake Feed";

        // Sends the connector object to Tableau for validation
        tableau.submit();
    });
	});




})();