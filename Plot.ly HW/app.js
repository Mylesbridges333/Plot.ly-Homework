
function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  d3.json("/metadata/" + sample).then(function(response){

    console.log(response);
    var metadata = response;

    
    var panel = d3.select("#sample-metadata");

   
    panel.html("");

    
    Object.entries(metadata).forEach( ([key, value]) => panel.append('p').append('small').text(key + ": " + value));

  });
}

function buildCharts(sample) {

  d3.json('samples/' + sample).then(function(response) {

     
    var sampleData = response;

    var trace1 = {
      x: sampleData.otu_ids,
      y: sampleData.sample_values,
      mode: 'markers',
      marker: {
        size: sampleData.sample_values,
        color: sampleData.otu_ids,
        colorscale: 'Earth',
        type: 'heatmap'
      },
      text: sampleData.otu_labels
    };

    var data = [trace1];

    var layout = {
      title: "<b>Bubble Chart of Belly Button Bacteria</b><br>(All Bacteria)",
      showlegend: false,
      xaxis: {
        title: "OTU ID"
      },
      yaxis: {
        title: "Sample Value"
      }
    };

    Plotly.newPlot('bubble', data, layout);

    var list = [];
    for (var i = 0; i < sampleData.otu_ids.length; i++) {
        
        list.push({'otu_ids': sampleData.otu_ids[i], 'otu_labels': sampleData.otu_labels[i], 'sample_values': sampleData.sample_values[i]});
    }

    console.log(list.sort((a, b) => parseInt(b.sample_values) - parseInt(a.sample_values)));

    var trace2 = {
      x: list.slice(0,10).map(record => record.sample_values),
      y: list.slice(0,10).map(record => "OTU" + record.otu_ids.toString()),
      hovertext: list.slice(0,10).map(record => "(" + record.otu_ids + ", " + record.otu_labels + ")"),
      type: "bar",
      orientation: "h"
    };

    var data = [trace2];

    var layout = {
      height: 500,
      width: 500
    };

    Plotly.newPlot("bar", data, layout);
  });
}

function init() {
 
  var selector = d3.select("#selDataset");

 
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text("BB_" + sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
 
  buildCharts(newSample);
  buildMetadata(newSample);
}


init();
